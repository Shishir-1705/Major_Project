import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
  ShieldCheck,
  ArrowLeft
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
    <div className="h-full w-full overflow-y-auto bg-transparent text-[#F5F7FB] p-4 sm:p-6 lg:p-8 space-y-6 select-none max-w-7xl mx-auto relative z-10">
      {/* Subtle localized atmospheric lighting orbs for scrollable depth */}
      <div
        className="absolute top-12 right-10 w-96 h-96 rounded-full pointer-events-none opacity-25 blur-3xl -z-10"
        style={{ background: 'radial-gradient(circle, rgba(25, 211, 197, 0.4) 0%, rgba(6, 182, 212, 0.15) 50%, transparent 80%)' }}
        aria-hidden="true"
      />
      <div
        className="absolute top-1/2 -left-20 w-80 h-80 rounded-full pointer-events-none opacity-20 blur-3xl -z-10"
        style={{ background: 'radial-gradient(circle, rgba(249, 115, 22, 0.35) 0%, transparent 70%)' }}
        aria-hidden="true"
      />

      {/* Secondary Navigation Breadcrumb */}
      <nav aria-label="Breadcrumb" className="liquid-glass-chip px-3.5 py-1.5 rounded-full w-fit flex items-center space-x-2 text-xs text-[#8291A8] border border-white/15 shadow-sm">
        <Link to="/overview" className="hover:text-[#19D3C5] transition-colors flex items-center space-x-1 font-medium">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Overview</span>
        </Link>
        <span className="text-white/20">/</span>
        <span className="text-[#F5F7FB] font-medium">Model Specification</span>
      </nav>

      {/* Header Banner */}
      <section className="liquid-glass-slab rounded-2xl p-6 sm:p-7 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-white/14 relative overflow-hidden">
        <div className="space-y-1.5">
          <div className="flex items-center space-x-2.5">
            <span className="text-[11px] font-mono font-bold uppercase px-3 py-1 rounded-full liquid-glass-subtle text-[#19D3C5] border border-[#19D3C5]/30">
              Locked Model Spec
            </span>
            <span className="text-[11px] font-mono font-semibold uppercase px-3 py-1 rounded-full bg-emerald-950/40 text-emerald-400 border border-emerald-500/30 flex items-center space-x-1">
              <Lock className="w-3 h-3 inline mr-1" />
              Verified SHA-256
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-[#F5F7FB] tracking-tight">
            Random Forest Classifier Specification & Spatial Evaluation
          </h1>
          <p className="text-xs sm:text-sm text-[#94A3B8] max-w-3xl leading-relaxed">
            Locked empirical machine learning model trained strictly on optical surface indices (NDBI & NDVI) to predict relative urban thermal hotspot occurrence without thermal infrared leakage.
          </p>
        </div>

        {/* SHA-256 Copy Action */}
        <div className="liquid-glass-subtle border border-white/12 rounded-2xl p-4 shrink-0 text-right space-y-1.5 shadow-lg">
          <span className="text-[10px] font-mono text-[#8291A8] block uppercase font-medium tracking-wider">Model Checksum</span>
          <button
            onClick={handleCopyHash}
            className="flex items-center space-x-2 text-xs font-mono font-bold text-[#19D3C5] hover:text-[#39E4D5] bg-white/[0.06] px-3 py-1.5 rounded-xl border border-white/15 hover:border-[#19D3C5]/50 transition-all shadow-sm cursor-pointer"
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
          <div className="liquid-glass-slab rounded-2xl p-6 shadow-2xl space-y-4 border border-white/14">
            <h2 className="text-xs sm:text-sm font-bold text-[#F5F7FB] uppercase tracking-wider flex items-center space-x-2">
              <div className="w-6 h-6 rounded-lg liquid-glass-chip flex items-center justify-center text-[#19D3C5] border border-[#19D3C5]/30">
                <Cpu className="w-3.5 h-3.5" />
              </div>
              <span>Model Architecture & Configuration</span>
            </h2>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
              <div className="liquid-glass-subtle p-3.5 rounded-xl border border-white/12 space-y-1">
                <span className="text-[10px] text-[#8291A8] uppercase font-semibold block">Algorithm</span>
                <span className="font-bold text-[#F5F7FB] block break-words">{m.algorithm}</span>
              </div>
              <div className="liquid-glass-subtle p-3.5 rounded-xl border border-white/12 space-y-1">
                <span className="text-[10px] text-[#8291A8] uppercase font-semibold block">Decision Trees</span>
                <span className="font-mono font-bold text-[#19D3C5] block">100 Trees</span>
              </div>
              <div className="liquid-glass-subtle p-3.5 rounded-xl border border-white/12 space-y-1">
                <span className="text-[10px] text-[#8291A8] uppercase font-semibold block">Max Tree Depth</span>
                <span className="font-mono font-bold text-[#F5F7FB] block">5 Levels</span>
              </div>
              <div className="liquid-glass-subtle p-3.5 rounded-xl border border-white/12 space-y-1">
                <span className="text-[10px] text-[#8291A8] uppercase font-semibold block">Split Criterion</span>
                <span className="font-mono font-bold text-[#F5F7FB] block">Gini Impurity</span>
              </div>
              <div className="liquid-glass-subtle p-3.5 rounded-xl border border-white/12 space-y-1">
                <span className="text-[10px] text-[#8291A8] uppercase font-semibold block">Min Samples Split</span>
                <span className="font-mono font-bold text-[#F5F7FB] block">10 Samples</span>
              </div>
              <div className="liquid-glass-subtle p-3.5 rounded-xl border border-white/12 space-y-1">
                <span className="text-[10px] text-[#8291A8] uppercase font-semibold block">Min Samples Leaf</span>
                <span className="font-mono font-bold text-[#F5F7FB] block">5 Samples</span>
              </div>
            </div>
          </div>

          {/* Gini Feature Importance Breakdown */}
          <div className="liquid-glass-slab rounded-2xl p-6 shadow-2xl space-y-4 border border-white/14">
            <div className="flex items-center justify-between">
              <h2 className="text-xs sm:text-sm font-bold text-[#F5F7FB] uppercase tracking-wider flex items-center space-x-2">
                <div className="w-6 h-6 rounded-lg liquid-glass-chip flex items-center justify-center text-[#19D3C5] border border-[#19D3C5]/30">
                  <BarChart2 className="w-3.5 h-3.5" />
                </div>
                <span>Gini Feature Importance Attribution</span>
              </h2>
              <span className="text-[10px] font-mono text-[#8291A8] liquid-glass-chip px-2.5 py-0.5 rounded-full border border-white/10">Total Contribution = 1.000</span>
            </div>

            <div className="space-y-4 pt-1">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-amber-400 font-semibold flex items-center space-x-1.5">
                    <Building2 className="w-4 h-4 text-amber-400" />
                    <span>NDBI (Normalized Difference Built-up Index)</span>
                  </span>
                  <span className="font-mono text-[#F5F7FB] font-bold">{ndbiVal}%</span>
                </div>
                <div className="h-3.5 rounded-full bg-white/10 overflow-hidden border border-white/15">
                  <div className="h-full bg-amber-500 rounded-full transition-all" style={{ width: `${ndbiVal}%` }} />
                </div>
                <span className="text-[10.5px] text-[#8291A8] mt-1.5 block">
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
                <div className="h-3.5 rounded-full bg-white/10 overflow-hidden border border-white/15">
                  <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${ndviVal}%` }} />
                </div>
                <span className="text-[10.5px] text-[#8291A8] mt-1.5 block">
                  Mitigating predictor capturing photosynthetic canopy and evaporative cooling.
                </span>
              </div>
            </div>
          </div>

          {/* Spatial Block Hold-Out Protocol */}
          <div className="liquid-glass-slab rounded-2xl p-6 shadow-2xl space-y-3.5 border border-white/14">
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#F5F7FB] flex items-center space-x-2">
              <div className="w-6 h-6 rounded-lg liquid-glass-chip flex items-center justify-center text-[#19D3C5] border border-[#19D3C5]/30">
                <FileCheck className="w-3.5 h-3.5" />
              </div>
              <span>Spatial Block Partitioning Protocol</span>
            </h2>
            <p className="text-xs text-[#94A3B8] leading-relaxed">
              Spatial cross-validation was implemented using contiguous spatial blocks across the Mysuru Urban Local Body (ULB) to prevent spatial autocorrelation leakage between training and testing sets:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
              <div className="liquid-glass-subtle p-3.5 rounded-xl border border-white/12 space-y-1">
                <span className="text-[10px] text-[#8291A8] uppercase font-semibold block">Training Partition</span>
                <span className="font-bold text-[#F5F7FB] text-sm">805 Spatial Samples</span>
                <p className="text-[11px] text-[#8291A8]">Distributed across 30 disjoint geographic grid blocks.</p>
              </div>
              <div className="liquid-glass-slab p-3.5 rounded-xl border border-[#19D3C5]/40 space-y-1 shadow-[0_0_15px_rgba(25,211,197,0.12)]">
                <span className="text-[10px] text-[#19D3C5] uppercase font-bold block">Independent Held-Out Test</span>
                <span className="font-bold text-[#F5F7FB] text-sm">195 Spatial Samples</span>
                <p className="text-[11px] text-[#A8B5C9]">10 completely independent spatial blocks (zero leakage).</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Independent Spatial Test Metrics Grid */}
          <div className="liquid-glass-slab rounded-2xl p-6 shadow-2xl space-y-4 border border-white/14">
            <div className="flex items-center justify-between">
              <h2 className="text-xs sm:text-sm font-bold text-[#F5F7FB] uppercase tracking-wider flex items-center space-x-2">
                <div className="w-6 h-6 rounded-lg liquid-glass-chip flex items-center justify-center text-emerald-400 border border-emerald-500/30">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <span>Independent Test Evaluation</span>
              </h2>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
                195 Samples
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5 font-mono text-center">
              <div className="liquid-glass-slab p-3.5 rounded-xl border border-[#19D3C5]/40 shadow-[0_0_15px_rgba(25,211,197,0.12)]">
                <span className="text-[10px] text-[#19D3C5] font-bold block font-sans uppercase">F1-Score</span>
                <span className="text-lg font-extrabold text-[#19D3C5]">
                  {(m.locked_test_metrics.f1_score * 100).toFixed(2)}%
                </span>
                <span className="text-[9px] text-[#8291A8] font-sans block mt-0.5">Harmonic Mean</span>
              </div>

              <div className="liquid-glass-subtle p-3.5 rounded-xl border border-white/12 shadow-sm">
                <span className="text-[10px] text-[#8291A8] block font-sans uppercase font-semibold">Accuracy</span>
                <span className="text-lg font-extrabold text-[#F5F7FB]">
                  {(m.locked_test_metrics.accuracy * 100).toFixed(2)}%
                </span>
                <span className="text-[9px] text-[#8291A8] font-sans block mt-0.5">169 / 195 Correct</span>
              </div>

              <div className="liquid-glass-subtle p-3.5 rounded-xl border border-white/12 shadow-sm">
                <span className="text-[10px] text-[#8291A8] block font-sans uppercase font-semibold">Precision</span>
                <span className="text-base font-bold text-[#F5F7FB]">
                  {(m.locked_test_metrics.precision * 100).toFixed(2)}%
                </span>
                <span className="text-[9px] text-[#8291A8] font-sans block mt-0.5">TP / (TP + FP)</span>
              </div>

              <div className="liquid-glass-subtle p-3.5 rounded-xl border border-white/12 shadow-sm">
                <span className="text-[10px] text-[#8291A8] block font-sans uppercase font-semibold">Recall</span>
                <span className="text-base font-bold text-[#F5F7FB]">
                  {(m.locked_test_metrics.recall * 100).toFixed(2)}%
                </span>
                <span className="text-[9px] text-[#8291A8] font-sans block mt-0.5">TP / (TP + FN)</span>
              </div>

              <div className="liquid-glass-subtle p-2.5 rounded-xl border border-white/12 shadow-sm">
                <span className="text-[9.5px] text-[#8291A8] block font-sans uppercase">ROC-AUC</span>
                <span className="text-sm font-bold text-[#F5F7FB]">{(m.locked_test_metrics.roc_auc * 100).toFixed(2)}%</span>
              </div>

              <div className="liquid-glass-subtle p-2.5 rounded-xl border border-white/12 shadow-sm">
                <span className="text-[9.5px] text-[#8291A8] block font-sans uppercase">PR-AUC</span>
                <span className="text-sm font-bold text-[#F5F7FB]">{(m.locked_test_metrics.pr_auc * 100).toFixed(2)}%</span>
              </div>

              <div className="liquid-glass-subtle p-2.5 rounded-xl border border-white/12 shadow-sm">
                <span className="text-[9.5px] text-[#8291A8] block font-sans uppercase">Cohen's Kappa</span>
                <span className="text-sm font-bold text-[#F5F7FB]">{m.locked_test_metrics.cohen_kappa.toFixed(4)}</span>
              </div>

              <div className="liquid-glass-subtle p-2.5 rounded-xl border border-white/12 shadow-sm">
                <span className="text-[9.5px] text-[#8291A8] block font-sans uppercase">Brier Score</span>
                <span className="text-sm font-bold text-[#F5F7FB]">{m.locked_test_metrics.brier_score.toFixed(4)}</span>
              </div>
            </div>
          </div>

          {/* Confusion Matrix Table */}
          <div className="liquid-glass-slab rounded-2xl p-6 shadow-2xl space-y-3.5 border border-white/14">
            <h2 className="text-xs sm:text-sm font-bold text-[#F5F7FB] uppercase tracking-wider flex items-center space-x-2">
              <div className="w-6 h-6 rounded-lg liquid-glass-chip flex items-center justify-center text-[#19D3C5] border border-[#19D3C5]/30">
                <Binary className="w-3.5 h-3.5" />
              </div>
              <span>Independent Confusion Matrix (N = {totalTest})</span>
            </h2>

            <div className="overflow-x-auto pt-1">
              <table className="w-full text-xs text-center border-collapse">
                <thead>
                  <tr>
                    <th className="p-2.5 border border-white/12 bg-white/[0.04] text-[10px] text-[#8291A8] uppercase tracking-wider">Actual \ Pred</th>
                    <th className="p-2.5 border border-white/12 bg-white/[0.04] font-semibold text-[#A8B5C9]">Pred Non-Hotspot (0)</th>
                    <th className="p-2.5 border border-white/12 bg-white/[0.08] font-semibold text-[#19D3C5]">Pred Hotspot (1)</th>
                  </tr>
                </thead>
                <tbody className="font-mono">
                  <tr>
                    <td className="p-2.5 border border-white/12 bg-white/[0.04] font-semibold text-[#A8B5C9] text-left">Ref Non-Hotspot (0)</td>
                    <td className="p-3 border border-emerald-500/25 bg-emerald-950/40 text-emerald-300 font-bold text-sm">
                      {cm.tn} <span className="text-[10px] font-sans font-normal text-emerald-400/70 block">TN (True Neg)</span>
                    </td>
                    <td className="p-3 border border-rose-500/25 bg-rose-950/30 text-rose-300 font-bold text-sm">
                      {cm.fp} <span className="text-[10px] font-sans font-normal text-rose-400/70 block">FP (False Pos)</span>
                    </td>
                  </tr>
                  <tr>
                    <td className="p-2.5 border border-white/12 bg-white/[0.04] font-semibold text-[#A8B5C9] text-left">Ref Hotspot (1)</td>
                    <td className="p-3 border border-rose-500/25 bg-rose-950/30 text-rose-300 font-bold text-sm">
                      {cm.fn} <span className="text-[10px] font-sans font-normal text-rose-400/70 block">FN (False Neg)</span>
                    </td>
                    <td className="p-3 border border-emerald-500/25 bg-emerald-950/40 text-emerald-300 font-bold text-sm">
                      {cm.tp} <span className="text-[10px] font-sans font-normal text-emerald-400/70 block">TP (True Pos)</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Scientific Governance Notice */}
          <div className="bg-amber-950/20 border border-amber-500/35 rounded-2xl p-6 text-xs text-amber-200/90 space-y-2.5 backdrop-blur-2xl shadow-2xl relative overflow-hidden">
            <div className="flex items-center space-x-2 font-bold text-amber-300">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="uppercase tracking-wider">Scientific Distinction & Target Disclosure</span>
            </div>
            <p className="leading-relaxed text-[#D97706]/90 text-xs sm:text-sm">
              Target classes represent <strong className="text-amber-200">"LST-derived pseudo-reference labels"</strong> (y = 1 if LST &ge; P80). The Random Forest model demonstrates that optical indices (NDBI, NDVI) alone can predict relative surface thermal vulnerability with high fidelity (86.60% F1-score).
            </p>
            <p className="leading-relaxed text-[#D97706]/90 text-xs sm:text-sm">
              These labels are derived from satellite thermal radiometry and are <strong className="text-amber-200">not</strong> independently verified in-situ ground truth. The model does not predict ambient air temperature or official meteorological heatwave alerts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
