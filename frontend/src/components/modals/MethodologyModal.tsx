import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { X, ShieldCheck, Cpu, Layers, GitCommit, AlertTriangle, Database } from 'lucide-react';
import { LOCKED_MODEL_METADATA } from '../../config/constants';

export const MethodologyModal: React.FC = () => {
  const { isMethodologyModalOpen, setIsMethodologyModalOpen } = useAppStore();

  if (!isMethodologyModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[2000] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 select-none">
      <div className="bg-[#111827] border border-[#1f2937] rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-[#1f2937] flex items-center justify-between bg-slate-950">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-cyan-400" />
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Research Methodology & Pipeline Governance
            </h2>
          </div>
          <button
            onClick={() => setIsMethodologyModalOpen(false)}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs leading-relaxed text-slate-300">
          {/* Flowchart Visual Workflow Pipeline */}
          <section className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2.5">
            <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center space-x-1.5">
              <Database className="w-4 h-4 text-cyan-400 inline" />
              <span>Scientific Processing Pipeline Flowchart</span>
            </h3>
            
            <div className="grid grid-cols-5 gap-1.5 text-center text-[10.5px] font-mono">
              <div className="bg-[#111827] p-2 rounded-lg border border-slate-800 flex flex-col items-center justify-center space-y-1">
                <span className="text-cyan-400 font-bold">1. Landsat 8/9</span>
                <span className="text-[9px] text-slate-400">ST_B10 + SR B4,B5,B6</span>
              </div>
              <div className="bg-[#111827] p-2 rounded-lg border border-slate-800 flex flex-col items-center justify-center space-y-1">
                <span className="text-emerald-400 font-bold">2. Indices</span>
                <span className="text-[9px] text-slate-400">NDVI & NDBI</span>
              </div>
              <div className="bg-[#111827] p-2 rounded-lg border border-slate-800 flex flex-col items-center justify-center space-y-1">
                <span className="text-amber-400 font-bold">3. Target Labels</span>
                <span className="text-[9px] text-slate-400">P20 / P80 LST Percentiles</span>
              </div>
              <div className="bg-[#111827] p-2 rounded-lg border border-cyan-500/40 flex flex-col items-center justify-center space-y-1">
                <span className="text-cyan-300 font-bold">4. Random Forest</span>
                <span className="text-[9px] text-cyan-400">NDVI+NDBI (LST Excluded)</span>
              </div>
              <div className="bg-[#111827] p-2 rounded-lg border border-slate-800 flex flex-col items-center justify-center space-y-1">
                <span className="text-purple-400 font-bold">5. Spatial Stats</span>
                <span className="text-[9px] text-slate-400">Persistence & Gi*</span>
              </div>
            </div>
          </section>

          {/* Section 1: Satellite Data Acquisition */}
          <section className="space-y-1.5">
            <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center space-x-1.5">
              <Layers className="w-4 h-4 inline mr-1" /> 1. Landsat 8/9 Satellite Imagery Acquisition
            </h3>
            <p>
              Landsat 8 and 9 Collection 2 Level-2 Surface Temperature (ST_B10) and Surface Reflectance (SR_B4, SR_B5, SR_B6) rasters were acquired across 8 temporal observations (April 1 – May 27, 2023). Spectral indices were derived at 30m spatial resolution:
            </p>
            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 font-mono text-[11px] text-cyan-300 space-y-1">
              <div>NDVI = (SR_B5 - SR_B4) / (SR_B5 + SR_B4) [Vegetation Index]</div>
              <div>NDBI = (SR_B6 - SR_B5) / (SR_B6 + SR_B5) [Built-up Index]</div>
            </div>
          </section>

          {/* Section 2: Machine Learning Architecture */}
          <section className="space-y-1.5">
            <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center space-x-1.5">
              <Cpu className="w-4 h-4 inline mr-1" /> 2. Locked Machine Learning Architecture
            </h3>
            <p>
              A Random Forest Classifier (100 trees, max_depth=5, Gini criterion) was trained on 805 spatial samples across 30 spatial blocks using strictly non-thermal optical predictors (<strong>NDVI + NDBI</strong>). Thermal LST and geographic coordinates were 100% excluded as model predictors to prevent spatial memorization.
            </p>
          </section>

          {/* Section 3: Independent Test Evaluation */}
          <section className="space-y-1.5">
            <h3 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center space-x-1.5">
              <GitCommit className="w-4 h-4 inline mr-1" /> 3. Spatially Independent Test Evaluation
            </h3>
            <p>
              The model was evaluated on a 100% spatially held-out test set (195 samples across 10 spatial blocks) yielding verified performance:
            </p>
            <div className="grid grid-cols-4 gap-2 font-mono text-center pt-1">
              <div className="bg-slate-950 p-2 rounded border border-slate-800">
                <span className="text-[9px] text-slate-400 block">Accuracy</span>
                <span className="font-bold text-white text-xs">86.67%</span>
              </div>
              <div className="bg-slate-950 p-2 rounded border border-cyan-500/40">
                <span className="text-[9px] text-cyan-400 font-bold block">F1-Score</span>
                <span className="font-bold text-cyan-300 text-xs">86.60%</span>
              </div>
              <div className="bg-slate-950 p-2 rounded border border-slate-800">
                <span className="text-[9px] text-slate-400 block">ROC-AUC</span>
                <span className="font-bold text-emerald-400 text-xs">93.37%</span>
              </div>
              <div className="bg-slate-950 p-2 rounded border border-slate-800">
                <span className="text-[9px] text-slate-400 block">Cohen's Kappa</span>
                <span className="font-bold text-white text-xs">0.7333</span>
              </div>
            </div>
          </section>

          {/* Governance Disclaimer Notice */}
          <section className="space-y-1.5 bg-slate-950 p-3 rounded-xl border border-slate-800 text-[11px]">
            <div className="flex items-center space-x-1.5 text-amber-400 font-bold uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>Scientific Governance & Terminology</span>
            </div>
            <p className="text-slate-400 leading-normal">
              Target classes represent <strong>"LST-derived thermal hotspot reference labels"</strong>. The machine learning model predicts satellite-derived thermal reference categories from optical surface properties and does not predict ambient air temperatures or official ground heatwave warnings.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[#1f2937] bg-slate-950 flex justify-between items-center text-[11px] font-mono text-slate-500">
          <span>SHA-256: {LOCKED_MODEL_METADATA.sha256.substring(0, 24)}...</span>
          <button
            onClick={() => setIsMethodologyModalOpen(false)}
            className="px-4 py-1.5 bg-cyan-600 hover:bg-cyan-500 text-white font-sans font-semibold rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
