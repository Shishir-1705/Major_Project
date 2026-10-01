# Backend API Architecture Specification

**Project Title**: Machine Learning-Based Urban Heat Hotspot Detection Using LST, NDVI and NDBI from Landsat Imagery  
**Study Area**: Mysuru, Karnataka, India  
**Backend Framework**: FastAPI (Python 3.12 + Uvicorn)  
**Document Version**: 1.0.0  
**Phase**: System Architecture & Application Design (Step 11)  

---

## 1. REST API Overview & Base Route

The backend service is built using **FastAPI** to provide high-performance, asynchronous REST endpoints for spatial metadata, observation inventories, zonal statistics, dynamic raster map tiles, and locked machine learning evaluation records.

- **Base URL**: `http://localhost:8000/api/v1`
- **CORS Policy**: Configured to allow requests from frontend application origin (`http://localhost:5173`).
- **Data Access Permissions**: **Read-Only** access to `models/`, `data/`, `results/`, and `reports/` directories.

---

## 2. API Endpoint Specifications

### 2.1 Metadata & Observation Endpoints

#### `GET /api/v1/metadata/summary`
- **Description**: Returns overall project metadata, study area spatial extent (AOI coordinates), bounding box, and projection information.
- **Response `200 OK`**:
```json
{
  "project_title": "Machine Learning-Based Urban Heat Hotspot Detection Using LST, NDVI and NDBI from Landsat Imagery",
  "study_area": "Mysuru, Karnataka, India",
  "epsg": 32643,
  "bbox_wgs84": [76.50, 12.15, 76.75, 12.40],
  "total_area_km2": 461.5,
  "built_area_km2": 132.129,
  "built_pixels_count": 146810,
  "observation_dates_count": 8
}
```

#### `GET /api/v1/dates`
- **Description**: Returns the inventory of 8 verified Landsat observation dates along with satellite platform IDs and scene identifiers.
- **Response `200 OK`**:
```json
{
  "dates": [
    {"date": "2023-04-01", "satellite": "Landsat 9", "scene_id": "LC09_144051_20230401"},
    {"date": "2023-04-09", "satellite": "Landsat 8", "scene_id": "LC08_144051_20230409"},
    {"date": "2023-04-17", "satellite": "Landsat 9", "scene_id": "LC09_144051_20230417"},
    {"date": "2023-04-25", "satellite": "Landsat 8", "scene_id": "LC08_144051_20230425"},
    {"date": "2023-05-03", "satellite": "Landsat 9", "scene_id": "LC09_144051_20230503"},
    {"date": "2023-05-11", "satellite": "Landsat 8", "scene_id": "LC08_144051_20230511"},
    {"date": "2023-05-19", "satellite": "Landsat 9", "scene_id": "LC09_144051_20230519"},
    {"date": "2023-05-27", "satellite": "Landsat 8", "scene_id": "LC08_144051_20230527"}
  ]
}
```

---

### 2.2 Dynamic Raster Tile Endpoint

#### `GET /api/v1/tiles/{layer_type}/{date_or_type}/{z}/{x}/{y}.png`
- **Parameters**:
  - `layer_type`: `lst` | `ndvi` | `ndbi` | `rf_prob` | `rf_class` | `persistence` | `gi_star`
  - `date_or_type`: Date string (`YYYY-MM-DD`) or static key (`continuous` / `categorical`)
  - `z`, `x`, `y`: Standard Web Mercator tile coordinates
- **Response `200 OK`**: PNG image stream (`image/png`, 256x256 pixels).
- **Caching**: Server sets `Cache-Control: public, max-age=86400` header and stores rendered tiles in `.tile_cache/`.

---

### 2.3 Analytics & Zonal Statistics Endpoints

#### `GET /api/v1/statistics/zonal`
- **Parameters**: `date` (string, required), `layer` (string, required)
- **Response `200 OK`**:
```json
{
  "date": "2023-04-01",
  "layer": "lst",
  "metrics": {
    "min_celsius": 32.14,
    "max_celsius": 52.85,
    "mean_celsius": 44.07,
    "p20_celsius": 42.69,
    "p80_celsius": 47.06,
    "hotspot_area_km2": 42.15,
    "hotspot_percentage": 31.8
  }
}
```

#### `GET /api/v1/statistics/persistence`
- **Description**: Serves the 4-level categorical persistence area breakdown.
- **Response `200 OK`**:
```json
{
  "total_built_area_km2": 132.129,
  "categories": [
    {"category": "None (0 obs)", "area_km2": 45.12, "percentage": 34.15, "color": "#1e293b"},
    {"category": "Transient (1-2 obs)", "area_km2": 32.84, "percentage": 24.85, "color": "#facc15"},
    {"category": "Moderate (3-4 obs)", "area_km2": 28.14, "percentage": 21.30, "color": "#fb923c"},
    {"category": "Persistent (5-8 obs)", "area_km2": 26.03, "percentage": 19.70, "color": "#ef4444"}
  ]
}
```

#### `GET /api/v1/statistics/gi-star`
- **Description**: Serves Getis-Ord $\text{G}_i^*$ spatial cluster statistics.
- **Response `200 OK`**:
```json
{
  "hotspot_cluster_99_area_km2": 18.45,
  "hotspot_cluster_95_area_km2": 14.12,
  "hotspot_cluster_90_area_km2": 9.80,
  "coldspot_cluster_area_km2": 12.30,
  "non_significant_area_km2": 77.46
}
```

---

### 2.4 Locked Model Evaluation Endpoints

#### `GET /api/v1/model/info`
- **Description**: Returns model metadata, locked hyperparameters, feature importances, and evaluation results.
- **Response `200 OK`**:
```json
{
  "model_name": "random_forest_final_step10_8",
  "sha256": "4cb736e53c66c78dbbcbc1cf7ca3ac965af01f1c7fae829502649b018e127280",
  "algorithm": "RandomForestClassifier",
  "hyperparameters": {
    "n_estimators": 100,
    "max_depth": 5,
    "criterion": "gini",
    "min_samples_split": 10,
    "min_samples_leaf": 5,
    "max_features": "sqrt",
    "bootstrap": true,
    "random_state": 42
  },
  "predictors": ["NDVI", "NDBI"],
  "target": "LST-derived thermal hotspot reference labels",
  "feature_importances": {
    "NDBI": 0.610315,
    "NDVI": 0.389685
  },
  "locked_test_metrics": {
    "test_samples": 195,
    "accuracy": 0.866667,
    "precision": 0.865979,
    "recall": 0.865979,
    "f1_score": 0.865979,
    "cohen_kappa": 0.733326,
    "roc_auc": 0.933673,
    "pr_auc": 0.936654,
    "brier_score": 0.105892,
    "confusion_matrix": {"tn": 85, "fp": 13, "fn": 13, "tp": 84}
  }
}
```
