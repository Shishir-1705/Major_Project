# Step 10 — Spatial Statistics & Multi-Temporal Hotspot Persistence Plan (REVISED)

**Project Title:** Machine Learning-Based Urban Heat Hotspot Detection Using LST, NDVI and NDBI from Landsat Imagery  
**Study Area:** Mysuru, Karnataka, India  
**Date:** September 12, 2026  
**Status:** PROPOSED REVISED PLAN ONLY (DO NOT EXECUTE YET)

---

## 1. Objective
The objective of Step 10 is to extend the single-date spatial hotspot inference (Step 9) into a rigorous **multi-temporal spatial persistence framework** across the 2023 pre-monsoon study window (April 1 to July 1, 2023). By analyzing 8 valid Landsat 8/9 acquisitions over Mysuru, Step 10 quantifies the temporal stability of relative urban surface thermal hotspots, evaluates spatial clustering using Getis-Ord Gi*, assesses the relationship between persistent hotspots and spectral indicators (NDVI and NDBI), and generates metric area statistics in UTM Zone 43N (EPSG:32643).

---

## 2. Current Baseline
- **Study Area:** Mysuru, Karnataka, India (76.55° - 76.78° E, 12.20° - 12.40° N)
- **Fitted Model:** Baseline Random Forest (`models/random_forest_baseline_step8_3.joblib`, n_estimators=100, max_depth=5, min_samples_split=10, min_samples_leaf=5)
- **Predictor Variables (X):** NDVI and NDBI ONLY (X = [NDVI, NDBI])
- **Urban Built Domain:** Dynamic World V1 Built Probability >= 0.5 (132.1290 km² mapped built domain)
- **Step 9 Benchmark Statistics (UTM 43N Equal-Area):**
  - Mapped Urban Built Domain: 132.1290 km² (146,810 UTM 30m pixels)
  - Single-Date Hotspot Area (April 1, 2023): 68.5107 km² (51.85% of mapped built domain)
  - Single-Date Cooler Built-Up Area: 63.6183 km² (48.15% of mapped built domain)
  - Locked Test Performance (Step 8.3): Accuracy = 85.13%, F1 = 0.8513, ROC-AUC = 0.9235

---

## 3. Verified Temporal Observation Inventory (Path 144 / Row 51)

| Mission | Acquisition Date UTC | Cloud Cover (%) | Valid AOI (%) | Selection Status |
| :--- | :--- | :---: | :---: | :---: |
| **Landsat 9** | 2023-04-01 05:10:49 UTC | 0.05% | 97.2% | **SELECTED** |
| **Landsat 8** | 2023-04-09 05:16:50 UTC | 1.82% | 96.1% | **SELECTED** |
| **Landsat 9** | 2023-04-17 05:10:45 UTC | 1.14% | 96.8% | **SELECTED** |
| **Landsat 8** | 2023-04-25 05:16:45 UTC | 4.38% | 94.5% | **SELECTED** |
| **Landsat 9** | 2023-05-03 05:10:40 UTC | 0.62% | 97.8% | **SELECTED** |
| **Landsat 8** | 2023-05-11 05:16:38 UTC | 2.91% | 95.4% | **SELECTED** |
| **Landsat 9** | 2023-05-19 05:10:35 UTC | 4.15% | 94.2% | **SELECTED** |
| **Landsat 8** | 2023-05-27 05:16:33 UTC | 6.84% | 91.5% | **SELECTED** |
| **Landsat 9** | 2023-06-04 05:10:31 UTC | 48.30% | 46.2% | **EXCLUDED** |
| **Landsat 8** | 2023-06-12 05:16:29 UTC | 62.10% | 35.8% | **EXCLUDED** |
| **Landsat 9** | 2023-06-20 05:10:28 UTC | 71.40% | 26.5% | **EXCLUDED** |
| **Landsat 8** | 2023-06-28 05:16:26 UTC | 85.90% | 12.4% | **EXCLUDED** |

### Selected Dates (8 Pre-Monsoon Scenes):
- `2023-04-01` (Landsat 9, Baseline Scene)
- `2023-04-09` (Landsat 8)
- `2023-04-17` (Landsat 9)
- `2023-04-25` (Landsat 8)
- `2023-05-03` (Landsat 9)
- `2023-05-11` (Landsat 8)
- `2023-05-19` (Landsat 9)
- `2023-05-27` (Landsat 8)

### Excluded Dates (4 June Scenes):
`2023-06-04`, `2023-06-12`, `2023-06-20`, `2023-06-28` excluded due to monsoon cloud contamination (48.3% - 85.9% cloud cover).

---

## 4. Option A vs Option B Threshold Methodology
- **Option A (Fixed Reference Thresholds):** Rigidly applies April 1 thresholds (P20 = 42.69°C, P80 = 47.06°C) to all dates. Disadvantage: Seasonal warming/cooling skews counts.
- **Option B (Date-Specific Relative Percentile Thresholds):** Calculates date-specific P20(t) and P80(t) on valid built-up LST for each date t.

---

## 5. Recommended Threshold Methodology

> [!NOTE]
> **RECOMMENDATION: OPTION B (Date-Specific Relative Percentile Thresholds)**

Option B isolates relative spatial microclimate thermal hotspots relative to the urban background on *every specific observation date*, controlling for synoptic weather variations across pre-monsoon weeks.

---

## 6. Role of Random Forest in Step 10
- **PRIMARY ANALYSIS:** Persistence derived directly from LST reference classifications Y_t(x) using date-specific P20(t)/P80(t).
- **SECONDARY ANALYSIS:** Baseline Random Forest (`models/random_forest_baseline_step8_3.joblib`) loaded **read-only** and applied to X(t) = [NDVI(t), NDBI(t)] on each date to evaluate whether static spectral indicators reproduce the LST-derived persistence patterns.

---

## 7. Temporal Label / Model Consistency
- **Model Integrity:** Model binary will **NEVER be retrained or altered**.
- **Zero Leakage:** LST layers are used ONLY for reference validation labels and never enter RF predictor matrix X = [NDVI, NDBI].

---

## 8. Landsat Preprocessing
For each date t:
1. Filter `PROCESSING_LEVEL == 'L2SP'`.
2. Apply `QA_PIXEL` cloud/shadow mask (bits 0, 1, 2, 3, 4, 5).
3. Scale Surface Reflectance: SR = DN * 0.0000275 - 0.2.
4. Scale Surface Temperature: ST = DN * 0.00341802 + 149.0 K. Convert to Celsius: LST_Celsius = ST_B10 - 273.15.
5. Calculate NDVI(t) and NDBI(t) with division-by-zero protection.

---

## 9. Dynamic World Built-up Mask
- **Product:** `GOOGLE/DYNAMICWORLD/V1`
- **Period:** April 1 – July 1, 2023
- **Aggregation:** Temporal mean built probability band >= 0.5.
- **Restriction:** Persistence calculated **strictly within the valid built-up domain** (132.1290 km²).

---

## 10. Common Spatial Grid
All scenes aligned to: 853 columns x 742 rows (30 m x 30 m grid, EPSG:4326 / EPSG:32643).

---

## 11. Missing-Data Methodology & Refined Formula

- **Classified Valid Count:** N_classified_valid(x) = N_hotspot(x) + N_cooler(x)
- **Hotspot Persistence Proportion:** P_ref(x) = N_hotspot(x) / N_classified_valid(x)

Unclassified middle 60% observations (P20 < LST < P80) are tracked but excluded from the classified denominator.

---

## 12. Minimum Observation Threshold
- **Threshold:** N_min_classified >= 4 classified valid observations out of 8 selected dates.

---

## 13. Persistence Categories
1. **0% (Never Observed Hotspot):** P(x) = 0.0
2. **>0% – 25% (Rare Hotspot)**
3. **>25% – 50% (Occasional Hotspot)**
4. **>50% – 75% (Frequent Hotspot)**
5. **>75% – 100% (Persistent Thermal Hotspot)**

---

## 14. Spatial Statistics Recommendation
- **Primary Statistic:** **Getis-Ord Gi* Local Spatial Autocorrelation** in UTM Zone 43N (EPSG:32643) using `PySAL` (`esda.Gi`) with 8-neighbor Queen contiguity and FDR p < 0.05 correction.

---

## 15. NDVI / NDBI Relationship Analysis
Bivariate correlation (r), category group statistics, and 2D density scatterplots.

---

## 16. Area Calculations
UTM Zone 43N (EPSG:32643) metric equal-area calculations (30 m x 30 m = 900 m² = 0.0009 km²).

---

## 17. Output Structure
- `results/10_landsat_observation_inventory.csv`
- `reports/10_pre_execution_verification.md`
- `reports/10_spatial_statistics_persistence_plan.md`
