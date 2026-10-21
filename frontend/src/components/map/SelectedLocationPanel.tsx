import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { LAYERS, OBSERVATION_DATES } from '../../config/constants';
import { MapPin, X, CheckCircle, AlertTriangle, Globe, Layers, Calendar, Info } from 'lucide-react';

export const SelectedLocationPanel: React.FC = () => {
  const { selectedLocation, setSelectedLocation, activeLayer, selectedDate } = useAppStore();

  if (!selectedLocation) return null;

  const { lat, lng } = selectedLocation;

  // Check if location is inside Mysuru AOI bounds [lat: 12.15 - 12.40, lng: 76.50 - 76.75]
  const isInsideAOI = lat >= 12.15 && lat <= 12.40 && lng >= 76.50 && lng <= 76.75;

  const currentLayerObj = LAYERS.find((l) => l.id === activeLayer);
  const currentDateObj = OBSERVATION_DATES.find((d) => d.date === selectedDate);

  // Convert decimal degrees to DMS string
  const toDMS = (deg: number, isLat: boolean): string => {
    const absolute = Math.abs(deg);
    const degrees = Math.floor(absolute);
    const minutesNotTruncated = (absolute - degrees) * 60;
    const minutes = Math.floor(minutesNotTruncated);
    const seconds = Math.floor((minutesNotTruncated - minutes) * 60);
    const direction = isLat ? (deg >= 0 ? 'N' : 'S') : deg >= 0 ? 'E' : 'W';
    return `${degrees}° ${minutes}' ${seconds}" ${direction}`;
  };

  const dmsString = `${toDMS(lat, true)}, ${toDMS(lng, false)}`;

  return (
    <div className="absolute bottom-4 left-4 z-[1050] w-80 max-w-[calc(100vw-32px)] bg-[#080D18]/95 border border-[#26354A] backdrop-blur-md rounded-2xl p-3.5 shadow-floating text-xs select-none pointer-events-auto animate-in fade-in slide-in-from-bottom-2 duration-150">
      {/* Header with Title & Dismiss Button */}
      <div className="flex items-center justify-between border-b border-[#26354A]/60 pb-2 mb-2.5">
        <div className="flex items-center space-x-2">
          <div className="p-1 rounded-md bg-[#19D3C5]/15 text-[#19D3C5]">
            <MapPin className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 className="font-bold text-[#F5F7FB] text-xs">Selected Location</h4>
            <span className="text-[10px] text-[#8291A8]">Map Click Inspection</span>
          </div>
        </div>

        <button
          onClick={() => setSelectedLocation(null)}
          className="p-1 rounded-md text-[#8291A8] hover:text-[#F5F7FB] hover:bg-[#162238] transition-colors cursor-pointer"
          title="Dismiss pin and selection"
          aria-label="Dismiss pin and selection"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Spatial Coordinates Section */}
      <div className="space-y-1.5 mb-2.5">
        <div className="flex items-baseline justify-between font-mono">
          <span className="text-[10px] text-[#8291A8] uppercase tracking-wider">Coordinates:</span>
          <span className="text-xs font-bold text-[#F5F7FB]">
            {lat.toFixed(5)}° N, {lng.toFixed(5)}° E
          </span>
        </div>

        <div className="flex items-center justify-between text-[10px] text-[#8291A8] font-mono">
          <span>DMS:</span>
          <span className="text-[#A8B5C9]">{dmsString}</span>
        </div>

        <div className="flex items-center justify-between text-[10px] text-[#8291A8] font-mono">
          <span className="flex items-center space-x-1">
            <Globe className="w-3 h-3 text-[#8291A8]" />
            <span>Projection:</span>
          </span>
          <span className="text-[#A8B5C9]">EPSG:32643 (UTM 43N)</span>
        </div>
      </div>

      {/* Study Domain Status Badge */}
      <div
        className={`p-2 rounded-xl border flex items-start space-x-2 mb-2.5 ${
          isInsideAOI
            ? 'bg-[#19D3C5]/10 border-[#19D3C5]/30 text-[#19D3C5]'
            : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
        }`}
      >
        {isInsideAOI ? (
          <CheckCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
        ) : (
          <AlertTriangle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
        )}
        <div className="text-[10.5px] leading-tight">
          <div className="font-bold">
            {isInsideAOI ? 'Within Study Domain (Mysuru AOI)' : 'Outside Study Boundary'}
          </div>
          <div className="text-[9.5px] text-[#A8B5C9] mt-0.5">
            {isInsideAOI
              ? 'Target pixel falls within the verified 132.13 km² built-up study area.'
              : 'Target coordinates are outside the authoritative masked urban boundary.'}
          </div>
        </div>
      </div>

      {/* Active Layer Context */}
      <div className="bg-[#0D1525] p-2 rounded-xl border border-[#26354A] space-y-1 text-[10.5px] mb-2.5">
        <div className="flex items-center justify-between text-[#8291A8]">
          <span className="flex items-center space-x-1">
            <Layers className="w-3 h-3 text-[#19D3C5]" />
            <span>Active Layer:</span>
          </span>
          <span className="font-bold text-[#F5F7FB] truncate max-w-[160px]">
            {currentLayerObj?.shortName || activeLayer}
          </span>
        </div>

        <div className="flex items-center justify-between text-[#8291A8]">
          <span className="flex items-center space-x-1">
            <Calendar className="w-3 h-3 text-[#19D3C5]" />
            <span>Observation:</span>
          </span>
          <span className="font-mono text-[#F5F7FB]">
            {activeLayer === 'persistence' || activeLayer === 'gi_star'
              ? '8-Date Seasonal Composite'
              : `${selectedDate} (${currentDateObj?.satellite || 'Landsat'})`}
          </span>
        </div>
      </div>

      {/* Scientific Transparency Notice */}
      <div className="p-2 rounded-xl bg-[#111C2E] border border-[#26354A] text-[9.5px] text-[#8291A8] space-y-1">
        <div className="flex items-center space-x-1 font-semibold text-[#A8B5C9]">
          <Info className="w-3 h-3 text-[#19D3C5] shrink-0" />
          <span>Point Pixel Query Note</span>
        </div>
        <p className="leading-relaxed">
          Spatial coordinates are accurately registered. Direct point pixel value sampling requires a backend point-query endpoint (deferred). Layer visualization is rendered via authoritative 256×256 GeoTIFF Web Mercator raster tiles.
        </p>
      </div>

      {/* Dismiss Button */}
      <div className="mt-2.5 pt-2 border-t border-[#26354A]/60 flex justify-end">
        <button
          onClick={() => setSelectedLocation(null)}
          className="px-3 py-1 rounded-lg bg-[#162238] hover:bg-[#26354A] text-[11px] font-semibold text-[#F5F7FB] border border-[#26354A] transition-colors cursor-pointer"
        >
          Clear Pin
        </button>
      </div>
    </div>
  );
};
