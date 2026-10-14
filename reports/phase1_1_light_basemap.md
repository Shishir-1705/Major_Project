# Phase 1.1 Verification Report: Light Basemap & Visual Presentation

**Project Root:** `D:\Major_Project`  
**GitHub Repository:** `https://github.com/Shishir-1705/Major_Project.git`  
**Branch:** `main`  
**Date:** October 2026  
**Status:** VERIFIED & SYNCHRONIZED  

---

## 1. Summary of Actions Completed

1. **Investigated Basemap Endpoints:**
   - Evaluated `rastertiles/voyager`, `voyager_all`, `voyager`, `light_all`, and `rastertiles/light_all` against CARTO's live tile servers.
   - Identified that simple string substitution (`voyager_all` / `voyager`) yields HTTP 404.
   - Verified that the official road-oriented CARTO Voyager endpoint is `https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png`.
2. **Updated `MapWorkspace.tsx`:**
   - Switched tile URL from `dark_all` to `rastertiles/voyager`.
   - Updated main map canvas container background from `bg-slate-900` to `bg-slate-100` to prevent dark flashes during tile loading.
   - Updated attribution to include OpenStreetMap contributors.
   - Preserved API key query parameter passing: `?key=${cartoApiKey}&api_key=${cartoApiKey}`.
3. **Verified Visual Experience & Geographic Landmarks:**
   - Inspected Mysuru's road network, Outer Ring Road, city center, Chamundipuram, Srirangapatna, lakes, and neighborhood labels.
   - Verified that the CARTO basemap loads with **0 watermarks** and **0 diagonal "API KEY REQUIRED" text**.
4. **Captured Multi-Device Screenshots:**
   - `09_light_basemap_desktop.png` (Desktop 1440×900 with LST overlay)
   - `10_light_basemap_mobile.png` (Mobile 390×844 with light basemap)
   - `11_light_basemap_raster_overlay.png` (Laptop 1280×800 with ML Hotspot Prob overlay)
   - `12_light_basemap_mysuru_labels.png` (Close-up showing road network and neighborhood labels at 65% opacity)

---

## 2. Test & Verification Checklist

| Verification Item | Target | Actual Result | Status |
| :--- | :--- | :--- | :--- |
| **Basemap HTTP Status** | 200 OK | HTTP 200 OK, `image/png`, valid bytes | **PASS** |
| **Watermark Check** | Clean, 0 watermarks | Verified in browser screenshots: no watermarks | **PASS** |
| **Geographic Features** | Roads, places, lakes | Outer Ring Road, Bangalore-Mysuru Hwy, Cauvery river, city labels visible | **PASS** |
| **Backend Test Suite** | 16/16 passed | `pytest backend/tests/test_api.py -v` -> 16 passed in 8.69s | **PASS** |
| **TypeScript Typecheck** | 0 errors | `tsc --noEmit` -> 0 errors | **PASS** |
| **Frontend Production Build** | Complete bundle | `npm run build` -> built in 3.94s | **PASS** |
| **Model SHA-256 Checksum** | `4cb736e53c66...` | Verified `4CB736E53C66C78DBBCBC1CF7CA3AC965AF01F1C7FAE829502649B018E127280` | **PASS** |
| **FastAPI Backend Health** | 200 OK | `{"status":"ok","service":"urban-heat-hotspot-api"}` | **PASS** |
| **Vite Dev Server** | 200 OK | Running on port 5173 | **PASS** |
| **7 Raster Overlays** | Intact | `lst`, `ndvi`, `ndbi`, `rf_prob`, `rf_class`, `persistence`, `gi_star` operational | **PASS** |
| **8 Observation Dates** | Intact | April 1 to May 27, 2023 interactive | **PASS** |
| **Security Audit** | 0 exposed secrets | Verified in git diff, reports, screenshots, and source code | **PASS** |

---

## 3. Screenshot Catalog

- `reports/screenshots/09_light_basemap_desktop.png`: Full desktop workspace with CARTO Voyager light basemap, teal AOI polygon boundary, active LST overlay, floating timeline, dynamic legend, and light analytics panel.
- `reports/screenshots/10_light_basemap_mobile.png`: Mobile view demonstrating responsive header, compact status indicator, and full-screen light basemap with visible ring road and city center.
- `reports/screenshots/11_light_basemap_raster_overlay.png`: Active ML Hotspot Probability layer over the light basemap with subview toggle pills and live probability statistics.
- `reports/screenshots/12_light_basemap_mysuru_labels.png`: Close-up of the Mysuru urban core at 65% raster opacity, highlighting underlying road networks, water bodies, and neighborhood labels.
