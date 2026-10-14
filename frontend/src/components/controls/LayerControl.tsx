import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { LAYERS } from '../../config/constants';
import { LayerType, LayerMetadata } from '../../types';
import { Flame, Trees, Building2, Cpu, AlertTriangle, Layers, Grid, Sliders, Eye, ChevronLeft } from 'lucide-react';

export const LayerControl: React.FC = () => {
  const {
    activeLayer,
    setActiveLayer,
    layerOpacity,
    setLayerOpacity,
    showAOIBoundary,
    setShowAOIBoundary,
    isSidebarOpen,
    toggleSidebar
  } = useAppStore();

  const getLayerIcon = (id: LayerType) => {
    switch (id) {
      case 'lst': return Flame;
      case 'ndvi': return Trees;
      case 'ndbi': return Building2;
      case 'rf_prob': return Cpu;
      case 'rf_class': return AlertTriangle;
      case 'persistence': return Layers;
      case 'gi_star': return Grid;
    }
  };

  // Group layers by domain category
  const thermalLayers = LAYERS.filter(l => ['lst', 'rf_prob', 'rf_class'].includes(l.id));
  const environmentalLayers = LAYERS.filter(l => ['ndvi', 'ndbi'].includes(l.id));
  const spatialLayers = LAYERS.filter(l => ['persistence', 'gi_star'].includes(l.id));

  const renderLayerItem = (layer: LayerMetadata) => {
    const Icon = getLayerIcon(layer.id);
    const isActive = activeLayer === layer.id;

    return (
      <button
        key={layer.id}
        onClick={() => setActiveLayer(layer.id)}
        className={`w-full text-left p-2.5 rounded-xl border transition-all relative overflow-hidden group ${
          isActive
            ? 'bg-teal-50/50 border-teal-500/80 shadow-xs ring-1 ring-teal-500/20'
            : 'bg-white border-slate-200/80 hover:bg-slate-50/80 hover:border-slate-300'
        }`}
      >
        {/* Active Accent Bar */}
        {isActive && (
          <div
            className="absolute left-0 top-0 bottom-0 w-1"
            style={{ backgroundColor: layer.accentColor || '#0d9488' }}
          />
        )}

        <div className="flex items-start space-x-2.5 pl-1">
          <div
            className="p-1.5 rounded-lg mt-0.5 shrink-0 transition-colors"
            style={{
              backgroundColor: isActive ? `${layer.accentColor}20` : '#f1f5f9',
              color: isActive ? layer.accentColor : '#64748b',
            }}
          >
            <Icon className="w-4 h-4" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className={`text-xs font-semibold truncate ${isActive ? 'text-slate-900 font-bold' : 'text-slate-700'}`}>
                {layer.shortName}
              </span>
              {layer.category === 'ml' && (
                <span className="text-[9px] font-bold font-mono uppercase px-1.5 py-0.2 rounded-md bg-teal-100 text-teal-800 border border-teal-200">
                  ML
                </span>
              )}
            </div>

            <p className="text-[11px] text-slate-500 leading-tight mt-0.5 line-clamp-1">
              {layer.description}
            </p>
          </div>
        </div>
      </button>
    );
  };

  if (!isSidebarOpen) {
    return null;
  }

  return (
    <aside className="w-72 sm:w-80 bg-white border-r border-slate-200/80 flex flex-col h-full shrink-0 select-none z-30 shadow-floating lg:shadow-xs transition-all duration-200 absolute lg:relative inset-y-0 left-0">
      {/* Header */}
      <div className="p-3.5 border-b border-slate-200/80 flex items-center justify-between bg-slate-50/60">
        <div className="flex items-center space-x-2">
          <Sliders className="w-4 h-4 text-teal-600" />
          <h2 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Raster Map Layers</h2>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-slate-200/70 text-slate-700">
            7 Rasters
          </span>
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
            title="Collapse sidebar"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Layer Groups List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* Thermal Group */}
        <div className="space-y-1.5">
          <div className="text-[10px] font-bold uppercase tracking-wider text-amber-700 px-1 flex items-center space-x-1">
            <Flame className="w-3.5 h-3.5 text-amber-600 inline mr-0.5" />
            <span>Thermal & ML Hotspots</span>
          </div>
          <div className="space-y-1.5">
            {thermalLayers.map(renderLayerItem)}
          </div>
        </div>

        {/* Environmental Group */}
        <div className="space-y-1.5">
          <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 px-1 flex items-center space-x-1">
            <Trees className="w-3.5 h-3.5 text-emerald-600 inline mr-0.5" />
            <span>Environmental Spectral Indices</span>
          </div>
          <div className="space-y-1.5">
            {environmentalLayers.map(renderLayerItem)}
          </div>
        </div>

        {/* Spatial Analysis Group */}
        <div className="space-y-1.5">
          <div className="text-[10px] font-bold uppercase tracking-wider text-sky-700 px-1 flex items-center space-x-1">
            <Grid className="w-3.5 h-3.5 text-sky-600 inline mr-0.5" />
            <span>Spatial & Temporal Analysis</span>
          </div>
          <div className="space-y-1.5">
            {spatialLayers.map(renderLayerItem)}
          </div>
        </div>
      </div>

      {/* Visualization Controls Footer */}
      <div className="p-3.5 border-t border-slate-200/80 bg-slate-50/70 space-y-3">
        {/* Layer Opacity Slider */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-600 font-medium flex items-center space-x-1">
              <Eye className="w-3.5 h-3.5 text-slate-500" />
              <span>Layer Opacity</span>
            </span>
            <span className="font-mono text-teal-700 text-[11px] font-bold">{Math.round(layerOpacity * 100)}%</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="1.0"
            step="0.05"
            value={layerOpacity}
            onChange={(e) => setLayerOpacity(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
          />
        </div>

        {/* Mysuru AOI Boundary Toggle */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-200/80">
          <span className="text-xs text-slate-700 font-medium">Mysuru AOI Boundary</span>
          <button
            onClick={() => setShowAOIBoundary(!showAOIBoundary)}
            className={`w-9 h-5 rounded-full transition-colors relative p-0.5 ${
              showAOIBoundary ? 'bg-teal-600' : 'bg-slate-300'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white shadow-xs transition-transform ${
                showAOIBoundary ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>
    </aside>
  );
};
