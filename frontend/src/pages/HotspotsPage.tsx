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
  ChevronLeft,
  ChevronRight,
  X,
  CheckCircle2,
  Activity
} from 'lucide-react';

export const HotspotsPage: React.FC = () => {
  const {
    activeLayer,
    setActiveLayer,
    selectedDate,
    setSelectedDate,
    zonalStats,
    hotspotStats,
    modelInfo,
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

  // Default to rf_prob if activeLayer is not an ML layer
  useEffect(() => {
    if (activeLayer !== 'rf_prob' && activeLayer !== 'rf_class') {
      setActiveLayer('rf_prob');
    }
  }, [activeLayer, setActiveLayer]);

  const isProbMode = activeLayer === 'rf_prob';
  const currentIndex = OBSERVATION_DATES.findIndex((d) => d.date === selectedDate);
  const currentDateObj = OBSERVATION_DATES[currentIndex] || OBSERVATION_DATES[0];

  const handlePrevDate = () => {
    if (currentIndex > 0) {
      setSelectedDate(OBSERVATION_DATES[currentIndex - 1].date);
    }
  };

  const handleNextDate = () => {
    if (currentIndex < OBSERVATION_DATES.length - 1) {
      setSelectedDate(OBSERVATION_DATES[currentIndex + 1].date);
    }
  };

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
            title="Open ML Hotspot Controls"
            aria-label="Open ML Hotspot Controls"
          >
            <Sliders className="w-3.5 h-3.5 text-[#19D3C5]" />
            <span>Hotspot Controls</span>
          </button>
        </div>
      )}

      {/* COMPACT ML HOTSPOTS SIDEBAR (Left-Docked approx 310-320px) */}
      <aside
        className={`bg-[#0D1525] border-r border-[#26354A] flex flex-col h-full shrink-0 select-none transition-transform duration-200
          absolute md:relative inset-y-0 left-0 w-[310px] max-w-[85vw] lg:w-[320px] z-[1200] md:z-20 shadow-2xl md:shadow-none
          ${isSidebarOpen ? 'translate-x-0 pointer-events-auto' : '-translate-x-full md:hidden md:w-0 pointer-events-none'}
        `}
      >
        {/* Header */}
        <div className="p-3.5 border-b border-[#26354A] flex items-center justify-between bg-[#111C2E] shrink-0">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-[#162238] text-[#19D3C5] border border-[#26354A]">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-xs font-bold text-[#F5F7FB] uppercase tracking-wider leading-snug">
                ML Hotspot Analysis
              </h1>
              <p className="text-[10px] text-[#8291A8] font-medium leading-tight">
                Random Forest Predictors (NDVI & NDBI)
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
          {/* Layer Mode Switcher Pills */}
          <div className="space-y-1.5">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#8291A8] px-1">
              Select Analysis Representation
            </div>
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#111C2E] rounded-xl border border-[#26354A]">
              <button
                onClick={() => setActiveLayer('rf_prob')}
                className={`flex items-center justify-center space-x-1.5 py-2 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
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
                className={`flex items-center justify-center space-x-1.5 py-2 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
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

          {/* Integrated Legend Card */}
          <div className="bg-[#111C2E] p-3 rounded-xl border border-[#26354A] space-y-2 shadow-2xs">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#F5F7FB]">
                {isProbMode ? 'Probability Legend' : 'Classification Legend'}
              </span>
              <span className="text-[10px] font-mono text-[#8291A8]">
                {isProbMode ? 'Range: [0, 1]' : 'Binary Mask'}
              </span>
            </div>

            {isProbMode ? (
              <div className="space-y-1.5 pt-1">
                <div className="h-3 rounded-md w-full bg-gradient-to-r from-slate-200 via-red-400 to-red-600 border border-[#26354A]" />
                <div className="flex justify-between text-[10px] font-mono text-[#A8B5C9]">
                  <span>0.00 (Low)</span>
                  <span className="text-[#19D3C5] font-semibold">0.50 (Cut-off)</span>
                  <span>1.00 (High)</span>
                </div>
              </div>
            ) : (
              <div className="space-y-1.5 text-xs pt-1">
                <div className="flex items-center justify-between p-1.5 bg-[#0D1525] rounded-lg border border-[#26354A]">
                  <div className="flex items-center space-x-2">
                    <span className="w-3.5 h-3.5 rounded bg-red-600 border border-red-500 shadow-xs" />
                    <span className="text-[#F5F7FB] font-medium text-xs">Class 1: Thermal Hotspot</span>
                  </div>
                  <span className="text-[10.5px] font-mono text-[#19D3C5]">Prob ≥ 0.50</span>
                </div>
                <div className="flex items-center justify-between p-1.5 bg-[#0D1525] rounded-lg border border-[#26354A]">
                  <div className="flex items-center space-x-2">
                    <span className="w-3.5 h-3.5 rounded bg-[#162238] border border-[#26354A]" />
                    <span className="text-[#A8B5C9] text-xs">Class 0: Non-Hotspot</span>
                  </div>
                  <span className="text-[10.5px] font-mono text-[#8291A8]">Prob &lt; 0.50</span>
                </div>
              </div>
            )}
          </div>

            {/* Active Context Banner with Observation Stepper */}
            <div className="bg-[#111C2E] p-3 rounded-xl border border-[#26354A] space-y-2.5 shadow-2xs">
              <div className="flex items-center justify-between text-xs">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#F5F7FB] flex items-center space-x-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#19D3C5]" />
                  <span>Observation Date</span>
                </span>
                <span className="text-[10px] font-mono text-[#19D3C5] px-1.5 py-0.5 rounded bg-[#162238] border border-[#26354A]">
                  {currentDateObj?.satellite || 'Landsat'}
                </span>
              </div>

              {/* Stepper + Dropdown */}
              <div className="flex items-center space-x-1.5">
                <button
                  onClick={handlePrevDate}
                  disabled={currentIndex <= 0}
                  className="p-1.5 rounded-lg bg-[#0D1525] border border-[#26354A] text-[#8291A8] hover:text-[#F5F7FB] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  title="Previous observation"
                  aria-label="Previous observation"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                </button>

                <select
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="flex-1 bg-[#0D1525] border border-[#26354A] rounded-lg px-2.5 py-1.5 text-xs font-mono font-semibold text-[#F5F7FB] focus:outline-none focus:ring-1 focus:ring-[#19D3C5] cursor-pointer shadow-2xs"
                  aria-label="Select observation date"
                >
                  {OBSERVATION_DATES.map((d) => (
                    <option key={d.date} value={d.date}>
                      {d.date} • {d.satellite}
                    </option>
                  ))}
                </select>

                <button
                  onClick={handleNextDate}
                  disabled={currentIndex >= OBSERVATION_DATES.length - 1}
                  className="p-1.5 rounded-lg bg-[#0D1525] border border-[#26354A] text-[#8291A8] hover:text-[#F5F7FB] disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  title="Next observation"
                  aria-label="Next observation"
                >
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="pt-2 border-t border-[#26354A]/60 flex items-center justify-between text-[10.5px]">
                <span className="text-[#8291A8]">Active Mode:</span>
                <span className="font-mono font-bold text-[#19D3C5]">
                  {isProbMode ? 'rf_prob (Continuous [0, 1])' : 'rf_class (Binary {0, 1})'}
                </span>
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
                    value={hotspotStats?.hotspot_percentage !== undefined ? hotspotStats.hotspot_percentage.toFixed(1) : "26.1"}
                    unit="%"
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
                <div className="flex items-start justify-between font-mono text-[11px] gap-2">
                  <span className="text-[#8291A8] shrink-0">Algorithm:</span>
                  <span className="font-bold text-[#F5F7FB] text-right text-[10.5px] break-words" title={modelInfo?.algorithm || 'RandomForestClassifier (100 Trees)'}>
                    Random Forest (100 Trees)
                  </span>
                </div>
                <div className="flex items-center justify-between font-mono text-[11px] gap-2">
                  <span className="text-[#8291A8] shrink-0">Independent Test F1:</span>
                  <span className="font-bold text-[#19D3C5]">
                    {modelInfo?.locked_test_metrics?.f1_score ? `${(modelInfo.locked_test_metrics.f1_score * 100).toFixed(2)}%` : "86.60%"}
                  </span>
                </div>
                <div className="flex items-center justify-between font-mono text-[11px] gap-2">
                  <span className="text-[#8291A8] shrink-0">Precision / Recall:</span>
                  <span className="text-[#F5F7FB] text-right font-medium">
                    {modelInfo?.locked_test_metrics?.precision ? `${(modelInfo.locked_test_metrics.precision * 100).toFixed(1)}%` : "86.6%"} / {modelInfo?.locked_test_metrics?.recall ? `${(modelInfo.locked_test_metrics.recall * 100).toFixed(1)}%` : "86.6%"}
                  </span>
                </div>
                <div className="flex items-center justify-between font-mono text-[11px] pt-1.5 border-t border-[#26354A] gap-2">
                  <span className="text-[#8291A8] shrink-0">Feature Importance:</span>
                  <span className="font-bold text-[#F5F7FB] text-right">
                    {modelInfo?.feature_importances ? `NDBI ${(modelInfo.feature_importances.NDBI * 100).toFixed(1)}% / NDVI ${(modelInfo.feature_importances.NDVI * 100).toFixed(1)}%` : 'NDBI 61.0% / NDVI 39.0%'}
                  </span>
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

      {/* Map Workspace (Takes all remaining width) */}
      <MapWorkspace showLegend={true} showTimeline={true} isSidebarOpen={isSidebarOpen} className="flex-1 h-full" />
    </div>
  );
};
