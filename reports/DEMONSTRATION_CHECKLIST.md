# Thermal Intelligence — Demonstration & Evaluation Checklist

**Project:** Machine Learning-Based Urban Heat Hotspot Detection Using LST, NDVI and NDBI from Landsat Imagery  
**Study Region:** Mysuru, Karnataka, India (`EPSG:32643`, UTM Zone 43N)  
**Evaluator / Presenter:** Final Academic Review Committee & Presenters  
**Document Status:** Pre-Demonstration Verification Checklist (Increment 3.12)

---

## Instructions for Presenters

Complete this checklist 15 to 30 minutes before presenting to the examination committee. Each item verifies an operational, scientific, or visual component of the Thermal Intelligence platform.

---

## Phase 1 — Environment & Service Startup

- [ ] **1.1 Working Directory Confirmed**  
  Terminal is located at project root: `D:\Major_Project`.

- [ ] **1.2 Backend Process Active**  
  Run `python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000` (or `.\start_backend.bat`).  
  *Verify:* Terminal outputs `Uvicorn running on http://127.0.0.1:8000`.

- [ ] **1.3 Frontend Process Active**  
  Run `npm --prefix frontend run dev` (or `.\start_frontend.bat`).  
  *Verify:* Terminal outputs `VITE ready ... Local: http://localhost:5173/`.

- [ ] **1.4 API Health Telemetry Responding**  
  Open browser to `http://127.0.0.1:8000/health`.  
  *Verify:* Returns `{"status": "ok", "service": "urban-heat-hotspot-api"}` with HTTP 200.

- [ ] **1.5 Candidate Real-Data Mode Active**  
  Verify `USE_CANDIDATE_DATA = True` in `backend/app/config.py`.  
  *Verify:* Querying `/api/v1/statistics/gi-star` returns $135.247\text{ km}^2$ analysis domain.

---

## Phase 2 — Core Page Loading & Rendering

Open `http://localhost:5173/` in a modern browser (Chrome, Edge, or Firefox at 100% zoom).

- [ ] **2.1 Header Telemetry Status**  
  Top-right header displays a pulsing green pill: **`● SERVER ONLINE`**.

- [ ] **2.2 Landing Page (`/`)**  
  * Hero headline visible: *"See the Heat. Understand the City."*
  * Side-by-side CTA buttons: *"Explore the Analysis"* and *"Discover the Research"*.
  * Metadata strip displayed: `Sensor: Landsat 8/9 Level-2`, `Grid: 30m • UTM 43N`, `Model: Locked RF (86.7% Acc)`.
  * Interactive raster tabs (`Thermal LST`, `ML Hotspots`, `NDVI Canopy`) toggle previews cleanly.
  * Surface Thermal Dynamics and Research Pipeline sections render on scroll.

- [ ] **2.3 Analytical Overview (`/overview`)**  
  * Telemetry hub shows: Built Area ($132.13\text{ km}^2$), Zonal Temp ($44.07^\circ\text{C}$), Hotspot Area ($71.91\text{ km}^2$), Locked F1 ($86.60\%$).
  * Mysuru AOI map boundary pill reads: `Mysuru AOI: 461.50 km² Extent (135.25 km² Valid Domain)`.

- [ ] **2.4 LST Explorer (`/lst`)**  
  * Calibrated thermal raster renders over Mysuru with transparent cloud masks.
  * Date selector steps through all 8 acquisition dates (`2023-04-01` to `2023-05-27`).
  * Temperature legend displays $30.0^\circ\text{C}$ to $55.0^\circ\text{C}$, with P20 ($42.7^\circ\text{C}$) and P80 ($47.1^\circ\text{C}$).
  * Explicit note displayed: *"surface skin temp (~10:45 AM overpass), not ambient 2 m air temp."*

- [ ] **2.5 ML Hotspots (`/hotspots`)**  
  * Prediction layer loads from candidate rasters.
  * Toggle between **Probability** (continuous $[0.00, 1.00]$) and **Classification** (binary $\tau \ge 0.50$).
  * Locked model telemetry shows: F1 $86.60\%$, Precision $86.6\%$, Recall $86.6\%$, NDBI $61.0\%$, NDVI $39.0\%$.

- [ ] **2.6 Environmental Indices (`/indices`)**  
  * NDVI (canopy density $[-0.20, +0.80]$) and NDBI (built density $[-0.40, +0.60]$) toggle cleanly.
  * Mathematical band formulas render clearly in the sidebar.

- [ ] **2.7 Multi-Temporal Persistence (`/persistence`)**  
  * 5-tier recurrence frequency renders.
  * Chronic Hotspots card shows $23.19\text{ km}^2$ ($17.1\%$).
  * Subtitle reads: `Share of 135.25 km² valid domain`.

- [ ] **2.8 Getis-Ord Gi* Clusters (`/clusters`)**  
  * Active Context Banner displays: `Valid Analysis Domain: 135.247 km²` and `Study Area Extent: 461.50 km² AOI Envelope`.
  * Significant Hotspots: $18.71\text{ km}^2$ ($13.8\%$).
  * Significant Coldspots: $24.17\text{ km}^2$ ($17.9\%$).
  * Not Statistically Significant: $92.36\text{ km}^2$ ($68.3\%$).
  * Cluster subtitles read: `Share of 135.25 km² valid domain`.
  * Non-significant description reads: *"Not statistically significant at FDR-adjusted p < 0.05."*
  * Map legend explicitly states multiple-testing adjustment across $150,274\text{ spatial tests}$.

- [ ] **2.9 Model Specification & Evaluation (`/model`)**  
  * Locked model SHA-256 hash displayed: `4cb736e53c66c78dbbcbc1cf7ca3ac965af01f1c7fae829502649b018e127280`.
  * Spatial block partitioning: 30 train blocks ($N = 805$), 10 test blocks ($N = 195$).
  * Confusion matrix displayed: TN=85, FP=13, FN=13, TP=84.
  * Metrics displayed: Accuracy $86.67\%$, Precision $86.60\%$, Recall $86.60\%$, F1 $86.60\%$, ROC-AUC $93.37\%$, PR-AUC $93.67\%$, Cohen's Kappa $0.7333$, Brier Score $0.1059$.

- [ ] **2.10 Research Methodology (`/methodology`)**  
  * Study Area table displays `Baseline Built Domain: 132.13 km²` alongside `Valid Analysis Domain: 135.25 km²`.
  * Explains that LST derives reference labels, while NDVI and NDBI are the model predictors.

---

## Phase 3 — Consistency & No-Regression Verifications

- [ ] **3.1 Absence of Stale Synthetic Statistics**  
  Confirm no page displays legacy hardcoded constants (`84.801 km²`, `8.856 km²`, or `93.657 km²`).

- [ ] **3.2 Map Pan & Zoom Responsiveness**  
  Map canvas pans smoothly without flickering or unhandled WebGL/Leaflet errors.

- [ ] **3.3 Sidebar Layout & Text Wrapping**  
  Metric card descriptions wrap naturally on desktop viewport ($1440\text{ px}$ and $1280\text{ px}$) without truncation or line-clamp ellipses.

- [ ] **3.4 Disaster Recovery & Backup Material**  
  High-resolution backup screenshots are accessible locally under `reports/screenshots/increment3_11/` in case of unexpected network or hardware interruption:
  * `landing_desktop.png`
  * `overview_desktop.png`
  * `lst_desktop.png`
  * `hotspots_desktop.png`
  * `indices_desktop.png`
  * `persistence_desktop.png`
  * `clusters_desktop.png`
  * `model_desktop.png`
  * `methodology_desktop.png`

---

## Pre-Demonstration Sign-Off

| Verification Item | Verified By | Date & Time | Notes |
| :--- | :---: | :---: | :---: |
| Backend & Frontend Startup | Presenter | `____-__-__ __:__` | Ports 8000 & 5173 active |
| All 9 Pages Operational | Presenter | `____-__-__ __:__` | HTTP 200, 0 console errors |
| Statistical Consistency | Presenter | `____-__-__ __:__` | Candidate real domain verified |
| Model Checksum Locked | Presenter | `____-__-__ __:__` | SHA-256 integrity confirmed |
