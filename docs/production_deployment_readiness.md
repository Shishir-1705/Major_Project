# Production Deployment Readiness & Security Audit Guide

**Project:** Machine Learning-Based Urban Heat Hotspot Detection Using LST, NDVI and NDBI from Landsat Imagery  
**Study Area:** Mysuru, Karnataka, India  
**Step:** 22 — Production Deployment Readiness & Security Audit  
**Date:** October 2026  
**Status:** **AUDITED & PRODUCTION-READY (STAGED FOR DEPLOYMENT)**  

---

## 1. Executive Summary

This document establishes the production deployment architecture, security audit results, configuration templates, and operational prerequisites for the Mysuru Urban Heat Hotspot Detection platform.

### Deployment Posture
- **Research Integrity:** 100% preserved. The locked Random Forest model binary (`random_forest_final_step10_8.joblib`, SHA-256: `4cb736e53c66c78dbbcbc1cf7ca3ac965af01f1c7fae829502649b018e127280`), GeoTIFF rasters, evaluation metrics, and scientific methodology remain completely untouched.
- **Security Audit:** Zero secrets, private API keys, or `.env` files are tracked in the Git repository. Public HTTP 404/500 responses have been sanitized to prevent leaking host filesystem paths.
- **Deployment Status:** The application is architecturally prepared and hardened for production deployment. Actual live deployment is deferred to an explicit, authorized deployment phase.

---

## 2. Deployment Architecture Recommendation

The application consists of four distinct architectural tiers:

```
┌────────────────────────────────────────────────────────────────────────┐
│                          TIER 1: CLIENT FRONTEND                       │
│    React 18 + TypeScript + Vite Static Single Page Application (SPA)   │
│              Hosted on CDN / Static Storage / Reverse Proxy            │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTPS API Calls & Tile Streams
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        TIER 2: BACKEND API SERVICE                     │
│         FastAPI (Python 3.12) + Uvicorn ASGI Application               │
│             Containerized Linux Service (Docker / Linux VM)            │
└───────────────────┬────────────────────────────────┬───────────────────┘
                    │ Reads local files              │ External Tiles
                    ▼                                ▼
┌──────────────────────────────────────┐  ┌──────────────────────────────┐
│       TIER 3: ARTIFACT STORAGE       │  │     TIER 4: CARTO BASEMAP    │
│  79 Tracked GeoTIFFs, Models & CSVs  │  │  CARTO Dark Matter Tile API  │
│  Mounted Container Filesystem (~110MB│  │  Browser-authenticated CDN   │
└──────────────────────────────────────┘  └──────────────────────────────┘
```

### Comparative Analysis of Hosting Architectures

| Architecture Option | Frontend | Backend | Artifact Storage | Pros | Cons / Trade-offs | Feasibility |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Option A: Unified Docker Container (Single Host / VM / VPS)** *(Recommended)* | Nginx serving built SPA | FastAPI via Uvicorn behind Nginx reverse proxy | Local filesystem volume (~110 MB) inside container | - Zero CORS complexity (same origin)<br>- Fast local raster access via Rasterio<br>- Predictable low latency<br>- Self-contained | Requires a Linux host/VM with at least 1 GB RAM & 5 GB disk | **High (Recommended)** |
| **Option B: Split Static CDN + Container PaaS** | Vercel / Netlify / Cloudflare Pages | Render / Railway / Fly.io container | Ephemeral / persistent container volume | - Global CDN for frontend assets<br>- Independent scaling of frontend and backend | - Free-tier PaaS instances spin down when idle (cold starts)<br>- CORS configuration required<br>- Disk limits on free tiers | **Viable** |
| **Option C: Serverless / Cloud Functions** | Static CDN | AWS Lambda / Google Cloud Functions | Cloud Object Store (S3 / GCS) via VSI | - Auto-scaling to zero | - Heavy Python dependencies (`rasterio`, `numpy`, `gdal`) exceed function limits<br>- High latency reading rasters from S3<br>- Complex architecture | **Not Recommended** |

### Recommended Architecture: Option A (Unified Containerized Linux Service)
- **Rationale:** Rasterio requires fast, low-latency POSIX filesystem access to extract raster windows from the 30m GeoTIFFs. With a total artifact footprint of only ~110 MB, bundling or mounting the repository artifacts directly into a Linux container running FastAPI behind an Nginx reverse proxy eliminates CORS complications, avoids cold starts, and keeps operating costs predictable.

---

## 3. Environment Variable Configuration

### Frontend Configuration (`frontend/.env.example`)
Vite embeds variables prefixed with `VITE_` directly into the client-side JavaScript bundle during compilation (`npm run build`). They are visible in the user's browser.

```env
# Frontend API Base URL
# Local Development: http://127.0.0.1:8000/api/v1
# Production (Same-origin Reverse Proxy): /api/v1
# Production (Separate API Domain): https://api.yourdomain.example.com/api/v1
VITE_API_BASE_URL=http://127.0.0.1:8000/api/v1

# CARTO Basemap API Key (Browser-visible client credential)
# Acquire key from https://carto.com/
# Production Recommendation: Restrict this key to your production domain
# in the CARTO dashboard to prevent unauthorized third-party usage.
VITE_CARTO_API_KEY=your_carto_api_key_here
```

### Backend Configuration (`backend/.env.example`)

```env
# Server Network Binding
# Development: 127.0.0.1
# Production: 0.0.0.0 (or injected by hosting environment)
HOST=127.0.0.1
PORT=8000

# CORS Allowed Origins
# Comma-separated list of origins permitted to access this API.
# Development: http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000
# Production: https://yourdomain.example.com
CORS_ORIGINS=http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000
```

---

## 4. Backend Production Readiness

### Production Server Startup Command
For Linux / Containerized environments:
```bash
# Standard Production Startup (using Uvicorn)
python -m uvicorn backend.app.main:app --host 0.0.0.0 --port 8000 --workers 2
```

### Cross-Platform & Linux Compatibility
- **Path Handling:** All paths in `backend/app/config.py` use Python's standard `pathlib.Path` resolved relative to `BASE_DIR = Path(__file__).resolve().parent.parent.parent`. Zero hardcoded Windows drive letters (`C:\`, `D:\`) or backslashes exist in the application code.
- **Cache Resilience:** The tile cache directory (`.tile_cache`) is initialized automatically. In read-only or restricted environments, tile generation falls back gracefully to in-memory rendering if disk write fails.
- **Error Sanitization:** `backend/app/api/routes.py` has been updated to return sanitized error messages (`"Requested raster dataset not found"`, `"Tile rendering failed"`), ensuring internal host filesystem paths are never leaked in HTTP 404 or 500 responses.

---

## 5. Frontend Production Build Configuration

### Build Procedure
```bash
cd frontend
# 1. Type validation
npx tsc --noEmit

# 2. Production bundling
npm run build
```

### Build Output Verification
- Output Directory: `frontend/dist/`
- Bundled Output:
  - `dist/index.html` (~1.14 kB)
  - `dist/assets/index-*.css` (~28.76 kB)
  - `dist/assets/index-*.js` (~365.65 kB)
- The production bundle preserves all interactive Leaflet components, CARTO Dark Matter basemap rendering, polygon AOI overlay, 8-date timeline slider, and analytics cards.

---

## 6. Runtime Artifact & Storage Audit

The backend requires local filesystem access to the following 79 verified artifacts totaling **110.10 MB**:

| Category | File Count | Total Size | Git Status | Runtime Role | Required in Production |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Built-up Mask** (`data/step9/`) | 3 | ~1.2 MB | Tracked | Built urban boundary mask (`built_mask_30m.tif`) | **Yes** |
| **Satellite Indices & LST** (`data/step10/`) | 32 | ~62.7 MB | Tracked | 8 dates of LST, NDVI, NDBI, Reference labels | **Yes** |
| **ML Hotspot Predictions** (`results/step10/`) | 16 | ~24.2 MB | Tracked | 8 dates of RF Probability & Binary Classification | **Yes** |
| **Spatial Analysis Rasters** (`results/step10/`) | 6 | ~11.1 MB | Tracked | Persistence & Getis-Ord $G_i^*$ rasters | **Yes** |
| **Statistical CSV Files** (`results/step10/`) | 7 | ~10 KB | Tracked | Persistence and $G_i^*$ summary tables | **Yes** |
| **Evaluation Metrics & Predictions** (`results/step10_9/`) | 3 | ~18 KB | Tracked | Final locked model evaluation CSVs | **Yes** |
| **Locked Model & Metadata** (`models/`) | 3 | ~820 KB | Tracked | `random_forest_final_step10_8.joblib` & metadata | **Yes** |
| **Total Artifact Footprint** | **79** | **110.10 MB** | **All Tracked** | Full platform research database | **Required** |

### Storage Strategy
Because the total volume of all research GeoTIFFs, models, and tables is only **110.10 MB** and all files are already tracked in the Git repository, cloning the repository during deployment provides the complete runtime dataset immediately. No external object store (S3, GCS) or separate synchronization script is required for initial deployment.

---

## 7. Security Audit Results

| Audit Check | Method | Result | Status |
| :--- | :--- | :--- | :--- |
| **Tracked Secrets & Credentials** | Regex scan across 259 tracked files | Zero API keys, passwords, or tokens found | **PASS** |
| **Environment Secret Files** | `git ls-files` check for `.env` files | Zero `.env` files tracked; `.gitignore` enforced | **PASS** |
| **Build Artifacts & Node Modules** | `git ls-files` check for `node_modules/`, `dist/` | Zero build outputs or dependencies tracked | **PASS** |
| **Public API Error Leaks** | Route exception review in `backend/app/api/routes.py` | Sanitized; zero internal paths in responses | **PASS** |
| **Vite Client Variable Exposure** | Audit of `VITE_` variables in `frontend/` | Only public endpoint & CARTO basemap key used | **PASS** |

---

## 8. Scientific Integrity Verification

- **Model Binary:** `models/random_forest_final_step10_8.joblib`
- **SHA-256 Checksum:** `4cb736e53c66c78dbbcbc1cf7ca3ac965af01f1c7fae829502649b018e127280` (**VERIFIED**)
- **Locked Test Metrics:**
  - Accuracy: **86.67%** (`0.866667`)
  - F1-Score: **86.60%** (`0.865979`)
  - ROC-AUC: **93.37%** (`0.933673`)
  - Confusion Matrix: `{ TN: 85, FP: 13, FN: 13, TP: 84 }`
- **Predictors:** `NDVI + NDBI` (LST 100% excluded)
- **Target Label:** `"LST-derived thermal hotspot reference labels"`

---

## 9. Unresolved Deployment Prerequisites

Before executing the live production deployment, the following external resources must be provisioned:
1. **Production Domain & TLS:** A custom domain name with valid HTTPS certificates (e.g. Let's Encrypt / Cloudflare SSL).
2. **Hosting Infrastructure:** A provisioned Linux host / VPS (e.g. Ubuntu 22.04 LTS / 24.04 LTS) or container PaaS instance with Python 3.12, GDAL/GEOS libraries, and Node.js.
3. **CARTO API Key Domain Restriction:** Configure the CARTO dashboard to restrict map tile requests to the production domain to prevent unauthorized quota consumption.

---

## 10. Recommended Next Steps for Actual Deployment

1. Create a production `Dockerfile` and `docker-compose.yml` to package Nginx (frontend) and Uvicorn/FastAPI (backend) into a reproducible container.
2. Configure automated CI/CD pipeline (e.g. GitHub Actions) to run tests (`pytest`, `tsc`, `build`) before deployment.
3. Deploy to the selected hosting environment with environment variables configured via the hosting dashboard.
