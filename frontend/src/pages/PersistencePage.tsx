import React, { useEffect, useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { MapWorkspace } from '../components/map/MapWorkspace';
import { MapDisplayControls } from '../components/controls/MapDisplayControls';
import { StatCard } from '../components/common/StatCard';
import {
  GitCommit,
  Flame,
  ShieldCheck,
  Sliders,
  ChevronRight,
  Info,
  Calendar,
  Layers,
  Percent
} from 'lucide-react';

export const PersistencePage: React.FC = () => {
  const {
    activeLayer,
    setActiveLayer,
    persistenceStats,
    isLoadingStats,
    backendConnected
  } = useAppStore();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Set active layer to persistence when mounted
  useEffect(() => {
    if (activeLayer !== 'persistence') {
      setActiveLayer('persistence');
    }
  }, [activeLayer, setActiveLayer]);

  // Aggregate stats from categories
  const cat5 = persistenceStats?.categories?.find((c) => c.category.includes('Category 5') || c.category.includes('Persistent'));
  const cat4 = persistenceStats?.categories?.find((c) => c.category.includes('Category 4') || c.category.includes('High'));
  const cat3 = persistenceStats?.categories?.find((c) => c.category.includes('Category 3') || c.category.includes('Moderate'));
  const cat1 = persistenceStats?.categories?.find((c) => c.category.includes('Category 1') || c.category.includes('Never') || c.category.includes('None'));

  const chronicArea = cat5?.area_km2 ?? 8.806;
  const chronicPct = cat5?.percentage ?? 9.40;
  const modHighArea = ((cat4?.area_km2 ?? 0.544) + (cat3?.area_km2 ?? 0.835)).toFixed(2);
  const neverArea = cat1?.area_km2 ?? 81.795;
  const totalDomain = persistenceStats?.total_built_area_km2 ?? 93.657;

  return (
    <div className="flex h-full w-full overflow-hidden relative">
      {/* Interactive Map Area (Reusing MapWorkspace with static key and no timeline) */}
      <MapWorkspace showTimeline={false} className="flex-1">
        {/* Toggle Sidebar Button */}
        <div className="absolute top-14 left-3 z-[1000]">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white/95 border border-slate-200/80 backdrop-blur-md shadow-card text-xs font-semibold text-slate-700 hover:text-teal-700 hover:bg-slate-50 transition-colors"
            title={isSidebarOpen ? "Collapse Persistence Analytics Panel" : "Expand Persistence Analytics Panel"}
          >
            <Sliders className="w-3.5 h-3.5 text-teal-600" />
            <span>{isSidebarOpen ? "Hide Analytics" : "Show Analytics"}</span>
          </button>
        </div>
      </MapWorkspace>

      {/* Heat Persistence Analytical Sidebar */}
      {isSidebarOpen && (
        <aside className="w-80 sm:w-96 bg-white border-l border-slate-200/80 flex flex-col h-full shrink-0 select-none z-30 shadow-floating lg:shadow-xs transition-all duration-200 absolute lg:relative inset-y-0 right-0">
          {/* Header */}
          <div className="p-3.5 border-b border-slate-200/80 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-lg bg-red-100 text-red-600">
                <GitCommit className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Heat Persistence Explorer</h2>
                <p className="text-[10px] text-slate-500 font-medium">Multi-Temporal Hotspot Recurrence (8 Dates)</p>
              </div>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
              title="Collapse panel"
              aria-label="Collapse panel"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-4">
            {/* Active Context Banner */}
            <div className="bg-slate-50/90 p-3 rounded-xl border border-slate-200/80 space-y-2 shadow-2xs">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Temporal Window:</span>
                </span>
                <span className="font-mono font-bold text-slate-900">April 1 – May 27, 2023</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Observation Depth:</span>
                <span className="text-teal-700 font-semibold">8 Satellite Scenes (Path 144, Row 51)</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Static Tile Key:</span>
                <span className="font-mono text-xs font-bold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-md border border-teal-200">
                  categorical
                </span>
              </div>
            </div>

            {/* Core Persistence Metrics */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1 flex items-center justify-between">
                <span>Spatial Recurrence Summary</span>
                <span className="font-mono text-[10px] text-teal-700">Domain: {totalDomain} km²</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <StatCard
                  title="Chronic Hotspots"
                  value={chronicArea.toFixed(2)}
                  unit="km²"
                  subtitle=">75-100% recurrence (Category 5)"
                  icon={Flame}
                  accentColor="#ef4444"
                  isLoading={isLoadingStats}
                  isError={!backendConnected && !persistenceStats}
                />

                <StatCard
                  title="Chronic Share"
                  value={`${chronicPct.toFixed(1)}%`}
                  unit="coverage"
                  subtitle="Persistent heat anomaly footprint"
                  icon={Percent}
                  accentColor="#ea580c"
                  isLoading={isLoadingStats}
                  isError={!backendConnected && !persistenceStats}
                />

                <StatCard
                  title="Moderate / High"
                  value={modHighArea}
                  unit="km²"
                  subtitle=">25-75% recurrence (Cat 3 & 4)"
                  icon={Layers}
                  accentColor="#f59e0b"
                  isLoading={isLoadingStats}
                  isError={!backendConnected && !persistenceStats}
                />

                <StatCard
                  title="Never Hotspot"
                  value={neverArea.toFixed(2)}
                  unit="km²"
                  subtitle="0% recurrence (Category 1)"
                  icon={ShieldCheck}
                  accentColor="#10b981"
                  isLoading={isLoadingStats}
                  isError={!backendConnected && !persistenceStats}
                />
              </div>
            </div>

            {/* Recurrence Breakdown Category Table */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1">
                Recurrence Frequency Breakdown
              </div>
              <div className="bg-slate-50/70 border border-slate-200/80 rounded-xl p-2.5 space-y-2">
                {(persistenceStats?.categories || [
                  { category: "Category 5: >75-100% Recurrence (Persistent / Chronic)", area_km2: 8.806, percentage: 9.40, color_hex: "#ef4444" },
                  { category: "Category 4: >50-75% Recurrence (High)", area_km2: 0.544, percentage: 0.58, color_hex: "#fb923c" },
                  { category: "Category 3: >25-50% Recurrence (Moderate)", area_km2: 0.835, percentage: 0.89, color_hex: "#facc15" },
                  { category: "Category 2: >0-25% Recurrence (Low)", area_km2: 1.678, percentage: 1.79, color_hex: "#06b6d4" },
                  { category: "Category 1: 0% Recurrence (Never Hotspot)", area_km2: 81.795, percentage: 87.33, color_hex: "#1e293b" }
                ]).map((cat, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs p-1.5 bg-white rounded-lg border border-slate-200/70 shadow-2xs">
                    <div className="flex items-center space-x-2 min-w-0 pr-2">
                      <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: cat.color_hex }} />
                      <span className="truncate text-slate-700 font-medium text-[11px]">{cat.category}</span>
                    </div>
                    <div className="text-right shrink-0 font-mono text-[11px]">
                      <span className="font-bold text-slate-900">{cat.area_km2.toFixed(2)} km²</span>
                      <span className="text-slate-400 ml-1">({cat.percentage.toFixed(1)}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reusable Opacity & AOI Controls */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1">
                Map View Options
              </div>
              <MapDisplayControls />
            </div>

            {/* Scientific Context Card */}
            <div className="p-3.5 rounded-xl border border-teal-200 bg-teal-50/70 text-teal-900 space-y-1.5 text-xs">
              <div className="flex items-center space-x-1.5 font-bold text-teal-800">
                <Info className="w-4 h-4 text-teal-600 shrink-0" />
                <span>Structural vs Transient Thermal Anomalies</span>
              </div>
              <p className="text-[11px] leading-relaxed text-teal-900/90">
                Multi-temporal persistence integrates all 8 observation scenes to distinguish <strong>chronic structural thermal hotspots</strong> from transient temperature spikes.
              </p>
              <p className="text-[11px] leading-relaxed text-teal-900/90">
                Pixels in Category 5 (&gt;75–100% recurrence) represent high-priority urban heat intervention zones characterized by dense paved surfaces, low vegetative cover, and high thermal retention.
              </p>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
};
