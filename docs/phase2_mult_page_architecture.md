# Phase 2 — Multi-Page Architecture and Specialized Analytical Views

## 1. Executive Summary

This document describes the architectural transition from a single-screen dashboard to a structured, multi-page geospatial intelligence platform for **Machine Learning-Based Urban Heat Hotspot Detection Using LST, NDVI and NDBI from Landsat Imagery**.

The implementation establishes a clean routing system with 8 dedicated analytical views, shared layout shell, responsive navigation drawer, interactive Leaflet AOI mapping, and direct integration with the FastAPI backend while preserving the approved light CARTO Voyager basemap and locked research methodology.

---

## 2. Route Architecture & Responsibilities

The application leverages `react-router-dom` (v7) with client-side routing and fallback support configured in Nginx (`try_files $uri $uri/ /index.html;`).

| Path | View Title | Description & Responsibilities |
| :--- | :--- | :--- |
| `/` | **Overview** | Executive summary of research project, study area AOI map, key metrics (Built Area Domain, Zonal Mean LST, Hotspot Area, Locked Model F1), methodology pipeline summary, and direct analytical navigation cards. |
| `/lst` | **LST Explorer** | Dedicated exploration of Landsat-derived Land Surface Temperature (radiometric surface temperature), multi-temporal date switching, dynamic Celsius legend, and zonal thermal statistics. |
| `/hotspots` | **ML Hotspot Analysis** | Random Forest prediction exploration with toggle between continuous prediction probability (`rf_prob`) and binary classification (`rf_class`), spatial coverage statistics, and threshold explanations. |
| `/indices` | **NDVI & NDBI** | Dedicated dual-view for vegetation index (NDVI) and built-up index (NDBI), index-specific colormaps, environmental correlation, and urban land-cover dynamics. |
| `/persistence` | **Heat Persistence** | Multi-temporal categorical stability analysis across 8 Landsat observations (Low, Moderate, High, Extreme persistence), highlighting chronic urban heat anomalies. |
| `/clusters` | **Gi\* Spatial Clusters** | Getis-Ord $G_i^*$ spatial clustering analysis identifying statistically significant hot spots ($z \ge 1.96, p < 0.05$), cold spots, and non-significant spatial domains. |
| `/model` | **Model & Evaluation** | Locked Random Forest model architecture, telemetry, hyperparameters, spatial cross-validation metrics, independent spatial test confusion matrix, and locked checksum verification. |
| `/methodology` | **Methodology** | Complete research documentation: Mysuru study area, sensor specifications, Landsat data acquisition, radiometric calibration, split-window LST derivation, pseudo-reference labeling, and limitations. |
| `*` | **Not Found (404)** | User-friendly 404 error page with quick links to return to `/` or navigate to any primary analytical section. |

---

## 3. Shared Application Shell & Navigation

### 3.1 AppLayout Architecture
The root layout (`frontend/src/components/layout/AppLayout.tsx`) wraps all child routes via React Router `<Outlet />`:
- **Header (`Header.tsx`)**: Fixed top bar with project branding, live server status pill (`ONLINE` / `OFFLINE`), desktop navigation links (`NavLink`), and a responsive hamburger button for mobile/tablet screens.
- **Mobile Navigation Drawer**: When viewport width is below `1280px` (the `xl:` breakpoint), navigation links gracefully transition to a clean collapsible overlay drawer with 2-to-4 column responsive grid cards.
- **Toast Notifications (`ToastContainer.tsx`)**: Global asynchronous alert notifications for network failures, tile rendering issues, or offline status alerts.
- **Error Boundary (`ErrorBoundary.tsx`)**: Global React class error boundary wrapping `<BrowserRouter>` to catch unhandled rendering exceptions without exposing stack traces.

### 3.2 Responsive Breakpoints
The layout and navigation were tested and confirmed responsive across standard viewport dimensions:
- **Desktop (1440 × 900)**: Full 8-item navigation pill row, multi-column dashboard grid.
- **Laptop (1280 × 800)**: Compact desktop view with full header menu.
- **Tablet (768 × 1024)**: Responsive 2-column card layouts with slide-down mobile navigation drawer.
- **Mobile (390 × 844)**: Single-column vertical stack, touch-friendly 44px tap targets, collapsible mobile drawer.

---

## 4. Overview Page (`/`) Design & Components

### 4.1 OverviewMap (`frontend/src/components/map/OverviewMap.tsx`)
- Embeds Leaflet interactive map with the approved light CARTO Voyager basemap.
- Outlines the Mysuru Urban Local Body (ULB) AOI boundary (`MYSURU_AOI_BOUNDS`: `[[12.2475, 76.5650], [12.3780, 76.7120]]`) with a teal bounding polygon.
- Features dynamic hover coordinate tracker (Latitude / Longitude).
- Displays projection metadata badge (`CRS: UTM Zone 43N / WGS 84 (EPSG:32643)`).
- Implements an automated resize observer (`OverviewMapResizer`) calling Leaflet `map.invalidateSize()` on mount to prevent zero-height container collapses in scrollable views.

### 4.2 Research Metrics Integration
The Overview page displays 4 core research metrics connected to verified backend endpoints and locked metadata:
1. **Built Area Domain**: $132.13\text{ km}^2$ ($146,812$ valid analysis pixels at 30 m resolution).
2. **Zonal Mean LST**: $43.14\ ^\circ\text{C}$ (Peak heat observation date: 2023-05-11).
3. **Hotspot Area**: $34.54\text{ km}^2$ ($26.14\%$ of study area classified as surface thermal hotspot).
4. **Locked Model F1-Score**: $86.60\%$ (Random Forest spatial evaluation, precision $88.89\%$, recall $84.42\%$).

### 4.3 Research Workflow Pipeline
A 4-step workflow card details the scientific data flow:
1. **Satellite Acquisition**: Landsat-8/9 OLI/TIRS multi-temporal imagery (Path 144, Row 51).
2. **Radiometric Processing**: Split-window LST derivation, atmospheric correction, NDVI/NDBI calculation.
3. **Machine Learning Hotspots**: Random Forest classification (100 estimators, max depth 12) detecting surface thermal hotspots.
4. **Spatial Analytics**: Multi-temporal persistence categorisation and Getis-Ord $G_i^*$ spatial clustering.

---

## 5. Security and Research Integrity

1. **Model Lock**: The Random Forest model SHA-256 checksum remains unchanged:
   `4cb736e53c66c78dbbcbc1cf7ca3ac965af01f1c7fae829502649b018e127280`.
2. **Scientific Methodology & Terminology**:
   - Pseudo-reference labels generated from LST distributions are strictly documented as *pseudo-reference labels* and never misrepresented as field ground truth.
   - Detected thermal hotspots are explicitly designated as *relative radiometric surface thermal hotspots*, not meteorological air-temperature heatwaves.
3. **Credential Isolation**: CARTO API authentication credentials remain strictly in `frontend/.env` (ignored by Git) and are never exposed in source code, client builds, or Git commits.
