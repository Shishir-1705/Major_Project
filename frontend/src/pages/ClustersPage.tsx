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

  const hot90 = giStarStats?.clusters?.find((c) => c.confidence_level === '90%');
  const notSig = giStarStats?.clusters?.find((c) => c.cluster_type.includes('Not Significant'));

  const hot90Area = hot90?.area_km2 ?? 8.856;
  const hot90Pct = hot90?.percentage ?? 9.46;
  const notSigArea = notSig?.area_km2 ?? 84.801;
  const totalDomain = giStarStats?.total_built_area_km2 ?? 93.657;

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
            title="Open Spatial Clustering Controls"
            aria-label="Open Spatial Clustering Controls"
          >
            <Sliders className="w-3.5 h-3.5 text-[#19D3C5]" />
            <span>Cluster Controls</span>
          </button>
        </div>
      )}

      {/* COMPACT GI* CLUSTERS SIDEBAR (Left-Docked approx 310-320px) */}
      <aside
        className={`bg-[#0D1525] border-r border-[#26354A] flex flex-col h-full shrink-0 select-none transition-transform duration-200
          absolute md:relative inset-y-0 left-0 w-[310px] max-w-[85vw] lg:w-[320px] z-[1200] md:z-20 shadow-2xl md:shadow-none
          ${isSidebarOpen ? 'translate-x-0 pointer-events-auto' : '-translate-x-full md:hidden md:w-0 pointer-events-none'}
        `}
      >
        {/* Header */}
        <div className="p-3.5 border-b border-[#26354A] flex items-center justify-between bg-[#111C2E] shrink-0">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-[#162238] text-orange-400 border border-[#26354A]">
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
            className="p-1.5 rounded-lg text-[#8291A8] hover:text-[#F5F7FB] hover:bg-[#162238] transition-colors cursor-pointer"
            title="Collapse sidebar"
            aria-label="Collapse sidebar"
          >
            <ChevronLeft className="w-4 h-4 hidden md:block" />
            <X className="w-4 h-4 md:hidden" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-3.5 space-y-4 min-h-0">
            {/* Active Context Banner */}
            <div className="bg-[#111C2E] p-3 rounded-xl border border-[#26354A] space-y-2 shadow-2xs">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#8291A8] font-medium flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5 text-[#8291A8]" />
                  <span>Analysis Domain:</span>
                </span>
                <span className="font-mono font-bold text-[#F5F7FB]">{totalDomain} km²</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#8291A8] font-medium">Spatial Statistic:</span>
                <span className="text-[#19D3C5] font-semibold">Standardized Gi* z-scores</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#8291A8] font-medium">Static Tile Key:</span>
                <span className="font-mono text-xs font-bold text-[#19D3C5] bg-[#162238] px-2 py-0.5 rounded-md border border-[#26354A]">
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
                  title="Hotspot Cluster"
                  value={hot90Area.toFixed(2)}
                  unit="km²"
                  subtitle="Significant cluster (pFDR < 0.05)"
                  icon={AlertTriangle}
                  accentColor="#f46d43"
                  isLoading={isLoadingStats}
                  isError={!backendConnected && !giStarStats}
                />

                <StatCard
                  title="Cluster Share"
                  value={hot90Pct.toFixed(1)}
                  unit="%"
                  subtitle="Statistically significant core"
                  icon={Percent}
                  accentColor="#ea580c"
                  isLoading={isLoadingStats}
                  isError={!backendConnected && !giStarStats}
                />

                <StatCard
                  title="Not Significant"
                  value={notSigArea.toFixed(2)}
                  unit="km²"
                  subtitle="Random spatial distribution"
                  icon={ShieldCheck}
                  accentColor="#8291A8"
                  isLoading={isLoadingStats}
                  isError={!backendConnected && !giStarStats}
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
              <div className="bg-[#111C2E] border border-[#26354A] rounded-xl p-2.5 space-y-2">
                {(giStarStats?.clusters || [
                  { cluster_type: "Hotspot Cluster (pFDR < 0.05)", confidence_level: "pFDR < 0.05", area_km2: 8.856, percentage: 9.46, color_hex: "#f46d43" },
                  { cluster_type: "Not Significant (pFDR ≥ 0.05)", confidence_level: "pFDR ≥ 0.05", area_km2: 84.801, percentage: 90.54, color_hex: "#1e293b" }
                ])
                  .filter((c) => c.area_km2 > 0 || c.cluster_type.includes('Not Significant') || c.cluster_type.includes('Hotspot'))
                  .map((c, idx) => {
                    const label = c.cluster_type.includes('90%') || c.cluster_type === 'Hotspot Cluster'
                      ? 'Hotspot Cluster (pFDR < 0.05)'
                      : c.cluster_type.includes('Not Significant')
                      ? 'Not Significant (pFDR ≥ 0.05)'
                      : c.cluster_type;
                    return (
                      <div key={idx} className="flex items-center justify-between text-xs p-2 bg-[#0D1525] rounded-lg border border-[#26354A] shadow-2xs gap-2">
                        <div className="flex items-center space-x-2 min-w-0 flex-1">
                          <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: c.color_hex }} />
                          <span className="text-[#F5F7FB] font-medium text-[11px] leading-tight break-words">{label}</span>
                        </div>
                        <div className="text-right shrink-0 font-mono text-[11px]">
                          <span className="font-bold text-[#19D3C5]">{c.area_km2.toFixed(2)} km²</span>
                          <span className="text-[#8291A8] ml-1">({c.percentage.toFixed(1)}%)</span>
                        </div>
                      </div>
                    );
                  })}
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
            <div className="p-3.5 rounded-xl border border-[#26354A] bg-[#111C2E] text-[#A8B5C9] space-y-1.5 text-xs">
              <div className="flex items-center space-x-1.5 font-bold text-[#19D3C5]">
                <CheckCircle2 className="w-4 h-4 text-[#19D3C5] shrink-0" />
                <span>Spatial Autocorrelation Corroboration</span>
              </div>
              <p className="text-[11px] leading-relaxed text-[#8291A8]">
                The Getis-Ord $G_i^*$ statistic evaluates whether high thermal values cluster in space more than expected by random chance.
              </p>
              <p className="text-[11px] leading-relaxed text-[#8291A8]">
                The identified <strong>8.86 km² (9.46%)</strong> statistically significant hot spot cluster (Benjamini-Hochberg FDR pFDR &lt; 0.05) precisely mirrors the <strong>8.81 km² (9.40%)</strong> Category 5 chronic persistence zone in central Mysuru, providing rigorous statistical proof of localized thermal intensification.
              </p>
            </div>
          </div>
        </aside>

      {/* Map Workspace (Takes all remaining width) */}
      <MapWorkspace showTimeline={false} showLegend={true} isSidebarOpen={isSidebarOpen} className="flex-1 h-full" />
    </div>
  );
};
