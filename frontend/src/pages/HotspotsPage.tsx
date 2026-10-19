import React, { useEffect, useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { MapWorkspace } from '../components/map/MapWorkspace';
import { MapDisplayControls } from '../components/controls/MapDisplayControls';
import { StatCard } from '../components/common/StatCard';
import { OBSERVATION_DATES } from '../config/constants';
import {
  ShieldCheck,
  AlertTriangle,
  Cpu,
  Calendar,
  Building2,
  Percent,
  Sliders,
  ChevronRight,
  CheckCircle2,
  Activity
} from 'lucide-react';

export const HotspotsPage: React.FC = () => {
  const {
    activeLayer,
    setActiveLayer,
    selectedDate,
    zonalStats,
    hotspotStats,
    modelInfo,
    isLoadingStats,
    backendConnected
  } = useAppStore();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Default to rf_prob if activeLayer is not an ML layer
  useEffect(() => {
    if (activeLayer !== 'rf_prob' && activeLayer !== 'rf_class') {
      setActiveLayer('rf_prob');
    }
  }, [activeLayer, setActiveLayer]);

  const isProbMode = activeLayer === 'rf_prob';
  const currentDateObj = OBSERVATION_DATES.find((d) => d.date === selectedDate);

  return (
    <div className="flex h-full w-full overflow-hidden relative">
      {/* Interactive Map Area (Reusing MapWorkspace) */}
      <MapWorkspace className="flex-1">
        {/* Toggle Sidebar Button for Mobile & Compact Screens */}
        <div className="absolute top-14 left-3 z-[1000]">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-[#080D18]/90 border border-[#26354A] backdrop-blur-md shadow-card text-xs font-semibold text-[#F5F7FB] hover:text-[#19D3C5] hover:bg-[#111C2E] transition-colors"
            title={isSidebarOpen ? "Collapse ML Analytics Panel" : "Expand ML Analytics Panel"}
          >
            <Sliders className="w-3.5 h-3.5 text-[#19D3C5]" />
            <span>{isSidebarOpen ? "Hide Analytics" : "Show Analytics"}</span>
          </button>
        </div>
      </MapWorkspace>

      {/* ML Hotspots Analytical Sidebar */}
      {isSidebarOpen && (
        <aside className="w-80 sm:w-96 bg-[#0D1525] border-l border-[#26354A] flex flex-col h-full shrink-0 select-none z-30 shadow-floating lg:shadow-xs transition-all duration-200 absolute lg:relative inset-y-0 right-0">
          {/* Header */}
          <div className="p-3.5 border-b border-[#26354A] flex items-center justify-between bg-[#111C2E]">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-lg bg-[#162238] text-[#19D3C5] border border-[#26354A]">
                <Cpu className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xs font-bold text-[#F5F7FB] uppercase tracking-wider">ML Hotspot Analysis</h2>
                <p className="text-[10px] text-[#8291A8] font-medium">Random Forest Predictors (NDVI & NDBI)</p>
              </div>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="p-1 rounded-md text-[#8291A8] hover:text-[#F5F7FB] hover:bg-[#162238] transition-colors"
              title="Collapse panel"
              aria-label="Collapse panel"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-3.5 space-y-4">
            {/* Layer Mode Switcher Pills */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#8291A8] px-1">
                Select Analysis Representation
              </div>
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#111C2E] rounded-xl border border-[#26354A]">
                <button
                  onClick={() => setActiveLayer('rf_prob')}
                  className={`flex items-center justify-center space-x-1.5 py-2 px-2 rounded-lg text-xs font-semibold transition-all ${
                    isProbMode
                      ? 'bg-[#162238] text-[#19D3C5] shadow-xs border border-[#26354A]'
                      : 'text-[#8291A8] hover:text-[#F5F7FB]'
                  }`}
                >
                  <Activity className="w-3.5 h-3.5 text-red-400" />
                  <span>Probability</span>
                </button>

                <button
                  onClick={() => setActiveLayer('rf_class')}
                  className={`flex items-center justify-center space-x-1.5 py-2 px-2 rounded-lg text-xs font-semibold transition-all ${
                    !isProbMode
                      ? 'bg-[#162238] text-[#19D3C5] shadow-xs border border-[#26354A]'
                      : 'text-[#8291A8] hover:text-[#F5F7FB]'
                  }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                  <span>Classification</span>
                </button>
              </div>
            </div>

            {/* Active Context Banner */}
            <div className="bg-[#111C2E] p-3 rounded-xl border border-[#26354A] space-y-2 shadow-2xs">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#8291A8] font-medium flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5 text-[#8291A8]" />
                  <span>Observation:</span>
                </span>
                <span className="font-mono font-bold text-[#F5F7FB]">{selectedDate}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#8291A8] font-medium">Active Layer:</span>
                <span className="font-mono font-bold text-[#19D3C5] text-[11px]">
                  {isProbMode ? 'rf_prob (Continuous [0, 1])' : 'rf_class (Binary {0, 1})'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#8291A8] font-medium">Sensor:</span>
                <span className="text-[#A8B5C9] font-medium">{currentDateObj?.satellite || 'Landsat OLI/TIRS'}</span>
              </div>
            </div>

            {/* Statistics Section Based on Active Mode */}
            {isProbMode ? (
              <div className="space-y-1.5">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#8291A8] px-1 flex items-center justify-between">
                  <span>RF Probability Metrics</span>
                  <span className="font-mono text-[10px] text-[#19D3C5]">Range: [0.00, 1.00]</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <StatCard
                    title="Mean Probability"
                    value={zonalStats?.mean !== undefined ? zonalStats.mean.toFixed(3) : "0.245"}
                    unit="Prob"
                    subtitle="Zonal mean prediction confidence"
                    icon={Activity}
                    accentColor="#dc2626"
                    isLoading={isLoadingStats}
                    isError={!backendConnected && !zonalStats}
                  />

                  <StatCard
                    title="Max Probability"
                    value={zonalStats?.max !== undefined ? zonalStats.max.toFixed(3) : "0.986"}
                    unit="Prob"
                    subtitle="Peak pixel hotspot confidence"
                    icon={AlertTriangle}
                    accentColor="#b91c1c"
                    isLoading={isLoadingStats}
                    isError={!backendConnected && !zonalStats}
                  />

                  <StatCard
                    title="Min Probability"
                    value={zonalStats?.min !== undefined ? zonalStats.min.toFixed(3) : "0.002"}
                    unit="Prob"
                    subtitle="Lowest pixel confidence"
                    icon={ShieldCheck}
                    accentColor="#0284c7"
                    isLoading={isLoadingStats}
                    isError={!backendConnected && !zonalStats}
                  />

                  <StatCard
                    title="Decision Threshold"
                    value="≥ 0.500"
                    unit="Cut-off"
                    subtitle="Class 1 binary decision boundary"
                    icon={Cpu}
                    accentColor="#19D3C5"
                    isLoading={false}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-1.5">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[#8291A8] px-1 flex items-center justify-between">
                  <span>Hotspot Classification Extent</span>
                  <span className="font-mono text-[10px] text-[#19D3C5]">Binary Mask</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <StatCard
                    title="Hotspot Area"
                    value={hotspotStats?.hotspot_area_km2 !== undefined ? hotspotStats.hotspot_area_km2.toFixed(2) : "34.54"}
                    unit="km²"
                    subtitle="Class 1 (Hotspot) urban area"
                    icon={AlertTriangle}
                    accentColor="#dc2626"
                    isLoading={isLoadingStats}
                    isError={!backendConnected && !hotspotStats}
                  />

                  <StatCard
                    title="Coverage"
                    value={hotspotStats?.hotspot_percentage !== undefined ? `${hotspotStats.hotspot_percentage.toFixed(1)}%` : "26.1%"}
                    unit="percent"
                    subtitle="Share of 132.13 km² built domain"
                    icon={Percent}
                    accentColor="#ea580c"
                    isLoading={isLoadingStats}
                    isError={!backendConnected && !hotspotStats}
                  />

                  <StatCard
                    title="Non-Hotspot"
                    value={hotspotStats?.non_hotspot_area_km2 !== undefined ? hotspotStats.non_hotspot_area_km2.toFixed(2) : "97.59"}
                    unit="km²"
                    subtitle="Class 0 (Normal) urban area"
                    icon={ShieldCheck}
                    accentColor="#0284c7"
                    isLoading={isLoadingStats}
                    isError={!backendConnected && !hotspotStats}
                  />

                  <StatCard
                    title="Built Domain"
                    value={hotspotStats?.total_built_area_km2 !== undefined ? hotspotStats.total_built_area_km2.toFixed(2) : "132.13"}
                    unit="km²"
                    subtitle="Total active analysis pixels (146,810)"
                    icon={Building2}
                    accentColor="#8291A8"
                    isLoading={isLoadingStats}
                    isError={!backendConnected && !hotspotStats}
                  />
                </div>
              </div>
            )}

            {/* Locked Model Telemetry & Evaluation */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#8291A8] px-1">
                Locked Model Telemetry
              </div>
              <div className="p-3 rounded-xl border border-[#26354A] bg-[#111C2E] space-y-2 text-xs">
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span className="text-[#8291A8]">Algorithm:</span>
                  <span className="font-bold text-[#F5F7FB]">{modelInfo?.algorithm || 'RandomForestClassifier'}</span>
                </div>
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span className="text-[#8291A8]">Independent Test F1:</span>
                  <span className="font-bold text-[#19D3C5]">
                    {modelInfo?.locked_test_metrics?.f1_score ? `${(modelInfo.locked_test_metrics.f1_score * 100).toFixed(2)}%` : "86.60%"}
                  </span>
                </div>
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span className="text-[#8291A8]">Precision / Recall:</span>
                  <span className="text-[#F5F7FB]">
                    {modelInfo?.locked_test_metrics?.precision ? `${(modelInfo.locked_test_metrics.precision * 100).toFixed(1)}%` : "88.9%"} / {modelInfo?.locked_test_metrics?.recall ? `${(modelInfo.locked_test_metrics.recall * 100).toFixed(1)}%` : "84.4%"}
                  </span>
                </div>
                <div className="flex items-center justify-between font-mono text-[11px] pt-1 border-t border-[#26354A]">
                  <span className="text-[#8291A8]">Feature Importance:</span>
                  <span className="font-bold text-[#F5F7FB]">NDBI 56.9% / NDVI 43.1%</span>
                </div>
              </div>
            </div>

            {/* Map Display Options */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#8291A8] px-1">
                Map View Options
              </div>
              <MapDisplayControls />
            </div>

            {/* Scientific Integrity Notice */}
            <div className="p-3.5 rounded-xl border border-[#26354A] bg-[#111C2E] text-[#A8B5C9] space-y-1.5 text-xs">
              <div className="flex items-center space-x-1.5 font-bold text-[#19D3C5]">
                <CheckCircle2 className="w-4 h-4 text-[#19D3C5] shrink-0" />
                <span>Pseudo-Reference Label Protocol</span>
              </div>
              <p className="text-[11px] leading-relaxed text-[#8291A8]">
                Training labels were generated by identifying pixels in the top 20% (P80) of LST within each observation date. These are formally designated as <strong>pseudo-reference labels</strong>, not ground-truth field measurements.
              </p>
              <p className="text-[11px] leading-relaxed text-[#8291A8]">
                The continuous probability view enables urban planners to detect warm boundary zones (probabilities 0.40–0.50) before they transition into critical thermal hotspots.
              </p>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
};
