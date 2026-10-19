import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { X, ShieldCheck, Cpu, Layers, GitCommit, AlertTriangle, Database } from 'lucide-react';
import { LOCKED_MODEL_METADATA } from '../../config/constants';

export const MethodologyModal: React.FC = () => {
  const { isMethodologyModalOpen, setIsMethodologyModalOpen } = useAppStore();

  if (!isMethodologyModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[2000] bg-[#080D18]/80 backdrop-blur-sm flex items-center justify-center p-4 select-none">
      <div className="bg-[#0D1525] border border-[#26354A] rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-[#26354A] flex items-center justify-between bg-[#111C2E]">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-[#19D3C5]" />
            <h2 className="text-sm font-bold text-[#F5F7FB] uppercase tracking-wider">
              Research Methodology & Pipeline Governance
            </h2>
          </div>
          <button
            onClick={() => setIsMethodologyModalOpen(false)}
            className="p-1.5 rounded-lg text-[#8291A8] hover:text-[#F5F7FB] hover:bg-[#162238] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs leading-relaxed text-[#A8B5C9]">
          {/* Flowchart Visual Workflow Pipeline */}
          <section className="bg-[#111C2E] p-4 rounded-xl border border-[#26354A] space-y-2.5">
            <h3 className="text-xs font-bold text-[#F5F7FB] uppercase tracking-wider flex items-center space-x-1.5">
              <Database className="w-4 h-4 text-[#19D3C5] inline" />
              <span>Scientific Processing Pipeline Flowchart</span>
            </h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-[10.5px] font-mono">
              <div className="bg-[#0D1525] p-2.5 rounded-xl border border-[#26354A] flex flex-col items-center justify-center space-y-1 shadow-2xs">
                <span className="text-[#19D3C5] font-bold">1. Landsat 8/9</span>
                <span className="text-[9px] text-[#8291A8]">ST_B10 + SR B4-B6</span>
              </div>
              <div className="bg-[#0D1525] p-2.5 rounded-xl border border-[#26354A] flex flex-col items-center justify-center space-y-1 shadow-2xs">
                <span className="text-emerald-400 font-bold">2. Indices</span>
                <span className="text-[9px] text-[#8291A8]">NDVI & NDBI</span>
              </div>
              <div className="bg-[#0D1525] p-2.5 rounded-xl border border-[#26354A] flex flex-col items-center justify-center space-y-1 shadow-2xs">
                <span className="text-amber-400 font-bold">3. Target Labels</span>
                <span className="text-[9px] text-[#8291A8]">P20 / P80 LST</span>
              </div>
              <div className="bg-[#162238] p-2.5 rounded-xl border border-[#19D3C5]/40 flex flex-col items-center justify-center space-y-1 shadow-2xs">
                <span className="text-[#19D3C5] font-bold">4. Random Forest</span>
                <span className="text-[9px] text-[#39E4D5]">NDVI+NDBI (Opticals)</span>
              </div>
              <div className="bg-[#0D1525] p-2.5 rounded-xl border border-[#26354A] flex flex-col items-center justify-center space-y-1 shadow-2xs">
                <span className="text-purple-400 font-bold">5. Spatial Stats</span>
                <span className="text-[9px] text-[#8291A8]">Persistence & Gi*</span>
              </div>
            </div>
          </section>

          {/* Section 1: Satellite Data Acquisition */}
          <section className="space-y-1.5">
            <h3 className="text-xs font-bold text-[#F5F7FB] uppercase tracking-wider flex items-center space-x-1.5">
              <Layers className="w-4 h-4 inline mr-1 text-[#19D3C5]" /> 1. Landsat 8/9 Satellite Imagery Acquisition
            </h3>
            <p>
              Landsat 8 and 9 Collection 2 Level-2 Surface Temperature (ST_B10) and Surface Reflectance (SR_B4, SR_B5, SR_B6) rasters were acquired across 8 temporal observations (April 1 – May 27, 2023). Spectral indices were derived at 30m spatial resolution:
            </p>
            <div className="bg-[#111C2E] p-2.5 rounded-xl border border-[#26354A] font-mono text-[11px] text-[#19D3C5] space-y-1">
              <div>NDVI = (SR_B5 - SR_B4) / (SR_B5 + SR_B4) [Vegetation Canopy Index]</div>
              <div>NDBI = (SR_B6 - SR_B5) / (SR_B6 + SR_B5) [Built-up Surface Index]</div>
            </div>
          </section>

          {/* Section 2: Machine Learning Architecture */}
          <section className="space-y-1.5">
            <h3 className="text-xs font-bold text-[#F5F7FB] uppercase tracking-wider flex items-center space-x-1.5">
              <Cpu className="w-4 h-4 inline mr-1 text-[#19D3C5]" /> 2. Locked Machine Learning Architecture
            </h3>
            <p>
              A Random Forest Classifier (100 trees, max_depth=5, Gini criterion) was trained on 805 spatial samples across 30 spatial blocks using strictly non-thermal optical predictors (<strong>NDVI + NDBI</strong>). Thermal LST and geographic coordinates were 100% excluded as model predictors to prevent spatial memorization.
            </p>
          </section>

          {/* Section 3: Independent Test Evaluation */}
          <section className="space-y-1.5">
            <h3 className="text-xs font-bold text-[#F5F7FB] uppercase tracking-wider flex items-center space-x-1.5">
              <GitCommit className="w-4 h-4 inline mr-1 text-[#19D3C5]" /> 3. Spatially Independent Test Evaluation
            </h3>
            <p>
              The model was evaluated on a 100% spatially held-out test set (195 samples across 10 spatial blocks) yielding verified performance:
            </p>
            <div className="grid grid-cols-4 gap-2 font-mono text-center pt-1">
              <div className="bg-[#111C2E] p-2 rounded-xl border border-[#26354A]">
                <span className="text-[9px] text-[#8291A8] block uppercase font-sans">Accuracy</span>
                <span className="font-bold text-[#F5F7FB] text-xs">86.67%</span>
              </div>
              <div className="bg-[#162238] p-2 rounded-xl border border-[#19D3C5]/40">
                <span className="text-[9px] text-[#19D3C5] font-bold block uppercase font-sans">F1-Score</span>
                <span className="font-bold text-[#19D3C5] text-xs">86.60%</span>
              </div>
              <div className="bg-[#111C2E] p-2 rounded-xl border border-[#26354A]">
                <span className="text-[9px] text-[#8291A8] block uppercase font-sans">ROC-AUC</span>
                <span className="font-bold text-[#F5F7FB] text-xs">93.37%</span>
              </div>
              <div className="bg-[#111C2E] p-2 rounded-xl border border-[#26354A]">
                <span className="text-[9px] text-[#8291A8] block uppercase font-sans">Kappa</span>
                <span className="font-bold text-[#F5F7FB] text-xs">0.7333</span>
              </div>
            </div>
          </section>

          {/* Governance Disclaimer Notice */}
          <section className="space-y-1.5 bg-[#111C2E] p-3.5 rounded-xl border border-amber-500/30 text-[11px]">
            <div className="flex items-center space-x-1.5 text-amber-400 font-bold uppercase tracking-wider">
              <AlertTriangle className="w-4 h-4 shrink-0 text-amber-400" />
              <span>Scientific Governance & Terminology</span>
            </div>
            <p className="text-amber-200/90 leading-normal">
              Target classes represent <strong>"LST-derived thermal hotspot reference labels"</strong>. The machine learning model predicts satellite-derived thermal reference categories from optical surface properties and does not predict ambient air temperatures or official ground heatwave warnings.
            </p>
          </section>
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-[#26354A] bg-[#111C2E] flex justify-between items-center text-[11px] font-mono text-[#8291A8]">
          <span>SHA-256: {LOCKED_MODEL_METADATA.sha256.substring(0, 24)}...</span>
          <button
            onClick={() => setIsMethodologyModalOpen(false)}
            className="px-4 py-1.5 bg-[#19D3C5] hover:bg-[#39E4D5] text-[#06151A] font-sans font-semibold rounded-lg transition-colors shadow-2xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
