import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { LAYERS } from '../../config/constants';

export const MapLegend: React.FC = () => {
  const { activeLayer } = useAppStore();
  const currentLayer = LAYERS.find((l) => l.id === activeLayer);

  if (!currentLayer) return null;

  return (
    <div className="bg-[#080D18]/95 border border-[#26354A] backdrop-blur-md rounded-2xl p-3.5 shadow-floating w-68 select-none">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-bold text-[#F5F7FB] uppercase tracking-wider">{currentLayer.shortName} Legend</h4>
        {currentLayer.unit && (
          <span className="text-[10px] font-mono text-[#8291A8] font-medium">Unit: {currentLayer.unit}</span>
        )}
      </div>

      {currentLayer.id === 'lst' && (
        <div className="space-y-1.5">
          <div className="text-[10px] text-[#8291A8] italic">Land Surface Temp (Landsat ST_B10)</div>
          <div className="h-3 rounded-md w-full bg-gradient-to-r from-yellow-200 via-orange-500 to-red-700 border border-[#26354A]" />
          <div className="flex justify-between text-[10px] font-mono text-[#A8B5C9]">
            <span>30.0 °C</span>
            <span>42.7 (P20)</span>
            <span>47.1 (P80)</span>
            <span>55.0 °C</span>
          </div>
        </div>
      )}

      {currentLayer.id === 'ndvi' && (
        <div className="space-y-1.5">
          <div className="text-[10px] text-[#8291A8] italic">Vegetation Canopy Density Index</div>
          <div className="h-3 rounded-md w-full bg-gradient-to-r from-amber-900 via-emerald-600 to-emerald-400 border border-[#26354A]" />
          <div className="flex justify-between text-[10px] font-mono text-[#A8B5C9]">
            <span>-0.2 (Non-Veg)</span>
            <span>+0.3</span>
            <span>+0.8 (Dense Veg)</span>
          </div>
        </div>
      )}

      {currentLayer.id === 'ndbi' && (
        <div className="space-y-1.5">
          <div className="text-[10px] text-[#8291A8] italic">Built-up Surface & Pavement Index</div>
          <div className="h-3 rounded-md w-full bg-gradient-to-r from-slate-900 via-amber-700 to-amber-500 border border-[#26354A]" />
          <div className="flex justify-between text-[10px] font-mono text-[#A8B5C9]">
            <span>-0.4 (Pervious)</span>
            <span>0.0</span>
            <span>+0.6 (Built/Paved)</span>
          </div>
        </div>
      )}

      {currentLayer.id === 'rf_prob' && (
        <div className="space-y-1.5">
          <div className="text-[10px] text-[#8291A8] italic">RF Predicted Class 1 Probability</div>
          <div className="h-3 rounded-md w-full bg-gradient-to-r from-slate-200 via-red-400 to-red-600 border border-[#26354A]" />
          <div className="flex justify-between text-[10px] font-mono text-[#A8B5C9]">
            <span>0.00 (Low)</span>
            <span>0.50 (Threshold)</span>
            <span>1.00 (High)</span>
          </div>
        </div>
      )}

      {currentLayer.id === 'rf_class' && (
        <div className="space-y-1.5 text-xs">
          <div className="text-[10px] text-[#8291A8] italic">RF-Predicted Hotspot Classification</div>
          <div className="flex items-center space-x-2 pt-0.5">
            <span className="w-3.5 h-3.5 rounded bg-red-600 border border-red-500 shadow-xs" />
            <span className="text-[#F5F7FB] font-medium">Class 1: Hotspot (LST &ge; P80)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3.5 h-3.5 rounded bg-[#162238] border border-[#26354A]" />
            <span className="text-[#A8B5C9]">Class 0: Non-Hotspot</span>
          </div>
        </div>
      )}

      {currentLayer.id === 'persistence' && (
        <div className="space-y-1 text-[11px]">
          <div className="text-[10px] text-[#8291A8] italic">Multi-Temporal Hotspot Recurrence</div>
          <div className="flex items-center space-x-2 pt-0.5">
            <span className="w-3 h-3 rounded bg-red-500" />
            <span className="text-[#F5F7FB]">Cat 5: &gt;75-100% (Persistent)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded bg-amber-500" />
            <span className="text-[#A8B5C9]">Cat 4: &gt;50-75% (High)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded bg-amber-400" />
            <span className="text-[#A8B5C9]">Cat 3: &gt;25-50% (Moderate)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded bg-sky-500" />
            <span className="text-[#8291A8]">Cat 2: &gt;0-25% (Low)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded bg-[#162238] border border-[#26354A]" />
            <span className="text-[#8291A8]">Cat 1: 0% (Never Hotspot)</span>
          </div>
        </div>
      )}

      {currentLayer.id === 'gi_star' && (
        <div className="space-y-1 text-[11px]">
          <div className="text-[10px] text-[#8291A8] italic">Spatial Cluster Autocorrelation</div>
          <div className="flex items-center space-x-2 pt-0.5">
            <span className="w-3 h-3 rounded bg-[#990000]" />
            <span className="text-[#F5F7FB]">Hotspot 99% Confidence</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded bg-[#d73027]" />
            <span className="text-[#A8B5C9]">Hotspot 95% Confidence</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded bg-[#f46d43]" />
            <span className="text-[#A8B5C9]">Hotspot 90% Confidence</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded bg-[#4575b4]" />
            <span className="text-[#8291A8]">Coldspot Cluster (90-99%)</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded bg-[#162238] border border-[#26354A]" />
            <span className="text-[#8291A8]">Not Significant</span>
          </div>
        </div>
      )}
    </div>
  );
};
