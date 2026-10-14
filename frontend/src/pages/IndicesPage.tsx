import React, { useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { MapWorkspace } from '../components/map/MapWorkspace';
import { LayerControl } from '../components/controls/LayerControl';
import { AnalyticsPanel } from '../components/analytics/AnalyticsPanel';

export const IndicesPage: React.FC = () => {
  const { setActiveLayer, activeLayer } = useAppStore();

  useEffect(() => {
    if (activeLayer !== 'ndvi' && activeLayer !== 'ndbi') {
      setActiveLayer('ndvi');
    }
  }, [setActiveLayer, activeLayer]);

  return (
    <div className="flex h-full w-full overflow-hidden relative">
      <LayerControl />
      <MapWorkspace />
      <AnalyticsPanel />
    </div>
  );
};
