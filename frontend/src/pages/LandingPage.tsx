import React from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  Satellite,
  MapPin,
  Cpu
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const projectSummaryItems = [
    {
      label: 'Satellite Imagery',
      value: 'Landsat 8 and Landsat 9',
      description: 'Level-2 thermal infrared and surface reflectance imagery',
      icon: Satellite,
    },
    {
      label: 'Study Area',
      value: 'Mysuru, Karnataka',
      description: 'Delineated urban footprint and surrounding peri-urban zones',
      icon: MapPin,
    },
    {
      label: 'Model',
      value: 'Random Forest',
      description: 'Spatial machine-learning classification using NDVI and NDBI',
      icon: Cpu,
    },
  ];

  return (
    <div className="h-full w-full overflow-y-auto bg-[#080D18] text-[#F5F7FB] select-none flex flex-col justify-between font-sans relative">
      {/* Subtle atmospheric ambient glow */}
      <div 
        className="absolute top-0 inset-x-0 h-96 pointer-events-none opacity-40"
        style={{
          background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(25, 211, 197, 0.12), transparent 70%)'
        }}
      />

      {/* 1. HERO SECTION */}
      <section className="flex-1 flex flex-col justify-center max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-20 lg:py-24 text-center relative z-10">
        {/* Project Research Badge */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-[#111C2E] text-[#19D3C5] border border-[#26354A] text-xs font-mono font-medium mx-auto mb-6 sm:mb-8 shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-[#19D3C5] shadow-[0_0_8px_#19D3C5]" />
          <span>Academic Research Project • Mysuru, India</span>
        </div>

        {/* Hero Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#F5F7FB] leading-[1.14] max-w-4xl mx-auto">
          Understanding Urban Heat Through{' '}
          <span className="text-[#19D3C5] bg-clip-text text-transparent bg-gradient-to-r from-[#19D3C5] to-[#39E4D5]">
            Satellite Intelligence
          </span>
        </h1>

        {/* Supporting Description */}
        <p className="text-base sm:text-lg lg:text-xl text-[#A8B5C9] max-w-2xl mx-auto leading-relaxed mt-6">
          Explore urban surface temperature patterns across Mysuru using Landsat satellite imagery, spectral indices, and machine learning.
        </p>

        {/* Call to Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-8 pt-2">
          <Link
            to="/lst"
            className="px-6 py-3.5 rounded-xl bg-[#19D3C5] hover:bg-[#39E4D5] text-[#06151A] font-semibold text-sm sm:text-base shadow-sm hover:shadow transition-all inline-flex items-center space-x-2.5 group focus:outline-none focus:ring-2 focus:ring-[#19D3C5] focus:ring-offset-2 focus:ring-offset-[#080D18]"
          >
            <span>Explore Interactive Map</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-[#06151A]" />
          </Link>

          <Link
            to="/methodology"
            className="px-6 py-3.5 rounded-xl bg-[#111C2E]/80 hover:bg-[#162238] text-[#F5F7FB] font-semibold text-sm sm:text-base border border-[#26354A] hover:border-[#19D3C5]/40 shadow-xs transition-all inline-flex items-center space-x-2 focus:outline-none focus:ring-2 focus:ring-[#19D3C5] focus:ring-offset-2 focus:ring-offset-[#080D18]"
          >
            <span>View Methodology</span>
          </Link>
        </div>
      </section>

      {/* 2. PROJECT SUMMARY (3 RESTRAINED CARDS) */}
      <section className="max-w-4xl mx-auto w-full px-4 sm:px-6 pb-12 sm:pb-16 relative z-10">
        <div className="border-t border-[#26354A]/80 pt-8 sm:pt-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {projectSummaryItems.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="flex items-start space-x-3.5 p-4 sm:p-5 rounded-2xl bg-[#0D1525] border border-[#26354A] shadow-xs hover:border-[#19D3C5]/30 hover:bg-[#111C2E] transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#162238] border border-[#26354A] flex items-center justify-center text-[#19D3C5] shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5 text-left">
                    <span className="text-[11px] font-mono font-medium text-[#8291A8] uppercase tracking-wider block">
                      {item.label}
                    </span>
                    <div className="text-sm sm:text-base font-bold text-[#F5F7FB]">
                      {item.value}
                    </div>
                    <p className="text-xs text-[#A8B5C9] leading-snug pt-0.5">
                      {item.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. SIMPLE ACADEMIC PROJECT FOOTER */}
      <footer className="border-t border-[#26354A] bg-[#080D18] py-8 px-4 sm:px-6 text-center text-xs text-[#8291A8] relative z-10">
        <div className="max-w-4xl mx-auto space-y-1.5">
          <p className="font-semibold text-[#F5F7FB]">
            Machine Learning-Based Urban Heat Hotspot Detection Using LST, NDVI and NDBI from Landsat Imagery
          </p>
          <p className="text-[11px] text-[#8291A8]">
            Thermal Intelligence Research Platform • Academic Major Project • Mysuru, Karnataka, India
          </p>
        </div>
      </footer>
    </div>
  );
};
