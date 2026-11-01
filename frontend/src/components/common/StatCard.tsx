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
  const displayUnit = unit?.trim();

  return (
    <div className="liquid-glass-slab rounded-2xl p-4 sm:p-5 shadow-floating relative overflow-hidden group hover:border-[#19D3C5]/50 transition-all flex flex-col justify-between min-h-[118px] border border-white/14">
      {/* Dynamic faint radial glow behind the card on hover */}
      <div
        className="absolute -right-8 -top-8 w-28 h-28 rounded-full pointer-events-none opacity-0 group-hover:opacity-25 transition-opacity blur-2xl"
        style={{ backgroundColor: accentColor }}
        aria-hidden="true"
      />

      {/* Top Row: Full Title + Glowing Accent Icon */}
      <div className="flex items-start justify-between gap-2 mb-2">
        <span className="text-[10.5px] sm:text-[11px] font-mono font-bold text-[#A8B5C9] uppercase tracking-wider block leading-tight break-words flex-1 min-w-0">
          {title}
        </span>
        <div
          className="p-1.5 rounded-xl shrink-0 transition-all border border-white/12"
          style={{
            backgroundColor: `${accentColor}18`,
            color: accentColor,
            boxShadow: `0 0 14px ${accentColor}35`,
          }}
          aria-hidden="true"
        >
          <Icon className="w-4 h-4" />
        </div>
      </div>

      {/* Middle Row: Large Crisp Font-Mono Value & Unit */}
      <div className="flex items-baseline space-x-2 flex-wrap my-1 min-w-0">
        {isLoading ? (
          <div className="h-8 w-24 bg-white/10 animate-pulse rounded-lg my-0.5" />
        ) : isError ? (
          <span className="text-xs font-mono text-amber-400 font-medium py-0.5 block">
            Unavailable
          </span>
        ) : (
          <>
            <span className="text-2xl sm:text-3xl font-extrabold text-[#F8FAFC] tracking-tight font-mono leading-none break-all">
              {value}
            </span>
            {displayUnit && (
              <span className="text-xs sm:text-sm text-[#19D3C5] font-mono font-semibold shrink-0">
                {displayUnit}
              </span>
            )}
          </>
        )}
      </div>

      {/* Bottom Row: Supporting Description */}
      {subtitle && (
        <div className="pt-2 border-t border-white/10 mt-2">
          <p className="text-[10.5px] text-[#8291A8] leading-tight break-words font-sans">
            {isError ? errorMessage : subtitle}
          </p>
        </div>
      )}
    </div>
  );
};
