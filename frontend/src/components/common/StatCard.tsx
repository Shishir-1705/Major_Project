import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  icon: React.ElementType;
  accentColor?: string;
  isLoading?: boolean;
  isError?: boolean;
  errorMessage?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  unit,
  subtitle,
  icon: Icon,
  accentColor = '#0d9488',
  isLoading = false,
  isError = false,
  errorMessage = 'Telemetry unavailable',
}) => {
  return (
    <div className="bg-white border border-slate-200/80 rounded-xl p-3.5 shadow-xs relative overflow-hidden group hover:border-slate-300 transition-all">
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <span className="text-[10.5px] font-semibold text-slate-500 uppercase tracking-wider block truncate">
            {title}
          </span>
          <div className="flex items-baseline space-x-1 mt-1">
            {isLoading ? (
              <div className="h-6 w-20 bg-slate-100 animate-pulse rounded my-0.5" />
            ) : isError ? (
              <span className="text-xs font-mono text-amber-600 font-medium py-1 block">
                Unavailable
              </span>
            ) : (
              <>
                <span className="text-xl font-bold text-slate-900 tracking-tight font-mono">
                  {value}
                </span>
                {unit && <span className="text-xs text-slate-500 font-sans font-medium">{unit}</span>}
              </>
            )}
          </div>
          {subtitle && (
            <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">
              {isError ? errorMessage : subtitle}
            </p>
          )}
        </div>

        <div
          className="p-2 rounded-lg shrink-0 ml-2 transition-colors"
          style={{
            backgroundColor: `${accentColor}15`,
            color: accentColor,
          }}
        >
          <Icon className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};
