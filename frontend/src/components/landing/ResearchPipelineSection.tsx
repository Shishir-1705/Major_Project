import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Satellite,
  Sliders,
  Cpu,
  Flame,
  GitBranch,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

interface PipelineStage {
  step: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  accent: string;
  accentBg: string;
  accentBorder: string;
  summary: string;
  safeguardNote?: string;
  badges: string[];
  route: string;
  routeText: string;
}

export const ResearchPipelineSection: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  const stages: PipelineStage[] = [
    {
      step: '01',
      title: 'Satellite Observation',
      subtitle: 'Landsat 8/9 Level-2 Acquisitions',
      icon: Satellite,
      accent: '#38BDF8',
      accentBg: 'rgba(56, 189, 248, 0.12)',
      accentBorder: 'rgba(56, 189, 248, 0.35)',
      summary:
        'Acquires cloud-screened Landsat 8 OLI/TIRS and Landsat 9 OLI-2/TIRS-2 Level-2 products across eight verified observation dates over Mysuru. The pipeline utilizes calibrated surface reflectance bands alongside thermal infrared radiometry mapped to a common 30-meter UTM Zone 43N grid.',
      badges: ['Landsat 8/9 Level-2', '30m • UTM Zone 43N', '8 Verified Acquisitions'],
      route: '/lst',
      routeText: 'Explore Observations'
    },
    {
      step: '02',
      title: 'Feature Extraction',
      subtitle: 'Spectral Predictors & Reference Labels',
      icon: Sliders,
      accent: '#14B8A6',
      accentBg: 'rgba(20, 184, 166, 0.12)',
      accentBorder: 'rgba(20, 184, 166, 0.35)',
      summary:
        'Derives Normalized Difference Vegetation Index (NDVI) and Normalized Difference Built-up Index (NDBI) from surface reflectance to characterize biophysical surface cover. Land Surface Temperature (LST) is calibrated separately to define thermal hotspot reference labels, not as a model input.',
      safeguardNote: 'LST is strictly isolated from predictors to prevent target leakage.',
      badges: ['NDVI Canopy Index', 'NDBI Built-up Index', 'LST Reference Thresholds'],
      route: '/indices',
      routeText: 'View Indices'
    },
    {
      step: '03',
      title: 'Machine Learning',
      subtitle: 'Locked Random Forest Inference',
      icon: Cpu,
      accent: '#F59E0B',
      accentBg: 'rgba(245, 158, 11, 0.12)',
      accentBorder: 'rgba(245, 158, 11, 0.35)',
      summary:
        'A locked ensemble Random Forest classifier uses only NDVI and NDBI as predictors to estimate hotspot classification and continuous probability gradients. In held-out test evaluation, the ensemble achieved 86.7% test accuracy and 0.934 ROC-AUC across spatial cross-validation splits.',
      safeguardNote: 'Held-out evaluation result; model weights are locked (SHA-256 verified).',
      badges: ['100 Decision Trees', 'NDVI + NDBI Predictors', '86.7% Test Accuracy (Eval)'],
      route: '/hotspots',
      routeText: 'Inspect ML Predictions'
    },
    {
      step: '04',
      title: 'Spatial Analysis',
      subtitle: 'Temporal Persistence & Gi* Clustering',
      icon: Flame,
      accent: '#F97316',
      accentBg: 'rgba(249, 115, 22, 0.12)',
      accentBorder: 'rgba(249, 115, 22, 0.35)',
      summary:
        'Evaluates multi-temporal hotspot recurrence across observation dates to isolate chronic heat traps from transient events. Distance-weighted Getis-Ord Gi* statistics then identify statistically significant spatial hot and cold clusters using False Discovery Rate (FDR p < 0.05) correction.',
      safeguardNote: 'Statistically significant clusters satisfy Benjamini-Hochberg FDR p < 0.05.',
      badges: ['5 Persistence Tiers', 'Getis-Ord Gi* z-scores', 'FDR-Controlled (p < 0.05)'],
      route: '/clusters',
      routeText: 'Explore Clusters'
    }
  ];

  return (
    <section className="relative w-full py-16 md:py-24 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto border-t border-[#1E293B]">
      {/* Section Header */}
      <div className="max-w-3xl mb-12 md:mb-16 text-left">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#0D1525] border border-[#26354A] text-xs font-mono text-[#14B8A6] mb-3">
          <GitBranch className="w-3.5 h-3.5" />
          <span>RESEARCH METHODOLOGY PIPELINE</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#F8FAFC] tracking-tight">
          From Orbital Radiance to Spatial Intelligence
        </h2>
        <p className="text-sm sm:text-base text-[#94A3B8] mt-3 leading-relaxed max-w-2xl">
          A four-stage reproducible pipeline progressing from calibrated satellite acquisitions to machine-learning inference and statistically controlled spatial hotspot clustering.
        </p>
      </div>

      {/* =========================================================================
          DESKTOP CONNECTED SEQUENCE (Horizontal connected timeline on lg/xl)
          ========================================================================= */}
      <div className="hidden lg:block relative">
        {/* Continuous Horizontal Connector Spine */}
        <div
          className="absolute top-7 left-[8%] right-[8%] h-[2px] pointer-events-none z-0"
          style={{
            background:
              'linear-gradient(90deg, rgba(56,189,248,0.4) 0%, rgba(20,184,166,0.4) 33%, rgba(245,158,11,0.4) 66%, rgba(249,115,22,0.4) 100%)'
          }}
        />

        {/* 4 Connected Stages in 4-Column Grid */}
        <div className="grid grid-cols-4 gap-6 relative z-10">
          {stages.map((stage, idx) => {
            const Icon = stage.icon;
            const isHovered = hoveredStep === idx;

            return (
              <motion.div
                key={stage.step}
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                onMouseEnter={() => setHoveredStep(idx)}
                onMouseLeave={() => setHoveredStep(null)}
                className={`flex flex-col justify-between p-6 rounded-2xl bg-[#0A0F1D] border transition-all duration-300 text-left relative group ${
                  isHovered
                    ? 'border-[#26354A] shadow-xl -translate-y-1'
                    : 'border-[#1E293B] hover:border-[#26354A]'
                }`}
                style={{
                  boxShadow: isHovered ? `0 12px 30px -10px ${stage.accent}20` : undefined
                }}
              >
                {/* Node Anchor Circle on the Connector Line */}
                <div className="flex items-center justify-between mb-5">
                  <div
                    className="w-14 h-14 rounded-2xl flex items-center justify-center border transition-all duration-300"
                    style={{
                      backgroundColor: stage.accentBg,
                      borderColor: isHovered ? stage.accent : stage.accentBorder,
                      color: stage.accent,
                      boxShadow: isHovered ? `0 0 16px ${stage.accent}40` : undefined
                    }}
                  >
                    <Icon className="w-6 h-6" />
                  </div>

                  <span
                    className="font-mono text-xs font-bold px-2.5 py-1 rounded-md border"
                    style={{
                      backgroundColor: stage.accentBg,
                      borderColor: stage.accentBorder,
                      color: stage.accent
                    }}
                  >
                    STAGE {stage.step}
                  </span>
                </div>

                {/* Stage Title and Subtitle */}
                <div className="mb-3">
                  <h3 className="text-lg font-bold text-[#F8FAFC] tracking-tight group-hover:text-white transition-colors">
                    {stage.title}
                  </h3>
                  <div className="text-xs font-mono text-[#8291A8] mt-0.5">
                    {stage.subtitle}
                  </div>
                </div>

                {/* Concise Scientific Narrative */}
                <p className="text-xs text-[#94A3B8] leading-relaxed mb-4 min-h-[96px]">
                  {stage.summary}
                </p>

                {/* Safeguard Alert Badge if applicable */}
                {stage.safeguardNote && (
                  <div className="mb-4 p-2.5 rounded-lg bg-[#050912] border border-[#1E293B] flex items-start space-x-2">
                    <ShieldCheck
                      className="w-3.5 h-3.5 shrink-0 mt-0.5"
                      style={{ color: stage.accent }}
                    />
                    <span className="text-[11px] text-[#A8B5C9] font-mono leading-tight">
                      {stage.safeguardNote}
                    </span>
                  </div>
                )}

                {/* Micro Technical Specifications */}
                <div className="pt-3 border-t border-[#1E293B] space-y-1.5 mb-4">
                  {stage.badges.map((b, bIdx) => (
                    <div
                      key={bIdx}
                      className="flex items-center space-x-2 text-[11px] font-mono text-[#8291A8]"
                    >
                      <CheckCircle2
                        className="w-3 h-3 shrink-0"
                        style={{ color: stage.accent }}
                      />
                      <span className="truncate">{b}</span>
                    </div>
                  ))}
                </div>

                {/* Stage Route Quick-Link */}
                <Link
                  to={stage.route}
                  className="inline-flex items-center space-x-1.5 text-xs font-semibold text-[#8291A8] hover:text-[#F8FAFC] transition-colors pt-2 group/link"
                >
                  <span>{stage.routeText}</span>
                  <ArrowRight
                    className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-1"
                    style={{ color: stage.accent }}
                  />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* =========================================================================
          MOBILE CONNECTED SEQUENCE (Vertical timeline sequence on sm/md)
          ========================================================================= */}
      <div className="block lg:hidden relative ml-3 sm:ml-4 pl-6 sm:pl-8 border-l-2 border-[#1E293B] space-y-8 text-left">
        {stages.map((stage, idx) => {
          const Icon = stage.icon;

          return (
            <motion.div
              key={stage.step}
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{ duration: 0.45, delay: idx * 0.08 }}
              className="relative p-5 sm:p-6 rounded-2xl bg-[#0A0F1D] border border-[#1E293B] text-left"
            >
              {/* Node Marker Circle Anchored to Vertical Line */}
              <div
                className="absolute -left-[35px] sm:-left-[43px] top-6 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#080D18] border-2 flex items-center justify-center text-xs font-mono font-bold"
                style={{
                  borderColor: stage.accent,
                  color: stage.accent,
                  boxShadow: `0 0 10px ${stage.accent}40`
                }}
              >
                {stage.step}
              </div>

              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center border"
                    style={{
                      backgroundColor: stage.accentBg,
                      borderColor: stage.accentBorder,
                      color: stage.accent
                    }}
                  >
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <span
                    className="font-mono text-xs font-bold"
                    style={{ color: stage.accent }}
                  >
                    STAGE {stage.step}
                  </span>
                </div>

                <Link
                  to={stage.route}
                  className="text-xs font-mono text-[#8291A8] hover:text-[#F8FAFC] flex items-center space-x-1"
                >
                  <span>{stage.routeText}</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>

              <h3 className="text-lg font-bold text-[#F8FAFC] tracking-tight">
                {stage.title}
              </h3>
              <div className="text-xs font-mono text-[#8291A8] mt-0.5 mb-2.5">
                {stage.subtitle}
              </div>

              <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed mb-3">
                {stage.summary}
              </p>

              {stage.safeguardNote && (
                <div className="mb-3 p-2.5 rounded-lg bg-[#050912] border border-[#1E293B] flex items-start space-x-2">
                  <ShieldCheck
                    className="w-3.5 h-3.5 shrink-0 mt-0.5"
                    style={{ color: stage.accent }}
                  />
                  <span className="text-[11px] text-[#A8B5C9] font-mono leading-tight">
                    {stage.safeguardNote}
                  </span>
                </div>
              )}

              {/* Micro Specs */}
              <div className="pt-2.5 border-t border-[#1E293B] flex flex-wrap gap-2 text-[10px] font-mono text-[#8291A8]">
                {stage.badges.map((b, bIdx) => (
                  <span
                    key={bIdx}
                    className="px-2 py-0.5 rounded bg-[#050912] border border-[#1E293B]"
                  >
                    {b}
                  </span>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
