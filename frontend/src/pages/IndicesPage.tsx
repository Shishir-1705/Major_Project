import React, { useEffect, useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { MapWorkspace } from '../components/map/MapWorkspace';
import { MapDisplayControls } from '../components/controls/MapDisplayControls';
import { StatCard } from '../components/common/StatCard';
import { OBSERVATION_DATES } from '../config/constants';
import {
  Trees,
  Building2,
  Calendar,
  Layers,
  Activity,
  Sliders,
  ChevronLeft,
  ChevronRight,
  X,
  Info,
  AlertCircle,
  Binary
} from 'lucide-react';

export const IndicesPage: React.FC = () => {
  const {
    activeLayer,
    setActiveLayer,
    selectedDate,
    setSelectedDate,
    zonalStats,
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

  // Default to ndvi if activeLayer is not an environmental index
  useEffect(() => {
    if (activeLayer !== 'ndvi' && activeLayer !== 'ndbi') {
      setActiveLayer('ndvi');
    }
  }, [activeLayer, setActiveLayer]);

  const isNdvi = activeLayer === 'ndvi';
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
            title="Open Environmental Indices Controls"
            aria-label="Open Environmental Indices Controls"
          >
            <Sliders className="w-3.5 h-3.5 text-[#19D3C5]" />
            <span>Index Controls</span>
          </button>
        </div>
      )}

      {/* COMPACT ENVIRONMENTAL INDICES SIDEBAR (Left-Docked approx 310-320px) */}
      <aside
        className={`bg-[#0D1525] border-r border-[#26354A] flex flex-col h-full shrink-0 select-none transition-transform duration-200
          absolute md:relative inset-y-0 left-0 w-[310px] max-w-[85vw] lg:w-[320px] z-[1200] md:z-20 shadow-2xl md:shadow-none
          ${isSidebarOpen ? 'translate-x-0 pointer-events-auto' : '-translate-x-full md:hidden md:w-0 pointer-events-none'}
        `}
      >
        {/* Header */}
        <div className="p-3.5 border-b border-[#26354A] flex items-center justify-between bg-[#111C2E]">
          <div className="flex items-center space-x-2">
            <div className={`p-1.5 rounded-lg bg-[#162238] border border-[#26354A] ${isNdvi ? 'text-emerald-400' : 'text-amber-400'}`}>
              {isNdvi ? <Trees className="w-4 h-4" /> : <Building2 className="w-4 h-4" />}
            </div>
            <div>
              <h2 className="text-xs font-bold text-[#F5F7FB] uppercase tracking-wider">Environmental Indices</h2>
              <p className="text-[10px] text-[#8291A8] font-medium">Landsat-8/9 OLI Spectral Predictors</p>
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
          {/* Index Switcher Tabs */}
          <div className="space-y-1.5">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#8291A8] px-1">
              Select Spectral Index
            </div>
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#111C2E] rounded-xl border border-[#26354A]">
              <button
                onClick={() => setActiveLayer('ndvi')}
                className={`flex items-center justify-center space-x-1.5 py-2 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  isNdvi
                    ? 'bg-[#162238] text-[#F5F7FB] shadow-xs border border-[#26354A]'
                    : 'text-[#8291A8] hover:text-[#F5F7FB]'
                }`}
              >
                <Trees className="w-3.5 h-3.5 text-emerald-400" />
                <span>NDVI (Vegetation)</span>
              </button>

              <button
                onClick={() => setActiveLayer('ndbi')}
                className={`flex items-center justify-center space-x-1.5 py-2 px-2 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  !isNdvi
                    ? 'bg-[#162238] text-[#F5F7FB] shadow-xs border border-[#26354A]'
                    : 'text-[#8291A8] hover:text-[#F5F7FB]'
                }`}
              >
                <Building2 className="w-3.5 h-3.5 text-amber-400" />
                <span>NDBI (Built-up)</span>
              </button>
            </div>
          </div>

          {/* Integrated Legend Card */}
          <div className="bg-[#111C2E] p-3 rounded-xl border border-[#26354A] space-y-2 shadow-2xs">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#F5F7FB]">
                {isNdvi ? 'NDVI Vegetation Legend' : 'NDBI Built-Up Legend'}
              </span>
              <span className="text-[10px] font-mono text-[#8291A8]">
                {isNdvi ? '[-0.2, +0.8]' : '[-0.4, +0.6]'}
              </span>
            </div>

            {isNdvi ? (
              <div className="space-y-1.5 pt-1">
                <div className="h-3 rounded-md w-full bg-gradient-to-r from-amber-900 via-emerald-600 to-emerald-400 border border-[#26354A]" />
                <div className="flex justify-between text-[10px] font-mono text-[#A8B5C9]">
                  <span>-0.2 (Non-Veg)</span>
                  <span className="text-emerald-400">+0.3</span>
                  <span>+0.8 (Canopy)</span>
                </div>
              </div>
            ) : (
              <div className="space-y-1.5 pt-1">
                <div className="h-3 rounded-md w-full bg-gradient-to-r from-slate-900 via-amber-700 to-amber-500 border border-[#26354A]" />
                <div className="flex justify-between text-[10px] font-mono text-[#A8B5C9]">
                  <span>-0.4 (Pervious)</span>
                  <span className="text-amber-400">0.0</span>
                  <span>+0.6 (Built)</span>
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
                <span className="text-[#8291A8]">Index Domain:</span>
                <span className="font-mono font-bold text-[#19D3C5]">
                  {isNdvi ? 'NDVI Range [-0.20, +0.80]' : 'NDBI Range [-0.40, +0.60]'}
                </span>
              </div>
            </div>

            {/* Zonal Statistics for Active Index */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#8291A8] px-1 flex items-center justify-between">
                <span>Zonal Index Statistics</span>
                <span className="font-mono text-[10px] text-[#19D3C5]">Built Domain</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <StatCard
                  title={isNdvi ? "Mean NDVI" : "Mean NDBI"}
                  value={zonalStats?.mean !== undefined ? zonalStats.mean.toFixed(3) : (isNdvi ? "0.268" : "0.042")}
                  unit="Index"
                  subtitle={isNdvi ? "Average vegetation canopy" : "Average impervious density"}
                  icon={isNdvi ? Trees : Building2}
                  accentColor={isNdvi ? "#10b981" : "#d97706"}
                  isLoading={isLoadingStats}
                  isError={!backendConnected && !zonalStats}
                />

                <StatCard
                  title="Peak Index"
                  value={zonalStats?.max !== undefined ? zonalStats.max.toFixed(3) : (isNdvi ? "0.742" : "0.485")}
                  unit="Index"
                  subtitle={isNdvi ? "Maximum dense vegetation" : "Highest built density"}
                  icon={Activity}
                  accentColor={isNdvi ? "#059669" : "#b45309"}
                  isLoading={isLoadingStats}
                  isError={!backendConnected && !zonalStats}
                />

                <StatCard
                  title="Minimum Index"
                  value={zonalStats?.min !== undefined ? zonalStats.min.toFixed(3) : (isNdvi ? "-0.150" : "-0.320")}
                  unit="Index"
                  subtitle={isNdvi ? "Barren or paved surface" : "Pervious/vegetated surface"}
                  icon={Layers}
                  accentColor="#8291A8"
                  isLoading={isLoadingStats}
                  isError={!backendConnected && !zonalStats}
                />

                <StatCard
                  title="Std Dev"
                  value={zonalStats?.std !== undefined ? `±${zonalStats.std.toFixed(3)}` : (isNdvi ? "±0.095" : "±0.088")}
                  unit="Index"
                  subtitle="Spatial index variability"
                  icon={Binary}
                  accentColor="#8291A8"
                  isLoading={isLoadingStats}
                  isError={!backendConnected && !zonalStats}
                />
              </div>
            </div>

            {/* Spectral Formulation & Physical Meaning */}
            <div className="p-3.5 rounded-xl border border-[#26354A] bg-[#111C2E] space-y-2 text-xs">
              <div className="flex items-center space-x-1.5 font-bold text-[#F5F7FB]">
                <Info className="w-4 h-4 text-[#19D3C5] shrink-0" />
                <span>{isNdvi ? 'NDVI Formulation & Bands' : 'NDBI Formulation & Bands'}</span>
              </div>
              {isNdvi ? (
                <>
                  <div className="bg-[#0D1525] p-2.5 rounded-lg border border-[#26354A] font-mono text-[11px] text-center text-emerald-400 font-semibold shadow-2xs">
                    NDVI = (NIR [B5] - Red [B4]) / (NIR [B5] + Red [B4])
                  </div>
                  <p className="text-[11px] leading-relaxed text-[#8291A8]">
                    Captures photosynthetic chlorophyll absorption. Healthy vegetation strongly absorbs Red light (0.64–0.67 µm) and reflects Near-Infrared (0.85–0.88 µm), creating high NDVI values that provide natural evaporative cooling.
                  </p>
                </>
              ) : (
                <>
                  <div className="bg-[#0D1525] p-2.5 rounded-lg border border-[#26354A] font-mono text-[11px] text-center text-amber-400 font-semibold shadow-2xs">
                    NDBI = (SWIR₁ [B6] - NIR [B5]) / (SWIR₁ [B6] + NIR [B5])
                  </div>
                  <p className="text-[11px] leading-relaxed text-[#8291A8]">
                    Captures impervious built structures. Concrete, asphalt, and roofing materials reflect Shortwave-Infrared (1.57–1.65 µm) more strongly than NIR, yielding positive NDBI values linked to higher thermal retention.
                  </p>
                </>
              )}
            </div>

            {/* Feature Importance Weighting */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#8291A8] px-1">
                Random Forest Feature Importance
              </div>
              <div className="p-3 rounded-xl border border-[#26354A] bg-[#111C2E] space-y-2.5 text-xs">
                <div>
                  <div className="flex justify-between font-mono text-[11px] mb-1">
                    <span className="font-medium text-[#A8B5C9]">NDBI (Built-up Factor):</span>
                    <span className="font-bold text-amber-400">56.94%</span>
                  </div>
                  <div className="w-full bg-[#162238] h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: '56.94%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-mono text-[11px] mb-1">
                    <span className="font-medium text-[#A8B5C9]">NDVI (Vegetation Factor):</span>
                    <span className="font-bold text-emerald-400">43.06%</span>
                  </div>
                  <div className="w-full bg-[#162238] h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: '43.06%' }} />
                  </div>
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

            {/* Scientific Caveat Notice */}
            <div className="p-3.5 rounded-xl border border-amber-500/30 bg-[#111C2E] text-amber-200 space-y-1.5 text-xs">
              <div className="flex items-center space-x-1.5 font-bold text-amber-400">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Correlation vs Mechanical Causation</span>
              </div>
              <p className="text-[11px] leading-relaxed text-amber-200/90">
                While high NDBI and low NDVI correlate strongly with elevated surface temperatures, <strong>neither index alone establishes the cause of an urban heat hotspot</strong>.
              </p>
              <p className="text-[11px] leading-relaxed text-amber-200/90">
                Surface thermal hotspots result from multi-factor interactions between solar insolation, building materials, thermal inertia, urban canyon morphology, and anthropogenic heat emissions.
              </p>
            </div>
          </div>
        </aside>

      {/* Map Workspace (Takes all remaining width) */}
      <MapWorkspace showLegend={false} showTimeline={true} isSidebarOpen={isSidebarOpen} className="flex-1 h-full" />
    </div>
  );
};
