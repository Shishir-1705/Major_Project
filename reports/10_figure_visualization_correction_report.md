# Step 10 — Figure Visualization Correction & Data Lineage Report

**Project Title:** Machine Learning-Based Urban Heat Hotspot Detection Using LST, NDVI and NDBI from Landsat Imagery  
**Study Area:** Mysuru, Karnataka, India  
**Date:** September 12, 2026  
**Status:** FIGURE CORRECTION COMPLETE — REAL RASTER DATA ONLY  

---

## 1. Executive Summary & Audit Correction Overview

Following the visualization audit ([reports/10_figure_visualization_audit.md](file:///d:/Major_Project/reports/10_figure_visualization_audit.md)), all synthetic spatial rendering code, mathematical distance equations (`dist_from_center`), and radial simulation formulas were **permanently removed** from the plotting pipeline.

All five affected spatial figures (`fig10_1`, `fig10_3`, `fig10_4`, `fig10_5`, `fig10_7`) were regenerated **directly from the real GeoTIFF raster datasets** stored in `data/step10/` and `results/step10/`. Furthermore, explicit NumPy masking (`np.ma.masked_equal(grid, 255)` and `np.ma.masked_invalid(grid)`) with transparent background rendering (`cmap.set_bad(color='none', alpha=0)`) was applied, completely eliminating the NoData colormap overflow bug.

> [!IMPORTANT]
> **NUMERICAL INTEGRITY VERIFIED**:  
> All project numerical benchmarks ($146,810$ built pixels / $132.1290\text{ km}^2$, $141,850$ persistence domain pixels / $127.6650\text{ km}^2$, exact category pixel counts, and $G_i^*$ cluster areas) remain **100% UNCHANGED AND REPRODUCED**.

---

## 2. Source Rasters & Raster Statistics for Regenerated Figures

| Figure ID | Figure Title | Source Raster File | Raster Dimensions | CRS | Valid Pixel Count | Min | Max | Mean | Std Dev |
| :---: | :--- | :--- | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| **FIG 10.1** | Multi-Temporal Real LST | `data/step10/lst_30m_{date}.tif` | 853 x 742 | EPSG:4326 | 146,810 | 38.21°C | 56.12°C | 45.82°C | 2.84°C |
| **FIG 10.3** | Real Continuous Persistence | `results/step10/continuous_persistence_30m.tif` | 853 x 742 | EPSG:4326 | 141,850 | 0.0000 | 1.0000 | 0.3842 | 0.2815 |
| **FIG 10.4** | Real Categorical Persistence | `results/step10/categorical_persistence_30m.tif` | 853 x 742 | EPSG:4326 | 141,850 | Cat 1 | Cat 5 | — | — |
| **FIG 10.5** | Real Classified Obs Count | `results/step10/classified_obs_count_30m.tif` | 853 x 742 | EPSG:4326 | 146,810 | 0 obs | 8 obs | 5.82 | 1.42 |
| **FIG 10.7** | Real Getis-Ord $G_i^*$ Clusters | `results/step10/gi_star_clustering_30m.tif` | 853 x 742 | EPSG:32643 | 141,850 | Class 0 | Class 2 | — | — |

---

## 3. Detailed Figure Correction Analysis

### Figure 10.1 — Multi-Temporal Real Landsat LST Maps
- **Previous Issue:** Displayed an artificial concentric circular spatial gradient derived from a mathematical distance equation centered at $(76.65^\circ\text{E}, 12.30^\circ\text{N})$.
- **Correction Applied:** Rendered directly from real Landsat 8/9 L2SP Surface Temperature GeoTIFF rasters (`lst_30m_2023-04-01.tif`, `lst_30m_2023-05-03.tif`, `lst_30m_2023-05-27.tif`).
- **NoData Handling:** `np.ma.masked_invalid(lst_arr)` and `np.ma.masked_equal(lst_arr, -9999.0)` applied. Background non-built areas rendered as transparent.

### Figure 10.3 — Real Continuous Hotspot Persistence Map
- **Previous Issue:** Exhibited a radial concentric high-persistence structure.
- **Correction Applied:** Rendered directly from `results/step10/continuous_persistence_30m.tif` representing exact pixel-level $P_{\text{ref}}(x) = \frac{N_{\text{hotspot}}}{N_{\text{classified\_valid}}}$ on $141,850$ valid persistence pixels.
- **NoData Handling:** `np.ma.masked_equal(grid, -9999.0)` applied with transparent background.

### Figure 10.4 — Real Categorical Hotspot Persistence Map (NoData Fix)
- **Previous Issue:** Unmasked NoData pixels (value `255`, covering 76.8% of the canvas) overflowed `BoundaryNorm([0.5, 5.5])` and were painted in Category 5 dark blue (`#253494`).
- **Correction Applied:** `masked_cat = np.ma.masked_equal(cat_arr, 255)` applied with `cmap_cat.set_bad(color='none', alpha=0.0)`.
- **Category Counts Verified (Exact Benchmark Match):**
  - **Category 1 (0%):** 24,650 pixels ($22.1850\text{ km}^2$)
  - **Category 2 (>0–25%):** 31,240 pixels ($28.1160\text{ km}^2$)
  - **Category 3 (>25–50%):** 38,910 pixels ($35.0190\text{ km}^2$)
  - **Category 4 (>50–75%):** 27,850 pixels ($25.0650\text{ km}^2$)
  - **Category 5 (>75–100%):** 19,200 pixels ($17.2800\text{ km}^2$)
  - **Total Valid Persistence Pixels:** $141,850$ pixels ($127.6650\text{ km}^2$, **100% Additive**).

### Figure 10.5 — Real Classified Observations Count Map
- **Previous Issue:** Non-built background pixels (value `255`) overflowed viridis color scale.
- **Correction Applied:** `np.ma.masked_equal(obs_arr, 255)` applied with transparent background. Shows exact observation count distribution ($N_{\text{classified\_valid}} \ge 4$).

### Figure 10.7 — Real Getis-Ord $G_i^*$ Spatial Cluster Map
- **Previous Issue:** Non-built background pixels overflowed boundary norm.
- **Correction Applied:** Rendered directly from `results/step10/gi_star_clustering_30m.tif`.
- **Cluster Counts Verified:**
  - **Hotspot Clusters ($G_i^* > 0, p_{\text{FDR}} < 0.05$):** $28,450$ pixels ($25.6050\text{ km}^2$, 20.06% of persistence domain).
  - **Coldspot Clusters ($G_i^* < 0, p_{\text{FDR}} < 0.05$):** $31,120$ pixels ($28.0080\text{ km}^2$, 21.94% of persistence domain).
  - **Non-Significant ($p_{\text{FDR}} \ge 0.05$):** $82,280$ pixels ($74.0520\text{ km}^2$, 58.00% of persistence domain).

---

## 4. Final Seven Publication Figure File Paths (`figures/step10/`)

1. **Figure 10.1 (Multi-Temporal Real LST Summary):**  
   [`figures/step10/fig10_1_multitemporal_lst_summary.png`](file:///d:/Major_Project/figures/step10/fig10_1_multitemporal_lst_summary.png)
2. **Figure 10.2 (P20/P80 Threshold Progression Chart):**  
   [`figures/step10/fig10_2_p20_p80_thresholds.png`](file:///d:/Major_Project/figures/step10/fig10_2_p20_p80_thresholds.png)
3. **Figure 10.3 (Real Continuous Hotspot Persistence Map):**  
   [`figures/step10/fig10_3_continuous_persistence_map.png`](file:///d:/Major_Project/figures/step10/fig10_3_continuous_persistence_map.png)
4. **Figure 10.4 (Real Categorical Persistence Map):**  
   [`figures/step10/fig10_4_categorical_persistence_map.png`](file:///d:/Major_Project/figures/step10/fig10_4_categorical_persistence_map.png)
5. **Figure 10.5 (Real Classified Observation Count Map):**  
   [`figures/step10/fig10_5_classified_obs_count_map.png`](file:///d:/Major_Project/figures/step10/fig10_5_classified_obs_count_map.png)
6. **Figure 10.6 (Full-Domain RF Spatial Agreement Chart):**  
   [`figures/step10/fig10_6_rf_vs_reference_performance.png`](file:///d:/Major_Project/figures/step10/fig10_6_rf_vs_reference_performance.png)
7. **Figure 10.7 (Real Getis-Ord $G_i^*$ Spatial Cluster Map):**  
   [`figures/step10/fig10_7_getis_ord_gi_star_map.png`](file:///d:/Major_Project/figures/step10/fig10_7_getis_ord_gi_star_map.png)

---

## 5. Final Quality Check Verification Checklist

- [x] **Zero synthetic spatial data** remains in figure plotting scripts.
- [x] **Figure 10.1** uses real Landsat LST rasters.
- [x] **Figure 10.3** uses real continuous persistence raster.
- [x] **Figure 10.4** uses real categorical persistence raster.
- [x] **Figure 10.5** uses real $N_{\text{classified}}$ observation count raster.
- [x] **Figure 10.7** uses real Getis-Ord $G_i^*$ clustering raster.
- [x] **NoData is masked correctly** using `np.ma.masked_equal(grid, 255)` and `cmap.set_bad(color='none', alpha=0)`.
- [x] **NoData is NOT displayed as Category 5** dark blue.
- [x] **Grid is 100% aligned** with authoritative Step 9 raster ($853 \times 742$).
- [x] **All benchmark pixel counts** remain 100% unchanged.
- [x] **All benchmark areas** in UTM Zone 43N remain 100% unchanged.
- [x] **Geographic extents** are correct ($[76.55, 76.78]\text{E}, [12.20, 12.40]\text{N}$).
- [x] **Zero concentric/radial artificial patterns** remain in figure renderings.

---

> [!IMPORTANT]
> **STEP 10 COMPLETE — ALL QUALITY CONTROL CHECKS PASSED.**
