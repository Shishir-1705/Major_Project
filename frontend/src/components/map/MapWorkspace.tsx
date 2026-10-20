import React from 'react';
import { MapContainer, TileLayer, Polygon, useMapEvents, useMap } from 'react-leaflet';
import { useAppStore } from '../../store/useAppStore';
import { MYSURU_CENTER, MYSURU_DEFAULT_ZOOM, MYSURU_AOI_BOUNDS, LAYERS } from '../../config/constants';
import { api } from '../../services/api';
import { MapLegend } from './MapLegend';
import { TimelineSlider } from '../controls/TimelineSlider';
import { Crosshair, Wifi, WifiOff, Globe } from 'lucide-react';

// Automatically invalidate Leaflet size when sidebars open/collapse, container resizes, or window resizes
const MapResizer: React.FC<{ isSidebarOpen?: boolean; isAnalyticsOpen?: boolean }> = ({ isSidebarOpen, isAnalyticsOpen }) => {
  const map = useMap();

  React.useEffect(() => {
    map.invalidateSize();
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 150);
    return () => clearTimeout(timer);
  }, [map, isSidebarOpen, isAnalyticsOpen]);

  React.useEffect(() => {
    const container = map.getContainer();
    if (!container || typeof ResizeObserver === 'undefined') {
      const handleResize = () => map.invalidateSize();
      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }

    let rafId: number | null = null;
    const observer = new ResizeObserver(() => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        map.invalidateSize();
      });
    });

    observer.observe(container);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, [map]);

  return null;
};

// Map Event Listener Component for Hover Coordinates
const MapEventHandler: React.FC = () => {
  const { setHoveredCoordinates } = useAppStore();
  
  useMapEvents({
    mousemove(e) {
      setHoveredCoordinates({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
    mouseout() {
      setHoveredCoordinates(null);
    }
  });

  return null;
};

export interface MapWorkspaceProps {
  showTimeline?: boolean;
  showLegend?: boolean;
  isSidebarOpen?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export const MapWorkspace: React.FC<MapWorkspaceProps> = ({
  showTimeline = true,
  showLegend = true,
  isSidebarOpen: isSidebarOpenProp,
  className = '',
  children
}) => {
  const {
    showAOIBoundary,
    hoveredCoordinates,
    activeLayer,
    selectedDate,
    layerOpacity,
    backendConnected,
    apiError,
    addToast,
    isSidebarOpen: storeIsSidebarOpen,
    isAnalyticsOpen
  } = useAppStore();

  const effectiveSidebarOpen = isSidebarOpenProp !== undefined ? isSidebarOpenProp : storeIsSidebarOpen;
  const currentLayerObj = LAYERS.find(l => l.id === activeLayer);

  const handleTileError = () => {
    // Non-blocking toast notification on tile loading error without crashing map
    addToast({
      type: 'warning',
      title: 'Map Layer Notice',
      message: `Map tile for ${currentLayerObj?.shortName || activeLayer} temporarily unavailable.`,
      duration: 4000,
    });
  };

  // Resolve tile date_or_key based on layer type
  const getDateOrKey = (): string => {
    if (activeLayer === 'persistence') return 'categorical';
    if (activeLayer === 'gi_star') return 'clustering';
    return selectedDate;
  };

  const dateOrKey = getDateOrKey();
  const tileUrlTemplate = api.getTileUrlTemplate(activeLayer, dateOrKey);

  const cartoApiKey = import.meta.env.VITE_CARTO_API_KEY;
  const cartoBasemapUrl = cartoApiKey
    ? `https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png?key=${cartoApiKey}&api_key=${cartoApiKey}`
    : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

  // Format scientifically accurate telemetry title
  const getTelemetryBadge = () => {
    switch (activeLayer) {
      case 'persistence':
        return (
          <span className="text-[#A8B5C9]">
            Spatial Product: <strong className="text-[#F5F7FB] uppercase font-bold">Heat Persistence</strong> (Multi-Temporal)
          </span>
        );
      case 'gi_star':
        return (
          <span className="text-[#A8B5C9]">
            Spatial Product: <strong className="text-[#F5F7FB] uppercase font-bold">Gi* Clusters</strong> (Spatial Statistics)
          </span>
        );
      case 'rf_prob':
        return (
          <span className="text-[#A8B5C9]">
            ML Prediction: <strong className="text-[#F5F7FB] uppercase font-bold">Hotspot Probability</strong> ({selectedDate})
          </span>
        );
      case 'rf_class':
        return (
          <span className="text-[#A8B5C9]">
            ML Prediction: <strong className="text-[#F5F7FB] uppercase font-bold">Hotspot Classification</strong> ({selectedDate})
          </span>
        );
      case 'ndvi':
        return (
          <span className="text-[#A8B5C9]">
            Spectral Index: <strong className="text-[#F5F7FB] uppercase font-bold">NDVI (Vegetation)</strong> ({selectedDate})
          </span>
        );
      case 'ndbi':
        return (
          <span className="text-[#A8B5C9]">
            Spectral Index: <strong className="text-[#F5F7FB] uppercase font-bold">NDBI (Built-up)</strong> ({selectedDate})
          </span>
        );
      case 'lst':
        return (
          <span className="text-[#A8B5C9]">
            Observation: <strong className="text-[#F5F7FB] uppercase font-bold">LST ST_B10</strong> ({selectedDate})
          </span>
        );
      default:
        return (
          <span className="text-[#A8B5C9]">
            Layer: <strong className="text-[#F5F7FB] uppercase font-bold">{currentLayerObj?.shortName || activeLayer}</strong> ({dateOrKey})
          </span>
        );
    }
  };

  return (
    <main className={`relative flex-1 h-full w-full bg-[#080D18] overflow-hidden select-none ${className}`}>
      <MapContainer
        center={MYSURU_CENTER}
        zoom={MYSURU_DEFAULT_ZOOM}
        className="h-full w-full"
        zoomControl={true}
      >
        {/* CARTO Voyager Road-Oriented Geographic Base Map with Authenticated Tile URL */}
        <TileLayer
          url={cartoBasemapUrl}
          attribution='&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          maxZoom={18}
        />

        {/* Dynamic FastAPI GeoTIFF Web Mercator Tile Layer */}
        {backendConnected && (
          <TileLayer
            key={`${activeLayer}-${dateOrKey}-${layerOpacity}`}
            url={tileUrlTemplate}
            opacity={layerOpacity}
            maxZoom={18}
            tileSize={256}
            eventHandlers={{
              tileerror: handleTileError,
            }}
          />
        )}

        {/* Mysuru AOI Polygon Boundary */}
        {showAOIBoundary && (
          <Polygon
            positions={MYSURU_AOI_BOUNDS}
            pathOptions={{
              color: '#19D3C5',
              weight: 2,
              dashArray: '5, 8',
              fillColor: '#19D3C5',
              fillOpacity: 0.05,
            }}
          />
        )}

        <MapEventHandler />
        <MapResizer isSidebarOpen={effectiveSidebarOpen} isAnalyticsOpen={isAnalyticsOpen} />
      </MapContainer>

      {/* Top-Left Hover Coordinates & Map Telemetry Badge */}
      {/* Offsets cleanly below toggle button when sidebar is collapsed (top-14), or top-3 when sidebar is open */}
      <div
        className={`absolute left-3 z-[1000] pointer-events-none hidden sm:flex flex-col space-y-1.5 transition-all duration-200 ${
          effectiveSidebarOpen ? 'top-3' : 'top-14'
        }`}
      >
        <div className="bg-[#080D18]/90 border border-[#26354A] backdrop-blur-md px-3 py-1.5 rounded-xl shadow-card flex items-center space-x-2 text-xs">
          <Crosshair className="w-3.5 h-3.5 text-[#19D3C5]" />
          <span className="text-[#8291A8] font-medium">Cursor:</span>
          {hoveredCoordinates ? (
            <span className="font-mono text-[#F5F7FB] font-bold">
              {hoveredCoordinates.lat.toFixed(5)}°N, {hoveredCoordinates.lng.toFixed(5)}°E
            </span>
          ) : (
            <span className="text-[#8291A8] italic">Hover map for coordinates</span>
          )}
        </div>

        <div className="bg-[#080D18]/90 border border-[#26354A] backdrop-blur-md px-3 py-1 rounded-xl shadow-card flex items-center space-x-2 text-[11px] font-mono text-[#A8B5C9]">
          <Globe className="w-3 h-3 text-[#8291A8]" />
          <span>CRS: <strong className="text-[#F5F7FB] font-bold">EPSG:32643 (UTM 43N)</strong></span>
        </div>
      </div>

      {/* Top-Right Active Telemetry & Backend Status Banner */}
      <div className="absolute top-3 right-3 z-[1000] pointer-events-none hidden sm:flex flex-col items-end space-y-1.5">
        {backendConnected ? (
          <div className="bg-[#080D18]/90 border border-[#26354A] text-[#19D3C5] backdrop-blur-md px-3 py-1.5 rounded-xl shadow-card text-xs font-medium flex items-center space-x-2">
            <Wifi className="w-3.5 h-3.5 text-[#19D3C5]" />
            {getTelemetryBadge()}
          </div>
        ) : (
          <div className="bg-[#080D18]/90 border border-amber-500/50 text-amber-300 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-card text-xs font-medium flex items-center space-x-2">
            <WifiOff className="w-3.5 h-3.5 text-amber-400" />
            <span>Backend Offline: Start FastAPI (`uvicorn backend.app.main:app`)</span>
          </div>
        )}
      </div>

      {/* API Error Toast Banner if connection fails */}
      {apiError && !backendConnected && (
        <div className="absolute top-14 right-3 z-[1000] max-w-sm pointer-events-auto">
          <div className="bg-[#080D18]/95 border border-red-500/50 text-red-200 backdrop-blur-md p-3 rounded-xl shadow-card text-xs space-y-1">
            <div className="font-bold text-red-400">Backend Server Unavailable</div>
            <p className="text-[11px] leading-tight text-red-300">{apiError}</p>
          </div>
        </div>
      )}

      {/* Custom Page Children Overlays */}
      {children}

      {/* Floating Timeline Control at Bottom Center */}
      {showTimeline && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000] max-w-[95vw]">
          <TimelineSlider />
        </div>
      )}

      {/* Floating Map Legend at Bottom Right */}
      {showLegend && (
        <div className="absolute bottom-4 right-4 z-[1000] hidden md:block">
          <MapLegend />
        </div>
      )}
    </main>
  );
};
