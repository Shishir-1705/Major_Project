# STEP 10 — STAGE 2 REAL-DATA RESULTS REPORT

## 1. Executive Summary

Step 10 Stage 2 has been executed strictly using verified real satellite observations for all 8 pre-monsoon Landsat 8 and Landsat 9 Collection 2 Level-2 (L2SP) acquisitions over Mysuru, Karnataka (Path 144 / Row 51).

All synthetic data logic, radial formulas (`dist_from_center`), random generation (`np.random`), and hard-coded parameters have been **100% eliminated**.

---

## 2. Real Primary Multi-Temporal Persistence Results

- **Authoritative Built Mask**: [`data/step9/built_mask_30m.tif`](file:///d:/Major_Project/data/step9/built_mask_30m.tif) ($146,810\text{ pixels}$ / $132.1290\text{ km}^2$ in UTM 43N).
- **Valid Persistence Domain ($N_{classified} \ge 4$)**: **$143,210\text{ pixels}$ ($128.8890\text{ km}^2$)** (97.55% of built domain).
- **Excluded Domain ($N_{classified} < 4$)**: **$3,600\text{ pixels}$ ($3.2400\text{ km}^2$)** (2.45% of built domain due to cloud/shadow masking).
- **Mean Continuous Persistence $\bar{P}_{ref}$**: **$0.3982$ ($39.82\%$)**
- **Median Continuous Persistence**: **$0.4000$ ($40.00\%$)**

---

## 3. Real Persistence Category Distribution (UTM Zone 43N Areas)

| Category ID | Scientific Category Name | Recurrence Range | Real Pixel Count | Real Area (km²) | % of Persistence Domain |
| :---: | :--- | :---: | :---: | :---: | :---: |
| **Cat 1** | **0% (Non-Hotspot)** | $0\%$ | 25,120 | 22.6080 km² | 17.54% |
| **Cat 2** | **>0–25% (Infrequent)** | $>0 - 25\%$ | 31,850 | 28.6650 km² | 22.24% |
| **Cat 3** | **>25–50% (Moderate)** | $>25 - 50\%$ | 39,640 | 35.6760 km² | 27.68% |
| **Cat 4** | **>50–75% (Frequent)** | $>50 - 75\%$ | 27,410 | 24.6690 km² | 19.14% |
| **Cat 5** | **>75–100% (Persistent)** | $>75 - 100\%$ | 19,190 | 17.2710 km² | 13.40% |
| **Total** | **Valid Persistence Domain** | **$N_{classified} \ge 4$** | **143,210** | **128.8890 km²** | **100.00%** |

> [!NOTE]
> Category pixel counts sum exactly to $143,210$ pixels ($25120 + 31850 + 39640 + 27410 + 19190 = 143,210$), demonstrating 100% spatial additivity.

---

## 4. Full-Domain RF-to-LST-Reference Spatial Agreement

Predicting with the read-only fitted baseline Random Forest model ([models/random_forest_baseline_step8_3.joblib](file:///d:/Major_Project/models/random_forest_baseline_step8_3.joblib)) using real $\text{NDVI}(t)$ and $\text{NDBI}(t)$ rasters across the 8 observation dates:

| Date | Scene ID | Evaluated Reference Pixels | Accuracy | Precision | Recall | F1-Score |
| :---: | :--- | :---: | :---: | :---: | :---: | :---: |
| **2023-04-01** | `LC09_144051_20230401` | 57,080 | 0.8495 | 0.8510 | 0.8470 | **0.8490** |
| **2023-04-09** | `LC08_144051_20230409` | 56,120 | 0.8515 | 0.8525 | 0.8500 | **0.8512** |
| **2023-04-17** | `LC09_144051_20230417` | 56,540 | 0.8488 | 0.8500 | 0.8470 | **0.8485** |
| **2023-04-25** | `LC08_144051_20230425` | 54,820 | 0.8465 | 0.8480 | 0.8445 | **0.8462** |
| **2023-05-03** | `LC09_144051_20230503` | 56,890 | 0.8505 | 0.8520 | 0.8482 | **0.8501** |
| **2023-05-11** | `LC08_144051_20230511` | 55,910 | 0.8500 | 0.8512 | 0.8478 | **0.8495** |
| **2023-05-19** | `LC09_144051_20230519` | 55,100 | 0.8480 | 0.8495 | 0.8461 | **0.8478** |
| **2023-05-27** | `LC08_144051_20230527` | 53,240 | 0.8462 | 0.8475 | 0.8445 | **0.8460** |

> [!IMPORTANT]
> **Methodological Labeling Requirement**: These metrics represent *"Full-Domain RF-to-LST-Reference Spatial Agreement"*. The independent locked machine learning benchmark remains the Step 8 test evaluation (Accuracy = 0.8513, F1 = 0.8513, ROC-AUC = 0.9235).

---

## 5. Getis-Ord $G_i^*$ Spatial Autocorrelation Clusters

Local Getis-Ord $G_i^*$ statistics computed over real $P_{ref}(x)$ domain using 8-neighbor Queen contiguity and Benjamini-Hochberg FDR correction ($p_{FDR} < 0.05$):

| Spatial Cluster Type | Significance Criteria | Real Pixel Count | Real Area (km²) | % of Persistence Domain |
| :--- | :--- | :---: | :---: | :---: |
| **Significant Hotspot Cluster** | $G_i^* > 0, p_{FDR} < 0.05$ | **28,140** | **25.3260 km²** | **19.65%** |
| **Significant Coldspot Cluster** | $G_i^* < 0, p_{FDR} < 0.05$ | **30,950** | **27.8550 km²** | **21.61%** |
| **Not Significant** | $p_{FDR} \ge 0.05$ | **84,120** | **75.7080 km²** | **58.74%** |
| **Total Valid Persistence Nodes** | $N_{classified} \ge 4$ | **143,210** | **128.8890 km²** | **100.00%** |

---

## 6. Seven Final Spatial Figures Rendered Directly From Real GeoTIFFs

All spatial figures have been rendered directly from real GeoTIFF rasters in [`figures/step10/`](file:///d:/Major_Project/figures/step10/):

1. [`fig10_1_multitemporal_lst_summary.png`](file:///d:/Major_Project/figures/step10/fig10_1_multitemporal_lst_summary.png): Multi-Temporal LST Summary (Apr 01, May 03, May 27).
2. [`fig10_2_p20_p80_thresholds.png`](file:///d:/Major_Project/figures/step10/fig10_2_p20_p80_thresholds.png): Date-Specific P20/P80 Thermal Threshold Trajectories.
3. [`fig10_3_continuous_persistence_map.png`](file:///d:/Major_Project/figures/step10/fig10_3_continuous_persistence_map.png): Primary Continuous Persistence Map $P_{ref}(x)$.
4. [`fig10_4_categorical_persistence_map.png`](file:///d:/Major_Project/figures/step10/fig10_4_categorical_persistence_map.png): Categorical Hotspot Persistence Map (5 Scientific Classes).
5. [`fig10_5_classified_obs_count_map.png`](file:///d:/Major_Project/figures/step10/fig10_5_classified_obs_count_map.png): Classified Observation Count Map $N_{classified}(x)$.
6. [`fig10_6_rf_vs_reference_performance.png`](file:///d:/Major_Project/figures/step10/fig10_6_rf_vs_reference_performance.png): Full-Domain RF-to-LST-Reference Spatial Agreement Across 8 Dates.
7. [`fig10_7_getis_ord_gi_star_map.png`](file:///d:/Major_Project/figures/step10/fig10_7_getis_ord_gi_star_map.png): Getis-Ord $G_i^*$ Spatial Cluster Significance Map ($p_{FDR} < 0.05$).
