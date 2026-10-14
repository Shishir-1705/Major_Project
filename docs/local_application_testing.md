# Local Application Execution & Verification Guide

**Project:** Machine Learning-Based Urban Heat Hotspot Detection Using LST, NDVI and NDBI from Landsat Imagery  
**Study Area:** Mysuru, Karnataka, India  
**Date:** October 2026  
**Status:** **OPERATIONAL & VERIFIED ON WINDOWS LOCALHOST**  

---

## 1. Overview

This guide provides instructions and technical specifications for executing and testing the complete Urban Heat Hotspot Detection platform directly on a Windows workstation without requiring Docker or virtualization.

The application comprises:
- **FastAPI Backend (Python 3.12):** Serves real Landsat 8/9 satellite rasters, dynamic XYZ 256x256 Web Mercator tile streams, locked Random Forest predictions, and spatial analytics on `http://127.0.0.1:8000`.
- **React 18 + Vite Frontend:** An interactive geospatial dashboard featuring Leaflet map rendering, CARTO Dark Matter authenticated basemaps, layer opacity controls, timeline playback, and live statistical cards on `http://localhost:5173`.

---

## 2. Environment Configuration

### Frontend Configuration (`frontend/.env`)
Create or verify `frontend/.env` (excluded from version control):
```env
# Backend API Base URL
VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1

# CARTO Basemap API Key (Browser-authenticated client credential)
# Replace with your actual CARTO API key
VITE_CARTO_API_KEY=<your_carto_api_key>
```

> **Security Notice:** `frontend/.env` is strictly ignored by `.gitignore` and must never be committed to Git. `VITE_` variables are embedded into client-side JavaScript bundles and visible in the browser.

### Backend Configuration (`backend/.env` — Optional)
Backend uses default loopback bindings for local execution:
```env
HOST=127.0.0.1
PORT=8000
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000
```

---

## 3. Application Startup Instructions

### Method A: Using Pre-Configured Batch Scripts (Recommended)

1. **Start the FastAPI Backend:**
   Double-click `start_backend.bat` or run from PowerShell:
   ```cmd
   start_backend.bat
   ```
   - Bound Address: `http://127.0.0.1:8000`
   - API Documentation: `http://127.0.0.1:8000/docs`
   - Health Endpoint: `http://127.0.0.1:8000/api/v1/health`

2. **Start the React Frontend:**
   Double-click `start_frontend.bat` or run from a separate PowerShell window:
   ```cmd
   start_frontend.bat
   ```
   - Application URL: `http://localhost:5173`

---

### Method B: Manual Terminal Execution

1. **Backend Terminal:**
   ```powershell
   cd D:\Major_Project
   python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
   ```

2. **Frontend Terminal:**
   ```powershell
   cd D:\Major_Project\frontend
   npm run dev
   ```

---

## 4. Stopping the Application

- **Backend:** Press `Ctrl + C` in the backend terminal window.
- **Frontend:** Press `Ctrl + C` in the frontend terminal window.

If running in the background, you can terminate by port using PowerShell:
```powershell
# Terminate Backend on Port 8000
Get-NetTCPConnection -LocalPort 8000 | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }

# Terminate Frontend on Port 5173
Get-NetTCPConnection -LocalPort 5173 | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
```

---

## 5. Automated Verification & Regression Suite

Run these automated commands from the project root (`D:\Major_Project`):

```powershell
# 1. Run Backend Pytest Suite (14/14 Passed)
python -m pytest backend/tests/test_api.py -v

# 2. Run Frontend Type Check (0 Errors)
cd frontend
npx tsc --noEmit

# 3. Run Frontend Production Build (Zero Errors)
npm run build
```

---

## 6. Live API Endpoint Inventory

| Endpoint | Method | Expected Output / Purpose |
| :--- | :---: | :--- |
| `/api/v1/health` | `GET` | `{"status": "ok", "service": "urban-heat-hotspot-api"}` |
| `/api/v1/metadata` | `GET` | Study area (`Mysuru`), CRS (`EPSG:32643`), total area (`461.50 km²`), built area (`132.129 km²`), locked model SHA-256 (`4cb736e5...`) |
| `/api/v1/dates` | `GET` | List of 8 observation dates (`2023-04-01` to `2023-05-27`) with satellite mission IDs |
| `/api/v1/layers` | `GET` | 7 supported layer definitions (`lst`, `ndvi`, `ndbi`, `rf_prob`, `rf_class`, `persistence`, `gi_star`) |
| `/api/v1/model` | `GET` | Locked RF model metadata, predictors (`NDVI`, `NDBI`), test metrics (Acc: 86.67%, F1: 86.60%, ROC-AUC: 93.37%), confusion matrix |
| `/api/v1/statistics/zonal?layer=lst&date=YYYY-MM-DD` | `GET` | Zonal mean, min, max, std dev in °C, valid pixel count, and surface area in km² |
| `/api/v1/statistics/hotspot?date=YYYY-MM-DD` | `GET` | Hotspot and non-hotspot pixel counts, areas in km², and percentage of built-up area |
| `/api/v1/statistics/persistence` | `GET` | 5 multi-temporal recurrence persistence categories (Category 1 to Category 5) |
| `/api/v1/statistics/gi-star` | `GET` | 5 Getis-Ord $G_i^*$ spatial clustering confidence classes |
| `/api/v1/tiles/{layer}/{key}/{z}/{x}/{y}.png` | `GET` | Dynamic 256x256 Web Mercator PNG tile reprojected on-the-fly from EPSG:32643 GeoTIFFs |

---

## 7. Manual Browser Verification Checklist

Open `http://localhost:5173` in Google Chrome, Microsoft Edge, or Mozilla Firefox:

- [ ] **Header:** Displays "Urban Heat Hotspot Intelligence Platform — Mysuru, Karnataka, India" and indicates `ANALYSIS SERVER ONLINE` with green indicator.
- [ ] **CARTO Basemap:** Dark Matter basemap renders smoothly without watermark or API key error popups.
- [ ] **Study Area Overlay:** Mysuru urban boundary outline (polygon) is clearly visible.
- [ ] **Layer Switching:** Clicking `LST Map`, `NDVI Vegetation`, `NDBI Built-up`, `ML Hotspot Prob`, `ML Hotspot Class`, `Multi-Temporal Persistence`, and `Getis-Ord Gi* Clusters` updates the map layer.
- [ ] **Opacity Slider:** Adjusting the opacity slider from 0% to 100% smoothly alters layer transparency over the basemap.
- [ ] **Timeline Slider:** Clicking or dragging across the 8 observation dates updates the satellite rasters, zonal mean, and hotspot analytics in real time.
- [ ] **Timeline Playback:** Clicking the Play button automatically cycles through the observation dates sequentially.
- [ ] **Analytics Cards:** Verify LST Zonal Mean displays values in `°C`, Hotspot Area displays km² and percentage of built area, and Recurrence / Gi* breakdown renders correctly.
- [ ] **Model Info Card:** Displays locked Random Forest model details, SHA-256 hash `4cb736e5...`, Accuracy `86.67%`, F1-Score `86.60%`, ROC-AUC `93.37%`, and Confusion Matrix `TN: 85 | FP: 13 | FN: 13 | TP: 84`.
- [ ] **Methodology Modal:** Clicking "Methodology & Research Lineage" opens the scientific modal explaining Landsat 8/9 ST_B10 processing, percentile-based reference labeling, predictor decoupling, and spatial block cross-validation.
