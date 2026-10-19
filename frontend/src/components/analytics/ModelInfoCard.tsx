import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { LOCKED_MODEL_METADATA } from '../../config/constants';
import { ShieldCheck, Cpu, Lock, Copy, Check } from 'lucide-react';

export const ModelInfoCard: React.FC = () => {
  const { modelInfo } = useAppStore();
  const m = modelInfo || LOCKED_MODEL_METADATA;
  const [copied, setCopied] = useState(false);

  const handleCopyHash = () => {
    navigator.clipboard.writeText(m.sha256);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-[#0D1525] border border-[#26354A] rounded-xl p-3.5 space-y-3 relative overflow-hidden shadow-xs select-none">
      {/* Top Banner */}
      <div className="flex items-center justify-between border-b border-[#26354A] pb-2.5">
        <div className="flex items-center space-x-2">
          <ShieldCheck className="w-4 h-4 text-[#19D3C5]" />
          <div>
            <h3 className="text-xs font-bold text-[#F5F7FB] uppercase tracking-wider">
              LOCKED ML MODEL SPECIFICATION
            </h3>
            <span className="text-[9.5px] font-mono text-[#8291A8] block">
              {modelInfo ? "Live REST API Telemetry" : "Locked Static Spec (Offline)"}
            </span>
          </div>
        </div>
        <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded-full bg-[#111C2E] text-[#19D3C5] border border-[#26354A] flex items-center space-x-1">
          <Lock className="w-2.5 h-2.5 inline mr-1" />
          LOCKED
        </span>
      </div>

      {/* Model Key-Value Specifications */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-[#111C2E] p-2 rounded-lg border border-[#26354A] shadow-xs">
          <span className="text-[10px] text-[#8291A8] uppercase block font-medium">Algorithm</span>
          <span className="font-semibold text-[#F5F7FB] truncate block mt-0.5">{m.algorithm}</span>
        </div>

        <div className="bg-[#111C2E] p-2 rounded-lg border border-[#26354A] shadow-xs">
          <span className="text-[10px] text-[#8291A8] uppercase block font-medium">Predictors</span>
          <span className="font-mono font-bold text-[#19D3C5] block mt-0.5">NDVI + NDBI</span>
        </div>
      </div>

      {/* Scientific Target Definition Notice */}
      <div className="bg-[#111C2E] p-2.5 rounded-lg border border-[#26354A] text-[11px] space-y-1">
        <div className="flex items-center space-x-1.5 text-[#A8B5C9] font-semibold">
          <Cpu className="w-3.5 h-3.5 text-[#19D3C5] shrink-0" />
          <span>Target Label Designation:</span>
        </div>
        <p className="text-[#8291A8] leading-tight pl-5 italic font-mono text-[10.5px]">
          "{m.target}"
        </p>
      </div>

      {/* Locked Evaluation Metrics Grid */}
      <div className="space-y-1.5 pt-0.5">
        <span className="text-[10.5px] font-semibold text-[#8291A8] uppercase tracking-wider block">
          Locked Independent Spatial Test Metrics:
        </span>
        <div className="grid grid-cols-4 gap-1.5 font-mono text-center">
          <div className="bg-[#111C2E] p-1.5 rounded-lg border border-[#26354A] shadow-xs">
            <span className="text-[8.5px] text-[#8291A8] block font-sans uppercase">Accuracy</span>
            <span className="text-xs font-bold text-[#F5F7FB]">{(m.locked_test_metrics.accuracy * 100).toFixed(2)}%</span>
          </div>
          <div className="bg-[#162238] p-1.5 rounded-lg border border-[#19D3C5]/40 shadow-xs">
            <span className="text-[8.5px] text-[#19D3C5] font-bold block font-sans uppercase">F1-Score</span>
            <span className="text-xs font-bold text-[#19D3C5]">{(m.locked_test_metrics.f1_score * 100).toFixed(2)}%</span>
          </div>
          <div className="bg-[#111C2E] p-1.5 rounded-lg border border-[#26354A] shadow-xs">
            <span className="text-[8.5px] text-[#8291A8] block font-sans uppercase">ROC-AUC</span>
            <span className="text-xs font-bold text-[#F5F7FB]">{(m.locked_test_metrics.roc_auc * 100).toFixed(2)}%</span>
          </div>
          <div className="bg-[#111C2E] p-1.5 rounded-lg border border-[#26354A] shadow-xs">
            <span className="text-[8.5px] text-[#8291A8] block font-sans uppercase">Kappa</span>
            <span className="text-xs font-bold text-[#F5F7FB]">{m.locked_test_metrics.cohen_kappa.toFixed(4)}</span>
          </div>
        </div>
      </div>

      {/* Confusion Matrix Display */}
      <div className="bg-[#111C2E] p-2 rounded-lg border border-[#26354A] flex items-center justify-between text-[10.5px] font-mono shadow-xs">
        <span className="text-[#8291A8]">Confusion Matrix (195 test):</span>
        <span className="text-[#F5F7FB] font-bold">
          TN:{m.locked_test_metrics.confusion_matrix.tn} | FP:{m.locked_test_metrics.confusion_matrix.fp} | FN:{m.locked_test_metrics.confusion_matrix.fn} | TP:{m.locked_test_metrics.confusion_matrix.tp}
        </span>
      </div>

      {/* SHA-256 Hash Verification Badge with Copy Action */}
      <div className="pt-2 border-t border-[#26354A] flex items-center justify-between text-[10px] font-mono">
        <span className="text-[#8291A8]">SHA-256 Checksum:</span>
        <button
          onClick={handleCopyHash}
          className="flex items-center space-x-1 text-[#19D3C5] hover:text-[#39E4D5] bg-[#111C2E] px-2 py-0.5 rounded-md border border-[#26354A] hover:bg-[#162238] transition-colors shadow-2xs"
          title="Click to copy full SHA-256 hash"
        >
          <span>{m.sha256.substring(0, 16)}...</span>
          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3 text-[#19D3C5]" />}
        </button>
      </div>
    </div>
  );
};
