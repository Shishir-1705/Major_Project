# Dashboard Navigation & Interaction Validation

**Project:** Machine Learning-Based Urban Heat Hotspot Detection Using LST, NDVI and NDBI from Landsat Imagery  
**Study Area:** Mysuru, Karnataka, India  
**Date:** October 14, 2026  
**Status:** Completed and Verified via Headless Chromium Automation

---

## 1. Executive Summary

This document verifies the end-to-end functionality of the top navigation buttons and their synchronization with the Leaflet map workspace, sidebar layer selector, dynamic tile streaming, analytics cards, and research methodology modals.

Prior to Step 27, top navigation tabs executed `setActiveTab(tab)` which updated an isolated string in `useAppStore` without synchronizing `activeLayer`, tile requests, or analytics. In Step 27, bidirectional state synchronization was implemented between `activeTab` and `activeLayer`, ensuring that every navigation tab and sidebar selection triggers the exact research raster layer, tile stream, and zonal statistics calculation.

---

## 2. Root Cause Analysis

1. **State Isolation:** In `useAppStore.ts`, `activeTab` and `activeLayer` were separate state variables. `setActiveTab` only set `activeTab: tab` and did not update `activeLayer` or trigger `fetchLayerStats()`.
2. **Missing Nav Handlers:** Clicking top navigation tabs did not trigger map tile updates or analytics refreshes.
3. **Absence of Subview Selectors:** Multi-layer views (`ML Hotspots` containing `rf_prob` & `rf_class`; `NDVI / NDBI` containing `ndvi` & `ndbi`) lacked header-level subview selection.
4. **Decoupled Sidebar:** Clicking items in the sidebar updated `activeLayer` but never updated `activeTab`, leaving the top navigation highlight desynchronized.

---

## 3. Implemented Navigation Architecture

### A. Bidirectional State Synchronization
When either the top navigation or the sidebar updates, both `activeTab` and `activeLayer` synchronize instantaneously:

```
Top Navigation Click (e.g. "ML Hotspots")
     │
     ▼
useAppStore.setActiveTab('ml') ──► updates activeTab = 'ml'
     │                         ──► updates activeLayer = 'rf_prob'
     │                         ──► calls fetchLayerStats()
     ▼
MapWorkspace updates TileLayer URL to /api/v1/tiles/rf_prob/...
Sidebar highlights "ML Hotspot Prob"
AnalyticsPanel calculates Zonal Probability (0.273)
```

```
Sidebar Click (e.g. "NDBI Built-up")
     │
     ▼
useAppStore.setActiveLayer('ndbi') ──► updates activeLayer = 'ndbi'
     │                             ──► updates activeTab = 'environment'
     │                             ──► calls fetchLayerStats()
     ▼
Top Navigation highlights "NDVI / NDBI" with [NDBI] active
MapWorkspace renders NDBI tiles
AnalyticsPanel displays NDBI Zonal Mean (-0.049 Index)
```

### B. Navigation Item Behaviors

| Button | Target Layer | Target Tab | Context / Subview Action |
| :--- | :--- | :--- | :--- |
| **Overview** | `lst` | `overview` | Default overview dashboard with LST baseline layer |
| **LST Map** | `lst` | `thermal` | Land Surface Temperature raster in °C |
| **ML Hotspots** | `rf_prob` / `rf_class` | `ml` | RF Hotspot predictions with `[Prob \| Class]` subview selector |
| **NDVI / NDBI** | `ndvi` / `ndbi` | `environment` | Environmental spectral indices with `[NDVI \| NDBI]` selector |
| **Persistence**| `persistence` | `persistence` | Multi-temporal recurrence raster (date-independent) |
| **Gi* Clusters**| `gi_star` | `clusters` | Getis-Ord Gi* spatial clustering raster (date-independent) |
| **Methodology** | N/A | Modal | Opens scientific methodology and model governance modal |

---

## 4. Headless Browser Automation Test Results

Automated end-to-end testing was conducted using Playwright Chromium (`1440x900` viewport) against live services:
- **FastAPI Backend:** `http://127.0.0.1:8000`
- **Vite Dev Server:** `http://localhost:5173`

```text
Sequence Tested:
1. Overview           -> Active View: LST Map            | Zonal Mean: 43.14 °C   [PASS]
2. LST Map            -> Active View: LST Map            | Zonal Mean: 43.14 °C   [PASS]
3. ML Hotspots (Prob) -> Active View: ML Hotspot Prob    | Zonal Mean: 0.273 Prob [PASS]
   ML Hotspots (Class)-> Active View: ML Hotspot Class   | Zonal Mean: 0.25 Class [PASS]
4. NDVI / NDBI (NDVI) -> Active View: NDVI Vegetation    | Zonal Mean: 0.402 Index[PASS]
   NDVI / NDBI (NDBI) -> Active View: NDBI Built-up      | Zonal Mean:-0.049 Index[PASS]
5. Persistence        -> Active View: Heat Persistence   | Zonal Mean: 0.106 Rec  [PASS]
6. Gi* Clusters       -> Active View: Gi* Clusters       | Zonal Mean: 0.17 z-scr [PASS]
7. Methodology        -> Modal Opened (Governance text)  | Visibility: True       [PASS]
8. Close Methodology  -> Modal Closed                    | Visibility: False      [PASS]
9. Return to Overview -> Active View: LST Map            | Zonal Mean: 43.14 °C   [PASS]
10. Sidebar Sync      -> Clicked NDBI -> Nav: NDVI / NDBI| Zonal Mean:-0.049 Index[PASS]

Tile Stream Requests: 128 dynamic 256x256 Web Mercator PNG tiles delivered
Unique Tile Layers: ['gi_star', 'lst', 'ndbi', 'ndvi', 'persistence', 'rf_class', 'rf_prob']
Browser Console Errors: 0
```

---

## 5. Scientific Integrity Verification

- **Locked Model File:** `models/random_forest_final_step10_8.joblib`
- **Verified SHA-256:** `4cb736e53c66c78dbbcbc1cf7ca3ac965af01f1c7fae829502649b018e127280`
- Predictors strictly remain `NDVI` and `NDBI` with thermal LST excluded.
