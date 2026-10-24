import React from 'react';
import { MapContainer, TileLayer, Polygon, CircleMarker, Marker, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useAppStore } from '../../store/useAppStore';
import { MYSURU_CENTER, MYSURU_DEFAULT_ZOOM, MYSURU_AOI_BOUNDS, LAYERS } from '../../config/constants';
import { api } from '../../services/api';
import { MapLegend } from './MapLegend';
import { MapContextOverlay } from './MapContextOverlay';
import { SelectedLocationPanel } from './SelectedLocationPanel';
import { TimelineSlider } from '../controls/TimelineSlider';
import { Crosshair, Globe, AlertCircle, RefreshCw } from 'lucide-react';

// Automatically invalidate Leaflet size when sidebars open/collapse, container resizes, or window/orientation changes
const MapResizer: React.FC<{ isSidebarOpen?: boolean; isAnalyticsOpen?: boolean }> = ({ isSidebarOpen, isAnalyticsOpen }) => {
  const map = useMap();

  React.useEffect(() => {
    map.invalidateSize();
    const t1 = setTimeout(() => {
      map.invalidateSize();
    }, 150);
    const t2 = setTimeout(() => {
      map.invalidateSize();
    }, 250);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [map, isSidebarOpen, isAnalyticsOpen]);

  React.useEffect(() => {
    const handleOrientation = () => {
      map.invalidateSize();
      setTimeout(() => map.invalidateSize(), 200);
    };
    window.addEventListener('orientationchange', handleOrientation);

    const container = map.getContainer();
    if (!container || typeof ResizeObserver === 'undefined') {
      const handleResize = () => map.invalidateSize();
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('orientationchange', handleOrientation);
      };
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
      window.removeEventListener('orientationchange', handleOrientation);
    };
  }, [map]);

  return null;
};

// Map Event Listener Component for Hover Coordinates and Click Inspection
const MapEventHandler: React.FC = () => {
  const { setHoveredCoordinates, setSelectedLocation } = useAppStore();
  
  useMapEvents({
    mousemove(e) {
      setHoveredCoordinates({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
    mouseout() {
      setHoveredCoordinates(null);
    },
    click(e) {
      setSelectedLocation({ lat: e.latlng.lat, lng: e.latlng.lng });
    }
  });

  return null;
};

// Authoritative northern midpoint of the official Mysuru AOI bounding polygon [lat, lng]
const AOI_NORTH_MIDPOINT: [number, number] = [12.40, 76.625];

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
    selectedLocation,
    activeLayer,
    selectedDate,
    layerOpacity,
    backendConnected,
    apiError,
    addToast,
    fetchInitialData,
    isLoadingMetadata,
    isSidebarOpen: storeIsSidebarOpen,
    isAnalyticsOpen
  } = useAppStore();

  const effectiveSidebarOpen = isSidebarOpenProp !== undefined ? isSidebarOpenProp : storeIsSidebarOpen;
  const currentLayerObj = LAYERS.find(l => l.id === activeLayer);

  const handleTileError = () => {
    // Non-blocking toast notification on tile loading error without crashing map
    addToast({
      type: 'warning',
      title: 'Satellite Layer Notice',
      message: `Satellite raster for ${currentLayerObj?.shortName || activeLayer} is temporarily unavailable.`,
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

  // Restrained study area identifier badge associated with northern AOI boundary
  const aoiLabelIcon = React.useMemo(() => {
    return L.divIcon({
      className: 'aoi-study-area-label',
      html: `
        <div style="
          transform: translate(-50%, -100%);
          margin-top: -6px;
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(8, 13, 24, 0.92);
          border: 1px solid rgba(25, 211, 197, 0.65);
          padding: 3px 8px;
          border-radius: 6px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.5);
          white-space: nowrap;
          pointer-events: none;
          user-select: none;
        ">
          <span style="width: 5px; height: 5px; border-radius: 50%; background-color: #19D3C5; display: inline-block;"></span>
          <span style="color: #F5F7FB; font-size: 10px; font-weight: 700; font-family: ui-monospace, SFMono-Regular, Menlo, monospace; letter-spacing: 0.05em; text-transform: uppercase;">
            Mysuru Study Area
          </span>
          <span style="color: #8291A8; font-size: 9.5px; font-family: ui-monospace, SFMono-Regular, Menlo, monospace;">
            (132.1 km²)
          </span>
        </div>
      `,
      iconSize: [0, 0],
      iconAnchor: [0, 0],
    });
  }, []);

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

        {/* Mysuru AOI Polygon Boundary with high-contrast dual-stroke casing */}
        {showAOIBoundary && (
          <>
            {/* Dark background casing stroke (provides high contrast over both light basemaps & bright/saturated rasters) */}
            <Polygon
              positions={MYSURU_AOI_BOUNDS}
              pathOptions={{
                color: '#080D18',
                weight: 4.5,
                opacity: 0.8,
                dashArray: '6, 8',
                fillColor: 'transparent',
                fillOpacity: 0,
                interactive: false,
              }}
            />
            {/* Primary high-visibility cyan/teal dashed boundary */}
            <Polygon
              positions={MYSURU_AOI_BOUNDS}
              pathOptions={{
                color: '#19D3C5',
                weight: 2,
                dashArray: '6, 8',
                fillColor: '#19D3C5',
                fillOpacity: 0.035,
                interactive: false,
              }}
            />
            {/* Restrained Study Area Label pinned along northern AOI boundary */}
            <Marker
              position={AOI_NORTH_MIDPOINT}
              icon={aoiLabelIcon}
              interactive={false}
            />
          </>
        )}

        {/* Click-Selected Location Target Pin */}
        {selectedLocation && (
          <>
            <CircleMarker
              center={[selectedLocation.lat, selectedLocation.lng]}
              radius={6}
              pathOptions={{
                color: '#19D3C5',
                fillColor: '#19D3C5',
                fillOpacity: 1,
                weight: 2,
              }}
            />
            <CircleMarker
              center={[selectedLocation.lat, selectedLocation.lng]}
              radius={16}
              pathOptions={{
                color: '#19D3C5',
                fillColor: '#19D3C5',
                fillOpacity: 0.18,
                weight: 1.5,
                dashArray: '3, 4',
              }}
            />
          </>
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

      {/* On-Map Context & Layer Intelligence Overlay (Top-Right) */}
      <MapContextOverlay />

      {/* Selected Location Information Panel (Bottom-Left) */}
      <SelectedLocationPanel />

      {/* API Error Banner with Retry Action if connection fails */}
      {apiError && !backendConnected && (
        <div className="absolute top-14 right-3 z-[1000] max-w-sm pointer-events-auto">
          <div className="bg-[#080D18]/95 border border-[#26354A] text-[#F5F7FB] backdrop-blur-md p-3.5 rounded-xl shadow-card text-xs space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="font-bold text-amber-400 flex items-center space-x-1.5">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>Backend Analysis Server Offline</span>
              </span>
              <button
                onClick={() => fetchInitialData()}
                disabled={isLoadingMetadata}
                className="flex items-center space-x-1 text-[10.5px] font-semibold text-[#19D3C5] hover:text-[#39E4D5] bg-[#162238] px-2.5 py-1 rounded-lg border border-[#26354A] hover:border-[#19D3C5]/40 transition-colors disabled:opacity-50 cursor-pointer shadow-2xs"
                title="Retry backend connection"
                aria-label="Retry backend connection"
              >
                <RefreshCw className={`w-3 h-3 ${isLoadingMetadata ? 'animate-spin' : ''}`} />
                <span>{isLoadingMetadata ? 'Connecting...' : 'Retry'}</span>
              </button>
            </div>
            <p className="text-[11px] leading-tight text-[#8291A8]">{apiError}</p>
          </div>
        </div>
      )}

      {/* Custom Page Children Overlays */}
      {children}

      {/* Floating Timeline Control at Bottom Center (Lifted to ensure Leaflet attribution remains visible) */}
      {showTimeline && (
        <div className="absolute bottom-7 sm:bottom-8 left-1/2 -translate-x-1/2 z-[1000] max-w-[calc(100vw-24px)] pointer-events-auto">
          <TimelineSlider />
        </div>
      )}

      {/* Floating Map Legend at Bottom Right (Stacked above Timeline on mobile to prevent overlap) */}
      {showLegend && (
        <div
          className={`absolute z-[1000] transition-all duration-150 ${
            showTimeline
              ? 'bottom-22 sm:bottom-8 right-3 sm:right-4'
              : 'bottom-7 sm:bottom-8 right-3 sm:right-4'
          }`}
        >
          <MapLegend />
        </div>
      )}
    </main>
  );
};
