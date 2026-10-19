import React, { useState } from 'react';
import { useAppStore } from '../store/useAppStore';
import { LOCKED_MODEL_METADATA } from '../config/constants';
import {
  Cpu,
  Lock,
  Copy,
  Check,
  Building2,
  Trees,
  AlertTriangle,
  FileCheck,
  BarChart2,
  Binary,
  ShieldCheck
} from 'lucide-react';

export const ModelPage: React.FC = () => {
  const { modelInfo } = useAppStore();
  const m = modelInfo || LOCKED_MODEL_METADATA;
  const [copied, setCopied] = useState(false);

  const handleCopyHash = () => {
    navigator.clipboard.writeText(m.sha256);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const ndbiVal = m.feature_importances.NDBI ? (m.feature_importances.NDBI * 100).toFixed(2) : "61.03";
  const ndviVal = m.feature_importances.NDVI ? (m.feature_importances.NDVI * 100).toFixed(2) : "38.97";
  const cm = m.locked_test_metrics.confusion_matrix;
  const totalTest = cm.tn + cm.fp + cm.fn + cm.tp;

  return (
    <div className="h-full w-full overflow-y-auto bg-[#080D18] text-[#F5F7FB] p-4 sm:p-6 lg:p-8 space-y-6 select-none max-w-7xl mx-auto">
      {/* Header Banner */}
      <section className="bg-[#0D1525] border border-[#26354A] rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-[#19D3C5]/10 text-[#19D3C5] border border-[#19D3C5]/30">
              Locked Model Spec
            </span>
            <span className="text-[11px] font-mono font-semibold uppercase px-2.5 py-0.5 rounded-full bg-emerald-950/40 text-emerald-400 border border-emerald-500/30 flex items-center space-x-1">
              <Lock className="w-3 h-3 inline mr-1" />
              Verified SHA-256
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-[#F5F7FB] tracking-tight">
            Random Forest Classifier Specification & Spatial Evaluation
          </h1>
          <p className="text-xs text-[#8291A8] max-w-3xl leading-relaxed">
            Locked empirical machine learning model trained strictly on optical surface indices (NDBI & NDVI) to predict relative urban thermal hotspot occurrence without thermal infrared leakage.
          </p>
        </div>

        {/* SHA-256 Copy Action */}
        <div className="bg-[#111C2E] border border-[#26354A] rounded-xl p-3 shrink-0 text-right space-y-1">
          <span className="text-[10px] font-mono text-[#8291A8] block uppercase font-medium">Model Checksum</span>
          <button
            onClick={handleCopyHash}
            className="flex items-center space-x-1.5 text-xs font-mono font-bold text-[#19D3C5] hover:text-[#39E4D5] bg-[#162238] px-2.5 py-1 rounded-lg border border-[#26354A] hover:border-[#19D3C5]/40 transition-colors shadow-2xs"
            title="Copy SHA-256 Checksum"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-[#19D3C5]" />}
            <span>{m.sha256.substring(0, 16)}...</span>
          </button>
        </div>
      </section>

      {/* Grid: Left Column (Model Architecture & Hyperparameters) + Right Column (Metrics & Confusion Matrix) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Architecture Overview */}
          <div className="bg-[#0D1525] border border-[#26354A] rounded-2xl p-5 shadow-xs space-y-4">
            <h2 className="text-xs font-bold text-[#F5F7FB] uppercase tracking-wider flex items-center space-x-2">
              <Cpu className="w-4 h-4 text-[#19D3C5]" />
              <span>Model Architecture & Configuration</span>
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-[#111C2E] p-3 rounded-xl border border-[#26354A] space-y-1">
                <span className="text-[10px] text-[#8291A8] uppercase font-semibold block">Algorithm</span>
                <span className="font-bold text-[#F5F7FB] block truncate">{m.algorithm}</span>
              </div>
              <div className="bg-[#111C2E] p-3 rounded-xl border border-[#26354A] space-y-1">
                <span className="text-[10px] text-[#8291A8] uppercase font-semibold block">Decision Trees</span>
                <span className="font-mono font-bold text-[#19D3C5] block">100 Trees</span>
              </div>
              <div className="bg-[#111C2E] p-3 rounded-xl border border-[#26354A] space-y-1">
                <span className="text-[10px] text-[#8291A8] uppercase font-semibold block">Max Tree Depth</span>
                <span className="font-mono font-bold text-[#F5F7FB] block">5 Levels</span>
              </div>
              <div className="bg-[#111C2E] p-3 rounded-xl border border-[#26354A] space-y-1">
                <span className="text-[10px] text-[#8291A8] uppercase font-semibold block">Split Criterion</span>
                <span className="font-mono font-bold text-[#F5F7FB] block">Gini Impurity</span>
              </div>
              <div className="bg-[#111C2E] p-3 rounded-xl border border-[#26354A] space-y-1">
                <span className="text-[10px] text-[#8291A8] uppercase font-semibold block">Min Samples Split</span>
                <span className="font-mono font-bold text-[#F5F7FB] block">10 Samples</span>
              </div>
              <div className="bg-[#111C2E] p-3 rounded-xl border border-[#26354A] space-y-1">
                <span className="text-[10px] text-[#8291A8] uppercase font-semibold block">Min Samples Leaf</span>
                <span className="font-mono font-bold text-[#F5F7FB] block">5 Samples</span>
              </div>
            </div>
          </div>

          {/* Gini Feature Importance Breakdown */}
          <div className="bg-[#0D1525] border border-[#26354A] rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-[#F5F7FB] uppercase tracking-wider flex items-center space-x-2">
                <BarChart2 className="w-4 h-4 text-[#19D3C5]" />
                <span>Gini Feature Importance Attribution</span>
              </h2>
              <span className="text-[10px] font-mono text-[#8291A8]">Total Contribution = 1.000</span>
            </div>

            <div className="space-y-3 pt-1">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-amber-400 font-semibold flex items-center space-x-1.5">
                    <Building2 className="w-4 h-4 text-amber-400" />
                    <span>NDBI (Normalized Difference Built-up Index)</span>
                  </span>
                  <span className="font-mono text-[#F5F7FB] font-bold">{ndbiVal}%</span>
                </div>
                <div className="h-3.5 rounded-full bg-[#162238] overflow-hidden border border-[#26354A]">
                  <div className="h-full bg-amber-500 rounded-full transition-all" style={{ width: `${ndbiVal}%` }} />
                </div>
                <span className="text-[10.5px] text-[#8291A8] mt-1 block">
                  Primary predictor of surface thermal retention and impervious built density.
                </span>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-emerald-400 font-semibold flex items-center space-x-1.5">
                    <Trees className="w-4 h-4 text-emerald-400" />
                    <span>NDVI (Normalized Difference Vegetation Index)</span>
                  </span>
                  <span className="font-mono text-[#F5F7FB] font-bold">{ndviVal}%</span>
                </div>
                <div className="h-3.5 rounded-full bg-[#162238] overflow-hidden border border-[#26354A]">
                  <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${ndviVal}%` }} />
                </div>
                <span className="text-[10.5px] text-[#8291A8] mt-1 block">
                  Mitigating predictor capturing photosynthetic canopy and evaporative cooling.
                </span>
              </div>
            </div>
          </div>

          {/* Spatial Block Hold-Out Protocol */}
          <div className="bg-[#0D1525] border border-[#26354A] rounded-2xl p-5 shadow-xs space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#F5F7FB] flex items-center space-x-2">
              <FileCheck className="w-4 h-4 text-[#19D3C5]" />
              <span>Spatial Block Partitioning Protocol</span>
            </h2>
            <p className="text-xs text-[#A8B5C9] leading-relaxed">
              Spatial cross-validation was implemented using contiguous spatial blocks across the Mysuru Urban Local Body (ULB) to prevent spatial autocorrelation leakage between training and testing sets:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
              <div className="bg-[#111C2E] p-3 rounded-xl border border-[#26354A] space-y-1">
                <span className="text-[10px] text-[#8291A8] uppercase font-semibold block">Training Partition</span>
                <span className="font-bold text-[#F5F7FB]">805 Spatial Samples</span>
                <p className="text-[11px] text-[#8291A8]">Distributed across 30 disjoint geographic grid blocks.</p>
              </div>
              <div className="bg-[#19D3C5]/10 p-3 rounded-xl border border-[#19D3C5]/30 space-y-1">
                <span className="text-[10px] text-[#19D3C5] uppercase font-bold block">Independent Held-Out Test</span>
                <span className="font-bold text-[#F5F7FB]">195 Spatial Samples</span>
                <p className="text-[11px] text-[#A8B5C9]">10 completely independent spatial blocks (zero leakage).</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Independent Spatial Test Metrics Grid */}
          <div className="bg-[#0D1525] border border-[#26354A] rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-bold text-[#F5F7FB] uppercase tracking-wider flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Independent Test Evaluation</span>
              </h2>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded-full border border-emerald-500/30">
                195 Samples
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 font-mono text-center">
              <div className="bg-[#19D3C5]/10 p-3 rounded-xl border border-[#19D3C5]/30 shadow-2xs">
                <span className="text-[10px] text-[#19D3C5] font-bold block font-sans uppercase">F1-Score</span>
                <span className="text-lg font-extrabold text-[#19D3C5]">
                  {(m.locked_test_metrics.f1_score * 100).toFixed(2)}%
                </span>
                <span className="text-[9px] text-[#8291A8] font-sans block mt-0.5">Harmonic Mean</span>
              </div>

              <div className="bg-[#111C2E] p-3 rounded-xl border border-[#26354A] shadow-2xs">
                <span className="text-[10px] text-[#8291A8] block font-sans uppercase font-semibold">Accuracy</span>
                <span className="text-lg font-extrabold text-[#F5F7FB]">
                  {(m.locked_test_metrics.accuracy * 100).toFixed(2)}%
                </span>
                <span className="text-[9px] text-[#8291A8] font-sans block mt-0.5">169 / 195 Correct</span>
              </div>

              <div className="bg-[#111C2E] p-3 rounded-xl border border-[#26354A] shadow-2xs">
                <span className="text-[10px] text-[#8291A8] block font-sans uppercase font-semibold">Precision</span>
                <span className="text-base font-bold text-[#F5F7FB]">
                  {(m.locked_test_metrics.precision * 100).toFixed(2)}%
                </span>
                <span className="text-[9px] text-[#8291A8] font-sans block mt-0.5">TP / (TP + FP)</span>
              </div>

              <div className="bg-[#111C2E] p-3 rounded-xl border border-[#26354A] shadow-2xs">
                <span className="text-[10px] text-[#8291A8] block font-sans uppercase font-semibold">Recall</span>
                <span className="text-base font-bold text-[#F5F7FB]">
                  {(m.locked_test_metrics.recall * 100).toFixed(2)}%
                </span>
                <span className="text-[9px] text-[#8291A8] font-sans block mt-0.5">TP / (TP + FN)</span>
              </div>

              <div className="bg-[#111C2E] p-2.5 rounded-xl border border-[#26354A] shadow-2xs">
                <span className="text-[9.5px] text-[#8291A8] block font-sans uppercase">ROC-AUC</span>
                <span className="text-sm font-bold text-[#F5F7FB]">{(m.locked_test_metrics.roc_auc * 100).toFixed(2)}%</span>
              </div>

              <div className="bg-[#111C2E] p-2.5 rounded-xl border border-[#26354A] shadow-2xs">
                <span className="text-[9.5px] text-[#8291A8] block font-sans uppercase">PR-AUC</span>
                <span className="text-sm font-bold text-[#F5F7FB]">{(m.locked_test_metrics.pr_auc * 100).toFixed(2)}%</span>
              </div>

              <div className="bg-[#111C2E] p-2.5 rounded-xl border border-[#26354A] shadow-2xs">
                <span className="text-[9.5px] text-[#8291A8] block font-sans uppercase">Cohen's Kappa</span>
                <span className="text-sm font-bold text-[#F5F7FB]">{m.locked_test_metrics.cohen_kappa.toFixed(4)}</span>
              </div>

              <div className="bg-[#111C2E] p-2.5 rounded-xl border border-[#26354A] shadow-2xs">
                <span className="text-[9.5px] text-[#8291A8] block font-sans uppercase">Brier Score</span>
                <span className="text-sm font-bold text-[#F5F7FB]">{m.locked_test_metrics.brier_score.toFixed(4)}</span>
              </div>
            </div>
          </div>

          {/* Confusion Matrix Table */}
          <div className="bg-[#0D1525] border border-[#26354A] rounded-2xl p-5 shadow-xs space-y-3">
            <h2 className="text-xs font-bold text-[#F5F7FB] uppercase tracking-wider flex items-center space-x-2">
              <Binary className="w-4 h-4 text-[#19D3C5]" />
              <span>Independent Confusion Matrix (N = {totalTest})</span>
            </h2>

            <div className="overflow-x-auto pt-1">
              <table className="w-full text-xs text-center border-collapse">
                <thead>
                  <tr>
                    <th className="p-2 border border-[#26354A] bg-[#111C2E] text-[10px] text-[#8291A8] uppercase">Actual \ Pred</th>
                    <th className="p-2 border border-[#26354A] bg-[#111C2E] font-semibold text-[#A8B5C9]">Pred Non-Hotspot (0)</th>
                    <th className="p-2 border border-[#26354A] bg-[#162238] font-semibold text-[#19D3C5]">Pred Hotspot (1)</th>
                  </tr>
                </thead>
                <tbody className="font-mono">
                  <tr>
                    <td className="p-2 border border-[#26354A] bg-[#111C2E] font-semibold text-[#A8B5C9] text-left">Ref Non-Hotspot (0)</td>
                    <td className="p-3 border border-[#26354A] bg-emerald-950/40 text-emerald-300 font-bold text-sm">
                      {cm.tn} <span className="text-[10px] font-sans font-normal text-emerald-400/60 block">TN (True Neg)</span>
                    </td>
                    <td className="p-3 border border-[#26354A] bg-rose-950/30 text-rose-300 font-bold text-sm">
                      {cm.fp} <span className="text-[10px] font-sans font-normal text-rose-400/60 block">FP (False Pos)</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-[#26354A] bg-[#111C2E] font-semibold text-[#A8B5C9] text-left">Ref Hotspot (1)</td>
                    <td className="p-3 border border-[#26354A] bg-rose-950/30 text-rose-300 font-bold text-sm">
                      {cm.fn} <span className="text-[10px] font-sans font-normal text-rose-400/60 block">FN (False Neg)</span>
                    </td>
                    <td className="p-3 border border-[#26354A] bg-emerald-950/40 text-emerald-300 font-bold text-sm">
                      {cm.tp} <span className="text-[10px] font-sans font-normal text-emerald-400/60 block">TP (True Pos)</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Scientific Governance Notice */}
          <div className="bg-amber-950/30 border border-amber-500/30 rounded-2xl p-5 text-xs text-amber-200/90 space-y-2">
            <div className="flex items-center space-x-2 font-bold text-amber-300">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Scientific Distinction & Target Disclosure</span>
            </div>
            <p className="leading-relaxed">
              Target classes represent <strong>"LST-derived pseudo-reference labels"</strong> (y = 1 if LST &ge; P80). The Random Forest model demonstrates that optical indices (NDBI, NDVI) alone can predict relative surface thermal vulnerability with high fidelity (86.60% F1-score).
            </p>
            <p className="leading-relaxed">
              These labels are derived from satellite thermal radiometry and are <strong>not</strong> independently verified in-situ ground truth. The model does not predict ambient air temperature or official meteorological heatwave alerts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
