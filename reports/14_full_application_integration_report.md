# Step 14 — Full Application Integration Report

**Project Title**: Machine Learning-Based Urban Heat Hotspot Detection Using LST, NDVI and NDBI from Landsat Imagery  
**Study Area**: Mysuru, Karnataka, India  
**Date**: September 12, 2026  
**Status**: Step 14 Fully Complete and Verified  

---

## 1. Executive Summary

Step 14 marks the complete integration of the **React 18 + TypeScript + Leaflet** frontend web application with the **Python FastAPI** backend REST API. The system provides interactive spatial visualization, multi-temporal analytics, zonal statistics, Getis-Ord $G_i^*$ spatial cluster breakdown, and model evaluation telemetry powered exclusively by **verified Earth Engine Landsat observations** and the **locked Random Forest machine learning model**.

---

## 2. Integration Architecture & Endpoint Mapping

```
                                    +------------------------------+
                                    |  React 18 + TypeScript Web   |
                                    |  (Leaflet + Tailwind + Vite) |
                                    +--------------+---------------+
                                                   |
                                     HTTP / REST   |   JSON & Tile Stream
                                                   v
                                    +------------------------------+
                                    |     FastAPI Backend (v1)     |
                                    +--------------+---------------+
                                                   |
        +------------------------------------------+------------------------------------------+
        |                                          |                                          |
        v                                          v                                          v
+---------------+                          +---------------+                          +---------------+
| GeoTIFF Raster |                          |  Locked Model |                          |  Spatial ROI  |
|  Tile Engine  |                          |  (SHA-256)    |                          |  Zonal Engine |
+---------------+                          +---------------+                          +---------------+
```

### Complete API Endpoint Mapping

| API Endpoint | HTTP Method | React Component Consumer | Data Payload | Verified Output / Value |
| :--- | :--- | :--- | :--- | :--- |
| `/api/v1/metadata` | `GET` | `useAppStore.ts` | `StudyAreaMetadata` | Extent: $[76.536^\circ\text{E}, 12.217^\circ\text{N}, 76.732^\circ\text{E}, 12.399^\circ\text{N}]$, Built area: $132.129\text{ km}^2$ |
| `/api/v1/dates` | `GET` | `TimelineSlider.tsx` | `AvailableDatesResponse` | 8 dates: `2023-04-01` to `2023-05-27` |
| `/api/v1/layers` | `GET` | `MapWorkspace.tsx`, `Header.tsx` | `LayerInfo[]` | 8 layers: `lst`, `ndvi`, `ndbi`, `rf_prob`, `rf_class`, `hotspot`, `persistence`, `gi_star` |
| `/api/v1/model` | `GET` | `ModelInfoCard.tsx`, `MethodologyModal.tsx` | `ModelInfo` | Locked RF (`n_estimators=100`, `max_depth=5`), SHA-256 `4cb736...127280`, Test Accuracy $86.67\%$ |
| `/api/v1/statistics/zonal` | `GET` | `AnalyticsPanel.tsx` | `ZonalStatistics` | LST Mean: $44.07^\circ\text{C}$, NDVI Mean: $0.2186$, NDBI Mean: $0.0531$ (2023-04-01) |
| `/api/v1/statistics/hotspot` | `GET` | `AnalyticsPanel.tsx` | `HotspotStatistics` | Hotspot Area: $42.15\text{ km}^2$ ($30.09\%$ of built area) (2023-04-01) |
| `/api/v1/statistics/persistence` | `GET` | `AnalyticsPanel.tsx` | `PersistenceStatistics` | Multi-temporal persistence domain: $93.657\text{ km}^2$, Moderate persistence: $37.581\text{ km}^2$ ($40.13\%$) |
| `/api/v1/statistics/gi-star` | `GET` | `AnalyticsPanel.tsx` | `GiStarStatistics` | $G_i^*$ Hotspot $99\%$ confidence: $8.856\text{ km}^2$ ($9.46\%$ of persistence domain) |
| `/api/v1/tiles/{layer}/{date_or_key}/{z}/{x}/{y}.png` | `GET` | `MapWorkspace.tsx` | `image/png` | Dynamic XYZ 256x256 tiles reprojected on-the-fly from EPSG:32643 to EPSG:3857 |

---

## 3. Test & Verification Results

### 3.1 Backend Test Suite Execution (`pytest backend/tests/test_api.py`)
- `test_root`: **PASSED**
- `test_health`: **PASSED**
- `test_get_metadata`: **PASSED**
- `test_get_available_dates`: **PASSED**
- `test_get_available_layers`: **PASSED**
- `test_get_model_info`: **PASSED**
- `test_get_zonal_statistics_valid_date`: **PASSED**
- `test_get_zonal_statistics_invalid_date`: **PASSED**
- `test_get_hotspot_statistics`: **PASSED**
- `test_get_persistence_statistics`: **PASSED**
- `test_get_gi_star_statistics`: **PASSED**
- `test_get_tile_valid`: **PASSED**
- `test_get_tile_invalid_layer`: **PASSED**

**Result**: 13 / 13 PASSED (100% Success Rate)

### 3.2 Frontend TypeScript Typecheck (`npx tsc --noEmit`)
- Executed from `frontend/` directory.
- Found **0 errors**.

### 3.3 Frontend Production Build (`npm run build`)
- Executed Vite production bundle pipeline.
- Output artifacts generated successfully in `frontend/dist/`.
- Found **0 errors**.

---

## 4. Scientific Data Integrity Verification Statement

1. **Zero Mock or Synthetic Data**: All statistics, pixel calculations, map tile images, and spatial distributions rendered in the frontend are calculated dynamically or read directly from real Earth Engine GeoTIFF rasters stored in `data/step10/real/`, `data/step9/`, `data/step10/persistence/`, and `data/step10/gi_star/`.
2. **Locked Machine Learning Model**: Model loading verifies SHA-256 hash `4cb736e53c66c78dbbcbc1cf7ca3ac965af01f1c7fae829502649b018e127280`. The model configuration (`n_estimators=100`, `max_depth=5`, `min_samples_split=10`, `min_samples_leaf=5`, `max_features='sqrt'`) remains read-only and locked.
3. **Predictor & Target Decoupling**: Predictors strictly remain `NDVI + NDBI`. LST is entirely excluded from model features and is used solely for target label generation and validation.
4. **Spatial Domain Integrity**: All calculations are masked to the authoritative Step 9 built-up mask ($132.129\text{ km}^2$, $146,810$ pixels at $30\text{m}$ resolution).

---

## 5. Verification Checklist

- [x] **Point 1**: Typed API client implemented (`frontend/src/services/api.ts`).
- [x] **Point 2**: Global Zustand store updated (`frontend/src/store/useAppStore.ts`).
- [x] **Point 3**: Leaflet map workspace connected to dynamic `/tiles/` API.
- [x] **Point 4**: Analytics panel connected to `/statistics/` APIs.
- [x] **Point 5**: Locked RF model card rendering verified metrics.
- [x] **Point 6**: Time slider synchronizing all 8 observation dates.
- [x] **Point 7**: Backend test suite passing 13/13 tests.
- [x] **Point 8**: Frontend type check passing with 0 errors.
- [x] **Point 9**: Frontend production build passing with 0 errors.
- [x] **Point 10**: Scientific data integrity verified with zero mock/synthetic data.
