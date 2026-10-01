# Step 15 — UI/UX Finalization Documentation

**Project Title**: Machine Learning-Based Urban Heat Hotspot Detection Using LST, NDVI and NDBI from Landsat Imagery  
**Study Area**: Mysuru, Karnataka, India  
**Status**: Step 15 Fully Complete & Verified  

---

## 1. Design System & Visual Identity

The interface implements a **Thermal Intelligence / Geo-Analytics** design language tailored for scientific demonstrations:
- **Base Background**: `#0b0f19` (Deep Space Dark)
- **Panel Containers**: `#111827` (Slate 900)
- **Borders & Dividers**: `#1f2937` (Slate 800)
- **UI Accents**: `#06b6d4` / `#0891b2` (Cyan)
- **NDVI Canopy Accent**: `#10b981` (Emerald Green)
- **NDBI Built Accent**: `#a855f7` (Purple)
- **Thermal Accents**: `#f59e0b` (Amber), `#f97316` (Orange), `#ef4444` (Crimson)
- **Typography**: Inter (Interface text), JetBrains Mono (Coordinates, CRS, SHA-256 hash, metrics).

---

## 2. Application Layout & Component Architecture

```
+-------------------------------------------------------------------------------+
| HEADER: THERMAL INTELLIGENCE | MYSURU | MODEL LOCKED | SERVER STATUS ONLINE   |
+-------------------------------------------------------------------------------+
| LAYER CONTROL (Left)  | LEAFLET MAP WORKSPACE (Center) | ANALYTICS PANEL (Right)|
| - Thermal Rasters     | - Dark Carto Basemap           | - Zonal Metrics Cards  |
| - Environmental Ind.  | - EPSG:32643 Tile Overlay      | - Model Info Card      |
| - Spatial Analysis    | - Cursor Hover Readout (°N,°E) | - Persistence Breakdown|
| - Opacity Slider      | - Floating Timeline Control    | - Gi* Cluster Breakdown|
| - AOI Boundary Toggle | - Floating Map Legend          | - Feature Importances  |
+-------------------------------------------------------------------------------+
| TIMELINE SLIDER: 01 Apr | 09 Apr | 17 Apr | 25 Apr | 03 May | 11 May | 19 May | 27 May |
+-------------------------------------------------------------------------------+
```

---

## 3. Map Workspace & Layer Controls

- **Grouped Layer Panel**:
  - **Thermal & ML**: LST (`lst`), RF Probability (`rf_prob`), RF Classification (`rf_class`).
  - **Environmental Indices**: NDVI (`ndvi`), NDBI (`ndbi`).
  - **Spatial & Temporal Analysis**: Multi-Temporal Persistence (`persistence`), Getis-Ord $G_i^*$ Clusters (`gi_star`).
- **Tile Rendering**: Fast, reprojected PNG tiles streamed on-the-fly from FastAPI backend (`/api/v1/tiles/`).
- **Telemetry Readout**: Hover coordinates badge (`font-mono`), active layer indicator, date metadata, and projection badge (`EPSG:32643 UTM 43N`).

---

## 4. Scientific Telemetry & Analytics

- **Domain-Specific Labels**:
  - Zonal LST / NDVI / NDBI: *"Valid LST raster domain"*
  - Hotspot Surface Area: *"Built-up analysis domain"*
  - Persistence Categories: *"Multi-temporal persistence domain"*
  - Gi* Clusters: *"Gi* spatial analysis domain"*
- **Locked ML Model Telemetry**:
  - Algorithm: `RandomForestClassifier (100 Trees)`
  - Status: `MODEL LOCKED`
  - Predictors: `NDVI + NDBI` (LST strictly excluded)
  - Target: `"LST-derived thermal hotspot reference labels"`
  - Metrics: F1-Score $86.60\%$, Accuracy $86.67\%$, ROC-AUC $93.37\%$, Cohen's Kappa $0.7333$, Confusion Matrix `{TN:85, FP:13, FN:13, TP:84}`.
  - SHA-256 Hash: `4cb736e53c66c78dbbcbc1cf7ca3ac965af01f1c7fae829502649b018e127280` with copy button.

---

## 5. Methodology & Governance Modal

Provides a visual flowchart of the 5-stage research pipeline:
`Landsat 8/9 -> Quality Masking -> NDVI / NDBI -> LST ST_B10 -> P20/P80 Target Labels -> RF (NDVI+NDBI) -> Spatial Predictions -> Multi-Temporal Persistence -> Getis-Ord Gi*`

Includes the mandatory scientific disclaimer:
*"Target classes represent LST-derived thermal hotspot reference labels. The machine learning model predicts satellite-derived thermal reference categories from optical surface properties and does not predict ambient air temperatures or official ground heatwave warnings."*

---

## 6. Accessibility & Responsive Design

- Keyboard-navigable controls, semantic buttons, high-contrast text, clear focus rings.
- Tested and responsive across Desktop ($1920\times1080$), Laptop ($1366\times768$), and Compact Viewports ($1024\times768$).
