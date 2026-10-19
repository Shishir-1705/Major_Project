import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem)] bg-[#080D18] text-[#F5F7FB] p-6 select-none">
      <div className="bg-[#0D1525] border border-[#26354A] rounded-2xl p-8 max-w-md w-full text-center space-y-5 shadow-card">
        <div className="w-16 h-16 rounded-2xl bg-[#162238] border border-[#19D3C5]/30 flex items-center justify-center text-[#19D3C5] mx-auto shadow-2xs">
          <Compass className="w-8 h-8 text-[#19D3C5] animate-spin" style={{ animationDuration: '12s' }} />
        </div>

        <div className="space-y-2">
          <span className="text-[11px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-[#111C2E] text-[#8291A8] border border-[#26354A]">
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
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-[#19D3C5] hover:bg-[#39E4D5] text-[#06151A] font-bold text-xs transition-colors shadow-2xs"
          >
            <Home className="w-4 h-4" />
            <span>Return to Overview</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
