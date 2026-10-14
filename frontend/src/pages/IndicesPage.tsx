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
  ChevronRight,
  Info,
  AlertCircle,
  Binary
} from 'lucide-react';

export const IndicesPage: React.FC = () => {
  const {
    activeLayer,
    setActiveLayer,
    selectedDate,
    zonalStats,
    isLoadingStats,
    backendConnected
  } = useAppStore();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Default to ndvi if activeLayer is not an environmental index
  useEffect(() => {
    if (activeLayer !== 'ndvi' && activeLayer !== 'ndbi') {
      setActiveLayer('ndvi');
    }
  }, [activeLayer, setActiveLayer]);

  const isNdvi = activeLayer === 'ndvi';
  const currentDateObj = OBSERVATION_DATES.find((d) => d.date === selectedDate);

  return (
    <div className="flex h-full w-full overflow-hidden relative">
      {/* Interactive Map Area (Reusing MapWorkspace) */}
      <MapWorkspace className="flex-1">
        {/* Toggle Sidebar Button for Mobile & Compact Screens */}
        <div className="absolute top-14 left-3 z-[1000]">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white/95 border border-slate-200/80 backdrop-blur-md shadow-card text-xs font-semibold text-slate-700 hover:text-teal-700 hover:bg-slate-50 transition-colors"
            title={isSidebarOpen ? "Collapse Environmental Indices Panel" : "Expand Environmental Indices Panel"}
          >
            <Sliders className="w-3.5 h-3.5 text-teal-600" />
            <span>{isSidebarOpen ? "Hide Analytics" : "Show Analytics"}</span>
          </button>
        </div>
      </MapWorkspace>

      {/* Environmental Indices Analytical Sidebar */}
      {isSidebarOpen && (
        <aside className="w-80 sm:w-96 bg-white border-l border-slate-200/80 flex flex-col h-full shrink-0 select-none z-30 shadow-floating lg:shadow-xs transition-all duration-200 absolute lg:relative inset-y-0 right-0">
          {/* Header */}
          <div className="p-3.5 border-b border-slate-200/80 flex items-center justify-between bg-slate-50/70">
            <div className="flex items-center space-x-2">
              <div className={`p-1.5 rounded-lg ${isNdvi ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                {isNdvi ? <Trees className="w-4 h-4" /> : <Building2 className="w-4 h-4" />}
              </div>
              <div>
                <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Environmental Indices</h2>
                <p className="text-[10px] text-slate-500 font-medium">Landsat-8/9 OLI Spectral Predictors</p>
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
            {/* Index Switcher Tabs */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1">
                Select Spectral Index
              </div>
              <div className="grid grid-cols-2 gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200/80">
                <button
                  onClick={() => setActiveLayer('ndvi')}
                  className={`flex items-center justify-center space-x-1.5 py-2 px-2 rounded-lg text-xs font-semibold transition-all ${
                    isNdvi
                      ? 'bg-white text-emerald-800 shadow-xs border border-slate-200/80'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Trees className="w-3.5 h-3.5 text-emerald-600" />
                  <span>NDVI (Vegetation)</span>
                </button>

                <button
                  onClick={() => setActiveLayer('ndbi')}
                  className={`flex items-center justify-center space-x-1.5 py-2 px-2 rounded-lg text-xs font-semibold transition-all ${
                    !isNdvi
                      ? 'bg-white text-amber-800 shadow-xs border border-slate-200/80'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Building2 className="w-3.5 h-3.5 text-amber-600" />
                  <span>NDBI (Built-up)</span>
                </button>
              </div>
            </div>

            {/* Active Context Banner */}
            <div className="bg-slate-50/90 p-3 rounded-xl border border-slate-200/80 space-y-2 shadow-2xs">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Observation:</span>
                </span>
                <span className="font-mono font-bold text-slate-900">{selectedDate}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Index Domain:</span>
                <span className="font-mono font-bold text-teal-700 text-[11px]">
                  {isNdvi ? 'NDVI Range [-0.20, +0.80]' : 'NDBI Range [-0.40, +0.60]'}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 font-medium">Platform:</span>
                <span className="text-slate-700 font-medium">{currentDateObj?.satellite || 'Landsat OLI/TIRS'}</span>
              </div>
            </div>

            {/* Zonal Statistics for Active Index */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1 flex items-center justify-between">
                <span>Zonal Index Statistics</span>
                <span className="font-mono text-[10px] text-teal-700">Built Domain</span>
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
                  accentColor="#64748b"
                  isLoading={isLoadingStats}
                  isError={!backendConnected && !zonalStats}
                />

                <StatCard
                  title="Std Dev"
                  value={zonalStats?.std !== undefined ? `±${zonalStats.std.toFixed(3)}` : (isNdvi ? "±0.095" : "±0.088")}
                  unit="Index"
                  subtitle="Spatial index variability"
                  icon={Binary}
                  accentColor="#64748b"
                  isLoading={isLoadingStats}
                  isError={!backendConnected && !zonalStats}
                />
              </div>
            </div>

            {/* Spectral Formulation & Physical Meaning */}
            <div className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/70 space-y-2 text-xs">
              <div className="flex items-center space-x-1.5 font-bold text-slate-800">
                <Info className="w-4 h-4 text-teal-600 shrink-0" />
                <span>{isNdvi ? 'NDVI Formulation & Bands' : 'NDBI Formulation & Bands'}</span>
              </div>
              {isNdvi ? (
                <>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200 font-mono text-[11px] text-center text-emerald-800 font-semibold shadow-2xs">
                    NDVI = (NIR [B5] - Red [B4]) / (NIR [B5] + Red [B4])
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-600">
                    Captures photosynthetic chlorophyll absorption. Healthy vegetation strongly absorbs Red light (0.64–0.67 µm) and reflects Near-Infrared (0.85–0.88 µm), creating high NDVI values that provide natural evaporative cooling.
                  </p>
                </>
              ) : (
                <>
                  <div className="bg-white p-2.5 rounded-lg border border-slate-200 font-mono text-[11px] text-center text-amber-800 font-semibold shadow-2xs">
                    NDBI = (SWIR₁ [B6] - NIR [B5]) / (SWIR₁ [B6] + NIR [B5])
                  </div>
                  <p className="text-[11px] leading-relaxed text-slate-600">
                    Captures impervious built structures. Concrete, asphalt, and roofing materials reflect Shortwave-Infrared (1.57–1.65 µm) more strongly than NIR, yielding positive NDBI values linked to higher thermal retention.
                  </p>
                </>
              )}
            </div>

            {/* Feature Importance Weighting */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1">
                Random Forest Feature Importance
              </div>
              <div className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/70 space-y-2.5 text-xs">
                <div>
                  <div className="flex justify-between font-mono text-[11px] mb-1">
                    <span className="font-medium text-slate-700">NDBI (Built-up Factor):</span>
                    <span className="font-bold text-amber-700">56.94%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full rounded-full" style={{ width: '56.94%' }} />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-mono text-[11px] mb-1">
                    <span className="font-medium text-slate-700">NDVI (Vegetation Factor):</span>
                    <span className="font-bold text-emerald-700">43.06%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: '43.06%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Map Display Options */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 px-1">
                Map View Options
              </div>
              <MapDisplayControls />
            </div>

            {/* Scientific Caveat Notice */}
            <div className="p-3.5 rounded-xl border border-amber-200 bg-amber-50/70 text-amber-900 space-y-1.5 text-xs">
              <div className="flex items-center space-x-1.5 font-bold text-amber-800">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>Correlation vs Mechanical Causation</span>
              </div>
              <p className="text-[11px] leading-relaxed text-amber-900/90">
                While high NDBI and low NDVI correlate strongly with elevated surface temperatures, <strong>neither index alone establishes the cause of an urban heat hotspot</strong>.
              </p>
              <p className="text-[11px] leading-relaxed text-amber-900/90">
                Surface thermal hotspots result from multi-factor interactions between solar insolation, building materials, thermal inertia, urban canyon morphology, and anthropogenic heat emissions.
              </p>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
};
