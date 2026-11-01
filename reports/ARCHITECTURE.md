# System Architecture & Technical Data Flow: Thermal Intelligence

**Project:** Machine Learning-Based Urban Heat Hotspot Detection Using LST, NDVI and NDBI from Landsat Imagery  
**Study Region:** Mysuru, Karnataka, India (`EPSG:32643`, UTM Zone 43N)  
**Document Status:** Technical Architecture Specification (Increment 3.12)

---

## 1. System Overview

Thermal Intelligence is designed around a decoupled, microservices-ready client-server architecture consisting of four core subsystems:
1. **Geospatial Processing & Machine Learning Engine (Offline / Pipeline):** Processes raw USGS Landsat Level-2 scenes, calibrates radiometric and surface reflectance products, executes spatially constrained model training, and generates authoritative analysis rasters.
2. **REST API & Tile Streaming Backend (FastAPI):** Exposes high-performance REST endpoints for telemetry, metadata, summary statistics, and an on-the-fly GeoTIFF-to-Web Mercator tile renderer.
3. **State Management & Geospatial Client (React / TypeScript):** A single-page application (SPA) featuring dynamic routing, responsive data visualization, and Zustand state synchronization.
4. **Interactive Map Canvas (Leaflet / WebGL):** Renders dynamic XYZ raster tile streams, vector boundaries, coordinate inspector overlays, and interactive opacity/layer controls.

---

## 2. End-to-End Data Flow Architecture

```mermaid
flowchart TD
    subgraph S1["1. Satellite Ingestion & Calibration"]
        L89["Landsat 8/9 Level-2 Acquisitions<br/>Path 144, Row 51 (8 Dates)"]
        QA["QA_PIXEL Cloud Masking<br/>& Radiometric Scale Factors"]
        L89 --> QA
    end

    subgraph S2["2. Feature & Label Extraction"]
        TIRS["Thermal IR (ST_B10)"]
        OPT["Optical Surface Reflectance<br/>Red (B4), NIR (B5), SWIR-1 (B6)"]
        QA --> TIRS
        QA --> OPT
        
        LST["Calibrated LST (°C)<br/>(Skin Temperature)"]
        NDVI["Canopy Density (NDVI)"]
        NDBI["Impervious Density (NDBI)"]
        
        TIRS --> LST
        OPT --> NDVI
        OPT --> NDBI
        
        REF["P80 LST Threshold<br/>Reference Labels (Class 0/1)"]
        LST --> REF
    end

    subgraph S3["3. Locked Machine Learning Engine"]
        SPAT["40 Spatial Block Partitioning<br/>(GroupKFold)"]
        NDVI --> SPAT
        NDBI --> SPAT
        REF --> SPAT
        
        TRAIN["Training Partition (30 Blocks)<br/>N = 805 Samples"]
        TEST["Held-Out Test (10 Blocks)<br/>N = 195 Samples"]
        SPAT --> TRAIN
        SPAT --> TEST
        
        RF["Random Forest Classifier<br/>(100 Trees, Depth 5, Gini)<br/>SHA-256: 4cb736e5..."]
        TRAIN --> RF
        TEST -.->|Evaluate 86.60% F1| RF
        
        PRED["Full Spatial Inference<br/>Probability & Classification Rasters"]
        RF --> PRED
    end

    subgraph S4["4. Spatial Analytics"]
        PERS["Multi-Temporal Persistence<br/>(5 Recurrence Categories)"]
        GI["Getis-Ord Gi* Autocorrelation<br/>(BH-FDR p < 0.05)"]
        PRED --> PERS
        LST --> GI
    end

    subgraph S5["5. FastAPI REST & Tile Engine (Port 8000)"]
        ROUTER["API Router (/api/v1)"]
        TILE_SRV["RasterService<br/>Reproject EPSG:32643 → EPSG:3857<br/>Render 256x256 PNG Tiles"]
        STAT_SRV["StatisticsService<br/>Zonal & Cluster Metrics"]
        META_SRV["MetadataService<br/>Model Info & Layer Catalog"]
        
        PERS --> ROUTER
        GI --> ROUTER
        PRED --> ROUTER
        LST --> ROUTER
        
        ROUTER --> TILE_SRV
        ROUTER --> STAT_SRV
        ROUTER --> META_SRV
    end

    subgraph S6["6. React 18 Frontend Client (Port 5173)"]
        STORE["Zustand App Store<br/>(activeLayer, selectedDate, stats)"]
        PAGES["Analytical Page Views<br/>(/, /overview, /lst, /hotspots,<br/>/indices, /persistence, /clusters, /model)"]
        MAP["Leaflet Map Canvas<br/>(Dynamic TileLayer & AOI GeoJSON)"]
        
        META_SRV -->|GET /metadata, /model| STORE
        STAT_SRV -->|GET /statistics/*| STORE
        TILE_SRV -->|GET /tiles/{layer}/{date}/{z}/{x}/{y}.png| MAP
        
        STORE <--> PAGES
        PAGES <--> MAP
    end
```

---

## 3. Subsystem Detailed Specifications

### 3.1 Backend Application Architecture (FastAPI)
* **Application Entrypoint:** [`backend/app/main.py`](file:///d:/Major_Project/backend/app/main.py)
  * Initializes FastAPI application, OpenAPI schema, and CORS middleware allowing frontend communication.
  * Mounts health endpoints: `/` and `/health`.
* **API Route Definition:** [`backend/app/api/routes.py`](file:///d:/Major_Project/backend/app/api/routes.py)
  * Groups all analytical routes under `/api/v1/`.
* **Tile Rendering Service:** [`backend/app/services/raster_service.py`](file:///d:/Major_Project/backend/app/services/raster_service.py)
  * Uses `rasterio` and `rasterio.warp.reproject` to transform raster windows from UTM Zone 43N (`EPSG:32643`) to Web Mercator (`EPSG:3857`).
  * Normalizes array values according to layer-specific dynamic ranges.
  * Applies continuous colormaps (`matplotlib.cm`) or categorical color lookups.
  * Encodes to transparent 8-bit RGBA PNG streams with HTTP `Cache-Control` headers for sub-millisecond client tiling.
* **Analytical Statistics Service:** [`backend/app/services/statistics_service.py`](file:///d:/Major_Project/backend/app/services/statistics_service.py)
  * Computes dynamic zonal statistics (min, max, mean, standard deviation, valid pixels, area in $\text{km}^2$).
  * Reads multi-temporal recurrence frequencies and Getis-Ord Gi* cluster areas ($18.71\text{ km}^2$ hotspots, $24.17\text{ km}^2$ coldspots, $92.36\text{ km}^2$ non-significant).
* **Configuration Module:** [`backend/app/config.py`](file:///d:/Major_Project/backend/app/config.py)
  * Manages environment variables, directory paths, and the authoritative candidate toggle (`USE_CANDIDATE_DATA = True`).

---

### 3.2 Frontend Architecture (React 18 & TypeScript)
* **Build System:** Vite 6.4 (`vite.config.ts`), configured with `@vitejs/plugin-react` and path aliasing.
* **Global State Management:** [`frontend/src/store/useAppStore.ts`](file:///d:/Major_Project/frontend/src/store/useAppStore.ts)
  * Managed via Zustand with zero boilerplate.
  * Synchronizes: `activeLayer`, `selectedDate`, `isCandidateMode`, `layerOpacity`, `showAOI`, `cursorCoordinates`, and live API statistics (`giStarStats`, `persistenceStats`, `hotspotStats`).
* **Component Architecture:**
  * **Layout:** [`AppLayout.tsx`](file:///d:/Major_Project/frontend/src/components/layout/AppLayout.tsx), [`Header.tsx`](file:///d:/Major_Project/frontend/src/components/layout/Header.tsx) (navigation bar, server health indicator, active routes).
  * **Map System:** [`MapWorkspace.tsx`](file:///d:/Major_Project/frontend/src/components/map/MapWorkspace.tsx), [`MapLegend.tsx`](file:///d:/Major_Project/frontend/src/components/map/MapLegend.tsx), [`MapContextOverlay.tsx`](file:///d:/Major_Project/frontend/src/components/map/MapContextOverlay.tsx).
  * **UI Components:** [`StatCard.tsx`](file:///d:/Major_Project/frontend/src/components/common/StatCard.tsx) (responsive statistics cards with natural text wrapping and fallback states).
* **Route Mapping:**
  * `/` → `LandingPage.tsx`
  * `/overview` → `OverviewPage.tsx`
  * `/lst` → `LstPage.tsx`
  * `/hotspots` → `HotspotsPage.tsx`
  * `/indices` → `IndicesPage.tsx`
  * `/persistence` → `PersistencePage.tsx`
  * `/clusters` → `ClustersPage.tsx`
  * `/model` → `ModelPage.tsx`
  * `/methodology` → `MethodologyPage.tsx`

---

## 4. API Endpoints and Data Contracts

| Method | Endpoint | Return Schema | Functional Purpose |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | `HealthResponse` | Root health check for orchestrators. |
| `GET` | `/api/v1/health` | `HealthResponse` | Client-facing health telemetry. |
| `GET` | `/api/v1/metadata` | `MetadataResponse` | Study region extent, CRS, pixel dimensions, locked model hash. |
| `GET` | `/api/v1/dates` | `DatesResponse` | Array of 8 verified Landsat observation dates and satellite IDs. |
| `GET` | `/api/v1/layers` | `LayersResponse` | Catalog of 7 analytical layers, units, and colormaps. |
| `GET` | `/api/v1/model` | `ModelInfoResponse` | Locked model hyperparameters, feature importances, test metrics. |
| `GET` | `/api/v1/tiles/{l}/{d}/{z}/{x}/{y}.png` | `image/png` | 256x256 Web Mercator raster tile stream. |
| `GET` | `/api/v1/statistics/zonal` | `ZonalStatisticsResponse` | Min, max, mean, std. dev., valid pixels, area ($\text{km}^2$). |
| `GET` | `/api/v1/statistics/hotspot` | `HotspotStatisticsResponse` | Hotspot vs non-hotspot counts, areas, and percentage. |
| `GET` | `/api/v1/statistics/persistence`| `PersistenceStatisticsResponse`| 5-tier recurrence areas and percentage shares. |
| `GET` | `/api/v1/statistics/gi-star` | `GiStarStatisticsResponse` | Hotspot, coldspot, and non-significant cluster areas. |

---

## 5. Security and Operational Architecture

* **Decoupled API Boundaries:** The frontend communicates strictly over HTTP REST using relative `/api/v1` routes proxied or directly addressed through configurable environment variables (`VITE_API_URL`).
* **Zero Secret Exposure:** No API keys, cloud credentials, or private access tokens are stored in the client bundle or backend repository.
* **Deterministic Model Locking:** The Random Forest binary is versioned and validated via runtime SHA-256 integrity checks. If the model binary is modified or tampered with, the backend detects the hash mismatch.
* **Containerized Deployment:** Docker Compose configurations (`Dockerfile`, `docker-compose.yml`) enable single-command deployment with unified multi-stage builds.
