import React from 'react';
import { Header } from './components/layout/Header';
import { LayerControl } from './components/controls/LayerControl';
import { MapWorkspace } from './components/map/MapWorkspace';
import { AnalyticsPanel } from './components/analytics/AnalyticsPanel';
import { MethodologyModal } from './components/modals/MethodologyModal';
import { ToastContainer } from './components/common/ToastContainer';

export const App: React.FC = () => {
  return (
    <div className="flex flex-col h-screen w-screen bg-[#0b0f19] text-slate-100 overflow-hidden font-sans">
      {/* Top Application Header */}
      <Header />

      {/* Main Workspace Layout */}
      <div className="flex flex-1 h-[calc(100vh-3.5rem)] w-full overflow-hidden relative">
        {/* Left Layer & Date Control Sidebar */}
        <LayerControl />

        {/* Center Interactive Leaflet Map Workspace */}
        <MapWorkspace />

        {/* Right Analytics Drawer / Panel */}
        <AnalyticsPanel />
      </div>

      {/* Methodology & Governance Modal */}
      <MethodologyModal />

      {/* Global Toast Notifications Container */}
      <ToastContainer />
    </div>
  );
};

export default App;
