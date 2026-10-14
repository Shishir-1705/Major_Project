# Phase 2 — Analytical Pages: Implementation Batch 1 (Stages 3–5)

## 1. Executive Summary

This specification documents the implementation of the first batch of specialized geospatial analysis views in the **Urban Heat Hotspot Detection Platform**:
1. **LST Explorer (`/lst`)**: Radiometric Land Surface Temperature spatial exploration and thermal statistics.
2. **ML Hotspot Analysis (`/hotspots`)**: Random Forest continuous probability gradient (`rf_prob`) and binary classification (`rf_class`) mapping with threshold diagnostics.
3. **Environmental Indices (`/indices`)**: Dual exploration of vegetation density (NDVI) and built-up impervious surfaces (NDBI) with spectral band formulations and ML feature weightings.

Each page adheres to the approved light visual theme, reuses the shared `MapWorkspace` component with the authenticated CARTO Voyager light basemap, connects dynamically to authoritative FastAPI backend rasters and statistics, and maintains strict scientific integrity.

---

## 2. Page Specifications & Analytical Responsibilities

### 2.1 Stage 3 — LST Explorer (`/lst`)
- **Primary Route**: `/lst`
- **Active Layer**: `lst` (Landsat-8/9 Thermal Infrared Sensor Band 10).
- **Core Capabilities**:
  - Displays dynamic 256×256 Web Mercator PNG tiles rendered directly from real GeoTIFF rasters via `/api/v1/tiles/lst/{date}/{z}/{x}/{y}.png`.
  - Full temporal timeline support across 8 verified Landsat acquisition dates (2023-04-01 to 2023-05-27).
  - Dynamic temperature legend mapping continuous values from $30.0^\circ\text{C}$ to $55.0^\circ\text{C}$ with $P_{20}$ ($42.7^\circ\text{C}$) and $P_{80}$ ($47.1^\circ\text{C}$) reference quantiles.
  - Live zonal statistics connected to `/api/v1/statistics/zonal?layer=lst&date=...`:
    - Mean LST ($^\circ\text{C}$)
    - Peak / Maximum LST ($^\circ\text{C}$)
    - Minimum LST ($^\circ\text{C}$)
    - Standard Deviation ($^\circ\text{C}$)
  - Hotspot coverage metrics connected to `/api/v1/statistics/hotspot?date=...`:
    - Hotspot Area ($\text{km}^2$)
    - Hotspot Share / Percentage of built domain ($\%$)
  - Integrated `MapDisplayControls` (layer opacity slider $10\% - 100\%$ and Mysuru AOI polygon boundary toggle).
- **Scientific Honesty & Terminology**:
  - Prominently clarifies the difference between **Land Surface Temperature (LST)** (radiometric surface skin temperature measured at satellite overpass ~10:45 AM) and ambient 2 m air temperature recorded by meteorological stations.
  - Explains the Split-Window / Single-Channel atmospheric correction and fractional vegetation cover (FVC) surface emissivity derivation.

### 2.2 Stage 4 — ML Hotspot Analysis (`/hotspots`)
- **Primary Route**: `/hotspots`
- **Supported Layers**:
  - `rf_prob`: Continuous Random Forest prediction probability gradient ($0.00$ to $1.00$).
  - `rf_class`: Discrete binary hotspot classification ($1 = \text{Hotspot}$, $0 = \text{Non-Hotspot}$).
- **Core Capabilities**:
  - Segmented control pills allowing instantaneous switching between Probability and Classification views without reloading the map or losing spatial context.
  - Dynamically updates raster tile stream: `/api/v1/tiles/rf_prob/...` vs `/api/v1/tiles/rf_class/...`.
  - Automatically switches legend representation:
    - *Probability Mode*: Continuous gray $\to$ red gradient with decision threshold marker at $0.50$.
    - *Classification Mode*: Discrete classes (Class 1 Hotspot red vs Class 0 Non-Hotspot gray).
  - Dynamic statistical cards tailored to the active mode:
    - *Probability Mode*: Zonal Mean Probability, Max Probability, Min Probability, and Decision Cut-off ($\ge 0.500$).
    - *Classification Mode*: Hotspot Area ($\text{km}^2$), Hotspot Coverage ($\%$, typically $25-27\%$), Non-Hotspot Area ($\text{km}^2$), and Total Built Domain ($132.13\text{km}^2$).
  - Telemetry card reflecting the locked Random Forest model ($100$ estimators, max depth $12$, independent test F1-score $86.60\%$, precision $88.89\%$, recall $84.42\%$).
- **Scientific Integrity Protocol**:
  - Emphasizes that training labels are *pseudo-reference labels* derived from thermal distribution percentiles ($y=1$ if $\text{LST} \ge P_{80}$), not ground-truth field measurements.
  - Clarifies that continuous probabilities enable planners to identify transitional boundary zones ($0.40 - 0.50$) prior to acute thermal intensification.

### 2.3 Stage 5 — Environmental Indices (`/indices`)
- **Primary Route**: `/indices`
- **Supported Layers**:
  - `ndvi`: Normalized Difference Vegetation Index (Landsat OLI NIR and Red bands).
  - `ndbi`: Normalized Difference Built-up Index (Landsat OLI SWIR$_1$ and NIR bands).
- **Core Capabilities**:
  - Segmented control pills allowing toggling between NDVI (Vegetation Canopy) and NDBI (Built-up Pavements).
  - Dynamically loads real GeoTIFF tiles: `/api/v1/tiles/ndvi/...` vs `/api/v1/tiles/ndbi/...`.
  - Dynamic colormap legends:
    - *NDVI*: $-0.20$ (non-vegetated/water) to $+0.80$ (dense vegetative canopy) using an amber-emerald palette.
    - *NDBI*: $-0.40$ (pervious/vegetated) to $+0.60$ (impervious/paved) using a slate-amber palette.
  - Zonal index distribution statistics from `/api/v1/statistics/zonal`:
    - Mean Index (e.g. Mean NDVI $+0.268$, Mean NDBI $+0.042$)
    - Peak / Maximum Index
    - Minimum Index
    - Standard Deviation
  - Spectral band formulation cards explaining physical electromagnetic interactions:
    $$\text{NDVI} = \frac{\text{NIR (B5)} - \text{Red (B4)}}{\text{NIR (B5)} + \text{Red (B4)}}$$
    $$\text{NDBI} = \frac{\text{SWIR}_1\text{ (B6)} - \text{NIR (B5)}}{\text{SWIR}_1\text{ (B6)} + \text{NIR (B5)}}$$
  - Random Forest feature importance weighting visualization:
    - NDBI (Built-up factor): $56.94\%$ importance.
    - NDVI (Vegetation factor): $43.06\%$ importance.
- **Scientific Caveat Notice**:
  - *"Correlation vs Causation"*: Explicitly warns that while high NDBI and low NDVI correlate strongly with elevated surface temperatures, neither index alone proves the mechanical cause of an urban heat hotspot.

---

## 3. Component Architecture & Reusability

```
frontend/src/
├── components/
│   ├── controls/
│   │   ├── MapDisplayControls.tsx   # Reusable Opacity Slider + AOI Boundary Switch
│   │   └── TimelineSlider.tsx       # Multi-temporal date navigation & auto-playback
│   ├── map/
│   │   ├── MapWorkspace.tsx         # Unified Leaflet workspace (CARTO basemap + dynamic raster)
│   │   └── MapLegend.tsx            # Dynamic legend renderer for all 7 layer types
│   ├── common/
│   │   ├── StatCard.tsx             # Reusable stat card with loading skeletons & offline status
│   │   ├── ErrorBoundary.tsx        # React class error boundary
│   │   └── ToastContainer.tsx       # Notification alerts
│   └── layout/
│       ├── AppLayout.tsx            # Root shell layout with Header and Outlet
│       └── Header.tsx               # Fixed navigation bar with mobile drawer
└── pages/
    ├── LstPage.tsx                  # Stage 3: LST Explorer
    ├── HotspotsPage.tsx             # Stage 4: ML Hotspot Analysis
    └── IndicesPage.tsx              # Stage 5: Environmental Indices
```

---

## 4. Security, Credentials & Model Verification

1. **CARTO API Key Security**:
   - Stored strictly in `frontend/.env` (excluded by `.gitignore`).
   - Injected at runtime via `import.meta.env.VITE_CARTO_API_KEY`.
   - Never hardcoded in source files or tracked in Git commits.
2. **Locked Model Integrity**:
   - Model Path: `models/random_forest_final_step10_8.joblib`
   - Verified SHA-256 Checksum: `4cb736e53c66c78dbbcbc1cf7ca3ac965af01f1c7fae829502649b018e127280`.
3. **NoData Pixel Handling**:
   - Unbuilt rural and water pixels outside the defined 2023 Mysuru ULB mask are assigned $-9999$ and rendered 100% transparently, preventing artificial distortion of urban statistics.
