import { create } from 'zustand';
import {
  LayerType,
  ObservationDate,
  MetadataResponse,
  ModelInfoResponse,
  ZonalStatisticsResponse,
  HotspotStatisticsResponse,
  PersistenceStatisticsResponse,
  GiStarStatisticsResponse
} from '../types';
import { OBSERVATION_DATES } from '../config/constants';
import { api } from '../services/api';

interface AppState {
  // UI State
  selectedDate: string;
  activeLayer: LayerType;
  layerOpacity: number;
  showAOIBoundary: boolean;
  activeTab: 'overview' | 'thermal' | 'ml' | 'environment' | 'persistence' | 'clusters' | 'methodology';
  hoveredCoordinates: { lat: number; lng: number } | null;
  isMethodologyModalOpen: boolean;

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

  // UI Actions
  setSelectedDate: (date: string) => void;
  setActiveLayer: (layer: LayerType) => void;
  setLayerOpacity: (opacity: number) => void;
  setShowAOIBoundary: (show: boolean) => void;
  setActiveTab: (tab: AppState['activeTab']) => void;
  setHoveredCoordinates: (coords: { lat: number; lng: number } | null) => void;
  setIsMethodologyModalOpen: (open: boolean) => void;

  // Integration Actions
  fetchInitialData: () => Promise<void>;
  fetchLayerStats: () => Promise<void>;
}

export const useAppStore = create<AppState>((set, get) => ({
  // UI Defaults
  selectedDate: OBSERVATION_DATES[0].date,
  activeLayer: 'rf_prob',
  layerOpacity: 0.85,
  showAOIBoundary: true,
  activeTab: 'overview',
  hoveredCoordinates: null,
  isMethodologyModalOpen: false,

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

  // Setters
  setSelectedDate: (date) => {
    set({ selectedDate: date });
    get().fetchLayerStats();
  },
  setActiveLayer: (layer) => {
    set({ activeLayer: layer });
    get().fetchLayerStats();
  },
  setLayerOpacity: (opacity) => set({ layerOpacity: opacity }),
  setShowAOIBoundary: (show) => set({ showAOIBoundary: show }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setHoveredCoordinates: (coords) => set({ hoveredCoordinates: coords }),
  setIsMethodologyModalOpen: (open) => set({ isMethodologyModalOpen: open }),

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
      });

      // After initial metadata loads, fetch initial layer statistics
      await get().fetchLayerStats();
    } catch (err: any) {
      console.warn("Backend API unavailable. Application operating in disconnected state.", err);
      set({
        backendConnected: false,
        isLoadingMetadata: false,
        apiError: "Backend API offline or unreachable (http://localhost:8000/api/v1). Ensure FastAPI server is running.",
      });
    }
  },

  // Fetch dynamic zonal, hotspot, persistence, and Gi* statistics for selected date/layer
  fetchLayerStats: async () => {
    const { activeLayer, selectedDate, backendConnected } = get();
    if (!backendConnected) return;

    set({ isLoadingStats: true });
    try {
      // Fetch zonal stats for current layer
      const isDateDependent = ['lst', 'ndvi', 'ndbi', 'rf_prob', 'rf_class'].includes(activeLayer);
      const targetDate = isDateDependent ? selectedDate : undefined;

      const zonalPromise = api.getZonalStats(activeLayer, targetDate).catch(() => null);

      // Fetch specific statistics based on layer type
      let hotspotPromise = Promise.resolve(null as HotspotStatisticsResponse | null);
      if (['rf_prob', 'rf_class', 'lst'].includes(activeLayer)) {
        hotspotPromise = api.getHotspotStats(selectedDate).catch(() => null);
      }

      let persistencePromise = Promise.resolve(null as PersistenceStatisticsResponse | null);
      if (activeLayer === 'persistence' || !get().persistenceStats) {
        persistencePromise = api.getPersistenceStats().catch(() => null);
      }

      let giStarPromise = Promise.resolve(null as GiStarStatisticsResponse | null);
      if (activeLayer === 'gi_star' || !get().giStarStats) {
        giStarPromise = api.getGiStarStats().catch(() => null);
      }

      const [zonalRes, hotspotRes, persistenceRes, giStarRes] = await Promise.all([
        zonalPromise,
        hotspotPromise,
        persistencePromise,
        giStarPromise,
      ]);

      set((state) => ({
        zonalStats: zonalRes || state.zonalStats,
        hotspotStats: hotspotRes || state.hotspotStats,
        persistenceStats: persistenceRes || state.persistenceStats,
        giStarStats: giStarRes || state.giStarStats,
        isLoadingStats: false,
      }));
    } catch (err) {
      console.error("Error fetching statistics from backend:", err);
      set({ isLoadingStats: false });
    }
  },
}));
