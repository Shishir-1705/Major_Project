import React from 'react';
import { ModelInfoCard } from '../components/analytics/ModelInfoCard';
import { useAppStore } from '../store/useAppStore';
import { LOCKED_MODEL_METADATA } from '../config/constants';
import { Trees, Building2, Lock, AlertTriangle, FileCheck } from 'lucide-react';

export const ModelPage: React.FC = () => {
  const { modelInfo } = useAppStore();
  const m = modelInfo || LOCKED_MODEL_METADATA;

  const ndbiVal = m.feature_importances.NDBI ? (m.feature_importances.NDBI * 100).toFixed(2) : "61.03";
  const ndviVal = m.feature_importances.NDVI ? (m.feature_importances.NDVI * 100).toFixed(2) : "38.97";

  return (
    <div className="h-full w-full overflow-y-auto bg-[#f8fafc] text-slate-800 p-4 sm:p-6 lg:p-8 space-y-6 select-none">
      {/* Header Banner */}
      <section className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
              Locked Model Spec
            </span>
            <span className="text-[11px] font-mono font-semibold uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center space-x-1">
              <Lock className="w-3 h-3 inline mr-1" />
              Verified SHA-256
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Random Forest Classifier Specification & Spatial Evaluation
          </h1>
          <p className="text-xs text-slate-500 max-w-2xl">
            Trained and evaluated on spatial sample blocks across Mysuru to predict thermal hotspot reference labels strictly from optical surface characteristics.
          </p>
        </div>
      </section>

      {/* Main Grid: Specification Card + Feature Importance */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-7 space-y-6">
          <ModelInfoCard />

          {/* Gini Feature Importance Breakdown */}
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Gini Feature Attribution Breakdown
                </h3>
                <span className="text-[10px] font-mono text-slate-500">Relative contribution to decision tree splits (Sum = 1.000)</span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-purple-700 font-semibold flex items-center space-x-1">
                    <Building2 className="w-4 h-4 inline mr-1 text-purple-600" /> NDBI (Normalized Difference Built-up Index)
                  </span>
                  <span className="font-mono text-slate-900 font-bold">{ndbiVal}%</span>
                </div>
                <div className="h-3 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                  <div className="h-full bg-purple-600 rounded-full transition-all" style={{ width: `${ndbiVal}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-emerald-700 font-semibold flex items-center space-x-1">
                    <Trees className="w-4 h-4 inline mr-1 text-emerald-600" /> NDVI (Normalized Difference Vegetation Index)
                  </span>
                  <span className="font-mono text-slate-900 font-bold">{ndviVal}%</span>
                </div>
                <div className="h-3 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                  <div className="h-full bg-emerald-600 rounded-full transition-all" style={{ width: `${ndviVal}%` }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Spatial Evaluation Protocol & Scientific Notice */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-3">
            <div className="flex items-center space-x-2">
              <FileCheck className="w-4 h-4 text-teal-600" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                Spatial Block Hold-Out Protocol
              </h3>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Spatial cross-validation was strictly implemented to ensure the model does not suffer from spatial autocorrelation bias:
            </p>
            <ul className="text-xs text-slate-600 space-y-2 list-disc list-inside">
              <li><strong>Training Partition:</strong> 805 spatial samples distributed across 30 disjoint spatial blocks.</li>
              <li><strong>Held-Out Test Partition:</strong> 195 spatial samples distributed across 10 independent spatial blocks.</li>
              <li><strong>Zero Thermal Predictor Leakage:</strong> Thermal LST and spatial coordinates were completely excluded as model input features.</li>
            </ul>
          </div>

          <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-5 text-xs text-amber-900/90 space-y-2">
            <div className="flex items-center space-x-2 font-bold text-amber-800">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <span>Scientific Governance Notice</span>
            </div>
            <p className="leading-relaxed">
              Target labels represent <strong>"LST-derived thermal hotspot reference labels"</strong>. The machine learning model identifies relative surface thermal vulnerability from optical reflectance patterns and does not predict ambient air temperature or official meteorological heatwave alerts.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
