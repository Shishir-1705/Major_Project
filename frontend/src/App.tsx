import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { OverviewPage } from './pages/OverviewPage';
import { LstPage } from './pages/LstPage';
import { HotspotsPage } from './pages/HotspotsPage';
import { IndicesPage } from './pages/IndicesPage';
import { PersistencePage } from './pages/PersistencePage';
import { ClustersPage } from './pages/ClustersPage';
import { ModelPage } from './pages/ModelPage';
import { MethodologyPage } from './pages/MethodologyPage';
import { NotFoundPage } from './pages/NotFoundPage';

export const App: React.FC = () => {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<OverviewPage />} />
        <Route path="/lst" element={<LstPage />} />
        <Route path="/hotspots" element={<HotspotsPage />} />
        <Route path="/indices" element={<IndicesPage />} />
        <Route path="/persistence" element={<PersistencePage />} />
        <Route path="/clusters" element={<ClustersPage />} />
        <Route path="/model" element={<ModelPage />} />
        <Route path="/methodology" element={<MethodologyPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
};

export default App;
