# Application Data Flow Specification

**Project Title**: Machine Learning-Based Urban Heat Hotspot Detection Using LST, NDVI and NDBI from Landsat Imagery  
**Study Area**: Mysuru, Karnataka, India  
**Document Version**: 1.0.0  
**Phase**: System Architecture & Application Design (Step 11)  

---

## 1. End-to-End Data Pipeline Flow

The data flow within the platform spans from satellite acquisition to browser-based interactive map rendering:

```
[ GEE Satellite Acquisition ]
              │ (Landsat 8/9 ST_B10, SR_B4, SR_B5, SR_B6)
              ▼
[ GeoTIFF / CSV Research Artifacts ] (data/step10/, results/step10/)
              │
              ▼
[ FastAPI Backend / Raster Engine ] (backend/app/main.py)
              │
              ├───────► REST JSON API (/api/v1/metadata, /api/v1/statistics)
              │
              └───────► Dynamic PNG Tile Endpoint (/api/v1/tiles/{layer}/{date}/{z}/{x}/{y}.png)
              │
              ▼
[ React Frontend Data Layer ] (React Query / Axios Client)
              │
              ▼
[ Map & Analytics UI Component Layer ] (Leaflet Canvas + Recharts)
```

---

## 2. Raster Tile Serving Strategy

To ensure fluid map interaction without client-side memory exhaustion or lag, satellite GeoTIFF rasters are converted into standard Web Mercator ($z/x/y$) PNG tiles on-the-fly or pre-rendered via a dedicated backend raster service:

```
Browser Requests Map Tile (z/x/y, Layer="LST", Date="2023-04-01")
                            │
                            ▼
Backend Tile Controller (/api/v1/tiles/lst/2023-04-01/{z}/{x}/{y}.png)
                            │
              ┌─────────────┴─────────────┐
              │ Is Tile in LRU Disk Cache?│
              └─────────────┬─────────────┘
                     YES    │    NO
         ┌──────────────────┴──────────────────┐
         ▼                                     ▼
Return Cached PNG Tile              1. Read GeoTIFF Window via Rasterio
(Latency < 15 ms)                   2. Transform Coordinates to EPSG:3857
                                    3. Apply Layer Colormap (Plasma/Viridis/YlOrRd)
                                    4. Render 256x256 Transparent PNG
                                    5. Save to Disk Cache & Return (Latency < 120 ms)
```

### Supported Layer Colormaps:
- **LST (°C)**: Thermal colormap (`inferno` or `YlOrRd`, range $30.0^\circ\text{C} - 55.0^\circ\text{C}$).
- **NDVI**: Vegetation colormap (`YlGn`, range $-0.2 - +0.8$).
- **NDBI**: Built-up colormap (`YlOrBr`, range $-0.4 - +0.6$).
- **RF Hotspot Probability**: Probability gradient (`Reds`, range $0.0 - 1.0$).
- **RF Hotspot Classification**: Discrete binary mask ($0 = \text{Transparent}$, $1 = \text{Crimson Red } \#dc2626$).
- **Getis-Ord $\text{G}_i^*$ Clusters**: Categorical palette ($99\% \text{ Hotspot} = \#990000$, $95\% \text{ Hotspot} = \#d73027$, $90\% \text{ Hotspot} = \#f46d43$, $\text{Not Significant} = \text{Transparent}$, $\text{Coldspots} = \text{Blue shades}$).
- **Persistence**: Categorical palette ($0 = \text{None}$, $1-2 = \text{Transient (Yellow)}$, $3-4 = \text{Moderate (Orange)}$, $5-8 = \text{Persistent (Red)}$).

---

## 3. Client-Side State Management & Data Lifecycle

The React dashboard utilizes **Zustand** for global application state and **React Query** for async server state management:

```
+-----------------------------------------------------------------------------------+
|                            ZUSTAND GLOBAL STORE                                   |
|  - selectedDate: "2023-04-01"                                                     |
|  - activeLayer: "rf_probability"                                                  |
|  - layerOpacity: 0.85                                                             |
|  - mapCenter: [12.305, 76.655], zoom: 12                                          |
|  - hoveredPixel: { lat, lng, lst, ndvi, ndbi, prob }                              |
+-----------------------------------------------------------------------------------+
       │                                                               │
       ▼                                                               ▼
+------------------------------------+               +------------------------------+
|     REACT QUERY API HOOKS          |               |     MAP VIEW SYNCHRONIZER    |
| - useMetadata()                    |               | - Dynamic Tile Layer URL     |
| - useZonalStats(date, layer)       |               | - AOI Boundary GeoJSON       |
| - usePersistenceSummary()          |               | - Tile Cache Invalidation    |
+------------------------------------+               +------------------------------+
```

---

## 4. Sub-System Data Contracts

### 4.1 Zonal Statistics Endpoint Contract (`GET /api/v1/statistics/zonal`)
```json
{
  "date": "2023-04-01",
  "layer": "lst",
  "metrics": {
    "min": 32.14,
    "max": 52.85,
    "mean": 44.07,
    "std": 3.12,
    "p20": 42.69,
    "p80": 47.06,
    "hotspot_area_km2": 42.15,
    "hotspot_percentage": 31.8
  }
}
```

### 4.2 Locked Model Metadata Contract (`GET /api/v1/model/info`)
```json
{
  "model_name": "random_forest_final_step10_8",
  "sha256": "4cb736e53c66c78dbbcbc1cf7ca3ac965af01f1c7fae829502649b018e127280",
  "predictors": ["NDVI", "NDBI"],
  "target": "LST-derived thermal hotspot reference labels",
  "locked_test_metrics": {
    "accuracy": 0.866667,
    "f1_score": 0.865979,
    "roc_auc": 0.933673,
    "pr_auc": 0.936654,
    "brier_score": 0.105892
  },
  "feature_importances": {
    "NDBI": 0.610315,
    "NDVI": 0.389685
  }
}
```
