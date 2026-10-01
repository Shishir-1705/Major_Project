import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { LAYERS } from '../../config/constants';
import { LayerType, LayerMetadata } from '../../types';
import { Flame, Trees, Building2, Cpu, AlertTriangle, Layers, Grid, Sliders, Eye } from 'lucide-react';

export const LayerControl: React.FC = () => {
  const { activeLayer, setActiveLayer, layerOpacity, setLayerOpacity, showAOIBoundary, setShowAOIBoundary } = useAppStore();

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
        className={`w-full text-left p-2.5 rounded-lg border transition-all relative overflow-hidden group ${
          isActive
            ? 'bg-slate-950/90 border-cyan-500/50 shadow-[0_0_10px_rgba(6,182,212,0.15)]'
            : 'bg-slate-900/40 border-slate-800/80 hover:bg-slate-900 hover:border-slate-700'
        }`}
      >
        {/* Active Accent Bar */}
        {isActive && (
          <div
            className="absolute left-0 top-0 bottom-0 w-1"
            style={{ backgroundColor: layer.accentColor }}
          />
        )}

        <div className="flex items-start space-x-2.5 pl-1">
          <div
            className="p-1.5 rounded-md mt-0.5"
            style={{
              backgroundColor: isActive ? `${layer.accentColor}25` : '#1f2937',
              color: layer.accentColor,
            }}
          >
            <Icon className="w-4 h-4" />
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className={`text-xs font-semibold truncate ${isActive ? 'text-white' : 'text-slate-300'}`}>
                {layer.shortName}
              </span>
              {layer.category === 'ml' && (
                <span className="text-[9px] font-bold font-mono uppercase px-1 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-500/30">
                  ML
                </span>
              )}
            </div>

            <p className="text-[11px] text-slate-400 leading-tight mt-0.5 line-clamp-1">
              {layer.description}
            </p>
          </div>
        </div>
      </button>
    );
  };

  return (
    <div className="w-80 bg-[#111827] border-r border-[#1f2937] flex flex-col h-full shrink-0 select-none">
      {/* Header */}
      <div className="p-3.5 border-b border-[#1f2937] flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Sliders className="w-4 h-4 text-cyan-400" />
          <h2 className="text-xs font-bold text-white uppercase tracking-wider">Raster Map Layers</h2>
        </div>
        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-950 text-slate-400 border border-slate-800">
          7 Rasters
        </span>
      </div>

      {/* Layer Groups List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {/* Thermal Group */}
        <div className="space-y-1.5">
          <div className="text-[10px] font-bold uppercase tracking-wider text-amber-400 px-1 flex items-center space-x-1">
            <Flame className="w-3 h-3 text-amber-500 inline mr-0.5" />
            <span>Thermal & ML Hotspot Layers</span>
          </div>
          <div className="space-y-1.5">
            {thermalLayers.map(renderLayerItem)}
          </div>
        </div>

        {/* Environmental Group */}
        <div className="space-y-1.5">
          <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 px-1 flex items-center space-x-1">
            <Trees className="w-3 h-3 text-emerald-500 inline mr-0.5" />
            <span>Environmental Spectral Indices</span>
          </div>
          <div className="space-y-1.5">
            {environmentalLayers.map(renderLayerItem)}
          </div>
        </div>

        {/* Spatial Analysis Group */}
        <div className="space-y-1.5">
          <div className="text-[10px] font-bold uppercase tracking-wider text-cyan-400 px-1 flex items-center space-x-1">
            <Grid className="w-3 h-3 text-cyan-500 inline mr-0.5" />
            <span>Spatial & Temporal Analysis</span>
          </div>
          <div className="space-y-1.5">
            {spatialLayers.map(renderLayerItem)}
          </div>
        </div>
      </div>

      {/* Visualization Controls Footer */}
      <div className="p-3.5 border-t border-[#1f2937] bg-slate-950/60 space-y-3">
        {/* Layer Opacity Slider */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400 font-medium flex items-center space-x-1">
              <Eye className="w-3.5 h-3.5 text-slate-500" />
              <span>Layer Opacity</span>
            </span>
            <span className="font-mono text-cyan-400 text-[11px] font-bold">{Math.round(layerOpacity * 100)}%</span>
          </div>
          <input
            type="range"
            min="0.1"
            max="1.0"
            step="0.05"
            value={layerOpacity}
            onChange={(e) => setLayerOpacity(parseFloat(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
          />
        </div>

        {/* Mysuru AOI Boundary Toggle */}
        <div className="flex items-center justify-between pt-1 border-t border-slate-900">
          <span className="text-xs text-slate-300 font-medium">Mysuru AOI Boundary</span>
          <button
            onClick={() => setShowAOIBoundary(!showAOIBoundary)}
            className={`w-9 h-5 rounded-full transition-colors relative p-0.5 ${
              showAOIBoundary ? 'bg-cyan-600' : 'bg-slate-800'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                showAOIBoundary ? 'translate-x-4' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>
    </div>
  );
};
