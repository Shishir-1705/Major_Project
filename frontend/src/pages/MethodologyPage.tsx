import React from 'react';
import { Database, Layers, Cpu, GitCommit, AlertTriangle, ShieldCheck } from 'lucide-react';
import { LOCKED_MODEL_METADATA } from '../config/constants';

export const MethodologyPage: React.FC = () => {
  return (
    <div className="h-full w-full overflow-y-auto bg-[#f8fafc] text-slate-800 p-4 sm:p-6 lg:p-8 space-y-6 select-none max-w-5xl mx-auto">
      {/* Header Banner */}
      <section className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs space-y-2">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-5 h-5 text-teal-600" />
          <span className="text-[11px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
            Scientific Documentation
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Research Methodology & Processing Governance
        </h1>
        <p className="text-xs text-slate-500">
          Complete scientific pipeline and standards for machine learning-based urban heat hotspot detection in Mysuru, Karnataka, India.
        </p>
      </section>

      {/* Flowchart Diagram */}
      <section className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-3">
        <h2 className="text-xs font-bold text-teal-800 uppercase tracking-wider flex items-center space-x-1.5">
          <Database className="w-4 h-4 text-teal-600 inline" />
          <span>Scientific Processing Pipeline Flowchart</span>
        </h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 text-center text-[10.5px] font-mono pt-1">
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 flex flex-col items-center justify-center space-y-1 shadow-2xs">
            <span className="text-teal-700 font-bold">1. Landsat 8/9</span>
            <span className="text-[9px] text-slate-500">ST_B10 + SR B4–B6</span>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 flex flex-col items-center justify-center space-y-1 shadow-2xs">
            <span className="text-emerald-700 font-bold">2. Indices</span>
            <span className="text-[9px] text-slate-500">NDVI & NDBI</span>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 flex flex-col items-center justify-center space-y-1 shadow-2xs">
            <span className="text-amber-700 font-bold">3. Target Labels</span>
            <span className="text-[9px] text-slate-500">P20 / P80 LST</span>
          </div>
          <div className="bg-teal-50/80 p-3 rounded-xl border border-teal-200 flex flex-col items-center justify-center space-y-1 shadow-2xs">
            <span className="text-teal-800 font-bold">4. Random Forest</span>
            <span className="text-[9px] text-teal-700">NDVI+NDBI (Opticals)</span>
          </div>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 flex flex-col items-center justify-center space-y-1 shadow-2xs">
            <span className="text-purple-700 font-bold">5. Spatial Stats</span>
            <span className="text-[9px] text-slate-500">Persistence & Gi*</span>
          </div>
        </div>
      </section>

      {/* Pipeline Sections */}
      <div className="space-y-5 text-xs text-slate-600 leading-relaxed">
        {/* Section 1 */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-2">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
            <Layers className="w-4 h-4 text-teal-600 inline" />
            <span>1. Satellite Imagery & Spectral Indices</span>
          </h3>
          <p>
            Landsat 8 and 9 Collection 2 Level-2 Surface Temperature (ST_B10) and Surface Reflectance (SR_B4, SR_B5, SR_B6) rasters were acquired across 8 temporal observations (April 1 – May 27, 2023) at 30m spatial resolution. Spectral indices were calculated as:
          </p>
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 font-mono text-[11px] text-teal-900 space-y-1">
            <div>NDVI = (SR_B5 - SR_B4) / (SR_B5 + SR_B4) [Normalized Difference Vegetation Index]</div>
            <div>NDBI = (SR_B6 - SR_B5) / (SR_B6 + SR_B5) [Normalized Difference Built-up Index]</div>
          </div>
        </div>

        {/* Section 2 */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-2">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
            <Cpu className="w-4 h-4 text-teal-600 inline" />
            <span>2. Machine Learning Pipeline</span>
          </h3>
          <p>
            A Random Forest Classifier (100 estimators, max_depth=5, Gini impurity criterion) was trained on 805 spatial samples across 30 spatial blocks. Only non-thermal optical features (<strong>NDVI + NDBI</strong>) were used as predictors. Thermal LST and spatial coordinates were completely excluded to avoid spatial memorization.
          </p>
        </div>

        {/* Section 3 */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-2">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center space-x-1.5">
            <GitCommit className="w-4 h-4 text-teal-600 inline" />
            <span>3. Spatially Independent Test Evaluation</span>
          </h3>
          <p>
            Performance was evaluated on a 100% spatially held-out test partition consisting of 195 samples across 10 independent spatial blocks:
          </p>
          <div className="grid grid-cols-4 gap-2 font-mono text-center pt-1">
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
              <span className="text-[9px] text-slate-500 block uppercase font-sans">Accuracy</span>
              <span className="font-bold text-slate-900 text-xs">86.67%</span>
            </div>
            <div className="bg-teal-50/80 p-2.5 rounded-xl border border-teal-200">
              <span className="text-[9px] text-teal-700 font-bold block uppercase font-sans">F1-Score</span>
              <span className="font-bold text-teal-800 text-xs">86.60%</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
              <span className="text-[9px] text-slate-500 block uppercase font-sans">ROC-AUC</span>
              <span className="font-bold text-slate-900 text-xs">93.37%</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80">
              <span className="text-[9px] text-slate-500 block uppercase font-sans">Kappa</span>
              <span className="font-bold text-slate-900 text-xs">0.7333</span>
            </div>
          </div>
        </div>

        {/* Governance Notice */}
        <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5 space-y-2">
          <div className="flex items-center space-x-2 font-bold text-amber-800">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Scientific Terminology Governance</span>
          </div>
          <p className="text-amber-900/90 leading-relaxed">
            Target classes in this research represent <strong>"LST-derived thermal hotspot reference labels"</strong>. The model predicts satellite-derived surface thermal vulnerability from optical reflectance patterns and does not predict ambient air temperature or official ground heatwave warnings.
          </p>
          <div className="text-[10px] font-mono text-amber-800 pt-1">
            Model SHA-256: {LOCKED_MODEL_METADATA.sha256}
          </div>
        </div>
      </div>
    </div>
  );
};
