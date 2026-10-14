import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { OverviewMap } from '../components/map/OverviewMap';
import { StatCard } from '../components/common/StatCard';
import {
  Flame,
  ShieldCheck,
  Building2,
  Trees,
  Layers,
  BarChart2,
  GitCommit,
  Cpu,
  ArrowRight,
  Calendar,
  Satellite,
  Compass
} from 'lucide-react';

export const OverviewPage: React.FC = () => {
  const {
    metadata,
    selectedDate,
    setSelectedDate,
    dates,
    zonalStats,
    hotspotStats,
    modelInfo,
    backendConnected,
    isLoadingStats,
    fetchLayerStats
  } = useAppStore();

  useEffect(() => {
    fetchLayerStats();
  }, [fetchLayerStats, selectedDate]);

  const analysisViews = [
    {
      to: '/lst',
      title: 'LST Explorer',
      description: 'Explore Landsat-derived land surface temperature distributions and seasonal thermal shifts.',
      icon: Flame,
      color: '#f97316',
      badge: 'Thermal ST_B10',
    },
    {
      to: '/hotspots',
      title: 'ML Hotspots',
      description: 'Random Forest predicted continuous probability gradients and binary threshold classifications.',
      icon: ShieldCheck,
      color: '#0d9488',
      badge: 'RF Classifier',
    },
    {
      to: '/indices',
      title: 'NDVI & NDBI',
      description: 'Spectral indices mapping vegetation canopy density and built-up impervious surfaces.',
      icon: Trees,
      color: '#10b981',
      badge: 'Optical Indices',
    },
    {
      to: '/persistence',
      title: 'Heat Persistence',
      description: 'Multi-temporal hotspot recurrence categorization across all 8 satellite observation dates.',
      icon: GitCommit,
      color: '#eab308',
      badge: '5-Tier Recurrence',
    },
    {
      to: '/clusters',
      title: 'Gi* Clusters',
      description: 'Getis-Ord Gi* spatial autocorrelation highlighting 90%, 95%, and 99% confidence clusters.',
      icon: BarChart2,
      color: '#0284c7',
      badge: 'Spatial Statistics',
    },
    {
      to: '/model',
      title: 'Model & Evaluation',
      description: 'Locked model specifications, NDVI/NDBI Gini importance, and 100% held-out test block metrics.',
      icon: Cpu,
      color: '#8b5cf6',
      badge: 'SHA-256 Verified',
    },
  ];

  const workflowSteps = [
    {
      step: '01',
      title: 'Landsat 8/9 Level-2 Acquisition',
      desc: 'Acquired surface temperature (ST_B10) and surface reflectance (B4, B5, B6) across 8 temporal observations (April–May 2023) at 30m resolution.',
    },
    {
      step: '02',
      title: 'Optical Feature Extraction',
      desc: 'Derived vegetation (NDVI) and built-up (NDBI) spectral indices. Excluded thermal and coordinate channels to prevent spatial data leakage.',
    },
    {
      step: '03',
      title: 'Locked Random Forest Classification',
      desc: 'Trained on 805 spatial samples across 30 blocks. Achieved 86.60% F1-score on a 100% spatially held-out test set (195 samples across 10 blocks).',
    },
    {
      step: '04',
      title: 'Spatial Persistence & Autocorrelation',
      desc: 'Quantified multi-temporal hotspot stability across 5 recurrence classes and verified spatial clustering with Getis-Ord Gi* confidence statistics.',
    },
  ];

  return (
    <div className="h-full w-full overflow-y-auto bg-[#f8fafc] text-slate-800 p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 select-none">
      {/* Hero Header & Context Banner */}
      <section className="bg-white border border-slate-200/80 rounded-2xl p-5 sm:p-7 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-2 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-700 border border-teal-200/80">
                Major Research Project
              </span>
              <span className="text-[11px] font-mono font-semibold uppercase px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                Mysuru, Karnataka, India
              </span>
              <span className="text-[11px] font-mono font-semibold uppercase px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                EPSG:32643 UTM 43N
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-slate-900">
              Urban Heat Hotspot Detection & Intelligence
            </h1>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Machine learning-based spatial identification of urban surface temperature hotspots using Landsat 8 and 9 multi-temporal imagery, optical spectral indices (NDVI and NDBI), and locked spatial evaluation.
            </p>
          </div>

          {/* Date Selector Badge */}
          <div className="shrink-0 bg-slate-50 border border-slate-200/80 rounded-xl p-3 space-y-2 lg:w-56">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-700">
              <span className="flex items-center space-x-1.5">
                <Calendar className="w-3.5 h-3.5 text-teal-600" />
                <span>Observation Date</span>
              </span>
              <span className="text-[10.5px] font-mono font-bold text-teal-700">
                {dates.find(d => d.date === selectedDate)?.satellite || 'Landsat 9'}
              </span>
            </div>

            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-mono font-semibold text-slate-900 focus:outline-none focus:ring-1 focus:ring-teal-500 cursor-pointer shadow-2xs"
            >
              {dates.map((d) => (
                <option key={d.date} value={d.date}>
                  {d.date} ({d.satellite})
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Core Backend-Derived Metrics Grid */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard
          title="Built Area Domain"
          value={metadata ? metadata.built_area_km2.toFixed(2) : "132.13"}
          unit="km²"
          subtitle="Analyzed urban footprint"
          icon={Building2}
          accentColor="#8b5cf6"
          isLoading={isLoadingStats}
          isError={!backendConnected && !metadata}
          errorMessage="Metadata offline"
        />

        <StatCard
          title="Zonal Mean Surface Temp"
          value={zonalStats ? zonalStats.mean.toFixed(2) : "43.14"}
          unit="°C"
          subtitle={zonalStats ? `Min: ${zonalStats.min.toFixed(1)}°C / Max: ${zonalStats.max.toFixed(1)}°C` : "Landsat ST_B10"}
          icon={Flame}
          accentColor="#f97316"
          isLoading={isLoadingStats}
          isError={!backendConnected && !zonalStats}
          errorMessage="Statistics offline"
        />

        <StatCard
          title="Hotspot Area"
          value={hotspotStats ? hotspotStats.hotspot_area_km2.toFixed(2) : "34.54"}
          unit="km²"
          subtitle={hotspotStats ? `${hotspotStats.hotspot_percentage.toFixed(1)}% of valid domain` : "LST ≥ P80 reference"}
          icon={ShieldCheck}
          accentColor="#ef4444"
          isLoading={isLoadingStats}
          isError={!backendConnected && !hotspotStats}
          errorMessage="Statistics offline"
        />

        <StatCard
          title="Locked Model F1-Score"
          value={modelInfo ? (modelInfo.locked_test_metrics.f1_score * 100).toFixed(2) : "86.60"}
          unit="%"
          subtitle="100% spatially held-out test"
          icon={Cpu}
          accentColor="#0d9488"
          isError={!backendConnected && !modelInfo}
          errorMessage="Telemetry offline"
        />
      </section>

      {/* Main Split: Interactive AOI Map + Workflow Summary */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Mysuru AOI Geographic Map */}
        <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Compass className="w-4 h-4 text-teal-600" />
              <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900">
                Mysuru Study Area (AOI Boundary)
              </h2>
            </div>
            <span className="text-[10px] font-mono font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
              CARTO Voyager
            </span>
          </div>

          <p className="text-xs text-slate-500">
            Geographic boundary encompassing Mysuru's urbanized core and surrounding peri-urban zones. Road networks and place labels are clearly visible.
          </p>

          <OverviewMap />
        </div>

        {/* Right Column: Research Workflow Pipeline Summary */}
        <div className="lg:col-span-5 bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Layers className="w-4 h-4 text-teal-600" />
              <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900">
                Analysis Workflow Pipeline
              </h2>
            </div>
            <Link
              to="/methodology"
              className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center space-x-1"
            >
              <span>Methodology</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <p className="text-xs text-slate-500">
            Overview of the four-phase scientific methodology implemented in this study:
          </p>

          <div className="space-y-3 pt-1">
            {workflowSteps.map((s) => (
              <div
                key={s.step}
                className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/60 flex items-start space-x-3"
              >
                <div className="w-6 h-6 rounded-lg bg-teal-50 border border-teal-200/80 text-teal-700 font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {s.step}
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-xs font-bold text-slate-900">{s.title}</h3>
                  <p className="text-[11px] text-slate-600 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Analytical Views Navigation Grid */}
      <section className="space-y-3.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Satellite className="w-4 h-4 text-teal-600" />
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900">
              Dedicated Geospatial Analysis Views
            </h2>
          </div>
          <span className="text-xs text-slate-500">Click any card to open detailed explorer</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
          {analysisViews.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.to}
                to={card.to}
                className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs hover:border-teal-500/80 hover:shadow-card transition-all group flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div
                      className="p-2.5 rounded-xl transition-colors"
                      style={{
                        backgroundColor: `${card.color}15`,
                        color: card.color,
                      }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                      {card.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed mt-1">
                      {card.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 mt-3 flex items-center justify-between text-xs font-semibold text-teal-600 group-hover:text-teal-700">
                  <span>Explore analysis</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
};
