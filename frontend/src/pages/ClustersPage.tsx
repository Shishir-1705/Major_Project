import React, { useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { MapWorkspace } from '../components/map/MapWorkspace';
import { LayerControl } from '../components/controls/LayerControl';
import { AnalyticsPanel } from '../components/analytics/AnalyticsPanel';

export const ClustersPage: React.FC = () => {
  const { setActiveLayer } = useAppStore();

  useEffect(() => {
    setActiveLayer('gi_star');
  }, [setActiveLayer]);

  return (
    <div className="flex h-full w-full overflow-hidden relative">
      <LayerControl />
      <MapWorkspace />
      <AnalyticsPanel />
    </div>
  );
};
