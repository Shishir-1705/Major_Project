# Final Scientific Consistency Audit

**Project**: Machine Learning-Based Urban Heat Hotspot Detection Using LST, NDVI and NDBI from Landsat Imagery  
**Study Area**: Mysuru, Karnataka, India  
**Date of Audit**: October 14, 2026  
**Auditor**: Antigravity Autonomous Scientific Systems  
**Locked Model Checksum**: `4cb736e53c66c78dbbcbc1cf7ca3ac965af01f1c7fae829502649b018e127280`  

---

## 1. Executive Summary

This audit establishes a complete verification of all scientific claims, numerical metrics, spatial domain designations, observation dates, and machine learning evaluation artifacts across the frontend WebGIS interface, backend FastAPI service, and authoritative research files.

Zero modifications were made to the locked Random Forest model binary, training data, test splits, GeoTIFF rasters, pseudo-reference labels, or mathematical evaluation methodologies. All identified discrepancies were strictly confined to documentation, UI labels, and raster rendering colormaps, aligning the user interface with the authoritative underlying research data.

---

## 2. Model Integrity & Metrics Verification

### 2.1 Model Binary Integrity
- **Model Path**: `models/random_forest_final_step10_8.joblib`
- **Algorithm**: `RandomForestClassifier (100 Trees)`
- **SHA-256 Checksum**: `4cb736e53c66c78dbbcbc1cf7ca3ac965af01f1c7fae829502649b018e127280`
- **Verification Status**: **100% UNCHANGED AND VERIFIED**
- **Verified Hyperparameters**:
  - `n_estimators`: 100
  - `criterion`: `'gini'`
  - `max_depth`: 5
  - `min_samples_split`: 10
  - `min_samples_leaf`: 5
  - `max_features`: `'sqrt'`
  - `bootstrap`: True
  - `random_state`: 42
  - `class_weight`: None (balanced sampling across spatial blocks)

### 2.2 Independent Spatial Evaluation Metrics
- **Authoritative Source Artifact**: `results/step10_9/final_locked_evaluation_metrics.csv` & `results/step10_9/final_evaluation_summary.md`
- **Evaluation Protocol**: Spatial GroupKFold block partitioning (10 held-out spatial blocks in `data/Mysuru_Urban_Heat_Hotspot_Test_Step8_2.csv`, zero spatial autocorrelation leakage from 30 training blocks).
- **Test Sample Size ($N$)**: 195 samples
- **Confusion Matrix**:
  - True Negatives ($\text{TN}$): **85** ($43.59\%$)
  - False Positives ($\text{FP}$): **13** ($6.67\%$)
  - False Negatives ($\text{FN}$): **13** ($6.67\%$)
  - True Positives ($\text{TP}$): **84** ($43.08\%$)
  - Predicted Class 0 Total: 98
  - Predicted Class 1 Total: 97
- **Mathematical Metrics Derivation**:
  $$\text{Accuracy} = \frac{\text{TN} + \text{TP}}{N} = \frac{85 + 84}{195} = \frac{169}{195} = 0.866667 \quad (\mathbf{86.67\%})$$
  $$\text{Precision} = \frac{\text{TP}}{\text{TP} + \text{FP}} = \frac{84}{84 + 13} = \frac{84}{97} = 0.865979 \quad (\mathbf{86.60\%})$$
  $$\text{Recall} = \frac{\text{TP}}{\text{TP} + \text{FN}} = \frac{84}{84 + 13} = \frac{84}{97} = 0.865979 \quad (\mathbf{86.60\%})$$
  $$\text{F1-Score} = 2 \times \frac{\text{Precision} \times \text{Recall}}{\text{Precision} + \text{Recall}} = 0.865979 \quad (\mathbf{86.60\%})$$
  $$\text{ROC-AUC} = 0.933673 \quad (\mathbf{93.37\%})$$
  $$\text{PR-AUC} = 0.936654 \quad (\mathbf{93.67\%})$$
  $$\text{Cohen's Kappa} = \mathbf{0.733326}$$
  $$\text{Brier Score} = \mathbf{0.105892}$$
- **Feature Importance Attribution**:
  - **NDBI (Normalized Difference Built-up Index)**: **0.610315** ($61.03\%$) — Primary positive predictor of surface thermal vulnerability.
  - **NDVI (Normalized Difference Vegetation Index)**: **0.389685** ($38.97\%$) — Primary negative (mitigating) predictor.
- **Audit Finding**: All displayed metrics across `ModelPage.tsx`, `OverviewPage.tsx`, and `MethodologyPage.tsx` are 100% consistent with the authoritative CSV and markdown artifacts.

---

## 3. Observation Date Audit

### 3.1 Date Investigation
- A prior conversation summary inadvertently referenced an unverified date span (`2023-01-01 to 2023-04-23`).
- **Authoritative Data Check**:
  - Inspection of `data/step10/` revealed 40 real Landsat GeoTIFF rasters (`lst_30m_*`, `ndvi_30m_*`, `ndbi_30m_*`, `ref_label_30m_*`, `rf_prob_30m_*`, `rf_class_30m_*`).
  - Inspection of `backend/app/config.py` and `backend/app/services/metadata_service.py` confirmed 8 dates.
  - Inspection of `results/step10/date_thresholds_inventory.csv` confirmed 8 pre-monsoon scenes.
- **Confirmed Authoritative Dates**:
  1. `2023-04-01` — Landsat 9 OLI-2/TIRS-2 (`LC09_144051_20230401`)
  2. `2023-04-09` — Landsat 8 OLI/TIRS (`LC08_144051_20230409`)
  3. `2023-04-17` — Landsat 9 OLI-2/TIRS-2 (`LC09_144051_20230417`)
  4. `2023-04-25` — Landsat 8 OLI/TIRS (`LC08_144051_20230425`)
  5. `2023-05-03` — Landsat 9 OLI-2/TIRS-2 (`LC09_144051_20230503`)
  6. `2023-05-11` — Landsat 8 OLI/TIRS (`LC08_144051_20230511`)
  7. `2023-05-19` — Landsat 9 OLI-2/TIRS-2 (`LC09_144051_20230519`)
  8. `2023-05-27` — Landsat 8 OLI/TIRS (`LC08_144051_20230527`)
- **Cadence**: 8-day alternating satellite revisit across Path 144, Row 51.
- **Audit Conclusion**: No rasters or metadata for `2023-01-01 to 2023-04-23` exist in the repository. All application pages correctly present April 1 to May 27, 2023.

---

## 4. Spatial Domain and Area Audit

| Domain Concept | Area ($\text{km}^2$) | Pixel Count ($30\text{m}$) | Spatial Mask / Definition | Authoritative Source Artifact |
|---|---|---|---|---|
| **Total Study Bounding Box** | $461.50\text{ km}^2$ | 512,778 px | Geographic AOI bounds: $[76.50^\circ\text{E}, 12.15^\circ\text{N}, 76.75^\circ\text{E}, 12.40^\circ\text{N}]$ | `MetadataService.get_project_metadata()` |
| **Mapped Built Domain** | $132.129\text{ km}^2$ | 146,810 px | Dynamic World V1 Built Probability $\ge 0.5$ (`data/step9/built_mask_30m.tif`) | `reports/09_raster_grid_area_audit.md` |
| **Valid Persistence Domain** | $93.657\text{ km}^2$ | 104,063 px | Built pixels with $\ge 4$ cloud-free classified thermal observations across 8 dates | `scripts/10_real_multi_temporal_persistence.py` |
| **Chronic Hotspots (Cat 5)** | $8.806\text{ km}^2$ | 9,784 px | Hotspot recurrence $>75–100\%$ ($P_{\text{ref}} > 0.75$) within valid persistence domain | `results/step10/persistence_category_areas_utm43n.csv` |
| **Gi* Hotspot Cluster** | $8.856\text{ km}^2$ | 9,840 px | Local Getis-Ord $G_i^*$ spatial clustering with Benjamini-Hochberg FDR $p < 0.05$ ($z \ge 1.645$) | `results/step10/gi_star_summary_statistics.csv` |

### 4.1 Provenance of Denominators
- **Denominator for Recurrence Percentages**: $104,063\text{ pixels}$ ($93.657\text{ km}^2$).
  - Chronic hotspots: $\frac{9,784}{104,063} \times 100\% = \mathbf{9.40\%}$.
  - Gi* hotspot cluster: $\frac{9,840}{104,063} \times 100\% = \mathbf{9.46\%}$.
- **Denominator for Date-Specific Built Hotspot Percentages**: $146,810\text{ pixels}$ ($132.129\text{ km}^2$).
- **Discrepancy Corrected**: `HotspotsPage.tsx` and `MethodologyPage.tsx` previously noted `146,812 px` in UI text due to a typographical artifact. Corrected to `146,810 px` to match `metadata_service.py` and `built_mask_30m.tif`.

---

## 5. Persistence and Gi* Legend & Colormap Audit

### 5.1 Persistence Raster Encoding
- **Source**: `results/step10/categorical_persistence_30m.tif` (dtype: `uint8`, nodata: `255`).
- **Encoding Structure**:
  - `1`: Category 1: 0% Recurrence (Never Hotspot) — $81.795\text{ km}^2$ ($87.33\%$)
  - `2`: Category 2: >0–25% Recurrence (Low) — $1.678\text{ km}^2$ ($1.79\%$)
  - `3`: Category 3: >25–50% Recurrence (Moderate) — $0.835\text{ km}^2$ ($0.89\%$)
  - `4`: Category 4: >50–75% Recurrence (High) — $0.544\text{ km}^2$ ($0.58\%$)
  - `5`: Category 5: >75–100% Recurrence (Persistent / Chronic) — $8.806\text{ km}^2$ ($9.40\%$)
  - `255`: NoData / Non-domain pixels (transparent)
- **Discrepancy Found**: `backend/app/services/raster_service.py` previously expected values 0, 1, 2, 3 instead of 1, 2, 3, 4, 5, causing Category 5 (Chronic) to render transparently, and used `bilinear` resampling which created interpolation artifacts on integer boundaries.
- **Correction Made**:
  1. Updated `raster_service.py` to use `Resampling.nearest` for categorical layers.
  2. Mapped Category 5 (Red `#ef4444`), Category 4 (Orange `#fb923c`), Category 3 (Yellow `#facc15`), Category 2 (Cyan `#06b6d4`), and Category 1 (Subtle Slate `#1e293b`).
  3. Updated fallback in `statistics_service.py` to correctly tally categories 1 through 5.
  4. Purged `.tile_cache/` so newly generated tiles reflect the corrected colormap.

### 5.2 Getis-Ord Gi* Raster Encoding
- **Source**: `results/step10/gi_star_clustering_30m.tif` (dtype: `uint8`, nodata: `255`).
- **Encoding Structure**:
  - `1`: Statistically Significant Hotspot Cluster ($z \ge 1.645$, FDR $p < 0.05$) — $8.856\text{ km}^2$ ($9.46\%$)
  - `0`: Not Significant — $84.801\text{ km}^2$ ($90.54\%$)
  - `255`: NoData (transparent)
- **Audit Finding**: In the summer 2023 dataset, no coldspot clusters or 95%/99% hotspot clusters emerged.
- **Correction Made**: Updated `OverviewPage.tsx` to state "statistically significant hotspot clusters (FDR p < 0.05)" rather than implying active 95% and 99% clusters exist. Clarified the significance label in `ClustersPage.tsx` as `FDR p < 0.05 (z ≥ 1.645)`.

---

## 6. Methodology Documentation Audit

- **LST Calibration Equation**: Added the explicit USGS Collection 2 Level-2 conversion equation:
  $$\text{LST} (^\circ\text{C}) = (\text{DN} \times 0.00341802 + 149.0) - 273.15$$
- **Spectral Index Formulations**: Verified standard formulas:
  $$\text{NDVI} = \frac{\text{NIR} - \text{Red}}{\text{NIR} + \text{Red}}, \quad \text{NDBI} = \frac{\text{SWIR}_1 - \text{NIR}}{\text{SWIR}_1 + \text{NIR}}$$
- **Scientific Disclosures & Governance**:
  - Confirmed clear distinction between satellite radiometric skin temperature and 2 m ambient air temperature.
  - Confirmed pseudo-reference labels derived from statistical $P_{80}$ thresholds are distinguished from ground truth.
  - Confirmed relative surface hotspots do not constitute meteorological heatwave declarations.
  - Confirmed optical index correlations do not establish thermodynamic causation.

---

## 7. Verification Test Suite Results

| Test Protocol | Command / Target | Result | Detail |
|---|---|---|---|
| **Backend Test Suite** | `python -m pytest backend/tests/test_api.py -v` | **16/16 PASSED** | Zero regressions across health, metadata, layers, dates, model, tiles, and statistics (2.61s). |
| **TypeScript Typecheck** | `npx tsc --noEmit` (in `frontend/`) | **0 ERRORS** | Clean compilation across all routes and components. |
| **Production Build** | `npm run build` (in `frontend/`) | **PASSED** | Clean production bundle generated in 3.43s. |
| **Playwright Automation** | `test_batch1_pages_and_screenshots.py` | **PASSED** | Verified `/lst`, `/hotspots`, `/indices`, date switching, tile loads, 0 console errors. |
| **Playwright Automation** | `test_batch2_pages_and_screenshots.py` | **PASSED** | Verified `/persistence`, `/clusters`, `/model`, `/methodology`, back/forward history, 0 console errors. |
| **Route & Reload Audit** | `test_routes_and_screenshots.py` | **PASSED** | Verified all 8 routes load directly, survive browser reload, and capture desktop/mobile viewports. |
| **Model SHA-256 Check** | `models/random_forest_final_step10_8.joblib` | **EXACT MATCH** | `4cb736e53c66c78dbbcbc1cf7ca3ac965af01f1c7fae829502649b018e127280` |

---

## 8. Summary of Corrections Made

1. `backend/app/services/raster_service.py`: Added `Resampling.nearest` for categorical layers and corrected persistence colormap to standard 5-tier scientific categories (`1..5`).
2. `backend/app/services/statistics_service.py`: Updated fallback persistence calculation to 5 categories and ensured strict `255` NoData masking in Gi* statistics.
3. `frontend/src/pages/MethodologyPage.tsx`: Corrected built pixel count to 146,810 px, added explicit persistence domain card ($93.66\text{ km}^2$), and documented USGS Collection 2 Level-2 LST equation.
4. `frontend/src/pages/HotspotsPage.tsx`: Corrected built pixel count label from 146,812 to 146,810.
5. `frontend/src/pages/PersistencePage.tsx`: Added clear `Valid Domain: 93.66 km²` label with tooltip detailing pixel inclusion criteria ($N_{\text{classified}} \ge 4$).
6. `frontend/src/pages/ClustersPage.tsx`: Added `FDR p < 0.05 (z ≥ 1.645)` threshold badge.
7. `frontend/src/pages/OverviewPage.tsx`: Refined Gi* card description to specify FDR $p < 0.05$ hotspot clusters.
8. `.tile_cache/`: Cleared stale cached tiles to ensure immediate rendering of corrected colormaps.
9. `reports/screenshots/`: Captured 16 updated screenshots across desktop and mobile viewports.
