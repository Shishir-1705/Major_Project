import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { LAYERS } from '../../config/constants';
import { ChevronDown, ChevronUp, Layers, Info } from 'lucide-react';

export const MapLegend: React.FC = () => {
  const { activeLayer } = useAppStore();
  const [isCollapsed, setIsCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 768;
    }
    return false;
  });

  const currentLayer = LAYERS.find((l) => l.id === activeLayer);

  if (!currentLayer) return null;

  return (
    <div className={`bg-[#080D18]/95 border border-[#26354A] backdrop-blur-md rounded-2xl shadow-floating select-none pointer-events-auto transition-all duration-200 ${
      isCollapsed ? 'w-auto px-3 py-1.5' : 'w-72 sm:w-80 p-3.5'
    }`}>
      {/* Legend Header & Collapse Toggle */}
      <button
        type="button"
        onClick={() => setIsCollapsed(!isCollapsed)}
        className="w-full flex items-center justify-between cursor-pointer group focus-visible:ring-2 focus-visible:ring-[#19D3C5] focus-visible:outline-hidden rounded-lg p-0.5 text-left border-0 bg-transparent"
        aria-expanded={!isCollapsed}
        aria-label="Toggle map legend display"
      >
        <div className="flex items-center space-x-1.5 min-w-0">
          <Layers className="w-3.5 h-3.5 text-[#19D3C5] shrink-0" />
          <h4 className="text-xs font-bold text-[#F5F7FB] uppercase tracking-wider">
            {currentLayer.shortName} Legend
          </h4>
        </div>

        <div className="flex items-center space-x-1 shrink-0 ml-1">
          {currentLayer.unit && currentLayer.unit.trim() !== '' && (
            <span className="text-[9.5px] font-mono text-[#8291A8] font-medium hidden sm:inline">
              [{currentLayer.unit}]
            </span>
          )}
          {isCollapsed ? (
            <ChevronUp className="w-3.5 h-3.5 text-[#8291A8] group-hover:text-[#F5F7FB]" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-[#8291A8] group-hover:text-[#F5F7FB]" />
          )}
        </div>
      </button>

      {/* Legend Body (Visible when not collapsed) */}
      {!isCollapsed && (
        <div className="mt-2.5 pt-2 border-t border-[#26354A]/60 space-y-2 text-xs">
          {/* LST LEGEND */}
          {currentLayer.id === 'lst' && (
            <div className="space-y-1.5">
              <div className="text-[10px] text-[#8291A8] leading-tight">
                Radiometric Skin Temperature (Landsat ST_B10)
              </div>
              <div className="h-3 rounded-md w-full bg-gradient-to-r from-yellow-200 via-orange-500 to-red-700 border border-[#26354A]" />
              <div className="flex justify-between text-[9px] sm:text-[9.5px] font-mono text-[#A8B5C9] pt-1">
                <span>30.0°C</span>
                <span>42.7 (P20)</span>
                <span>47.1 (P80)</span>
                <span>55.0°C</span>
              </div>
              <div className="p-1.5 rounded-lg bg-[#111C2E] border border-[#26354A] text-[9.5px] text-amber-300/90 leading-tight flex items-start space-x-1">
                <Info className="w-3 h-3 text-amber-400 shrink-0 mt-0.5" />
                <span>Surface skin temp (~10:45 AM overpass); not ambient 2 m air temp.</span>
              </div>
            </div>
          )}

          {/* NDVI LEGEND */}
          {currentLayer.id === 'ndvi' && (
            <div className="space-y-1.5">
              <div className="text-[10px] text-[#8291A8] leading-tight">
                Vegetation Canopy Density Index (Red / NIR)
              </div>
              <div className="h-3 rounded-md w-full bg-gradient-to-r from-amber-900 via-emerald-600 to-emerald-400 border border-[#26354A]" />
              <div className="flex justify-between text-[9.5px] font-mono text-[#A8B5C9]">
                <span>-0.2 (Non-Veg)</span>
                <span>+0.3</span>
                <span>+0.8 (Dense Veg)</span>
              </div>
              <div className="text-[9.5px] text-[#8291A8] leading-tight">
                Higher values indicate dense photosynthetic canopy.
              </div>
            </div>
          )}

          {/* NDBI LEGEND */}
          {currentLayer.id === 'ndbi' && (
            <div className="space-y-1.5">
              <div className="text-[10px] text-[#8291A8] leading-tight">
                Built-up & Pavement Index (SWIR-1 / NIR)
              </div>
              <div className="h-3 rounded-md w-full bg-gradient-to-r from-slate-900 via-amber-700 to-amber-500 border border-[#26354A]" />
              <div className="flex justify-between text-[9.5px] font-mono text-[#A8B5C9]">
                <span>-0.4 (Pervious)</span>
                <span>0.0</span>
                <span>+0.6 (Built/Paved)</span>
              </div>
              <div className="text-[9.5px] text-[#8291A8] leading-tight">
                Positive values denote impervious surfaces and building density.
              </div>
            </div>
          )}

          {/* RF PROBABILITY LEGEND */}
          {currentLayer.id === 'rf_prob' && (
            <div className="space-y-1.5">
              <div className="text-[10px] text-[#8291A8] leading-tight">
                RF Model Continuous Class 1 Probability
              </div>
              <div className="h-3 rounded-md w-full bg-gradient-to-r from-slate-200 via-red-400 to-red-600 border border-[#26354A]" />
              <div className="flex justify-between text-[9.5px] font-mono text-[#A8B5C9]">
                <span>0.00 (Low)</span>
                <span className="text-[#19D3C5] font-bold">0.50 (Threshold)</span>
                <span>1.00 (High)</span>
              </div>
              <div className="p-1.5 rounded-lg bg-[#111C2E] border border-[#26354A] text-[9.5px] text-[#A8B5C9] leading-tight">
                Continuous gradient representing relative likelihood of exceeding P80 thermal intensity.
              </div>
            </div>
          )}

          {/* RF CLASSIFICATION LEGEND */}
          {currentLayer.id === 'rf_class' && (
            <div className="space-y-1.5 text-xs">
              <div className="text-[10px] text-[#8291A8] leading-tight">
                Binary ML Hotspot Decision (P80 Threshold)
              </div>
              <div className="flex items-center justify-between p-1.5 bg-[#0D1525] rounded-lg border border-[#26354A]">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded bg-red-600 border border-red-500 shadow-xs" />
                  <span className="text-[#F5F7FB] font-medium text-[11px]">Class 1: Hotspot</span>
                </div>
                <span className="text-[10px] font-mono text-[#19D3C5]">Prob ≥ 0.50</span>
              </div>
              <div className="flex items-center justify-between p-1.5 bg-[#0D1525] rounded-lg border border-[#26354A]">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded bg-[#162238] border border-[#26354A]" />
                  <span className="text-[#A8B5C9] text-[11px]">Class 0: Non-Hotspot</span>
                </div>
                <span className="text-[10px] font-mono text-[#8291A8]">Prob &lt; 0.50</span>
              </div>
            </div>
          )}

          {/* HEAT PERSISTENCE LEGEND */}
          {currentLayer.id === 'persistence' && (
            <div className="space-y-1 text-[11px]">
              <div className="text-[10px] text-[#8291A8] leading-tight">
                Multi-Temporal Hotspot Recurrence (8 Dates)
              </div>
              <div className="flex items-center justify-between p-1 bg-[#0D1525] rounded border border-[#26354A]">
                <div className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#ef4444]" />
                  <span className="text-[#F5F7FB] text-[10.5px]">Cat 5: &gt;75–100%</span>
                </div>
                <span className="text-[9.5px] font-mono text-[#19D3C5]">Persistent</span>
              </div>
              <div className="flex items-center justify-between p-1 bg-[#0D1525] rounded border border-[#26354A]">
                <div className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#f97316]" />
                  <span className="text-[#A8B5C9] text-[10.5px]">Cat 4: &gt;50–75%</span>
                </div>
                <span className="text-[9.5px] font-mono text-[#8291A8]">High</span>
              </div>
              <div className="flex items-center justify-between p-1 bg-[#0D1525] rounded border border-[#26354A]">
                <div className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#facc15]" />
                  <span className="text-[#A8B5C9] text-[10.5px]">Cat 3: &gt;25–50%</span>
                </div>
                <span className="text-[9.5px] font-mono text-[#8291A8]">Moderate</span>
              </div>
              <div className="flex items-center justify-between p-1 bg-[#0D1525] rounded border border-[#26354A]">
                <div className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#06b6d4]" />
                  <span className="text-[#A8B5C9] text-[10.5px]">Cat 2: &gt;0–25%</span>
                </div>
                <span className="text-[9.5px] font-mono text-[#8291A8]">Low</span>
              </div>
              <div className="flex items-center justify-between p-1 bg-[#0D1525] rounded border border-[#26354A]">
                <div className="flex items-center space-x-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#1e293b] border border-[#26354A]" />
                  <span className="text-[#8291A8] text-[10.5px]">Cat 1: 0%</span>
                </div>
                <span className="text-[9.5px] font-mono text-[#8291A8]">Never Hotspot</span>
              </div>
            </div>
          )}

          {/* GETIS-ORD GI* CLUSTERS LEGEND */}
          {currentLayer.id === 'gi_star' && (
            <div className="space-y-1.5 text-[11px]">
              <div className="text-[10px] text-[#8291A8] leading-tight">
                Getis-Ord Gi* Spatial Clustering (FDR p &lt; 0.05)
              </div>
              <div className="flex items-center justify-between p-1.5 bg-[#0D1525] rounded-lg border border-[#26354A]">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded bg-[#f46d43] border border-[#ea580c] shadow-xs" />
                  <span className="text-[#F5F7FB] font-medium text-[11px]">Significant Hotspot</span>
                </div>
                <span className="text-[10px] font-mono text-[#19D3C5]">pFDR &lt; 0.05</span>
              </div>
              <div className="flex items-center justify-between p-1.5 bg-[#0D1525] rounded-lg border border-[#26354A]">
                <div className="flex items-center space-x-2">
                  <span className="w-3 h-3 rounded bg-[#1e293b] border border-[#26354A]" />
                  <span className="text-[#A8B5C9] text-[11px]">Not Significant</span>
                </div>
                <span className="text-[10px] font-mono text-[#8291A8]">pFDR ≥ 0.05</span>
              </div>
              <div className="p-1.5 rounded-lg bg-[#111C2E] border border-[#26354A] text-[9px] text-[#8291A8] leading-tight">
                Multiple-testing adjusted across 104,063 spatial tests using Benjamini-Hochberg FDR (α = 0.05).
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
