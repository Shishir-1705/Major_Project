import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import {
  Flame,
  Trees,
  Building2,
  ArrowRight,
  Info,
  Layers
} from 'lucide-react';

export const DataPanelsSection: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  const dataCards = [
    {
      id: 'lst',
      title: 'Land Surface Temperature (LST)',
      sensorBand: 'Landsat 8/9 Band 10 (ST_B10)',
      formula: 'T_s = \\frac{\\gamma}{\\epsilon} \\cdot (\\psi_1 L_{TOA} + \\psi_2) + \\psi_3',
      formulaText: 'Split-window / single-channel atmospheric correction with ASTER GED surface emissivity (\\epsilon)',
      unit: '°C (Degrees Celsius)',
      range: '26.4°C to 46.1°C Observed',
      accentColor: '#F97316',
      badgeBg: 'bg-orange-500/10 text-orange-400 border-orange-500/30',
      icon: Flame,
      summary:
        'Measures the direct radiometric skin temperature of roofs, pavements, and soil surfaces as observed from orbital sensors.',
      scientificDistinction:
        'Critical distinction: LST measures radiant surface heat, which differs significantly from 2-meter ambient air temperature. LST acts as the observational baseline for heat anomaly delineation.',
      role: 'Reference Baseline & Thermal Thresholding',
      route: '/lst',
      routeText: 'Explore LST Map'
    },
    {
      id: 'ndvi',
      title: 'Normalized Difference Vegetation Index (NDVI)',
      sensorBand: 'Landsat 8/9 Bands 4 & 5 (SR_B4 & SR_B5)',
      formula: 'NDVI = \\frac{NIR - Red}{NIR + Red}',
      formulaText: '(Band 5 - Band 4) / (Band 5 + Band 4)',
      unit: 'Index (-0.2 to +0.8)',
      range: 'Dense Canopy: >0.5 | Barren: <0.15',
      accentColor: '#14B8A6',
      badgeBg: 'bg-teal-500/10 text-teal-400 border-teal-500/30',
      icon: Trees,
      summary:
        'Quantifies photosynthetic canopy density and evapotranspiration capacity across parks, agro-forestry, and urban tree cover.',
      scientificDistinction:
        'Dense vegetation actively cools the urban microclimate through shaded surfaces and latent heat dissipation. Operates as an inverse predictor for thermal hotspot probability.',
      role: 'Random Forest Primary Predictor Feature',
      route: '/indices',
      routeText: 'Explore NDVI Map'
    },
    {
      id: 'ndbi',
      title: 'Normalized Difference Built-up Index (NDBI)',
      sensorBand: 'Landsat 8/9 Bands 5 & 6 (SR_B5 & SR_B6)',
      formula: 'NDBI = \\frac{SWIR1 - NIR}{SWIR1 + NIR}',
      formulaText: '(Band 6 - Band 5) / (Band 6 + Band 5)',
      unit: 'Index (-0.4 to +0.6)',
      range: 'Paved / Built: >0.0 | Non-Built: <0.0',
      accentColor: '#F59E0B',
      badgeBg: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
      icon: Building2,
      summary:
        'Captures impervious surfaces, concrete infrastructure, industrial roofing, and dense urban road networks across Mysuru.',
      scientificDistinction:
        'Impervious materials possess high thermal inertia and low latent heat loss, absorbing solar radiation by day and radiating heat at night. Exhibits a strong positive correlation with hotspot formation.',
      role: 'Random Forest Primary Predictor Feature',
      route: '/indices',
      routeText: 'Explore NDBI Map'
    }
  ];

  return (
    <section className="relative w-full py-16 md:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-[#26354A]/80">
      {/* Section Header */}
      <div className="max-w-3xl mx-auto text-center mb-12 md:mb-16">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#0D1525] border border-[#26354A] text-xs font-mono text-[#F97316] mb-3">
          <Layers className="w-3.5 h-3.5" />
          <span>SATELLITE DATA CHANNELS</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#F8FAFC] tracking-tight">
          Three Environmental Dimensions of Urban Heat
        </h2>
        <p className="text-sm sm:text-base text-[#94A3B8] mt-3 leading-relaxed">
          The research integrates multi-spectral surface reflectance and thermal radiance to understand the mechanistic drivers of heat accumulation.
        </p>
      </div>

      {/* 3 Data Panels Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {dataCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <motion.div
              key={card.id}
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.5, delay: idx * 0.15 }}
              className="flex flex-col justify-between rounded-2xl bg-[#0D1525] border border-[#26354A] hover:border-[#38BDF8]/40 transition-all duration-300 p-6 sm:p-7 shadow-lg hover:shadow-xl group"
            >
              <div>
                {/* Top Icon & Badge */}
                <div className="flex items-start justify-between gap-3 mb-5">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 border"
                    style={{
                      backgroundColor: `${card.accentColor}15`,
                      borderColor: `${card.accentColor}40`,
                      color: card.accentColor
                    }}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className={`text-[11px] font-mono px-2.5 py-1 rounded-md border font-semibold ${card.badgeBg}`}>
                    {card.sensorBand}
                  </span>
                </div>

                {/* Card Title */}
                <h3 className="text-xl font-bold text-[#F8FAFC] group-hover:text-white transition-colors">
                  {card.title}
                </h3>

                {/* Formula Snippet */}
                <div className="my-4 p-3 rounded-xl bg-[#080D18] border border-[#26354A] font-mono text-xs text-[#E2E8F0] space-y-1">
                  <div className="text-[10px] text-[#8291A8] uppercase tracking-wider">SPECTRAL / RADIOMETRIC BASIS</div>
                  <div className="font-semibold text-[#19D3C5]">{card.formulaText}</div>
                </div>

                {/* Summary */}
                <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed mb-4">
                  {card.summary}
                </p>

                {/* Scientific Distinction Callout */}
                <div className="p-3.5 rounded-xl bg-[#111C2E] border border-[#26354A] text-left mb-6">
                  <div className="flex items-center space-x-1.5 text-xs font-semibold text-[#FBBF24] mb-1">
                    <Info className="w-3.5 h-3.5" />
                    <span>Scientific Context</span>
                  </div>
                  <p className="text-xs text-[#A8B5C9] leading-snug">
                    {card.scientificDistinction}
                  </p>
                </div>
              </div>

              {/* Bottom Metadata & Link */}
              <div className="pt-4 border-t border-[#26354A] flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-[#8291A8] block uppercase">MODEL ROLE</span>
                  <span className="text-xs font-semibold text-[#F8FAFC]">{card.role}</span>
                </div>

                <Link
                  to={card.route}
                  className="inline-flex items-center space-x-1.5 text-xs font-semibold text-[#F97316] hover:text-[#FB923C] transition-colors group-hover:translate-x-0.5 duration-200"
                >
                  <span>{card.routeText}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
