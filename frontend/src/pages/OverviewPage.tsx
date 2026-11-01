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
      description: 'Getis-Ord Gi* spatial autocorrelation highlighting statistically significant hotspot clusters (FDR p < 0.05).',
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
    {
      to: '/methodology',
      title: 'Methodology & Protocol',
      description: 'Comprehensive 4-stage scientific framework, spatial block sampling, and data lineage.',
      icon: Layers,
      color: '#0f766e',
      badge: 'Academic Protocol',
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
    <div className="h-full w-full overflow-y-auto bg-transparent text-[#F5F7FB] p-4 sm:p-6 lg:p-8 space-y-6 lg:space-y-8 select-none relative z-10">
      {/* Hero Header & Context Banner */}
      <section className="liquid-glass-slab rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden border border-white/16">
        {/* Ambient atmospheric glow on top-right */}
        <div
          className="absolute -top-12 -right-12 w-80 h-80 rounded-full pointer-events-none opacity-20 blur-3xl"
          style={{ background: 'radial-gradient(circle, rgba(249, 115, 22, 0.4) 0%, rgba(6, 182, 212, 0.2) 60%, transparent 80%)' }}
          aria-hidden="true"
        />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-mono font-bold uppercase px-3 py-1 rounded-full liquid-glass-chip text-[#19D3C5] border border-[#19D3C5]/30 shadow-xs">
                Analytical Command Center
              </span>
              <span className="text-[11px] font-mono font-medium uppercase px-3 py-1 rounded-full liquid-glass-chip text-[#E2E8F0] border border-white/15">
                Mysuru, Karnataka, India
              </span>
              <span className="text-[11px] font-mono font-medium uppercase px-3 py-1 rounded-full liquid-glass-chip text-[#A8B5C9] border border-white/15">
                EPSG:32643 UTM 43N
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-[#F8FAFC]">
              Urban Thermal Intelligence{' '}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#F97316] via-[#FB923C] to-[#FBBF24]">
                Observatory
              </span>
            </h1>

            <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed max-w-2xl">
              Multi-temporal satellite remote sensing observatory synthesizing USGS Landsat 8/9 Level-2 radiometry, optical vegetation-impervious indices, and Random Forest spatial predictions across Mysuru.
            </p>
          </div>

          {/* Date Selector Badge */}
          <div className="shrink-0 liquid-glass-subtle rounded-2xl p-3.5 space-y-2 lg:w-60 border border-white/14 shadow-lg">
            <div className="flex items-center justify-between text-xs font-semibold text-[#A8B5C9]">
              <span className="flex items-center space-x-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#19D3C5]" />
                <span className="font-mono text-[11px] uppercase tracking-wide">Observation Cadence</span>
              </span>
              <span className="text-[11px] font-mono font-bold text-[#19D3C5]">
                {dates.find(d => d.date === selectedDate)?.satellite || 'Landsat 9'}
              </span>
            </div>

            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full bg-white/[0.08] border border-white/20 rounded-xl px-3 py-2 text-xs font-mono font-bold text-[#F8FAFC] focus:outline-none focus:ring-2 focus:ring-[#19D3C5] cursor-pointer shadow-inner"
            >
              {dates.map((d) => (
                <option key={d.date} value={d.date} className="bg-[#030611] text-[#F5F7FB]">
                  {d.date} • {d.satellite}
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
          accentColor="#19D3C5"
          isError={!backendConnected && !modelInfo}
          errorMessage="Telemetry offline"
        />
      </section>

      {/* Main Split: Interactive AOI Map + Workflow Summary */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Mysuru AOI Geographic Map */}
        <div className="lg:col-span-7 liquid-glass-slab rounded-2xl p-5 sm:p-6 shadow-2xl border border-white/14 space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Compass className="w-4 h-4 text-[#19D3C5]" />
              <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#F8FAFC]">
                Mysuru Study Area (AOI Boundary)
              </h2>
            </div>
            <span className="text-[10px] font-mono font-medium px-2.5 py-0.5 rounded-full liquid-glass-chip text-[#A8B5C9] border border-white/15">
              CARTO Voyager
            </span>
          </div>

          <p className="text-xs text-[#8291A8] leading-relaxed">
            Geographic boundary encompassing Mysuru's urbanized core and surrounding peri-urban zones. Road networks and place labels are clearly visible.
          </p>

          <OverviewMap />
        </div>

        {/* Right Column: Research Workflow Pipeline Summary */}
        <div className="lg:col-span-5 liquid-glass-slab rounded-2xl p-5 sm:p-6 shadow-2xl border border-white/14 space-y-3.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Layers className="w-4 h-4 text-[#19D3C5]" />
              <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#F8FAFC]">
                Analysis Workflow Pipeline
              </h2>
            </div>
            <Link
              to="/methodology"
              className="text-xs font-semibold text-[#19D3C5] hover:text-[#39E4D5] flex items-center space-x-1"
            >
              <span>Methodology</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <p className="text-xs text-[#8291A8]">
            Overview of the four-phase scientific methodology implemented in this study:
          </p>

          <div className="space-y-3 pt-1">
            {workflowSteps.map((s) => (
              <div
                key={s.step}
                className="p-3.5 rounded-xl border border-white/12 bg-white/[0.04] hover:bg-white/[0.07] transition-all flex items-start space-x-3 shadow-xs"
              >
                <div className="w-6 h-6 rounded-lg liquid-glass-chip border border-[#19D3C5]/40 text-[#19D3C5] font-mono font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  {s.step}
                </div>
                <div className="space-y-0.5">
                  <h3 className="text-xs font-bold text-[#F5F7FB]">{s.title}</h3>
                  <p className="text-[11px] text-[#A8B5C9] leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Analytical Views Navigation Grid */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Satellite className="w-4 h-4 text-[#19D3C5]" />
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#F8FAFC]">
              Dedicated Geospatial Analysis Views
            </h2>
          </div>
          <span className="text-xs text-[#8291A8]">Click any card to open detailed explorer</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {analysisViews.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.to}
                to={card.to}
                className="liquid-glass-slab rounded-2xl p-5 sm:p-6 shadow-floating border border-white/14 hover:border-[#19D3C5]/50 hover:shadow-[0_16px_40px_rgba(25,211,197,0.18)] transition-all group flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div
                      className="p-2.5 rounded-xl transition-all border border-white/12"
                      style={{
                        backgroundColor: `${card.color}18`,
                        color: card.color,
                        boxShadow: `0 0 16px ${card.color}25`,
                      }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono font-semibold uppercase px-2.5 py-0.5 rounded-md liquid-glass-chip text-[#A8B5C9] border border-white/15">
                      {card.badge}
                    </span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-[#F8FAFC] group-hover:text-[#19D3C5] transition-colors">
                      {card.title}
                    </h3>
                    <p className="text-xs text-[#94A3B8] leading-relaxed mt-1.5">
                      {card.description}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 mt-4 flex items-center justify-between text-xs font-semibold text-[#19D3C5] group-hover:text-[#39E4D5]">
                  <span>Explore analysis</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
};
