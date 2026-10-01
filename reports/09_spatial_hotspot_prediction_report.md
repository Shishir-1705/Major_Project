# Step 9 — Spatial Hotspot Prediction & Raster Map Generation Report

**Project Title:** Machine Learning-Based Urban Heat Hotspot Detection Using LST, NDVI and NDBI from Landsat Imagery  
**Study Area:** Mysuru, Karnataka, India  
**Date:** September 12, 2026  
**Status:** COMPLETE (Step 9 Executed)

---

## 1. Executive Summary
Step 9 successfully applied the approved, fitted baseline Random Forest model (`models/random_forest_baseline_step8_3.joblib`) spatially across the Mysuru Area of Interest (AOI) to generate 30 m spatial resolution raster prediction products for the pre-monsoon representative scene (April 1, 2023). Using the preprocessed NDVI and NDBI spectral predictor layers restricted to the Dynamic World V1 urban built-up domain (built_prob >= 0.5), continuous thermal hotspot probabilities and binary hotspot classifications were generated without model retraining, hyperparameter alteration, or target leakage.

---

## 2. Spatial Grid & Scene Specifications
- **Representative Landsat Scene:** Landsat 9 OLI-2 / TIRS-2 (WRS-2 Path 144, Row 51, `2023-04-01 05:10:49 UTC`)
- **AOI Bounding Extent:** 76.55° - 76.78° E, 12.20° - 12.40° N (Mysuru, Karnataka)
- **Raster Dimensions:** 853 columns x 742 rows (632,926 total pixels)
- **Spatial Resolution:** Exact 30 m x 30 m grid
- **Coordinate Reference System:** WGS 84 Geographic (EPSG:4326) / Metric Area Projection UTM Zone 43N (EPSG:32643)

---

## 3. Machine Learning Inference Pipeline
- **Fitted Model Loaded:** `models/random_forest_baseline_step8_3.joblib` (Loaded in Read-Only Mode)
- **Model Architecture:** Option A (GEE 30 m Preprocessed Features -> Python `rasterio` + `scikit-learn` Inference)
- **Predictor Set (X):** `NDVI` and `NDBI` ONLY (X = [NDVI, NDBI])
- **Feature Stack Order:** `['NDVI', 'NDBI']` (Strictly matches training order)
- **Domain Masking:** Dynamic World V1 Built Probability >= 0.5 (built_mask = 1)
- **NoData Rule:** Non-built, rural, water, and cloud-masked pixels assigned NoData (`-9999.0` Float32 / `255` UInt8)

---

## 4. Spatial Area Statistics Table

| Spatial Metric | Value |
| :--- | :---: |
| **Total AOI Geographic Area (km²)** | 569.6334 |
| **Total AOI Pixels** | 632926.0 |
| **Valid Mapped Built-Up Pixels** | 151159.0 |
| **Valid Mapped Built-Up Area (km²)** | 136.0431 |
| **Thermal Hotspot Pixels (Class 1)** | 78378.0 |
| **Thermal Hotspot Area (km²)** | 70.5402 |
| **Cooler Built-Up Pixels (Class 0)** | 72781.0 |
| **Cooler Built-Up Area (km²)** | 65.5029 |
| **Hotspot Percentage of Built-Up Area (%)** | 51.85 |
| **Prediction Probability Min (Valid Pixels)** | 0.005228 |
| **Prediction Probability Max (Valid Pixels)** | 0.985759 |
| **Prediction Probability Mean (Valid Pixels)** | 0.513831 |
| **Prediction Probability Std (Valid Pixels)** | 0.375726 |

### Key Statistical Highlights:
- **Total AOI Extent:** 569.63 km² (632,926 total pixels)
- **Mapped Valid Urban Built-up Domain:** **136.0431 km²** (151,159 pixels)
- **Thermal Hotspot Area (Class 1):** **70.5402 km²** (78,378 pixels)
- **Cooler Built-up Area (Class 0):** **65.5029 km²** (72,781 pixels)
- **Hotspot Proportion of Mapped Built Domain:** **51.85%**
- **Continuous Prediction Probability Range (Valid Pixels):** Min = **0.005228**, Max = **0.985759**, Mean = **0.513831**

---

## 5. Automated Validation Checks Results

| Validation Check | Required Specification | Outcome | Status |
| :--- | :--- | :--- | :---: |
| **1. Feature-Band Existence** | Verified | Verified | PASS |
| **2. Feature Ordering** | Verified | Verified | PASS |
| **3. Model Compatibility** | Verified | Verified | PASS |
| **4. Probability Range [0.0, 1.0]** | Verified | Verified | PASS |
| **5. Binary Class Values {0, 1}** | Verified | Verified | PASS |
| **6. NoData Values (-9999 / 255)** | Verified | Verified | PASS |
| **7. Output Grid CRS (EPSG:4326)** | Verified | Verified | PASS |
| **8. Output Resolution (30 m)** | Verified | Verified | PASS |
| **9. Pixel Alignment** | Verified | Verified | PASS |
| **10. AOI Bounds** | Verified | Verified | PASS |
| **11. Built-up Mask Application** | Verified | Verified | PASS |
| **12. Zero Thermal Variables in X** | Verified | Verified | PASS |

---

## 6. Generated Output File Registry

| Category | File Path | Format / Resolution | Description |
| :--- | :--- | :--- | :--- |
| **Input Feature Rasters** | `data/step9/ndvi_30m.tif` | 30m GeoTIFF (Float32) | Preprocessed NDVI raster layer |
| **Input Feature Rasters** | `data/step9/ndbi_30m.tif` | 30m GeoTIFF (Float32) | Preprocessed NDBI raster layer |
| **Input Feature Rasters** | `data/step9/built_mask_30m.tif` | 30m GeoTIFF (UInt8) | Dynamic World V1 built mask (>= 0.5) |
| **Prediction Rasters** | `results/step9/hotspot_probability_30m.tif` | 30m GeoTIFF (Float32) | Continuous RF hotspot probability (0.0 - 1.0) |
| **Prediction Rasters** | `results/step9/hotspot_classification_30m.tif` | 30m GeoTIFF (UInt8) | Binary RF hotspot classification (0 vs 1) |
| **Spatial Statistics** | `results/step9/spatial_statistics.csv` | Tabular CSV | Area and pixel statistics in UTM 43N |
| **Publication Maps** | `figures/step9/ndvi_map.png` | 300 DPI PNG Figure | Spatial NDVI distribution map |
| **Publication Maps** | `figures/step9/ndbi_map.png` | 300 DPI PNG Figure | Spatial NDBI distribution map |
| **Publication Maps** | `figures/step9/hotspot_probability_map.png` | 300 DPI PNG Figure | RF continuous hotspot probability map |
| **Publication Maps** | `figures/step9/hotspot_classification_map.png` | 300 DPI PNG Figure | RF binary hotspot classification map |
| **Report** | `reports/09_spatial_hotspot_prediction_report.md` | Markdown Document | Comprehensive execution & validation report |

---

## 7. Scientific Limitations & Guidance
1. **Target Label Definition:** The predictions represent **LST-derived thermal hotspot reference labels** (Y = hotspot_label) constructed from Landsat Level-2 surface skin temperature percentiles (P20 and P80).
2. **Skin Temperature vs Air Temperature:** Predictions reflect surface radiometric skin response, NOT 2 m shelter air temperature.
3. **Not Heatwave Declarations:** The model outputs do NOT constitute official meteorology heatwave warnings or IMD declarations.
4. **Binary Reference Classifier:** The model classifies pixels into top relative thermal hotspots vs cooler built-up surfaces; it does not model the excluded middle 60% as a discrete class or predict continuous LST degrees Celsius directly.

---

## 8. Conclusion
Step 9 spatial inference has been completed with 100% automated validation pass. All spatial probability and binary classification rasters, area statistics tables, and 300 DPI publication maps are generated and ready for downstream spatial analysis.
