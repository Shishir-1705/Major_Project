import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Eye, MapPin } from 'lucide-react';

export const MapDisplayControls: React.FC<{ className?: string }> = ({ className = '' }) => {
  const {
    layerOpacity,
    setLayerOpacity,
    showAOIBoundary,
    setShowAOIBoundary
  } = useAppStore();

  return (
    <div className={`p-3 rounded-xl border border-[#26354A] bg-[#0D1525] space-y-3 ${className}`}>
      {/* Opacity Slider */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-[#A8B5C9] font-medium flex items-center space-x-1.5">
            <Eye className="w-3.5 h-3.5 text-[#8291A8]" />
            <span>Layer Opacity</span>
          </span>
          <span className="font-mono text-[#19D3C5] text-[11px] font-bold">
            {Math.round(layerOpacity * 100)}%
          </span>
        </div>
        <input
          type="range"
          min="0.1"
          max="1.0"
          step="0.05"
          value={layerOpacity}
          onChange={(e) => setLayerOpacity(parseFloat(e.target.value))}
          className="w-full h-1.5 bg-[#162238] rounded-lg appearance-none cursor-pointer accent-[#19D3C5]"
          aria-label="Adjust map layer opacity"
        />
      </div>

      {/* AOI Boundary Switch */}
      <div className="flex items-center justify-between pt-2 border-t border-[#26354A]">
        <span className="text-xs text-[#F5F7FB] font-medium flex items-center space-x-1.5">
          <MapPin className="w-3.5 h-3.5 text-[#19D3C5]" />
          <span>Mysuru AOI Boundary</span>
        </span>
        <button
          onClick={() => setShowAOIBoundary(!showAOIBoundary)}
          className={`w-9 h-5 rounded-full transition-colors relative p-0.5 focus:outline-hidden ${
            showAOIBoundary ? 'bg-[#19D3C5]' : 'bg-[#162238] border border-[#26354A]'
          }`}
          title={showAOIBoundary ? "Hide AOI boundary" : "Show AOI boundary"}
          aria-label={showAOIBoundary ? "Hide AOI boundary" : "Show AOI boundary"}
        >
          <div
            className={`w-4 h-4 rounded-full bg-white shadow-xs transition-transform ${
              showAOIBoundary ? 'translate-x-4' : 'translate-x-0'
            }`}
          />
        </button>
      </div>
    </div>
  );
};
