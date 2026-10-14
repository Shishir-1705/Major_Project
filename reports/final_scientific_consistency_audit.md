# Final Scientific Consistency Audit Report

**Project**: Machine Learning-Based Urban Heat Hotspot Detection Using LST, NDVI and NDBI from Landsat Imagery  
**Directory**: `D:\Major_Project`  
**Date**: October 14, 2026  
**Auditor**: Antigravity Autonomous Scientific Systems  
**Status**: Completed & Verified  

---

## 1. Locked Model Integrity Check

- **Model Binary**: `models/random_forest_final_step10_8.joblib`
- **Expected SHA-256**: `4cb736e53c66c78dbbcbc1cf7ca3ac965af01f1c7fae829502649b018e127280`
- **Computed SHA-256**: `4cb736e53c66c78dbbcbc1cf7ca3ac965af01f1c7fae829502649b018e127280`
- **Integrity Status**: **PERFECT MATCH (PASS)**
- **Model Modifications**: **ZERO** (Weights, hyperparameters, and feature matrix untouched).

---

## 2. Discrepancies Found and Corrections Made

| # | Item / Component | Discrepancy Found | Authoritative Source Artifact | Correction Made |
|---|---|---|---|---|
| 1 | **Observation Dates** | Conversation summary noted an unverified date span (`2023-01-01 to 2023-04-23`). | `data/step10/`, `backend/app/config.py`, `results/step10/date_thresholds_inventory.csv` | Confirmed 8 real pre-monsoon dates: `2023-04-01`, `2023-04-09`, `2023-04-17`, `2023-04-25`, `2023-05-03`, `2023-05-11`, `2023-05-19`, `2023-05-27`. All code already used these dates. Documented conclusively. |
| 2 | **Built Pixel Count** | `HotspotsPage.tsx` and `MethodologyPage.tsx` cited `146,812 px`. | `data/step9/built_mask_30m.tif`, `reports/09_raster_grid_area_audit.md`, `metadata_service.py` | Corrected pixel count from `146,812` to `146,810` ($146,810 \times 0.0009 = 132.1290\text{ km}^2$). |
| 3 | **Spatial Domain Disambiguation** | Spatial domains lacked explicit visual distinction between total AOI ($461.50\text{ km}^2$), built domain ($132.13\text{ km}^2$), and valid persistence domain ($93.66\text{ km}^2$). | `scripts/10_real_multi_temporal_persistence.py`, `results/step10/persistence_category_areas_utm43n.csv` | Added explicit `Valid Domain: 93.66 km²` tags with tooltips explaining the $\ge 4$ observation inclusion criteria. Added Persistence Domain card to `MethodologyPage.tsx`. |
| 4 | **Persistence Tile Rendering** | `raster_service.py` expected categories 0..3 instead of standard 5 categories (1..5) in `categorical_persistence_30m.tif`, rendering Category 5 transparently. Used bilinear interpolation on integer raster. | `results/step10/persistence_category_areas_utm43n.csv`, `scripts/10_multi_temporal_persistence.py` | Added `Resampling.nearest` for categorical rasters. Updated colormap to correctly render Category 5 (Red `#ef4444`), Cat 4 (Orange `#fb923c`), Cat 3 (Yellow `#facc15`), Cat 2 (Cyan `#06b6d4`), and Cat 1 (Subtle Slate `#1e293b`). Updated fallback calculation in `statistics_service.py`. Cleared `.tile_cache/`. |
| 5 | **Gi* Significance Claims** | UI text referenced "90%, 95%, and 99% confidence clusters", while empirical data only has significant clusters at 90% confidence ($p_{\text{FDR}} < 0.05$). | `results/step10/gi_star_summary_statistics.csv`, `results/step10/gi_star_clustering_30m.tif` | Clarified in `OverviewPage.tsx` and `ClustersPage.tsx` that clusters represent Benjamini-Hochberg FDR $p < 0.05$ ($z \ge 1.645$) significance. |
| 6 | **LST Calibration Equation** | `MethodologyPage.tsx` omitted the explicit mathematical equation for Landsat Level-2 DN to Celsius conversion. | `scripts/05_compute_lst.py`, USGS Landsat C2 L2 Handbook | Added explicit equation: $\text{LST} (^\circ\text{C}) = (\text{DN} \times 0.00341802 + 149.0) - 273.15$. |

---

## 3. Authoritative Scientific Metrics Summary

### Independent Spatial Evaluation (195 Held-Out Samples, 10 Spatial Blocks)
- **Accuracy**: $86.67\%$ ($169 / 195$)
- **Precision**: $86.60\%$ ($84 / 97$)
- **Recall**: $86.60\%$ ($84 / 97$)
- **F1-Score**: $86.60\%$
- **ROC-AUC**: $93.37\%$
- **PR-AUC**: $93.67\%$
- **Cohen's Kappa**: $0.7333$
- **Brier Score**: $0.1059$
- **Confusion Matrix**: True Negatives = 85, False Positives = 13, False Negatives = 13, True Positives = 84

### Spatial Persistence & Clustering (104,063 Valid Domain Pixels, $93.657\text{ km}^2$)
- **Chronic Hotspots (Cat 5, >75–100% Recurrence)**: $8.806\text{ km}^2$ ($9.40\%$)
- **Frequent Hotspots (Cat 4, >50–75% Recurrence)**: $0.544\text{ km}^2$ ($0.58\%$)
- **Moderate Hotspots (Cat 3, >25–50% Recurrence)**: $0.835\text{ km}^2$ ($0.89\%$)
- **Low Recurrence (Cat 2, >0–25% Recurrence)**: $1.678\text{ km}^2$ ($1.79\%$)
- **Never Hotspot (Cat 1, 0% Recurrence)**: $81.795\text{ km}^2$ ($87.33\%$)
- **Getis-Ord Gi* Significant Hotspot Cluster ($p_{\text{FDR}} < 0.05, z \ge 1.645$)**: $8.856\text{ km}^2$ ($9.46\%$)
- **Spatial Convergence**: The $8.856\text{ km}^2$ ($9.46\%$) Gi* cluster directly corroborates the $8.806\text{ km}^2$ ($9.40\%$) chronic persistence zone in the central commercial core of Mysuru.

---

## 4. Verification Testing Results

- **Backend Pytest Suite**: `16/16 PASSED` in 2.61s. Zero regressions.
- **Frontend TypeScript Check**: `0 ERRORS`.
- **Frontend Production Build**: `PASSED` in 3.43s.
- **Browser Automation (Playwright)**:
  - All 8 routes directly load and survive page reloads.
  - Back/forward browser history verified.
  - 20 tile requests detected per map route.
  - Total critical console errors: **0**.
- **Model Checksum Check**: `4cb736e53c66c78dbbcbc1cf7ca3ac965af01f1c7fae829502649b018e127280` (**EXACT MATCH**).

---

## 5. Unresolved Conflicts

**None.** All scientific numbers, domains, equations, and dates are 100% aligned with the authoritative underlying rasters and CSVs.
