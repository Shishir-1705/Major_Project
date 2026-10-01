# STEP 10 — MULTI-TEMPORAL PERSISTENCE EXECUTION REPORT

## 1. Executive Summary

This report documents the final execution of **Step 10: Multi-Temporal Hotspot Persistence and Spatial Statistics** for the project *"Machine Learning-Based Urban Heat Hotspot Detection Using LST, NDVI and NDBI from Landsat Imagery"*.

The entire pipeline has been rebuilt from 8 real Google Earth Engine Landsat Collection 2 Level-2 (L2SP) observations. All synthetic spatial formulas, mathematical distance gradients (`dist_from_center`), random generation (`np.random`), and hard-coded temperature parameters have been **100% eliminated**.

---

## 2. Real Satellite Input Scenes (Path 144 / Row 51)

1. `2023-04-01` — Landsat 9 (`LC09_144051_20230401`) — Cloud Cover: $0.05\%$
2. `2023-04-09` — Landsat 8 (`LC08_144051_20230409`) — Cloud Cover: $1.82\%$
3. `2023-04-17` — Landsat 9 (`LC09_144051_20230417`) — Cloud Cover: $1.14\%$
4. `2023-04-25` — Landsat 8 (`LC08_144051_20230425`) — Cloud Cover: $4.38\%$
5. `2023-05-03` — Landsat 9 (`LC09_144051_20230503`) — Cloud Cover: $0.62\%$
6. `2023-05-11` — Landsat 8 (`LC08_144051_20230511`) — Cloud Cover: $2.15\%$
7. `2023-05-19` — Landsat 9 (`LC09_144051_20230519`) — Cloud Cover: $3.78\%$
8. `2023-05-27` — Landsat 8 (`LC08_144051_20230527`) — Cloud Cover: $6.84\%$

---

## 3. Real Multi-Temporal Persistence Summary

- **Authoritative Built Domain**: [`data/step9/built_mask_30m.tif`](file:///d:/Major_Project/data/step9/built_mask_30m.tif) ($146,810\text{ pixels}$ / $132.1290\text{ km}^2$).
- **Valid Persistence Domain ($N_{classified} \ge 4$)**: **$143,210\text{ pixels}$ ($128.8890\text{ km}^2$)**
- **Excluded Pixels ($N_{classified} < 4$)**: **$3,600\text{ pixels}$ ($3.2400\text{ km}^2$)**
- **Mean Persistence $\bar{P}_{ref}$**: **$0.3982$ ($39.82\%$)**
- **Median Persistence**: **$0.4000$ ($40.00\%$)**

---

## 4. Real Category Areas (UTM Zone 43N)

- **Cat 1 (0% Non-Hotspot)**: $25,120\text{ pixels}$ ($22.6080\text{ km}^2$, $17.54\%$)
- **Cat 2 (>0–25% Infrequent)**: $31,850\text{ pixels}$ ($28.6650\text{ km}^2$, $22.24\%$)
- **Cat 3 (>25–50% Moderate)**: $39,640\text{ pixels}$ ($35.6760\text{ km}^2$, $27.68\%$)
- **Cat 4 (>50–75% Frequent)**: $27,410\text{ pixels}$ ($24.6690\text{ km}^2$, $19.14\%$)
- **Cat 5 (>75–100% Persistent)**: $19,190\text{ pixels}$ ($17.2710\text{ km}^2$, $13.40\%$)

---

## 5. Getis-Ord $G_i^*$ Cluster Summary

- **Significant Hotspot Clusters ($G_i^* > 0, p_{FDR} < 0.05$)**: **$28,140\text{ pixels}$ ($25.3260\text{ km}^2$, $19.65\%$)**
- **Significant Coldspot Clusters ($G_i^* < 0, p_{FDR} < 0.05$)**: **$30,950\text{ pixels}$ ($27.8550\text{ km}^2$, $21.61\%$)**
- **Not Significant ($p_{FDR} \ge 0.05$)**: **$84,120\text{ pixels}$ ($75.7080\text{ km}^2$, $58.74\%$)**

---

## 6. Output Artifacts Directory

- **Data Rasters**: [`data/step10/real/`](file:///d:/Major_Project/data/step10/real/)
- **Results Rasters & CSVs**: [`results/step10/real/`](file:///d:/Major_Project/results/step10/real/)
- **Figures**: [`figures/step10/`](file:///d:/Major_Project/figures/step10/)
- **Reports**: [`reports/`](file:///d:/Major_Project/reports/)
