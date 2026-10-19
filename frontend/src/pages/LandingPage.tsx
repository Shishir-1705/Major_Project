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
    <div className="h-full w-full overflow-y-auto bg-white text-slate-800 select-none flex flex-col justify-between">
      {/* 1. HERO SECTION */}
      <section className="flex-1 flex flex-col justify-center max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-20 lg:py-24 text-center">
        {/* Subtle Research Badge */}
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200/80 text-xs font-mono font-medium mx-auto mb-6 shadow-2xs">
          <span className="w-1.5 h-1.5 rounded-full bg-teal-600" />
          <span>Academic Research Project • Mysuru, India</span>
        </div>

        {/* Hero Headline */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.14] max-w-4xl mx-auto">
          Understanding Urban Heat Through Satellite Intelligence
        </h1>

        {/* Supporting Description */}
        <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed mt-6">
          Explore urban surface temperature patterns across Mysuru using Landsat satellite imagery, spectral indices, and machine learning.
        </p>

        {/* Call to Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-8 pt-2">
          <Link
            to="/lst"
            className="px-6 py-3.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm sm:text-base shadow-sm hover:shadow transition-all inline-flex items-center space-x-2.5 group"
          >
            <span>Explore Interactive Map</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>

          <Link
            to="/methodology"
            className="px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm sm:text-base border border-slate-200 shadow-xs hover:border-slate-300 transition-all inline-flex items-center space-x-2"
          >
            <span>View Methodology</span>
          </Link>
        </div>
      </section>

      {/* 2. PROJECT SUMMARY (3 RESTRAINED ITEMS) */}
      <section className="max-w-4xl mx-auto w-full px-4 sm:px-6 pb-12 sm:pb-16">
        <div className="border-t border-slate-100 pt-8 sm:pt-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {projectSummaryItems.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="flex items-start space-x-3.5 p-4 sm:p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 shadow-2xs hover:border-slate-300 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200/80 flex items-center justify-center text-teal-700 shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="space-y-0.5 text-left">
                    <span className="text-[11px] font-mono font-medium text-slate-500 uppercase tracking-wider block">
                      {item.label}
                    </span>
                    <div className="text-sm sm:text-base font-bold text-slate-900">
                      {item.value}
                    </div>
                    <p className="text-xs text-slate-500 leading-snug pt-0.5">
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
      <footer className="border-t border-slate-200/80 bg-slate-50/50 py-8 px-4 sm:px-6 text-center text-xs text-slate-500">
        <div className="max-w-4xl mx-auto space-y-1.5">
          <p className="font-semibold text-slate-800">
            Machine Learning-Based Urban Heat Hotspot Detection Using LST, NDVI and NDBI from Landsat Imagery
          </p>
          <p className="text-[11px] text-slate-500">
            Thermal Intelligence Research Platform • Academic Major Project • Mysuru, Karnataka, India
          </p>
        </div>
      </footer>
    </div>
  );
};
