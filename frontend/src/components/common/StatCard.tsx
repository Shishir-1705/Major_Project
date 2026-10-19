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
    <div className="bg-[#0D1525] border border-[#26354A] rounded-xl p-3.5 shadow-xs relative overflow-hidden group hover:border-[#19D3C5]/40 transition-all">
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <span className="text-[10.5px] font-semibold text-[#8291A8] uppercase tracking-wider block truncate">
            {title}
          </span>
          <div className="flex items-baseline space-x-1 mt-1">
            {isLoading ? (
              <div className="h-6 w-20 bg-[#162238] animate-pulse rounded my-0.5" />
            ) : isError ? (
              <span className="text-xs font-mono text-amber-400 font-medium py-1 block">
                Unavailable
              </span>
            ) : (
              <>
                <span className="text-xl font-bold text-[#F5F7FB] tracking-tight font-mono">
                  {value}
                </span>
                {unit && <span className="text-xs text-[#8291A8] font-sans font-medium">{unit}</span>}
              </>
            )}
          </div>
          {subtitle && (
            <p className="text-[10px] text-[#8291A8] mt-1 line-clamp-1">
              {isError ? errorMessage : subtitle}
            </p>
          )}
        </div>

        <div
          className="p-2 rounded-lg shrink-0 ml-2 transition-colors"
          style={{
            backgroundColor: `${accentColor}20`,
            color: accentColor,
          }}
        >
          <Icon className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};
