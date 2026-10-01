# Step 14 — Full Application Integration Documentation

## Project Overview
**Project Title**: Machine Learning-Based Urban Heat Hotspot Detection Using LST, NDVI and NDBI from Landsat Imagery  
**Study Area**: Mysuru, Karnataka, India  
**Integration Status**: Completed & Verified  

---

## 1. System Architecture

The application is structured into a decoupled, high-performance architecture:
- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS + Lucide Icons + React-Leaflet / Leaflet.
- **Backend**: Python 3.12 + FastAPI + Uvicorn + Rasterio + PyProj + Scikit-Learn + Joblib.
- **Data Store**: Direct read-only access to GeoTIFF rasters under `data/step10/real/`, `data/step9/`, `data/step10/persistence/`, `data/step10/gi_star/`, and the locked Random Forest model (`models/random_forest_final_step10_8.joblib`).

```
[ React 18 + TS Frontend ] <---> [ Axios / Fetch Client ]
                                        | (REST APIs)
                                        v
                              [ FastAPI Backend Service ]
                                        |
      +---------------------------------+---------------------------------+
      |                                 |                                 |
[ Rasterio Tile Server ]   [ Model Metadata & Stats ]      [ Zonal & Spatial Analytics ]
      |                                 |                                 |
      v                                 v                                 v
(PNG Map Tiles 256x256)     (Locked RF Model SHA-256)      (Real Landsat Statistics)
```

---

## 2. API Service Layer & Endpoint Mapping

The frontend API client is located in `frontend/src/services/api.ts` and consumes the following FastAPI REST endpoints defined under `/api/v1`:

| Endpoint | Method | Response Type | Description |
| :--- | :--- | :--- | :--- |
| `/api/v1/metadata` | `GET` | `StudyAreaMetadata` | Retrieves study area extent, CRS (EPSG:32643), total pixel count (146,810), and total built area ($132.129\text{ km}^2$). |
| `/api/v1/dates` | `GET` | `AvailableDatesResponse` | Retrieves list of 8 real Landsat observation dates (`2023-04-01` to `2023-05-27`). |
| `/api/v1/layers` | `GET` | `LayerInfo[]` | Lists available spatial layers (LST, NDVI, NDBI, ML Probability, ML Class, Thermal Hotspot, Persistence, Gi* Clusters). |
| `/api/v1/model` | `GET` | `ModelInfo` | Serves locked Random Forest model metadata, SHA-256 hash, hyperparameter configuration, features (`NDVI + NDBI`), and test performance metrics. |
| `/api/v1/statistics/zonal` | `GET` | `ZonalStatistics` | Calculates mean, std, min, max for LST, NDVI, NDBI, and ML Hotspot Probability over the study area for a target date. |
| `/api/v1/statistics/hotspot` | `GET` | `HotspotStatistics` | Returns built-up hotspot pixel counts, area ($km^2$), and percentage of total built area for a target date. |
| `/api/v1/statistics/persistence` | `GET` | `PersistenceStatistics` | Returns pixel counts, area ($km^2$), and area percentages for all 5 thermal persistence classes across the 8-date time series. |
| `/api/v1/statistics/gi-star` | `GET` | `GiStarStatistics` | Returns spatial clustering statistics, pixel counts, and area for Getis-Ord $G_i^*$ hotspot and coldspot confidence categories. |
| `/api/v1/tiles/{layer}/{date_or_key}/{z}/{x}/{y}.png` | `GET` | `image/png` | Dynamic XYZ map tile renderer delivering 256x256 RGBA PNG tiles reprojected from WGS84 Web Mercator (EPSG:3857) to UTM 43N (EPSG:32643). |

---

## 3. Leaflet Map Tile Integration

Map layers are dynamically rendered on Leaflet interactive maps via Web Mercator tile requests:

- **Tile Routing**:
  - **Date-dependent layers**: (`lst`, `ndvi`, `ndbi`, `rf_prob`, `rf_class`, `hotspot`) query using selected observation date string (e.g. `2023-04-01`).
  - **Date-independent layers**: (`persistence`, `gi_star`) query using default keys (`categorical`, `clustering`).
- **Color Mapping & Rendering**:
  - `lst`: Thermal palette (Turbo / Thermal gradient from $25^\circ\text{C}$ to $55^\circ\text{C}$).
  - `ndvi`: Spectral vegetation palette (Brown to Dark Green).
  - `ndbi`: Urban built palette (Blue-grey to Magenta).
  - `rf_prob`: Hotspot probability gradient (Cyan/Blue to Deep Red/Violet).
  - `rf_class` / `hotspot`: Binary hotspot mask overlay (Transparent non-hotspot, Bright Red hotspot).
  - `persistence`: 5 distinct categorical colors (Transient to Persistent Hotspot).
  - `gi_star`: Hotspot/Coldspot confidence bands ($99\%$, $95\%$, $90\%$ confidence levels).

---

## 4. Global State Management

The frontend state is managed via **Zustand** (`frontend/src/store/useAppStore.ts`):
- `fetchInitialData()` initializes app metadata, Landsat observation dates, layer configurations, and locked model information on application launch.
- `fetchLayerStats()` dynamically updates active layer statistics whenever the selected observation date or active layer selection changes.
- Prevents redundant network queries while keeping analytics cards synchronized with current map view state.

---

## 5. Scientific Data Integrity Guarantees

1. **Zero Mock/Synthetic Data**: Every number, statistic, histogram, and tile pixel rendered in the frontend originates from verified GeoTIFF rasters and locked scikit-learn models.
2. **Locked Model Enforcement**: The backend verifies SHA-256 hash `4cb736e53c66c78dbbcbc1cf7ca3ac965af01f1c7fae829502649b018e127280` on initialization. No online fitting or retraining endpoints exist.
3. **Strict Feature Exclusion**: LST is 100% excluded from model predictor inputs, preserving strict decoupling between predictors (`NDVI + NDBI`) and LST thermal hotspot target labels.
