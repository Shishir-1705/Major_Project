import React, { useEffect, useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { MapWorkspace } from '../components/map/MapWorkspace';
import { MapDisplayControls } from '../components/controls/MapDisplayControls';
import { StatCard } from '../components/common/StatCard';
import {
  BarChart2,
  AlertTriangle,
  ShieldCheck,
  Sliders,
  ChevronLeft,
  X,
  Calendar,
  Percent,
  CheckCircle2
} from 'lucide-react';

export const ClustersPage: React.FC = () => {
  const {
    activeLayer,
    setActiveLayer,
    giStarStats,
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

  // Set active layer to gi_star when mounted
  useEffect(() => {
    if (activeLayer !== 'gi_star') {
      setActiveLayer('gi_star');
    }
  }, [activeLayer, setActiveLayer]);

  // Robust matching of cluster categories from current statistics API
  const hotSig = giStarStats?.clusters?.find((c) => {
    const t = c.cluster_type.toLowerCase();
    return t.includes('hotspot') || t.includes('hot');
  });

  const coldSig = giStarStats?.clusters?.find((c) => {
    const t = c.cluster_type.toLowerCase();
    return t.includes('coldspot') || t.includes('cold');
  });

  const notSig = giStarStats?.clusters?.find((c) => {
    const t = c.cluster_type.toLowerCase();
    return (t.includes('not') && t.includes('significant')) || t.includes('ns');
  });

  // Extract dynamic values - strictly NO legacy hardcoded fallbacks
  const hasStats = Boolean(giStarStats && giStarStats.clusters && giStarStats.clusters.length > 0);
  const totalDomain = giStarStats?.total_built_area_km2 ?? null;

  const sigHotspotArea = hotSig?.area_km2 ?? null;
  const sigHotspotPct = hotSig?.percentage ?? null;

  const sigColdspotArea = coldSig?.area_km2 ?? null;
  const sigColdspotPct = coldSig?.percentage ?? null;

  const notSigArea = notSig?.area_km2 ?? null;

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
            title="Open Spatial Clustering Controls"
            aria-label="Open Spatial Clustering Controls"
            aria-expanded={isSidebarOpen}
          >
            <Sliders className="w-3.5 h-3.5 text-[#19D3C5]" />
            <span>Cluster Controls</span>
          </button>
        </div>
      )}

      {/* COMPACT GI* CLUSTERS SIDEBAR (Floating Liquid-Glass Console) */}
      <aside
        className={`liquid-glass-slab rounded-2xl border border-white/15 shadow-2xl flex flex-col h-full shrink-0 select-none transition-transform duration-200 overflow-hidden
          fixed md:relative inset-y-2.5 sm:inset-y-3.5 left-2.5 sm:left-3.5 md:left-0 md:inset-y-0 w-[310px] max-w-[85vw] lg:w-[325px] z-[1200] md:z-20
          ${isSidebarOpen ? 'translate-x-0 pointer-events-auto' : '-translate-x-full md:hidden md:w-0 pointer-events-none'}
        `}
      >
        {/* Header */}
        <div className="p-3.5 border-b border-white/10 flex items-center justify-between bg-white/[0.02] shrink-0">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg liquid-glass-chip text-sky-400 border border-white/15 shadow-[0_0_10px_rgba(56,189,248,0.2)]">
              <BarChart2 className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-xs font-bold text-[#F5F7FB] uppercase tracking-wider leading-snug">
                Getis-Ord Gi* Clusters
              </h1>
              <p className="text-[10px] text-[#8291A8] font-medium leading-tight">
                Benjamini-Hochberg FDR-Adjusted Local Statistics
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
                  <span>Valid Analysis Domain:</span>
                </span>
                <span className="font-mono font-bold text-[#F5F7FB]">
                  {totalDomain !== null ? `${totalDomain.toFixed(3)} km²` : '--'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#8291A8] font-medium">Study Area Extent:</span>
                <span className="font-mono text-xs text-[#8291A8]">461.50 km² AOI Envelope</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#8291A8] font-medium">Spatial Statistic:</span>
                <span className="text-[#19D3C5] font-semibold">Standardized Gi* z-scores</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#8291A8] font-medium">Static Tile Key:</span>
                <span className="font-mono text-xs font-bold text-[#19D3C5] bg-white/[0.08] px-2 py-0.5 rounded-md border border-white/15">
                  clustering
                </span>
              </div>
            </div>

            {/* Core Clustering Metrics */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#8291A8] px-1 flex items-center justify-between">
                <span>Cluster Distribution</span>
                <span className="font-mono text-[10px] text-[#19D3C5]">Benjamini-Hochberg FDR (pFDR &lt; 0.05)</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <StatCard
                  title="Significant Hotspot"
                  value={sigHotspotArea !== null ? sigHotspotArea.toFixed(2) : '--'}
                  unit="km²"
                  subtitle="Significant cluster (pFDR < 0.05)"
                  icon={AlertTriangle}
                  accentColor="#f46d43"
                  isLoading={isLoadingStats}
                  isError={!backendConnected && !hasStats}
                />

                <StatCard
                  title="Cluster Share"
                  value={sigHotspotPct !== null ? sigHotspotPct.toFixed(1) : '--'}
                  unit="%"
                  subtitle={totalDomain !== null ? `Share of ${totalDomain.toFixed(2)} km² valid domain` : "Share of valid domain"}
                  icon={Percent}
                  accentColor="#ea580c"
                  isLoading={isLoadingStats}
                  isError={!backendConnected && !hasStats}
                />

                <StatCard
                  title="Significant Coldspot"
                  value={sigColdspotArea !== null ? sigColdspotArea.toFixed(2) : '--'}
                  unit="km²"
                  subtitle="Significant cold cluster (pFDR < 0.05)"
                  icon={ShieldCheck}
                  accentColor="#38bdf8"
                  isLoading={isLoadingStats}
                  isError={!backendConnected && !hasStats}
                />

                <StatCard
                  title="Coldspot Share"
                  value={sigColdspotPct !== null ? sigColdspotPct.toFixed(1) : '--'}
                  unit="%"
                  subtitle={totalDomain !== null ? `Share of ${totalDomain.toFixed(2)} km² valid domain` : "Share of valid domain"}
                  icon={Percent}
                  accentColor="#0284c7"
                  isLoading={isLoadingStats}
                  isError={!backendConnected && !hasStats}
                />

                <StatCard
                  title="Not Significant"
                  value={notSigArea !== null ? notSigArea.toFixed(2) : '--'}
                  unit="km²"
                  subtitle="Not statistically significant at FDR-adjusted p < 0.05."
                  icon={ShieldCheck}
                  accentColor="#8291A8"
                  isLoading={isLoadingStats}
                  isError={!backendConnected && !hasStats}
                />

                <StatCard
                  title="Significance Threshold"
                  value="pFDR < 0.05"
                  subtitle="FDR-corrected α = 0.05"
                  icon={BarChart2}
                  accentColor="#19D3C5"
                  isLoading={false}
                />
              </div>
            </div>

            {/* Cluster Significance Breakdown Table */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#8291A8] px-1">
                Statistical Significance Breakdown
              </div>
              <div className="liquid-glass-subtle rounded-xl p-2.5 space-y-2">
                {giStarStats?.clusters?.map((c, idx) => {
                  const isCold = c.cluster_type.toLowerCase().includes('cold');
                  const badgeColor = isCold ? '#38bdf8' : c.color_hex;
                  return (
                    <div key={idx} className="flex items-center justify-between text-xs p-2 bg-white/[0.04] rounded-lg border border-white/10 shadow-2xs gap-2">
                      <div className="flex items-center space-x-2 min-w-0 flex-1">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: badgeColor }} />
                        <span className="text-[#F5F7FB] font-medium text-[11px] leading-tight break-words">{c.cluster_type}</span>
                      </div>
                      <div className="text-right shrink-0 font-mono text-[11px]">
                        <span className="font-bold text-[#19D3C5]">{c.area_km2.toFixed(2)} km²</span>
                        <span className="text-[#8291A8] ml-1">({c.percentage.toFixed(1)}%)</span>
                      </div>
                    </div>
                  );
                })}
                {(!giStarStats || !giStarStats.clusters || giStarStats.clusters.length === 0) && (
                  <div className="text-center text-xs text-[#8291A8] py-3">
                    {isLoadingStats ? "Loading cluster distributions..." : "Cluster statistics unavailable."}
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

            {/* Spatial Corroboration Card */}
            <div className="p-3.5 rounded-xl border border-white/10 bg-white/[0.03] text-[#A8B5C9] space-y-1.5 text-xs">
              <div className="flex items-center space-x-1.5 font-bold text-[#19D3C5]">
                <CheckCircle2 className="w-4 h-4 text-[#19D3C5] shrink-0" />
                <span>Spatial Autocorrelation Corroboration</span>
              </div>
              <p className="text-[11px] leading-relaxed text-[#8291A8]">
                The Getis-Ord $G_i^*$ statistic evaluates whether high thermal values cluster in space more than expected by random chance.
              </p>
              <p className="text-[11px] leading-relaxed text-[#8291A8]">
                {sigHotspotArea !== null && sigHotspotPct !== null ? (
                  <>
                    The identified <strong className="text-[#F5F7FB]">{sigHotspotArea.toFixed(2)} km² ({sigHotspotPct.toFixed(1)}%)</strong> statistically significant hotspot cluster (Benjamini-Hochberg FDR pFDR &lt; 0.05) corroborates zones of elevated thermal persistence across Mysuru, providing rigorous statistical proof of localized thermal intensification beyond spatial randomness.
                  </>
                ) : (
                  <>
                    Statistically significant hotspot clusters (Benjamini-Hochberg FDR pFDR &lt; 0.05) corroborate zones of elevated thermal persistence across Mysuru, providing rigorous statistical proof of localized thermal intensification beyond spatial randomness.
                  </>
                )}
              </p>
            </div>
        </div>
      </aside>

      {/* Map Workspace (Takes all remaining width) */}
      <MapWorkspace showTimeline={false} showLegend={true} isSidebarOpen={isSidebarOpen} className="flex-1 h-full" />
    </div>
  );
};
