# FastAPI Backend API Reference

**Project Title**: Machine Learning-Based Urban Heat Hotspot Detection Using LST, NDVI and NDBI from Landsat Imagery  
**Study Area**: Mysuru, Karnataka, India  
**Base URL**: `http://localhost:8000/api/v1`  
**Interactive OpenAPI Documentation**: `http://localhost:8000/docs`  
**OpenAPI JSON Schema**: `http://localhost:8000/openapi.json`  

---

## 1. Overview & System Health

### `GET /`
- **Description**: Service health check and system information.
- **Example Response `200 OK`**:
```json
{
  "status": "online",
  "service": "Urban Heat Hotspot Intelligence API",
  "study_area": "Mysuru, Karnataka, India",
  "docs": "/docs"
}
```

---

## 2. Core Metadata Endpoints

### `GET /api/v1/metadata`
- **Description**: Returns overall project metadata, CRS, bounding box, area metrics, and locked model SHA-256 hash.
- **Example Response `200 OK`**:
```json
{
  "project_title": "Machine Learning-Based Urban Heat Hotspot Detection Using LST, NDVI and NDBI from Landsat Imagery",
  "study_area": "Mysuru, Karnataka, India",
  "crs": "EPSG:32643 (UTM Zone 43N)",
  "bbox_wgs84": [76.5, 12.15, 76.75, 12.4],
  "total_area_km2": 461.5,
  "built_area_km2": 132.129,
  "built_pixels_count": 146810,
  "observation_dates_count": 8,
  "locked_model_sha256": "4cb736e53c66c78dbbcbc1cf7ca3ac965af01f1c7fae829502649b018e127280"
}
```

### `GET /api/v1/dates`
- **Description**: Inventory of 8 verified Landsat observation dates.
- **Example Response `200 OK`**:
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

### `GET /api/v1/layers`
- **Description**: Available satellite, ML, and spatial analysis map layers.
- **Example Response `200 OK`**:
```json
{
  "layers": [
    {
      "id": "lst",
      "name": "Land Surface Temperature (LST)",
      "type": "satellite",
      "description": "Landsat 8/9 ST_B10 surface temperature (°C)",
      "unit": "°C",
      "is_categorical": false,
      "requires_date": true,
      "colormap": "YlOrRd"
    },
    {
      "id": "rf_prob",
      "name": "RF Hotspot Probability",
      "type": "ml",
      "description": "Random Forest Class 1 probability gradient (0.0 to 1.0)",
      "unit": "Probability",
      "is_categorical": false,
      "requires_date": true,
      "colormap": "Reds"
    }
  ]
}
```

### `GET /api/v1/model`
- **Description**: Read-only metadata, locked hyperparameters, feature importances, and evaluation results for the locked Random Forest model.
- **Example Response `200 OK`**:
```json
{
  "model_name": "random_forest_final_step10_8",
  "algorithm": "RandomForestClassifier (100 Trees)",
  "sha256": "4cb736e53c66c78dbbcbc1cf7ca3ac965af01f1c7fae829502649b018e127280",
  "predictors": ["NDVI", "NDBI"],
  "target": "LST-derived thermal hotspot reference labels",
  "hyperparameters": {
    "n_estimators": 100,
    "max_depth": 5,
    "criterion": "gini",
    "random_state": 42
  },
  "feature_importances": {
    "NDBI": 0.610315,
    "NDVI": 0.389685
  },
  "locked_test_metrics": {
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

---

## 3. Dynamic Raster Tile Endpoint

### `GET /api/v1/tiles/{layer}/{date_or_key}/{z}/{x}/{y}.png`
- **Parameters**:
  - `layer`: `lst` | `ndvi` | `ndbi` | `rf_prob` | `rf_class` | `persistence` | `gi_star` | `built_mask`
  - `date_or_key`: `YYYY-MM-DD` (for satellite/ML) or `categorical` / `clustering` (for spatial maps)
  - `z`, `x`, `y`: Web Mercator tile coordinates
- **Response `200 OK`**: PNG image byte stream (`image/png`, 256x256 pixels).

---

## 4. Zonal & Spatial Statistics Endpoints

### `GET /api/v1/statistics/zonal?layer=lst&date=2023-04-01`
- **Response `200 OK`**:
```json
{
  "layer": "lst",
  "date": "2023-04-01",
  "min": 32.14,
  "max": 52.85,
  "mean": 44.07,
  "std": 3.12,
  "valid_pixels": 155625,
  "nodata_pixels": 477301,
  "total_pixels": 632926,
  "area_km2": 140.063
}
```

### `GET /api/v1/statistics/hotspot?date=2023-04-01`
- **Response `200 OK`**:
```json
{
  "date": "2023-04-01",
  "total_built_pixels": 155625,
  "hotspot_pixels": 46833,
  "non_hotspot_pixels": 108792,
  "hotspot_area_km2": 42.15,
  "non_hotspot_area_km2": 97.913,
  "total_built_area_km2": 140.063,
  "hotspot_percentage": 30.09
}
```

### `GET /api/v1/statistics/persistence`
- **Response `200 OK`**:
```json
{
  "total_built_area_km2": 93.657,
  "categories": [
    {"category": "Category 1: 0% Recurrence (Never Hotspot)", "obs_count_range": "0%", "area_km2": 81.795, "percentage": 87.33, "color_hex": "#1e293b"},
    {"category": "Category 2: 1-25% Recurrence (Infrequent)", "obs_count_range": "1-25%", "area_km2": 1.677, "percentage": 1.79, "color_hex": "#facc15"},
    {"category": "Category 3: 26-50% Recurrence (Moderate)", "obs_count_range": "26-50%", "area_km2": 0.833, "percentage": 0.89, "color_hex": "#fb923c"},
    {"category": "Category 4: 51-75% Recurrence (Frequent)", "obs_count_range": "51-75%", "area_km2": 0.546, "percentage": 0.58, "color_hex": "#f97316"},
    {"category": "Category 5: >75-100% Recurrence (Persistent)", "obs_count_range": ">75-100%", "area_km2": 8.806, "percentage": 9.4, "color_hex": "#ef4444"}
  ]
}
```

### `GET /api/v1/statistics/gi-star`
- **Response `200 OK`**:
```json
{
  "total_built_area_km2": 93.657,
  "clusters": [
    {"cluster_type": "Hotspot 99% Confidence", "confidence_level": "99%", "area_km2": 8.856, "percentage": 9.46, "color_hex": "#990000"},
    {"cluster_type": "Hotspot 95% Confidence", "confidence_level": "95%", "area_km2": 0.0, "percentage": 0.0, "color_hex": "#d73027"},
    {"cluster_type": "Hotspot 90% Confidence", "confidence_level": "90%", "area_km2": 0.0, "percentage": 0.0, "color_hex": "#f46d43"},
    {"cluster_type": "Coldspot Cluster", "confidence_level": "90-99%", "area_km2": 0.0, "percentage": 0.0, "color_hex": "#4575b4"},
    {"cluster_type": "Not Significant", "confidence_level": "N/A", "area_km2": 84.801, "percentage": 90.54, "color_hex": "#1e293b"}
  ]
}
```
