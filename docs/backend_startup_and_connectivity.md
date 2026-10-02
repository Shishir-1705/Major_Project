# FastAPI Backend Startup & Frontend Connectivity Hardening

**Project:** Machine Learning-Based Urban Heat Hotspot Detection Using LST, NDVI and NDBI from Landsat Imagery  
**Study Area:** Mysuru, Karnataka, India  
**Step:** 18 — Backend Startup & Connectivity Hardening  

---

## Overview

Step 18 establishes robust end-to-end operational readiness for launching and connecting the FastAPI backend (`http://127.0.0.1:8000`) and the React + TypeScript frontend (`http://localhost:5173`).

---

## Key Configurations & Enhancements

### 1. Backend CORS & Health Check Endpoints
- **CORS Origins Allowed:** `http://localhost:5173`, `http://127.0.0.1:5173`, `http://localhost:3000`
- **Health Endpoints Implemented:**
  - `GET /`: Returns service name, study area, status (`online`), and docs path.
  - `GET /health`: Returns `{"status": "ok", "service": "urban-heat-hotspot-api"}`.
  - `GET /api/v1/health`: Returns `{"status": "ok", "service": "urban-heat-hotspot-api"}`.

### 2. Frontend Connectivity Hardening
- **Environment Variable Support:** `VITE_API_BASE_URL` (defaults to `http://127.0.0.1:8000/api/v1`).
- **Environment Template:** `frontend/.env.example` created with template keys for `VITE_API_BASE_URL` and `VITE_CARTO_API_KEY`.
- **Health Check API Service:** Added `api.checkHealth()` method to `ApiService` in `frontend/src/services/api.ts`.
- **Status Indicator:** Header displays `"ANALYSIS SERVER ONLINE"` (emerald pulse) when connected and `"ANALYSIS SERVER OFFLINE"` (amber indicator) when disconnected.

### 3. Startup Scripts
Convenience batch scripts in the project root:
- `start_backend.bat`: Launches Uvicorn server on `127.0.0.1:8000` with auto-reload.
- `start_frontend.bat`: Navigates to `frontend/` and starts Vite dev server (`http://localhost:5173`).

---

## Verification & Automated Testing

```bash
# 1. Backend Pytest Suite
python -m pytest backend/tests/test_api.py

# 2. Frontend TypeScript Check
cd frontend && npx tsc --noEmit

# 3. Frontend Production Build
cd frontend && npm run build
```

---

## Governance & Security Notice
- **Locked ML Model:** `models/random_forest_final_step10_8.joblib` (SHA-256: `4cb736e53c66c78dbbcbc1cf7ca3ac965af01f1c7fae829502649b018e127280`).
- **Security:** Local environment secret files (`frontend/.env`) containing API keys are excluded from git via `.gitignore`.
