# Architecture Decision Records (ADRs)

**Project Title**: Machine Learning-Based Urban Heat Hotspot Detection Using LST, NDVI and NDBI from Landsat Imagery  
**Study Area**: Mysuru, Karnataka, India  
**Document Version**: 1.0.0  
**Phase**: System Architecture & Application Design (Step 11)  

---

## ADR-001: Decoupling Web Application from Heavy Earth Engine Processing Pipeline

### Context
The research pipeline involves acquiring multi-temporal Landsat 8/9 imagery from Google Earth Engine, executing cloud masking, computing spectral indices (NDVI, NDBI), deriving LST, generating P20/P80 reference labels, and performing spatial cluster analysis ($\text{G}_i^*$). Re-executing this pipeline on every web application page load would cause unacceptable response latencies ($> 30\text{ seconds}$) and require GEE API authentication credentials on client devices.

### Decision
Decouple offline satellite processing from web application runtime. Treat all Step 9 and Step 10 outputs (GeoTIFF rasters, CSV summary tables, locked model joblib artifacts) as **persisted research data products** stored in the repository (`data/`, `results/`, `models/`). The web backend serves these pre-computed products directly via cached API endpoints.

### Consequences
- **Positive**: Sub-second web dashboard response times ($< 150\text{ ms}$), zero GEE authentication key exposure, complete reproducibility, zero client-side processing bottlenecks.
- **Negative**: Web application visualizes the 8 established study dates (April 1 – May 27, 2023) and does not fetch dynamic real-time satellite imagery on-the-fly.

---

## ADR-002: Read-Only Model Serving & Integrity Protection for Locked Random Forest Model

### Context
Step 10.10 formally locked the final project Random Forest model (`models/random_forest_final_step10_8.joblib`, SHA-256: `4cb736e53c66c78dbbcbc1cf7ca3ac965af01f1c7fae829502649b018e127280`). The model achieved a locked spatial test F1-Score of $86.60\%$ and ROC-AUC of $93.37\%$. To prevent accidental retraining, hyperparameter drift, or unauthorized modification during web application interaction, strict model protection is required.

### Decision
The web backend treats `models/random_forest_final_step10_8.joblib` and `models/random_forest_final_step10_8_metadata.json` as **read-only artifacts**. The application provides zero endpoints for model fitting, hyperparameter tuning, or threshold modification. Spatial inference rasters (`rf_prob_30m_*.tif`, `rf_class_30m_*.tif`) are served pre-computed.

### Consequences
- **Positive**: Guarantees $100\%$ scientific reproducibility, prevents test set leakage or model tampering, locks established research benchmarks.
- **Negative**: Users cannot upload custom user-provided feature rasters to re-fit the Random Forest model through the web dashboard UI.

---

## ADR-003: Server-Side Dynamic Tile Rendering Strategy for GeoTIFF Satellite Rasters

### Context
Satellite GeoTIFF rasters ($30\text{m}$ resolution) contain floating-point LST, NDVI, NDBI, and probability values. Browsers cannot natively display 32-bit floating-point GeoTIFFs directly in standard `<img>` or Leaflet `<TileLayer>` components without converting them to 8-bit RGBA images or downloading multi-megabyte GeoTIFF arrays over the network.

### Decision
Implement a server-side dynamic tile controller in the FastAPI backend using `Rasterio` and `Matplotlib`. The backend intercepts Web Mercator tile requests (`/api/v1/tiles/{layer}/{date}/{z}/{x}/{y}.png`), extracts the corresponding spatial window from the 32-bit GeoTIFF, applies the standardized color palette (e.g., Plasma for LST, YlGn for NDVI, Reds for RF Probability), renders a 256x256 transparent PNG tile, and caches it in `.tile_cache/`.

### Consequences
- **Positive**: Instant browser map rendering, minimal client RAM usage, precise scientific colormaps, full support across desktop and mobile devices.
- **Negative**: Requires disk storage for cached 256x256 PNG tiles on the backend server.

---

## ADR-004: Dark-Mode "Thermal Intelligence" Design System & Restricted Thermal Palette

### Context
Geospatial dashboards displaying satellite thermal maps require high contrast so that thermal gradients (cool green/yellow to intense orange/red) stand out clearly. Using red/orange as general UI button colors creates visual confusion between interactive UI controls and high-temperature thermal hotspots.

### Decision
Establish a strict **"Thermal Intelligence / Geo-Analytics"** dark design system:
1. Canvas background: Deep Charcoal / Navy (`#0b0f19`).
2. Panels & Surfaces: Dark Charcoal (`#111827`, border `#1f2937`).
3. UI Controls & Selection: Neutral Cyan / Teal (`#06b6d4` / `#0891b2`).
4. Thermal Palette (Amber/Orange/Red): **Strictly reserved** for actual LST temperature values and hotspot classification intensity.

### Consequences
- **Positive**: Eliminates visual ambiguity, highlights satellite thermal rasters as the centerpiece, provides a modern scientific tool aesthetic.
- **Negative**: Limits primary button color choices to cyan/teal tones.

---

## ADR-005: Full-Stack Technology Stack Selection (FastAPI + React/TypeScript)

### Context
Choosing the technology stack for the web application requires balancing development speed, maintainability, geospatial processing support, and frontend interactivity.

### Decision
Adopt **FastAPI (Python 3.12)** for the backend and **React 18 + TypeScript + Vite + Tailwind CSS + Leaflet** for the frontend.

### Consequences
- **Positive**: Reuses existing Python environment (`rasterio`, `joblib`, `pandas`), provides native async tile rendering, ensures type safety with TypeScript, and offers seamless map integration with Leaflet.
- **Negative**: Requires running two lightweight service processes (FastAPI backend on port 8000, Vite dev server on port 5173 during development).
