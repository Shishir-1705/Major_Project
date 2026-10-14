import React from 'react';
import { MapContainer, TileLayer, Polygon, useMapEvents, useMap } from 'react-leaflet';
import { MYSURU_CENTER, MYSURU_AOI_BOUNDS } from '../../config/constants';
import { Crosshair, Globe } from 'lucide-react';

const OverviewMapResizer: React.FC = () => {
  const map = useMap();
  React.useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 100);
    return () => clearTimeout(timer);
  }, [map]);
  return null;
};

const OverviewMapEventHandler: React.FC<{ onHover: (coords: { lat: number; lng: number } | null) => void }> = ({ onHover }) => {
  useMapEvents({
    mousemove(e) {
      onHover({ lat: e.latlng.lat, lng: e.latlng.lng });
    },
    mouseout() {
      onHover(null);
    }
  });
  return null;
};

export const OverviewMap: React.FC = () => {
  const [coords, setCoords] = React.useState<{ lat: number; lng: number } | null>(null);

  const cartoApiKey = import.meta.env.VITE_CARTO_API_KEY;
  const cartoBasemapUrl = cartoApiKey
    ? `https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png?key=${cartoApiKey}&api_key=${cartoApiKey}`
    : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

  return (
    <div className="relative w-full h-[420px] sm:h-[480px] rounded-2xl overflow-hidden border border-slate-200/80 shadow-xs bg-slate-100 select-none">
      <MapContainer
        center={MYSURU_CENTER}
        zoom={11}
        style={{ height: '100%', width: '100%' }}
        className="h-full w-full"
        zoomControl={true}
      >
        <OverviewMapResizer />
        {/* CARTO Voyager Road-Oriented Geographic Base Map */}
        <TileLayer
          url={cartoBasemapUrl}
          attribution='&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          maxZoom={18}
        />

        {/* Mysuru AOI Polygon Boundary */}
        <Polygon
          positions={MYSURU_AOI_BOUNDS}
          pathOptions={{
            color: '#0d9488',
            weight: 2.5,
            dashArray: '6, 8',
            fillColor: '#0d9488',
            fillOpacity: 0.05,
          }}
        />

        <OverviewMapEventHandler onHover={setCoords} />
      </MapContainer>

      {/* Floating Coordinate & CRS Badges */}
      <div className="absolute top-3 left-3 z-[1000] pointer-events-none flex flex-col space-y-1.5">
        <div className="bg-white/95 border border-slate-200/80 backdrop-blur-md px-2.5 py-1 rounded-xl shadow-xs flex items-center space-x-1.5 text-xs text-slate-700">
          <Crosshair className="w-3.5 h-3.5 text-teal-600" />
          <span className="text-slate-500 font-medium">Cursor:</span>
          {coords ? (
            <span className="font-mono text-slate-900 font-bold">
              {coords.lat.toFixed(4)}°N, {coords.lng.toFixed(4)}°E
            </span>
          ) : (
            <span className="text-slate-400 italic text-[11px]">Hover map</span>
          )}
        </div>

        <div className="bg-white/95 border border-slate-200/80 backdrop-blur-md px-2.5 py-0.5 rounded-xl shadow-xs flex items-center space-x-1 text-[10.5px] font-mono text-slate-600">
          <Globe className="w-3 h-3 text-slate-400" />
          <span>CRS: <strong className="text-slate-800">EPSG:32643</strong></span>
        </div>
      </div>

      {/* Study Area Identifier Pill */}
      <div className="absolute bottom-3 left-3 z-[1000] pointer-events-none">
        <div className="bg-white/95 border border-teal-200 text-teal-800 backdrop-blur-md px-3 py-1 rounded-xl shadow-xs text-xs font-medium">
          Mysuru AOI: <strong className="text-slate-900 font-bold">132.13 km²</strong> Built Extent
        </div>
      </div>
    </div>
  );
};
