# System Architecture Specification

**Project Title**: Machine Learning-Based Urban Heat Hotspot Detection Using LST, NDVI and NDBI from Landsat Imagery  
**Study Area**: Mysuru, Karnataka, India ($76.50^\circ\text{E} - 76.75^\circ\text{E}, 12.15^\circ\text{N} - 12.40^\circ\text{N}$, EPSG:32643 UTM Zone 43N)  
**Document Version**: 1.0.0  
**Phase**: System Architecture & Application Design (Step 11)  

---

## 1. System Overview & Purpose

The **Urban Heat Hotspot Intelligence Platform** is a full-stack, research-grade geospatial analytics web application designed to visualize, analyze, and communicate urban thermal patterns and machine learning-based hotspot predictions for Mysuru, India.

The platform decouples computationally intensive satellite processing (Google Earth Engine) and machine learning model training (scikit-learn) from web application runtime, serving pre-computed, peer-reviewed research data products via a high-performance REST API and an interactive React web dashboard.

```
+-----------------------------------------------------------------------------------+
|                            GOOGLE EARTH ENGINE (GEE)                              |
|          Landsat 8/9 Collection 2 L2  |  Dynamic World Land Cover 10m              |
+-----------------------------------------------------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                        RESEARCH DATA PRODUCTS & ML ENGINE                         |
|   Step 9-10 Rasters (LST, NDVI, NDBI) | Locked Random Forest Model (step10_8.joblib) |
+-----------------------------------------------------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                           BACKEND DATA ACCESS LAYER                               |
|          Python FastAPI | Rasterio Tile Server | Zonal Stats & Metadata Cache     |
+-----------------------------------------------------------------------------------+
                                          |
                                          v
+-----------------------------------------------------------------------------------+
|                        FRONTEND INTERACTIVE DASHBOARD                             |
|          React + TypeScript | Leaflet Map Engine | Tailwind CSS + Framer Motion   |
+-----------------------------------------------------------------------------------+
```

---

## 2. 6-Layer Architecture Stack

The system is structured into six strictly decoupled architectural layers:

### Layer 1 — Data Sources & Satellite Ingestion
- **Primary Imagery**: Landsat 8 & 9 Operational Land Imager (OLI) and Thermal Infrared Sensor (TIRS) Collection 2 Level-2 Surface Reflectance (SR_B4, SR_B5, SR_B6) and Surface Temperature (ST_B10) across 8 temporal acquisitions (April 1, 2023 – May 27, 2023).
- **Land Cover Reference**: Dynamic World 10m Near-Real-Time Land Cover for 30m built-up masking (`data/step9/built_mask_30m.tif`).

### Layer 2 — Geospatial Processing & Index Computation
- **Cloud Masking & Scaling**: QA_PIXEL cloud/shadow removal and scale factor application ($ST\_B10 \times 0.00341802 + 149.0 - 273.15$ for LST in °C).
- **Spectral Index Calculation**:
  $$\text{NDVI} = \frac{\text{SR\_B5} - \text{SR\_B4}}{\text{SR\_B5} + \text{SR\_B4}}, \quad \text{NDBI} = \frac{\text{SR\_B6} - \text{SR\_B5}}{\text{SR\_B6} + \text{SR\_B5}}$$
- **Reference Label Engineering**: Step 6 date-specific P20/P80 LST percentile thresholds ($1 = \text{Hotspot}$, $0 = \text{Non-Hotspot}$).

### Layer 3 — Locked Machine Learning Engine
- **Model Artifact**: [`models/random_forest_final_step10_8.joblib`](file:///d:/Major_Project/models/random_forest_final_step10_8.joblib)
- **Model Integrity Hash**: `4cb736e53c66c78dbbcbc1cf7ca3ac965af01f1c7fae829502649b018e127280`
- **Predictors**: `['NDVI', 'NDBI']` ONLY (Thermal LST strictly excluded from predictors).
- **Target**: LST-derived thermal hotspot reference labels.
- **Locked Performance**: Accuracy $86.67\%$, F1-Score $86.60\%$, ROC-AUC $93.37\%$, PR-AUC $93.67\%$, Brier Score $0.1059$.

### Layer 4 — Persisted Research Data Products
- **Raster Products**: GeoTIFF rasters for 8 dates under `data/step10/` ($30\text{m}$ resolution) including `lst_30m_*.tif`, `ndvi_30m_*.tif`, `ndbi_30m_*.tif`, `rf_prob_30m_*.tif`, `rf_class_30m_*.tif`.
- **Spatial Cluster Rasters**: Getis-Ord $\text{G}_i^*$ spatial statistic rasters (`gi_star_statistic_30m.tif`, `gi_star_clustering_30m.tif`).
- **Persistence Rasters**: Multi-temporal continuous persistence (`continuous_persistence_30m.tif`) and 4-level categorical persistence (`categorical_persistence_30m.tif`).
- **Summary Metrics**: Persisted CSV datasets in `results/step10/` and `results/step10_9/`.

### Layer 5 — Backend Data Access Layer (FastAPI)
- **Framework**: FastAPI (Python 3.12) running on Uvicorn.
- **Responsibility**: Serving metadata JSON, exposing available observation dates, dynamically generating PNG raster tiles from GeoTIFFs using `Rasterio` and `matplotlib` colormaps, calculating zonal statistics, and serving model evaluation records.
- **Immutability**: Read-only access to `models/` and `data/` directories.

### Layer 6 — Frontend Interactive Dashboard (React)
- **Framework**: React 18 + TypeScript + Vite.
- **Styling & Components**: Tailwind CSS + Radix UI + Framer Motion.
- **Mapping Library**: Leaflet / React-Leaflet for raster overlay rendering, AOI boundary display, and map navigation.
- **Visualization**: Recharts for metric breakdowns, feature importances, and temporal trends.

---

## 3. Integration of the Locked ML Component

The locked Random Forest model (`models/random_forest_final_step10_8.joblib`) is integrated as a **read-only prediction artifact**:

1. **No Runtime Re-Fitting**: The web backend loads the joblib model weights at startup for diagnostic queries or raster inference verification.
2. **Pre-Rendered Spatial Inference**: To guarantee sub-second map loading performance, full-domain spatial inference for all 8 temporal acquisitions is pre-computed and stored as GeoTIFF rasters (`rf_prob_30m_*.tif` and `rf_class_30m_*.tif`).
3. **Model Metadata Exposure**: The backend exposes model configuration, hyperparameters, feature importances, and independent test evaluation results directly from `models/random_forest_final_step10_8_metadata.json` and `results/step10_9/final_locked_evaluation_metrics.csv`.

---

## 4. Non-Functional Requirements

- **Sub-Second Map Tile Delivery**: Raster map tiles rendered and cached with response latency $< 150\text{ ms}$.
- **Zero Client-Side Heavy Processing**: All geospatial projections, clipping, and tile rendering handled server-side.
- **Security & Model Protection**: Model files, training CSVs, and metadata files set to read-only permissions.
- **Responsive Workspace**: Optimized for desktop and laptop displays ($\ge 1280\times 720\text{ px}$).
