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
  ChevronLeft,
  X,
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

  // Desktop defaults to open (>=768px), mobile defaults to closed (<768px)
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 768;
    }
    return true;
  });

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
      {/* Mobile Drawer Backdrop */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-[#080D18]/70 backdrop-blur-xs z-[1150] md:hidden cursor-pointer"
          aria-hidden="true"
        />
      )}

      {/* Floating Toggle Controls (Top-Left over Map) */}
      {!isSidebarOpen && (
        <div className="absolute top-3 left-3 z-[1100] flex items-center space-x-2 pointer-events-auto">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#080D18]/90 border border-[#26354A] backdrop-blur-md shadow-card text-xs font-semibold text-[#F5F7FB] hover:text-[#19D3C5] hover:bg-[#111C2E] transition-colors cursor-pointer"
            title="Open Persistence Analytics Controls"
            aria-label="Open Persistence Analytics Controls"
          >
            <Sliders className="w-3.5 h-3.5 text-[#19D3C5]" />
            <span>Persistence Controls</span>
          </button>
        </div>
      )}

      {/* COMPACT HEAT PERSISTENCE SIDEBAR (Left-Docked approx 310-320px) */}
      <aside
        className={`bg-[#0D1525] border-r border-[#26354A] flex flex-col h-full shrink-0 select-none transition-transform duration-200
          absolute md:relative inset-y-0 left-0 w-[310px] max-w-[85vw] lg:w-[320px] z-[1200] md:z-20 shadow-2xl md:shadow-none
          ${isSidebarOpen ? 'translate-x-0 pointer-events-auto' : '-translate-x-full md:hidden md:w-0 pointer-events-none'}
        `}
      >
        {/* Header */}
        <div className="p-3.5 border-b border-[#26354A] flex items-center justify-between bg-[#111C2E]">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-[#162238] text-red-400 border border-[#26354A]">
              <GitCommit className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-xs font-bold text-[#F5F7FB] uppercase tracking-wider">Heat Persistence Explorer</h2>
              <p className="text-[10px] text-[#8291A8] font-medium">Multi-Temporal Hotspot Recurrence (8 Dates)</p>
            </div>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-1 rounded-md text-[#8291A8] hover:text-[#F5F7FB] hover:bg-[#162238] transition-colors cursor-pointer"
            title="Collapse panel"
            aria-label="Collapse panel"
          >
            <ChevronLeft className="w-4 h-4 hidden md:block" />
            <X className="w-4 h-4 md:hidden" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-3.5 space-y-4">
            {/* Active Context Banner */}
            <div className="bg-[#111C2E] p-3 rounded-xl border border-[#26354A] space-y-2 shadow-2xs">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#8291A8] font-medium flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5 text-[#8291A8]" />
                  <span>Temporal Window:</span>
                </span>
                <span className="font-mono font-bold text-[#F5F7FB]">April 1 – May 27, 2023</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#8291A8] font-medium">Observation Depth:</span>
                <span className="text-[#19D3C5] font-semibold">8 Satellite Scenes (Path 144, Row 51)</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#8291A8] font-medium">Static Tile Key:</span>
                <span className="font-mono text-xs font-bold text-[#19D3C5] bg-[#162238] px-2 py-0.5 rounded-md border border-[#26354A]">
                  categorical
                </span>
              </div>
            </div>

            {/* Core Persistence Metrics */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#8291A8] px-1 flex items-center justify-between">
                <span>Spatial Recurrence Summary</span>
                <span className="font-mono text-[10px] text-[#19D3C5]" title="Valid persistence domain of 104,063 pixels with ≥4 observations across 8 dates">
                  Valid Domain: {totalDomain} km²
                </span>
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
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#8291A8] px-1">
                Recurrence Frequency Breakdown
              </div>
              <div className="bg-[#111C2E] border border-[#26354A] rounded-xl p-2.5 space-y-2">
                {(persistenceStats?.categories || [
                  { category: "Category 5: >75-100% Recurrence (Persistent / Chronic)", area_km2: 8.806, percentage: 9.40, color_hex: "#ef4444" },
                  { category: "Category 4: >50-75% Recurrence (High)", area_km2: 0.544, percentage: 0.58, color_hex: "#fb923c" },
                  { category: "Category 3: >25-50% Recurrence (Moderate)", area_km2: 0.835, percentage: 0.89, color_hex: "#facc15" },
                  { category: "Category 2: >0-25% Recurrence (Low)", area_km2: 1.678, percentage: 1.79, color_hex: "#06b6d4" },
                  { category: "Category 1: 0% Recurrence (Never Hotspot)", area_km2: 81.795, percentage: 87.33, color_hex: "#1e293b" }
                ]).map((cat, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs p-1.5 bg-[#0D1525] rounded-lg border border-[#26354A] shadow-2xs">
                    <div className="flex items-center space-x-2 min-w-0 pr-2">
                      <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: cat.color_hex }} />
                      <span className="truncate text-[#A8B5C9] font-medium text-[11px]">{cat.category}</span>
                    </div>
                    <div className="text-right shrink-0 font-mono text-[11px]">
                      <span className="font-bold text-[#F5F7FB]">{cat.area_km2.toFixed(2)} km²</span>
                      <span className="text-[#8291A8] ml-1">({cat.percentage.toFixed(1)}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reusable Opacity & AOI Controls */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#8291A8] px-1">
                Map View Options
              </div>
              <MapDisplayControls />
            </div>

            {/* Scientific Context Card */}
            <div className="p-3.5 rounded-xl border border-[#26354A] bg-[#111C2E] text-[#A8B5C9] space-y-1.5 text-xs">
              <div className="flex items-center space-x-1.5 font-bold text-[#19D3C5]">
                <Info className="w-4 h-4 text-[#19D3C5] shrink-0" />
                <span>Structural vs Transient Thermal Anomalies</span>
              </div>
              <p className="text-[11px] leading-relaxed text-[#8291A8]">
                Multi-temporal persistence integrates all 8 observation scenes to distinguish <strong>chronic structural thermal hotspots</strong> from transient temperature spikes.
              </p>
              <p className="text-[11px] leading-relaxed text-[#8291A8]">
                Pixels in Category 5 (&gt;75–100% recurrence) represent high-priority urban heat intervention zones characterized by dense paved surfaces, low vegetative cover, and high thermal retention.
              </p>
            </div>
          </div>
        </aside>

      {/* Map Workspace (Takes all remaining width) */}
      <MapWorkspace showTimeline={false} showLegend={false} isSidebarOpen={isSidebarOpen} className="flex-1 h-full" />
    </div>
  );
};
