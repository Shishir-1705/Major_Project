import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem)] bg-[#f8fafc] text-slate-800 p-6 select-none">
      <div className="bg-white border border-slate-200/80 rounded-2xl p-8 max-w-md w-full text-center space-y-5 shadow-card">
        <div className="w-16 h-16 rounded-2xl bg-teal-50 border border-teal-200/80 flex items-center justify-center text-teal-600 mx-auto shadow-2xs">
          <Compass className="w-8 h-8 text-teal-600 animate-spin" style={{ animationDuration: '12s' }} />
        </div>

        <div className="space-y-2">
          <span className="text-[11px] font-mono font-bold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
            Error 404
          </span>
          <h2 className="text-lg font-bold tracking-tight text-slate-900">
            Route Not Found
          </h2>
          <p className="text-xs text-slate-500 leading-relaxed">
            The requested geospatial analysis path does not exist or has been relocated.
          </p>
        </div>

        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-xs transition-colors shadow-2xs"
          >
            <Home className="w-4 h-4" />
            <span>Return to Overview</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
