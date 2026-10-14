import React, { useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import {
  Flame,
  ShieldCheck,
  MapPin,
  Info,
  Layers,
  BarChart2,
  Activity,
  GitCommit,
  PanelLeftClose,
  PanelLeftOpen,
  PanelRightClose,
  PanelRightOpen
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    activeLayer,
    setActiveLayer,
    setIsMethodologyModalOpen,
    backendConnected,
    fetchInitialData,
    checkServerRecovery,
    isSidebarOpen,
    toggleSidebar,
    isAnalyticsOpen,
    toggleAnalytics
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
    <header className="h-14 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-3 md:px-4 flex items-center justify-between z-30 shrink-0 select-none shadow-xs">
      {/* Brand & Left Controls */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        {/* Sidebar Toggle for Map Focus */}
        <button
          onClick={toggleSidebar}
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200/80 transition-colors"
          title={isSidebarOpen ? "Collapse Layers Sidebar" : "Expand Layers Sidebar"}
          aria-label={isSidebarOpen ? "Collapse Layers Sidebar" : "Expand Layers Sidebar"}
        >
          {isSidebarOpen ? (
            <PanelLeftClose className="w-4 h-4 text-slate-600" />
          ) : (
            <PanelLeftOpen className="w-4 h-4 text-teal-600" />
          )}
        </button>

        {/* Brand Logo & Title */}
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-teal-50 border border-teal-200/80 flex items-center justify-center text-teal-600 shadow-xs">
            <Flame className="w-4.5 h-4.5 text-teal-600" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xs sm:text-sm font-bold tracking-tight text-slate-900">
                THERMAL INTELLIGENCE
              </h1>
              <span className="hidden xs:inline-block text-[10px] font-mono font-semibold uppercase px-1.5 py-0.5 rounded-md bg-teal-50 text-teal-700 border border-teal-200/80">
                MODEL LOCKED
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:flex items-center space-x-1.5">
              <MapPin className="w-3 h-3 text-teal-600 inline" />
              <span className="text-slate-700 font-medium">Mysuru, Karnataka, India</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-500 font-mono text-[10px]">EPSG:32643 UTM 43N</span>
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Tabs (Desktop & Wide Tablet) */}
      <nav className="hidden xl:flex items-center space-x-1 bg-slate-100/80 p-1 rounded-xl border border-slate-200/80">
        {navTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <div key={tab.id} className="relative flex items-center">
              <button
                onClick={() => handleTabClick(tab.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-white text-teal-700 shadow-xs border border-slate-200/80 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/60 border border-transparent'
                }`}
                title={tab.label}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-teal-600' : 'text-slate-500'}`} />
                <span>{tab.label}</span>
              </button>

              {/* Quick Subview Toggle Pills for ML Hotspots */}
              {tab.id === 'ml' && isActive && (
                <div className="flex items-center ml-1 mr-1 space-x-0.5 bg-slate-200/70 p-0.5 rounded-md border border-slate-300/60">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveLayer('rf_prob');
                    }}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition-colors ${
                      activeLayer === 'rf_prob'
                        ? 'bg-teal-600 text-white font-bold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
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
                        ? 'bg-red-600 text-white font-bold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                    title="Random Forest Binary Hotspot Classification"
                  >
                    Class
                  </button>
                </div>
              )}

              {/* Quick Subview Toggle Pills for NDVI / NDBI */}
              {tab.id === 'environment' && isActive && (
                <div className="flex items-center ml-1 mr-1 space-x-0.5 bg-slate-200/70 p-0.5 rounded-md border border-slate-300/60">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveLayer('ndvi');
                    }}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-mono transition-colors ${
                      activeLayer === 'ndvi'
                        ? 'bg-emerald-600 text-white font-bold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
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
                        ? 'bg-purple-600 text-white font-bold shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
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

      {/* Right Actions & Telemetry */}
      <div className="flex items-center space-x-2 sm:space-x-2.5">
        {/* Real Backend Status Indicator */}
        <div className="flex items-center space-x-1.5 text-xs bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg">
          {backendConnected ? (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-slate-500 font-medium hidden md:inline">SERVER</span>
              <span className="font-mono font-bold text-emerald-700 text-[11px]">ONLINE</span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              <span className="text-slate-500 font-medium hidden md:inline">SERVER</span>
              <span className="font-mono font-bold text-amber-700 text-[11px]">OFFLINE</span>
            </>
          )}
        </div>

        {/* Methodology Action */}
        <button
          onClick={() => setIsMethodologyModalOpen(true)}
          className="flex items-center space-x-1 text-xs font-medium px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 hover:text-slate-900 hover:bg-slate-200/80 border border-slate-200 transition-colors shadow-xs"
          title="View Research Methodology & Pipeline Governance"
        >
          <Info className="w-3.5 h-3.5 text-teal-600" />
          <span className="hidden sm:inline">Methodology</span>
        </button>

        {/* Analytics Drawer Toggle Button */}
        <button
          onClick={toggleAnalytics}
          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200/80 transition-colors"
          title={isAnalyticsOpen ? "Collapse Analytics Panel" : "Expand Analytics Panel"}
          aria-label={isAnalyticsOpen ? "Collapse Analytics Panel" : "Expand Analytics Panel"}
        >
          {isAnalyticsOpen ? (
            <PanelRightClose className="w-4 h-4 text-slate-600" />
          ) : (
            <PanelRightOpen className="w-4 h-4 text-teal-600" />
          )}
        </button>
      </div>
    </header>
  );
};
