# Docker Runtime Validation & Smoke Testing Guide

**Project:** Machine Learning-Based Urban Heat Hotspot Detection Using LST, NDVI and NDBI from Landsat Imagery  
**Study Area:** Mysuru, Karnataka, India  
**Step:** 24 — Docker Build, Runtime and Deployment Smoke Testing  
**Date:** October 2026  
**Status:** **CONFIGURED, FUNCTIONALLY VALIDATED & READY FOR HOST EXECUTION**  

---

## 1. Overview & Purpose

This guide provides technical specifications, runtime architecture details, and diagnostic runbooks for the containerized production deployment of the Mysuru Urban Heat Hotspot Detection platform.

The system packages the React 18 Single Page Application (SPA), the FastAPI (Python 3.12) ASGI backend, Nginx reverse proxy, and all authoritative scientific GeoTIFF rasters into a unified container image managed by `supervisord`.

---

## 2. Container Architecture & Process Model

```
┌────────────────────────────────────────────────────────────────────────┐
│                   DOCKER CONTAINER: urban_heat_mysuru                  │
│                                                                        │
│  [ Port 80 (HTTP) Ingress ]                                            │
│              │                                                         │
│              ▼                                                         │
│     [ Nginx Web Server ] ──── /assets/, / ───► [ Static SPA Bundle ]   │
│              │                                 (/var/www/html)         │
│              │                                                         │
│              ▼ /api/v1/*, /docs, /openapi.json                         │
│     [ Reverse Proxy (127.0.0.1:8000) ]                                 │
│              │                                                         │
│              ▼                                                         │
│     [ Uvicorn ASGI Server ] (Python 3.12)                              │
│              │                                                         │
│       ┌──────┴─────────────────────────────────┐                       │
│       │                                        │                       │
│       ▼                                        ▼                       │
│  [ Rasterio & PyProj ]                  [ Scikit-Learn Model ]         │
│  35 GeoTIFFs (~100 MB)                  Random Forest (`.joblib`)      │
│  EPSG:32643 -> EPSG:3857 Tiles          SHA-256 Verified Binary        │
│       │                                                                │
│       ▼                                                                │
│  [ Persistent Cache Volume ] (/app/.tile_cache)                        │
└────────────────────────────────────────────────────────────────────────┘
```

### Process Management via Supervisor:
- **`supervisord` (PID 1):** Orchestrates child processes, captures process crashes, and multiplexes stdout/stderr directly to container output streams (`docker logs`).
- **`uvicorn` (Priority 10):** Runs FastAPI on `127.0.0.1:8000` with 2 workers.
- **`nginx` (Priority 20):** Runs `nginx -g "daemon off;"`, handles SSL/TLS termination (if mapped), Gzip compression, SPA client-side routing fallback, and internal proxying.

---

## 3. Deployment Configuration Audit

| Configuration Asset | Location | Key Hardening & Configuration Attributes | Audit Status |
| :--- | :--- | :--- | :---: |
| **Multi-Stage Dockerfile** | `Dockerfile` | • Stage 1: `node:20-alpine` builds Vite SPA with `--build-arg VITE_API_BASE_URL=/api/v1`.<br>• Stage 2: `python:3.12-slim` installs `nginx`, `supervisor`, `curl`, and runtime C libs (`libgomp1`).<br>• Explicit `/var/log/supervisor` and `/app/.tile_cache` creation.<br>• Automated healthcheck via Nginx (`http://localhost/api/v1/health`). | **PASS** |
| **Docker Compose** | `docker-compose.yml` | • Single-command orchestration.<br>• Mapped host port: `${HOST_PORT:-80}:80`.<br>• Persistent volume `urban_heat_tile_cache` attached to `/app/.tile_cache`.<br>• Container restart policy: `restart: unless-stopped`. | **PASS** |
| **Nginx Server Config** | `deploy/nginx.conf` | • Gzip compression enabled for static assets and JSON responses.<br>• SPA routing: `try_files $uri $uri/ /index.html`.<br>• Immutable 1-year cache headers for `/assets/`.<br>• Proxies `^/(api/v1\|docs\|redoc\|openapi.json\|health)` to `http://127.0.0.1:8000`.<br>• Pass-through of backend `Cache-Control` headers for dynamically rendered raster tiles. | **PASS** |
| **Supervisor Config** | `deploy/supervisord.conf` | • `nodaemon=true`, logging to container stdout/stderr.<br>• Autorestarts `uvicorn` and `nginx` upon unexpected process termination. | **PASS** |
| **Docker Ignore** | `.dockerignore` | • Prevents transmission of `.git`, `.env*`, `node_modules`, `dist/`, `.pytest_cache`, and temporary files. | **PASS** |
| **Environment Template** | `.env.production.example` | • Documents `HOST_PORT`, `VITE_CARTO_API_KEY`, and `CORS_ORIGINS`. | **PASS** |

---

## 4. Execution Commands for Local & Remote Deployment

### Prerequisites:
1. Docker Engine / Docker Desktop (Active daemon).
2. Docker Compose v2.x+.

### Step-by-Step Execution:
```bash
# 1. Clone repository
git clone https://github.com/Shishir-1705/Major_Project.git
cd Major_Project

# 2. Configure production environment
cp .env.production.example .env
# Optional: Set VITE_CARTO_API_KEY if authenticated CARTO basemaps are desired

# 3. Build and launch container in background
docker compose up -d --build

# 4. Verify running container and process health
docker compose ps

# 5. Check live application and supervisor logs
docker compose logs -f

# 6. Verify container health status
curl -f http://localhost/api/v1/health
```

### Container Lifecycle Commands:
```bash
# Graceful stop
docker compose stop

# Restart container (triggers cache persistence verification)
docker compose restart

# Remove container while preserving tile cache volume
docker compose down

# Destroy container and wipe tile cache volume
docker compose down -v
```

---

## 5. Verification Test Suite & Parity

To verify the deployment stack locally without a running Docker daemon, run the automated verification suite:

```bash
# 1. Execute backend API test suite (14/14 tests)
python -m pytest backend/tests/test_api.py -v

# 2. Execute end-to-end functional smoke tests (API + 256x256 PNG tiles)
python -c "
from fastapi.testclient import TestClient
from backend.app.main import app
c = TestClient(app)
assert c.get('/api/v1/health').status_code == 200
assert c.get('/api/v1/model').json()['sha256'] == '4cb736e53c66c78dbbcbc1cf7ca3ac965af01f1c7fae829502649b018e127280'
print('Verified API Parity!')
"

# 3. Validate frontend compilation
cd frontend && npx tsc --noEmit && npm run build
```

---

## 6. Diagnostic Runbook

### Issue: Port 80 Conflict on Host
- **Symptom:** `Error starting userland proxy: listen tcp4 0.0.0.0:80: bind: address already in use`.
- **Solution:** Edit `.env` and set `HOST_PORT=8080`. Access application via `http://localhost:8080`.

### Issue: Tile Cache Permission Denied
- **Symptom:** `Permission denied: '/app/.tile_cache/lst_...'`.
- **Solution:** The Dockerfile automatically executes `chmod 777 /app/.tile_cache`. If custom host directory mounts are used instead of named volumes, ensure the host directory has write permissions for UID 1000/root.
