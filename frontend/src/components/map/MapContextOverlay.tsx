import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { OBSERVATION_DATES, LAYERS } from '../../config/constants';
import {
  Flame,
  Trees,
  Building2,
  Cpu,
  Layers,
  Calendar,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export const MapContextOverlay: React.FC = () => {
  const { activeLayer, selectedDate, backendConnected } = useAppStore();
  const [isExpanded, setIsExpanded] = useState(false);

  const currentLayerObj = LAYERS.find((l) => l.id === activeLayer);
  const currentDateObj = OBSERVATION_DATES.find((d) => d.date === selectedDate);

  // Layer-specific scientific definitions
  const getLayerDetails = () => {
    switch (activeLayer) {
      case 'lst':
        return {
          title: 'Land Surface Temperature (LST)',
          subtitle: 'Radiometric Skin Temperature',
          icon: Flame,
          accentColor: '#f97316',
          badgeText: 'Thermal Analysis',
          description:
            'Direct radiometric surface temperature derived from Landsat 8/9 ST_B10 at ~10:45 AM local overpass. Represents ground/rooftop skin temperature, not ambient 2 m air temperature.',
          scope: 'Continuous Thermal Gradient (30.0 °C to 55.0 °C)',
          temporal: `${selectedDate} (${currentDateObj?.satellite || 'Landsat'})`,
          platform: currentDateObj?.satellite || 'Landsat 8/9',
        };
      case 'rf_prob':
        return {
          title: 'RF Hotspot Probability',
          subtitle: 'Continuous Class 1 Likelihood',
          icon: Cpu,
          accentColor: '#19D3C5',
          badgeText: 'ML Inference',
          description:
            'Random Forest model continuous probability output [0.00 – 1.00] estimating the likelihood that an urban pixel is in the top 20% (P80) of thermal intensity, inferred exclusively from NDBI and NDVI.',
          scope: 'Continuous Probability [0.00 to 1.00]',
          temporal: `${selectedDate} (${currentDateObj?.satellite || 'Landsat'})`,
          platform: 'Random Forest (100 Trees)',
        };
      case 'rf_class':
        return {
          title: 'RF Hotspot Classification',
          subtitle: 'Binary Decision at P80 Threshold',
          icon: ShieldCheck,
          accentColor: '#ef4444',
          badgeText: 'ML Classification',
          description:
            'Binary urban heat hotspot classification: Class 1 (Hotspot, Prob ≥ 0.50) vs Class 0 (Non-Hotspot, Prob < 0.50). Evaluated against top-quintile (P80) pseudo-reference labels.',
          scope: 'Binary: Class 1 (Hotspot) vs Class 0 (Non-Hotspot)',
          temporal: `${selectedDate} (${currentDateObj?.satellite || 'Landsat'})`,
          platform: 'Random Forest (Locked)',
        };
      case 'ndvi':
        return {
          title: 'Normalized Difference Vegetation (NDVI)',
          subtitle: 'Vegetation Canopy Density Index',
          icon: Trees,
          accentColor: '#10b981',
          badgeText: 'Spectral Index',
          description:
            'Canopy density and vegetative vigor derived from Landsat Red (B4) and NIR (B5) bands. High values (+0.3 to +0.8) indicate dense green canopy; lower values indicate bare soil, pavement, or built structures.',
          scope: 'Standardized Index Range [-0.20 to +0.80]',
          temporal: `${selectedDate} (${currentDateObj?.satellite || 'Landsat'})`,
          platform: currentDateObj?.satellite || 'Landsat OLI',
        };
      case 'ndbi':
        return {
          title: 'Normalized Difference Built-up (NDBI)',
          subtitle: 'Built-up Surface & Pavement Index',
          icon: Building2,
          accentColor: '#a855f7',
          badgeText: 'Spectral Index',
          description:
            'Impervious built-up and paved surface density derived from Landsat SWIR-1 (B6) and NIR (B5) bands. Higher values (+0.1 to +0.6) reflect dense concrete, asphalt, and masonry surfaces.',
          scope: 'Standardized Index Range [-0.40 to +0.60]',
          temporal: `${selectedDate} (${currentDateObj?.satellite || 'Landsat'})`,
          platform: currentDateObj?.satellite || 'Landsat OLI',
        };
      case 'persistence':
        return {
          title: 'Multi-Temporal Heat Persistence',
          subtitle: 'Recurrence Stability (8 Observations)',
          icon: Layers,
          accentColor: '#f59e0b',
          badgeText: 'Spatial Recurrence',
          description:
            'Pixel-by-pixel recurrence frequency integrating all 8 verified Landsat observations across April–May 2023. Distinguishes chronic, structural thermal anomalies (Category 5: >75–100%) from transient spikes.',
          scope: '5-Tier Categorical Recurrence (0% to 100%)',
          temporal: '8-Date Seasonal Composite (Apr–May 2023)',
          platform: 'Multi-Temporal Landsat 8/9',
        };
      case 'gi_star':
        return {
          title: 'Getis-Ord Gi* Spatial Clusters',
          subtitle: 'Spatial Autocorrelation Statistics',
          icon: CheckCircle2,
          accentColor: '#0891b2',
          badgeText: 'Spatial Statistics',
          description:
            'Statistically significant spatial clustering of elevated surface temperature (z-scores at 90%, 95%, and 99% confidence). Identifies localized spatial hot spots; does not represent an official meteorological heatwave declaration.',
          scope: 'Z-score Statistical Clustering (90% to 99% Conf.)',
          temporal: '8-Date Seasonal Composite (Apr–May 2023)',
          platform: 'Getis-Ord Gi* Autocorrelation',
        };
      default:
        return {
          title: currentLayerObj?.name || activeLayer,
          subtitle: 'Geospatial Analytical Layer',
          icon: Layers,
          accentColor: '#19D3C5',
          badgeText: 'Active Layer',
          description: currentLayerObj?.description || 'Active spatial analysis layer.',
          scope: 'Spatial Analysis Product',
          temporal: selectedDate,
          platform: 'Landsat Imagery',
        };
    }
  };

  const details = getLayerDetails();
  const IconComponent = details.icon;

  return (
    <div className="absolute top-3 right-3 z-[1000] max-w-[calc(100vw-24px)] sm:max-w-md pointer-events-auto select-none">
      {/* Compact Header Pill */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="bg-[#080D18]/95 border border-[#26354A] hover:border-[#19D3C5]/50 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-card flex items-center space-x-2 text-xs cursor-pointer transition-all duration-150 group"
        role="button"
        aria-expanded={isExpanded}
        aria-label="Toggle active map analysis details"
      >
        <div
          className="p-1 rounded-md shrink-0 transition-colors"
          style={{ backgroundColor: `${details.accentColor}20`, color: details.accentColor }}
        >
          <IconComponent className="w-3.5 h-3.5" />
        </div>

        <div className="flex items-center space-x-1.5 min-w-0">
          <span className="font-bold text-[#F5F7FB] truncate text-[11px] sm:text-xs">
            {details.title}
          </span>
          <span className="text-[#8291A8] hidden sm:inline">•</span>
          <span className="font-mono text-[10.5px] text-[#19D3C5] shrink-0 hidden sm:inline">
            {details.temporal}
          </span>
        </div>

        <div className="flex items-center space-x-1 shrink-0 ml-auto pl-1">
          {backendConnected ? (
            <span className="w-1.5 h-1.5 rounded-full bg-[#19D3C5]" title="Backend Connected" />
          ) : (
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" title="Backend Offline" />
          )}
          {isExpanded ? (
            <ChevronUp className="w-3.5 h-3.5 text-[#8291A8] group-hover:text-[#F5F7FB]" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-[#8291A8] group-hover:text-[#F5F7FB]" />
          )}
        </div>
      </div>

      {/* Expanded Scientific Context Panel */}
      {isExpanded && (
        <div className="mt-1.5 bg-[#0D1525]/95 border border-[#26354A] backdrop-blur-md rounded-xl p-3 shadow-floating text-xs space-y-2 animate-in fade-in slide-in-from-top-1 duration-150">
          {/* Header Row */}
          <div className="flex items-start justify-between border-b border-[#26354A]/60 pb-2">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#19D3C5]">
                {details.badgeText}
              </div>
              <h3 className="font-bold text-[#F5F7FB] text-xs leading-snug">
                {details.title}
              </h3>
              <p className="text-[10px] text-[#8291A8]">
                {details.subtitle}
              </p>
            </div>
            <span className="text-[9.5px] font-mono px-1.5 py-0.5 rounded bg-[#162238] border border-[#26354A] text-[#A8B5C9] shrink-0">
              {details.platform}
            </span>
          </div>

          {/* Description */}
          <p className="text-[11px] text-[#A8B5C9] leading-relaxed">
            {details.description}
          </p>

          {/* Context Details Grid */}
          <div className="grid grid-cols-2 gap-1.5 text-[10px] pt-1">
            <div className="bg-[#111C2E] p-1.5 rounded-lg border border-[#26354A]">
              <span className="text-[#8291A8] block">Analytical Scope</span>
              <span className="text-[#F5F7FB] font-medium block truncate" title={details.scope}>
                {details.scope}
              </span>
            </div>
            <div className="bg-[#111C2E] p-1.5 rounded-lg border border-[#26354A]">
              <span className="text-[#8291A8] block">Study Domain</span>
              <span className="text-[#19D3C5] font-medium block truncate">
                Mysuru AOI (132.1 km²)
              </span>
            </div>
          </div>

          {/* Footer Temporal Stamp */}
          <div className="flex items-center justify-between pt-1 border-t border-[#26354A]/60 text-[10px] text-[#8291A8]">
            <span className="flex items-center space-x-1">
              <Calendar className="w-3 h-3 text-[#19D3C5]" />
              <span className="font-mono text-[#F5F7FB]">{details.temporal}</span>
            </span>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-[#8291A8] hover:text-[#19D3C5] underline cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
