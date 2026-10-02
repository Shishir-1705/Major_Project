import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { LAYERS, OBSERVATION_DATES } from '../../config/constants';
import { ModelInfoCard } from './ModelInfoCard';
import { StatCard } from '../common/StatCard';
import { Flame, Trees, Building2, ShieldCheck, BarChart2, Info, AlertTriangle } from 'lucide-react';

export const AnalyticsPanel: React.FC = () => {
  const {
    selectedDate,
    activeLayer,
    backendConnected,
    isLoadingStats,
    zonalStats,
    hotspotStats,
    persistenceStats,
    giStarStats,
    metadata,
    modelInfo
  } = useAppStore();

  const currentLayer = LAYERS.find((l) => l.id === activeLayer);
  const currentDateObj = OBSERVATION_DATES.find((d) => d.date === selectedDate);

  return (
    <div className="w-84 bg-[#111827] border-l border-[#1f2937] flex flex-col h-full shrink-0 select-none">
      {/* Panel Header */}
      <div className="p-3.5 border-b border-[#1f2937] flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <BarChart2 className="w-4 h-4 text-cyan-400" />
          <h2 className="text-xs font-bold text-white uppercase tracking-wider">Spatial Analytics & Model</h2>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
          Mysuru AOI
        </span>
      </div>

      {/* Analytics Content Scrollable Body */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-4">
        {/* Active Context Banner */}
        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Selected Date:</span>
            <span className="font-mono font-bold text-white">{selectedDate}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">Satellite Sensor:</span>
            <span className="text-cyan-400 font-medium">{currentDateObj?.satellite || 'Landsat OLI/TIRS'}</span>
          </div>
          <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-900">
            <span className="text-slate-400">Active View:</span>
            <span className="text-white font-semibold truncate max-w-[140px]">{currentLayer?.shortName}</span>
          </div>
        </div>

        {/* Zonal Metrics Grid */}
        <div className="grid grid-cols-2 gap-2">
          <StatCard
            title="Built Area"
            value={metadata ? metadata.built_area_km2.toFixed(2) : "132.13"}
            unit="km²"
            subtitle="Built-up analysis domain (Step 9)"
            icon={Building2}
            accentColor="#a855f7"
            isLoading={isLoadingStats}
            isError={!backendConnected && !metadata}
            errorMessage="Metadata offline"
          />

          <StatCard
            title="Zonal Mean"
            value={zonalStats ? zonalStats.mean.toFixed(2) : (activeLayer === 'lst' ? "43.14" : "0.00")}
            unit={activeLayer === 'lst' || zonalStats?.layer === 'lst' ? "°C" : (currentLayer?.unit || '')}
            subtitle={activeLayer === 'lst' || zonalStats?.layer === 'lst' ? "Valid LST raster domain" : (zonalStats ? `Min: ${zonalStats.min} / Max: ${zonalStats.max}` : "Valid raster domain")}
            icon={Flame}
            accentColor={currentLayer?.accentColor || "#f97316"}
            isLoading={isLoadingStats}
            isError={!backendConnected && !zonalStats}
            errorMessage="Statistics offline"
          />

          <StatCard
            title="Hotspot Area"
            value={hotspotStats ? hotspotStats.hotspot_area_km2.toFixed(2) : "34.54"}
            unit="km²"
            subtitle={hotspotStats ? `${hotspotStats.hotspot_percentage.toFixed(1)}% of valid domain` : "Step 10 Prediction"}
            icon={AlertTriangle}
            accentColor="#ef4444"
            isLoading={isLoadingStats}
            isError={!backendConnected && !hotspotStats}
            errorMessage="Statistics offline"
          />

          <StatCard
            title="Locked ML F1"
            value={modelInfo ? (modelInfo.locked_test_metrics.f1_score * 100).toFixed(2) : "86.60"}
            unit="%"
            subtitle="NDVI+NDBI Predictors"
            icon={ShieldCheck}
            accentColor="#10b981"
            isError={!backendConnected && !modelInfo}
            errorMessage="Telemetry offline"
          />
        </div>

        {/* Dynamic Categorical Persistence Stats (if active layer is persistence) */}
        {activeLayer === 'persistence' && persistenceStats && (
          <div className="bg-[#111827] border border-amber-500/30 rounded-xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Hotspot Persistence Breakdown</h4>
                <span className="text-[10px] font-mono text-slate-400 block">Domain: Multi-temporal persistence domain ({persistenceStats.total_built_area_km2} km²)</span>
              </div>
            </div>
            <div className="space-y-1.5 text-xs">
              {persistenceStats.categories.map((cat) => (
                <div key={cat.category} className="bg-slate-950 p-2 rounded-lg border border-slate-800 space-y-1">
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-300 flex items-center space-x-1.5">
                      <span className="w-2.5 h-2.5 rounded-full inline-block shrink-0" style={{ backgroundColor: cat.color_hex }} />
                      <span className="truncate max-w-[160px]">{cat.category}</span>
                    </span>
                    <span className="font-mono text-white font-bold">{cat.area_km2} km² ({cat.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dynamic Gi* Cluster Stats (if active layer is gi_star) */}
        {activeLayer === 'gi_star' && giStarStats && (
          <div className="bg-[#111827] border border-cyan-500/30 rounded-xl p-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Getis-Ord Gi* Clusters</h4>
                <span className="text-[10px] font-mono text-slate-400 block">Domain: Gi* spatial analysis domain ({giStarStats.total_built_area_km2} km²)</span>
              </div>
            </div>
            <div className="space-y-1.5 text-xs">
              {giStarStats.clusters.map((cls) => (
                <div key={cls.cluster_type} className="bg-slate-950 p-2 rounded-lg border border-slate-800 space-y-1">
                  <div className="flex justify-between font-medium">
                    <span className="text-slate-300 flex items-center space-x-1.5">
                      <span className="w-2.5 h-2.5 rounded-full inline-block shrink-0" style={{ backgroundColor: cls.color_hex }} />
                      <span>{cls.cluster_type}</span>
                    </span>
                    <span className="font-mono text-white font-bold">{cls.area_km2} km² ({cls.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dedicated Locked Model Information Card Component */}
        <ModelInfoCard />

        {/* Feature Importance Attribution Card */}
        {(() => {
          const ndbiVal = modelInfo ? (modelInfo.feature_importances.NDBI * 100).toFixed(2) : "61.03";
          const ndviVal = modelInfo ? (modelInfo.feature_importances.NDVI * 100).toFixed(2) : "38.97";
          return (
            <div className="bg-[#111827] border border-slate-800 rounded-xl p-3.5 space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Gini Feature Attribution</h4>
                <span className="text-[10px] font-mono text-slate-500">Sum = 1.000</span>
              </div>

              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-purple-400 font-semibold flex items-center space-x-1">
                      <Building2 className="w-3 h-3 inline mr-1" /> NDBI (Built-up)
                    </span>
                    <span className="font-mono text-white font-bold">{ndbiVal}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: `${ndbiVal}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-emerald-400 font-semibold flex items-center space-x-1">
                      <Trees className="w-3 h-3 inline mr-1" /> NDVI (Vegetation)
                    </span>
                    <span className="font-mono text-white font-bold">{ndviVal}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${ndviVal}%` }} />
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Integration Status Footer */}
        <div className="p-3 bg-slate-950/80 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
          <div className="flex items-center space-x-1 text-cyan-400 font-semibold">
            <Info className="w-3.5 h-3.5 shrink-0" />
            <span>Research Platform Status</span>
          </div>
          <p className="leading-tight text-slate-400">
            {backendConnected
              ? "Live connection active with FastAPI backend. Consuming real satellite rasters & research statistics."
              : "API backend offline. Start uvicorn backend.app.main:app to stream research data."}
          </p>
        </div>
      </div>
    </div>
  );
};
