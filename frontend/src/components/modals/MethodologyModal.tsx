import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { X, ShieldCheck, Cpu, Layers, GitCommit, AlertTriangle, Database } from 'lucide-react';
import { LOCKED_MODEL_METADATA } from '../../config/constants';

export const MethodologyModal: React.FC = () => {
  const { isMethodologyModalOpen, setIsMethodologyModalOpen } = useAppStore();

  if (!isMethodologyModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[2000] bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 select-none">
      <div className="bg-white border border-slate-200/80 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-200/80 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-teal-600" />
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Research Methodology & Pipeline Governance
            </h2>
          </div>
          <button
            onClick={() => setIsMethodologyModalOpen(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs leading-relaxed text-slate-600">
          {/* Flowchart Visual Workflow Pipeline */}
          <section className="bg-slate-50/80 p-4 rounded-xl border border-slate-200/80 space-y-2.5">
            <h3 className="text-xs font-bold text-teal-800 uppercase tracking-wider flex items-center space-x-1.5">
              <Database className="w-4 h-4 text-teal-600 inline" />
              <span>Scientific Processing Pipeline Flowchart</span>
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-[10.5px] font-mono">
              <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 flex flex-col items-center justify-center space-y-1 shadow-2xs">
                <span className="text-teal-700 font-bold">1. Landsat 8/9</span>
                <span className="text-[9px] text-slate-500">ST_B10 + SR B4-B6</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 flex flex-col items-center justify-center space-y-1 shadow-2xs">
                <span className="text-emerald-700 font-bold">2. Indices</span>
                <span className="text-[9px] text-slate-500">NDVI & NDBI</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 flex flex-col items-center justify-center space-y-1 shadow-2xs">
                <span className="text-amber-700 font-bold">3. Target Labels</span>
                <span className="text-[9px] text-slate-500">P20 / P80 LST</span>
              </div>
              <div className="bg-teal-50/80 p-2.5 rounded-xl border border-teal-200 flex flex-col items-center justify-center space-y-1 shadow-2xs">
                <span className="text-teal-800 font-bold">4. Random Forest</span>
                <span className="text-[9px] text-teal-700">NDVI+NDBI (Opticals)</span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 flex flex-col items-center justify-center space-y-1 shadow-2xs">
                <span className="text-purple-700 font-bold">5. Spatial Stats</span>
                <span className="text-[9px] text-slate-500">Persistence & Gi*</span>
              </div>
            </div>
          </section>

          {/* Section 1: Satellite Data Acquisition */}
          <section className="space-y-1.5">
            <h3 className="text-xs font-bold text-teal-800 uppercase tracking-wider flex items-center space-x-1.5">
              <Layers className="w-4 h-4 inline mr-1 text-teal-600" /> 1. Landsat 8/9 Satellite Imagery Acquisition
            </h3>
            <p>
              Landsat 8 and 9 Collection 2 Level-2 Surface Temperature (ST_B10) and Surface Reflectance (SR_B4, SR_B5, SR_B6) rasters were acquired across 8 temporal observations (April 1 – May 27, 2023). Spectral indices were derived at 30m spatial resolution:
            </p>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 font-mono text-[11px] text-teal-900 space-y-1">
              <div>NDVI = (SR_B5 - SR_B4) / (SR_B5 + SR_B4) [Vegetation Canopy Index]</div>
              <div>NDBI = (SR_B6 - SR_B5) / (SR_B6 + SR_B5) [Built-up Surface Index]</div>
            </div>
          </section>

          {/* Section 2: Machine Learning Architecture */}
          <section className="space-y-1.5">
            <h3 className="text-xs font-bold text-teal-800 uppercase tracking-wider flex items-center space-x-1.5">
              <Cpu className="w-4 h-4 inline mr-1 text-teal-600" /> 2. Locked Machine Learning Architecture
            </h3>
            <p>
              A Random Forest Classifier (100 trees, max_depth=5, Gini criterion) was trained on 805 spatial samples across 30 spatial blocks using strictly non-thermal optical predictors (<strong>NDVI + NDBI</strong>). Thermal LST and geographic coordinates were 100% excluded as model predictors to prevent spatial memorization.
            </p>
          </section>

          {/* Section 3: Independent Test Evaluation */}
          <section className="space-y-1.5">
            <h3 className="text-xs font-bold text-teal-800 uppercase tracking-wider flex items-center space-x-1.5">
              <GitCommit className="w-4 h-4 inline mr-1 text-teal-600" /> 3. Spatially Independent Test Evaluation
            </h3>
            <p>
              The model was evaluated on a 100% spatially held-out test set (195 samples across 10 spatial blocks) yielding verified performance:
            </p>
            <div className="grid grid-cols-4 gap-2 font-mono text-center pt-1">
              <div className="bg-slate-50 p-2 rounded-xl border border-slate-200/80">
                <span className="text-[9px] text-slate-500 block uppercase font-sans">Accuracy</span>
                <span className="font-bold text-slate-900 text-xs">86.67%</span>
              </div>
              <div className="bg-teal-50/80 p-2 rounded-xl border border-teal-200">
                <span className="text-[9px] text-teal-700 font-bold block uppercase font-sans">F1-Score</span>
                <span className="font-bold text-teal-800 text-xs">86.60%</span>
              </div>
              <div className="bg-slate-50 p-2 rounded-xl border border-slate-200/80">
                <span className="text-[9px] text-slate-500 block uppercase font-sans">ROC-AUC</span>
                <span className="font-bold text-slate-900 text-xs">93.37%</span>
              </div>
              <div className="bg-slate-50 p-2 rounded-xl border border-slate-200/80">
                <span className="text-[9px] text-slate-500 block uppercase font-sans">Kappa</span>
                <span className="font-bold text-slate-900 text-xs">0.7333</span>
              </div>
            </div>
          </section>

          {/* Governance Disclaimer Notice */}
          <section className="space-y-1.5 bg-amber-50/70 p-3.5 rounded-xl border border-amber-200 text-[11px]">
            <div className="flex items-center space-x-1.5 text-amber-800 font-bold uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
              <span>Scientific Governance & Terminology</span>
            </div>
            <p className="text-amber-900/90 leading-normal">
              Target classes represent <strong>"LST-derived thermal hotspot reference labels"</strong>. The machine learning model predicts satellite-derived thermal reference categories from optical surface properties and does not predict ambient air temperatures or official ground heatwave warnings.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-slate-200/80 bg-slate-50/80 flex justify-between items-center text-[11px] font-mono text-slate-500">
          <span>SHA-256: {LOCKED_MODEL_METADATA.sha256.substring(0, 24)}...</span>
          <button
            onClick={() => setIsMethodologyModalOpen(false)}
            className="px-4 py-1.5 bg-teal-600 hover:bg-teal-700 text-white font-sans font-semibold rounded-lg transition-colors shadow-2xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
