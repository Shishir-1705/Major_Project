# Phase 1.1 Documentation: Light Basemap & Visual Presentation

**Project:** Machine Learning-Based Urban Heat Hotspot Detection Using LST, NDVI and NDBI from Landsat Imagery  
**Study Area:** Mysuru, Karnataka, India  
**Date:** October 2026  
**Status:** IMPLEMENTED & VERIFIED  

---

## 1. Objective & Design Rationale

Phase 1 established a modern, clean light SaaS application shell (`#f8fafc` canvas, `#ffffff` surfaces, `#0f172a` typography). However, the central map still used the pitch-black CARTO Dark Matter (`dark_all`) basemap, which created a visual disconnect with the surrounding light user interface.

Phase 1.1 refines the map presentation by integrating a realistic, road-oriented light geographic basemap that:
1. Seamlessly integrates with the light design system.
2. Displays clear, recognizable geographic features (roads, highways, water bodies, and neighborhood labels around Mysuru).
3. Preserves research raster overlays, analytical statistics, AOI boundaries, and the locked Random Forest model without alteration.

---

## 2. Basemap Provider Evaluation & Endpoint Verification

### 2.1 Provider Options Evaluated

We evaluated three potential light basemap configurations available from CARTO:

| Option | Candidate Endpoint URL | Test Result | Assessment |
| :--- | :--- | :--- | :--- |
| **A. CARTO Voyager (`rastertiles/voyager`)** | `https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png` | **200 OK** (image/png) | **Selected**: Full road hierarchy, warm landcover, blue water bodies, green parks, high-legibility place labels. |
| **B. CARTO Positron (`light_all`)** | `https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png` | **200 OK** (image/png) | Monochromatic and washed out; lacks clear road classification and water distinction. |
| **C. Incomplete String Replacements** | `https://{s}.basemaps.cartocdn.com/voyager/{z}/{x}/{y}{r}.png` | **404 Not Found** | Proved that simply changing `dark_all` to `voyager` fails. The official CARTO endpoint requires the `/rastertiles/voyager/` prefix. |

### 2.2 Selected Basemap: CARTO Voyager

**CARTO Voyager** was selected because:
- **Road Network Hierarchy:** Major highways (Bangalore-Mysuru Highway, Outer Ring Road), primary arterial corridors, and residential streets are distinctly rendered in warm golden and white hues.
- **Hydrological & Natural Features:** River Cauvery, KRS reservoir backwaters, and municipal lakes (Kamanakere, Kukkarahalli) are clearly delineated in soft blue.
- **Toponymic Precision:** High-resolution place labels accurately depict Mysuru city center, Srirangapatna, Chamundipuram, Mysore University Layout, Bandipalya, Rammanahalli, Belavadi, Siddalingapura, and surrounding rural/urban fringes.
- **Overlay Legibility:** The soft, warm off-white land tones provide an ideal neutral canvas for Landsat LST thermal gradients, NDVI canopy greens, and Random Forest probability heatmaps.

---

## 3. Authentication & Security Handling

CARTO raster basemaps require authentication to prevent the "API KEY REQUIRED" watermark:

1. **Environment Configuration:**
   The API key is securely stored in `frontend/.env` under the variable `VITE_CARTO_API_KEY`.
2. **Ignored from Git:**
   `frontend/.env` is tracked in `.gitignore` and is never committed to source control.
3. **URL Construction in `MapWorkspace.tsx`:**
   ```ts
   const cartoApiKey = import.meta.env.VITE_CARTO_API_KEY;
   const cartoBasemapUrl = cartoApiKey
     ? `https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png?key=${cartoApiKey}&api_key=${cartoApiKey}`
     : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
   ```
4. **Attribution:**
   ```tsx
   <TileLayer
     url={cartoBasemapUrl}
     attribution='&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
     maxZoom={18}
   />
   ```
5. **Security Audit:**
   No API keys, credentials, or secrets are exposed in client-side code, logs, reports, screenshots, or Git commits.

---

## 4. Preservation of Research Integrity

The basemap transition has **zero impact** on the research pipeline:
- **Raster Layers:** All 7 GeoTIFF research layers (`lst`, `ndvi`, `ndbi`, `rf_prob`, `rf_class`, `persistence`, `gi_star`) continue streaming dynamically via FastAPI Web Mercator tile endpoints.
- **Temporal Acquisitions:** All 8 observation dates (April 1 to May 27, 2023) remain fully accessible and interactive through the floating timeline.
- **Statistics & Zonal Aggregations:** Zonal statistics (built area: 132.13 km², LST mean: 43.14 °C, hotspot area: 34.54 km², RF probability: 0.273) remain strictly calculated against valid GeoTIFF pixels.
- **Locked ML Model:** Model SHA-256 checksum remains verified at `4cb736e53c66c78dbbcbc1cf7ca3ac965af01f1c7fae829502649b018e127280`.
- **AOI Boundary:** The study area boundary polygon (`EPSG:32643`) is rendered in refined teal (`#0d9488`, `weight: 2.5`, dashed line `6, 8`), perfectly visible against the light basemap.
