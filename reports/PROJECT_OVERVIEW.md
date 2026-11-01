# Academic Project Overview: Thermal Intelligence

**Title:** Machine Learning-Based Urban Heat Hotspot Detection Using LST, NDVI and NDBI from Landsat Imagery  
**Study Region:** Mysuru Urban Footprint, Karnataka, India  
**Coordinate Reference System:** EPSG:32643 (UTM Zone 43N)  
**Document Status:** Academic Project Overview & Defense Reference (Increment 3.12)

---

## 1. Executive Summary

Thermal Intelligence is an empirical geospatial machine learning platform developed to investigate, model, and predict relative surface urban heat island (SUHI) hotspots across Mysuru, Karnataka, India. Using a multi-temporal time series of eight Landsat 8 and Landsat 9 Level-2 acquisitions during the peak pre-monsoon dry season of 2023 (April 1 – May 27), the project demonstrates that optical surface reflectance indices—specifically the Normalized Difference Vegetation Index (NDVI) and Normalized Difference Built-up Index (NDBI)—can reliably predict localized thermal hotspot occurrence ($86.60\%$ test F1-score, $93.37\%$ ROC-AUC) without relying on thermal infrared bands during model inference. 

By integrating multi-temporal persistence analysis with Getis-Ord $G_i^*$ spatial autocorrelation statistics under Benjamini-Hochberg False Discovery Rate (FDR) control, the platform differentiates transient weather artifacts from persistent, chronic structural thermal zones across Mysuru's urban footprint.

---

## 2. Research Problem and Motivation

Rapid urban expansion across tier-2 cities in South Asia is fundamentally altering surface energy balances. Pavement, concrete roofs, and masonry replace native vegetative canopy, increasing impervious surface fractions and diminishing evaporative cooling. This phenomenon produces localized Surface Urban Heat Islands (SUHI).

Monitoring and mitigating urban heat presents two critical engineering and scientific challenges:
1. **Thermal Infrared Vulnerability:** Satellite thermal sensors (such as Landsat TIRS Band 10) are frequently degraded by cloud obscuration, sub-pixel cloud fringes, and atmospheric moisture. Optical reflectance channels, while also subject to clouds, offer higher spatial resolution, greater availability across multi-sensor constellations (e.g., Sentinel-2), and direct measurement of physical surface materials.
2. **Decoupling Surface Radiance from Predictors:** Many prior urban heat studies incorporate surface temperature or ambient weather directly into predictive features, causing mathematical leakage and preventing the model from learning the physical contribution of urban form and land cover.

---

## 3. Project Objectives

1. **Feature Decoupling:** Completely isolate Land Surface Temperature (LST) from the predictive feature space, utilizing LST exclusively to define the empirical target classes.
2. **Predictive Modeling from Optical Reflectance:** Train and lock a Random Forest classifier utilizing strictly optical predictors (`NDVI` and `NDBI`) to infer relative thermal hotspot probability and discrete binary classifications.
3. **Rigorous Spatial Validation:** Implement spatially disjoint cross-validation across 40 geographic blocks to eliminate spatial autocorrelation leakage between training and evaluation splits.
4. **Multi-Temporal Persistence Profiling:** Synthesize all eight seasonal scenes to characterize temporal recurrence, separating transient microclimatic spikes from chronic structural heat retention.
5. **Spatial Autocorrelation Corroboration:** Apply Getis-Ord $G_i^*$ statistics with rigorous multiple-testing FDR adjustment ($p_{\text{FDR}} < 0.05$) to mathematically test whether thermal anomalies cluster beyond spatial randomness.
6. **Open Scientific Platform:** Expose all calibrated rasters, locked model inferences, and spatial statistics through an interactive, full-stack geospatial web dashboard.

---

## 4. Study Region and Spatial Boundaries

* **Geographic Focus:** Mysuru, Karnataka, India.
* **Regional Bounding Envelope (AOI):**  
  * Coordinates: $[76.50^\circ\text{E}, 12.15^\circ\text{N}] \times [76.75^\circ\text{E}, 12.40^\circ\text{N}]$.
  * Geographic Area: **$461.50\text{ km}^2$** ($512,778\text{ pixels}$ at 30 m resolution).
* **Baseline Built Domain:** **$132.13\text{ km}^2$** ($146,810\text{ pixels}$), derived from the Step 9 Dynamic World built mask in UTM Zone 43N.
* **Valid Analysis Domain:** **$135.25\text{ km}^2$** ($150,274\text{ pixels}$), encompassing all built-up cells with at least four cloud-free observations across the eight-date time series.

```
┌─────────────────────────────────────────────────────────────┐
│  Regional AOI Bounding Envelope: 461.50 km² (512,778 px)     │
│  ┌───────────────────────────────────────────────────────┐  │
│  │  Authoritative Built Mask Grid: 136.04 km²            │  │
│  │  ┌─────────────────────────────────────────────────┐  │  │
│  │  │  Valid Analysis Domain: 135.25 km² (150,274 px)  │  │  │
│  │  │  (Cells with ≥ 4 cloud-free scenes)             │  │  │
│  │  └─────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## 5. Earth Observation Data and Observation Cadence

The study analyzes eight cloud-screened satellite acquisitions from the United States Geological Survey (USGS) Landsat 8 and Landsat 9 satellites (Path 144, Row 51) during the pre-monsoon peak heat period of 2023:

| Observation Date | Satellite | Sensor | Scene Identifier |
| :---: | :---: | :---: | :---: |
| **2023-04-01** | Landsat 9 | OLI-2 / TIRS-2 | `LC09_L2SP_144051_20230401` |
| **2023-04-09** | Landsat 8 | OLI / TIRS | `LC08_L2SP_144051_20230409` |
| **2023-04-17** | Landsat 9 | OLI-2 / TIRS-2 | `LC09_L2SP_144051_20230417` |
| **2023-04-25** | Landsat 8 | OLI / TIRS | `LC08_L2SP_144051_20230425` |
| **2023-05-03** | Landsat 9 | OLI-2 / TIRS-2 | `LC09_L2SP_144051_20230503` |
| **2023-05-11** | Landsat 8 | OLI / TIRS | `LC08_L2SP_144051_20230511` |
| **2023-05-19** | Landsat 9 | OLI-2 / TIRS-2 | `LC09_L2SP_144051_20230519` |
| **2023-05-27** | Landsat 8 | OLI / TIRS | `LC08_L2SP_144051_20230527` |

*Revisit Cadence:* Alternating 8-day satellite revisit schedule matching local solar overpass (~10:45 AM Indian Standard Time).

---

## 6. Derived Biophysical Products

### 6.1 Land Surface Temperature (LST)
Calibrated from Band 10 thermal infrared radiometry ($10.60\text{–}11.19\ \mu\text{m}$) using USGS Level-2 surface temperature products:
$$\text{LST} = (\text{ST\_B10} \times 0.00341802 + 149.0) - 273.15 \quad [^\circ\text{C}]$$
Observed values range from $30.0^\circ\text{C}$ across vegetative water interfaces to over $57.0^\circ\text{C}$ over exposed asphalt and bare masonry.

### 6.2 Normalized Difference Vegetation Index (NDVI)
Quantifies photosynthetic canopy density and evapotranspirative vigor:
$$\text{NDVI} = \frac{\rho_{\text{NIR}} - \rho_{\text{Red}}}{\rho_{\text{NIR}} + \rho_{\text{Red}}} = \frac{\text{Band 5} - \text{Band 4}}{\text{Band 5} + \text{Band 4}}$$
Values range from $-0.20$ (water, shadows) to $+0.80$ (dense tree canopy).

### 6.3 Normalized Difference Built-up Index (NDBI)
Quantifies impervious concrete, asphalt, and bare soil density:
$$\text{NDBI} = \frac{\rho_{\text{SWIR-1}} - \rho_{\text{NIR}}}{\rho_{\text{SWIR-1}} + \rho_{\text{NIR}}} = \frac{\text{Band 6} - \text{Band 5}}{\text{Band 6} + \text{Band 5}}$$
Values range from $-0.40$ (dense vegetation) to $+0.60$ (unshaded concrete and industrial roofs).

---

## 7. Machine Learning Methodology

### 7.1 Target Label Definition
The target variable is defined as a binary indicator of extreme localized surface heat:
$$y_i = \begin{cases} 1 & \text{if } \text{LST}_i \ge P_{80}(\text{LST}_{\text{built}}) \\ 0 & \text{otherwise} \end{cases}$$
Where $P_{80}$ is the 80th percentile threshold of calibrated LST within the valid built-up domain on that date (e.g., $47.1^\circ\text{C}$ on 2023-04-01).

> **Academic Rigor Note on Target Labels:**  
> These target labels represent **satellite-derived radiometric surface reference labels**, not field-verified ground truth ambient air temperatures. They capture ground-level thermal radiance at the satellite overpass moment.

### 7.2 Predictor Decoupling
To enforce true predictive generalization, **LST is 100% excluded from model inputs**. The feature vector is strictly two-dimensional:
$$\mathbf{x}_i = [\text{NDVI}_i,\ \text{NDBI}_i]^T$$

### 7.3 Model Architecture & Hyperparameters
* **Algorithm:** Random Forest Classifier (`scikit-learn`)
* **Number of Estimators:** 100 trees
* **Splitting Criterion:** Gini Impurity
* **Maximum Tree Depth:** 5 levels
* **Minimum Samples to Split:** 10 samples
* **Minimum Samples per Leaf:** 5 samples
* **Feature Sampling:** $\sqrt{n_{\text{features}}}$
* **Random Seed:** 42 (Locked)
* **Binary Checksum:** `4cb736e53c66c78dbbcbc1cf7ca3ac965af01f1c7fae829502649b018e127280`

### 7.4 Spatial Block Partitioning Protocol
To avoid optimistic performance estimates caused by spatial autocorrelation between neighboring pixels:
* The urban domain was partitioned into **40 contiguous geographic blocks**.
* **Training Partition:** 30 spatial blocks ($N_{\text{train}} = 805\text{ samples}$).
* **Independent Test Partition:** 10 spatial blocks ($N_{\text{test}} = 195\text{ samples}$, zero geographic overlap).

---

## 8. Model Evaluation and Performance

Evaluation on the independent, spatially held-out 195-sample test set yielded:

| Evaluation Metric | Mathematical Definition | Value | Percentage |
| :--- | :--- | :---: | :---: |
| **Accuracy** | $(TP + TN) / N$ | $0.866667$ | **86.67%** |
| **Precision** | $TP / (TP + FP)$ | $0.865979$ | **86.60%** |
| **Recall** | $TP / (TP + FN)$ | $0.865979$ | **86.60%** |
| **F1-Score** | $2 \times (\text{Prec} \times \text{Rec}) / (\text{Prec} + \text{Rec})$ | $0.865979$ | **86.60%** |
| **ROC-AUC** | Area under Receiver Operating Characteristic | $0.933673$ | **93.37%** |
| **PR-AUC** | Area under Precision-Recall Curve | $0.936654$ | **93.67%** |
| **Cohen's Kappa ($\kappa$)** | Agreement beyond chance | $0.733326$ | **0.7333** |
| **Brier Score** | Mean squared probability error | $0.105892$ | **0.1059** |

### Confusion Matrix ($N = 195$, Decision Threshold $\tau = 0.50$)
```
                     Predicted Non-Hotspot (0)    Predicted Hotspot (1)
Ref Non-Hotspot (0):            85 (TN)                    13 (FP)
Ref Hotspot (1):                13 (FN)                    84 (TP)
```

### Feature Importance Attribution (Mean Decrease in Impurity)
* **NDBI (Built-up Impervious Density):** **61.03%**
* **NDVI (Vegetation Canopy Density):** **38.97%**

---

## 9. Spatial Persistence and Cluster Analysis

### 9.1 Multi-Temporal Recurrence Categories
Pixel-level recurrence stability across all eight acquisitions differentiates transient spikes from persistent heat sinks:
* **Category 1 (0% Recurrence):** $52.90\text{ km}^2$ ($39.1\%$) — Never hot.
* **Category 2 (>0–25% Recurrence):** $8.71\text{ km}^2$ ($6.4\%$) — Low recurrence.
* **Category 3 (>25–50% Recurrence):** $18.16\text{ km}^2$ ($13.4\%$) — Moderate recurrence.
* **Category 4 (>50–75% Recurrence):** $32.29\text{ km}^2$ ($23.9\%$) — High recurrence.
* **Category 5 (>75–100% Recurrence):** **$23.19\text{ km}^2$ ($17.1\%$)** — **Chronic structural hotspots**.

### 9.2 Getis-Ord Gi* Spatial Autocorrelation
Evaluates localized spatial clustering against complete spatial randomness:
$$G_i^*(d) = \frac{\sum_{j=1}^n w_{ij}(d) x_j - \bar{X} \sum_{j=1}^n w_{ij}(d)}{S \sqrt{\frac{n \sum_{j=1}^n w_{ij}^2(d) - \left(\sum_{j=1}^n w_{ij}(d)\right)^2}{n - 1}}}$$
Multiple hypothesis testing across all $150,274\text{ spatial nodes}$ was adjusted using the Benjamini-Hochberg False Discovery Rate procedure ($p_{\text{FDR}} < 0.05$):
* **Statistically Significant Hotspots ($z > 0, p_{\text{FDR}} < 0.05$):** **$18.7155\text{ km}^2$ ($13.84\%$)**
* **Statistically Significant Coldspots ($z < 0, p_{\text{FDR}} < 0.05$):** **$24.1659\text{ km}^2$ ($17.87\%$)**
* **Not Statistically Significant ($p_{\text{FDR}} \ge 0.05$):** **$92.3652\text{ km}^2$ ($68.29\%$)**
* **Total Analysis Domain:** **$135.2466\text{ km}^2$ ($100.00\%$)**

---

## 10. Research Findings and Artifact Support

1. **Optical Inference Viability:** The locked Random Forest model achieves an $86.60\%$ F1-score on spatially independent test data using only NDVI and NDBI, demonstrating that physical surface properties provide strong predictive signals for thermal intensification without thermal infrared telemetry.
2. **Built-up Surface Dominance:** Feature attribution demonstrates that impervious built density (NDBI, $61.03\%$) exerts nearly double the explanatory weight of vegetative cooling (NDVI, $38.97\%$) in determining relative surface hotspot probability in Mysuru.
3. **Spatial Convergence:** The $18.72\text{ km}^2$ Getis-Ord Gi* hotspot cluster corresponds closely with the $23.19\text{ km}^2$ Category 5 chronic persistence zone in Mysuru's commercial core, light industrial districts, and high-density residential sectors.

---

## 11. Known Scientific and Technical Limitations

1. **Surface vs. Ambient Temperature:** The system measures and predicts Land Surface Temperature (radiometric skin temperature at ground/roof surfaces). It **does not measure ambient 2 m air temperature** and cannot be used directly as an official meteorological heatwave declaration.
2. **Instantaneous Observation Window:** Landsat observations capture instantaneous surface radiometry at approximately 10:45 AM local solar time under clear skies. Diurnal nocturnal heat retention and evening thermal release are not captured.
3. **Geographic Specificity:** Model weights and percentile thresholds were calibrated specifically on Mysuru's urban morphology and subtropical pre-monsoon climate. Applying this model to other geographic regions requires local threshold re-calibration.
4. **Cloud Obscuration:** Peripheral cloud contamination reduces the number of valid observations per pixel, necessitating the four-observation eligibility mask filter.

---

## 12. Future Research Directions

* **Cross-Sensor Optical Fusion:** Ingest 10 m Sentinel-2 multi-spectral imagery to refine spatial resolution and increase revisit frequency.
* **Vertical Morphology Integration:** Incorporate building height and digital surface models (DSM) to evaluate urban canopy canyon trapping effects.
* **In-Situ Microclimatic Sensor Validation:** Deploy ground-level IoT ambient temperature sensors to calibrate the empirical transfer function between satellite skin LST and pedestrian air temperatures.
