import React from 'react';
import { Link } from 'react-router-dom';
import {
  MapPin,
  Calendar,
  Thermometer,
  Cpu,
  GitCommit,
  AlertTriangle,
  ShieldCheck,
  Database,
  ArrowLeft,
  Lock
} from 'lucide-react';
import { LOCKED_MODEL_METADATA } from '../config/constants';

export const MethodologyPage: React.FC = () => {
  return (
    <div className="h-full w-full overflow-y-auto bg-transparent text-[#F5F7FB] p-4 sm:p-6 lg:p-8 space-y-6 select-none max-w-5xl mx-auto relative z-10">
      {/* Subtle localized atmospheric lighting orbs for scrollable depth */}
      <div
        className="absolute top-12 right-0 w-96 h-96 rounded-full pointer-events-none opacity-25 blur-3xl -z-10"
        style={{ background: 'radial-gradient(circle, rgba(25, 211, 197, 0.4) 0%, rgba(6, 182, 212, 0.15) 50%, transparent 80%)' }}
        aria-hidden="true"
      />
      <div
        className="absolute top-1/2 -left-20 w-80 h-80 rounded-full pointer-events-none opacity-20 blur-3xl -z-10"
        style={{ background: 'radial-gradient(circle, rgba(249, 115, 22, 0.35) 0%, transparent 70%)' }}
        aria-hidden="true"
      />
      <div
        className="absolute bottom-32 right-12 w-96 h-96 rounded-full pointer-events-none opacity-20 blur-3xl -z-10"
        style={{ background: 'radial-gradient(circle, rgba(14, 165, 233, 0.35) 0%, transparent 70%)' }}
        aria-hidden="true"
      />

      {/* Secondary Navigation Breadcrumb */}
      <nav aria-label="Breadcrumb" className="liquid-glass-chip px-3.5 py-1.5 rounded-full w-fit flex items-center space-x-2 text-xs text-[#8291A8] border border-white/15 shadow-sm">
        <Link to="/overview" className="hover:text-[#19D3C5] transition-colors flex items-center space-x-1 font-medium">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Overview</span>
        </Link>
        <span className="text-white/20">/</span>
        <span className="text-[#F5F7FB] font-medium">Research Methodology</span>
      </nav>

      {/* Header Banner */}
      <section className="liquid-glass-slab rounded-2xl p-6 sm:p-7 shadow-2xl relative overflow-hidden space-y-3">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl liquid-glass-chip flex items-center justify-center text-[#19D3C5] border border-[#19D3C5]/30 shadow-[0_0_15px_rgba(25,211,197,0.2)]">
            <ShieldCheck className="w-4 h-4 text-[#19D3C5]" />
          </div>
          <span className="text-[11px] font-mono font-bold uppercase px-3 py-1 rounded-full liquid-glass-subtle text-[#19D3C5] border border-[#19D3C5]/30">
            Scientific Methodology & Research Pipeline
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#F5F7FB] tracking-tight">
          Machine Learning-Based Urban Heat Hotspot Detection Methodology
        </h1>
        <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed max-w-3xl">
          Comprehensive scientific documentation detailing satellite data acquisition, radiometric calibration, spectral index extraction, machine learning classification, and spatial clustering in Mysuru, Karnataka, India.
        </p>
      </section>

      {/* Interactive 5-Step Workflow Pipeline Diagram */}
      <section className="liquid-glass-slab rounded-2xl p-6 shadow-2xl space-y-4 relative overflow-hidden">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <h2 className="text-xs font-bold text-[#F5F7FB] uppercase tracking-wider flex items-center space-x-2">
            <div className="w-5 h-5 rounded-lg liquid-glass-chip flex items-center justify-center text-[#19D3C5] border border-[#19D3C5]/30">
              <Database className="w-3 h-3 text-[#19D3C5]" />
            </div>
            <span>End-to-End Research Processing Flowchart</span>
          </h2>
          <span className="text-[10px] font-mono text-[#8291A8] liquid-glass-chip px-2.5 py-0.5 rounded-full border border-white/10">5-Stage Sequential Lineage</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 text-center text-xs font-mono pt-1">
          <div className="liquid-glass-subtle hover:border-white/25 transition-all p-3.5 rounded-xl border border-white/12 flex flex-col items-center justify-center space-y-1.5 shadow-sm">
            <div className="w-7 h-7 rounded-full liquid-glass-chip text-[#19D3C5] border border-[#19D3C5]/40 flex items-center justify-center font-bold text-xs shadow-[0_0_10px_rgba(25,211,197,0.2)]">
              1
            </div>
            <span className="text-[#19D3C5] font-bold font-sans">Acquisition</span>
            <span className="text-[10px] text-[#8291A8]">Landsat 8 & 9 (8 Dates)</span>
          </div>

          <div className="liquid-glass-subtle hover:border-white/25 transition-all p-3.5 rounded-xl border border-white/12 flex flex-col items-center justify-center space-y-1.5 shadow-sm">
            <div className="w-7 h-7 rounded-full liquid-glass-chip text-emerald-400 border border-emerald-500/40 flex items-center justify-center font-bold text-xs shadow-[0_0_10px_rgba(52,211,153,0.2)]">
              2
            </div>
            <span className="text-emerald-400 font-bold font-sans">Radiometry</span>
            <span className="text-[10px] text-[#8291A8]">LST, NDVI & NDBI</span>
          </div>

          <div className="liquid-glass-subtle hover:border-white/25 transition-all p-3.5 rounded-xl border border-white/12 flex flex-col items-center justify-center space-y-1.5 shadow-sm">
            <div className="w-7 h-7 rounded-full liquid-glass-chip text-amber-400 border border-amber-500/40 flex items-center justify-center font-bold text-xs shadow-[0_0_10px_rgba(251,191,36,0.2)]">
              3
            </div>
            <span className="text-amber-400 font-bold font-sans">Pseudo-Labels</span>
            <span className="text-[10px] text-[#8291A8]">P80 LST Cut-off</span>
          </div>

          <div className="liquid-glass-slab p-3.5 rounded-xl border border-[#19D3C5]/50 flex flex-col items-center justify-center space-y-1.5 shadow-[0_0_20px_rgba(25,211,197,0.18)] relative">
            <div className="w-7 h-7 rounded-full bg-[#19D3C5] text-[#06151A] flex items-center justify-center font-bold text-xs shadow-[0_0_12px_rgba(25,211,197,0.6)]">
              4
            </div>
            <span className="text-[#19D3C5] font-bold font-sans">Random Forest</span>
            <span className="text-[10px] text-[#19D3C5]/85">100 Trees (86.6% F1)</span>
          </div>

          <div className="liquid-glass-subtle hover:border-white/25 transition-all p-3.5 rounded-xl border border-white/12 flex flex-col items-center justify-center space-y-1.5 shadow-sm">
            <div className="w-7 h-7 rounded-full liquid-glass-chip text-purple-400 border border-purple-500/40 flex items-center justify-center font-bold text-xs shadow-[0_0_10px_rgba(192,132,252,0.2)]">
              5
            </div>
            <span className="text-purple-400 font-bold font-sans">Spatial Analytics</span>
            <span className="text-[10px] text-[#8291A8]">Persistence & Gi*</span>
          </div>
        </div>
      </section>

      {/* Comprehensive Methodological Sections */}
      <div className="space-y-6 text-xs text-[#A8B5C9] leading-relaxed">
        {/* 1. Research Objective & Study Area */}
        <section className="liquid-glass-slab rounded-2xl p-6 sm:p-7 shadow-2xl space-y-4 border border-white/14 hover:border-white/25 transition-all relative overflow-hidden">
          <div className="flex items-center space-x-2.5 pb-2 border-b border-white/10">
            <div className="w-7 h-7 rounded-lg liquid-glass-chip flex items-center justify-center text-[#19D3C5] border border-[#19D3C5]/30 shadow-[0_0_12px_rgba(25,211,197,0.15)]">
              <MapPin className="w-3.5 h-3.5" />
            </div>
            <h2 className="text-xs sm:text-sm font-bold text-[#F5F7FB] uppercase tracking-wider">
              1. Research Objective & Study Area
            </h2>
          </div>
          <p className="text-[#94A3B8] leading-relaxed text-xs sm:text-sm">
            Rapid urbanization in tier-2 cities across South Asia drives the expansion of impervious built materials and vegetation removal, creating localized surface urban heat islands (SUHI). The primary research objective is to develop a predictive machine learning pipeline capable of mapping relative urban surface thermal hotspots using optical surface reflectance alone, mitigating dependence on cloud-contaminated thermal infrared sensors.
          </p>
          <div className="liquid-glass-subtle p-4 rounded-xl border border-white/12 grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-[11px]">
            <div>
              <span className="text-[#8291A8] block text-[9.5px] uppercase font-sans tracking-wide">Study Region</span>
              <span className="font-bold text-[#F5F7FB] text-xs">Mysuru, Karnataka</span>
            </div>
            <div>
              <span className="text-[#8291A8] block text-[9.5px] uppercase font-sans tracking-wide">Coordinate System</span>
              <span className="font-bold text-[#F5F7FB] text-xs">UTM 43N (EPSG:32643)</span>
            </div>
            <div>
              <span className="text-[#8291A8] block text-[9.5px] uppercase font-sans tracking-wide">Baseline Built Domain</span>
              <span className="font-bold text-[#19D3C5] text-xs">132.13 km² (146,810 px)</span>
            </div>
            <div>
              <span className="text-[#8291A8] block text-[9.5px] uppercase font-sans tracking-wide">Valid Analysis Domain</span>
              <span className="font-bold text-[#19D3C5] text-xs">135.25 km² (150,274 px)</span>
            </div>
          </div>
        </section>

        {/* 2. Landsat Multi-Temporal Cadence */}
        <section className="liquid-glass-slab rounded-2xl p-6 sm:p-7 shadow-2xl space-y-4 border border-white/14 hover:border-white/25 transition-all relative overflow-hidden">
          <div className="flex items-center space-x-2.5 pb-2 border-b border-white/10">
            <div className="w-7 h-7 rounded-lg liquid-glass-chip flex items-center justify-center text-[#19D3C5] border border-[#19D3C5]/30 shadow-[0_0_12px_rgba(25,211,197,0.15)]">
              <Calendar className="w-3.5 h-3.5" />
            </div>
            <h2 className="text-xs sm:text-sm font-bold text-[#F5F7FB] uppercase tracking-wider">
              2. Multi-Temporal Satellite Imagery Inventory
            </h2>
          </div>
          <p className="text-[#94A3B8] leading-relaxed text-xs sm:text-sm">
            Eight cloud-free Landsat-8 and Landsat-9 OLI/TIRS scenes (Path 144, Row 51) were acquired across the peak summer heat period of 2023 (April 1 – May 27) with an alternating 8-day satellite revisit cadence:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-[11px]">
            {[
              { d: "2023-04-01", s: "Landsat 9", sc: "LC09_144051_20230401" },
              { d: "2023-04-09", s: "Landsat 8", sc: "LC08_144051_20230409" },
              { d: "2023-04-17", s: "Landsat 9", sc: "LC09_144051_20230417" },
              { d: "2023-04-25", s: "Landsat 8", sc: "LC08_144051_20230425" },
              { d: "2023-05-03", s: "Landsat 9", sc: "LC09_144051_20230503" },
              { d: "2023-05-11", s: "Landsat 8", sc: "LC08_144051_20230511" },
              { d: "2023-05-19", s: "Landsat 9", sc: "LC09_144051_20230519" },
              { d: "2023-05-27", s: "Landsat 8", sc: "LC08_144051_20230527" }
            ].map((item) => (
              <div key={item.d} className="liquid-glass-subtle p-3 rounded-xl border border-white/12 hover:border-[#19D3C5]/30 transition-colors">
                <span className="font-bold text-[#F5F7FB] block text-xs">{item.d}</span>
                <span className="text-[10px] text-[#19D3C5] font-semibold">{item.s}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 3. LST Retrieval & Spectral Formulations */}
        <section className="liquid-glass-slab rounded-2xl p-6 sm:p-7 shadow-2xl space-y-4 border border-white/14 hover:border-white/25 transition-all relative overflow-hidden">
          <div className="flex items-center space-x-2.5 pb-2 border-b border-white/10">
            <div className="w-7 h-7 rounded-lg liquid-glass-chip flex items-center justify-center text-[#19D3C5] border border-[#19D3C5]/30 shadow-[0_0_12px_rgba(25,211,197,0.15)]">
              <Thermometer className="w-3.5 h-3.5" />
            </div>
            <h2 className="text-xs sm:text-sm font-bold text-[#F5F7FB] uppercase tracking-wider">
              3. Radiometric LST Derivation & Spectral Formulations
            </h2>
          </div>
          <p className="text-[#94A3B8] leading-relaxed text-xs sm:text-sm">
            Land Surface Temperature was derived from Landsat Collection 2 Level-2 ST_B10 top-of-atmosphere radiance through single-channel atmospheric correction and surface emissivity estimation based on Fractional Vegetation Cover (FVC). Optical predictors were calculated as:
          </p>
          <div className="liquid-glass-subtle p-4 rounded-xl border border-white/12 font-mono text-[11px] space-y-3">
            <div>
              <span className="text-amber-400 font-bold block">USGS Landsat Collection 2 Level-2 ST Radiometric Calibration:</span>
              <code className="text-[#19D3C5] bg-white/[0.04] px-2 py-1 rounded block mt-1 w-fit">LST (°C) = (DN × 0.00341802 + 149.0) - 273.15</code>
              <span className="text-[#8291A8] block text-[10px] mt-1">Where DN is Band 10 pixel digital number; calibrated directly to degrees Celsius.</span>
            </div>
            <div className="pt-3 border-t border-white/10">
              <span className="text-emerald-400 font-bold block">NDVI (Normalized Difference Vegetation Index):</span>
              <code className="text-[#19D3C5] bg-white/[0.04] px-2 py-1 rounded block mt-1 w-fit">NDVI = (NIR [Band 5] - Red [Band 4]) / (NIR [Band 5] + Red [Band 4])</code>
              <span className="text-[#8291A8] block text-[10px] mt-1">Captures chlorophyll absorption; ranges from -0.20 (water/barren) to +0.80 (dense canopy).</span>
            </div>
            <div className="pt-3 border-t border-white/10">
              <span className="text-amber-400 font-bold block">NDBI (Normalized Difference Built-up Index):</span>
              <code className="text-[#19D3C5] bg-white/[0.04] px-2 py-1 rounded block mt-1 w-fit">NDBI = (SWIR₁ [Band 6] - NIR [Band 5]) / (SWIR₁ [Band 6] + NIR [Band 5])</code>
              <span className="text-[#8291A8] block text-[10px] mt-1">Captures impervious concrete/asphalt reflectance; ranges from -0.40 to +0.60.</span>
            </div>
          </div>
        </section>

        {/* 4. Pseudo-Reference Label Generation & Model Training */}
        <section className="liquid-glass-slab rounded-2xl p-6 sm:p-7 shadow-2xl space-y-4 border border-white/14 hover:border-white/25 transition-all relative overflow-hidden">
          <div className="flex items-center space-x-2.5 pb-2 border-b border-white/10">
            <div className="w-7 h-7 rounded-lg liquid-glass-chip flex items-center justify-center text-[#19D3C5] border border-[#19D3C5]/30 shadow-[0_0_12px_rgba(25,211,197,0.15)]">
              <Cpu className="w-3.5 h-3.5" />
            </div>
            <h2 className="text-xs sm:text-sm font-bold text-[#F5F7FB] uppercase tracking-wider">
              4. Pseudo-Reference Label Protocol & Random Forest Classifier
            </h2>
          </div>
          <p className="text-[#94A3B8] leading-relaxed text-xs sm:text-sm">
            Thermal hotspot reference labels were created by calculating the 80th percentile (P80) of the LST distribution within the urban built domain for each date:
          </p>
          <div className="liquid-glass-subtle p-3.5 rounded-xl border border-white/12 font-mono text-[11px] text-[#19D3C5]">
            <code className="bg-white/[0.04] px-2 py-1 rounded block w-fit">y(x, y) = 1 if LST(x, y) ≥ P80(date) else 0</code>
          </div>
          <p className="text-[#94A3B8] leading-relaxed text-xs sm:text-sm">
            A <strong className="text-[#F5F7FB]">Random Forest Classifier</strong> (100 estimators, max depth 5, Gini criterion) was trained using <strong className="text-[#F5F7FB]">only optical predictors (NDBI & NDVI)</strong>. Thermal LST, spatial coordinates, and temporal date keys were strictly excluded from the feature matrix to eliminate thermal leakage and prevent spatial memorization.
          </p>
        </section>

        {/* 5. Spatial Block Cross-Validation */}
        <section className="liquid-glass-slab rounded-2xl p-6 sm:p-7 shadow-2xl space-y-4 border border-white/14 hover:border-white/25 transition-all relative overflow-hidden">
          <div className="flex items-center space-x-2.5 pb-2 border-b border-white/10">
            <div className="w-7 h-7 rounded-lg liquid-glass-chip flex items-center justify-center text-emerald-400 border border-emerald-500/30 shadow-[0_0_12px_rgba(52,211,153,0.15)]">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
            <h2 className="text-xs sm:text-sm font-bold text-[#F5F7FB] uppercase tracking-wider">
              5. Spatially Independent Test Evaluation
            </h2>
          </div>
          <p className="text-[#94A3B8] leading-relaxed text-xs sm:text-sm">
            Standard random k-fold cross-validation severely inflates performance in spatial remote sensing due to spatial autocorrelation between adjacent pixels. To ensure true spatial generalization, an <strong className="text-[#F5F7FB]">independent spatial block hold-out protocol</strong> was implemented:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-center pt-1">
            <div className="liquid-glass-slab p-3.5 rounded-xl border border-[#19D3C5]/40 shadow-[0_0_15px_rgba(25,211,197,0.12)]">
              <span className="text-[10px] text-[#19D3C5] font-bold block font-sans uppercase tracking-wider">F1-Score</span>
              <span className="font-extrabold text-[#19D3C5] text-base">86.60%</span>
            </div>
            <div className="liquid-glass-subtle p-3.5 rounded-xl border border-white/12 shadow-sm">
              <span className="text-[10px] text-[#8291A8] block font-sans uppercase tracking-wider">Accuracy</span>
              <span className="font-bold text-[#F5F7FB] text-base">86.67%</span>
            </div>
            <div className="liquid-glass-subtle p-3.5 rounded-xl border border-white/12 shadow-sm">
              <span className="text-[10px] text-[#8291A8] block font-sans uppercase tracking-wider">ROC-AUC</span>
              <span className="font-bold text-[#F5F7FB] text-base">93.37%</span>
            </div>
            <div className="liquid-glass-subtle p-3.5 rounded-xl border border-white/12 shadow-sm">
              <span className="text-[10px] text-[#8291A8] block font-sans uppercase tracking-wider">Kappa</span>
              <span className="font-bold text-[#F5F7FB] text-base">0.7333</span>
            </div>
          </div>
          <p className="text-[11px] text-[#8291A8]">
            Evaluated on 195 held-out samples across 10 disjoint spatial blocks (Confusion matrix: 85 TN, 13 FP, 13 FN, 84 TP).
          </p>
        </section>

        {/* 6. Multi-Temporal Persistence & Gi* Clustering */}
        <section className="liquid-glass-slab rounded-2xl p-6 sm:p-7 shadow-2xl space-y-4 border border-white/14 hover:border-white/25 transition-all relative overflow-hidden">
          <div className="flex items-center space-x-2.5 pb-2 border-b border-white/10">
            <div className="w-7 h-7 rounded-lg liquid-glass-chip flex items-center justify-center text-[#19D3C5] border border-[#19D3C5]/30 shadow-[0_0_12px_rgba(25,211,197,0.15)]">
              <GitCommit className="w-3.5 h-3.5" />
            </div>
            <h2 className="text-xs sm:text-sm font-bold text-[#F5F7FB] uppercase tracking-wider">
              6. Persistence & Getis-Ord Gi* Spatial Clustering
            </h2>
          </div>
          <p className="text-[#94A3B8] leading-relaxed text-xs sm:text-sm">
            To isolate persistent structural urban heat islands from passing weather microclimates, two complementary spatial analyses were performed:
          </p>
          <ul className="space-y-2.5 list-disc list-inside text-xs sm:text-sm text-[#94A3B8]">
            <li>
              <strong className="text-[#F5F7FB]">Multi-Temporal Persistence:</strong> Evaluates hotspot recurrence frequency over 8 dates, identifying <strong className="text-[#19D3C5]">8.81 km² (9.40%)</strong> of chronic structural thermal hotspots (&gt;75–100% recurrence).
            </li>
            <li>
              <strong className="text-[#F5F7FB]">Getis-Ord Gi* Spatial Autocorrelation:</strong> Identifies statistically significant local spatial clustering of high temperatures using Benjamini-Hochberg False Discovery Rate correction (pFDR &lt; 0.05, Gi* &gt; 0), corroborating an <strong className="text-[#19D3C5]">8.86 km² (9.46%)</strong> hot spot cluster centered on the urban commercial core.
            </li>
          </ul>
        </section>

        {/* 7. Scientific Disclosures & Limitations */}
        <section className="bg-amber-950/20 border border-amber-500/35 rounded-2xl p-6 sm:p-7 space-y-3.5 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
          <div className="flex items-center space-x-2.5 font-bold text-amber-300">
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center shadow-[0_0_10px_rgba(245,158,11,0.2)]">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            </div>
            <span className="text-xs sm:text-sm uppercase tracking-wider">7. Scientific Governance & Responsible Interpretation</span>
          </div>
          <div className="space-y-2 text-amber-200/90 text-xs sm:text-sm leading-relaxed">
            <p>
              • <strong>Skin vs Air Temperature:</strong> Landsat LST measures surface radiometric skin temperature at satellite overpass (~10:45 AM), which differs substantially from 2 m ambient air temperature.
            </p>
            <p>
              • <strong>Pseudo-Reference Labels:</strong> Training labels represent statistical percentiles (P80 LST) and are designated as pseudo-reference labels, not independently verified ground truth.
            </p>
            <p>
              • <strong>Heatwaves vs Hotspots:</strong> Relative surface thermal hotspots do not by themselves constitute official meteorological heatwaves declared by government weather agencies.
            </p>
            <p>
              • <strong>Correlation vs Causation:</strong> While NDBI and NDVI correlate strongly with LST, thermal hotspots emerge from complex thermodynamic interactions including albedo, thermal mass, and anthropogenic emissions.
            </p>
          </div>
          <div className="pt-3 border-t border-amber-500/25 text-[11px] font-mono text-amber-300 flex items-center justify-between flex-wrap gap-2">
            <span className="flex items-center space-x-1.5">
              <Lock className="w-3 h-3 text-amber-400" />
              <span>Locked Model Checksum:</span>
            </span>
            <span className="px-2 py-0.5 rounded-md bg-amber-950/60 border border-amber-500/30 text-amber-200 select-all font-semibold">
              {LOCKED_MODEL_METADATA.sha256}
            </span>
          </div>
        </section>
      </div>
    </div>
  );
};
