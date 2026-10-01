# Step 13 — Backend Foundation & Real Data Integration Report

**Project Title**: Machine Learning-Based Urban Heat Hotspot Detection Using LST, NDVI and NDBI from Landsat Imagery  
**Study Area**: Mysuru, Karnataka, India  
**Step**: Step 13 — Backend Foundation & Real Data Integration  
**Backend Technology**: FastAPI (Python 3.12 + Uvicorn + Rasterio + PyProj + Pydantic v2)  
**Test Suite Status**: **13 / 13 PASSED (100% SUCCESS)**  
**Locked Model SHA-256**: `4cb736e53c66c78dbbcbc1cf7ca3ac965af01f1c7fae829502649b018e127280`  

---

## 1. Executive Summary

This report documents the successful implementation and verification of the **FastAPI Backend Data-Access Foundation**. The backend service provides a high-performance REST API and dynamic GeoTIFF map tile server that exposes real satellite research rasters (LST, NDVI, NDBI), locked Random Forest predictions, multi-temporal persistence categories, Getis-Ord $\text{G}_i^*$ spatial clusters, zonal statistics, and locked model evaluation records.

---

## 2. Implemented Backend Architecture

The backend code was authored under `backend/app/` with clean separation of concerns:

- **`backend/app/main.py`**: FastAPI application entry point, CORS middleware configuration (`http://localhost:5173`), and route registration.
- **`backend/app/config.py`**: Directory paths, verified observation dates list, layer mapping, and `.tile_cache/` configuration.
- **`backend/app/api/routes.py`**: REST controllers implementing all 9 required endpoints (`/api/v1/metadata`, `/api/v1/dates`, `/api/v1/layers`, `/api/v1/model`, `/api/v1/tiles/...`, `/api/v1/statistics/...`).
- **`backend/app/services/raster_service.py`**: Dynamic Web Mercator PNG tile renderer using `Rasterio` windowed extraction, `PyProj` coordinate reprojector (EPSG:3857 $\rightarrow$ EPSG:32643), scientific colormappings (`YlOrRd`, `YlGn`, `YlOrBr`, `Reds`, `Crimson`, `Amber-Red`), NoData transparency masking, and local LRU disk caching.
- **`backend/app/services/statistics_service.py`**: Zonal statistics calculator (min, max, mean, std, valid pixels, NoData pixels, area in $\text{km}^2$), hotspot classification statistics, multi-temporal persistence category parser, and Getis-Ord $\text{G}_i^*$ cluster parser.
- **`backend/app/services/metadata_service.py`**: Model provenance, metadata, and evaluation metrics provider.
- **`backend/app/schemas/responses.py`**: Strongly-typed Pydantic v2 response schemas.
- **`backend/app/utils/crs.py`**: Web Mercator tile coordinate to EPSG:32643 UTM Zone 43N bounding box transformer.

---

## 3. Verified Endpoints & Test Results

The backend test suite (`backend/tests/test_api.py`) was executed using `pytest` and achieved **100% pass rate** across all 13 tests:

| Test ID & Endpoint | Expected Result | Actual Result | Status |
| :--- | :--- | :--- | :---: |
| **`test_1_root_health_check`** | `200 OK` status="online" | `200 OK` status="online" | **PASS** |
| **`test_2_metadata_endpoint`** | `200 OK` SHA-256 match | `200 OK` SHA-256 `4cb736e53c66c78d...` | **PASS** |
| **`test_3_layers_endpoint`** | `200 OK` 7 layers list | `200 OK` 7 layers returned | **PASS** |
| **`test_4_dates_endpoint`** | `200 OK` 8 study dates | `200 OK` 8 dates returned | **PASS** |
| **`test_5_model_endpoint`** | `200 OK` locked metrics | `200 OK` Accuracy=86.67%, F1=86.60%, ROC-AUC=93.37% | **PASS** |
| **`test_6_valid_raster_tile`** | `200 OK` PNG image byte stream | `200 OK` PNG byte stream (256x256) | **PASS** |
| **`test_7_invalid_layer_error`** | `400 Bad Request` "Invalid layer" | `400 Bad Request` "Invalid layer" | **PASS** |
| **`test_8_invalid_date_error`** | `400 Bad Request` "Invalid date" | `400 Bad Request` "Invalid date" | **PASS** |
| **`test_9_nodata_tile_rendering`** | `200 OK` Transparent PNG | `200 OK` Transparent 256x256 PNG | **PASS** |
| **`test_10_zonal_statistics`** | `200 OK` LST stats | `200 OK` Min=32.14, Max=52.85, Mean=44.07 °C | **PASS** |
| **`test_11_hotspot_statistics`** | `200 OK` Hotspot count/pct | `200 OK` 155,625 valid pixels, Area=140.06 km² | **PASS** |
| **`test_12_persistence_statistics`** | `200 OK` 5 category areas | `200 OK` 5 categories, Total=93.66 km² | **PASS** |
| **`test_13_gi_star_statistics`** | `200 OK` 5 cluster areas | `200 OK` 5 clusters, Hotspot 99%=8.86 km² | **PASS** |

---

## 4. Scientific Governance & Read-Only Integrity

1. **Read-Only Model Protection**: The Random Forest joblib model (`models/random_forest_final_step10_8.joblib`) is accessed in read-only mode. No endpoints exist to fit, retrain, or modify model weights.
2. **Zero Synthetic Data**: $0$ synthetic or fallback observations were generated. All statistics and tile renders originate directly from the authoritative Step 9 and Step 10 research rasters and CSVs.
3. **OpenAPI Interactive Documentation**: Fully accessible at `http://localhost:8000/docs` and `http://localhost:8000/openapi.json`.
