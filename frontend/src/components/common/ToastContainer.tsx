import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useAppStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-16 right-4 z-[3000] flex flex-col space-y-2 max-w-sm w-full pointer-events-none select-none">
      {toasts.map((toast) => {
        const isError = toast.type === 'error';
        const isWarning = toast.type === 'warning';
        const isSuccess = toast.type === 'success';

        let bgClass = 'bg-slate-900/95 border-slate-700 text-slate-200';
        let Icon = Info;
        let iconColor = 'text-cyan-400';

        if (isError) {
          bgClass = 'bg-red-950/95 border-red-500/50 text-red-200';
          Icon = AlertCircle;
          iconColor = 'text-red-400';
        } else if (isWarning) {
          bgClass = 'bg-amber-950/95 border-amber-500/50 text-amber-200';
          Icon = AlertTriangle;
          iconColor = 'text-amber-400';
        } else if (isSuccess) {
          bgClass = 'bg-emerald-950/95 border-emerald-500/50 text-emerald-200';
          Icon = CheckCircle;
          iconColor = 'text-emerald-400';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start space-x-3 p-3 rounded-xl border backdrop-blur-md shadow-xl transition-all animate-in fade-in slide-in-from-top-2 ${bgClass}`}
          >
            <Icon className={`w-4 h-4 shrink-0 mt-0.5 ${iconColor}`} />

            <div className="flex-1 text-xs space-y-0.5">
              {toast.title && (
                <div className="font-bold uppercase tracking-wider text-[11px] text-white">
                  {toast.title}
                </div>
              )}
              <p className="leading-tight text-slate-300">{toast.message}</p>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-white p-0.5 rounded transition-colors shrink-0"
              title="Dismiss notification"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
