import React, { useEffect, useState, useRef } from 'react';
import { useAppStore } from '../store/useAppStore';
import { MapWorkspace } from '../components/map/MapWorkspace';
import { OBSERVATION_DATES } from '../config/constants';
import { StatCard } from '../components/common/StatCard';
import {
  Flame,
  Calendar,
  Eye,
  EyeOff,
  MapPin,
  ChevronLeft,
  ChevronRight,
  Sliders,
  AlertCircle,
  AlertTriangle,
  ShieldCheck,
  X,
  Satellite
} from 'lucide-react';

export const LstPage: React.FC = () => {
  const {
    activeLayer,
    setActiveLayer,
    selectedDate,
    setSelectedDate,
    layerOpacity,
    setLayerOpacity,
    showAOIBoundary,
    setShowAOIBoundary,
    zonalStats,
    hotspotStats,
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

  // Track raster visibility (persisted through opacity)
  const [isRasterVisible, setIsRasterVisible] = useState(layerOpacity > 0);
  const lastOpacityRef = useRef(layerOpacity > 0 ? layerOpacity : 0.85);

  // Ensure active layer is 'lst' when this page mounts
  useEffect(() => {
    if (activeLayer !== 'lst') {
      setActiveLayer('lst');
    }
  }, [activeLayer, setActiveLayer]);

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

  const handleToggleRasterVisibility = () => {
    if (isRasterVisible) {
      lastOpacityRef.current = layerOpacity > 0 ? layerOpacity : 0.85;
      setLayerOpacity(0);
      setIsRasterVisible(false);
    } else {
      const restored = lastOpacityRef.current > 0 ? lastOpacityRef.current : 0.85;
      setLayerOpacity(restored);
      setIsRasterVisible(true);
    }
  };

  const handleOpacitySliderChange = (newVal: number) => {
    setLayerOpacity(newVal);
    if (newVal > 0 && !isRasterVisible) {
      setIsRasterVisible(true);
    } else if (newVal === 0 && isRasterVisible) {
      setIsRasterVisible(false);
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
            title="Open LST Controls"
            aria-label="Open LST Controls"
          >
            <Sliders className="w-3.5 h-3.5 text-[#19D3C5]" />
            <span>LST Controls</span>
          </button>
        </div>
      )}

      {/* COMPACT LST SIDEBAR (approx 310-320px) */}
      <aside
        className={`bg-[#0D1525] border-r border-[#26354A] flex flex-col h-full shrink-0 select-none transition-transform duration-200
          absolute md:relative inset-y-0 left-0 w-[310px] max-w-[85vw] lg:w-[320px] z-[1200] md:z-20 shadow-2xl md:shadow-none
          ${isSidebarOpen ? 'translate-x-0 pointer-events-auto' : '-translate-x-full md:hidden md:w-0 pointer-events-none'}
        `}
      >
        {/* Sidebar Header & Collapse Action */}
        <div className="p-3.5 border-b border-[#26354A] flex items-center justify-between bg-[#111C2E]">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-[#162238] text-[#19D3C5] border border-[#26354A]">
              <Flame className="w-4 h-4 text-orange-400" />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#19D3C5]">
                Thermal Workspace
              </span>
              <h1 className="text-xs font-bold text-[#F5F7FB] leading-none">
                LST Explorer
              </h1>
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

        {/* Scrollable Sidebar Body */}
        <div className="flex-1 overflow-y-auto p-3.5 space-y-4 text-xs">
          {/* SECTION A: PAGE INTRODUCTION */}
          <section className="space-y-1">
            <h2 className="text-sm font-bold text-[#F5F7FB]">
              Land Surface Temperature
            </h2>
            <p className="text-[#8291A8] text-[11px] leading-relaxed">
              Explore Landsat-derived surface temperature across Mysuru.
            </p>
          </section>

          {/* SECTION B: OBSERVATION DATE */}
          <section className="bg-[#111C2E] p-3 rounded-xl border border-[#26354A] space-y-2.5">
            <div className="flex items-center justify-between">
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
                className="p-1.5 rounded-lg bg-[#0D1525] border border-[#26354A] text-[#8291A8] hover:text-[#F5F7FB] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
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
                className="p-1.5 rounded-lg bg-[#0D1525] border border-[#26354A] text-[#8291A8] hover:text-[#F5F7FB] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                title="Next observation"
                aria-label="Next observation"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Observation Metadata */}
            <div className="pt-2 border-t border-[#26354A]/60 flex items-center justify-between text-[10.5px] text-[#8291A8]">
              <span className="flex items-center space-x-1">
                <Satellite className="w-3 h-3 text-[#19D3C5]" />
                <span>Sensor:</span>
              </span>
              <span className="font-mono text-[#A8B5C9]">TIRS Band 10</span>
            </div>
          </section>

          {/* SECTION C: MAP DISPLAY CONTROLS */}
          <section className="bg-[#111C2E] p-3 rounded-xl border border-[#26354A] space-y-3">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#F5F7FB] flex items-center space-x-1.5">
              <Sliders className="w-3.5 h-3.5 text-[#19D3C5]" />
              <span>Map Display Controls</span>
            </span>

            {/* Raster Layer Visibility Toggle */}
            <div className="flex items-center justify-between">
              <span className="text-[11.5px] text-[#A8B5C9] font-medium flex items-center space-x-1.5">
                {isRasterVisible ? (
                  <Eye className="w-3.5 h-3.5 text-[#19D3C5]" />
                ) : (
                  <EyeOff className="w-3.5 h-3.5 text-[#8291A8]" />
                )}
                <span>LST Raster Layer</span>
              </span>
              <button
                onClick={handleToggleRasterVisibility}
                className={`w-9 h-5 rounded-full transition-colors relative p-0.5 focus:outline-hidden ${
                  isRasterVisible ? 'bg-[#19D3C5]' : 'bg-[#162238] border border-[#26354A]'
                }`}
                title={isRasterVisible ? 'Hide LST raster' : 'Show LST raster'}
                aria-label={isRasterVisible ? 'Hide LST raster' : 'Show LST raster'}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white shadow-xs transition-transform ${
                    isRasterVisible ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* Layer Opacity Slider */}
            <div className="space-y-1.5 pt-2 border-t border-[#26354A]/60">
              <div className="flex items-center justify-between text-[11px]">
                <span className="text-[#8291A8]">Layer Opacity</span>
                <span className="font-mono text-[#19D3C5] font-bold">
                  {Math.round(layerOpacity * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1.0"
                step="0.05"
                value={layerOpacity > 0 ? layerOpacity : lastOpacityRef.current}
                onChange={(e) => handleOpacitySliderChange(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-[#162238] rounded-lg appearance-none cursor-pointer accent-[#19D3C5]"
                aria-label="Adjust LST raster opacity"
              />
            </div>

            {/* Mysuru AOI Boundary Toggle */}
            <div className="flex items-center justify-between pt-2 border-t border-[#26354A]/60">
              <span className="text-[11.5px] text-[#A8B5C9] font-medium flex items-center space-x-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#19D3C5]" />
                <span>Mysuru AOI Boundary</span>
              </span>
              <button
                onClick={() => setShowAOIBoundary(!showAOIBoundary)}
                className={`w-9 h-5 rounded-full transition-colors relative p-0.5 focus:outline-hidden ${
                  showAOIBoundary ? 'bg-[#19D3C5]' : 'bg-[#162238] border border-[#26354A]'
                }`}
                title={showAOIBoundary ? 'Hide AOI boundary' : 'Show AOI boundary'}
                aria-label={showAOIBoundary ? 'Hide AOI boundary' : 'Show AOI boundary'}
              >
                <div
                  className={`w-4 h-4 rounded-full bg-white shadow-xs transition-transform ${
                    showAOIBoundary ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </section>

          {/* SECTION D: LEGEND */}
          <section className="bg-[#111C2E] p-3 rounded-xl border border-[#26354A] space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#F5F7FB]">
                LST Legend
              </span>
              <span className="text-[10px] font-mono text-[#8291A8]">Unit: °C</span>
            </div>

            <p className="text-[10px] text-[#8291A8] italic leading-tight">
              Land Surface Temp (Landsat ST_B10)
            </p>

            <div className="h-3 rounded-md w-full bg-gradient-to-r from-yellow-200 via-orange-500 to-red-700 border border-[#26354A]" />

            <div className="flex justify-between text-[10px] font-mono text-[#A8B5C9]">
              <span>30.0 °C</span>
              <span>42.7 (P20)</span>
              <span>47.1 (P80)</span>
              <span>55.0 °C</span>
            </div>

            <p className="text-[10px] text-[#8291A8] pt-1 border-t border-[#26354A]/60 leading-tight">
              P80 (47.1 °C) defines relative urban thermal hotspots within the built domain.
            </p>
          </section>

          {/* SECTION E: SCIENTIFIC CONTEXT & THERMAL TELEMETRY */}
          <section className="space-y-2">
            <div className="flex items-center justify-between px-0.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8291A8]">
                Thermal Telemetry
              </span>
              <span className="text-[10px] font-mono text-[#19D3C5]">
                {backendConnected ? 'Live' : 'Baseline'}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <StatCard
                title="Mean LST"
                value={zonalStats?.mean !== undefined ? zonalStats.mean.toFixed(1) : '43.1'}
                unit="°C"
                subtitle="Spatial mean"
                icon={Flame}
                accentColor="#f97316"
                isLoading={isLoadingStats}
                isError={!backendConnected && !zonalStats}
              />
              <StatCard
                title="Peak LST"
                value={zonalStats?.max !== undefined ? zonalStats.max.toFixed(1) : '55.4'}
                unit="°C"
                subtitle="Radiometric max"
                icon={AlertTriangle}
                accentColor="#ef4444"
                isLoading={isLoadingStats}
                isError={!backendConnected && !zonalStats}
              />
              <StatCard
                title="Min LST"
                value={zonalStats?.min !== undefined ? zonalStats.min.toFixed(1) : '33.8'}
                unit="°C"
                subtitle="Coolest pixel"
                icon={ShieldCheck}
                accentColor="#38bdf8"
                isLoading={isLoadingStats}
                isError={!backendConnected && !zonalStats}
              />
              <StatCard
                title="Hotspot Area"
                value={hotspotStats?.hotspot_area_km2 !== undefined ? hotspotStats.hotspot_area_km2.toFixed(1) : '34.5'}
                unit="km²"
                subtitle={hotspotStats?.hotspot_percentage !== undefined ? `${hotspotStats.hotspot_percentage.toFixed(1)}% built` : '24.7% built'}
                icon={Flame}
                accentColor="#eab308"
                isLoading={isLoadingStats}
                isError={!backendConnected && !hotspotStats}
              />
            </div>

            {/* Scientific Notice */}
            <div className="p-2.5 rounded-xl border border-amber-500/30 bg-[#111C2E] text-amber-200/90 text-[10.5px] space-y-1">
              <div className="flex items-center space-x-1.5 font-bold text-amber-400">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>Surface vs Ambient Note</span>
              </div>
              <p className="leading-relaxed">
                Radiometric skin temperature at ~10:45 AM overpass. Differs from ambient 2 m air temperature by up to 10–15°C under high insolation.
              </p>
            </div>
          </section>
        </div>
      </aside>

      {/* MAP-FIRST WORKSPACE (Occupies all remaining horizontal space & full viewport height) */}
      <MapWorkspace showLegend={false} showTimeline={true} isSidebarOpen={isSidebarOpen} className="flex-1 h-full" />
    </div>
  );
};
