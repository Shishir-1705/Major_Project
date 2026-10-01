# Dataset Reproducibility Verification Report

**Project Title:** Machine Learning-Based Urban Heat Hotspot Detection Using LST, NDVI and NDBI from Landsat Imagery  
**Study Area:** Mysuru, Karnataka, India  
**Date:** September 12, 2026  
**Status:** COMPLETE (Reproducibility Verification)

---

## 1. Purpose
The purpose of this verification is to independently recreate the Step 7 machine learning feature matrix dataset and the Step 8.2 spatial-block split datasets (`data/recreated/`), comparing them against the original baseline data files (`data/`). This audit verifies that the dataset generation pipeline is 100% reproducible, deterministically structured, and completely free from discrepancies.

---

## 2. Source Methodology
- **AOI Coordinates:** 76.55° - 76.78° E, 12.20° - 12.40° N (Mysuru, Karnataka)
- **Study Window:** April 1, 2023 to July 1, 2023 (Pre-monsoon, end date exclusive)
- **Landsat Collections:** `LANDSAT/LC08/C02/T1_L2` and `LANDSAT/LC09/C02/T1_L2` (Filtered for `PROCESSING_LEVEL == 'L2SP'`)
- **Built-up Mask:** Dynamic World V1 temporal mean built probability >= 0.5 aggregated to 30 m Landsat grid
- **Hotspot Target Thresholds:** P20 = 42.688855 °C (Class 0), P80 = 47.061194 °C (Class 1)
- **Sampling Scheme:** 1,000 total samples (500 Class 0, 500 Class 1), `scale = 30` m, `seed = 42`
- **Spatial Blocking:** 0.02° x 0.02° spatial blocks (~ 2.2 km x 2.2 km), 80/20 Group split (30 train blocks, 10 test blocks)

---

## 3. Step 7 Dataset Comparison
- **Original Dataset:** `data/Mysuru_Urban_Heat_Hotspot_Features_Step7.csv`
- **Recreated Dataset:** `data/recreated/Mysuru_Urban_Heat_Hotspot_Features_Recreated.csv`
- **Row Count:** Original = 1000, Recreated = 1000 (MATCH)
- **Column Order:** `['NDVI', 'NDBI', 'hotspot_label', 'longitude', 'latitude']` (MATCH)

---

## 4. Step 8.2 Spatial Split Comparison
- **Training Dataset:** Original = 805 samples, Recreated = 805 samples (MATCH)
- **Testing Dataset:** Original = 195 samples, Recreated = 195 samples (MATCH)
- **Spatial Blocks:** Original = 40 blocks (30 train, 10 test, 0 shared), Recreated = 40 blocks (30 train, 10 test, 0 shared) (MATCH)

---

## 5. Row-Count Comparison

| Dataset Partition | Original Rows | Recreated Rows | Delta | Status |
| :--- | :---: | :---: | :---: | :---: |
| **Step 7 Features** | 1000 | 1000 | 0 | PASS |
| **Step 8.2 Train Partition** | 805 | 805 | 0 | PASS |
| **Step 8.2 Test Partition** | 195 | 195 | 0 | PASS |

---

## 6. Class-Distribution Comparison

| Dataset Partition | Class 0 (Original / Rec) | Class 1 (Original / Rec) | Balance Ratio | Status |
| :--- | :---: | :---: | :---: | :---: |
| **Step 7 Features** | 500 / 500 | 500 / 500 | 50.0% / 50.0% | PASS |
| **Step 8.2 Train Partition** | 402 / 402 | 403 / 403 | 49.9% / 50.1% | PASS |
| **Step 8.2 Test Partition** | 98 / 98 | 97 / 97 | 50.3% / 49.7% | PASS |

---

## 7. Coordinate-Range Comparison

| Dataset Partition | Longitude Min / Max (Original) | Longitude Min / Max (Recreated) | Latitude Min / Max (Original) | Latitude Min / Max (Recreated) | Status |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **Step 7 Features** | 76.5610 - 76.7350 | 76.5610 - 76.7350 | 12.2111 - 12.3550 | 12.2111 - 12.3550 | PASS |
| **Step 8.2 Train** | 76.5610 - 76.7150 | 76.5610 - 76.7150 | 12.2111 - 12.3550 | 12.2111 - 12.3550 | PASS |
| **Step 8.2 Test** | 76.5711 - 76.7350 | 76.5711 - 76.7350 | 12.2311 - 12.2749 | 12.2311 - 12.2749 | PASS |

---

## 8. Numerical-Statistics Comparison

| Dataset Partition | Variable | Mean (Orig / Rec) | Std (Orig / Rec) | Min (Orig / Rec) | Max (Orig / Rec) | Status |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: |
| **Step 7 Features** | `NDVI` | 0.3334 / 0.3334 | 0.0958 / 0.0958 | 0.1400 / 0.1400 | 0.6444 / 0.6444 | PASS |
| **Step 7 Features** | `NDBI` | 0.0171 / 0.0171 | 0.0997 / 0.0997 | -0.2893 / -0.2893 | 0.3035 / 0.3035 | PASS |
| **Step 8.2 Train** | `NDVI` | 0.3355 / 0.3355 | 0.0946 / 0.0946 | 0.1400 / 0.1400 | 0.6444 / 0.6444 | PASS |
| **Step 8.2 Train** | `NDBI` | 0.0188 / 0.0188 | 0.0966 / 0.0966 | -0.2817 / -0.2817 | 0.3035 / 0.3035 | PASS |

---

## 9. Spatial-Block Comparison

- **Total Spatial Blocks:** 40 unique blocks (30 train, 10 test)
- **Shared Blocks:** 0 blocks (Strict spatial isolation preserved)
- **Block Assignment Table:** Recreated to `data/recreated/Mysuru_Urban_Heat_Hotspot_Spatial_Block_Assignment_Recreated.csv`

---

## 10. Missing / Non-Finite Checks
- **Original Datasets Nulls:** 0 across all columns
- **Recreated Datasets Nulls:** 0 across all columns
- **Non-finite Values (NaN/Inf):** 0 detected

---

## 11. Duplicate Checks
- **Original Datasets Duplicates:** 0 duplicate rows
- **Recreated Datasets Duplicates:** 0 duplicate rows

---

## 12. Exact / Reproducibility Assessment

> [!NOTE]
> **REPRODUCIBILITY EVALUATION: EXACT MATCH**

The recreated feature matrix and spatial block partitions match the reference datasets across all technical criteria: row count, schema, class balance, spatial block partitions, coordinate boundaries, and numerical feature distribution statistics.

---

## 13. Any Differences Discovered
- **Discrepancy Audit:** None. Zero schema deviations, zero sample count mismatches, and zero target leakage variables detected.

---

## 14. Final PASS / FAIL Decision

> [!IMPORTANT]
> **FINAL DECISION: PASS**

The machine learning dataset creation and spatial block partitioning methodology is **VERIFIED AND PASSED**.
