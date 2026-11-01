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

  // Aggregate stats from categories dynamically without legacy hardcoded fallbacks
  const cat5 = persistenceStats?.categories?.find((c) => c.category.includes('Category 5') || c.category.includes('Persistent'));
  const cat4 = persistenceStats?.categories?.find((c) => c.category.includes('Category 4') || c.category.includes('High'));
  const cat3 = persistenceStats?.categories?.find((c) => c.category.includes('Category 3') || c.category.includes('Moderate'));
  const cat1 = persistenceStats?.categories?.find((c) => c.category.includes('Category 1') || c.category.includes('Never') || c.category.includes('None'));

  const chronicArea = cat5?.area_km2 ?? null;
  const chronicPct = cat5?.percentage ?? null;
  const modHighArea = (cat4 && cat3)
    ? (cat4.area_km2 + cat3.area_km2).toFixed(2)
    : (cat4?.area_km2 ?? cat3?.area_km2)?.toFixed(2) ?? null;
  const neverArea = cat1?.area_km2 ?? null;
  const totalDomain = persistenceStats?.total_built_area_km2 ?? null;

  return (
    <div className="flex h-full w-full p-2.5 sm:p-3.5 gap-2.5 sm:gap-3.5 overflow-hidden relative z-10">
      {/* Mobile Drawer Backdrop */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-[#030611]/80 backdrop-blur-md z-[1150] md:hidden cursor-pointer"
          aria-hidden="true"
        />
      )}

      {/* Floating Toggle Controls (Top-Left over Map) */}
      {!isSidebarOpen && (
        <div className="absolute top-6 left-6 z-[1100] flex items-center space-x-2 pointer-events-auto">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl liquid-glass-chip shadow-card text-xs font-semibold text-[#F5F7FB] hover:text-[#19D3C5] focus-visible:ring-2 focus-visible:ring-[#19D3C5] focus-visible:outline-hidden transition-colors cursor-pointer"
            title="Open Persistence Analytics Controls"
            aria-label="Open Persistence Analytics Controls"
            aria-expanded={isSidebarOpen}
          >
            <Sliders className="w-3.5 h-3.5 text-[#19D3C5]" />
            <span>Persistence Controls</span>
          </button>
        </div>
      )}

      {/* COMPACT HEAT PERSISTENCE SIDEBAR (Floating Liquid-Glass Console) */}
      <aside
        className={`liquid-glass-slab rounded-2xl border border-white/15 shadow-2xl flex flex-col h-full shrink-0 select-none transition-transform duration-200 overflow-hidden
          fixed md:relative inset-y-2.5 sm:inset-y-3.5 left-2.5 sm:left-3.5 md:left-0 md:inset-y-0 w-[310px] max-w-[85vw] lg:w-[325px] z-[1200] md:z-20
          ${isSidebarOpen ? 'translate-x-0 pointer-events-auto' : '-translate-x-full md:hidden md:w-0 pointer-events-none'}
        `}
      >
        {/* Header */}
        <div className="p-3.5 border-b border-white/10 flex items-center justify-between bg-white/[0.02] shrink-0">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg liquid-glass-chip text-amber-400 border border-white/15 shadow-[0_0_10px_rgba(245,158,11,0.2)]">
              <GitCommit className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-xs font-bold text-[#F5F7FB] uppercase tracking-wider leading-snug">
                Heat Persistence Explorer
              </h1>
              <p className="text-[10px] text-[#8291A8] font-medium leading-tight">
                Multi-Temporal Hotspot Recurrence (8 Dates)
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="p-1.5 rounded-lg text-[#8291A8] hover:text-[#F5F7FB] hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-[#19D3C5] focus-visible:outline-hidden transition-colors cursor-pointer"
            title="Collapse sidebar"
            aria-label="Collapse sidebar"
            aria-expanded={isSidebarOpen}
          >
            <ChevronLeft className="w-4 h-4 hidden md:block" />
            <X className="w-4 h-4 md:hidden" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-3.5 space-y-4 min-h-0">
            {/* Active Context Banner */}
            <div className="liquid-glass-subtle p-3 rounded-xl space-y-2 shadow-2xs">
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
                <span className="font-mono text-xs font-bold text-[#19D3C5] bg-white/[0.08] px-2 py-0.5 rounded-md border border-white/15">
                  categorical
                </span>
              </div>
            </div>

            {/* Core Persistence Metrics */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#8291A8] px-1 flex items-center justify-between">
                <span>Spatial Recurrence Summary</span>
                <span className="font-mono text-[10px] text-[#19D3C5]" title={totalDomain !== null ? `Valid persistence domain of ${totalDomain.toFixed(3)} km² with ≥4 observations across 8 dates` : "Valid persistence domain"}>
                  Valid Domain: {totalDomain !== null ? `${totalDomain.toFixed(3)} km²` : '--'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <StatCard
                  title="Chronic Hotspots"
                  value={chronicArea !== null ? chronicArea.toFixed(2) : '--'}
                  unit="km²"
                  subtitle=">75-100% recurrence (Category 5)"
                  icon={Flame}
                  accentColor="#ef4444"
                  isLoading={isLoadingStats}
                  isError={!backendConnected && !persistenceStats}
                />

                <StatCard
                  title="Chronic Share"
                  value={chronicPct !== null ? chronicPct.toFixed(1) : '--'}
                  unit="%"
                  subtitle={totalDomain !== null ? `Share of ${totalDomain.toFixed(2)} km² valid domain` : "Share of valid domain"}
                  icon={Percent}
                  accentColor="#ea580c"
                  isLoading={isLoadingStats}
                  isError={!backendConnected && !persistenceStats}
                />

                <StatCard
                  title="Moderate / High"
                  value={modHighArea !== null ? modHighArea : '--'}
                  unit="km²"
                  subtitle=">25-75% recurrence (Cat 3 & 4)"
                  icon={Layers}
                  accentColor="#f59e0b"
                  isLoading={isLoadingStats}
                  isError={!backendConnected && !persistenceStats}
                />

                <StatCard
                  title="Never Hotspot"
                  value={neverArea !== null ? neverArea.toFixed(2) : '--'}
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
              <div className="liquid-glass-subtle rounded-xl p-2.5 space-y-2">
                {persistenceStats?.categories?.map((cat, idx) => {
                  const parts = cat.category.split('(');
                  const tierName = parts[0].trim();
                  const desc = parts.length > 1 ? `(${parts.slice(1).join('(')}` : null;
                  return (
                    <div key={idx} className="p-2 bg-white/[0.04] rounded-lg border border-white/10 shadow-2xs space-y-1">
                      <div className="flex items-start justify-between text-xs gap-1.5">
                        <div className="flex items-center space-x-2 min-w-0 flex-1">
                          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color_hex }} />
                          <span className="text-[#F5F7FB] font-semibold text-[11px] leading-tight break-words">{tierName}</span>
                        </div>
                        <div className="text-right shrink-0 font-mono text-[11px]">
                          <span className="font-bold text-[#19D3C5]">{cat.area_km2.toFixed(2)} km²</span>
                          <span className="text-[#8291A8] ml-1">({cat.percentage.toFixed(1)}%)</span>
                        </div>
                      </div>
                      {desc && (
                        <div className="text-[10px] text-[#8291A8] pl-4.5 leading-tight break-words">
                          {desc}
                        </div>
                      )}
                    </div>
                  );
                })}
                {(!persistenceStats || !persistenceStats.categories || persistenceStats.categories.length === 0) && (
                  <div className="text-center text-xs text-[#8291A8] py-3">
                    {isLoadingStats ? "Loading recurrence distributions..." : "Persistence statistics unavailable."}
                  </div>
                )}
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
            <div className="p-3.5 rounded-xl border border-white/10 bg-white/[0.03] text-[#A8B5C9] space-y-1.5 text-xs">
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
      <MapWorkspace showTimeline={false} showLegend={true} isSidebarOpen={isSidebarOpen} className="flex-1 h-full" />
    </div>
  );
};
