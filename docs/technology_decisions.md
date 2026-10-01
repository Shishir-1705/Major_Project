# Technology Decisions Specification

**Project Title**: Machine Learning-Based Urban Heat Hotspot Detection Using LST, NDVI and NDBI from Landsat Imagery  
**Study Area**: Mysuru, Karnataka, India  
**Document Version**: 1.0.0  
**Phase**: System Architecture & Application Design (Step 11)  

---

## 1. Full-Stack Technology Matrix

| Layer | Recommended Technology | Alternatives Evaluated | Primary Decision Rationale |
| :--- | :--- | :--- | :--- |
| **Backend Framework** | **FastAPI (Python 3.12)** | Flask, Django REST | Native async support, high performance, automatic OpenAPI docs, seamless integration with Python geospatial stack (`rasterio`, `pyproj`). |
| **ASGI Server** | **Uvicorn** | Gunicorn, Waitress | High-speed ASGI server implementation for asynchronous route handling. |
| **Raster Engine** | **Rasterio + Matplotlib** | GDAL CLI, LocalTileServer | Pythonic GeoTIFF windowed reading, fast bounding-box queries, precise colormap mapping to 256x256 PNG tiles. |
| **Frontend Framework**| **React 18 + TypeScript** | Vue.js, Angular, Vanilla JS | Strong component architecture, static typing for geospatial metrics, rich ecosystem for data visualization. |
| **Build Tool** | **Vite** | Webpack, Create React App | Near-instant hot module replacement (HMR), optimized production bundling. |
| **Map Rendering** | **Leaflet / React-Leaflet**| MapLibre GL, OpenLayers | Lightweight, robust tile-layer rendering, simple custom tile-server URL integration, broad mobile/desktop compatibility. |
| **Styling & UI** | **Tailwind CSS + Radix UI** | Material UI, Ant Design | Utility-first styling for dark theme customization, accessible headless components. |
| **Animations** | **Framer Motion** | GSAP, CSS Animations | Declarative React animation library for smooth drawer expansions and tab transitions. |
| **State Management** | **Zustand + React Query** | Redux Toolkit, Context API | Zustand provides lightweight global store for map layers; React Query manages server state caching. |
| **Chart Visualization**| **Recharts** | Chart.js, D3.js | Declarative SVG charting optimized for React, seamless dark theme integration. |

---

## 2. In-Depth Rationale for Primary Choices

### 2.1 Backend: FastAPI + Rasterio
- **Python Ecosystem Unity**: The research pipeline (Steps 1–10) was developed in Python. Using FastAPI allows direct reuse of `joblib` model loading, `rasterio` windowed array operations, and `numpy` matrix calculations without cross-language binding overhead.
- **Asynchronous Tile Serving**: Web map requests trigger high-frequency HTTP GET calls for individual map tiles ($z/x/y$). FastAPI's async event loop handles concurrent tile requests efficiently.

### 2.2 Frontend: React + TypeScript + Leaflet
- **Typed Data Contracts**: TypeScript ensures strict type safety across complex geospatial JSON structures (bounding boxes, layer metrics, model performance summaries).
- **Leaflet Map Simplicity**: Standard Web Mercator tile endpoints (`/api/v1/tiles/{layer}/{date}/{z}/{x}/{y}.png`) integrate into Leaflet via standard `<TileLayer url="..." />` components with zero WebGL shader compilation required on client devices.

---

## 3. Technology Risk & Mitigation Strategy

1. **Risk**: High latency during dynamic GeoTIFF tile generation for large rasters.  
   **Mitigation**: Implement server-side LRU disk caching for rendered 256x256 PNG tiles under `.tile_cache/`. First tile request renders in $< 120\text{ ms}$, subsequent cached requests serve in $< 15\text{ ms}$.
2. **Risk**: Memory leaks in browser when switching between multiple satellite dates.  
   **Mitigation**: React component unmounting triggers Leaflet layer cleanup; Zustand store purges inactive tile URLs.
