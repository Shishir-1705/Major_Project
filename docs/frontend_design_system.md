# Frontend Design System Specification

**Project Title**: Machine Learning-Based Urban Heat Hotspot Detection Using LST, NDVI and NDBI from Landsat Imagery  
**Study Area**: Mysuru, Karnataka, India  
**Visual Theme**: **THERMAL INTELLIGENCE / GEO-ANALYTICS**  
**Document Version**: 1.0.0  
**Phase**: System Architecture & Application Design (Step 11)  

---

## 1. Visual Identity & Design Philosophy

The application interface adheres to a **"Thermal Intelligence / Geo-Analytics"** visual identity—a dark, high-contrast, professional scientific dashboard that mirrors modern geospatial analytical tools (e.g., Earth Engine Apps, Mapbox Studio, Sentinel Hub).

### Key Design Directives:
- **Map First**: The interactive map workspace is the central focus ($\ge 65\%$ of viewport area).
- **Dark Mode Scientific Aesthetic**: Deep charcoal background (`#0b0f19`) to reduce eye strain and maximize satellite raster contrast.
- **Restricted Thermal Accent**: Thermal colors (amber, orange, red) are **strictly reserved** for actual LST temperature values and hotspot intensity. General UI elements, buttons, and navigation use neutral Cyan/Teal accents.
- **Subtle Glassmorphism & Borders**: Crisp, semi-transparent panel surfaces (`#111827`, border `#1f2937`) with minimal box-shadow clutter.

---

## 2. Color System & Design Tokens

```
====================================================================================
TOKEN CATEGORY       HEX CODE    RGB / TAILWIND CLASS     PURPOSE & USAGE
====================================================================================
Background Base      #0b0f19     bg-slate-950             Primary app canvas background
Panel Surface        #111827     bg-slate-900             Control cards & sidebars
Panel Border         #1f2937     border-slate-800         Subtle container outlines
Primary Text         #f8fafc     text-slate-50            Headings & key metrics
Secondary Text       #94a3b8     text-slate-400            Labels, subtitles, captions
Muted Border         #334155     border-slate-700         Divider lines & active borders

--- NEUTRAL GEOSPATIAL & UI ACCENTS ---
Cyan Accent          #06b6d4     text-cyan-500 / bg-cyan-500   Active tabs, map tools, highlights
Teal Accent          #0891b2     text-cyan-600                 Secondary buttons, selected states

--- ENVIRONMENTAL & FEATURE ACCENTS ---
Vegetation (NDVI)    #10b981     text-emerald-500              NDVI charts, eco-metrics, greenness
Built-up (NDBI)      #a855f7     text-purple-500               NDBI charts, urban expansion metrics

--- THERMAL & HOTSPOT ACCENTS (STRICTLY RESERVED) ---
Low Heat / Mild      #f59e0b     text-amber-500                Warm LST, P20 threshold border
Moderate Hotspot     #f97316     text-orange-500               Elevated heat, transient persistence
Severe Hotspot       #ef4444     text-red-500                  Hotspot classification (Class 1), Gi* 99%
====================================================================================
```

---

## 3. Typography Scale

The font stack uses **Inter** or standard system sans-serif font stack for maximum legibility across data tables, maps, and chart legends:

```
LEVEL           FONT SIZE   LINE HEIGHT   WEIGHT     USAGE
====================================================================================
Heading 1 (H1)  20 px       28 px         700 Bold   Application Title & Section Headers
Heading 2 (H2)  16 px       24 px         600 Semi   Card Titles & Modal Headers
Heading 3 (H3)  14 px       20 px         600 Semi   Sub-section Labels & Stat Titles
Body Regular    13 px       18 px         400 Normal Metric Values, Descriptions, Body Text
Caption / Badge 11 px       16 px         500 Medium Legend Labels, Timestamps, Badges
Mono / Code     12 px       16 px         400 Mono   Coordinates, SHA-256 Hashes, Values
```

---

## 4. Component Patterns

### 4.1 Metric Cards (`StatCard`)
- **Structure**: Compact dark card (`bg-slate-900/90`, `border-slate-800`).
- **Content**: Icon + Metric Label (muted gray) + Large Metric Value (white/cyan) + Subtitle/Trend.

### 4.2 Layer Switcher (`LayerControl`)
- **Type**: Vertical button group with active cyan border (`border-cyan-500`).
- **Options**: Thermal LST, NDVI Vegetation, NDBI Built-up, RF Hotspot Probability, RF Hotspot Classification, Multi-Temporal Persistence, Getis-Ord $\text{G}_i^*$ Clusters.

### 4.3 Interactive Map Legend (`MapLegend`)
- **Position**: Floating bottom-right overlay on map canvas.
- **Design**: Continuous color ramp for continuous variables (LST, NDVI, NDBI, Prob) or discrete color blocks for categorical maps (Class, Persistence, Gi*).

### 4.4 Model Info Panel (`ModelPanel`)
- **Location**: Right analytics drawer.
- **Display**: Model Name, Predictors (`NDVI + NDBI`), Target (`LST-derived reference labels`), Locked F1 ($86.60\%$), Locked ROC-AUC ($93.37\%$), SHA-256 Hash badge.

---

## 5. Framer Motion Animation Guidelines

To preserve crisp responsiveness, animations are minimal and utilitarian:
- **Panel Expansion / Collapse**: `duration: 0.2s`, `ease: "easeInOut"`.
- **Tab Switching**: Cross-fade transition `opacity: [0, 1]`, `duration: 0.15s`.
- **Modal Overlays**: Backdrop fade + scale spring `initial={{ opacity: 0, scale: 0.95 }}`, `animate={{ opacity: 1, scale: 1 }}`.
- **Strict Prohibition**: No continuous background loops, no bouncy physics, no distracting hover wobbles.
