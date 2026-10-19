import React from 'react';
import { Link } from 'react-router-dom';
import { useAppStore } from '../store/useAppStore';
import { OverviewMap } from '../components/map/OverviewMap';
import {
  Flame,
  ShieldCheck,
  Building2,
  Trees,
  BarChart2,
  GitCommit,
  Cpu,
  ArrowRight,
  Calendar,
  Satellite,
  Compass,
  CheckCircle2,
  MapPin,
  Database,
  ChevronRight,
  Shield,
  Info
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const {
    metadata,
    selectedDate,
    dates,
    zonalStats,
    hotspotStats,
    modelInfo
  } = useAppStore();

  const researchHighlights = [
    {
      title: 'Study Area Footprint',
      value: metadata ? `${metadata.built_area_km2.toFixed(2)} km²` : '132.13 km²',
      subtitle: 'Delineated Urban Extent',
      description: '93.66 km² valid analysis domain across Mysuru urban core and growth corridors (EPSG:32643 UTM 43N).',
      icon: Building2,
      color: '#0d9488',
      badge: 'Spatial Scope',
    },
    {
      title: 'Temporal Depth',
      value: '8 Observations',
      subtitle: 'Landsat 8 & 9 Synchronized',
      description: 'Cloud-free pre-monsoon time series spanning April 1 to May 27, 2023 capturing peak diurnal solar irradiance.',
      icon: Calendar,
      color: '#f97316',
      badge: 'Time Series',
    },
    {
      title: 'Spatial Generalization',
      value: modelInfo ? `${(modelInfo.locked_test_metrics.f1_score * 100).toFixed(2)}%` : '86.60%',
      subtitle: 'F1-Score on Held-Out Blocks',
      description: 'Evaluated across 10 unseen spatial blocks (195 samples) with strict zero-leakage spatial cross-validation.',
      icon: Cpu,
      color: '#8b5cf6',
      badge: 'Locked Model',
    },
    {
      title: 'Chronic Hotspots',
      value: '8.81 km²',
      subtitle: '9.40% of Valid Domain',
      description: 'Identified chronic structural thermal anomalies recurring across ≥ 6 of 8 observation dates.',
      icon: Flame,
      color: '#ef4444',
      badge: 'Persistence',
    },
  ];

  const analyticalCapabilities = [
    {
      to: '/lst',
      title: 'LST Explorer',
      subtitle: 'Radiometric Surface Temperature',
      description: 'Visualize Landsat-8/9 Band 10 thermal infrared skin temperature distributions, thermal gradients, and seasonal shifts across Mysuru.',
      icon: Flame,
      color: '#ea580c',
      badge: 'Thermal ST_B10',
      metric: '28.5°C – 52.8°C Dynamic Range',
    },
    {
      to: '/hotspots',
      title: 'ML Hotspots',
      subtitle: 'Random Forest Predictive Modeling',
      description: 'Explore continuous class probability surfaces and binary classifications derived purely from optical indices without thermal data leakage.',
      icon: ShieldCheck,
      color: '#0d9488',
      badge: 'RF Classifier',
      metric: 'Threshold: P ≥ 0.50 (Class 1)',
    },
    {
      to: '/indices',
      title: 'NDVI & NDBI Indices',
      subtitle: 'Vegetation Canopy vs Built-up Imperviousness',
      description: 'Examine normalized difference spectral indices that drive the machine learning classifier, illustrating canopy cooling vs pavement heat absorption.',
      icon: Trees,
      color: '#10b981',
      badge: 'Optical Predictors',
      metric: '61.0% NDBI / 39.0% NDVI Gini Weight',
    },
    {
      to: '/persistence',
      title: 'Heat Persistence',
      subtitle: 'Multi-Temporal Recurrence Categorization',
      description: 'Categorize spatial stability across 5 discrete tiers: Single Event, Ephemeral, Periodic, Frequent, and Chronic persistent thermal anomalies.',
      icon: GitCommit,
      color: '#eab308',
      badge: '5-Tier Stacking',
      metric: '8.81 km² Chronic Structural Hotspots',
    },
    {
      to: '/clusters',
      title: 'Gi* Spatial Clusters',
      subtitle: 'Getis-Ord Spatial Autocorrelation',
      description: 'Statistically rigorous local clustering analysis identifying high-confidence hotspot and coldspot clusters adjusted for False Discovery Rate (FDR p < 0.05).',
      icon: BarChart2,
      color: '#0284c7',
      badge: 'Spatial Statistics',
      metric: '99%, 95%, 90% Confidence Z-scores',
    },
    {
      to: '/model',
      title: 'Model Specification',
      subtitle: 'Locked Architecture & Evaluation Audit',
      description: 'Review complete model hyperparameters, confusion matrices, ROC/PR curves, and cryptographically verified SHA-256 weight integrity.',
      icon: Cpu,
      color: '#6366f1',
      badge: 'SHA-256 Verified',
      metric: '0.934 ROC-AUC / 0.866 Precision',
    },
    {
      to: '/methodology',
      title: 'Research Methodology',
      subtitle: 'Scientific Protocol & Data Lineage',
      description: 'Read the comprehensive end-to-end scientific methodology covering USGS Level-2 preprocessing, spatial block sampling, and statistical validation.',
      icon: Info,
      color: '#0f766e',
      badge: 'Academic Protocol',
      metric: '4-Stage Peer-Review Framework',
    },
  ];

  const pipelineStages = [
    {
      step: '01',
      title: 'Satellite Data Acquisition',
      subtitle: 'Landsat 8 & 9 Level-2 Collection 2',
      details: 'Acquired 8 pre-monsoon cloud-free scenes (April–May 2023) covering Path 144 / Row 051 at 30m spatial resolution in UTM Zone 43N.',
      tag: 'USGS EROS',
    },
    {
      step: '02',
      title: 'Optical Feature Extraction',
      subtitle: 'NDVI & NDBI Spectral Indices',
      details: 'Calculated canopy density (NDVI) and built-up index (NDBI). Thermal channels and spatial coordinates were strictly excluded to eliminate leakage.',
      tag: 'Zero Leakage',
    },
    {
      step: '03',
      title: 'Spatial Block Model Training',
      subtitle: '100-Tree Random Forest Classifier',
      details: 'Trained on 805 samples across 30 spatial blocks and verified on 195 samples across 10 completely held-out geographic blocks (86.60% F1-score).',
      tag: 'Locked SHA-256',
    },
    {
      step: '04',
      title: 'Temporal Persistence Stacking',
      subtitle: 'Multi-Temporal Recurrence Analysis',
      details: 'Synthesized 8 temporal predictions into a multi-temporal persistence raster, categorizing pixels into 5 recurrence classes from Ephemeral to Chronic.',
      tag: '5-Tier Recurrence',
    },
    {
      step: '05',
      title: 'Spatial Autocorrelation Clustering',
      subtitle: 'Getis-Ord Gi* Statistics',
      details: 'Computed local spatial autocorrelation with False Discovery Rate (FDR) correction to detect statistically significant hot and cold microclimate clusters.',
      tag: 'FDR p < 0.05',
    },
  ];

  const scientificDisclosures = [
    {
      title: 'Radiometric Skin Temperature vs Ambient Air',
      description: 'LST measures the radiometric skin surface temperature emitted by physical materials (asphalt, concrete, soil, foliage) recorded by satellite thermal infrared sensors. It is distinct from 2-meter ambient air temperature typically reported by meteorological weather stations.',
      badge: 'Remote Sensing Principle',
    },
    {
      title: 'Statistical P80 Pseudo-Reference Labels',
      description: 'Hotspot ground truth labels in this study are derived from the 80th percentile (P80) of LST within the valid built-up domain for each scene. They represent relative statistical surface heat anomalies within the observation period rather than absolute physiological hazard limits.',
      badge: 'Labeling Methodology',
    },
    {
      title: 'Spatial Heat Anomaly Scope',
      description: 'Detected hotspots represent relative microclimatic surface warming driven by high impervious surface density and sparse vegetative canopy. These outputs serve urban planning and thermal risk mitigation rather than meteorological heatwave declarations.',
      badge: 'Application Scope',
    },
    {
      title: 'Locked Cryptographic Integrity',
      description: 'The trained Random Forest model is sealed with cryptographic SHA-256 hash 4cb736e5... guaranteeing zero post-hoc parameter mutation or retraining drift throughout all analytical evaluations and API endpoints.',
      badge: 'Model Security',
    },
  ];

  return (
    <div className="h-full w-full overflow-y-auto bg-[#f8fafc] text-slate-800 select-none">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-teal-50/60 via-white to-[#f8fafc] border-b border-slate-200/80 px-4 sm:px-6 lg:px-12 pt-8 pb-12 sm:pt-12 sm:pb-16">
        {/* Decorative Grid Pattern */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.035]"
          style={{
            backgroundImage: `radial-gradient(#0d9488 1px, transparent 1px)`,
            backgroundSize: '24px 24px'
          }}
        />

        <div className="max-w-7xl mx-auto relative z-10 space-y-8">
          {/* Top Metadata Badges */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
            <span className="inline-flex items-center space-x-1.5 text-xs font-mono font-bold uppercase px-3 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200 shadow-2xs">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-600 animate-pulse" />
              <span>Academic Major Research Project</span>
            </span>
            <span className="inline-flex items-center space-x-1 text-xs font-mono font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
              <MapPin className="w-3.5 h-3.5 text-teal-600" />
              <span>Mysuru, Karnataka</span>
            </span>
            <span className="inline-flex items-center space-x-1 text-xs font-mono font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200 hidden sm:inline-flex">
              <span>EPSG:32643 UTM 43N</span>
            </span>
            <span className="inline-flex items-center space-x-1 text-xs font-mono font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
              <Shield className="w-3.5 h-3.5 text-emerald-600" />
              <span>SHA-256 Model Locked</span>
            </span>
          </div>

          {/* Headline & Abstract */}
          <div className="space-y-4 max-w-4xl">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
              Understanding Urban Heat Through{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-700 via-teal-600 to-cyan-600">
                Satellite Intelligence
              </span>
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-slate-600 leading-relaxed max-w-3xl">
              Machine learning-based spatial identification and predictive modeling of surface thermal anomalies across Mysuru, India. Powered by Landsat 8 and 9 Level-2 radiometric observations, optical spectral indices (NDVI & NDBI), and locked spatial evaluation.
            </p>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Link
              to="/overview"
              className="inline-flex items-center space-x-2.5 px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-semibold text-sm shadow-md hover:shadow-lg transition-all group"
            >
              <span>Explore Interactive Overview</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/lst"
              className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm border border-slate-200 shadow-xs hover:border-slate-300 transition-all"
            >
              <Flame className="w-4 h-4 text-orange-500" />
              <span>Open LST Map</span>
            </Link>

            <Link
              to="/methodology"
              className="inline-flex items-center space-x-2 px-5 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm border border-slate-200 shadow-xs hover:border-slate-300 transition-all"
            >
              <Info className="w-4 h-4 text-slate-500" />
              <span>Methodology & Papers</span>
            </Link>
          </div>

          {/* Live Telemetry & Interactive AOI Map Feature Split */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-4 items-stretch">
            {/* Left Column: Mission Control Telemetry Cards */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
              <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center space-x-2">
                    <Satellite className="w-4 h-4 text-teal-600" />
                    <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                      Telemetry & Environmental Status
                    </h3>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-teal-50 text-teal-700 border border-teal-200">
                    {dates.find(d => d.date === selectedDate)?.satellite || 'Landsat 9'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-1">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase">Mean Surface Temp</span>
                    <div className="text-xl font-bold font-mono text-slate-900">
                      {zonalStats ? `${zonalStats.mean.toFixed(1)}°C` : '43.1°C'}
                    </div>
                    <span className="text-[10.5px] text-slate-500 block truncate">
                      {zonalStats ? `Peak: ${zonalStats.max.toFixed(1)}°C` : 'ST_B10 thermal band'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-1">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase">Hotspot Coverage</span>
                    <div className="text-xl font-bold font-mono text-rose-600">
                      {hotspotStats ? `${hotspotStats.hotspot_percentage.toFixed(1)}%` : '36.9%'}
                    </div>
                    <span className="text-[10.5px] text-slate-500 block truncate">
                      {hotspotStats ? `${hotspotStats.hotspot_area_km2.toFixed(1)} km² surface` : 'LST ≥ P80 label'}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-1">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase">Model Generalization</span>
                    <div className="text-xl font-bold font-mono text-teal-700">86.60%</div>
                    <span className="text-[10.5px] text-slate-500 block truncate">F1 on held-out blocks</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-200/80 space-y-1">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase">Chronic Hotspots</span>
                    <div className="text-xl font-bold font-mono text-amber-600">8.81 km²</div>
                    <span className="text-[10.5px] text-slate-500 block truncate">≥ 6 dates recurrence</span>
                  </div>
                </div>

                <div className="pt-2 text-xs text-slate-500 flex items-center justify-between border-t border-slate-100">
                  <span className="flex items-center space-x-1.5">
                    <Database className="w-3.5 h-3.5 text-slate-400" />
                    <span>8 Cloud-Free Landsat Scenes</span>
                  </span>
                  <span className="font-mono text-slate-700 font-semibold">April–May 2023</span>
                </div>
              </div>

              {/* Cryptographic Seal Badge */}
              <div className="bg-slate-900 text-slate-100 rounded-2xl p-4 shadow-sm space-y-2 border border-slate-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-teal-400 text-xs font-bold uppercase tracking-wider">
                    <Shield className="w-4 h-4" />
                    <span>Cryptographic Model Seal</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-teal-950 text-teal-300 border border-teal-800">
                    VERIFIED
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Random Forest weights sealed with immutable SHA-256 checksum:
                </p>
                <div className="p-2 rounded-lg bg-slate-950 border border-slate-800 font-mono text-[10.5px] text-teal-300 break-all select-all">
                  4cb736e53c66c78dbbcbc1cf7ca3ac965af01f1c7fae829502649b018e127280
                </div>
              </div>
            </div>

            {/* Right Column: Embedded Interactive AOI Map */}
            <div className="lg:col-span-7 bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Compass className="w-4 h-4 text-teal-600" />
                  <h3 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-slate-900">
                    Mysuru Study Area (AOI Boundary)
                  </h3>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10.5px] font-mono px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                    CARTO Voyager Basemap
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-500">
                Geographic boundary covering 132.13 km² urban extent across Mysuru city center, ring roads, and industrial corridors.
              </p>

              <div className="flex-1 min-h-[360px] sm:min-h-[420px]">
                <OverviewMap />
              </div>

              <div className="flex items-center justify-between pt-1 text-xs text-slate-500">
                <span>Interactive pan & zoom enabled</span>
                <Link to="/lst" className="text-teal-600 hover:text-teal-700 font-semibold flex items-center space-x-1">
                  <span>Open Full Satellite Viewer</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. RESEARCH HIGHLIGHTS METRICS GRID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-10 sm:py-14 space-y-6">
        <div className="space-y-1.5 text-center max-w-2xl mx-auto">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-teal-600">
            Empirical Findings
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Key Quantitative Research Highlights
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Rigorous remote sensing metrics derived from multi-temporal Landsat Level-2 observations over Mysuru.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {researchHighlights.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:border-slate-300 hover:shadow-card transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div
                      className="p-2.5 rounded-xl"
                      style={{
                        backgroundColor: `${item.color}15`,
                        color: item.color,
                      }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                      {item.badge}
                    </span>
                  </div>

                  <div>
                    <span className="text-xs font-semibold text-slate-500 block">
                      {item.title}
                    </span>
                    <div className="text-2xl sm:text-3xl font-black font-mono text-slate-900 tracking-tight mt-1">
                      {item.value}
                    </div>
                    <span className="text-xs font-semibold text-teal-700 block mt-0.5">
                      {item.subtitle}
                    </span>
                  </div>

                  <p className="text-xs text-slate-500 leading-relaxed pt-1 border-t border-slate-100">
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 3. ANALYTICAL CAPABILITIES SHOWCASE */}
      <section className="bg-slate-50/80 border-y border-slate-200/80 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-1.5 max-w-2xl">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-teal-600">
                System Architecture
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Specialized Geospatial Analysis Views
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Seven dedicated analytical modules providing targeted exploration of thermal surfaces, machine learning outputs, and spatial statistics.
              </p>
            </div>

            <Link
              to="/overview"
              className="inline-flex items-center space-x-1.5 text-xs font-semibold text-teal-600 hover:text-teal-700 shrink-0"
            >
              <span>View Unified Overview</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {analyticalCapabilities.map((card) => {
              const Icon = card.icon;
              return (
                <Link
                  key={card.to}
                  to={card.to}
                  className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:border-teal-500/80 hover:shadow-card transition-all group flex flex-col justify-between"
                >
                  <div className="space-y-3.5">
                    <div className="flex items-center justify-between">
                      <div
                        className="p-3 rounded-xl transition-colors"
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
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-teal-700 transition-colors">
                        {card.title}
                      </h3>
                      <p className="text-xs font-semibold text-teal-600 mt-0.5">
                        {card.subtitle}
                      </p>
                      <p className="text-xs text-slate-500 leading-relaxed mt-2">
                        {card.description}
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 mt-4 space-y-2">
                    <div className="text-[11px] font-mono text-slate-500 font-medium truncate">
                      {card.metric}
                    </div>
                    <div className="flex items-center justify-between text-xs font-semibold text-teal-600 group-hover:text-teal-700">
                      <span>Launch module</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. VISUAL RESEARCH PIPELINE ARCHITECTURE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-12 sm:py-16 space-y-8">
        <div className="space-y-1.5 text-center max-w-2xl mx-auto">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-teal-600">
            Methodological Workflow
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            End-to-End Scientific Processing Pipeline
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            From raw USGS Landsat Level-2 radiance and surface reflectance to spatial block machine learning and spatial clustering.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {pipelineStages.map((stage, idx) => (
            <div
              key={stage.step}
              className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-5 shadow-xs relative flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="w-7 h-7 rounded-lg bg-teal-50 border border-teal-200/80 text-teal-700 font-mono font-bold text-xs flex items-center justify-center">
                    {stage.step}
                  </span>
                  <span className="text-[9.5px] font-mono font-semibold uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                    {stage.tag}
                  </span>
                </div>

                <h3 className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                  {stage.title}
                </h3>
                <div className="text-[11px] font-semibold text-teal-600">
                  {stage.subtitle}
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed pt-1">
                  {stage.details}
                </p>
              </div>

              {idx < pipelineStages.length - 1 && (
                <div className="hidden md:block absolute -right-2.5 top-1/2 -translate-y-1/2 z-10 w-5 h-5 rounded-full bg-teal-50 border border-teal-200 text-teal-600 flex items-center justify-center shadow-xs">
                  <ChevronRight className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* 5. SCIENTIFIC GOVERNANCE & DISCLOSURES */}
      <section className="bg-slate-100/70 border-t border-slate-200/80 py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 space-y-6">
          <div className="space-y-1.5 max-w-2xl">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-teal-700">
              Rigorous Governance
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Scientific Principles & Disclosures
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Transparent reporting of satellite measurement parameters, label derivation assumptions, and cryptographic model integrity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            {scientificDisclosures.map((disc) => (
              <div
                key={disc.title}
                className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900 flex items-center space-x-1.5">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                    <span>{disc.title}</span>
                  </h3>
                  <span className="text-[10px] font-mono font-semibold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200 shrink-0">
                    {disc.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed pl-5.5">
                  {disc.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION BANNER */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-10 sm:py-14">
        <div className="bg-gradient-to-r from-teal-800 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <span className="text-xs font-mono font-bold uppercase px-2.5 py-0.5 rounded-full bg-teal-700/60 text-teal-200 border border-teal-500/30">
              Geospatial Exploration Hub
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Ready to Explore the Mysuru Heat Models?
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Launch the full-screen interactive map workspace with multi-temporal observation dates, spectral indices, and Getis-Ord Gi* cluster overlays.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to="/overview"
              className="px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm shadow-md transition-all flex items-center space-x-2"
            >
              <span>Launch Overview</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/model"
              className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm border border-slate-700 transition-all flex items-center space-x-2"
            >
              <Cpu className="w-4 h-4 text-teal-400" />
              <span>Model Audit</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 7. ACADEMIC CREDITS & PLATFORM FOOTER */}
      <footer className="border-t border-slate-200/80 bg-white py-8 px-4 sm:px-6 lg:px-12 text-slate-500 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-1 text-center sm:text-left">
            <div className="font-bold text-slate-800">
              Machine Learning-Based Urban Heat Hotspot Detection Using LST, NDVI and NDBI
            </div>
            <p className="text-[11px] text-slate-500">
              Major Research Project • Mysuru Study Area (EPSG:32643 UTM 43N) • Landsat 8/9 Level-2 Remote Sensing
            </p>
          </div>

          <div className="flex items-center space-x-4 text-[11px] font-mono">
            <span>React + Vite</span>
            <span>•</span>
            <span>FastAPI + GeoTIFF</span>
            <span>•</span>
            <span>CARTO Basemaps</span>
          </div>
        </div>
      </footer>
    </div>
  );
};
