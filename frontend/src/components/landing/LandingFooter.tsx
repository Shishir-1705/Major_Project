import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, ShieldCheck, BookOpen } from 'lucide-react';

export const LandingFooter: React.FC = () => {
  return (
    <footer className="w-full bg-[#050811] border-t border-[#1E293B] py-14 px-4 sm:px-6 lg:px-12 text-xs text-[#8291A8]">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 mb-10 pb-8 border-b border-[#141E2E]">
        {/* Left Column: Academic Title & Purpose */}
        <div className="md:col-span-6 space-y-3 text-left">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-[#F97316]" />
            <span className="font-bold font-mono text-sm text-[#F8FAFC]">
              THERMAL INTELLIGENCE
            </span>
            <span className="font-mono text-[10px] text-[#19D3C5] bg-[#0D1525] px-2 py-0.5 rounded border border-[#26354A]">
              ACADEMIC RESEARCH
            </span>
          </div>

          <p className="text-xs text-[#94A3B8] leading-relaxed max-w-lg">
            Machine Learning-Based Urban Heat Hotspot Detection Using LST, NDVI and NDBI from Landsat Imagery. Dedicated academic research into urban heat island dynamics across Mysuru, Karnataka, India.
          </p>

          <div className="flex flex-wrap items-center gap-3 font-mono text-[11px] text-[#A8B5C9] pt-1">
            <span className="flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5 text-[#F97316]" />
              <span>Mysuru Study Area (12.20°N–12.40°N, 76.55°E–76.78°E)</span>
            </span>
            <span>•</span>
            <span>EPSG:32643 (UTM Zone 43N)</span>
          </div>
        </div>

        {/* Middle Column: Analytical Modules */}
        <div className="md:col-span-3 space-y-2 text-left">
          <div className="font-mono font-semibold uppercase text-[#F8FAFC] tracking-wider text-[11px]">
            Geospatial Modules
          </div>
          <ul className="space-y-1.5 text-[#94A3B8]">
            <li>
              <Link to="/overview" className="hover:text-[#F8FAFC] transition-colors">
                Analytical Overview
              </Link>
            </li>
            <li>
              <Link to="/lst" className="hover:text-[#F8FAFC] transition-colors">
                LST Surface Temperature
              </Link>
            </li>
            <li>
              <Link to="/hotspots" className="hover:text-[#F8FAFC] transition-colors">
                Random Forest Hotspots
              </Link>
            </li>
            <li>
              <Link to="/indices" className="hover:text-[#F8FAFC] transition-colors">
                NDVI & NDBI Indices
              </Link>
            </li>
            <li>
              <Link to="/persistence" className="hover:text-[#F8FAFC] transition-colors">
                Temporal Persistence
              </Link>
            </li>
            <li>
              <Link to="/clusters" className="hover:text-[#F8FAFC] transition-colors">
                Getis-Ord Gi* Clusters
              </Link>
            </li>
          </ul>
        </div>

        {/* Right Column: Scientific Provenance */}
        <div className="md:col-span-3 space-y-2 text-left">
          <div className="font-mono font-semibold uppercase text-[#F8FAFC] tracking-wider text-[11px]">
            Scientific Documentation
          </div>
          <ul className="space-y-1.5 text-[#94A3B8]">
            <li>
              <Link to="/methodology" className="hover:text-[#F8FAFC] transition-colors flex items-center space-x-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[#19D3C5]" />
                <span>Methodology Protocol</span>
              </Link>
            </li>
            <li>
              <Link to="/model" className="hover:text-[#F8FAFC] transition-colors flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Locked Model Specification</span>
              </Link>
            </li>
            <li className="pt-2 text-[11px] text-[#8291A8] leading-normal font-mono">
              Source Data: USGS/NASA Landsat 8 & 9 Collection 2 Level-2 Surface Reflectance & Thermal Radiance (ST_B10).
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Legal / Provenance Bar */}
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#8291A8] gap-3">
        <p>
          Thermal Intelligence Geospatial Research Platform • Public Domain Academic Research
        </p>
        <p className="font-mono text-[10px]">
          Locked Baseline: SHA-256 4cb736e53c66...
        </p>
      </div>
    </footer>
  );
};
