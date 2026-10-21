import React from 'react';
import {
  MapPin,
  Calendar,
  Thermometer,
  Cpu,
  GitCommit,
  AlertTriangle,
  ShieldCheck,
  Database
} from 'lucide-react';
import { LOCKED_MODEL_METADATA } from '../config/constants';

export const MethodologyPage: React.FC = () => {
  return (
    <div className="h-full w-full overflow-y-auto bg-[#080D18] text-[#F5F7FB] p-4 sm:p-6 lg:p-8 space-y-6 select-none max-w-5xl mx-auto">
      {/* Header Banner */}
      <section className="bg-[#0D1525] border border-[#26354A] rounded-2xl p-5 sm:p-6 shadow-xs space-y-2">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-5 h-5 text-[#19D3C5]" />
          <span className="text-[11px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-[#19D3C5]/10 text-[#19D3C5] border border-[#19D3C5]/30">
            Scientific Methodology & Research Pipeline
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-[#F5F7FB] tracking-tight">
          Machine Learning-Based Urban Heat Hotspot Detection Methodology
        </h1>
        <p className="text-xs sm:text-sm text-[#8291A8] leading-relaxed max-w-3xl">
          Comprehensive scientific documentation detailing satellite data acquisition, radiometric calibration, spectral index extraction, machine learning classification, and spatial clustering in Mysuru, Karnataka, India.
        </p>
      </section>

      {/* Interactive 5-Step Workflow Pipeline Diagram */}
      <section className="bg-[#0D1525] border border-[#26354A] rounded-2xl p-5 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-[#F5F7FB] uppercase tracking-wider flex items-center space-x-2">
            <Database className="w-4 h-4 text-[#19D3C5]" />
            <span>End-to-End Research Processing Flowchart</span>
          </h2>
          <span className="text-[10px] font-mono text-[#8291A8]">5-Stage Sequential Lineage</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 text-center text-xs font-mono pt-1">
          <div className="bg-[#111C2E] p-3 rounded-xl border border-[#26354A] flex flex-col items-center justify-center space-y-1 shadow-2xs">
            <div className="w-6 h-6 rounded-full bg-[#19D3C5]/10 text-[#19D3C5] border border-[#19D3C5]/30 flex items-center justify-center font-bold text-xs mb-1">
              1
            </div>
            <span className="text-[#19D3C5] font-bold font-sans">Acquisition</span>
            <span className="text-[10px] text-[#8291A8]">Landsat 8 & 9 (8 Dates)</span>
          </div>

          <div className="bg-[#111C2E] p-3 rounded-xl border border-[#26354A] flex flex-col items-center justify-center space-y-1 shadow-2xs">
            <div className="w-6 h-6 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-xs mb-1">
              2
            </div>
            <span className="text-emerald-400 font-bold font-sans">Radiometry</span>
            <span className="text-[10px] text-[#8291A8]">LST, NDVI & NDBI</span>
          </div>

          <div className="bg-[#111C2E] p-3 rounded-xl border border-[#26354A] flex flex-col items-center justify-center space-y-1 shadow-2xs">
            <div className="w-6 h-6 rounded-full bg-amber-950/60 text-amber-400 border border-amber-500/30 flex items-center justify-center font-bold text-xs mb-1">
              3
            </div>
            <span className="text-amber-400 font-bold font-sans">Pseudo-Labels</span>
            <span className="text-[10px] text-[#8291A8]">P80 LST Cut-off</span>
          </div>

          <div className="bg-[#162238] p-3 rounded-xl border border-[#19D3C5]/40 flex flex-col items-center justify-center space-y-1 shadow-2xs">
            <div className="w-6 h-6 rounded-full bg-[#19D3C5] text-[#06151A] flex items-center justify-center font-bold text-xs mb-1 shadow-xs">
              4
            </div>
            <span className="text-[#19D3C5] font-bold font-sans">Random Forest</span>
            <span className="text-[10px] text-[#19D3C5]/80">100 Trees (86.6% F1)</span>
          </div>

          <div className="bg-[#111C2E] p-3 rounded-xl border border-[#26354A] flex flex-col items-center justify-center space-y-1 shadow-2xs">
            <div className="w-6 h-6 rounded-full bg-purple-950/60 text-purple-400 border border-purple-500/30 flex items-center justify-center font-bold text-xs mb-1">
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
        <section className="bg-[#0D1525] border border-[#26354A] rounded-2xl p-5 shadow-xs space-y-3">
          <h2 className="text-xs font-bold text-[#F5F7FB] uppercase tracking-wider flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-[#19D3C5]" />
            <span>1. Research Objective & Study Area</span>
          </h2>
          <p>
            Rapid urbanization in tier-2 cities across South Asia drives the expansion of impervious built materials and vegetation removal, creating localized surface urban heat islands (SUHI). The primary research objective is to develop a predictive machine learning pipeline capable of mapping relative urban surface thermal hotspots using optical surface reflectance alone, mitigating dependence on cloud-contaminated thermal infrared sensors.
          </p>
          <div className="bg-[#111C2E] p-3 rounded-xl border border-[#26354A] grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px]">
            <div>
              <span className="text-[#8291A8] block text-[9.5px] uppercase font-sans">Study Region</span>
              <span className="font-bold text-[#F5F7FB]">Mysuru, Karnataka</span>
            </div>
            <div>
              <span className="text-[#8291A8] block text-[9.5px] uppercase font-sans">Coordinate System</span>
              <span className="font-bold text-[#F5F7FB]">UTM 43N (EPSG:32643)</span>
            </div>
            <div>
              <span className="text-[#8291A8] block text-[9.5px] uppercase font-sans">Built Domain</span>
              <span className="font-bold text-[#19D3C5]">132.13 km² (146,810 px)</span>
            </div>
            <div>
              <span className="text-[#8291A8] block text-[9.5px] uppercase font-sans">Persistence Domain</span>
              <span className="font-bold text-[#19D3C5]">93.66 km² (104,063 px)</span>
            </div>
          </div>
        </section>

        {/* 2. Landsat Multi-Temporal Cadence */}
        <section className="bg-[#0D1525] border border-[#26354A] rounded-2xl p-5 shadow-xs space-y-3">
          <h2 className="text-xs font-bold text-[#F5F7FB] uppercase tracking-wider flex items-center space-x-2">
            <Calendar className="w-4 h-4 text-[#19D3C5]" />
            <span>2. Multi-Temporal Satellite Imagery Inventory</span>
          </h2>
          <p>
            Eight cloud-free Landsat-8 and Landsat-9 OLI/TIRS scenes (Path 144, Row 51) were acquired across the peak summer heat period of 2023 (April 1 – May 27) with an alternating 8-day satellite revisit cadence:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[10.5px]">
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
              <div key={item.d} className="bg-[#111C2E] p-2 rounded-lg border border-[#26354A]">
                <span className="font-bold text-[#F5F7FB] block">{item.d}</span>
                <span className="text-[9.5px] text-[#19D3C5]">{item.s}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 3. LST Retrieval & Spectral Formulations */}
        <section className="bg-[#0D1525] border border-[#26354A] rounded-2xl p-5 shadow-xs space-y-3">
          <h2 className="text-xs font-bold text-[#F5F7FB] uppercase tracking-wider flex items-center space-x-2">
            <Thermometer className="w-4 h-4 text-[#19D3C5]" />
            <span>3. Radiometric LST Derivation & Spectral Formulations</span>
          </h2>
          <p>
            Land Surface Temperature was derived from Landsat Collection 2 Level-2 ST_B10 top-of-atmosphere radiance through single-channel atmospheric correction and surface emissivity estimation based on Fractional Vegetation Cover (FVC). Optical predictors were calculated as:
          </p>
          <div className="bg-[#111C2E] p-3 rounded-xl border border-[#26354A] font-mono text-[11px] space-y-2">
            <div>
              <span className="text-amber-400 font-bold block">USGS Landsat Collection 2 Level-2 ST Radiometric Calibration:</span>
              <code className="text-[#19D3C5]">LST (°C) = (DN × 0.00341802 + 149.0) - 273.15</code>
              <span className="text-[#8291A8] block text-[10px] mt-0.5">Where DN is Band 10 pixel digital number; calibrated directly to degrees Celsius.</span>
            </div>
            <div className="pt-2 border-t border-[#26354A]">
              <span className="text-emerald-400 font-bold block">NDVI (Normalized Difference Vegetation Index):</span>
              <code className="text-[#19D3C5]">NDVI = (NIR [Band 5] - Red [Band 4]) / (NIR [Band 5] + Red [Band 4])</code>
              <span className="text-[#8291A8] block text-[10px] mt-0.5">Captures chlorophyll absorption; ranges from -0.20 (water/barren) to +0.80 (dense canopy).</span>
            </div>
            <div className="pt-2 border-t border-[#26354A]">
              <span className="text-amber-400 font-bold block">NDBI (Normalized Difference Built-up Index):</span>
              <code className="text-[#19D3C5]">NDBI = (SWIR₁ [Band 6] - NIR [Band 5]) / (SWIR₁ [Band 6] + NIR [Band 5])</code>
              <span className="text-[#8291A8] block text-[10px] mt-0.5">Captures impervious concrete/asphalt reflectance; ranges from -0.40 to +0.60.</span>
            </div>
          </div>
        </section>

        {/* 4. Pseudo-Reference Label Generation & Model Training */}
        <section className="bg-[#0D1525] border border-[#26354A] rounded-2xl p-5 shadow-xs space-y-3">
          <h2 className="text-xs font-bold text-[#F5F7FB] uppercase tracking-wider flex items-center space-x-2">
            <Cpu className="w-4 h-4 text-[#19D3C5]" />
            <span>4. Pseudo-Reference Label Protocol & Random Forest Classifier</span>
          </h2>
          <p>
            Thermal hotspot reference labels were created by calculating the 80th percentile ($P_{80}$) of the LST distribution within the urban built domain for each date:
          </p>
          <div className="bg-[#111C2E] p-3 rounded-xl border border-[#26354A] font-mono text-[11px] text-[#19D3C5]">
            <code>y(x, y) = 1 if LST(x, y) ≥ P80(date) else 0</code>
          </div>
          <p>
            A <strong>Random Forest Classifier</strong> (100 estimators, max depth 5, Gini criterion) was trained using <strong>only optical predictors (NDBI & NDVI)</strong>. Thermal LST, spatial coordinates, and temporal date keys were strictly excluded from the feature matrix to eliminate thermal leakage and prevent spatial memorization.
          </p>
        </section>

        {/* 5. Spatial Block Cross-Validation */}
        <section className="bg-[#0D1525] border border-[#26354A] rounded-2xl p-5 shadow-xs space-y-3">
          <h2 className="text-xs font-bold text-[#F5F7FB] uppercase tracking-wider flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>5. Spatially Independent Test Evaluation</span>
          </h2>
          <p>
            Standard random k-fold cross-validation severely inflates performance in spatial remote sensing due to spatial autocorrelation between adjacent pixels. To ensure true spatial generalization, an <strong>independent spatial block hold-out protocol</strong> was implemented:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-center pt-1">
            <div className="bg-[#19D3C5]/10 p-2.5 rounded-xl border border-[#19D3C5]/30">
              <span className="text-[9.5px] text-[#19D3C5] font-bold block font-sans uppercase">F1-Score</span>
              <span className="font-extrabold text-[#19D3C5] text-sm">86.60%</span>
            </div>
            <div className="bg-[#111C2E] p-2.5 rounded-xl border border-[#26354A]">
              <span className="text-[9.5px] text-[#8291A8] block font-sans uppercase">Accuracy</span>
              <span className="font-bold text-[#F5F7FB] text-sm">86.67%</span>
            </div>
            <div className="bg-[#111C2E] p-2.5 rounded-xl border border-[#26354A]">
              <span className="text-[9.5px] text-[#8291A8] block font-sans uppercase">ROC-AUC</span>
              <span className="font-bold text-[#F5F7FB] text-sm">93.37%</span>
            </div>
            <div className="bg-[#111C2E] p-2.5 rounded-xl border border-[#26354A]">
              <span className="text-[9.5px] text-[#8291A8] block font-sans uppercase">Kappa</span>
              <span className="font-bold text-[#F5F7FB] text-sm">0.7333</span>
            </div>
          </div>
          <p className="text-[11px] text-[#8291A8]">
            Evaluated on 195 held-out samples across 10 disjoint spatial blocks (Confusion matrix: 85 TN, 13 FP, 13 FN, 84 TP).
          </p>
        </section>

        {/* 6. Multi-Temporal Persistence & Gi* Clustering */}
        <section className="bg-[#0D1525] border border-[#26354A] rounded-2xl p-5 shadow-xs space-y-3">
          <h2 className="text-xs font-bold text-[#F5F7FB] uppercase tracking-wider flex items-center space-x-2">
            <GitCommit className="w-4 h-4 text-[#19D3C5]" />
            <span>6. Persistence & Getis-Ord Gi* Spatial Clustering</span>
          </h2>
          <p>
            To isolate persistent structural urban heat islands from passing weather microclimates, two complementary spatial analyses were performed:
          </p>
          <ul className="space-y-2 list-disc list-inside">
            <li>
              <strong>Multi-Temporal Persistence:</strong> Evaluates hotspot recurrence frequency over 8 dates, identifying <strong>8.81 km² (9.40%)</strong> of chronic structural thermal hotspots (&gt;75–100% recurrence).
            </li>
            <li>
              <strong>Getis-Ord Gi* Spatial Autocorrelation:</strong> Identifies statistically significant local spatial clustering of high temperatures using Benjamini-Hochberg False Discovery Rate correction (pFDR &lt; 0.05, Gi* &gt; 0), corroborating an <strong>8.86 km² (9.46%)</strong> hot spot cluster centered on the urban commercial core.
            </li>
          </ul>
        </section>

        {/* 7. Scientific Disclosures & Limitations */}
        <section className="bg-amber-950/30 border border-amber-500/30 rounded-2xl p-5 space-y-2.5">
          <div className="flex items-center space-x-2 font-bold text-amber-300">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-xs uppercase tracking-wider">7. Scientific Governance & Responsible Interpretation</span>
          </div>
          <div className="space-y-1.5 text-amber-200/90 text-xs">
            <p>
              • <strong>Skin vs Air Temperature:</strong> Landsat LST measures surface radiometric skin temperature at satellite overpass (~10:45 AM), which differs substantially from 2 m ambient air temperature.
            </p>
            <p>
              • <strong>Pseudo-Reference Labels:</strong> Training labels represent statistical percentiles ($P_{80}$ LST) and are designated as pseudo-reference labels, not independently verified ground truth.
            </p>
            <p>
              • <strong>Heatwaves vs Hotspots:</strong> Relative surface thermal hotspots do not by themselves constitute official meteorological heatwaves declared by government weather agencies.
            </p>
            <p>
              • <strong>Correlation vs Causation:</strong> While NDBI and NDVI correlate strongly with LST, thermal hotspots emerge from complex thermodynamic interactions including albedo, thermal mass, and anthropogenic emissions.
            </p>
          </div>
          <div className="pt-2 border-t border-amber-500/20 text-[10px] font-mono text-amber-300/80">
            Locked Model Checksum: {LOCKED_MODEL_METADATA.sha256}
          </div>
        </section>
      </div>
    </div>
  );
};
