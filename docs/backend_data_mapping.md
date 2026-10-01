# Backend Data Product Mapping Specification

**Project Title**: Machine Learning-Based Urban Heat Hotspot Detection Using LST, NDVI and NDBI from Landsat Imagery  
**Study Area**: Mysuru, Karnataka, India  
**Document Version**: 1.0.0  
**Phase**: Backend Foundation & Real Data Integration (Step 13)  

---

## 1. Mapping Table: API Layer Name $\rightarrow$ Authoritative File Path

The table below documents the exact mapping from API layer parameters to the authoritative, peer-reviewed project data products stored in the repository:

| API Layer Key (`layer`) | Parameter (`date` / `key`) | Source File Path | Description & Provenance |
| :--- | :--- | :--- | :--- |
| **`lst`** | `2023-04-01` .. `2023-05-27` | `data/step10/lst_30m_{date}.tif` | Real Landsat 8/9 ST_B10 surface temperature (°C) across 8 dates (Stage 1 GEE verified). |
| **`ndvi`** | `2023-04-01` .. `2023-05-27` | `data/step10/ndvi_30m_{date}.tif` | Real Landsat 8/9 SR_B5/SR_B4 vegetation canopy index. |
| **`ndbi`** | `2023-04-01` .. `2023-05-27` | `data/step10/ndbi_30m_{date}.tif` | Real Landsat 8/9 SR_B6/SR_B5 built-up surface index. |
| **`ref_label`** | `2023-04-01` .. `2023-05-27` | `data/step10/ref_label_30m_{date}.tif` | Step 6 date-specific P20/P80 percentile thermal hotspot reference labels ($1 = \text{Hotspot}$). |
| **`rf_prob`** | `2023-04-01` .. `2023-05-27` | `results/step10/rf_prob_30m_{date}.tif` | Locked Random Forest model full-domain Class 1 probability predictions. |
| **`rf_class`** | `2023-04-01` .. `2023-05-27` | `results/step10/rf_class_30m_{date}.tif` | Locked Random Forest binary hotspot classification ($1 = \text{Hotspot}$, threshold $= 0.50$). |
| **`continuous_persistence`**| `continuous` | `results/step10/continuous_persistence_30m.tif` | Multi-temporal persistence score (0.0 to 1.0) across 8 observation dates. |
| **`categorical_persistence`**| `categorical` | `results/step10/categorical_persistence_30m.tif` | 4-level categorical persistence map (0=None, 1=Transient, 2=Moderate, 3=Persistent). |
| **`gi_star_statistic`** | `statistic` | `results/step10/gi_star_statistic_30m.tif` | Getis-Ord $\text{G}_i^*$ spatial Z-score statistic raster. |
| **`gi_star_clustering`** | `clustering` | `results/step10/gi_star_clustering_30m.tif` | Getis-Ord $\text{G}_i^*$ spatial cluster categories (3=99%, 2=95%, 1=90% Hotspots, Coldspots). |
| **`built_mask`** | `30m` | `data/step9/built_mask_30m.tif` | Step 9 authoritative built-up mask (146,810 built pixels, $132.129\text{ km}^2$). |
| **`model_info`** | N/A | `models/random_forest_final_step10_8.joblib` | Locked Random Forest model weights (SHA-256: `4cb736e53c66c78dbbcbc1cf7ca3ac965af01f1c7fae829502649b018e127280`). |
| **`model_meta`** | N/A | `models/random_forest_final_step10_8_metadata.json` | Model hyperparameters, training sample count, and feature order metadata. |
| **`model_metrics`** | N/A | `results/step10_9/final_locked_evaluation_metrics.csv` | Locked independent spatial test evaluation results (Accuracy=86.67%, F1=86.60%, ROC-AUC=93.37%). |
| **`persistence_stats`** | N/A | `results/step10/persistence_category_areas_utm43n.csv` | Multi-temporal persistence category areas in $\text{km}^2$ and percentages. |
| **`gi_star_stats`** | N/A | `results/step10/gi_star_summary_statistics.csv` | Getis-Ord $\text{G}_i^*$ spatial cluster summary statistics. |

---

## 2. Integrity Governance

1. **Zero Data Alteration**: All backend routes read directly from these authoritative paths without altering array values or overwriting files.
2. **Read-Only Access**: All file operations use `rasterio.open(mode='r')` and `pandas.read_csv()`.
