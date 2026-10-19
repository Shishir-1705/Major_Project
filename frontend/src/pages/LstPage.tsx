import React, { useEffect, useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { MapWorkspace } from '../components/map/MapWorkspace';
import { MapDisplayControls } from '../components/controls/MapDisplayControls';
import { StatCard } from '../components/common/StatCard';
import { OBSERVATION_DATES } from '../config/constants';
import {
  Flame,
  Thermometer,
  Calendar,
  AlertCircle,
  Layers,
  ChevronRight,
  Info,
  Sliders,
  ShieldAlert,
  Percent
} from 'lucide-react';

export const LstPage: React.FC = () => {
  const {
    activeLayer,
    setActiveLayer,
    selectedDate,
    zonalStats,
    hotspotStats,
    isLoadingStats,
    backendConnected
  } = useAppStore();

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Ensure active layer is 'lst' when this page mounts
  useEffect(() => {
    if (activeLayer !== 'lst') {
      setActiveLayer('lst');
    }
  }, [activeLayer, setActiveLayer]);

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
            title={isSidebarOpen ? "Collapse LST Analytics Panel" : "Expand LST Analytics Panel"}
          >
            <Sliders className="w-3.5 h-3.5 text-[#19D3C5]" />
            <span>{isSidebarOpen ? "Hide Analytics" : "Show Analytics"}</span>
          </button>
        </div>
      </MapWorkspace>

      {/* LST Analytical Sidebar */}
      {isSidebarOpen && (
        <aside className="w-80 sm:w-96 bg-[#0D1525] border-l border-[#26354A] flex flex-col h-full shrink-0 select-none z-30 shadow-floating lg:shadow-xs transition-all duration-200 absolute lg:relative inset-y-0 right-0">
          {/* Header */}
          <div className="p-3.5 border-b border-[#26354A] flex items-center justify-between bg-[#111C2E]">
            <div className="flex items-center space-x-2">
              <div className="p-1.5 rounded-lg bg-[#162238] text-orange-400 border border-[#26354A]">
                <Flame className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xs font-bold text-[#F5F7FB] uppercase tracking-wider">LST Thermal Explorer</h2>
                <p className="text-[10px] text-[#8291A8] font-medium">Landsat-8/9 Band 10 Split-Window</p>
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
                <span className="text-[#8291A8] font-medium">Platform:</span>
                <span className="text-[#19D3C5] font-semibold">{currentDateObj?.satellite || 'Landsat OLI/TIRS'}</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-[#8291A8] font-medium">Scene ID:</span>
                <span className="font-mono text-[10px] text-[#8291A8] truncate max-w-[170px]" title={currentDateObj?.scene_id}>
                  {currentDateObj?.scene_id}
                </span>
              </div>
            </div>

            {/* Live Zonal Temperature Metrics */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#8291A8] px-1 flex items-center justify-between">
                <span>Zonal Thermal Statistics</span>
                <span className="font-mono text-[10px] text-[#19D3C5]">Unit: °C</span>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <StatCard
                  title="Mean LST"
                  value={zonalStats?.mean !== undefined ? zonalStats.mean.toFixed(2) : "43.14"}
                  unit="°C"
                  subtitle="Spatial mean across built domain"
                  icon={Thermometer}
                  accentColor="#ea580c"
                  isLoading={isLoadingStats}
                  isError={!backendConnected && !zonalStats}
                  errorMessage="Backend offline"
                />

                <StatCard
                  title="Peak LST"
                  value={zonalStats?.max !== undefined ? zonalStats.max.toFixed(2) : "53.20"}
                  unit="°C"
                  subtitle="Maximum radiometric surface temp"
                  icon={Flame}
                  accentColor="#dc2626"
                  isLoading={isLoadingStats}
                  isError={!backendConnected && !zonalStats}
                  errorMessage="Backend offline"
                />

                <StatCard
                  title="Minimum LST"
                  value={zonalStats?.min !== undefined ? zonalStats.min.toFixed(2) : "29.80"}
                  unit="°C"
                  subtitle="Coolest urban surface pixel"
                  icon={Thermometer}
                  accentColor="#0284c7"
                  isLoading={isLoadingStats}
                  isError={!backendConnected && !zonalStats}
                  errorMessage="Backend offline"
                />

                <StatCard
                  title="Std Dev"
                  value={zonalStats?.std !== undefined ? `±${zonalStats.std.toFixed(2)}` : "±2.76"}
                  unit="°C"
                  subtitle="Spatial thermal variability"
                  icon={Layers}
                  accentColor="#8291A8"
                  isLoading={isLoadingStats}
                  isError={!backendConnected && !zonalStats}
                  errorMessage="Backend offline"
                />
              </div>
            </div>

            {/* Hotspot Spatial Coverage (P80 Threshold) */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#8291A8] px-1">
                LST-Derived Hotspot Extent (P80 Threshold)
              </div>
              <div className="grid grid-cols-2 gap-2">
                <StatCard
                  title="Hotspot Area"
                  value={hotspotStats?.hotspot_area_km2 !== undefined ? hotspotStats.hotspot_area_km2.toFixed(2) : "34.54"}
                  unit="km²"
                  subtitle="Urban area exceeding P80 threshold"
                  icon={ShieldAlert}
                  accentColor="#b91c1c"
                  isLoading={isLoadingStats}
                  isError={!backendConnected && !hotspotStats}
                />

                <StatCard
                  title="Hotspot Share"
                  value={hotspotStats?.hotspot_percentage !== undefined ? `${hotspotStats.hotspot_percentage.toFixed(1)}%` : "26.1%"}
                  unit="coverage"
                  subtitle="Percent of 132.13 km² built domain"
                  icon={Percent}
                  accentColor="#ea580c"
                  isLoading={isLoadingStats}
                  isError={!backendConnected && !hotspotStats}
                />
              </div>
            </div>

            {/* Reusable Opacity & AOI Controls */}
            <div className="space-y-1.5">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[#8291A8] px-1">
                Map View Options
              </div>
              <MapDisplayControls />
            </div>

            {/* Scientific Notice Card */}
            <div className="p-3.5 rounded-xl border border-amber-500/30 bg-[#111C2E] text-amber-200 space-y-1.5 text-xs">
              <div className="flex items-center space-x-1.5 font-bold text-amber-400">
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Surface vs Ambient Temperature</span>
              </div>
              <p className="text-[11px] leading-relaxed text-amber-200/90">
                <strong>Land Surface Temperature (LST)</strong> measures the skin temperature of physical ground surfaces (roofs, pavements, bare soil, canopy) at satellite overpass (~10:45 AM local time).
              </p>
              <p className="text-[11px] leading-relaxed text-amber-200/90">
                LST should <strong>not</strong> be confused with ambient 2 m air temperature recorded by meteorological stations; physical surfaces during sunny conditions can be 10–15°C hotter than ambient air.
              </p>
            </div>

            {/* Split-Window Methodology Note */}
            <div className="p-3 rounded-xl border border-[#26354A] bg-[#111C2E] space-y-1.5 text-xs text-[#A8B5C9]">
              <div className="flex items-center space-x-1.5 font-semibold text-[#F5F7FB]">
                <Info className="w-3.5 h-3.5 text-[#19D3C5] shrink-0" />
                <span>Radiometric Calibration</span>
              </div>
              <p className="text-[11px] leading-relaxed text-[#8291A8]">
                Rasters derived from Landsat-8/9 TIRS Band 10 top-of-atmosphere (TOA) radiance, atmospheric correction, and fractional vegetation cover (FVC) surface emissivity estimation.
              </p>
            </div>
          </div>
        </aside>
      )}
    </div>
  );
};
