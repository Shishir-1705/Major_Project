# Professional Error Handling, Resilience & Recovery Guide

**Project:** Machine Learning-Based Urban Heat Hotspot Detection Using LST, NDVI and NDBI from Landsat Imagery  
**Study Area:** Mysuru, Karnataka, India  
**Step:** 21 — Professional Error Handling, Resilience & Recovery  

---

## 1. Overview & Architectural Resilience

Step 21 introduces enterprise-grade error resilience, network fault tolerance, and graceful recovery across the React 18 + TypeScript frontend and FastAPI backend.

The platform guarantees:
- **Zero White-Screen Crashes:** React Error Boundaries protect the component hierarchy.
- **Data Preservation:** Previously fetched valid statistics are never overwritten with `null` or `0` on transient network errors.
- **User-Friendly Error Masking:** Stack traces, filesystem paths, and Python tracebacks are strictly masked behind professional user notifications.
- **Automatic Server Recovery:** When the backend server returns online after downtime, the application automatically re-synchronizes telemetry and satellite rasters.

---

## 2. API Client Error Strategy & Timeout

- **Location:** `frontend/src/services/api.ts`
- **Request Timeout:** Enforced **10,000 ms (10 seconds)** timeout via `AbortController`.
- **Custom Error Class:** `ApiError` encapsulates `statusCode`, `userMessage`, `isNetworkError`, `isTimeout`.
- **Status Mapping Table:**

| Error Type / Status Code | User-Facing Message | UI Action |
| :--- | :--- | :--- |
| **Network Failure / Offline** | `"Analysis server is offline or unreachable. Ensure FastAPI backend is running."` | Header badge -> `OFFLINE`, offline toast alert |
| **Timeout (10s / HTTP 408/504)** | `"Request timed out. Please try again."` | Retains previous metric state, displays warning toast |
| **HTTP 400 (Bad Request)** | `"Invalid parameter in analysis request."` | Non-blocking warning toast |
| **HTTP 404 (Not Found)** | `"Requested spatial layer or date product not found."` | Non-blocking warning toast |
| **HTTP 429 (Rate Limit)** | `"Rate limit exceeded. Please wait a moment."` | Warning toast notice |
| **HTTP 500 / 502 / 503** | `"Analysis server encountered an error processing data."` | Graceful fallback to `Unavailable` card state |

---

## 3. Global State & Toast Notification Architecture

- **Store Location:** `frontend/src/store/useAppStore.ts`
- **Toast Component:** `frontend/src/components/common/ToastContainer.tsx`
- **Toast Types:** `info` (cyan), `warning` (amber), `error` (red), `success` (emerald).
- **Auto-Dismissal:** Default 5,000 ms dismissal with manual `X` close action.

---

## 4. Component Failure & Recovery Behavior

### Map Workspace (`MapWorkspace.tsx`)
- Attach `tileerror` event listener on Leaflet `TileLayer`.
- On tile error, emits a non-blocking toast notice: `"Map tile for [Layer] temporarily unavailable."`
- Does not crash Leaflet or fabricate replacement imagery.
- Preserves CARTO Dark Matter basemap attribution.

### Analytics Panel & Model Info (`AnalyticsPanel.tsx` & `ModelInfoCard.tsx`)
- StatCards render a clean `Unavailable` indicator with error tooltip badge if statistics fail while backend is offline.
- Does not show fake `0` or `N/A` values.
- Distinguishes live REST API telemetry from static locked model specifications in `ModelInfoCard`.

### Timeline Slider (`TimelineSlider.tsx`)
- Auto-pauses timeline playback if the backend is offline or an API request fails.
- Preserves active date selection and notifies user with an offline date selection toast.

### React Error Boundary (`ErrorBoundary.tsx`)
- Wraps `<App />` in `main.tsx`.
- Catches unhandled JS rendering exceptions and displays a clean dark fallback UI with a **"Reload Application"** button.

---

## 5. Verification Commands

```bash
# 1. Backend Pytest Suite
python -m pytest backend/tests/test_api.py

# 2. Frontend TypeScript Type Check
cd frontend && npx tsc --noEmit

# 3. Frontend Production Build
cd frontend && npm run build
```
