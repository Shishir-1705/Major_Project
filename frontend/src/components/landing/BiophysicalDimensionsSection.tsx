import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { Flame, Trees, Building2, ArrowRight } from 'lucide-react';

export const BiophysicalDimensionsSection: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  const dimensions = [
    {
      id: 'lst',
      title: 'Land Surface Temperature (LST)',
      tag: 'Thermal Radiometry',
      image: '/assets/landing/preview_lst.png',
      icon: Flame,
      accent: '#F97316',
      route: '/lst',
      routeText: 'Explore LST Map',
      summary:
        'Quantifies the direct radiometric skin temperature of urban surfaces as observed by satellite sensors. Crucially distinct from ambient air temperature, LST establishes the thermal baseline across roofs, asphalt, and natural land covers.'
    },
    {
      id: 'ndvi',
      title: 'Vegetation Canopy Density (NDVI)',
      tag: 'Canopy Density',
      image: '/assets/landing/preview_ndvi.png',
      icon: Trees,
      accent: '#14B8A6',
      route: '/indices',
      routeText: 'Explore NDVI Map',
      summary:
        'Measures photosynthetic chlorophyll absorption and vegetation canopy vitality across Mysuru. High-density urban green spaces provide essential microclimate buffering through solar shading and active evapotranspiration.'
    },
    {
      id: 'ndbi',
      title: 'Built-up Impervious Surface (NDBI)',
      tag: 'Urban Fabric',
      image: '/assets/landing/preview_ndbi.png',
      icon: Building2,
      accent: '#F59E0B',
      route: '/indices',
      routeText: 'Explore NDBI Map',
      summary:
        'Delineates structural density, concrete buildings, asphalt roadways, and industrial zones. Impervious urban materials store solar heat by day and continuously re-radiate thermal energy, driving localized hotspot formation.'
    }
  ];

  return (
    <section className="relative w-full py-20 md:py-32 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto border-t border-[#1E293B]">
      {/* Section Header */}
      <div className="max-w-3xl mb-14 md:mb-20 text-left">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#0D1525] border border-[#26354A] text-xs font-mono text-[#19D3C5] mb-3">
          <span>BIOPHYSICAL DIMENSIONS</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-[#F8FAFC] tracking-tight">
          Three Dimensions of Urban Heat Dynamics
        </h2>
        <p className="text-base sm:text-lg text-[#94A3B8] mt-4 leading-relaxed max-w-2xl">
          Thermal accumulation in urban environments is governed by the continuous interplay between radiant surface temperature, protective vegetative canopies, and impervious built-up infrastructure.
        </p>
      </div>

      {/* Editorial Image-Led Panels (Wide, Visual-First Layout) */}
      <div className="space-y-12 md:space-y-16">
        {dimensions.map((item, idx) => {
          const Icon = item.icon;
          const isReversed = idx % 2 === 1;

          return (
            <motion.div
              key={item.id}
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className={`grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center p-6 sm:p-8 rounded-3xl bg-[#0A0F1D]/80 border border-[#1E293B] shadow-xl hover:border-[#26354A] transition-all group`}
            >
              {/* Visual Panel */}
              <div
                className={`lg:col-span-7 relative aspect-16/10 rounded-2xl overflow-hidden bg-[#050912] border border-[#1E293B] ${
                  isReversed ? 'lg:order-2' : 'lg:order-1'
                }`}
              >
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-102"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080D18]/80 via-transparent to-transparent opacity-60" />

                <div className="absolute top-4 left-4 bg-[#080D18]/90 backdrop-blur-md px-3 py-1 rounded-md border border-[#26354A] text-xs font-mono text-[#F8FAFC]">
                  {item.tag}
                </div>
              </div>

              {/* Editorial Description Panel */}
              <div
                className={`lg:col-span-5 flex flex-col justify-center text-left ${
                  isReversed ? 'lg:order-1' : 'lg:order-2'
                }`}
              >
                <div className="flex items-center space-x-2.5 mb-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center border"
                    style={{
                      backgroundColor: `${item.accent}15`,
                      borderColor: `${item.accent}40`,
                      color: item.accent
                    }}
                  >
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <span className="font-mono text-xs uppercase tracking-wider text-[#A8B5C9] font-medium">
                    {item.tag}
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-bold text-[#F8FAFC] tracking-tight leading-snug">
                  {item.title}
                </h3>

                <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed mt-4">
                  {item.summary}
                </p>

                <div className="mt-8 pt-6 border-t border-[#1E293B]">
                  <Link
                    to={item.route}
                    className="inline-flex items-center space-x-2 text-sm font-semibold text-[#F8FAFC] hover:text-[#19D3C5] transition-colors group/link"
                  >
                    <span>{item.routeText}</span>
                    <ArrowRight className="w-4 h-4 text-[#19D3C5] group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
