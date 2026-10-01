import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Flame, ShieldCheck, MapPin, Info, Layers, BarChart2, Activity, GitCommit } from 'lucide-react';

export const Header: React.FC = () => {
  const { activeTab, setActiveTab, setIsMethodologyModalOpen, backendConnected } = useAppStore();

  const navTabs = [
    { id: 'overview', label: 'Overview', icon: Layers },
    { id: 'thermal', label: 'LST Map', icon: Flame },
    { id: 'ml', label: 'ML Hotspots', icon: ShieldCheck },
    { id: 'environment', label: 'NDVI / NDBI', icon: Activity },
    { id: 'persistence', label: 'Persistence', icon: GitCommit },
    { id: 'clusters', label: 'Gi* Clusters', icon: BarChart2 },
  ] as const;

  return (
    <header className="h-14 bg-[#111827] border-b border-[#1f2937] px-4 flex items-center justify-between z-30 shrink-0 select-none">
      {/* Brand & Project Identity */}
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-lg bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.2)]">
          <Flame className="w-5 h-5 text-cyan-400" />
        </div>
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-sm font-bold tracking-tight text-white">
              THERMAL INTELLIGENCE
            </h1>
            <span className="text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 rounded bg-cyan-950/90 text-cyan-300 border border-cyan-500/30">
              MODEL LOCKED
            </span>
          </div>
          <p className="text-[11px] text-slate-400 flex items-center space-x-1.5">
            <MapPin className="w-3 h-3 text-cyan-400 inline" />
            <span className="text-slate-200 font-medium">Mysuru, Karnataka, India</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-400 font-mono text-[10px]">EPSG:32643 UTM 43N</span>
          </p>
        </div>
      </div>

      {/* Navigation Tabs */}
      <nav className="hidden lg:flex items-center space-x-1 bg-[#0b0f19] p-1 rounded-lg border border-[#1f2937]">
        {navTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                isActive
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </nav>

      {/* Server Status & Methodology Action */}
      <div className="flex items-center space-x-3">
        {/* Real Backend Status Indicator */}
        <div className="flex items-center space-x-2 text-xs bg-slate-950 border border-slate-800 px-2.5 py-1 rounded-md">
          {backendConnected ? (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-slate-400 font-medium hidden sm:inline">ANALYSIS SERVER</span>
              <span className="font-mono font-bold text-emerald-400 text-[11px]">ONLINE</span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="text-slate-400 font-medium hidden sm:inline">ANALYSIS SERVER</span>
              <span className="font-mono font-bold text-amber-400 text-[11px]">OFFLINE</span>
            </>
          )}
        </div>

        <button
          onClick={() => setIsMethodologyModalOpen(true)}
          className="flex items-center space-x-1.5 text-xs font-medium px-3 py-1.5 rounded-md bg-slate-900 text-slate-200 hover:text-white hover:bg-slate-800 border border-slate-700 hover:border-slate-600 transition-colors shadow-sm"
        >
          <Info className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden sm:inline">Methodology</span>
        </button>
      </div>
    </header>
  );
};
