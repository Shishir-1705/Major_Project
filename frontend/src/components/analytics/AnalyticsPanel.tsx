import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { LAYERS, OBSERVATION_DATES } from '../../config/constants';
import { ModelInfoCard } from './ModelInfoCard';
import { StatCard } from '../common/StatCard';
import { Flame, Trees, Building2, ShieldCheck, BarChart2, Info, AlertTriangle, ChevronRight } from 'lucide-react';

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
    modelInfo,
    isAnalyticsOpen,
    toggleAnalytics
  } = useAppStore();

  const currentLayer = LAYERS.find((l) => l.id === activeLayer);
  const currentDateObj = OBSERVATION_DATES.find((d) => d.date === selectedDate);

  if (!isAnalyticsOpen) {
    return null;
  }

  return (
    <aside className="w-80 sm:w-88 bg-[#0D1525] border-l border-[#26354A] flex flex-col h-full shrink-0 select-none z-30 shadow-floating lg:shadow-xs transition-all duration-200 absolute lg:relative inset-y-0 right-0">
      {/* Panel Header */}
      <div className="p-3.5 border-b border-[#26354A] flex items-center justify-between bg-[#111C2E]">
        <div className="flex items-center space-x-2">
          <BarChart2 className="w-4 h-4 text-[#19D3C5]" />
          <h2 className="text-xs font-bold text-[#F5F7FB] uppercase tracking-wider">Spatial Analytics & Model</h2>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-[#162238] text-[#19D3C5] border border-[#26354A]">
            Mysuru AOI
          </span>
          <button
            onClick={toggleAnalytics}
            className="p-1 rounded-md text-[#8291A8] hover:text-[#F5F7FB] hover:bg-[#162238] transition-colors"
            title="Collapse analytics"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Analytics Content Scrollable Body */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-4">
        {/* Active Context Banner */}
        <div className="bg-[#111C2E] p-3 rounded-xl border border-[#26354A] space-y-1.5 shadow-2xs">
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#8291A8] font-medium">Observation Date:</span>
            <span className="font-mono font-bold text-[#F5F7FB]">{selectedDate}</span>
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="text-[#8291A8] font-medium">Satellite Sensor:</span>
            <span className="text-[#19D3C5] font-semibold">{currentDateObj?.satellite || 'Landsat OLI/TIRS'}</span>
          </div>
          <div className="flex items-center justify-between text-xs pt-1.5 border-t border-[#26354A]">
            <span className="text-[#8291A8] font-medium shrink-0">Active Layer:</span>
            <span className="text-[#F5F7FB] font-bold break-words text-right">{currentLayer?.shortName}</span>
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
            accentColor="#8b5cf6"
            isLoading={isLoadingStats}
            isError={!backendConnected && !metadata}
            errorMessage="Metadata offline"
          />

          <StatCard
            title="Zonal Mean"
            value={(() => {
              if (!zonalStats) return activeLayer === 'lst' ? "43.14" : "0.00";
              if (activeLayer === 'rf_prob' || activeLayer === 'persistence' || activeLayer === 'ndvi' || activeLayer === 'ndbi') {
                return zonalStats.mean.toFixed(3);
              }
              return zonalStats.mean.toFixed(2);
            })()}
            unit={(() => {
              if (zonalStats?.unit) return zonalStats.unit;
              switch (activeLayer) {
                case 'lst': return '°C';
                case 'rf_prob': return 'Prob';
                case 'rf_class': return 'Class';
                case 'ndvi':
                case 'ndbi': return '';
                case 'persistence': return 'Recurrence';
                case 'gi_star': return 'z-score';
                default: return currentLayer?.unit || '';
              }
            })()}
            subtitle={(() => {
              if (!zonalStats) return "Valid raster domain";
              switch (activeLayer) {
                case 'lst':
                  return `Min: ${zonalStats.min.toFixed(1)}°C / Max: ${zonalStats.max.toFixed(1)}°C`;
                case 'rf_prob':
                  return `Min: ${zonalStats.min.toFixed(3)} / Max: ${zonalStats.max.toFixed(3)} (0–1)`;
                case 'rf_class':
                  return `Min: ${zonalStats.min.toFixed(0)} / Max: ${zonalStats.max.toFixed(0)} (Binary)`;
                case 'ndvi':
                case 'ndbi':
                  return `Min: ${zonalStats.min.toFixed(2)} / Max: ${zonalStats.max.toFixed(2)}`;
                case 'persistence':
                  return `Min: ${zonalStats.min.toFixed(2)} / Max: ${zonalStats.max.toFixed(2)} (0–1)`;
                case 'gi_star':
                  return `Min: ${zonalStats.min.toFixed(2)} / Max: ${zonalStats.max.toFixed(2)} (z-score)`;
                default:
                  return `Min: ${zonalStats.min} / Max: ${zonalStats.max}`;
              }
            })()}
            icon={(() => {
              switch (activeLayer) {
                case 'lst': return Flame;
                case 'ndvi': return Trees;
                case 'ndbi': return Building2;
                case 'rf_class': return AlertTriangle;
                default: return BarChart2;
              }
            })()}
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
            accentColor="#19D3C5"
            isError={!backendConnected && !modelInfo}
            errorMessage="Telemetry offline"
          />
        </div>

        {/* Dynamic Categorical Persistence Stats (if active layer is persistence) */}
        {activeLayer === 'persistence' && persistenceStats && (
          <div className="bg-[#111C2E] border border-[#26354A] rounded-xl p-3.5 space-y-2.5 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-[#F5F7FB] uppercase tracking-wider">Hotspot Persistence Breakdown</h4>
                <span className="text-[10px] font-mono text-[#8291A8] block">Domain: Multi-temporal persistence ({persistenceStats.total_built_area_km2} km²)</span>
              </div>
            </div>
            <div className="space-y-1.5 text-xs">
              {persistenceStats.categories.map((cat) => (
                <div key={cat.category} className="bg-[#0D1525] p-2 rounded-lg border border-[#26354A] space-y-1 shadow-2xs">
                  <div className="flex justify-between font-medium items-start gap-2">
                    <span className="text-[#A8B5C9] flex items-center space-x-1.5 min-w-0">
                      <span className="w-2.5 h-2.5 rounded-full inline-block shrink-0" style={{ backgroundColor: cat.color_hex }} />
                      <span className="break-words">{cat.category}</span>
                    </span>
                    <span className="font-mono text-[#F5F7FB] font-bold shrink-0">{cat.area_km2} km² ({cat.percentage}%)</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dynamic Gi* Cluster Stats (if active layer is gi_star) */}
        {activeLayer === 'gi_star' && giStarStats && (
          <div className="bg-[#111C2E] border border-[#26354A] rounded-xl p-3.5 space-y-2.5 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-bold text-[#F5F7FB] uppercase tracking-wider">Getis-Ord Gi* Clusters</h4>
                <span className="text-[10px] font-mono text-[#8291A8] block">Domain: Gi* spatial analysis ({giStarStats.total_built_area_km2} km²)</span>
              </div>
            </div>
            <div className="space-y-1.5 text-xs">
              {giStarStats.clusters.map((cls) => (
                <div key={cls.cluster_type} className="bg-[#0D1525] p-2 rounded-lg border border-[#26354A] space-y-1 shadow-2xs">
                  <div className="flex justify-between font-medium">
                    <span className="text-[#A8B5C9] flex items-center space-x-1.5">
                      <span className="w-2.5 h-2.5 rounded-full inline-block shrink-0" style={{ backgroundColor: cls.color_hex }} />
                      <span>{cls.cluster_type}</span>
                    </span>
                    <span className="font-mono text-[#F5F7FB] font-bold">{cls.area_km2} km² ({cls.percentage}%)</span>
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
            <div className="bg-[#111C2E] border border-[#26354A] rounded-xl p-3.5 space-y-2.5 shadow-xs">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-[#F5F7FB] uppercase tracking-wider">Gini Feature Attribution</h4>
                <span className="text-[10px] font-mono text-[#8291A8] font-medium">Sum = 1.000</span>
              </div>

              <div className="space-y-2.5">
                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-purple-400 font-semibold flex items-center space-x-1">
                      <Building2 className="w-3.5 h-3.5 inline mr-1 text-purple-400" /> NDBI (Built-up)
                    </span>
                    <span className="font-mono text-[#F5F7FB] font-bold">{ndbiVal}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-[#162238] overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full transition-all" style={{ width: `${ndbiVal}%` }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-emerald-400 font-semibold flex items-center space-x-1">
                      <Trees className="w-3.5 h-3.5 inline mr-1 text-emerald-400" /> NDVI (Vegetation)
                    </span>
                    <span className="font-mono text-[#F5F7FB] font-bold">{ndviVal}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-[#162238] overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${ndviVal}%` }} />
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Integration Status Footer */}
        <div className="p-3 bg-[#111C2E] rounded-xl border border-[#26354A] text-[11px] text-[#A8B5C9] space-y-1">
          <div className="flex items-center space-x-1 text-[#19D3C5] font-semibold">
            <Info className="w-3.5 h-3.5 shrink-0 text-[#19D3C5]" />
            <span>Research Platform Status</span>
          </div>
          <p className="leading-tight text-[#8291A8]">
            {backendConnected
              ? "Live connection active with FastAPI backend. Consuming real satellite rasters & research statistics."
              : "API backend offline. Start uvicorn backend.app.main:app to stream research data."}
          </p>
        </div>
      </div>
    </aside>
  );
};
