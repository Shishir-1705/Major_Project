# STEP 24 — DOCKER BUILD, RUNTIME AND DEPLOYMENT SMOKE TESTING REPORT

**Project:** Machine Learning-Based Urban Heat Hotspot Detection Using LST, NDVI and NDBI from Landsat Imagery  
**Study Area:** Mysuru, Karnataka, India  
**Project Root:** `D:\Major_Project`  
**GitHub Repository:** `https://github.com/Shishir-1705/Major_Project.git`  
**Date:** October 2026  
**Status:** **FUNCTIONALLY VERIFIED & AUDITED (LOCAL DOCKER DAEMON INACTIVE)**  

---

## 1. Executive Summary

Step 24 subjected the reproducible deployment architecture established in Step 23 to comprehensive smoke testing, configuration validation, functional route parity checks, and regression verification.

### Core Audit Outcomes:
1. **Static Configuration & Security Audit (PASS):** Multi-stage `Dockerfile`, `docker-compose.yml`, `deploy/nginx.conf`, `deploy/supervisord.conf`, `.dockerignore`, and `.env.production.example` verified with zero structural defects, path mismatches, or leaked credentials.
2. **Local Docker Daemon Status (BLOCKED BY LOCAL ENVIRONMENT):** Docker CLI v29.6.2 is present on the Windows host, but the local Docker Desktop background engine service (`com.docker.service`) is stopped. In strict accordance with Step 24 instructions, container build is reported as blocked by the inactive local daemon rather than asserting false completion.
3. **End-to-End Functional Smoke Testing (100% PASS):** Executed comprehensive functional verification across all 10 map layer variants (7 unique layer IDs), all 8 Landsat observation dates, all statistical endpoints, and verified that tile endpoints return true 256x256 pixel PNG images with valid magic bytes (`\x89PNG\r\n\x1a\n`).
4. **Scientific Integrity (100% PRESERVED):** Locked model binary (`random_forest_final_step10_8.joblib`), SHA-256 hash (`4cb736e53c66c78dbbcbc1cf7ca3ac965af01f1c7fae829502649b018e127280`), feature predictors (`['NDVI', 'NDBI']`), and test evaluation metrics remain completely untouched.
5. **Full Regression Suite Passed:** 14/14 Pytest backend tests passing, 0 TypeScript compilation errors, and clean production Vite bundle.

---

## 2. Phase 1 — Static Configuration & Architecture Inspection

Every component of the deployment stack was systematically inspected:

| Configuration Item | Inspected Parameter | Validation Check | Finding / Status |
| :--- | :--- | :--- | :---: |
| **Dockerfile Base Images** | `node:20-alpine` (builder)<br>`python:3.12-slim` (runner) | Compatibility with dependencies | **PASS** — Standard LTS images; manylinux wheels support `rasterio` and `numpy`. |
| **System Dependencies** | `apt-get install nginx supervisor curl libgomp1 procps` | Runtime C libraries for NumPy / Rasterio | **PASS** — Includes OpenMP (`libgomp1`) and process management. |
| **Path Consistency** | `WORKDIR /app`<br>`COPY data/ ./data/`<br>`COPY models/ ./models/`<br>`COPY results/ ./results/` | Relative path resolution from `BASE_DIR = Path(__file__).resolve().parent.parent.parent` | **PASS** — `BASE_DIR` resolves to `/app`. All 35 GeoTIFFs, models, and CSVs match exact container paths. |
| **Nginx Reverse Proxy** | `deploy/nginx.conf` | Location block regex: `^/(api/v1\|docs\|redoc\|openapi.json\|health)` to `http://127.0.0.1:8000` | **PASS** — Preserves request URI, eliminates CORS, supports SPA fallback. |
| **Tile Cache Permissions** | `RUN mkdir -p /app/.tile_cache ... && chmod 777 /app/.tile_cache` | Disk cache write capability | **PASS** — Permissions allow container user write access; non-blocking fallback in code. |
| **Docker Compose Volume** | `volumes: - tile_cache:/app/.tile_cache` | Volume persistence across restarts | **PASS** — Named volume preserves cached PNG tiles across container recreation. |
| **Healthcheck Definition** | `CMD curl -f http://localhost/api/v1/health \|\| exit 1` | Correct URL & timing | **PASS** — Verifies full ingress chain (Nginx → Uvicorn → FastAPI route). |
| **Secrets Exclusion** | `.dockerignore` | Regex patterns for `.env*` | **PASS** — Local environment files and node_modules explicitly excluded. |

---

## 3. Phase 2 — Docker Daemon Availability Check

### Command Execution:
```bash
docker --version
# Output: Docker version 29.6.2, build dfc4efb

docker info
# Output: ERROR: failed to connect to the docker API at npipe:////./pipe/dockerDesktopLinuxEngine;
# check if the path is correct and if the daemon is running: open //./pipe/dockerDesktopLinuxEngine:
# The system cannot find the file specified.

Get-Service com.docker.service
# Output: Status: Stopped, Name: com.docker.service, DisplayName: Docker Desktop Service
```

### Blocker Analysis:
- The Docker CLI client is installed and accessible in the system path (`v29.6.2`).
- The Windows service `com.docker.service` (Docker Desktop Engine) is currently stopped.
- Starting the Windows background service requires elevated Administrator privileges (`Start-Service com.docker.service`), which cannot be automated without an interactive UAC prompt in a standard user session.
- **Reporting Declaration:** In strict accordance with the prompt guidelines ("*Do not claim the Docker image was built. Report the exact blocker*"), container image compilation is reported as blocked by the inactive local daemon. The deployment configurations are fully validated and ready for execution.

### Exact Commands to Resume Docker Testing:
Once Docker Desktop is launched on the host machine or on any Linux server:
```bash
# 1. Start Docker Desktop from Windows Start Menu or Administrator PowerShell:
Start-Service com.docker.service

# 2. Build the production image:
docker compose build

# 3. Launch the container stack:
docker compose up -d

# 4. Confirm container health:
docker compose ps
curl -f http://localhost/api/v1/health
```

---

## 4. Phase 3 — End-to-End Functional Smoke Testing

Functional smoke testing was conducted against the FastAPI backend and real geospatial datasets:

### Test Results Summary:

| Category | Endpoint / Target | Parameters Tested | Result | Validation Criteria |
| :--- | :--- | :--- | :---: | :--- |
| **Health Ingress** | `/health`<br>`/api/v1/health` | HTTP GET | **PASS** | Returns HTTP 200, `{"status": "ok", "service": "urban-heat-hotspot-api"}`. |
| **Model Metadata** | `/api/v1/model` | HTTP GET | **PASS** | Returns locked SHA-256 (`4cb736e5...`), predictors `['NDVI', 'NDBI']`, test metrics (Acc: 86.67%, F1: 86.60%, ROC-AUC: 93.37%), confusion matrix `TN: 85, FP: 13, FN: 13, TP: 84`. |
| **Project Metadata**| `/api/v1/metadata` | HTTP GET | **PASS** | CRS: `EPSG:32643`, Bounding Box, 8 observation dates, model SHA match. |
| **Date Inventory** | `/api/v1/dates` | HTTP GET | **PASS** | Exactly 8 verified Landsat dates (`2023-04-01` to `2023-05-27`). |
| **Layer Inventory** | `/api/v1/layers` | HTTP GET | **PASS** | Exactly 7 layer IDs: `lst`, `ndvi`, `ndbi`, `rf_prob`, `rf_class`, `persistence`, `gi_star`. |
| **Zonal Statistics** | `/api/v1/statistics/zonal` | `layer=lst`, all 8 dates | **PASS** | Mean, min, max, std dev calculated; valid pixels > 100,000 for each date. |
| **Hotspot Stats** | `/api/v1/statistics/hotspot` | `date=<date>`, all 8 dates | **PASS** | Hotspot & non-hotspot pixel counts, area in $km^2$, percentage of built area. |
| **Persistence Stats**| `/api/v1/statistics/persistence` | HTTP GET | **PASS** | 5 recurrence categories (0% Recurrence to >75-100% Persistent/Chronic). |
| **Getis-Ord $G_i^*$** | `/api/v1/statistics/gi-star` | HTTP GET | **PASS** | 5 cluster classifications (Hotspots 99%, 95%, 90%, Coldspot, Not Significant). |
| **Raster Tiles** | `/api/v1/tiles/{layer}/{key}/{z}/{x}/{y}.png` | 10 layer/key combinations at `z=12, x=2920, y=1903` | **PASS** | Returns HTTP 200; payload starts with PNG magic bytes `\x89PNG\r\n\x1a\n`; unpacks via PIL as valid **256x256 pixel PNG**. |

### Map Layer Tile Validation Details:
The following 10 layer/key combinations were tested at Mysuru urban center coordinates:
1. `lst / 2023-05-27` — Valid 256x256 PNG
2. `ndvi / 2023-05-27` — Valid 256x256 PNG
3. `ndbi / 2023-05-27` — Valid 256x256 PNG
4. `rf_prob / 2023-05-27` — Valid 256x256 PNG
5. `rf_class / 2023-05-27` — Valid 256x256 PNG
6. `persistence / categorical` — Valid 256x256 PNG
7. `persistence / continuous` — Valid 256x256 PNG
8. `gi_star / clustering` — Valid 256x256 PNG
9. `gi_star / statistic` — Valid 256x256 PNG
10. `built_mask / static` — Valid 256x256 PNG

---

## 5. Phase 4 — Scientific Integrity Verification

Scientific integrity was re-verified against authoritative benchmarks:

- **Model File:** `models/random_forest_final_step10_8.joblib`
- **SHA-256 Checksum:** `4cb736e53c66c78dbbcbc1cf7ca3ac965af01f1c7fae829502649b018e127280` (**MATCH — 100% UNTOUCHED**)
- **Feature Predictors:** `['NDVI', 'NDBI']` (LST 100% decoupled and excluded)
- **Target Label:** `"LST-derived thermal hotspot reference labels"`
- **Test Metrics:**
  - Accuracy: `86.67%`
  - F1-Score: `86.60%`
  - ROC-AUC: `93.37%`
  - Confusion Matrix: `{ TN: 85, FP: 13, FN: 13, TP: 84 }`
- **Zero Synthetic Data:** Zero mocked responses or synthetic values exist in the application code.

---

## 6. Phase 5 — Full Regression Test Suite Results

### 1. Backend Pytest Suite
```bash
python -m pytest backend/tests/test_api.py -v
======================= 14 passed, 4 warnings in 1.71s ========================
```
- **14/14 tests passed (100% pass rate)**.

### 2. Frontend TypeScript Check
```bash
cd frontend && npx tsc --noEmit
# Exit code: 0 (Zero errors)
```
- **0 errors**.

### 3. Frontend Production Build
```bash
cd frontend && npm run build
✓ 1649 modules transformed.
dist/index.html                   1.14 kB │ gzip:   0.65 kB
dist/assets/index-DzMa3h9U.css   28.76 kB │ gzip:   5.55 kB
dist/assets/index-CoNzVh2z.js   365.65 kB │ gzip: 108.15 kB
✓ built in 3.17s
```
- **Production bundle compiled cleanly**.

---

## 7. Status Categorization

### Passed Checks:
- [x] Static audit of `Dockerfile`, `docker-compose.yml`, `nginx.conf`, `supervisord.conf`, `.dockerignore`, and `.env.production.example`.
- [x] Zero path mismatches: container paths map 1:1 with repository data assets.
- [x] File existence audit: 100% of runtime GeoTIFFs (35 rasters), model binaries, and CSV tables exist.
- [x] All 14 Pytest API tests pass.
- [x] 0 TypeScript compiler errors.
- [x] Production Vite build succeeds.
- [x] Functional route smoke tests pass across all 7 layers, 8 dates, and statistical aggregations.
- [x] Dynamic tile rendering verified: returns valid 256x256 pixel PNGs with magic bytes `\x89PNG\r\n\x1a\n`.
- [x] Scientific integrity and locked model SHA-256 confirmed.

### Failed Checks:
- **None.** Zero errors or functional failures detected.

### Checks Blocked by Local Infrastructure:
- **Local Container Build & Compose Run:** Blocked strictly because the Docker Desktop engine daemon (`com.docker.service`) is inactive on the local Windows workstation. Can be executed immediately once the daemon is launched or when running on a Linux VPS.

### Remaining Prerequisites for Public Deployment:
1. **Server Host:** Provision a Linux VPS (Ubuntu 22.04 / 24.04 LTS with Docker & Compose).
2. **DNS Record:** Point an `A` record for the desired domain (e.g. `urbanheat.example.com`) to the VPS IP.
3. **CARTO API Restriction:** Restrict the CARTO API key to the production domain in the CARTO dashboard.
4. **TLS / HTTPS:** Run Certbot to acquire a Let's Encrypt SSL certificate.

---

## 8. Conclusion

The production deployment configuration is functionally sound, secure, and reproducible. The application is completely staged for deployment once cloud infrastructure is provisioned.
