import React from 'react';
import { MapContainer, TileLayer, Polygon, useMapEvents } from 'react-leaflet';
import { useAppStore } from '../../store/useAppStore';
import { MYSURU_CENTER, MYSURU_DEFAULT_ZOOM, MYSURU_AOI_BOUNDS, LAYERS } from '../../config/constants';
import { api } from '../../services/api';
import { MapLegend } from './MapLegend';
import { TimelineSlider } from '../controls/TimelineSlider';
import { Crosshair, Wifi, WifiOff, Globe } from 'lucide-react';

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
    addToast
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
    ? `https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png?api_key=${cartoApiKey}`
    : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

  return (
    <div className="relative flex-1 h-full w-full bg-[#0b0f19] overflow-hidden select-none">
      <MapContainer
        center={MYSURU_CENTER}
        zoom={MYSURU_DEFAULT_ZOOM}
        className="h-full w-full"
        zoomControl={true}
      >
        {/* Dark CartoDB Dark Matter Base Map */}
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
              color: '#06b6d4',
              weight: 2,
              dashArray: '5, 8',
              fillColor: '#06b6d4',
              fillOpacity: 0.03,
            }}
          />
        )}

        <MapEventHandler />
      </MapContainer>

      {/* Top-Left Hover Coordinates & Map Telemetry Badge */}
      <div className="absolute top-3 left-3 z-[1000] pointer-events-none flex flex-col space-y-1.5">
        <div className="bg-[#111827]/90 border border-[#1f2937] backdrop-blur-md px-3 py-1.5 rounded-lg shadow-lg flex items-center space-x-2 text-xs">
          <Crosshair className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-slate-400 font-medium">Cursor:</span>
          {hoveredCoordinates ? (
            <span className="font-mono text-white font-bold">
              {hoveredCoordinates.lat.toFixed(5)}°N, {hoveredCoordinates.lng.toFixed(5)}°E
            </span>
          ) : (
            <span className="text-slate-500 italic">Hover map for coordinates</span>
          )}
        </div>

        <div className="bg-[#111827]/90 border border-[#1f2937] backdrop-blur-md px-3 py-1 rounded-lg shadow-lg flex items-center space-x-2 text-[11px] font-mono text-slate-400">
          <Globe className="w-3 h-3 text-slate-500" />
          <span>CRS: <strong className="text-slate-300">EPSG:32643 (UTM 43N)</strong></span>
        </div>
      </div>

      {/* Top-Right Active Telemetry & Backend Status Banner */}
      <div className="absolute top-3 right-3 z-[1000] pointer-events-none flex flex-col items-end space-y-1.5">
        {backendConnected ? (
          <div className="bg-cyan-950/90 border border-cyan-500/40 text-cyan-300 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-lg text-xs font-medium flex items-center space-x-2">
            <Wifi className="w-3.5 h-3.5 text-emerald-400" />
            <span>FastAPI Live Tile Stream: <strong className="text-white uppercase">{currentLayerObj?.shortName || activeLayer}</strong> ({dateOrKey})</span>
          </div>
        ) : (
          <div className="bg-amber-950/90 border border-amber-500/40 text-amber-300 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-lg text-xs font-medium flex items-center space-x-2">
            <WifiOff className="w-3.5 h-3.5 text-amber-400" />
            <span>Backend Offline: Start FastAPI (`uvicorn backend.app.main:app`)</span>
          </div>
        )}
      </div>

      {/* API Error Toast Banner if connection fails */}
      {apiError && !backendConnected && (
        <div className="absolute top-14 right-3 z-[1000] max-w-sm pointer-events-auto">
          <div className="bg-red-950/90 border border-red-500/50 text-red-200 backdrop-blur-md p-3 rounded-lg shadow-xl text-xs space-y-1">
            <div className="font-bold text-red-400">Backend Server Unavailable</div>
            <p className="text-[11px] leading-tight text-red-300">{apiError}</p>
          </div>
        </div>
      )}

      {/* Floating Timeline Control at Bottom Center */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-[1000]">
        <TimelineSlider />
      </div>

      {/* Floating Map Legend at Bottom Right */}
      <div className="absolute bottom-4 right-4 z-[1000]">
        <MapLegend />
      </div>
    </div>
  );
};
