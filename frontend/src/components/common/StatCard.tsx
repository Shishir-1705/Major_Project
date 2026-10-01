import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  subtitle?: string;
  icon: React.ElementType;
  accentColor?: string;
  isLoading?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  unit,
  subtitle,
  icon: Icon,
  accentColor = '#06b6d4',
  isLoading = false,
}) => {
  return (
    <div className="bg-[#111827] border border-[#1f2937] rounded-xl p-3.5 shadow-sm relative overflow-hidden group hover:border-slate-700 transition-colors">
      <div className="flex items-start justify-between">
        <div>
          <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
            {title}
          </span>
          <div className="flex items-baseline space-x-1 mt-1">
            {isLoading ? (
              <div className="h-6 w-24 bg-slate-800 animate-pulse rounded my-0.5" />
            ) : (
              <>
                <span className="text-xl font-bold text-white tracking-tight font-mono">
                  {value}
                </span>
                {unit && <span className="text-xs text-slate-400 font-sans">{unit}</span>}
              </>
            )}
          </div>
          {subtitle && (
            <p className="text-[10px] text-slate-500 mt-1 line-clamp-1">{subtitle}</p>
          )}
        </div>

        <div
          className="p-2 rounded-lg"
          style={{
            backgroundColor: `${accentColor}18`,
            color: accentColor,
          }}
        >
          <Icon className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};
