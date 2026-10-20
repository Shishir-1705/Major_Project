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
  accentColor = '#19D3C5',
  isLoading = false,
  isError = false,
  errorMessage = 'Telemetry unavailable',
}) => {
  return (
    <div className="bg-[#0D1525] border border-[#26354A] rounded-xl p-3 shadow-xs relative overflow-hidden group hover:border-[#19D3C5]/40 transition-all flex flex-col justify-between min-h-[96px]">
      {/* Top Row: Full Title (no truncation) + Compact Accent Icon */}
      <div className="flex items-start justify-between gap-1.5 mb-1">
        <span className="text-[10.5px] font-semibold text-[#8291A8] uppercase tracking-wider block leading-snug break-words flex-1">
          {title}
        </span>
        <div
          className="p-1.5 rounded-md shrink-0 transition-colors"
          style={{
            backgroundColor: `${accentColor}18`,
            color: accentColor,
          }}
          aria-hidden="true"
        >
          <Icon className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Middle Row: Prominent Primary Value & Unit */}
      <div className="flex items-baseline space-x-1.5 flex-wrap my-0.5">
        {isLoading ? (
          <div className="h-6 w-20 bg-[#162238] animate-pulse rounded my-0.5" />
        ) : isError ? (
          <span className="text-xs font-mono text-amber-400 font-medium py-0.5 block">
            Unavailable
          </span>
        ) : (
          <>
            <span className="text-lg font-bold text-[#F5F7FB] tracking-tight font-mono leading-none">
              {value}
            </span>
            {unit && (
              <span className="text-[11px] text-[#A8B5C9] font-sans font-medium">
                {unit}
              </span>
            )}
          </>
        )}
      </div>

      {/* Bottom Row: Supporting Description (Wraps naturally, no harsh line-clamp-1) */}
      {subtitle && (
        <p className="text-[10px] text-[#8291A8] leading-tight mt-1 break-words">
          {isError ? errorMessage : subtitle}
        </p>
      )}
    </div>
  );
};
