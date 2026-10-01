# Step 9 — Spatial Hotspot Prediction & Raster Map Generation Plan

**Project Title:** Machine Learning-Based Urban Heat Hotspot Detection Using LST, NDVI and NDBI from Landsat Imagery  
**Study Area:** Mysuru, Karnataka, India  
**Date:** September 12, 2026  
**Status:** PROPOSED PLAN ONLY (DO NOT EXECUTE YET)

---

## 1. Objective
The objective of Step 9 is to apply the approved, fitted baseline Random Forest model (`models/random_forest_baseline_step8_3.joblib`) spatially across the Mysuru Area of Interest (AOI) to generate 30 m spatial resolution prediction raster products for the pre-monsoon representative scene (April 1, 2023). This process converts pixel-level spectral predictor indices ($NDVI$ and $NDBI$) into continuous thermal hotspot probabilities and binary hotspot classifications within the validated urban built-up domain.

---

## 2. Input Datasets
- **Satellite Imagery:** Landsat 9 Collection 2 Level-2 Surface Reflectance (`LANDSAT/LC09/C02/T1_L2`)
- **Urban Mask Dataset:** Dynamic World V1 (`GOOGLE/DYNAMICWORLD/V1`) built-up probability product
- **Trained Model Binary:** `models/random_forest_baseline_step8_3.joblib` (Fitted Random Forest classifier: $n\_estimators=100, max\_depth=5, min\_samples\_split=10, min\_samples\_leaf=5$)

---

## 3. Exact Landsat Scene
- **Satellite:** Landsat 9 (Operational Land Imager 2 / Thermal Infrared Sensor 2)
- **Path / Row:** WRS-2 Path 144, Row 51
- **Acquisition Timestamp:** `2023-04-01 05:10:49 UTC`
- **Spatial Coverage:** Full coverage across Mysuru AOI ($76.55^\circ - 76.78^\circ\text{E}$, $12.20^\circ - 12.40^\circ\text{N}$)

---

## 4. Preprocessing
- **Cloud/Shadow Masking:** Validated `QA_PIXEL` Bitmasking:
  - Bit 0: Fill
  - Bit 1: Dilated Cloud
  - Bit 2: Cirrus
  - Bit 3: Cloud
  - Bit 4: Cloud Shadow
  - Bit 5: Snow
- **Surface Reflectance Calibration:** Scaled using official USGS Collection 2 Level-2 conversion:
  $$\text{SR} = \text{DN} \times 0.0000275 - 0.2$$
- **Bands Extracted:**
  - `SR_B4`: Red ($0.64 - 0.67\ \mu\text{m}$)
  - `SR_B5`: Near-Infrared / NIR ($0.85 - 0.88\ \mu\text{m}$)
  - `SR_B6`: Shortwave Infrared 1 / SWIR1 ($1.57 - 1.65\ \mu\text{m}$)

---

## 5. Feature Reconstruction
The prediction features ($X$) will be derived using the exact spectral index formulas from Steps 4 and 7:
1. **Normalized Difference Vegetation Index (NDVI):**
   $$\text{NDVI} = \frac{\text{SR\_B5} - \text{SR\_B4}}{\text{SR\_B5} + \text{SR\_B4}}$$
2. **Normalized Difference Built-Up Index (NDBI):**
   $$\text{NDBI} = \frac{\text{SR\_B6} - \text{SR\_B5}}{\text{SR\_B6} + \text{SR\_B5}}$$

- **Division-by-Zero Guard:** Mask pixels where $(\text{SR\_B5} + \text{SR\_B4}) = 0$ or $(\text{SR\_B6} + \text{SR\_B5}) = 0$.
- **Predictor Stack Constraints:** Predictor set contains $X = \{\text{NDVI}, \text{NDBI}\}$ ONLY. Absolutely no thermal variables (`LST_Celsius`, `LST`, `ST_B10`), coordinate metadata (`longitude`, `latitude`), or block IDs will enter feature matrix $X$.

---

## 6. Dynamic World Built-up Mask
To ensure consistency with Step 6 target generation and prevent misclassification of rural vegetation or water:
- **Product:** `GOOGLE/DYNAMICWORLD/V1`
- **Time Window:** April 1, 2023 to July 1, 2023
- **Aggregation:** Temporal mean built-up probability band (`built`), reprojected to the 30 m Landsat grid using `reduceResolution()` and `setDefaultProjection()`.
- **Thresholding Rule:** Urban Built Domain = $\text{Built Probability} \ge 0.5$.
- **Mask Application:** All spatial prediction products will be clipped to the built-up mask; pixels with $\text{Built Probability} < 0.5$ or cloud contamination will be assigned `NoData`.

---

## 7. Python/GEE Architecture Decision

> [!NOTE]
> **ARCHITECTURAL CHOICE: OPTION A (Python Rasterio Prediction Pipeline)**

### Rationale:
Option A exports the preprocessed 30 m multi-band predictor GeoTIFF ($\text{NDVI}, \text{NDBI}$) and urban mask GeoTIFF from Earth Engine (or `geemap`), then applies the serialized Python `joblib` Random Forest binary (`models/random_forest_baseline_step8_3.joblib`) directly using Python (`rasterio` + `scikit-learn`).

- **Key Advantage:** Preserves 100% exact numerical fidelity of the fitted `RandomForestClassifier` without requiring lossy decision tree approximation or manual decision tree re-implementation in GEE JavaScript/Python API.

---

## 8. Raster Alignment Strategy
- **Target Projection / CRS:** WGS 84 / UTM Zone 43N (EPSG:32643) or WGS 84 Geographic (EPSG:4326)
- **Spatial Resolution:** Exact 30 m $\times$ 30 m grid
- **Origin & Pixel Grid Alignment:** Enforce fixed bounding box $[76.55, 12.20, 76.78, 12.40]$ with integer pixel dimensions ($\approx 837 \text{ columns} \times 738 \text{ rows}$).
- **Resampling:** Nearest Neighbor for masks, Bilinear for spectral bands during reprojection.

---

## 9. Prediction Method
1. Load 2-band feature GeoTIFF ($\text{NDVI}, \text{NDBI}$) into Python as a 3D NumPy array of shape $(2, H, W)$.
2. Load 1-band urban mask GeoTIFF into Python as a 2D boolean array of shape $(H, W)$.
3. Flatten valid built-up pixels into a 2D matrix $X_{\text{spatial}}$ of shape $(N_{\text{valid\_pixels}}, 2)$ with feature columns `['NDVI', 'NDBI']`.
4. Execute vectorised batch prediction:
   $$\text{probs} = \text{rf.predict\_proba}(X_{\text{spatial}})[:, 1]$$
   $$\text{preds} = (\text{probs} \ge 0.5).\text{astype}(\text{uint8})$$
5. Reshape 1D prediction vectors back into 2D spatial rasters of shape $(H, W)$.

---

## 10. NoData Handling
- **NoData Value:** `-9999` (or `np.nan` for 32-bit floating point rasters)
- **Probability Raster Format:** Float32, Range $[0.0, 1.0]$, NoData = `-9999.0`
- **Classification Raster Format:** UInt8 / Int16, Values $\{0 = \text{Cooler Built-up}, 1 = \text{Thermal Hotspot}\}$, NoData = `255` or `-9999`
- **Strict Rule:** Invalid / masked pixels will NOT be set to zero ($0$ represents valid Cooler Built-up class).

---

## 11. Spatial Statistics
Spatial area calculations will be executed in UTM Zone 43N (EPSG:32643) to guarantee metric area precision ($\text{m}^2 \to \text{km}^2$):
- **Total AOI Area ($\text{km}^2$):** Bounding box extent ($\approx 554.4\text{ km}^2$)
- **Valid Built-Up Area ($\text{km}^2$):** Count of pixels with $\text{built\_mask} \ge 0.5 \times 0.0009\text{ km}^2$
- **Hotspot Area ($\text{km}^2$):** Count of predicted Class 1 pixels $\times 0.0009\text{ km}^2$
- **Cooler Built-Up Area ($\text{km}^2$):** Count of predicted Class 0 pixels $\times 0.0009\text{ km}^2$
- **Hotspot Proportion (%):** $\frac{\text{Hotspot Area}}{\text{Valid Built-Up Area}} \times 100\%$

---

## 12. Visualization Plan
Generate 4 publication-quality 300 DPI figures saved to `figures/step9/`:
1. `figures/step9/ndvi_map.png`: Spatial map of 30 m NDVI across Mysuru AOI (YlGn colormap).
2. `figures/step9/ndbi_map.png`: Spatial map of 30 m NDBI across Mysuru AOI (YlOrRd colormap).
3. `figures/step9/hotspot_probability_map.png`: Continuous spatial map of RF predicted hotspot probability ($0.0 - 1.0$) clipped to built-up domain (inferno / YlOrRd colormap).
4. `figures/step9/hotspot_classification_map.png`: Binary map displaying Class 0 (Cooler Built-up, Blue) vs Class 1 (Thermal Hotspot, Red) with clear NoData background.

All maps will include:
- Geographic coordinate axes (Latitude / Longitude grid)
- Colorbar / Categorical legend
- Scale bar and North arrow
- Standardized title specifying: *"LST-Derived Thermal Hotspot Probability / Classification (2023-04-01)"*

---

## 13. Validation Checks
Prior to finalizing raster exports, the script will execute 12 automated checks:
1. Verify 2-band predictor stack exists ($\text{NDVI}, \text{NDBI}$).
2. Confirm feature order matches model fitting order (`['NDVI', 'NDBI']`).
3. Check probability raster range is strictly within $[0.0, 1.0]$.
4. Check classification raster contains only binary values $\{0, 1\}$ plus NoData.
5. Verify GeoTIFF CRS matches reference EPSG:4326 / EPSG:32643.
6. Verify pixel resolution is exactly 30 m $\times$ 30 m.
7. Confirm bounding box matches Mysuru AOI.
8. Verify Dynamic World built mask ($\ge 0.5$) is applied.
9. Audit zero thermal variables in predictor matrix.
10. Confirm model binary `models/random_forest_baseline_step8_3.joblib` is read-only.
11. Confirm test dataset was 100% untouched.
12. Verify spatial statistics balance: $\text{Hotspot Pixels} + \text{Cooler Pixels} = \text{Total Mapped Built Pixels}$.

---

## 14. Output Files

```
d:/Major_Project/
├── scripts/
│   └── 09_generate_spatial_hotspot_maps.py     # Python spatial inference & plotting script
├── data/step9/
│   ├── ndvi_30m.tif                            # 30m NDVI GeoTIFF
│   ├── ndbi_30m.tif                            # 30m NDBI GeoTIFF
│   └── built_mask_30m.tif                      # 30m Dynamic World built mask GeoTIFF
├── results/step9/
│   ├── hotspot_probability_30m.tif             # Continuous RF hotspot probability GeoTIFF
│   ├── hotspot_classification_30m.tif          # Binary RF hotspot classification GeoTIFF
│   └── spatial_statistics.csv                  # Tabular spatial area & pixel statistics CSV
├── figures/step9/
│   ├── ndvi_map.png                            # 300 DPI NDVI spatial map
│   ├── ndbi_map.png                            # 300 DPI NDBI spatial map
│   ├── hotspot_probability_map.png             # 300 DPI hotspot probability spatial map
│   └── hotspot_classification_map.png          # 300 DPI hotspot classification spatial map
└── reports/
    └── 09_spatial_hotspot_prediction_report.md  # Markdown report documenting spatial prediction
```

---

## 15. Scientific Limitations
1. **Target Label Definition:** The model predicts **LST-derived thermal hotspot reference labels** ($Y = \text{hotspot\_label}$) constructed from Landsat Level-2 surface skin temperature percentiles ($P_{20}$ and $P_{80}$).
2. **Not Air Temperature:** The predictions reflect land surface radiometric skin thermal response, NOT 2 m ambient shelter air temperature.
3. **Not Official Heatwaves:** The model does NOT predict official meteorology heatwave declarations or IMD heatwave alerts.
4. **Binary Classifier Scope:** The model classifies pixels into top 20% relative thermal hotspots vs bottom 20% cooler built-up surfaces; it does not model the excluded middle 60% as a discrete class or predict continuous LST degrees Celsius directly.

---

## 16. Reproducibility Checklist
- [x] Model Binary: `models/random_forest_baseline_step8_3.joblib`
- [x] Target AOI: $[76.55, 12.20, 76.78, 12.40]$
- [x] Scene ID: `LANDSAT/LC09/C02/T1_L2` Path 144 / Row 51 / `2023-04-01`
- [x] Preprocessing: QA_PIXEL cloud mask + Collection 2 Level-2 scale factors
- [x] Spectral Formulae: Explicit division-by-zero protected NDVI & NDBI
- [x] Urban Masking: Dynamic World V1 Built Probability $\ge 0.5$
- [x] Raster Resolution: 30 m grid, EPSG:4326 / EPSG:32643
- [x] NoData Value: `-9999` (Float32 / UInt8)

---

## 17. Risks and Mitigations

| Risk | Mitigation Strategy |
| :--- | :--- |
| **Large Raster Memory Consumption** | Process raster block-by-block using `rasterio.windows.Window` or chunked NumPy flattening. |
| **Coordinate Misalignment** | Export all GEE layers using identical `crs` and `crsTransform` to ensure cell-for-cell alignment. |
| **Misleading Non-Urban Hotspots** | Apply Dynamic World built-up mask ($\ge 0.5$) to restrict predictions strictly to urban land cover. |
| **Accidental Model Retraining** | Load `models/random_forest_baseline_step8_3.joblib` in read-only mode (`joblib.load()`) without calling `.fit()`. |
