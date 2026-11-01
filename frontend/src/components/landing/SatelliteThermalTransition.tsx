import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Flame,
  Trees,
  Building2,
  ArrowRight,
  Layers,
  SlidersHorizontal
} from 'lucide-react';

type ComparatorMode = 'ndvi' | 'ndbi';
type ConceptId = 'lst' | 'ndvi' | 'ndbi';

export const SatelliteThermalTransition: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const [sliderPosition, setSliderPosition] = useState<number>(50);
  const [comparatorMode, setComparatorMode] = useState<ComparatorMode>('ndvi');
  const [activeConcept, setActiveConcept] = useState<ConceptId>('ndvi');

  // Handle clicking on concept cards to link editorial content with visual comparator
  const handleSelectConcept = (id: ConceptId) => {
    setActiveConcept(id);
    if (id === 'ndvi') {
      setComparatorMode('ndvi');
      if (sliderPosition > 80) setSliderPosition(50);
    } else if (id === 'ndbi') {
      setComparatorMode('ndbi');
      if (sliderPosition > 80) setSliderPosition(50);
    } else if (id === 'lst') {
      setSliderPosition(100);
    }
  };

  // Overlay layer configuration based on active comparator mode
  const overlayConfig = {
    ndvi: {
      image: '/assets/landing/preview_ndvi.png',
      name: 'NDVI Vegetation Greenness',
      badge: 'NDVI Canopy',
      accent: '#14B8A6',
      icon: Trees,
      tag: 'SPECTRAL VEGETATION'
    },
    ndbi: {
      image: '/assets/landing/preview_ndbi.png',
      name: 'NDBI Built-up Impervious',
      badge: 'NDBI Built-up',
      accent: '#F59E0B',
      icon: Building2,
      tag: 'SPECTRAL IMPERVIOUS'
    }
  }[comparatorMode];

  return (
    <section className="relative w-full py-16 md:py-24 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto border-t border-[#1E293B]">
      {/* Section Header */}
      <div className="max-w-3xl mb-10 md:mb-14 text-left">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#0D1525] border border-[#26354A] text-xs font-mono text-[#F97316] mb-3">
          <Layers className="w-3.5 h-3.5" />
          <span>SURFACE THERMAL DYNAMICS • 2023-04-01</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#F8FAFC] tracking-tight">
          From Surface Canopy to Radiative Heat
        </h2>
        <p className="text-sm sm:text-base text-[#94A3B8] mt-3 leading-relaxed max-w-2xl">
          Thermal conditions across Mysuru reflect the spatial distribution of vegetative cover and built-up infrastructure. Compare spectral surface properties directly against satellite-derived land surface temperature.
        </p>
      </div>

      {/* Asymmetric Editorial Grid: 7 cols visual comparator / 5 cols concept cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 items-start">
        {/* Left Column: Prominent Visual Comparator */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-7 xl:col-span-7 flex flex-col space-y-3"
        >
          {/* Comparator Mode & Split Preset Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 p-2 rounded-xl bg-[#0D1525] border border-[#26354A]">
            {/* Mode Switcher */}
            <div className="flex items-center space-x-1 bg-[#050912] p-1 rounded-lg border border-[#1E293B]">
              <button
                onClick={() => {
                  setComparatorMode('ndvi');
                  setActiveConcept('ndvi');
                }}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                  comparatorMode === 'ndvi'
                    ? 'bg-[#162238] text-[#14B8A6] font-semibold border border-[#14B8A6]/40 shadow-xs'
                    : 'text-[#8291A8] hover:text-[#F8FAFC]'
                }`}
                aria-pressed={comparatorMode === 'ndvi'}
              >
                <Trees className="w-3.5 h-3.5" />
                <span>NDVI vs. LST</span>
              </button>
              <button
                onClick={() => {
                  setComparatorMode('ndbi');
                  setActiveConcept('ndbi');
                }}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                  comparatorMode === 'ndbi'
                    ? 'bg-[#162238] text-[#F59E0B] font-semibold border border-[#F59E0B]/40 shadow-xs'
                    : 'text-[#8291A8] hover:text-[#F8FAFC]'
                }`}
                aria-pressed={comparatorMode === 'ndbi'}
              >
                <Building2 className="w-3.5 h-3.5" />
                <span>NDBI vs. LST</span>
              </button>
            </div>

            {/* Quick Split Presets for Accessibility and Single-Tap Mobile Control */}
            <div className="flex items-center space-x-1 text-[11px] font-mono">
              <span className="text-[#64748B] hidden sm:inline mr-1">Split:</span>
              <button
                onClick={() => setSliderPosition(0)}
                className={`px-2 py-1 rounded bg-[#050912] border text-xs transition-colors cursor-pointer ${
                  sliderPosition === 0
                    ? 'border-[#38BDF8] text-[#38BDF8]'
                    : 'border-[#1E293B] text-[#8291A8] hover:text-[#F8FAFC]'
                }`}
                title="View full spectral overlay"
              >
                Spectral
              </button>
              <button
                onClick={() => setSliderPosition(50)}
                className={`px-2 py-1 rounded bg-[#050912] border text-xs transition-colors cursor-pointer ${
                  sliderPosition === 50
                    ? 'border-[#38BDF8] text-[#38BDF8]'
                    : 'border-[#1E293B] text-[#8291A8] hover:text-[#F8FAFC]'
                }`}
                title="50/50 comparison split"
              >
                50% Split
              </button>
              <button
                onClick={() => setSliderPosition(100)}
                className={`px-2 py-1 rounded bg-[#050912] border text-xs transition-colors cursor-pointer ${
                  sliderPosition === 100
                    ? 'border-[#F97316] text-[#F97316]'
                    : 'border-[#1E293B] text-[#8291A8] hover:text-[#F8FAFC]'
                }`}
                title="View full thermal LST"
              >
                Thermal LST
              </button>
            </div>
          </div>

          {/* Interactive Comparison Viewport */}
          <div className="relative aspect-[4/3] sm:aspect-[16/10] min-h-[300px] sm:min-h-[400px] w-full rounded-2xl overflow-hidden bg-[#050912] border border-[#26354A] shadow-2xl select-none group">
            {/* Base Layer: Thermal LST (Right side revealed as slider moves right) */}
            <img
              src="/assets/landing/preview_lst.png"
              alt="Thermal LST Heat Map (2023-04-01)"
              className="absolute inset-0 w-full h-full object-cover object-[72%_center] pointer-events-none select-none"
              loading="lazy"
            />

            {/* Overlay Layer: NDVI or NDBI (Left side revealed, clipped from right) */}
            <img
              src={overlayConfig.image}
              alt={overlayConfig.name}
              className="absolute inset-0 w-full h-full object-cover object-[72%_center] pointer-events-none select-none transition-opacity duration-300"
              style={{
                clipPath: `inset(0 ${100 - sliderPosition}% 0 0)`
              }}
              loading="lazy"
            />

            {/* Vertical Divider Line with Draggable Handle */}
            <div
              className="absolute inset-y-0 w-0.5 bg-white shadow-[0_0_12px_rgba(255,255,255,0.7)] pointer-events-none z-10"
              style={{ left: `${sliderPosition}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#080D18] border-2 border-white flex items-center justify-center shadow-lg text-white">
                <SlidersHorizontal className="w-3.5 h-3.5 text-[#F8FAFC]" />
              </div>
            </div>

            {/* Accessible Native Range Slider Overlaid on Viewport */}
            <input
              type="range"
              min="0"
              max="100"
              value={sliderPosition}
              onChange={(e) => setSliderPosition(Number(e.target.value))}
              aria-label={`Compare ${overlayConfig.name} with Land Surface Temperature`}
              className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
            />

            {/* Floating Glass Identification Badges */}
            <div className="absolute top-3 left-3 bg-[#080D18]/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#26354A] flex items-center space-x-2 z-10 pointer-events-none">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: overlayConfig.accent }} />
              <span className="text-xs font-mono font-medium text-[#F8FAFC]">
                {overlayConfig.badge}
              </span>
            </div>

            <div className="absolute top-3 right-3 bg-[#080D18]/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#26354A] flex items-center space-x-2 z-10 pointer-events-none">
              <span className="w-2 h-2 rounded-full bg-[#F97316]" />
              <span className="text-xs font-mono font-medium text-[#F8FAFC]">
                Thermal LST (2023-04-01)
              </span>
            </div>

            {/* Bottom Glass Telemetry Overlay */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-[#080D18]/90 backdrop-blur-md border border-[#26354A]/90 text-left pointer-events-none z-10">
              <div className="text-xs font-mono text-[#94A3B8] truncate">
                <span className="text-[#F8FAFC] font-semibold">Landsat 8/9 Level-2</span> • 30m UTM 43N • Drag slider to compare
              </div>
              <div className="text-xs font-mono text-[#F97316] font-semibold shrink-0 ml-2">
                {sliderPosition}% LST
              </div>
            </div>
          </div>

          {/* Scientific Telemetry & Provenance Footer */}
          <div className="p-3.5 rounded-xl bg-[#080D18] border border-[#1E293B] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#94A3B8]">
            <div className="space-y-0.5">
              <div className="font-mono text-[#F8FAFC] text-xs">
                Observation Date: <span className="text-[#19D3C5] font-semibold">2023-04-01</span> • Verified Landsat Acquisition
              </div>
              <p className="text-[11px] text-[#8291A8]">
                Visualizations rendered directly from project GeoTIFF rasters for the Mysuru study area.
              </p>
            </div>
            <Link
              to="/indices"
              className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-[#111C2E] border border-[#26354A] hover:border-[#19D3C5]/40 text-xs font-semibold text-[#19D3C5] hover:text-white transition-colors shrink-0"
            >
              <span>Explore Indices Map</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </motion.div>

        {/* Right Column: Three Biophysical Concept Cards */}
        <div className="lg:col-span-5 xl:col-span-5 flex flex-col space-y-4 text-left">
          {/* Concept 1: Land Surface Temperature */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: 0.1 }}
            onClick={() => handleSelectConcept('lst')}
            className={`p-5 rounded-2xl bg-[#0A0F1D] border transition-all cursor-pointer group ${
              activeConcept === 'lst'
                ? 'border-[#F97316] shadow-lg shadow-orange-950/20'
                : 'border-[#1E293B] hover:border-[#26354A]'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-[#F97316]/15 border border-[#F97316]/40 flex items-center justify-center text-[#F97316]">
                  <Flame className="w-4 h-4" />
                </div>
                <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#F97316]">
                  THERMAL STATE
                </span>
              </div>
              <Link
                to="/lst"
                className="text-xs font-mono text-[#8291A8] hover:text-[#F97316] flex items-center space-x-1 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <span>/lst</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <h3 className="text-lg font-bold text-[#F8FAFC] tracking-tight group-hover:text-white transition-colors">
              Land Surface Temperature (LST)
            </h3>

            <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed mt-2">
              Measures the radiative skin temperature of the Earth's surface as recorded by satellite thermal sensors, which is distinct from ambient air temperature. Across urban landscapes, it characterizes the thermodynamic response of roofs, pavements, and soils exposed to solar irradiance.
            </p>

            <div className="mt-3 pt-3 border-t border-[#1E293B] flex items-center justify-between text-[11px] font-mono text-[#8291A8]">
              <span>Observed 2023-04-01: 31.6°C – 57.0°C</span>
              <span className="text-[#F97316]">Urban Mean 43.3°C</span>
            </div>
          </motion.div>

          {/* Concept 2: Vegetation (NDVI) */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: 0.2 }}
            onClick={() => handleSelectConcept('ndvi')}
            className={`p-5 rounded-2xl bg-[#0A0F1D] border transition-all cursor-pointer group ${
              activeConcept === 'ndvi'
                ? 'border-[#14B8A6] shadow-lg shadow-teal-950/20'
                : 'border-[#1E293B] hover:border-[#26354A]'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-[#14B8A6]/15 border border-[#14B8A6]/40 flex items-center justify-center text-[#14B8A6]">
                  <Trees className="w-4 h-4" />
                </div>
                <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#14B8A6]">
                  SPECTRAL VEGETATION
                </span>
              </div>
              <Link
                to="/indices"
                className="text-xs font-mono text-[#8291A8] hover:text-[#14B8A6] flex items-center space-x-1 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <span>/indices</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <h3 className="text-lg font-bold text-[#F8FAFC] tracking-tight group-hover:text-white transition-colors">
              Vegetation Greenness (NDVI)
            </h3>

            <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed mt-2">
              A spectral indicator derived from red and near-infrared reflectance that quantifies vegetation density and canopy vigor. Areas with healthy vegetation typically exhibit lower surface temperatures through solar shading and active evapotranspiration.
            </p>

            <div className="mt-3 pt-3 border-t border-[#1E293B] flex items-center justify-between text-[11px] font-mono text-[#8291A8]">
              <span>Surface Reflectance Indicator</span>
              <span className="text-[#14B8A6]">Scale -0.2 to +0.8</span>
            </div>
          </motion.div>

          {/* Concept 3: Built-up Surfaces (NDBI) */}
          <motion.div
            initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: 16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: 0.3 }}
            onClick={() => handleSelectConcept('ndbi')}
            className={`p-5 rounded-2xl bg-[#0A0F1D] border transition-all cursor-pointer group ${
              activeConcept === 'ndbi'
                ? 'border-[#F59E0B] shadow-lg shadow-amber-950/20'
                : 'border-[#1E293B] hover:border-[#26354A]'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-lg bg-[#F59E0B]/15 border border-[#F59E0B]/40 flex items-center justify-center text-[#F59E0B]">
                  <Building2 className="w-4 h-4" />
                </div>
                <span className="font-mono text-[11px] font-semibold uppercase tracking-wider text-[#F59E0B]">
                  SPECTRAL IMPERVIOUS
                </span>
              </div>
              <Link
                to="/indices"
                className="text-xs font-mono text-[#8291A8] hover:text-[#F59E0B] flex items-center space-x-1 transition-colors"
                onClick={(e) => e.stopPropagation()}
              >
                <span>/indices</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>

            <h3 className="text-lg font-bold text-[#F8FAFC] tracking-tight group-hover:text-white transition-colors">
              Built-up Surfaces (NDBI)
            </h3>

            <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed mt-2">
              A spectral indicator utilizing shortwave-infrared and near-infrared reflectance associated with built-up features, impervious pavement, and concrete density. Built materials readily absorb solar radiation, frequently corresponding to elevated land surface temperatures.
            </p>

            <div className="mt-3 pt-3 border-t border-[#1E293B] flex items-center justify-between text-[11px] font-mono text-[#8291A8]">
              <span>Structural Density Indicator</span>
              <span className="text-[#F59E0B]">Scale -0.3 to +0.5</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
