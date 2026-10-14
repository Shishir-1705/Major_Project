import React, { useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Flame, ShieldCheck, MapPin, Info, Layers, BarChart2, Activity, GitCommit } from 'lucide-react';

export const Header: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    activeLayer,
    setActiveLayer,
    setIsMethodologyModalOpen,
    backendConnected,
    fetchInitialData,
    checkServerRecovery
  } = useAppStore();

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    if (!backendConnected) {
      intervalId = setInterval(() => {
        checkServerRecovery();
      }, 10000);
    }
    return () => clearInterval(intervalId);
  }, [backendConnected, checkServerRecovery]);

  const navTabs = [
    { id: 'overview', label: 'Overview', icon: Layers },
    { id: 'thermal', label: 'LST Map', icon: Flame },
    { id: 'ml', label: 'ML Hotspots', icon: ShieldCheck },
    { id: 'environment', label: 'NDVI / NDBI', icon: Activity },
    { id: 'persistence', label: 'Persistence', icon: GitCommit },
    { id: 'clusters', label: 'Gi* Clusters', icon: BarChart2 },
    { id: 'methodology', label: 'Methodology', icon: Info },
  ] as const;

  const handleTabClick = (tabId: typeof navTabs[number]['id']) => {
    if (tabId === 'ml' && activeTab === 'ml') {
      setActiveLayer(activeLayer === 'rf_prob' ? 'rf_class' : 'rf_prob');
    } else if (tabId === 'environment' && activeTab === 'environment') {
      setActiveLayer(activeLayer === 'ndvi' ? 'ndbi' : 'ndvi');
    } else {
      setActiveTab(tabId);
    }
  };

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
            <div key={tab.id} className="relative flex items-center">
              <button
                onClick={() => handleTabClick(tab.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
                }`}
                title={tab.label}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-cyan-400' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>

              {/* Quick Subview Toggle Pills for ML Hotspots */}
              {tab.id === 'ml' && isActive && (
                <div className="flex items-center ml-1 mr-1 space-x-0.5 bg-slate-950 p-0.5 rounded border border-slate-800">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveLayer('rf_prob');
                    }}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition-colors ${
                      activeLayer === 'rf_prob'
                        ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                    title="Random Forest Continuous Probability"
                  >
                    Prob
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveLayer('rf_class');
                    }}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition-colors ${
                      activeLayer === 'rf_class'
                        ? 'bg-red-500/20 text-red-300 font-bold border border-red-500/30'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                    title="Random Forest Binary Hotspot Classification"
                  >
                    Class
                  </button>
                </div>
              )}

              {/* Quick Subview Toggle Pills for NDVI / NDBI */}
              {tab.id === 'environment' && isActive && (
                <div className="flex items-center ml-1 mr-1 space-x-0.5 bg-slate-950 p-0.5 rounded border border-slate-800">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveLayer('ndvi');
                    }}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition-colors ${
                      activeLayer === 'ndvi'
                        ? 'bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                    title="Normalized Difference Vegetation Index"
                  >
                    NDVI
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveLayer('ndbi');
                    }}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition-colors ${
                      activeLayer === 'ndbi'
                        ? 'bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                    title="Normalized Difference Built-up Index"
                  >
                    NDBI
                  </button>
                </div>
              )}
            </div>
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
