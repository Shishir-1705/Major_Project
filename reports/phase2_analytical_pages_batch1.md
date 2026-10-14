# Phase 2 — Analytical Pages Batch 1 Implementation Report (Stages 3–5)

**Project**: Machine Learning-Based Urban Heat Hotspot Detection Using LST, NDVI and NDBI from Landsat Imagery  
**Date**: October 14, 2026  
**Baseline Commit**: `47f1443` (`feat: add specialized geospatial analysis pages`)  
**Scope**: Batch 1 Analytical Pages (Stage 3: `/lst`, Stage 4: `/hotspots`, Stage 5: `/indices`)  

---

## 1. Files Created and Modified

### 1.1 Created Files
- `frontend/src/components/controls/MapDisplayControls.tsx`: Reusable map controls component providing a smooth layer opacity slider ($10\% - 100\%$) and Mysuru AOI polygon boundary toggle switch.
- `docs/phase2_analytical_pages_batch1.md`: Technical architecture and functional specification for Batch 1 analytical views.
- `reports/phase2_analytical_pages_batch1.md`: Comprehensive verification report.
- Playwright Verification Screenshots in `reports/screenshots/`:
  - `19_lst_explorer_desktop_1440x900.png`
  - `20_lst_explorer_mobile_390x844.png`
  - `21_hotspots_prob_desktop_1440x900.png`
  - `22_hotspots_class_desktop_1440x900.png`
  - `23_hotspots_mobile_390x844.png`
  - `24_indices_ndvi_desktop_1440x900.png`
  - `25_indices_ndbi_desktop_1440x900.png`
  - `26_indices_mobile_390x844.png`

### 1.2 Modified Files
- `frontend/src/components/map/MapWorkspace.tsx`: Enhanced to accept optional props (`showTimeline`, `showLegend`, `className`, `children`), added window resize listener to `MapResizer` to prevent Leaflet container collapse, and added overlay slot for page-specific buttons.
- `frontend/src/pages/LstPage.tsx`: Implemented dedicated LST Explorer with real Landsat Band 10 raster stream, dynamic Celsius legend ($30-55^\circ\text{C}$), live zonal temperature statistics (Mean, Peak, Min, Std Dev), hotspot coverage metrics, opacity controls, and explicit surface vs air temperature guidance.
- `frontend/src/pages/HotspotsPage.tsx`: Implemented ML Hotspot Analysis view with an interactive selector between continuous probability (`rf_prob`) and binary classification (`rf_class`), live statistical synchronization, Random Forest telemetry card, and pseudo-reference label protocol disclosure.
- `frontend/src/pages/IndicesPage.tsx`: Implemented Environmental Indices view with a toggle between NDVI (Vegetation) and NDBI (Built-Up), dynamic colormaps and legends, spectral index band formulations, Random Forest feature importance weighting ($56.94\%$ NDBI vs $43.06\%$ NDVI), and correlation vs causation caveats.

---

## 2. Reused Architecture & Components

1. **Shared Map Container (`MapWorkspace.tsx`)**: Reused across all three pages with zero code duplication. Every page renders the same high-performance Leaflet container with the authenticated CARTO Voyager light basemap, dynamic GeoTIFF tile streaming, AOI polygon boundary, and coordinate tracking.
2. **Dynamic Legend (`MapLegend.tsx`)**: Automatically switches legends between LST ($^\circ\text{C}$), NDVI (index), NDBI (index), `rf_prob` (continuous probability), and `rf_class` (binary hotspot classes).
3. **Timeline Navigation (`TimelineSlider.tsx`)**: Shared multi-temporal control supporting all 8 Landsat acquisition dates and automated timeline playback.
4. **Display Controls (`MapDisplayControls.tsx`)**: Consistent opacity slider and AOI toggle integrated into each page's analytical sidebar.
5. **Centralized Store (`useAppStore.ts`)**: Manages active layer, selected date, layer opacity, AOI boundary, and live asynchronous statistics caching with toast notifications.

---

## 3. Authoritative API Endpoints Used

| Endpoint | Method | Purpose & Active Consumers |
| :--- | :--- | :--- |
| `/api/v1/health` | `GET` | Live backend connectivity monitoring. |
| `/api/v1/metadata` | `GET` | Study area domain ($132.13\text{ km}^2$), built pixels count ($146,812$), locked model SHA-256. |
| `/api/v1/dates` | `GET` | 8 verified Landsat acquisition dates (2023-04-01 to 2023-05-27). |
| `/api/v1/layers` | `GET` | Raster layer definitions, colormaps, units, and categories. |
| `/api/v1/tiles/{layer}/{date}/{z}/{x}/{y}.png` | `GET` | Dynamic 256×256 Web Mercator PNG tiles rendered from GeoTIFFs (`lst`, `rf_prob`, `rf_class`, `ndvi`, `ndbi`). |
| `/api/v1/statistics/zonal?layer=...&date=...` | `GET` | Real spatial statistics (mean, min, max, std dev, valid pixels, area in km²). |
| `/api/v1/statistics/hotspot?date=...` | `GET` | Hotspot pixel counts, area in km², and hotspot percentage. |
| `/api/v1/model` | `GET` | Random Forest hyperparameters, feature importances, and locked test evaluation metrics. |

---

## 4. Test Verification & Results

### 4.1 Backend Pytest Suite
Command: `python -m pytest backend/tests/test_api.py -v`  
Result: **16/16 PASSED** in 2.63s.  
- Root health check: PASSED
- Metadata, dates, layers, model info endpoints: PASSED
- Valid 256×256 raster tile rendering: PASSED
- NoData tile rendering (empty transparent PNG): PASSED
- Zonal statistics (LST, RF prob, RF class, NDVI, NDBI, Persistence, Gi\*): PASSED
- Hotspot statistics: PASSED

### 4.2 Frontend TypeScript Check
Command: `npx tsc --noEmit` (in `frontend/`)  
Result: **0 ERRORS**. Strict compilation succeeded with unused variable/import checks passed.

### 4.3 Frontend Production Build
Command: `npm run build` (in `frontend/`)  
Result: **BUILD SUCCEEDED** in 3.77s.  
Production assets generated cleanly:
- `dist/index.html` (1.14 kB)
- `dist/assets/index-YxcoD-uX.css` (36.06 kB)
- `dist/assets/index-DnSPAR-L.js` (459.97 kB)

### 4.4 Automated Browser Testing (Playwright)
An automated browser test suite (`scratch/test_batch1_pages_and_screenshots.py`) was executed against the live application:
1. **LST Explorer (`/lst`)**:
   - 20 LST tile requests detected and verified.
   - Temperature legend confirmed displaying `Unit: °C` and $30.0 - 55.0^\circ\text{C}$ range.
   - Zonal Mean LST card verified visible with valid real data.
   - Clicking May 11 observation date triggered 20 new raster tile requests (`/tiles/lst/2023-05-11/`).
   - Desktop and mobile layouts verified.
2. **ML Hotspot Analysis (`/hotspots`)**:
   - Initial load triggered 20 `rf_prob` tile requests with continuous probability legend.
   - Clicking "Classification" tab switched layer to `rf_class`, triggering 20 new binary classification tile requests.
   - Classification legend updated to `Class 1: Hotspot` (red) vs `Class 0: Non-Hotspot` (gray).
   - Hotspot Area and Coverage cards verified with real backend values.
   - Desktop and mobile layouts verified.
3. **Environmental Indices (`/indices`)**:
   - Initial load triggered 20 `ndvi` tile requests with vegetation canopy legend.
   - Clicking "NDBI (Built-up)" tab switched layer to `ndbi`, triggering 20 new built-up tile requests.
   - NDBI legend updated with $-0.40$ to $+0.60$ scale.
   - Zonal mean index cards verified.
   - Desktop and mobile layouts verified.
4. **Console Audit**: **0 critical errors** or unhandled exceptions across all view transitions.

---

## 5. Visual Evidence & Screenshots

All captured screenshots are archived in `reports/screenshots/`:

| Screenshot File | Description | Dimensions |
| :--- | :--- | :--- |
| `19_lst_explorer_desktop_1440x900.png` | LST Explorer desktop view with real Landsat Band 10 raster, dynamic legend, and statistics | 1440 × 900 |
| `20_lst_explorer_mobile_390x844.png` | LST Explorer mobile layout with collapsible analytics drawer | 390 × 844 |
| `21_hotspots_prob_desktop_1440x900.png` | ML Hotspots Probability view with continuous probability gradient raster and cut-off diagnostics | 1440 × 900 |
| `22_hotspots_class_desktop_1440x900.png` | ML Hotspots Binary Classification view showing discrete Class 1 and Class 0 extent | 1440 × 900 |
| `23_hotspots_mobile_390x844.png` | ML Hotspots mobile layout | 390 × 844 |
| `24_indices_ndvi_desktop_1440x900.png` | Environmental Indices NDVI view with vegetation canopy density raster and spectral formula | 1440 × 900 |
| `25_indices_ndbi_desktop_1440x900.png` | Environmental Indices NDBI view with built-up impervious density raster and feature weight | 1440 × 900 |
| `26_indices_mobile_390x844.png` | Environmental Indices mobile layout | 390 × 844 |

---

## 6. Model & Research Integrity Verification

- **Model Path**: `models/random_forest_final_step10_8.joblib`
- **Expected SHA-256**: `4cb736e53c66c78dbbcbc1cf7ca3ac965af01f1c7fae829502649b018e127280`
- **Verified SHA-256**: `4cb736e53c66c78dbbcbc1cf7ca3ac965af01f1c7fae829502649b018e127280`
- **Integrity Status**: **100% UNCHANGED AND VERIFIED**.
- **Data Integrity**: Zero modifications to underlying GeoTIFF rasters, reference datasets, or model weights.
- **Scientific Honesty**:
  - Training labels explicitly identified as *pseudo-reference labels* (derived from P80 LST percentiles), not field ground truth.
  - Thermal hotspots clarified as *radiometric surface thermal hotspots*, not meteorological air temperature events.
  - Correlation between spectral indices (NDVI/NDBI) and LST acknowledged without falsely claiming mechanical causality.

---

## 7. Next Steps (Pending Review)

Batch 1 (Stages 3–5) is complete. Work is paused for user review and approval before proceeding with Batch 2:
- **Stage 6**: Multi-Temporal Heat Persistence (`/persistence`) & Spatial Clustering (`/clusters`)
- **Stage 7**: Model Specifications & Spatial Evaluation (`/model`)
- **Stage 8**: Research Methodology Documentation (`/methodology`)
