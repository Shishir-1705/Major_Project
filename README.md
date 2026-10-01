# Machine Learning-Based Urban Heat Hotspot Detection Using LST, NDVI and NDBI from Landsat Imagery

**Study Area:** Mysuru, Karnataka, India  
**Spatial Resolution:** 30 m (UTM Zone 43N / EPSG:32643)  
**Primary Temporal Window:** April 1 – May 27, 2023 (8 Pre-monsoon Landsat 8/9 Acquisitions)  
**ML Model:** Random Forest Classifier (`n_estimators=100`, `max_depth=5`, Gini Criterion) — **LOCKED**  
**Predictors:** NDVI + NDBI ONLY (LST 100% Excluded from Model Features)  
**System Architecture:** Python FastAPI REST Backend + React 18 / TypeScript / Leaflet Interactive Geospatial Web Application  

---

## Development Roadmap & Status

- [x] **Step 1: Area of Interest (AOI) Definition & Boundary Verification**
- [x] **Step 2: Landsat 8/9 Dataset Acquisition & Metadata Verification**
- [x] **Step 3: Preprocessing, QA Masking & Scale Factor Calibration**
- [x] **Step 4: Spectral Index Computation (NDVI & NDBI)**
- [x] **Step 5: Land Surface Temperature (LST) Derivation & Calibration**
- [x] **Step 6: Hotspot Reference Label Generation (Percentile Thresholds)**
- [x] **Step 7: Machine Learning Feature Extraction & Stratified Sampling**
- [x] **Step 8: Spatially Aware GroupKFold Cross-Validation & Model Training**
- [x] **Step 9: Spatial Hotspot Prediction & Built Mask Raster Generation**
- [x] **Step 10: Multi-Temporal Persistence & Getis-Ord $G_i^*$ Spatial Clustering Analysis**
- [x] **Step 10.10: Final ML Component Audit & Model Lock**
- [x] **Step 11: Full System Architecture & REST API Specification**
- [x] **Step 12: Frontend Foundation & Thermal Intelligence Design System**
- [x] **Step 13: Backend Foundation & Real GeoTIFF Tile Server Integration**
- [x] **Step 14: Full Application Integration (React ↔ FastAPI ↔ Real Data)**
- [x] **Step 14.1: Application Data-Lineage & Statistics Discrepancy Audit**
- [x] **Step 15: Research-Grade UI/UX Polish & Geospatial Visualization**
- [x] **Step 16: Final End-to-End System Validation & Release Readiness**

---

## Locked Machine Learning Model Specification

- **Binary Artifact**: `models/random_forest_final_step10_8.joblib`
- **SHA-256 Checksum**: `4cb736e53c66c78dbbcbc1cf7ca3ac965af01f1c7fae829502649b018e127280`
- **Predictor Features**: `['NDVI', 'NDBI']`
- **Target Label**: `"LST-derived thermal hotspot reference labels"`
- **Hyperparameters**: `n_estimators=100`, `criterion='gini'`, `max_depth=5`, `min_samples_split=10`, `min_samples_leaf=5`, `max_features='sqrt'`, `random_state=42`
- **Locked Test Performance (Spatially Isolated 195-Sample Test Set)**:
  - Accuracy: **86.67%**
  - F1-Score: **86.60%**
  - Precision: **86.60%**
  - Recall: **86.60%**
  - Cohen's Kappa: **0.7333**
  - ROC-AUC: **93.37%**
  - PR-AUC: **93.67%**
  - Brier Score: **0.1059**
  - Confusion Matrix: `{ TN: 85, FP: 13, FN: 13, TP: 84 }`
- **Feature Importances**: NDBI = **61.03%**, NDVI = **38.97%**

---

## System Quick Start & Deployment Guide

### Prerequisites
- Python 3.12+
- Node.js 18+ & npm

### 1. Backend Setup & Startup
```bash
# Navigate to project root
cd d:/Major_Project

# Install Python dependencies
pip install -r requirements.txt

# Launch FastAPI Backend Server (Port 8000)
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
```
Backend Swagger Interactive Docs: `http://localhost:8000/docs`

### 2. Frontend Setup & Startup
```bash
# Navigate to frontend directory
cd d:/Major_Project/frontend

# Install Node dependencies
npm install

# Run Frontend Development Server (Port 5173)
npm run dev

# Run Production Type Check & Build
npx tsc --noEmit
npm run build
```
Frontend Application URL: `http://localhost:5173`

---

## API Endpoints Reference

| Endpoint | Method | Response Description |
| :--- | :--- | :--- |
| `/api/v1/metadata` | `GET` | Study area metadata, CRS, extent, pixel counts, and total built area ($132.129\text{ km}^2$). |
| `/api/v1/dates` | `GET` | List of 8 verified Landsat acquisition dates (`2023-04-01` to `2023-05-27`). |
| `/api/v1/layers` | `GET` | Available map layers (`lst`, `ndvi`, `ndbi`, `rf_prob`, `rf_class`, `persistence`, `gi_star`). |
| `/api/v1/model` | `GET` | Locked Random Forest model SHA-256 hash, hyperparameters, and test evaluation metrics. |
| `/api/v1/statistics/zonal` | `GET` | Zonal mean, min, max, std. dev., valid pixels, and area ($km^2$) for active date/layer. |
| `/api/v1/statistics/hotspot` | `GET` | Hotspot pixel counts, non-hotspot counts, surface area ($km^2$), and percentage of built area. |
| `/api/v1/statistics/persistence` | `GET` | Multi-temporal recurrence category breakdown (Categories 1–5). |
| `/api/v1/statistics/gi-star` | `GET` | Getis-Ord $G_i^*$ spatial autocorrelation cluster breakdown ($99\%$, $95\%$, $90\%$ confidence levels). |
| `/api/v1/tiles/{layer}/{key}/{z}/{x}/{y}.png` | `GET` | Dynamic XYZ 256x256 map tile stream reprojected on-the-fly from EPSG:32643 to EPSG:3857. |

---

## Scientific Governance Statement

> **Target Designation & Predictor Decoupling:** Target classes represent **"LST-derived thermal hotspot reference labels"**. The machine learning model predicts satellite-derived thermal reference categories from optical surface properties (`NDVI + NDBI`) and does not predict ambient air temperatures or official ground heatwave warnings. LST is 100% excluded from model predictor inputs.

---

## Automated Verification Commands

```bash
# Run Backend Pytest Suite (13/13 Passed)
python -m pytest backend/tests/test_api.py

# Run Frontend Type Check (0 Errors)
cd frontend && npx tsc --noEmit

# Run Frontend Production Build (0 Errors)
cd frontend && npm run build
```
