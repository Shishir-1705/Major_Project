import React, { useState } from 'react';
import { LOCKED_MODEL_METADATA } from '../../config/constants';
import { ShieldCheck, Cpu, Lock, Copy, Check } from 'lucide-react';

export const ModelInfoCard: React.FC = () => {
  const m = LOCKED_MODEL_METADATA;
  const [copied, setCopied] = useState(false);

  const handleCopyHash = () => {
    navigator.clipboard.writeText(m.sha256);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#111827] border border-cyan-500/30 rounded-xl p-3.5 space-y-3 relative overflow-hidden shadow-lg select-none">
      {/* Top Banner */}
      <div className="flex items-center justify-between border-b border-[#1f2937] pb-2.5">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            LOCKED ML MODEL SPECIFICATION
          </h3>
        </div>
        <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-500/30 flex items-center space-x-1">
          <Lock className="w-2.5 h-2.5 inline mr-1" />
          MODEL LOCKED
        </span>
      </div>

      {/* Model Key-Value Specifications */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-slate-950 p-2 rounded-lg border border-slate-800/80">
          <span className="text-[10px] text-slate-400 uppercase block">Algorithm</span>
          <span className="font-semibold text-white truncate block mt-0.5">{m.algorithm}</span>
        </div>

        <div className="bg-slate-950 p-2 rounded-lg border border-slate-800/80">
          <span className="text-[10px] text-slate-400 uppercase block">Predictors</span>
          <span className="font-mono font-bold text-cyan-400 block mt-0.5">NDVI + NDBI</span>
        </div>
      </div>

      {/* Scientific Target Definition Notice */}
      <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800 text-[11px] space-y-1">
        <div className="flex items-center space-x-1.5 text-slate-300 font-semibold">
          <Cpu className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
          <span>Target Label Designation:</span>
        </div>
        <p className="text-slate-400 leading-tight pl-5 italic font-mono text-[10.5px]">
          "{m.target}"
        </p>
      </div>

      {/* Locked Evaluation Metrics Grid */}
      <div className="space-y-1.5 pt-1">
        <span className="text-[10.5px] font-semibold text-slate-400 uppercase tracking-wider block">
          Locked Independent Spatial Test Metrics:
        </span>
        <div className="grid grid-cols-4 gap-1 font-mono text-center">
          <div className="bg-slate-950 p-1.5 rounded border border-slate-800">
            <span className="text-[8.5px] text-slate-500 block">Accuracy</span>
            <span className="text-xs font-bold text-white">{(m.locked_test_metrics.accuracy * 100).toFixed(2)}%</span>
          </div>
          <div className="bg-slate-950 p-1.5 rounded border border-cyan-500/40">
            <span className="text-[8.5px] text-cyan-400 font-bold block">F1-Score</span>
            <span className="text-xs font-bold text-cyan-300">{(m.locked_test_metrics.f1_score * 100).toFixed(2)}%</span>
          </div>
          <div className="bg-slate-950 p-1.5 rounded border border-slate-800">
            <span className="text-[8.5px] text-slate-500 block">ROC-AUC</span>
            <span className="text-xs font-bold text-white">{(m.locked_test_metrics.roc_auc * 100).toFixed(2)}%</span>
          </div>
          <div className="bg-slate-950 p-1.5 rounded border border-slate-800">
            <span className="text-[8.5px] text-slate-500 block">Kappa</span>
            <span className="text-xs font-bold text-white">{m.locked_test_metrics.cohen_kappa.toFixed(4)}</span>
          </div>
        </div>
      </div>

      {/* Confusion Matrix Display */}
      <div className="bg-slate-950 p-2 rounded-lg border border-slate-800 flex items-center justify-between text-[10.5px] font-mono">
        <span className="text-slate-400">Confusion Matrix (195 test):</span>
        <span className="text-slate-200 font-bold">
          TN:{m.locked_test_metrics.confusion_matrix.tn} | FP:{m.locked_test_metrics.confusion_matrix.fp} | FN:{m.locked_test_metrics.confusion_matrix.fn} | TP:{m.locked_test_metrics.confusion_matrix.tp}
        </span>
      </div>

      {/* SHA-256 Hash Verification Badge with Copy Action */}
      <div className="pt-2 border-t border-[#1f2937] flex items-center justify-between text-[10px] font-mono">
        <span className="text-slate-400">SHA-256 Checksum:</span>
        <button
          onClick={handleCopyHash}
          className="flex items-center space-x-1 text-cyan-400 hover:text-cyan-300 bg-cyan-950/60 px-1.5 py-0.5 rounded border border-cyan-500/20 transition-colors"
          title="Click to copy full SHA-256 hash"
        >
          <span>{m.sha256.substring(0, 16)}...</span>
          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-cyan-400" />}
        </button>
      </div>
    </div>
  );
};
