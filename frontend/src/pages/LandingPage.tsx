import React from 'react';
import { HeroSection } from '../components/landing/HeroSection';
import { SatelliteThermalTransition } from '../components/landing/SatelliteThermalTransition';
import { ResearchPipelineSection } from '../components/landing/ResearchPipelineSection';
import { ResultsPreviewSection } from '../components/landing/ResultsPreviewSection';
import { LandingFooter } from '../components/landing/LandingFooter';

export const LandingPage: React.FC = () => {
  return (
    <div className="block h-full w-full overflow-y-auto overflow-x-hidden space-cinematic-bg text-[#F8FAFC] select-none font-sans relative scroll-smooth">
      {/* 1. Cinematic Hero Section */}
      <HeroSection />

      {/* 2. Surface Thermal Dynamics: Asymmetric Visual Comparator & Concept Introduction */}
      <SatelliteThermalTransition />

      {/* 3. Research Pipeline: 4-Stage Methodological Timeline */}
      <ResearchPipelineSection />

      {/* 4. Results Showcase & Concluding Observatory Call to Action */}
      <ResultsPreviewSection />

      {/* 5. Minimal Academic Footer */}
      <LandingFooter />
    </div>
  );
};

export default LandingPage;
