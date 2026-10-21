import { create } from 'zustand';
import {
  LayerType,
  ObservationDate,
  MetadataResponse,
  ModelInfoResponse,
  ZonalStatisticsResponse,
  HotspotStatisticsResponse,
  PersistenceStatisticsResponse,
  GiStarStatisticsResponse,
  ToastMessage
} from '../types';
import { OBSERVATION_DATES } from '../config/constants';
import { api, ApiError } from '../services/api';

interface AppState {
  // UI State
  selectedDate: string;
  activeLayer: LayerType;
  layerOpacity: number;
  showAOIBoundary: boolean;
  activeTab: 'overview' | 'thermal' | 'ml' | 'environment' | 'persistence' | 'clusters' | 'methodology';
  hoveredCoordinates: { lat: number; lng: number } | null;
  selectedLocation: { lat: number; lng: number } | null;
  isMethodologyModalOpen: boolean;
  isSidebarOpen: boolean;
  isAnalyticsOpen: boolean;

  // Toast Notification System
  toasts: ToastMessage[];

  // Backend Integration State
  backendConnected: boolean;
  isLoadingMetadata: boolean;
  isLoadingStats: boolean;
  apiError: string | null;

  // API Data Products
  metadata: MetadataResponse | null;
  dates: ObservationDate[];
  modelInfo: ModelInfoResponse | null;
  zonalStats: ZonalStatisticsResponse | null;
  hotspotStats: HotspotStatisticsResponse | null;
  persistenceStats: PersistenceStatisticsResponse | null;
  giStarStats: GiStarStatisticsResponse | null;

  // UI & Toast Actions
  setSelectedDate: (date: string) => void;
  setActiveLayer: (layer: LayerType) => void;
  setLayerOpacity: (opacity: number) => void;
  setShowAOIBoundary: (show: boolean) => void;
  setActiveTab: (tab: AppState['activeTab']) => void;
  setHoveredCoordinates: (coords: { lat: number; lng: number } | null) => void;
  setSelectedLocation: (coords: { lat: number; lng: number } | null) => void;
  setIsMethodologyModalOpen: (open: boolean) => void;
  setIsSidebarOpen: (open: boolean) => void;
  setIsAnalyticsOpen: (open: boolean) => void;
  toggleSidebar: () => void;
  toggleAnalytics: () => void;
  addToast: (toast: Omit<ToastMessage, 'id'>) => void;
  removeToast: (id: string) => void;

  // Integration & Recovery Actions
  fetchInitialData: () => Promise<void>;
  fetchLayerStats: () => Promise<void>;
  checkServerRecovery: () => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  // UI Defaults
  selectedDate: OBSERVATION_DATES[0].date,
  activeLayer: 'lst',
  layerOpacity: 0.85,
  showAOIBoundary: true,
  activeTab: 'overview',
  hoveredCoordinates: null,
  selectedLocation: null,
  isMethodologyModalOpen: false,
  isSidebarOpen: typeof window !== 'undefined' ? window.innerWidth >= 1024 : true,
  isAnalyticsOpen: typeof window !== 'undefined' ? window.innerWidth >= 1280 : true,

  // Toast Queue
  toasts: [],

  // Backend Defaults
  backendConnected: false,
  isLoadingMetadata: false,
  isLoadingStats: false,
  apiError: null,

  metadata: null,
  dates: OBSERVATION_DATES,
  modelInfo: null,
  zonalStats: null,
  hotspotStats: null,
  persistenceStats: null,
  giStarStats: null,

  // Toast Actions
  addToast: (toast) => {
    // Avoid spamming duplicate toast notifications
    const currentToasts = get().toasts;
    const isDuplicate = currentToasts.some(
      (t) => t.title === toast.title && t.message === toast.message
    );
    if (isDuplicate) return;

    const id = Math.random().toString(36).substring(2, 9);
    const newToast: ToastMessage = { id, duration: 5000, ...toast };
    set((state) => ({ toasts: [...state.toasts, newToast] }));

    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        get().removeToast(id);
      }, newToast.duration);
    }
  },

  removeToast: (id) => {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
  },

  // Setters
  setSelectedDate: (date) => {
    set({ selectedDate: date });
    get().fetchLayerStats();
  },
  setActiveLayer: (layer) => {
    const currentTab = get().activeTab;
    let targetTab = currentTab;

    switch (layer) {
      case 'lst':
        if (targetTab !== 'overview') {
          targetTab = 'thermal';
        }
        break;
      case 'rf_prob':
      case 'rf_class':
        targetTab = 'ml';
        break;
      case 'ndvi':
      case 'ndbi':
        targetTab = 'environment';
        break;
      case 'persistence':
        targetTab = 'persistence';
        break;
      case 'gi_star':
        targetTab = 'clusters';
        break;
    }

    set({ activeLayer: layer, activeTab: targetTab });
    get().fetchLayerStats();
  },
  setLayerOpacity: (opacity) => set({ layerOpacity: opacity }),
  setShowAOIBoundary: (show) => set({ showAOIBoundary: show }),
  setActiveTab: (tab) => {
    if (tab === 'methodology') {
      set({ isMethodologyModalOpen: true });
      return;
    }

    const currentLayer = get().activeLayer;
    let targetLayer: LayerType = currentLayer;

    switch (tab) {
      case 'overview':
        targetLayer = 'lst';
        break;
      case 'thermal':
        targetLayer = 'lst';
        break;
      case 'ml':
        targetLayer = currentLayer === 'rf_class' ? 'rf_class' : 'rf_prob';
        break;
      case 'environment':
        targetLayer = currentLayer === 'ndbi' ? 'ndbi' : 'ndvi';
        break;
      case 'persistence':
        targetLayer = 'persistence';
        break;
      case 'clusters':
        targetLayer = 'gi_star';
        break;
    }

    set({ activeTab: tab, activeLayer: targetLayer });
    get().fetchLayerStats();
  },
  setHoveredCoordinates: (coords) => set({ hoveredCoordinates: coords }),
  setSelectedLocation: (coords) => set({ selectedLocation: coords }),
  setIsMethodologyModalOpen: (open) => set({ isMethodologyModalOpen: open }),
  setIsSidebarOpen: (open) => set({ isSidebarOpen: open }),
  setIsAnalyticsOpen: (open) => set({ isAnalyticsOpen: open }),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  toggleAnalytics: () => set((state) => ({ isAnalyticsOpen: !state.isAnalyticsOpen })),

  // Fetch initial project metadata, dates, and locked model specs
  fetchInitialData: async () => {
    set({ isLoadingMetadata: true, apiError: null });
    try {
      const [metadataRes, datesRes, modelRes] = await Promise.all([
        api.getMetadata(),
        api.getDates(),
        api.getModelInfo(),
      ]);

      set({
        metadata: metadataRes,
        dates: datesRes.dates,
        modelInfo: modelRes,
        backendConnected: true,
        isLoadingMetadata: false,
        apiError: null,
      });

      // Fetch layer stats after initial metadata
      await get().fetchLayerStats();
    } catch (err: any) {
      const userMessage = err instanceof ApiError ? err.userMessage : 'Analysis server is offline. Start the FastAPI backend to continue.';
      console.warn("Backend API unavailable. Application operating in disconnected state.", err);

      set({
        backendConnected: false,
        isLoadingMetadata: false,
        apiError: userMessage,
      });
    }
  },

  // Fetch dynamic zonal, hotspot, persistence, and Gi* statistics for selected date/layer
  fetchLayerStats: async () => {
    const { activeLayer, selectedDate, backendConnected, addToast } = get();
    if (!backendConnected) return;

    set({ isLoadingStats: true });
    try {
      const isDateDependent = ['lst', 'ndvi', 'ndbi', 'rf_prob', 'rf_class'].includes(activeLayer);
      const targetDate = isDateDependent ? selectedDate : undefined;

      const zonalPromise = api.getZonalStats(activeLayer, targetDate).catch((err) => {
        console.warn("Failed to fetch zonal stats:", err);
        return null;
      });

      let hotspotPromise = Promise.resolve(null as HotspotStatisticsResponse | null);
      if (['rf_prob', 'rf_class', 'lst'].includes(activeLayer)) {
        hotspotPromise = api.getHotspotStats(selectedDate).catch((err) => {
          console.warn("Failed to fetch hotspot stats:", err);
          return null;
        });
      }

      let persistencePromise = Promise.resolve(null as PersistenceStatisticsResponse | null);
      if (activeLayer === 'persistence' || !get().persistenceStats) {
        persistencePromise = api.getPersistenceStats().catch((err) => {
          console.warn("Failed to fetch persistence stats:", err);
          return null;
        });
      }

      let giStarPromise = Promise.resolve(null as GiStarStatisticsResponse | null);
      if (activeLayer === 'gi_star' || !get().giStarStats) {
        giStarPromise = api.getGiStarStats().catch((err) => {
          console.warn("Failed to fetch Gi* stats:", err);
          return null;
        });
      }

      const [zonalRes, hotspotRes, persistenceRes, giStarRes] = await Promise.all([
        zonalPromise,
        hotspotPromise,
        persistencePromise,
        giStarPromise,
      ]);

      set((state) => ({
        zonalStats: zonalRes || (state.zonalStats?.layer === activeLayer ? state.zonalStats : null),
        hotspotStats: hotspotRes || state.hotspotStats,
        persistenceStats: persistenceRes || state.persistenceStats,
        giStarStats: giStarRes || state.giStarStats,
        isLoadingStats: false,
      }));
    } catch (err: any) {
      console.error("Error fetching statistics from backend:", err);
      const msg = err instanceof ApiError ? err.userMessage : "Unable to load statistics for the selected layer.";
      addToast({ type: 'error', title: 'Statistics Request Error', message: msg });
      set({ isLoadingStats: false });
    }
  },

  // Check if offline backend server has returned online and auto-recover
  checkServerRecovery: async () => {
    if (get().backendConnected) return;

    try {
      await api.checkHealth();
      // Server returned online! Re-fetch initial data & notify user
      await get().fetchInitialData();
      get().addToast({
        type: 'success',
        title: 'Backend Server Connected',
        message: 'Analysis server is online. Real satellite rasters and statistics connected.',
      });
    } catch (e) {
      // Still offline, will retry on next poll interval
    }
  },
}));
