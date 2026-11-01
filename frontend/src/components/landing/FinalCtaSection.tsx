import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Flame,
  ShieldCheck,
  Activity,
  GitCommit,
  BarChart2,
  ArrowRight,
  Compass,
  Layers
} from 'lucide-react';

export const FinalCtaSection: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  const analyticalModules = [
    {
      to: '/lst',
      title: 'LST Explorer',
      description: 'Analyze surface temperature distributions, seasonal shifts, and 30m pixel thermal profiles.',
      icon: Flame,
      badge: 'ST_B10 Thermal',
      accentColor: '#F97316'
    },
    {
      to: '/hotspots',
      title: 'ML Hotspots',
      description: 'Explore Random Forest continuous probability gradients and binary classifications at P ≥ 0.50.',
      icon: ShieldCheck,
      badge: 'RF Classifier',
      accentColor: '#EF4444'
    },
    {
      to: '/indices',
      title: 'NDVI & NDBI',
      description: 'Compare vegetation canopy cooling against impervious built-up pavement accumulation.',
      icon: Activity,
      badge: 'Spectral Indices',
      accentColor: '#14B8A6'
    },
    {
      to: '/persistence',
      title: 'Temporal Persistence',
      description: 'Track multi-temporal recurrence across 8 acquisitions to isolate chronic urban heat traps.',
      icon: GitCommit,
      badge: 'Recurrence Classes',
      accentColor: '#F59E0B'
    },
    {
      to: '/clusters',
      title: 'Gi* Spatial Clusters',
      description: 'Inspect statistically validated Getis-Ord Gi* hot and cold spot clusters with FDR control.',
      icon: BarChart2,
      badge: 'pFDR < 0.05 Clusters',
      accentColor: '#38BDF8'
    }
  ];

  return (
    <section className="relative w-full py-20 md:py-32 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto border-t border-[#1E293B]">
      {/* Central CTA Banner */}
      <div className="relative rounded-3xl bg-gradient-to-b from-[#0D1525] to-[#070B14] border border-[#26354A] p-8 sm:p-14 md:p-20 text-center overflow-hidden shadow-2xl mb-14">
        {/* Thermal Glow Background */}
        <div
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none opacity-20 blur-3xl rounded-full"
          style={{
            background: 'radial-gradient(circle, rgba(249, 115, 22, 0.35) 0%, rgba(20, 184, 166, 0.15) 50%, transparent 70%)'
          }}
        />

        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#111C2E] border border-[#26354A] text-xs font-mono text-[#F97316] mb-5">
            <Compass className="w-3.5 h-3.5" />
            <span>INTERACTIVE GEOSPATIAL OBSERVATORY</span>
          </div>

          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-[#F8FAFC] tracking-tight leading-tight">
            Explore Mysuru's Thermal Landscape
          </h2>

          <p className="text-base sm:text-lg text-[#94A3B8] max-w-2xl mx-auto mt-5 leading-relaxed">
            Directly interact with multi-temporal Landsat rasters, machine-learning hotspot models, and spatial clustering analytics. Fully public, zero authentication required.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-9">
            <Link
              to="/overview"
              className="px-8 py-4 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-[#080D18] font-bold text-base shadow-xl shadow-orange-500/20 hover:shadow-orange-500/30 transition-all inline-flex items-center space-x-2 group focus:outline-none focus:ring-2 focus:ring-[#F97316]"
            >
              <Layers className="w-5 h-5 text-[#080D18]" />
              <span>Open Analytical Overview</span>
              <ArrowRight className="w-4 h-4 text-[#080D18] group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/lst"
              className="px-8 py-4 rounded-xl bg-[#0D1525] hover:bg-[#111C2E] text-[#F8FAFC] font-semibold text-base border border-[#26354A] hover:border-[#19D3C5]/40 transition-all inline-flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-[#19D3C5]"
            >
              <Flame className="w-5 h-5 text-[#F97316]" />
              <span>Launch LST Map</span>
            </Link>
          </div>
        </div>
      </div>

      {/* 5 Analytical Module Launch Cards */}
      <div>
        <div className="text-left mb-6">
          <span className="text-xs font-mono font-semibold uppercase tracking-wider text-[#8291A8]">
            Direct Geospatial Module Access
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {analyticalModules.map((mod, idx) => {
            const ModIcon = mod.icon;
            return (
              <motion.div
                key={mod.to}
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.08 }}
              >
                <Link
                  to={mod.to}
                  className="flex flex-col justify-between h-full p-5 rounded-2xl bg-[#0A0F1D]/80 border border-[#1E293B] hover:border-[#38BDF8]/40 hover:bg-[#111C2E] transition-all group shadow-sm hover:shadow-md cursor-pointer text-left"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center border"
                        style={{
                          backgroundColor: `${mod.accentColor}15`,
                          borderColor: `${mod.accentColor}30`,
                          color: mod.accentColor
                        }}
                      >
                        <ModIcon className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-mono text-[#8291A8] bg-[#080D18] px-2 py-0.5 rounded border border-[#1E293B]">
                        {mod.badge}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-[#F8FAFC] group-hover:text-white transition-colors">
                      {mod.title}
                    </h4>

                    <p className="text-xs text-[#94A3B8] leading-relaxed mt-2">
                      {mod.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#1E293B] flex items-center justify-between text-xs font-medium text-[#19D3C5] group-hover:text-white transition-colors">
                    <span>Open Module</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
