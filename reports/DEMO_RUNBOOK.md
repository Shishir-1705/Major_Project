# Thermal Intelligence — Demonstration Runbook

**Project:** Machine Learning-Based Urban Heat Hotspot Detection Using LST, NDVI and NDBI from Landsat Imagery  
**Study Region:** Mysuru, Karnataka, India (`EPSG:32643`, UTM Zone 43N)  
**Target Audience:** Academic Evaluators, Thesis Defense Committee, Project Demonstrators  
**Document Status:** Final Academic Readiness (Increment 3.12)

---

## 1. System Prerequisites

Before initiating the demonstration, verify that the host machine satisfies the following environment specifications:

* **Operating System:** Windows 10/11, Linux, or macOS.
* **Python Runtime:** Python 3.12 or higher.
  * Verified core dependencies: `fastapi`, `uvicorn`, `rasterio`, `numpy`, `scikit-learn`, `joblib`, `pillow`, `pandas`.
* **Node.js Runtime:** Node.js 18.x or higher, with `npm` 9.x+.
* **Available TCP Ports:**
  * Port `8000`: FastAPI REST backend service.
  * Port `5173`: Vite React development server.
* **Authoritative Data Directory:** Verify that `data/step10/real/` contains the candidate real Landsat rasters and `models/random_forest_final_step10_8.joblib` is present.

---

## 2. Starting the Application Services

The application consists of a decoupled Python FastAPI backend and a React/TypeScript frontend.

### Step 2.1 — Start the Backend Server

Open a terminal at the project root (`D:\Major_Project`):

```powershell
# Option A: Windows batch script
.\start_backend.bat

# Option B: Direct Python command
python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
```

*Expected Terminal Output:*
```text
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
```

### Step 2.2 — Start the Frontend Development Server

Open a second terminal at the project root (`D:\Major_Project`):

```powershell
# Option A: Windows batch script
.\start_frontend.bat

# Option B: Direct npm command
npm --prefix frontend run dev
```

*Expected Terminal Output:*
```text
  VITE v6.4.3  ready in 455 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://<local-ip>:5173/
```

---

## 3. Pre-Flight Connectivity and API Health Verification

Before presenting to evaluators, verify API communication via browser or curl:

1. **Root API Service:** Open `http://127.0.0.1:8000/`  
   *Expected Response:*
   ```json
   {
     "status": "online",
     "service": "Urban Heat Hotspot Intelligence API",
     "study_area": "Mysuru, Karnataka, India",
     "docs": "/docs"
   }
   ```
2. **Health Check Endpoint:** Open `http://127.0.0.1:8000/health`  
   *Expected Response:* `{"status": "ok", "service": "urban-heat-hotspot-api"}`
3. **Interactive Swagger Documentation:** Open `http://127.0.0.1:8000/docs`  
   *Shows all 11 REST endpoints under the `/api/v1` namespace.*
4. **Candidate Real-Data Validation:** Query `http://127.0.0.1:8000/api/v1/statistics/gi-star`  
   *Expected Response:* Confirms `total_built_area_km2: 135.247`, `total_nodes: 150274`, and 3 cluster categories.

---

## 4. Live Demonstration Walkthrough (Page-by-Page)

Launch a modern web browser (Google Chrome, Edge, or Firefox) and navigate to:  
`http://localhost:5173/`

Ensure the top-right header displays the green **`● SERVER ONLINE`** badge.

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│  THERMAL INTELLIGENCE    Home  Overview  LST Explorer  ML Hotspots  ...  ● SERVER ONLINE│
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

### Page 1 — Landing Page (`/`)

* **What to Show:**
  * **Cinematic Hero:** Point out the primary headline *"See the Heat. Understand the City."* and the side-by-side CTA buttons (*Explore the Analysis* and *Discover the Research*).
  * **Metadata Strip:** Highlight the scientific credentials strip: `Sensor: Landsat 8/9 Level-2`, `Grid: 30m • UTM 43N`, `Model: Locked RF (86.7% Acc)`.
  * **Interactive Radiometry Preview:** Click between the `Thermal LST`, `ML Hotspots`, and `NDVI Canopy` preview tabs to demonstrate live raster switching before entering the full dashboard.
  * **Surface Thermal Dynamics Section:** Scroll down to explain the biophysical relationship between dense canopy, impervious concrete/asphalt, and thermal radiance.
  * **Research Pipeline:** Walk through the 4-stage sequential lineage: Satellite Observation → Feature Extraction → Machine Learning → Spatial Clustering.
  * **Results Preview:** Showcase the candidate raster outputs with direct deep-links to analytical pages.

---

### Page 2 — Analytical Overview (`/overview`)

* **What to Show:**
  * Click **Overview** in the top navigation bar.
  * **Telemetry Hub:** Point out the 4 primary cards:
    * `Built Area Domain`: $132.13\text{ km}^2$ baseline footprint.
    * `Zonal Mean Surface Temp`: $44.07^\circ\text{C}$ (Min: $31.6^\circ\text{C}$ / Max: $57.3^\circ\text{C}$).
    * `Hotspot Area`: $71.91\text{ km}^2$ ($54.3\%$ of valid domain).
    * `Locked Model F1-Score`: $86.60\%$ across spatially held-out test blocks.
  * **Study Area AOI Map:** Direct attention to the bottom-left boundary badge:  
    `Mysuru AOI: 461.50 km² Extent (135.25 km² Valid Domain)`.  
    *Explain:* The outer dashed rectangle represents the regional bounding envelope ($461.50\text{ km}^2$), while the active satellite analysis domain encompasses $135.25\text{ km}^2$ ($150,274\text{ valid pixels}$).

---

### Page 3 — Land Surface Temperature Explorer (`/lst`)

* **What to Show:**
  * Click **LST Explorer**.
  * **Temporal Stepper:** Demonstrate the date selector across all 8 verified Landsat acquisitions:
    * `2023-04-01` (Landsat 9)
    * `2023-04-09` (Landsat 8)
    * `2023-04-17` (Landsat 9)
    * `2023-04-25` (Landsat 8)
    * `2023-05-03` (Landsat 9)
    * `2023-05-11` (Landsat 8)
    * `2023-05-19` (Landsat 9)
    * `2023-05-27` (Landsat 8)
  * **Thermal Gradient:** Explain the continuous temperature scale ($30.0^\circ\text{C}$ to $55.0^\circ\text{C}$), highlighting the 20th percentile ($42.7^\circ\text{C}$) and 80th percentile ($47.1^\circ\text{C}$).
  * **Academic Crucial Distinction:** Emphasize the legend note:
    > *"Direct radiometric surface skin temperature derived from Landsat 8/9 ST_B10 at ~10:45 AM local overpass. Represents ground/rooftop skin temperature, not ambient 2 m air temperature."*
  * **Interactive Inspection:** Hover over pixels on the map to show real-time coordinates, active raster values, and study-area inclusion in the floating inspector.

---

### Page 4 — Machine Learning Hotspots (`/hotspots`)

* **What to Show:**
  * Click **ML Hotspots**.
  * **Dual Representation Mode:**
    * Toggle **Probability**: Shows continuous $[0.00, 1.00]$ inference gradient representing the model's confidence of exceeding the P80 thermal threshold.
    * Toggle **Classification**: Shows the discrete binary decision mask applying the operational decision threshold $\tau \ge 0.50$.
  * **Scientific Decoupling Principle:** Emphasize to evaluators that **LST is 100% excluded as a model predictor**. The model predicts thermal hotspot likelihood exclusively from optical surface reflectance (`NDVI` + `NDBI`), proving that urban surface materials and vegetation density provide strong predictive signals for thermal intensification.
  * **Locked Model Telemetry:** Point out the displayed test metrics ($86.60\%$ F1-Score, $86.67\%$ Accuracy) and Gini feature importances (NDBI $61.0\%$, NDVI $39.0\%$).

---

### Page 5 — Environmental Indices (`/indices`)

* **What to Show:**
  * Click **NDVI / NDBI**.
  * **Vegetation Canopy (NDVI):**
    * Displays the vegetation canopy density gradient $[-0.20, +0.80]$.
    * Shows the formula card: $\text{NDVI} = \frac{\text{NIR (B5)} - \text{Red (B4)}}{\text{NIR (B5)} + \text{Red (B4)}}$.
    * Point out vegetative cooling zones (Chamundi Hills, agricultural fringes) with values $> 0.50$.
  * **Built-up Impervious Surfaces (NDBI):**
    * Toggle to NDBI.
    * Displays impervious surface and masonry density $[-0.40, +0.60]$.
    * Shows the formula card: $\text{NDBI} = \frac{\text{SWIR-1 (B6)} - \text{NIR (B5)}}{\text{SWIR-1 (B6)} + \text{NIR (B5)}}$.
    * Point out high values ($> 0.15$) corresponding to the dense urban core and industrial corridors.

---

### Page 6 — Multi-Temporal Heat Persistence (`/persistence`)

* **What to Show:**
  * Click **Persistence**.
  * **Temporal Aggregation:** Explain that single-date observations can capture transient weather anomalies. Multi-temporal persistence integrates all 8 observation dates to isolate structural urban heat anomalies.
  * **5-Tier Categorical Recurrence:**
    * `Category 1 (0% Recurrence)`: $52.90\text{ km}^2$ ($39.1\%$) — Never hot.
    * `Category 2 (>0–25% Recurrence)`: $8.71\text{ km}^2$ ($6.4\%$) — Low recurrence.
    * `Category 3 (>25–50% Recurrence)`: $18.16\text{ km}^2$ ($13.4\%$) — Moderate recurrence.
    * `Category 4 (>50–75% Recurrence)`: $32.29\text{ km}^2$ ($23.9\%$) — High recurrence.
    * `Category 5 (>75–100% Recurrence)`: $23.19\text{ km}^2$ ($17.1\%$) — **Chronic structural hotspots**.
  * **Domain Consistency:** Note that the cards dynamically display `Share of 135.25 km² valid domain` across all $150,274\text{ pixels}$ with $\ge 4$ cloud-free observations.

---

### Page 7 — Getis-Ord Gi* Spatial Clusters (`/clusters`)

* **What to Show:**
  * Click **Gi* Clusters**.
  * **Spatial Autocorrelation Theory:** Explain that Getis-Ord $G_i^*$ measures whether high or low values cluster spatially beyond what would be expected under complete spatial randomness.
  * **Multiple Testing Correction:** Point out that Benjamini-Hochberg False Discovery Rate (FDR) control was applied at $\alpha = 0.05$ across all $150,274\text{ spatial tests}$.
  * **Statistical Distribution Cards:**
    * **Significant Hotspots ($z > 0, p_{\text{FDR}} < 0.05$):** $18.71\text{ km}^2$ ($13.84\%$).
    * **Significant Coldspots ($z < 0, p_{\text{FDR}} < 0.05$):** $24.17\text{ km}^2$ ($17.87\%$).
    * **Not Statistically Significant ($p_{\text{FDR}} \ge 0.05$):** $92.36\text{ km}^2$ ($68.29\%$).
  * **Scientific Language Rigor:** Point out the non-significant description:
    > *"Not statistically significant at FDR-adjusted p < 0.05."*  
    *Explain:* In accordance with rigorous spatial statistics, non-significance represents failure to reject the null hypothesis of spatial independence, not positive proof of pure randomness.

---

### Page 8 — Model Specification & Evaluation (`/model`)

* **What to Show:**
  * Click **Model Spec**.
  * **Locked Model Metadata:**
    * Model Checksum: `4cb736e53c66c78dbbcbc1cf7ca3ac965af01f1c7fae829502649b018e127280`.
    * Hyperparameters: 100 Trees, Max Depth 5, Gini Impurity, Min Samples Split 10, Min Samples Leaf 5.
  * **Independent Spatial Test Evaluation ($N = 195$):**
    * F1-Score: **86.60%** (Harmonic Mean)
    * Accuracy: **86.67%** (169 / 195 correct)
    * Precision: **86.60%** ($TP / [TP + FP]$)
    * Recall: **86.60%** ($TP / [TP + FN]$)
    * ROC-AUC: **93.37%**
    * PR-AUC: **93.67%**
    * Cohen's Kappa: **0.7333**
    * Brier Score: **0.1059**
  * **Confusion Matrix ($N = 195$):**
    * True Negatives ($TN$): **85**
    * False Positives ($FP$): **13**
    * False Negatives ($FN$): **13**
    * True Positives ($TP$): **84**
  * **Spatial Cross-Validation Design:** Explain that samples were partitioned into 40 contiguous geographic blocks (30 train = 805 samples, 10 test = 195 samples) to eliminate spatial autocorrelation leakage.

---

### Page 9 — Research Methodology (`/methodology`)

* **What to Show:**
  * Click **Methodology**.
  * Walk evaluators through the full documentation of data sources (USGS Landsat 8/9 Level-2 Collection 2 Tier 1), atmospheric correction, single-channel radiative transfer, and mathematical formulas for all derived products.
  * Point out the Study Area table clearly differentiating the initial baseline built footprint ($132.13\text{ km}^2$) from the candidate real analysis domain ($135.25\text{ km}^2$).

---

## 5. Resilience and Fault Tolerance Demonstration

To demonstrate system robustness to evaluators:

1. **Backend Disconnection Test:**
   * In the backend terminal, temporarily terminate the process (`Ctrl+C`).
   * On any frontend page, observe that the status badge updates to amber **`● SERVER OFFLINE`**.
   * Metric cards gracefully display `'--'` rather than crashing or displaying stale synthetic numbers.
   * Map basemap continues to pan and zoom smoothly without JavaScript errors.
2. **Backend Reconnection Test:**
   * Restart the backend (`python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000`).
   * Within seconds, the frontend automatically recovers, updating the status pill to green **`● SERVER ONLINE`** and repopulating live zonal telemetry.
3. **Invalid Layer / Date Parameter Handling:**
   * Demonstrate that arbitrary query parameters (e.g., requesting `/api/v1/statistics/hotspot?date=2099-01-01`) return a structured HTTP 400 JSON error rather than an unhandled 500 crash.

---

## 6. Demonstration Wrap-Up Script

Conclude the live presentation with these key takeaways:

1. **Methodological Feasibility:** Optical satellite imagery (`NDVI + NDBI`) provides strong predictive power ($86.60\%$ F1-score, $93.37\%$ ROC-AUC) for identifying localized urban thermal hotspots without relying on cloud-vulnerable thermal infrared bands during inference.
2. **Persistence vs. Transient Spikes:** Integrating 8 seasonal revisit dates revealed that $23.19\text{ km}^2$ ($17.1\%$) of Mysuru's built footprint experiences chronic, persistent thermal stress.
3. **Spatial Corroboration:** Getis-Ord $G_i^*$ analysis rigorously confirmed that $18.71\text{ km}^2$ ($13.84\%$) represents statistically significant thermal spatial clustering ($p_{\text{FDR}} < 0.05$).
4. **Reproducible Engineering:** The system is completely container-ready, with locked model artifacts, mathematically verified evaluation splits, and real-time geospatial tile streaming.
