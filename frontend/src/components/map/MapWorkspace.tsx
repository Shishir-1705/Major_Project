import React from 'react';
import { MapContainer, TileLayer, Polygon, useMapEvents, useMap } from 'react-leaflet';
import { useAppStore } from '../../store/useAppStore';
import { MYSURU_CENTER, MYSURU_DEFAULT_ZOOM, MYSURU_AOI_BOUNDS, LAYERS } from '../../config/constants';
import { api } from '../../services/api';
import { MapLegend } from './MapLegend';
import { TimelineSlider } from '../controls/TimelineSlider';
import { Crosshair, Wifi, WifiOff, Globe } from 'lucide-react';

// Automatically invalidate Leaflet size when sidebars open/collapse or window resizes
const MapResizer: React.FC<{ isSidebarOpen: boolean; isAnalyticsOpen: boolean }> = ({ isSidebarOpen, isAnalyticsOpen }) => {
  const map = useMap();
  React.useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 150);
    return () => clearTimeout(timer);
  }, [map, isSidebarOpen, isAnalyticsOpen]);

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

export const MapWorkspace: React.FC = () => {
  const {
    showAOIBoundary,
    hoveredCoordinates,
    activeLayer,
    selectedDate,
    layerOpacity,
    backendConnected,
    apiError,
    addToast,
    isSidebarOpen,
    isAnalyticsOpen
  } = useAppStore();

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
    ? `https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png?key=${cartoApiKey}&api_key=${cartoApiKey}`
    : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

  return (
    <main className="relative flex-1 h-full w-full bg-slate-900 overflow-hidden select-none">
      <MapContainer
        center={MYSURU_CENTER}
        zoom={MYSURU_DEFAULT_ZOOM}
        className="h-full w-full"
        zoomControl={true}
      >
        {/* CARTO Dark Matter Base Map with Authenticated Tile URL */}
        <TileLayer
          url={cartoBasemapUrl}
          attribution='&copy; <a href="https://carto.com/">CARTO</a> &copy; OpenStreetMap'
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
              color: '#0d9488',
              weight: 2,
              dashArray: '5, 8',
              fillColor: '#0d9488',
              fillOpacity: 0.04,
            }}
          />
        )}

        <MapEventHandler />
        <MapResizer isSidebarOpen={isSidebarOpen} isAnalyticsOpen={isAnalyticsOpen} />
      </MapContainer>

      {/* Top-Left Hover Coordinates & Map Telemetry Badge */}
      <div className="absolute top-3 left-3 z-[1000] pointer-events-none hidden sm:flex flex-col space-y-1.5">
        <div className="bg-white/95 border border-slate-200/80 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-card flex items-center space-x-2 text-xs">
          <Crosshair className="w-3.5 h-3.5 text-teal-600" />
          <span className="text-slate-500 font-medium">Cursor:</span>
          {hoveredCoordinates ? (
            <span className="font-mono text-slate-900 font-bold">
              {hoveredCoordinates.lat.toFixed(5)}°N, {hoveredCoordinates.lng.toFixed(5)}°E
            </span>
          ) : (
            <span className="text-slate-400 italic">Hover map for coordinates</span>
          )}
        </div>

        <div className="bg-white/95 border border-slate-200/80 backdrop-blur-md px-3 py-1 rounded-xl shadow-card flex items-center space-x-2 text-[11px] font-mono text-slate-600">
          <Globe className="w-3 h-3 text-slate-400" />
          <span>CRS: <strong className="text-slate-800 font-bold">EPSG:32643 (UTM 43N)</strong></span>
        </div>
      </div>

      {/* Top-Right Active Telemetry & Backend Status Banner */}
      <div className="absolute top-3 right-3 z-[1000] pointer-events-none flex flex-col items-end space-y-1.5">
        {backendConnected ? (
          <div className="bg-white/95 border border-teal-200 text-teal-800 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-card text-xs font-medium flex items-center space-x-2">
            <Wifi className="w-3.5 h-3.5 text-teal-600" />
            <span>Live Stream: <strong className="text-slate-900 uppercase font-bold">{currentLayerObj?.shortName || activeLayer}</strong> ({dateOrKey})</span>
          </div>
        ) : (
          <div className="bg-white/95 border border-amber-300 text-amber-800 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-card text-xs font-medium flex items-center space-x-2">
            <WifiOff className="w-3.5 h-3.5 text-amber-600" />
            <span>Backend Offline: Start FastAPI (`uvicorn backend.app.main:app`)</span>
          </div>
        )}
      </div>

      {/* API Error Toast Banner if connection fails */}
      {apiError && !backendConnected && (
        <div className="absolute top-14 right-3 z-[1000] max-w-sm pointer-events-auto">
          <div className="bg-white/95 border border-red-300 text-red-900 backdrop-blur-md p-3 rounded-xl shadow-card text-xs space-y-1">
            <div className="font-bold text-red-700">Backend Server Unavailable</div>
            <p className="text-[11px] leading-tight text-red-600">{apiError}</p>
          </div>
        </div>
      )}

      {/* Floating Timeline Control at Bottom Center */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000] max-w-[95vw]">
        <TimelineSlider />
      </div>

      {/* Floating Map Legend at Bottom Right */}
      <div className="absolute bottom-4 right-4 z-[1000] hidden md:block">
        <MapLegend />
      </div>
    </main>
  );
};
