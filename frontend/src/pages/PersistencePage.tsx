import React, { useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';
import { MapWorkspace } from '../components/map/MapWorkspace';
import { LayerControl } from '../components/controls/LayerControl';
import { AnalyticsPanel } from '../components/analytics/AnalyticsPanel';

export const PersistencePage: React.FC = () => {
  const { setActiveLayer } = useAppStore();

  useEffect(() => {
    setActiveLayer('persistence');
  }, [setActiveLayer]);

  return (
    <div className="flex h-full w-full overflow-hidden relative">
      <LayerControl />
      <MapWorkspace />
      <AnalyticsPanel />
    </div>
  );
};
