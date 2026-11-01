import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem)] bg-transparent text-[#F5F7FB] p-6 select-none relative z-10">
      <div className="liquid-glass-slab border border-white/12 rounded-2xl p-8 max-w-md w-full text-center space-y-5 shadow-floating">
        <div className="w-16 h-16 rounded-2xl liquid-glass-subtle border border-[#19D3C5]/40 flex items-center justify-center text-[#19D3C5] mx-auto shadow-2xs">
          <Compass className="w-8 h-8 text-[#19D3C5] animate-spin" style={{ animationDuration: '12s' }} />
        </div>

        <div className="space-y-2">
          <span className="text-[11px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full liquid-glass-chip text-[#8291A8] border border-white/10">
            Error 404
          </span>
          <h2 className="text-lg font-bold tracking-tight text-[#F5F7FB]">
            Route Not Found
          </h2>
          <p className="text-xs text-[#8291A8] leading-relaxed">
            The requested geospatial analysis path does not exist or has been relocated.
          </p>
        </div>

        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#19D3C5] hover:bg-[#39E4D5] text-[#06151A] font-bold text-xs transition-colors shadow-2xs cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>Return to Overview</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
