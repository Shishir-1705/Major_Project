# Phase 2 — Multi-Page Architecture Implementation Report

**Project**: Machine Learning-Based Urban Heat Hotspot Detection Using LST, NDVI and NDBI from Landsat Imagery  
**Date**: October 14, 2026  
**Baseline Commit**: `a9210e5` (`style: refine basemap and map presentation`)  
**Scope**: Stages 0, 1, and 2 (Inspection, Routing & Application Shell, Overview Page `/`)  

---

## 1. Stage 0 — Inspection Findings

Prior to making any code modifications, a full inspection of the frontend and backend architectures was performed:

1. **Routing**: No client router was previously installed in `frontend/package.json`. Single-dashboard state was toggled via in-memory tab state. `react-router-dom@^7.18.4` was chosen and installed as the standard SPA routing library.
2. **UI Components & Icons**: `lucide-react@^0.475.0` was present. Tailwind CSS v3 was configured with a warm-neutral light palette (`slate`, `teal`, `amber`, `emerald`).
3. **21st.dev Availability**: The 21st.dev MCP server is not configured in this environment; native Tailwind CSS and Lucide components were used to ensure reproducible, accessible, and responsive components matching the design system.
4. **Basemap & Credentials**: CARTO Voyager basemap (`https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png`) was confirmed working with URL key authentication (`?api_key=...`). The API key is securely isolated in `frontend/.env` (which is in `.gitignore`) and accessed via `import.meta.env.VITE_CARTO_API_KEY`.
5. **Locked Model Integrity**: Baseline SHA-256 hash was verified prior to any work:
   `4cb736e53c66c78dbbcbc1cf7ca3ac965af01f1c7fae829502649b018e127280`.

---

## 2. Stage 1 — Routing & Shared Application Shell

1. **Router Configuration**: Configured `<BrowserRouter>` in `frontend/src/main.tsx` wrapped by the custom `<ErrorBoundary>`.
2. **Shared Layout Shell (`frontend/src/components/layout/AppLayout.tsx`)**:
   - Contains top fixed `<Header />` with route pills.
   - Embeds `<Outlet />` for child page components.
   - Houses `<ToastContainer />` for global alert notifications.
3. **Header Navigation (`frontend/src/components/layout/Header.tsx`)**:
   - Replaced internal tab state buttons with React Router `<NavLink>` components.
   - Implemented active styling: `bg-white text-teal-700 shadow-xs border-slate-200/80 font-semibold`.
   - Real-time backend status badge (`ONLINE` / `OFFLINE`) with pulsing emerald beacon.
   - Built a collapsible mobile drawer navigation toggled via hamburger button for viewports below `1280px` (`xl:`).
4. **Route Declarations (`frontend/src/App.tsx`)**:
   - `/` -> `OverviewPage`
   - `/lst` -> `LstPage`
   - `/hotspots` -> `HotspotsPage`
   - `/indices` -> `IndicesPage`
   - `/persistence` -> `PersistencePage`
   - `/clusters` -> `ClustersPage`
   - `/model` -> `ModelPage`
   - `/methodology` -> `MethodologyPage`
   - `*` -> `NotFoundPage` (custom 404 page with navigation links)

---

## 3. Stage 2 — Overview Page Implementation

1. **OverviewMap Component (`frontend/src/components/map/OverviewMap.tsx`)**:
   - Leaflet map centered at `[12.3051, 76.6554]` with zoom level 12.
   - High-resolution CARTO Voyager light basemap with proper attribution.
   - Mysuru Urban Local Body (ULB) boundary polygon displayed with teal accent stroke and subtle fill.
   - Interactive mouse move coordinate tracker displaying current Latitude/Longitude.
   - CRS metadata badge: `UTM Zone 43N / WGS 84 (EPSG:32643)`.
   - Automated resize listener calling `map.invalidateSize()` ensuring no tile collapse in scrollable page containers.
2. **Overview Page Content (`frontend/src/pages/OverviewPage.tsx`)**:
   - **Hero Section**: Title, study area metadata (Mysuru, Karnataka, India), date selector with 8 Landsat acquisition dates, and quick status badges.
   - **4 Verified Stat Cards**:
     - *Built Area Domain*: $132.13\text{ km}^2$ ($146,812$ valid analysis pixels)
     - *Zonal Mean LST*: $43.14\ ^\circ\text{C}$ (Peak heat observation date: 2023-05-11)
     - *Hotspot Area*: $34.54\text{ km}^2$ ($26.14\%$ study area coverage)
     - *Locked Model F1-Score*: $86.60\%$ (Random Forest independent test set)
   - **Side-by-Side Research Workflow**: 4-step pipeline card alongside the interactive Leaflet AOI map.
   - **6 Deep-Dive Navigation Cards**: Direct transition links with descriptions to `/lst`, `/hotspots`, `/indices`, `/persistence`, `/clusters`, and `/model`.

---

## 4. Test Verification & Results

### 4.1 Backend Pytest Suite
Command: `python -m pytest backend/tests/test_api.py -v`
Result: **16/16 PASSED** in 3.10 seconds.
- Health check endpoints (`/` and `/api/v1/health`): Passed
- Raster tiles (LST, NDVI, NDBI, RF prob/class, Persistence, Gi\*): Passed
- NoData tile rendering (empty PNG on out-of-bounds): Passed
- Statistics endpoints (zonal, hotspot, persistence, Gi\*): Passed

### 4.2 Frontend TypeScript Check
Command: `npx tsc --noEmit` (in `frontend/`)
Result: **0 Errors**. All JSX/TSX components, imports, and route types strictly validated.

### 4.3 Frontend Production Build
Command: `npm run build` (in `frontend/`)
Result: **Build Succeeded** in 4.90 seconds. Production bundle generated cleanly:
- `dist/index.html` (1.14 kB)
- `dist/assets/index-CnuB8nBx.css` (34.94 kB, gzip: 6.37 kB)
- `dist/assets/index-BfqItF7z.js` (431.92 kB, gzip: 126.95 kB)

### 4.4 Automated Browser & Route Testing (Playwright)
An automated browser test was executed against `http://localhost:5173`:
1. Navigated to all 8 routes (`/`, `/lst`, `/hotspots`, `/indices`, `/persistence`, `/clusters`, `/model`, `/methodology`).
2. Performed direct page reload on every route: Succeeded without route loss.
3. Tested browser back and forward history navigation: Succeeded seamlessly.
4. Tested unknown route `/invalid-route-slug`: Rendered custom 404 page with return link.
5. Tested responsive layouts at 1440x900, 1280x800, 768x1024, and 390x844: Succeeded without horizontal overflow or broken elements.
6. Tested mobile navigation drawer: Hamburger click opens drawer with 8 view cards; selection closes drawer and navigates to target route.
7. Console audit: 0 unhandled JavaScript exceptions or console errors.

---

## 5. Visual Evidence & Screenshots

The captured high-resolution verification screenshots are saved in `reports/screenshots/`:

| Screenshot File | Description | Dimensions |
| :--- | :--- | :--- |
| `13_overview_desktop_1440x900.png` | Overview page full desktop view with hero, 4 metric cards, AOI map, workflow, and analytical cards | 1440 × 900 |
| `14_overview_laptop_1280x800.png` | Laptop view demonstrating responsive grid alignment and compact spacing | 1280 × 800 |
| `15_overview_tablet_768x1024.png` | Tablet view showing stacked 2-column card layouts and clean typography | 768 × 1024 |
| `16_overview_mobile_390x844.png` | Mobile view displaying single-column flow and 44px touch targets | 390 × 844 |
| `17_mobile_nav_drawer.png` | Mobile navigation drawer open with 8 geospatial view cards | 390 × 844 |
| `18_404_not_found.png` | Custom 404 Not Found error screen with return button | 1440 × 900 |

---

## 6. Model & Research Integrity Check

- **Model File**: `models/random_forest_final_step10_8.joblib`
- **Expected SHA-256**: `4cb736e53c66c78dbbcbc1cf7ca3ac965af01f1c7fae829502649b018e127280`
- **Verified SHA-256**: `4cb736e53c66c78dbbcbc1cf7ca3ac965af01f1c7fae829502649b018e127280`
- **Integrity Status**: **100% UNCHANGED AND VERIFIED**.
- **Data Integrity**: Zero changes to GeoTIFF rasters, reference datasets, or statistical algorithms.
- **Scientific Terminology**: Labels strictly termed *pseudo-reference labels*, and hotspots described as *radiometric surface thermal hotspots*.
- **Secret Isolation**: CARTO API key confirmed excluded from repository tracking.

---

## 7. Next Steps (Pending Approval)

Stages 0, 1, and 2 are complete. In accordance with the execution control protocol, work is paused for user review and approval before proceeding with:
- **Stage 3**: LST Explorer (`/lst`)
- **Stage 4**: ML Hotspot Analysis (`/hotspots`)
- **Stage 5**: Environmental Indices (`/indices`)
- **Stage 6**: Persistence & Clustering (`/persistence`, `/clusters`)
- **Stage 7**: Model & Evaluation (`/model`)
- **Stage 8**: Methodology (`/methodology`)
