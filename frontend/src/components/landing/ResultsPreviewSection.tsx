import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  ShieldCheck,
  GitCommit,
  BarChart2,
  ArrowRight,
  Eye,
  Layers,
  Sparkles,
  Compass,
  Flame,
  Activity
} from 'lucide-react';

type ResultKey = 'rf_prob' | 'persistence' | 'clusters';

interface ResultDetail {
  id: ResultKey;
  title: string;
  category: string;
  image: string;
  accent: string;
  accentBg: string;
  accentBorder: string;
  icon: React.ElementType;
  route: string;
  routeText: string;
  badge: string;
  summary: string;
  scientificNote: string;
  specs: string[];
}

export const ResultsPreviewSection: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const [activeResult, setActiveResult] = useState<ResultKey>('rf_prob');

  const results: Record<ResultKey, ResultDetail> = {
    rf_prob: {
      id: 'rf_prob',
      title: 'Random Forest Hotspot Inference',
      category: 'Predictive Modeling',
      image: '/assets/landing/preview_rf_prob.png',
      accent: '#EF4444',
      accentBg: 'rgba(239, 68, 68, 0.12)',
      accentBorder: 'rgba(239, 68, 68, 0.35)',
      icon: ShieldCheck,
      route: '/hotspots',
      routeText: 'Launch Hotspots Map',
      badge: 'ML Inference // Probability [0.0, 1.0]',
      summary:
        'The locked Random Forest model estimates continuous probability (0.0 to 1.0) of hotspot occurrence using only NDVI and NDBI as predictors. Hotspot probability represents the classifier output rather than direct surface temperature.',
      scientificNote:
        'Evaluation result: 86.7% test accuracy and 0.934 ROC-AUC on held-out test data (SHA-256 verified locked weights).',
      specs: [
        'Inputs: NDVI + NDBI Only (Zero LST Leakage)',
        'Decision Threshold: P ≥ 0.50 Hotspot Classification',
        'Spatial Resolution: 30-meter UTM Zone 43N'
      ]
    },
    persistence: {
      id: 'persistence',
      title: 'Multi-Temporal Hotspot Persistence',
      category: 'Temporal Stability Analytics',
      image: '/assets/landing/preview_persistence.png',
      accent: '#F59E0B',
      accentBg: 'rgba(245, 158, 11, 0.12)',
      accentBorder: 'rgba(245, 158, 11, 0.35)',
      icon: GitCommit,
      route: '/persistence',
      routeText: 'Launch Persistence Map',
      badge: 'Temporal Composite // 8 Acquisitions',
      summary:
        'Quantifies multi-temporal hotspot recurrence across the eight pre-monsoon observation dates. Persistence is evaluated strictly for cells with ≥ 4 cloud-free observations to isolate chronic hotspots from single-date transient events.',
      scientificNote:
        'Computed across multi-temporal acquisition dates (April–May 2023) to characterize persistent vs. transient thermal risk.',
      specs: [
        'Multi-Date Domain: Cells with ≥ 4 Valid Observations',
        'Persistence Scale: 5 Hierarchical Recurrence Tiers',
        'Temporal Window: 2023-04-01 to 2023-05-27'
      ]
    },
    clusters: {
      id: 'clusters',
      title: 'Getis-Ord Gi* Spatial Clusters',
      category: 'Spatial Autocorrelation',
      image: '/assets/landing/preview_clusters.png',
      accent: '#38BDF8',
      accentBg: 'rgba(56, 189, 248, 0.12)',
      accentBorder: 'rgba(56, 189, 248, 0.35)',
      icon: BarChart2,
      route: '/clusters',
      routeText: 'Launch Gi* Clusters Map',
      badge: 'Spatial Clustering // FDR p < 0.05',
      summary:
        'Identifies distance-weighted local spatial clustering to detect statistically significant hot and cold spots. Locations are confirmed as significant clusters only when satisfying False Discovery Rate control (pFDR < 0.05), distinguishing true clusters from random noise.',
      scientificNote:
        'Benjamini-Hochberg FDR correction (pFDR < 0.05) controls multi-comparison false discovery rates across all 155,625 cells.',
      specs: [
        'Significance Standard: Benjamini-Hochberg FDR p < 0.05',
        'Cluster Classes: Significant Hot, Significant Cold, Nonsignificant',
        'Spatial Kernel: Distance-Weighted Fixed Distance Band'
      ]
    }
  };

  const current = results[activeResult];

  return (
    <section className="relative w-full py-16 md:py-24 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto border-t border-[#1E293B]">
      {/* 1. Concise Editorial Heading */}
      <div className="max-w-3xl mb-10 md:mb-14 text-left">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#0D1525] border border-[#26354A] text-xs font-mono text-[#FBBF24] mb-3">
          <Sparkles className="w-3.5 h-3.5" />
          <span>RESEARCH SYNTHESIS & OUTPUTS</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#F8FAFC] tracking-tight">
          Predictive & Spatial Hotspot Findings
        </h2>
        <p className="text-sm sm:text-base text-[#94A3B8] mt-3 leading-relaxed max-w-2xl">
          Examine the analytical outputs of the Mysuru urban heat investigation, spanning machine-learning predictive probabilities, multi-temporal persistence composites, and statistically validated spatial autocorrelation clusters.
        </p>
      </div>

      {/* 2 & 3. Asymmetric Results Showcase: 7 cols Prominent Map / 5 cols Supporting Summaries */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 xl:gap-12 items-start mb-16 md:mb-20">
        {/* Left Column: One Prominent Map Visualization */}
        <motion.div
          initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6 }}
          className="lg:col-span-7 xl:col-span-7 flex flex-col space-y-3"
        >
          {/* Top Pill Controls to Switch Prominent Map */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 p-2 rounded-xl bg-[#0D1525] border border-[#26354A]">
            <div className="flex items-center space-x-1 bg-[#050912] p-1 rounded-lg border border-[#1E293B]">
              <button
                onClick={() => setActiveResult('rf_prob')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                  activeResult === 'rf_prob'
                    ? 'bg-[#162238] text-[#EF4444] font-semibold border border-[#EF4444]/40 shadow-xs'
                    : 'text-[#8291A8] hover:text-[#F8FAFC]'
                }`}
                aria-pressed={activeResult === 'rf_prob'}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>ML Hotspots</span>
              </button>

              <button
                onClick={() => setActiveResult('persistence')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                  activeResult === 'persistence'
                    ? 'bg-[#162238] text-[#F59E0B] font-semibold border border-[#F59E0B]/40 shadow-xs'
                    : 'text-[#8291A8] hover:text-[#F8FAFC]'
                }`}
                aria-pressed={activeResult === 'persistence'}
              >
                <GitCommit className="w-3.5 h-3.5" />
                <span>Persistence</span>
              </button>

              <button
                onClick={() => setActiveResult('clusters')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all cursor-pointer ${
                  activeResult === 'clusters'
                    ? 'bg-[#162238] text-[#38BDF8] font-semibold border border-[#38BDF8]/40 shadow-xs'
                    : 'text-[#8291A8] hover:text-[#F8FAFC]'
                }`}
                aria-pressed={activeResult === 'clusters'}
              >
                <BarChart2 className="w-3.5 h-3.5" />
                <span>Gi* Clusters</span>
              </button>
            </div>

            <div className="text-[11px] font-mono text-[#8291A8] hidden sm:block pr-2">
              Verified GeoTIFF Raster
            </div>
          </div>

          {/* Prominent High-Resolution Map Frame */}
          <div className="relative aspect-[4/3] sm:aspect-[16/10] min-h-[300px] sm:min-h-[400px] w-full rounded-2xl overflow-hidden bg-[#050912] border border-[#26354A] shadow-2xl select-none group">
            <img
              key={current.id}
              src={current.image}
              alt={current.title}
              className="w-full h-full object-cover object-[72%_center] transition-transform duration-700 ease-out group-hover:scale-102"
              loading="lazy"
            />

            {/* Gradient Lighting */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#06090F]/90 via-transparent to-transparent opacity-60 pointer-events-none" />

            {/* Floating Top Badge */}
            <div className="absolute top-3 left-3 bg-[#080D18]/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#26354A] flex items-center space-x-2 z-10 pointer-events-none">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: current.accent }} />
              <span className="text-xs font-mono font-medium text-[#F8FAFC]">
                {current.badge}
              </span>
            </div>

            {/* Bottom Glass Caption & Interactive Link */}
            <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-[#080D18]/90 backdrop-blur-md border border-[#26354A]/90 text-left z-10">
              <div className="space-y-0.5 max-w-[70%] truncate">
                <div className="text-xs font-mono text-[#F8FAFC] font-semibold truncate">
                  {current.title}
                </div>
                <div className="text-[11px] text-[#8291A8] font-mono truncate">
                  Landsat 8/9 Level-2 • 30m UTM 43N • Mysuru AOI
                </div>
              </div>

              <Link
                to={current.route}
                className="inline-flex items-center space-x-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-[#111C2E] border border-[#26354A] hover:border-[#19D3C5]/40 text-[#19D3C5] hover:text-white transition-colors shrink-0"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Open Map</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Technical Specifications Bar */}
          <div className="p-3.5 rounded-xl bg-[#080D18] border border-[#1E293B] text-left">
            <div className="text-[10px] font-mono uppercase text-[#8291A8] font-semibold mb-2">
              LAYER SPECIFICATIONS
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono text-[#E2E8F0]">
              {current.specs.map((spec, sIdx) => (
                <div key={sIdx} className="p-2 rounded-lg bg-[#050912] border border-[#1E293B] text-[11px]">
                  {spec}
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Right Column: 3 Supporting Analytical Summaries */}
        <div className="lg:col-span-5 xl:col-span-5 flex flex-col space-y-4 text-left">
          {(Object.keys(results) as ResultKey[]).map((key) => {
            const item = results[key];
            const Icon = item.icon;
            const isSelected = activeResult === key;

            return (
              <motion.div
                key={item.id}
                initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, x: 16 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.5 }}
                onClick={() => setActiveResult(key)}
                className={`p-5 rounded-2xl bg-[#0A0F1D] border transition-all cursor-pointer group ${
                  isSelected
                    ? 'border-[#26354A] shadow-xl'
                    : 'border-[#1E293B] hover:border-[#26354A]'
                }`}
                style={{
                  borderColor: isSelected ? item.accent : undefined,
                  boxShadow: isSelected ? `0 8px 24px -8px ${item.accent}30` : undefined
                }}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div
                      className="w-7 h-7 rounded-lg flex items-center justify-center border"
                      style={{
                        backgroundColor: item.accentBg,
                        borderColor: item.accentBorder,
                        color: item.accent
                      }}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <span
                      className="font-mono text-[11px] font-semibold uppercase tracking-wider"
                      style={{ color: item.accent }}
                    >
                      {item.category}
                    </span>
                  </div>

                  <Link
                    to={item.route}
                    className="text-xs font-mono text-[#8291A8] hover:text-[#F8FAFC] flex items-center space-x-1 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <span>{item.route}</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>

                <h3 className="text-lg font-bold text-[#F8FAFC] tracking-tight group-hover:text-white transition-colors">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed mt-2">
                  {item.summary}
                </p>

                {/* Scientific Note */}
                <div className="mt-3 pt-3 border-t border-[#1E293B] text-[11px] font-mono text-[#8291A8] leading-tight">
                  <span className="text-[#F8FAFC] font-semibold">Scientific Safeguard: </span>
                  {item.scientificNote}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 4 & 5. Concluding Call to Action: Explore the Full Dashboard */}
      <motion.div
        initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.6 }}
        className="relative rounded-3xl bg-gradient-to-b from-[#0D1525] to-[#070B14] border border-[#26354A] p-8 sm:p-12 text-center overflow-hidden shadow-2xl"
      >
        {/* Subtle Ambient Radial Glow */}
        <div
          className="absolute -top-24 left-1/2 -translate-x-1/2 w-[500px] h-[250px] pointer-events-none opacity-20 blur-3xl rounded-full"
          style={{
            background:
              'radial-gradient(circle, rgba(249, 115, 22, 0.4) 0%, rgba(20, 184, 166, 0.2) 50%, transparent 70%)'
          }}
        />

        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#111C2E] border border-[#26354A] text-xs font-mono text-[#F97316] mb-4">
            <Compass className="w-3.5 h-3.5" />
            <span>INTERACTIVE GEOSPATIAL OBSERVATORY</span>
          </div>

          <h3 className="text-2xl sm:text-4xl font-extrabold text-[#F8FAFC] tracking-tight">
            Explore the Complete Spatial Intelligence Dashboard
          </h3>

          <p className="text-sm sm:text-base text-[#94A3B8] max-w-2xl mx-auto mt-3 leading-relaxed">
            Directly query Landsat 8/9 Level-2 rasters, evaluate machine-learning hotspot predictions, and inspect FDR-controlled Getis-Ord Gi* clusters across Mysuru. Public access with zero authentication required.
          </p>

          {/* Primary & Secondary Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 mt-8">
            <Link
              to="/overview"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#F97316] hover:bg-[#EA580C] text-[#080D18] font-bold text-sm shadow-xl shadow-orange-500/20 hover:shadow-orange-500/30 transition-all inline-flex items-center justify-center space-x-2 group focus:outline-none focus:ring-2 focus:ring-[#F97316]"
            >
              <Layers className="w-4.5 h-4.5 text-[#080D18]" />
              <span>Open Analytical Overview</span>
              <ArrowRight className="w-4 h-4 text-[#080D18] group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/methodology"
              className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#0D1525] hover:bg-[#111C2E] text-[#F8FAFC] font-semibold text-sm border border-[#26354A] hover:border-[#38BDF8]/40 transition-all inline-flex items-center justify-center space-x-2 focus:outline-none focus:ring-2 focus:ring-[#19D3C5]"
            >
              <span>Scientific Methodology</span>
            </Link>
          </div>

          {/* Direct Module Quick-Launch Strip */}
          <div className="mt-8 pt-6 border-t border-[#1E293B] flex flex-wrap items-center justify-center gap-2 text-xs font-mono">
            <span className="text-[#64748B] text-[11px] mr-1">Modules:</span>
            <Link
              to="/lst"
              className="px-2.5 py-1 rounded-md bg-[#050912] border border-[#1E293B] text-[#A8B5C9] hover:text-[#F97316] hover:border-[#F97316]/40 flex items-center space-x-1.5 transition-colors"
            >
              <Flame className="w-3 h-3 text-[#F97316]" />
              <span>/lst (LST Explorer)</span>
            </Link>
            <Link
              to="/hotspots"
              className="px-2.5 py-1 rounded-md bg-[#050912] border border-[#1E293B] text-[#A8B5C9] hover:text-[#EF4444] hover:border-[#EF4444]/40 flex items-center space-x-1.5 transition-colors"
            >
              <ShieldCheck className="w-3 h-3 text-[#EF4444]" />
              <span>/hotspots (ML Inference)</span>
            </Link>
            <Link
              to="/indices"
              className="px-2.5 py-1 rounded-md bg-[#050912] border border-[#1E293B] text-[#A8B5C9] hover:text-[#14B8A6] hover:border-[#14B8A6]/40 flex items-center space-x-1.5 transition-colors"
            >
              <Activity className="w-3 h-3 text-[#14B8A6]" />
              <span>/indices (NDVI & NDBI)</span>
            </Link>
            <Link
              to="/persistence"
              className="px-2.5 py-1 rounded-md bg-[#050912] border border-[#1E293B] text-[#A8B5C9] hover:text-[#F59E0B] hover:border-[#F59E0B]/40 flex items-center space-x-1.5 transition-colors"
            >
              <GitCommit className="w-3 h-3 text-[#F59E0B]" />
              <span>/persistence (Temporal Recurrence)</span>
            </Link>
            <Link
              to="/clusters"
              className="px-2.5 py-1 rounded-md bg-[#050912] border border-[#1E293B] text-[#A8B5C9] hover:text-[#38BDF8] hover:border-[#38BDF8]/40 flex items-center space-x-1.5 transition-colors"
            >
              <BarChart2 className="w-3 h-3 text-[#38BDF8]" />
              <span>/clusters (Gi* Clusters)</span>
            </Link>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
