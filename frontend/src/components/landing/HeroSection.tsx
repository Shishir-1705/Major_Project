import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  BookOpen,
  Compass,
  Flame,
  ShieldCheck,
  MapPin,
  Satellite,
  Activity,
  Layers,
  Thermometer
} from 'lucide-react';

export const HeroSection: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const [imageLoaded, setImageLoaded] = useState(true);

  return (
    <section className="relative w-full pt-4 pb-12 sm:pt-6 md:pt-10 md:pb-20 lg:pt-12 lg:pb-24 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto overflow-hidden">
      {/* Dynamic Atmospheric Cyan & Amber Cosmic Lighting Overlays */}
      <div
        className="absolute top-10 right-0 w-[550px] h-[550px] lg:w-[800px] lg:h-[800px] pointer-events-none opacity-30 blur-3xl rounded-full"
        style={{
          background: 'radial-gradient(circle at 65% 35%, rgba(6, 182, 212, 0.4) 0%, rgba(20, 184, 166, 0.15) 35%, rgba(249, 115, 22, 0.1) 60%, transparent 80%)'
        }}
      />
      <div
        className="absolute top-1/3 -left-20 w-[420px] h-[420px] pointer-events-none opacity-20 blur-3xl rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(14, 165, 233, 0.25) 0%, transparent 70%)'
        }}
      />

      {/* Main Expansive Hero Grid: Narrative (5 cols on lg) & Dominant Unboxed Earth (7 cols on lg) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 xl:gap-12 items-center relative z-10">
        
        {/* Left Editorial Narrative (lg:col-span-5) */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="lg:col-span-5 text-left z-20 space-y-4 sm:space-y-5"
        >
          {/* Spatial Provenance Badge in Floating Liquid-Glass Chip */}
          <div className="liquid-glass-chip px-3.5 py-1.5 rounded-full inline-flex items-center space-x-2.5 shadow-md">
            <span className="w-2 h-2 rounded-full bg-[#19D3C5] shadow-[0_0_10px_#19D3C5]" />
            <span className="font-mono text-xs font-medium text-[#E2E8F0] tracking-tight">
              Earth Observation & ML Research
            </span>
            <span className="text-[#3E516B]">|</span>
            <span className="font-mono text-[11px] text-[#19D3C5] font-semibold">
              Mysuru • EPSG:32643
            </span>
          </div>

          {/* Headline: See the Heat. Understand the City. */}
          <h1 className="text-4xl sm:text-5xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight text-[#F8FAFC] leading-[1.06]">
            See the Heat.{' '}
            <span className="block mt-1 sm:mt-1.5 bg-clip-text text-transparent bg-gradient-to-r from-[#F97316] via-[#FB923C] to-[#FBBF24]">
              Understand the City.
            </span>
          </h1>

          {/* Concise Plain-English Supporting Description */}
          <p className="text-base sm:text-lg text-[#94A3B8] leading-relaxed max-w-xl">
            Investigate urban heat dynamics across Mysuru using satellite Earth observation and machine learning.
            Explore calibrated radiometric surface temperatures, multi-spectral vegetation indices, and statistically verified spatial hotspot clusters.
          </p>

          {/* Differentiated CTA Buttons (Stacked on Laptop lg to preserve column bounds, side-by-side on desktop xl) */}
          <div className="flex flex-col sm:flex-row lg:flex-col xl:flex-row items-stretch sm:items-center lg:items-stretch xl:items-center gap-3 pt-1 sm:pt-2">
            {/* Primary CTA: Open the Interactive Map -> /overview */}
            <Link
              to="/overview"
              className="px-5 py-3 sm:px-6 sm:py-3.5 rounded-xl bg-gradient-to-r from-[#F97316] via-[#EA580C] to-[#C2410C] hover:from-[#EA580C] hover:to-[#9A3412] text-[#080D18] font-bold text-sm shadow-xl shadow-orange-500/25 hover:shadow-orange-500/40 transition-all inline-flex items-center justify-center space-x-2.5 group focus:outline-none focus:ring-2 focus:ring-[#F97316] shrink-0 cursor-pointer"
            >
              <Compass className="w-4.5 h-4.5 text-[#080D18]" />
              <span>Open the Interactive Map</span>
              <ArrowRight className="w-4 h-4 text-[#080D18] group-hover:translate-x-1.5 transition-transform" />
            </Link>

            {/* Secondary CTA: Read the Methodology -> /methodology */}
            <Link
              to="/methodology"
              className="px-5 py-3 sm:px-6 sm:py-3.5 rounded-xl liquid-glass-chip hover:bg-white/[0.12] text-[#F8FAFC] font-semibold text-sm transition-all inline-flex items-center justify-center space-x-2.5 focus:outline-none focus:ring-2 focus:ring-[#19D3C5] shrink-0 cursor-pointer"
            >
              <BookOpen className="w-4.5 h-4.5 text-[#19D3C5]" />
              <span>Read the Methodology</span>
            </Link>
          </div>
        </motion.div>

        {/* Right Dominant Unboxed Earth-and-Satellite Visual Showcase (lg:col-span-7) */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
          className="lg:col-span-7 relative flex items-center justify-center"
        >
          {/* Main Visual Viewport with Feathered Cosmic Edges (NO enclosing box/card) */}
          <div className="relative w-full h-[320px] sm:h-[400px] md:h-[460px] lg:h-[520px] xl:h-[570px] overflow-hidden rounded-3xl">
            {/* Subtle Orbital Ellipse Trajectory Line */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30 z-10" viewBox="0 0 700 500" fill="none">
              <ellipse
                cx="420"
                cy="260"
                rx="310"
                ry="200"
                stroke="url(#orbit-gradient)"
                strokeWidth="1.2"
                strokeDasharray="5 7"
              />
              <defs>
                <linearGradient id="orbit-gradient" x1="100" y1="50" x2="600" y2="450" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#19D3C5" stopOpacity="0.8" />
                  <stop offset="0.6" stopColor="#38BDF8" stopOpacity="0.4" />
                  <stop offset="1" stopColor="#F97316" stopOpacity="0.1" />
                </linearGradient>
              </defs>
            </svg>

            {imageLoaded ? (
              <img
                src="/assets/landing/earth_satellite_hero.jpg"
                alt="Planetary Earth observation perspective with Landsat satellite in orbit"
                className="w-full h-full object-cover object-[55%_center] scale-102 transition-transform duration-1000 ease-out hover:scale-106"
                loading="eager"
                onError={() => setImageLoaded(false)}
                style={{
                  maskImage: 'radial-gradient(ellipse 92% 84% at 55% 50%, black 58%, transparent 96%)',
                  WebkitMaskImage: 'radial-gradient(ellipse 92% 84% at 55% 50%, black 58%, transparent 96%)'
                }}
              />
            ) : (
              /* Fallback if image fails */
              <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#060B18] via-[#091224] to-[#040711] p-6 text-center rounded-3xl">
                <Satellite className="w-14 h-14 text-[#19D3C5] mb-3 animate-pulse" />
                <span className="text-base font-mono text-[#F8FAFC] font-bold">Earth Observation Telemetry</span>
                <span className="text-xs text-[#8291A8] mt-1 font-mono">Landsat 8/9 Multitemporal Analysis • Mysuru</span>
              </div>
            )}

            {/* Atmospheric Seamless Edge Feathering */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#030611] via-transparent to-transparent opacity-60 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#030611]/85 via-transparent to-transparent opacity-60 pointer-events-none" />

            {/* Top Telemetry Header Chips */}
            <div className="absolute top-2.5 sm:top-3.5 inset-x-2.5 sm:inset-x-3.5 flex items-center justify-between gap-2 z-20 pointer-events-none">
              {/* Left Orbit Chip */}
              <div className="liquid-glass-chip px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl flex items-center space-x-1.5 sm:space-x-2 text-[10px] sm:text-[11px] font-mono text-[#F8FAFC] shadow-lg pointer-events-auto">
                <span className="w-2 h-2 rounded-full bg-[#19D3C5] animate-pulse shadow-[0_0_8px_#19D3C5]" />
                <span className="text-[#E2E8F0] font-semibold">Landsat 9</span>
                <span className="text-[#3E516B]">•</span>
                <span className="text-[#19D3C5] font-medium">705 km Orbit</span>
              </div>

              {/* Right Sensor Chip */}
              <div className="liquid-glass-chip px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl flex items-center space-x-1.5 sm:space-x-2 text-[10px] sm:text-[11px] font-mono text-[#F8FAFC] shadow-lg pointer-events-auto">
                <span className="w-2 h-2 rounded-full bg-[#F97316] shadow-[0_0_8px_#F97316]" />
                <span className="text-[#E2E8F0] font-semibold">TIRS-2 Band 10</span>
                <span className="hidden sm:inline text-[#3E516B]">•</span>
                <span className="hidden sm:inline text-[#FBBF24] font-medium">10.6–12.5 µm</span>
              </div>
            </div>

            {/* Mysuru Geographic Location Marker Pin on Southern India */}
            <div
              className="absolute z-30 pointer-events-auto"
              style={{ left: '44%', top: '55%' }}
            >
              {/* Radar beacon waves */}
              <span className="absolute -inset-3 rounded-full bg-[#19D3C5]/45 animate-radar-ping pointer-events-none" />
              {/* Beacon core */}
              <span className="relative flex w-3 h-3 rounded-full bg-[#19D3C5] border-2 border-[#030611] shadow-[0_0_14px_#19D3C5]" />

              {/* Floating Glass Anchor Tag */}
              <div className="absolute left-3.5 -top-5 liquid-glass-chip px-2 py-1 rounded-xl shadow-2xl flex flex-col whitespace-nowrap text-left border border-[#19D3C5]/40">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-3 h-3 text-[#19D3C5]" />
                  <span className="text-[10.5px] font-bold text-[#F8FAFC]">Mysuru AOI</span>
                </div>
                <span className="text-[9px] font-mono text-[#A8B5C9]">12.3° N, 76.6° E • 135.25 km²</span>
              </div>
            </div>

            {/* Bottom Floating Glass Temperature Legend (Anchored over open ocean) */}
            <div className="absolute bottom-2.5 sm:bottom-3.5 left-2.5 right-2.5 sm:left-auto sm:right-3.5 liquid-glass-chip px-3 py-1.5 sm:py-2 rounded-xl flex items-center justify-between sm:justify-end gap-2.5 text-left shadow-2xl z-20 pointer-events-auto max-w-full sm:max-w-md">
              <div className="flex items-center space-x-1.5 shrink-0">
                <Flame className="w-3.5 h-3.5 text-[#F97316]" />
                <span className="text-[10.5px] sm:text-[11px] font-mono text-[#F8FAFC] font-semibold">
                  LST Radiometric Scale
                </span>
                <span className="text-[9.5px] font-mono text-[#8291A8] hidden md:inline">
                  (2023-04-01)
                </span>
              </div>

              {/* Continuous Thermal Gradient Bar */}
              <div className="flex items-center space-x-2 grow sm:grow-0 w-[140px] sm:w-[170px] md:w-[190px]">
                <span className="text-[9.5px] sm:text-[10px] font-mono font-bold text-[#14B8A6]">31.6°C</span>
                <div className="h-1.5 grow rounded-full bg-gradient-to-r from-[#14B8A6] via-[#EAB308] via-[#F97316] to-[#EF4444] shadow-inner" />
                <span className="text-[9.5px] sm:text-[10px] font-mono font-bold text-[#EF4444]">57.0°C</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Prominent Research Statistics (Floating Liquid-Glass Slabs) */}
      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.25, ease: 'easeOut' }}
        className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 mt-12 md:mt-16"
      >
        {/* Card 1: 43.3°C Reported Urban Mean LST */}
        <div className="liquid-glass-slab rounded-2xl p-6 text-left relative overflow-hidden group hover:border-[#F97316]/50 hover:shadow-[0_20px_50px_rgba(249,115,22,0.12)] transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full liquid-glass-chip text-[11px] font-mono text-[#E2E8F0]">
              <span className="w-2 h-2 rounded-full bg-[#F97316] shadow-[0_0_6px_#F97316]" />
              <span>Landsat 9 • 2023-04-01</span>
            </span>
            <Thermometer className="w-5 h-5 text-[#F97316] opacity-90 group-hover:scale-110 transition-transform" />
          </div>
          
          <div className="text-4xl sm:text-5xl font-bold font-mono text-[#F8FAFC] tracking-tight">
            43.3°C
          </div>
          
          <div className="text-base font-semibold text-[#E2E8F0] mt-2">
            Reported Urban Mean LST
          </div>
          
          <p className="text-xs text-[#94A3B8] mt-2.5 leading-relaxed">
            Mean thermal infrared radiometric surface temperature observed across Mysuru's 135.25 km² urban study domain.
          </p>
          
          <div className="mt-5 pt-3.5 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-[#8291A8]">
            <span>Domain: Built Area</span>
            <span className="text-[#19D3C5] font-semibold">ST_B10 Radiometry</span>
          </div>
        </div>

        {/* Card 2: 57.0°C Peak Observed LST */}
        <div className="liquid-glass-slab rounded-2xl p-6 text-left relative overflow-hidden group hover:border-[#EF4444]/50 hover:shadow-[0_20px_50px_rgba(239,68,68,0.12)] transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full liquid-glass-chip text-[11px] font-mono text-[#E2E8F0]">
              <span className="w-2 h-2 rounded-full bg-[#EF4444] shadow-[0_0_6px_#EF4444]" />
              <span>Thermal Hotspot Anomaly</span>
            </span>
            <Flame className="w-5 h-5 text-[#EF4444] opacity-90 group-hover:scale-110 transition-transform" />
          </div>
          
          <div className="text-4xl sm:text-5xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-[#F97316] to-[#EF4444] tracking-tight">
            57.0°C
          </div>
          
          <div className="text-base font-semibold text-[#E2E8F0] mt-2">
            Peak Observed LST
          </div>
          
          <p className="text-xs text-[#94A3B8] mt-2.5 leading-relaxed">
            Observed maximum radiometric surface temperature recorded over unshaded asphalt, industrial roofing, and dense masonry.
          </p>
          
          <div className="mt-5 pt-3.5 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-[#8291A8]">
            <span>Impervious Maxima</span>
            <span className="text-[#EF4444] font-semibold">TIRS Radiative Peak</span>
          </div>
        </div>

        {/* Card 3: 86.67% Held-Out Test Accuracy */}
        <div className="liquid-glass-slab rounded-2xl p-6 text-left relative overflow-hidden group hover:border-[#19D3C5]/50 hover:shadow-[0_20px_50px_rgba(25,211,197,0.12)] transition-all">
          <div className="flex items-center justify-between mb-4">
            <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full liquid-glass-chip text-[11px] font-mono text-[#E2E8F0]">
              <span className="w-2 h-2 rounded-full bg-[#19D3C5] shadow-[0_0_6px_#19D3C5]" />
              <span>SHA-256 Locked Model</span>
            </span>
            <ShieldCheck className="w-5 h-5 text-[#19D3C5] opacity-90 group-hover:scale-110 transition-transform" />
          </div>
          
          <div className="text-4xl sm:text-5xl font-bold font-mono bg-clip-text text-transparent bg-gradient-to-r from-[#19D3C5] to-[#38BDF8] tracking-tight">
            86.67%
          </div>
          
          <div className="text-base font-semibold text-[#E2E8F0] mt-2">
            Held-Out Test Accuracy
          </div>
          
          <p className="text-xs text-[#94A3B8] mt-2.5 leading-relaxed">
            Locked Random Forest ensemble evaluated on 195 spatially isolated test samples across 10 unseen spatial blocks; zero spatial data leakage.
          </p>
          
          <div className="mt-5 pt-3.5 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-[#8291A8]">
            <span>F1-Score: 86.60%</span>
            <span className="text-[#19D3C5] font-semibold">Spatial Block Independence</span>
          </div>
        </div>
      </motion.div>

      {/* Sleek Floating Liquid-Glass Data-and-Methods Strip */}
      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.35, ease: 'easeOut' }}
        className="liquid-glass-slab py-3.5 px-4 sm:px-6 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs font-mono mt-6 border border-white/15"
      >
        <div className="flex items-center space-x-2">
          <Satellite className="w-4 h-4 text-[#19D3C5]" />
          <span className="text-[#8291A8] uppercase text-[10px]">Sensor:</span>
          <span className="text-[#F8FAFC] font-semibold">Landsat 8/9 Level-2</span>
        </div>

        <div className="flex items-center space-x-2">
          <Layers className="w-4 h-4 text-[#38BDF8]" />
          <span className="text-[#8291A8] uppercase text-[10px]">Grid:</span>
          <span className="text-[#F8FAFC] font-semibold">30 m • UTM Zone 43N</span>
        </div>

        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4 text-[#F59E0B]" />
          <span className="text-[#8291A8] uppercase text-[10px]">Predictors:</span>
          <span className="text-[#F8FAFC] font-semibold">NDVI & NDBI</span>
        </div>

        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-[#10B981]" />
          <span className="text-[#8291A8] uppercase text-[10px]">Model:</span>
          <span className="text-[#F8FAFC] font-semibold">Random Forest</span>
        </div>

        <div className="flex items-center space-x-2">
          <Flame className="w-4 h-4 text-[#EF4444]" />
          <span className="text-[#8291A8] uppercase text-[10px]">Clustering:</span>
          <span className="text-[#F8FAFC] font-semibold">Getis-Ord Gi*</span>
        </div>
      </motion.div>
    </section>
  );
};
