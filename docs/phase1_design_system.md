# Phase 1: Design System & Shared Application Shell

**Project:** Machine Learning-Based Urban Heat Hotspot Detection Using LST, NDVI and NDBI from Landsat Imagery  
**Study Area:** Mysuru, Karnataka, India  
**CRS:** EPSG:32643 (UTM Zone 43N)  
**Date:** October 2026  

---

## 1. Executive Summary

Phase 1 establishes a modern, premium design system and shared application shell for the geospatial intelligence platform. The previous congested, pitch-black interface has been replaced with a clean, light, professional aesthetic inspired by modern scientific and SaaS intelligence tools.

The redesign preserves all scientific artifacts, raster layers, analytical calculations, and the locked Random Forest model (SHA-256: `4cb736e53c66c78dbbcbc1cf7ca3ac965af01f1c7fae829502649b018e127280`).

---

## 2. Design System Tokens & Hierarchy

### 2.1 Color Palette

| Token | Hex Value | Semantic Role |
| :--- | :--- | :--- |
| **Background** | `#f8fafc` | Main application canvas and app-level background |
| **Surface** | `#ffffff` | Primary component containers, sidebars, modals, floating panels |
| **Surface Subdued** | `#f1f5f9` | Inactive controls, secondary containers, card headers |
| **Primary Accent (Teal)**| `#0d9488` | Active layer indicators, focus states, brand accents |
| **Secondary Accent (Sky)**| `#0284c7` | Secondary spatial tools, cluster highlights |
| **Text Primary** | `#0f172a` | Headers, primary metrics, prominent text |
| **Text Secondary** | `#475569` | Subtitles, labels, metadata captions |
| **Border Subtle** | `#e2e8f0` | Card borders, dividing lines, subtle dividers |

### 2.2 Elevation & Shadow Hierarchy

- **Subtle Card (`shadow-xs` / `shadow-card`):** `0 1px 3px 0 rgb(0 0 0 / 0.05), 0 1px 2px -1px rgb(0 0 0 / 0.05)`
- **Hover Card (`shadow-card-hover`):** `0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.05)`
- **Floating Overlays (`shadow-floating`):** `0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.04)`

### 2.3 Typography Scale

- **App Brand Title:** 14px font-bold tracking-tight text-slate-900
- **Section Headers:** 11px font-bold uppercase tracking-wider text-slate-700
- **Card Metrics:** 20px font-bold font-mono tracking-tight text-slate-900
- **Body & Legends:** 11px–12px text-slate-600
- **Coordinate & CRS Telemetry:** 11px font-mono text-slate-800

---

## 3. Application Shell Components

### 3.1 Global Header (`frontend/src/components/layout/Header.tsx`)
- **Branding:** Teal flame emblem with locked model governance pill and geographic coordinates tag.
- **Navigation Tabs:** Overview, LST Map, ML Hotspots, NDVI / NDBI, Persistence, Gi* Clusters, Methodology.
- **Subview Toggle Pills:** Embedded subview pills for `ML Hotspots` (`Prob` vs `Class`) and `NDVI / NDBI` (`NDVI` vs `NDBI`).
- **Telemetry & Status:** Real-time FastAPI server status (`ONLINE` in emerald / `OFFLINE` in amber).
- **Responsive Controls:** Quick-toggle buttons for left layer control sidebar and right analytics drawer.

### 3.2 Layer Control Sidebar (`frontend/src/components/controls/LayerControl.tsx`)
- **Layer Categories:**
  1. *Thermal & ML Hotspots*: LST Map, ML Hotspot Prob, ML Hotspot Class.
  2. *Environmental Spectral Indices*: NDVI Vegetation, NDBI Built-up.
  3. *Spatial & Temporal Analysis*: Heat Persistence, Gi* Clusters.
- **Controls:** Smooth opacity slider (10% to 100%) and Mysuru AOI boundary polygon toggle.
- **Responsive Behavior:** Docks side-by-side on desktop (`lg:`); acts as an overlay drawer on tablet and mobile viewports (`absolute inset-y-0 left-0 z-30`).

### 3.3 Interactive Map Workspace (`frontend/src/components/map/MapWorkspace.tsx`)
- **Basemap:** Authenticated CARTO Dark Matter basemap (`dark_all`) providing high visual contrast for thermal and spectral rasters without watermarks.
- **FastAPI Tile Stream:** 256×256 PNG tiles dynamically generated from GeoTIFF rasters via Web Mercator tile endpoint.
- **Leaflet Auto-Resizer:** Dynamically invalidates map canvas dimensions (`map.invalidateSize()`) upon sidebar or analytics drawer expansion/collapse, guaranteeing edge-to-edge rendering without gray areas.
- **Floating Telemetry:** Top-left cursor coordinates (latitude/longitude in EPSG:4326 and CRS UTM 43N) and top-right live tile stream banner.

### 3.4 Floating Timeline Slider (`frontend/src/components/controls/TimelineSlider.tsx`)
- **Layout:** Translucent floating glass card centered at bottom of viewport.
- **Temporal Nodes:** 8 discrete observation dates (2023-04-01 to 2023-05-27) spanning Landsat 8 and Landsat 9 acquisitions.
- **Playback Controls:** Play/Pause auto-progression (2s interval), step back, step forward, and direct date click.

### 3.5 Dynamic Legend (`frontend/src/components/map/MapLegend.tsx`)
- **Dynamic Render:** Automatically presents relevant continuous colorbars or categorical keys based on active layer.
- **Units & Reference Marks:** LST (°C with P20/P80 percentiles), NDVI canopy range, NDBI built-up range, RF probability (0.00 to 1.00), binary classification, 5-tier persistence recurrence, and Gi* cluster confidence levels (90%, 95%, 99%).

### 3.6 Spatial Analytics & Governance Drawer (`frontend/src/components/analytics/AnalyticsPanel.tsx`)
- **Active Context Banner:** Observation date, sensor identity, and active raster designation.
- **Zonal Statistics Grid:** Built area (132.13 km²), Zonal Mean with dynamic units, Hotspot Area, and Locked ML F1-score (86.60%).
- **Conditional Analytics:** Multi-temporal persistence breakdown and Gi* spatial autocorrelation cluster breakdown.
- **Locked Model Specifications:** Algorithm details, predictors (`NDVI + NDBI`), target label designation, locked confusion matrix, and one-click SHA-256 hash copy button.
- **Gini Feature Attribution:** Visual progress bars for NDBI (61.03%) and NDVI (38.97%).

### 3.7 Research Methodology Modal (`frontend/src/components/modals/MethodologyModal.tsx`)
- **Visual Pipeline:** 5-step scientific flowchart from Landsat 8/9 imagery to spatial clustering.
- **Formulas:** NDVI and NDBI definitions.
- **Spatial Validation:** 100% held-out test block metrics (Accuracy 86.67%, F1 86.60%, ROC-AUC 93.37%, Kappa 0.7333).
- **Governance Notice:** Clarifies that target classes are satellite-derived thermal reference labels rather than official ambient weather heatwave alerts.

---

## 4. Verification & Validation Summary

1. **TypeScript Compilation:** 0 errors (`tsc --noEmit`).
2. **Production Build:** Succeeded in 4.63s (`vite build`).
3. **Backend Tests:** 16/16 passed (`pytest backend/tests/test_api.py -v`).
4. **Model SHA-256 Integrity:** `4cb736e53c66c78dbbcbc1cf7ca3ac965af01f1c7fae829502649b018e127280` (verified matching locked checksum).
5. **Basemap Integration:** CARTO dark basemap rendered cleanly without "API KEY REQUIRED" watermark.
6. **Multi-device Testing:** Verified and captured across 1440×900, 1280×800, 768×1024, and 390×844.
