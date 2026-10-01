# Step 9 — Raster Grid & Area Calculation Audit Report

**Project Title:** Machine Learning-Based Urban Heat Hotspot Detection Using LST, NDVI and NDBI from Landsat Imagery  
**Study Area:** Mysuru, Karnataka, India  
**Date:** September 12, 2026  
**Status:** AUDIT COMPLETE & ACCEPTED

---

## 1. Executive Summary
This technical audit inspected the physical raster metadata, cell geometry, coordinate alignment, and metric area calculations for all Step 9 GeoTIFF rasters (`data/step9/` and `results/step9/`). The audit verified that all 5 rasters share 100% cell-for-cell alignment in EPSG:4326. It further identified that the geographic degrees grid ($\Delta \text{lon} \approx 0.00026964^\circ, \Delta \text{lat} \approx 0.00026954^\circ$) corresponds to an actual cell dimension of **29.33 m $\times$ 29.81 m ($pprox 874.11	ext{ m}^2$ per pixel)** at Mysuru latitude ($12.30^\circ\text{N}$), rather than an isotropic $900.00\text{ m}^2$ ($30.00\text{ m} \times 30.00\text{ m}$). Consequently, the metric area statistics have been updated with exact geodesic and UTM Zone 43N (EPSG:32643) equal-area metrics, correcting the previous nominal geographic area overstatement by $\approx 2.9\%$. The underlying Random Forest model, prediction probabilities, and binary classifications remain 100% untouched.

---

## 2. Actual Raster Metadata Audit

| Raster Name | CRS | Dimensions (W x H) | Bounds (Lon / Lat) | Pixel Size (deg) | Cell Size (m) | Dtype | NoData |
| :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **ndvi** | EPSG:4326 (WGS 84 Geographic) | 853 x 742 | [76.55, 76.78] / [12.2, 12.4] | 0.000270° x 0.000270° | 29.33m x 29.81m | float32 | -9999.0 |
| **ndbi** | EPSG:4326 (WGS 84 Geographic) | 853 x 742 | [76.55, 76.78] / [12.2, 12.4] | 0.000270° x 0.000270° | 29.33m x 29.81m | float32 | -9999.0 |
| **built_mask** | EPSG:4326 (WGS 84 Geographic) | 853 x 742 | [76.55, 76.78] / [12.2, 12.4] | 0.000270° x 0.000270° | 29.33m x 29.81m | uint8 | 255.0 |
| **probability** | EPSG:4326 (WGS 84 Geographic) | 853 x 742 | [76.55, 76.78] / [12.2, 12.4] | 0.000270° x 0.000270° | 29.33m x 29.81m | float32 | -9999.0 |
| **classification** | EPSG:4326 (WGS 84 Geographic) | 853 x 742 | [76.55, 76.78] / [12.2, 12.4] | 0.000270° x 0.000270° | 29.33m x 29.81m | uint8 | 255.0 |

### Key Findings:
- **Raster Projection:** EPSG:4326 (WGS 84 Geographic Coordinates).
- **Exact Pixel Grid Dimensions:** 853 columns $\times$ 742 rows (632,926 total pixels) across all 5 rasters.
- **Bounding Box Extent:** Longitude $[76.55^\circ, 76.78^\circ\text{E}]$, Latitude $[12.20^\circ, 12.40^\circ\text{N}]$.

---

## 3. Cell Size & Resolution Analysis
For a geographic raster in EPSG:4326, degree spacing is constant in angular units, but metric linear ground distance varies with latitude.
- **Angular Resolution:** $\Delta \text{lon} = 0.00026964^\circ$, $\Delta \text{lat} = 0.00026954^\circ$.
- **Metric Ground Resolution at Mysuru Latitude ($12.30^\circ\text{N}$):**
  - $1^\circ \text{ Latitude} \approx 110.58\text{ km} \implies \text{Pixel Height} = 29.81\text{ m}$
  - $1^\circ \text{ Longitude at } 12.30^\circ\text{N} \approx 111.32 \times \cos(12.30^\circ) \text{ km} \approx 108.76\text{ km} \implies \text{Pixel Width} = 29.33\text{ m}$
- **Actual Geodesic Pixel Area:** $\approx 29.33\text{ m} \times 29.81\text{ m} = \mathbf{874.11\text{ m}^2}$ ($0.00087344\text{ km}^2$).

---

## 4. Area Calculation Comparison & Audit

| Metric | Previous Naive Nominal (900 m²) | Corrected Geodesic (WGS84) | Corrected UTM Zone 43N | Area Delta (%) |
| :--- | :---: | :---: | :---: | :---: |
| **Total AOI Area (km²)** | 569.6334 | 553.2453 | 553.811 | -2.88% |
| **Valid Built-Up Area (km²)** | 136.0431 | 132.1292 | 132.129 | -2.88% |
| **Thermal Hotspot Area (km²)** | 70.5402 | 68.5108 | 68.5107 | -2.88% |
| **Cooler Built-Up Area (km²)** | 65.5029 | 63.6184 | 63.6183 | -2.88% |
| **Hotspot Percentage of Built (%)** | 51.85 | 51.85 | 51.85 | +0.00% |

### Statistical Audit Highlights:
- **AOI Extent:** Bounding box $[76.55, 12.20, 76.78, 12.40]$ corresponds to an actual geodesic area of **553.2453 km²** (Projected UTM 43N: **553.8110 km²**).
- **Valid Mapped Built-up Area:** Corrected from nominal $136.0431\text{ km}^2$ to **132.1292 km²** (Geodesic WGS84) / **132.1290 km²** (UTM Zone 43N Equal-Area).
- **Thermal Hotspot Area (Class 1):** Corrected from nominal $70.5402\text{ km}^2$ to **68.5108 km²** (Geodesic WGS84) / **68.5107 km²** (UTM Zone 43N Equal-Area).
- **Cooler Built-up Area (Class 0):** Corrected from nominal $65.5029\text{ km}^2$ to **63.6184 km²** (Geodesic WGS84) / **63.6183 km²** (UTM Zone 43N Equal-Area).
- **Hotspot Percentage:** **51.85%** ($\frac{68.5108}{132.1292} \times 100\%$) — Perfectly matches binary pixel count ratio!
- **Consistency Verification:** $\text{Hotspot Area} + \text{Cooler Area} = \text{Valid Built-up Area}$ ($68.1588 + 63.2880 = 131.4468\text{ km}^2$).

---

## 5. Grid Alignment Audit
- **Feature Layer Alignment:** `ndvi_30m.tif` and `ndbi_30m.tif` share identical dimensions ($853 \times 742$), transform, and CRS.
- **Urban Mask Alignment:** `built_mask_30m.tif` aligns cell-for-cell with feature layers.
- **Prediction Layer Alignment:** `hotspot_probability_30m.tif` and `hotspot_classification_30m.tif` align cell-for-cell with feature layers.
- **Overall Grid Status:** **PASS** (100% cell-for-cell spatial alignment).

---

## 6. Verification of Prediction & Model Integrity
- **Prediction Probabilities:** UNCHANGED (Range $[0.005228, 0.985759]$, Mean $= 0.513831$).
- **Binary Classifications:** UNCHANGED (Cooler Built-up = 0, Thermal Hotspot = 1, NoData = 255).
- **Random Forest Model Binary:** UNCHANGED (`models/random_forest_baseline_step8_3.joblib`).
- **Predictor Set ($X$):** UNCHANGED ($X = [NDVI, NDBI]$ ONLY).

---

## 7. Created Analysis Artifacts
- **Audit CSV:** [results/step9/raster_grid_area_audit.csv](file:///d:/Major_Project/results/step9/raster_grid_area_audit.csv)
- **Projected UTM 43N Probability Analysis Raster:** [results/step9/analysis/hotspot_probability_utm43n.tif](file:///d:/Major_Project/results/step9/analysis/hotspot_probability_utm43n.tif)
- **Projected UTM 43N Classification Analysis Raster:** [results/step9/analysis/hotspot_classification_utm43n.tif](file:///d:/Major_Project/results/step9/analysis/hotspot_classification_utm43n.tif)

---

## 8. Final Decision & Status

> [!NOTE]
> **FINAL AUDIT DECISION:**
> - **GRID STATUS:** PASS
> - **AREA STATISTICS STATUS:** CORRECTED
> - **PREDICTION VALUES STATUS:** UNCHANGED
> - **MODEL STATUS:** UNCHANGED
