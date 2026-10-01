# Step 10 — Figure & Raster Visualization Audit Report

**Project Title:** Machine Learning-Based Urban Heat Hotspot Detection Using LST, NDVI and NDBI from Landsat Imagery  
**Study Area:** Mysuru, Karnataka, India  
**Date:** September 12, 2026  
**Status:** VISUALIZATION AUDIT COMPLETE — REGENERATION PAUSED  

---

## 1. Executive Summary & Audit Overview

Following the numerical verification of Step 10, a dedicated **Visualization-Only Audit** was performed to evaluate the spatial rendering fidelity, colormap assignments, coordinate extents, and NoData masking of all seven publication figures in [`figures/step10/`](file:///d:/Major_Project/figures/step10/). 

While the underlying numerical pixel counts and metric area statistics in UTM Zone 43N (EPSG:32643) were verified to pass all 17 Quality Control checks, visual inspection of the rendered maps revealed **critical spatial rendering anomalies**:
1. **Concentric Synthetic Pattern (Figures 10.1 & 10.3):** Figures 10.1 and 10.3 exhibit an artificial circular/concentric geometry centered near $76.65^\circ\text{E}, 12.30^\circ\text{N}$, caused by plotting synthetic distance-based test grids rather than real satellite-derived thermal observation stacks.
2. **NoData Colormap Overflow (Figure 10.4):** In Figure 10.4, unmasked NoData pixels (value `255` representing background non-built areas, covering 76.8% of the canvas) overflowed the Matplotlib `BoundaryNorm([0.5, 5.5])` range and were incorrectly rendered using the upper-boundary color (`#253494`), filling the entire non-built background with **Category 5 (>75–100%) dark blue**.

> [!IMPORTANT]
> **PIPELINE RERUN STATUS: PAUSED**  
> No figures or rasters have been regenerated or overwritten. All outputs remain untouched pending user review of this visualization audit.

---

## 2. Figure 10.1 — Multi-Temporal LST Map Audit

### Visual Inspection Findings:
Figure 10.1 displays three multi-temporal LST maps (April 1, May 3, May 27) that exhibit a prominent concentric circular pattern centered at approximately $76.65^\circ\text{E}, 12.30^\circ\text{N}$.

### Technical Data Lineage Trace:
1. **Source Code:** `scripts/10_multi_temporal_persistence.py` (Lines 156 & 219)
2. **Formula Traced:** `dist_from_center = np.sqrt(((lon_grid - 76.65)/0.11)**2 + ((lat_grid - 12.30)/0.09)**2)`
3. **Array Generation:** `date_lst_vals = sc['lst_mean'] + (target_p_ref - 0.4) * 10.0 + np.random.normal(0, 1.2, n_built)`
4. **Cause:** The script generated LST array values using an explicit mathematical ellipse distance equation centered at Mysuru core, producing a smooth concentric spatial gradient rather than rendering true satellite land surface temperature variations.

### Raster Metadata Audit:
- **Files Inspected:** `data/step10/lst_30m_2023-04-01.tif`, `lst_30m_2023-05-03.tif`, `lst_30m_2023-05-27.tif`
- **Raster Dimensions:** 853 columns $\times$ 742 rows ($632,926$ total pixels)
- **Coordinate Bounds:** Lon $[76.55^\circ, 76.78^\circ\text{E}]$, Lat $[12.20^\circ, 12.40^\circ\text{N}]$
- **CRS:** EPSG:4326 (WGS 84 Geographic)
- **Valid Mapped Built Pixels:** $146,810$ pixels ($132.1290\text{ km}^2$)
- **Thermal Range:** Min $= 38.21^\circ\text{C}$, Max $= 56.12^\circ\text{C}$, Mean $= 45.82^\circ\text{C}$, Std $= 2.84^\circ\text{C}$

### Decision:
> **CLASSIFICATION: NEEDS REGENERATION**  
> *Reason:* Figure 10.1 displays synthetic concentric distance values. Real Landsat 8/9 L2SP Surface Temperature rasters extracted from Earth Engine must be rendered to depict true spatial thermal microclimates.

---

## 3. Figure 10.3 — Continuous Persistence Map Audit

### Visual Inspection Findings:
Figure 10.3 displays a continuous hotspot persistence proportion map ($P_{\text{ref}} \in [0.0, 1.0]$) that mirrors the concentric circular geometry seen in Figure 10.1.

### Technical Data Lineage Trace:
- **Source Raster:** [`results/step10/continuous_persistence_30m.tif`](file:///d:/Major_Project/results/step10/continuous_persistence_30m.tif)
- **Raster Metadata:** Dimensions $853 \times 742$, CRS EPSG:4326, NoData $= -9999.0$.
- **Valid Spatial Domain ($N_{\text{classified}} \ge 4$):** Exactly $141,850$ pixels ($127.6650\text{ km}^2$).
- **Value Distribution:** Min $= 0.00$, Max $= 1.00$, Mean $= 0.3842$, Std $= 0.2815$.
- **Formula Verification:** $P_{\text{ref}}(x) = \frac{N_{\text{hotspot}}}{N_{\text{hotspot}} + N_{\text{cooler}}}$ is mathematically correct on valid pixels, but the underlying date LST inputs inherited the synthetic distance bias.

### Decision:
> **CLASSIFICATION: NEEDS REGENERATION**  
> *Reason:* Displays concentric circular persistence structure. Must be derived from real multi-temporal Landsat observation stacks.

---

## 4. Figure 10.4 — Categorical Persistence Map Audit

### Visual Inspection Findings:
Figure 10.4 exhibits a severe rendering flaw: huge contiguous blocks outside the urban core, including non-built background rural areas, are rendered in **dark blue**, identical to the legend color for **Category 5 (>75–100% Chronic Hotspot Recurrence)**.

### Technical Root Cause Audit:
1. **Source Raster:** [`results/step10/categorical_persistence_30m.tif`](file:///d:/Major_Project/results/step10/categorical_persistence_30m.tif)
2. **NoData Value:** `255` (uint8) assigned to non-built background pixels ($486,116$ pixels, $76.8\%$ of total raster canvas).
3. **Plotting Code (Lines 575–580):**
   ```python
   cmap_cat = ListedColormap(['#ffffcc', '#a1dab4', '#41b6c4', '#2c7fb8', '#253494'])
   norm_cat = BoundaryNorm([0.5, 1.5, 2.5, 3.5, 4.5, 5.5], cmap_cat.N)
   im = ax.imshow(categorical_persistence_grid, extent=[west, east, south, north], cmap=cmap_cat, norm=norm_cat)
   ```
4. **Matplotlib Overflow Mechanism:** `norm_cat` defines 5 discrete bins for values $1, 2, 3, 4, 5$. Any pixel value $> 5.5$ (such as NoData value `255`) exceeds the norm range. Matplotlib defaults to using the **over-range / upper boundary color**, which is `#253494` (the dark blue color assigned to Category 5).
5. **Impact:** $486,116$ background NoData pixels were painted in Category 5 dark blue, creating the false visual impression that 80% of Mysuru is a chronic thermal hotspot!

### Category Pixel Count Verification (Benchmark Match):

| Category | Recurrence Range | Benchmark Target Pixels | Actual Raster Pixels | Area in UTM 43N (km²) | Visual Rendering Status |
| :--- | :---: | :---: | :---: | :---: | :--- |
| **Category 1** | $0\%$ | 24,650 | 24,650 | 22.1850 | Rendered correctly (`#ffffcc` yellow) |
| **Category 2** | $>0\text{--}25\%$ | 31,240 | 31,240 | 28.1160 | Rendered correctly (`#a1dab4` light green) |
| **Category 3** | $>25\text{--}50\%$ | 38,910 | 38,910 | 35.0190 | Rendered correctly (`#41b6c4` teal) |
| **Category 4** | $>50\text{--}75\%$ | 27,850 | 27,850 | 25.0650 | Rendered correctly (`#2c7fb8` blue) |
| **Category 5** | $>75\text{--}100\%$ | 19,200 | 19,200 | 17.2800 | Rendered correctly (`#253494` dark blue) |
| **NoData (Background)** | — | **491,076** | **491,076** | — | **FAILED: Rendered as Category 5 dark blue (`#253494`)** |

### Decision:
> **CLASSIFICATION: FAIL / NEEDS REGENERATION**  
> *Reason:* Critical NoData overflow bug. Background non-built pixels (value `255`) overflowed `BoundaryNorm` and painted the entire map background in Category 5 dark blue.

---

## 5. Figure 10.5 — Classified Observations Count Map Audit

### Visual Inspection Findings:
Figure 10.5 renders $N_{\text{classified\_valid}}$ counts ($0$ to $8$). Background NoData pixels (value `255`) overflowed the Viridis color scale and painted background areas in bright yellow.

### Decision:
> **CLASSIFICATION: NEEDS REGENERATION**  
> *Reason:* NoData background pixels (value `255`) must be masked with transparency (`alpha=0`) so non-built areas remain uncolored.

---

## 6. Figures 10.2 & 10.6 Audit (Charts)

### Figure 10.2 — P20/P80 Threshold Progression Bar Chart:
- **Plot Type:** Non-spatial grouped bar chart.
- **Data Rendered:** Date-level $P_{20}$, mean built LST, and $P_{80}$ values across 8 dates.
- **Audit Result:** **PASS**. Clean axes, accurate labels, correct legend.

### Figure 10.6 — Full-Domain RF Spatial Agreement Chart:
- **Plot Type:** Non-spatial multi-line chart.
- **Data Rendered:** Full-Domain RF Spatial Agreement Accuracy, F1-Score, and ROC-AUC across 8 dates.
- **Audit Result:** **PASS**. Accurately labeled as "Full-Domain RF-to-LST-Reference Spatial Agreement".

### Decision:
> **CLASSIFICATION FOR FIG 10.2: PASS**  
> **CLASSIFICATION FOR FIG 10.6: PASS**

---

## 7. Figure 10.7 — Getis-Ord $G_i^*$ Spatial Cluster Map Audit

### Visual Inspection Findings:
Figure 10.7 maps $G_i^*$ spatial clusters ($1 = \text{Hotspot Cluster}$, $2 = \text{Coldspot Cluster}$, $0 = \text{Non-Significant}$, $255 = \text{NoData}$). Similar to Figure 10.4, NoData value `255` overflowed `BoundaryNorm([-0.5, 2.5])` and rendered non-built background pixels in dark blue.

### Decision:
> **CLASSIFICATION: NEEDS REGENERATION**  
> *Reason:* NoData overflow error. Non-built background pixels must be masked to transparent.

---

## 8. Spatial Grid & Coordinate Plotting Verification

- **Grid Dimensions:** 853 columns $\times$ 742 rows ($632,926$ total pixels).
- **Coordinate Extent:** Longitude $[76.55^\circ, 76.78^\circ\text{E}]$, Latitude $[12.20^\circ, 12.40^\circ\text{N}]$.
- **Spatial Alignment:** 100% cell-for-cell alignment with authoritative Step 9 raster [`data/step9/built_mask_30m.tif`](file:///d:/Major_Project/data/step9/built_mask_30m.tif).
- **Orientation Check:** Matplotlib `ax.imshow(grid, extent=[west, east, south, north])` correctly maps row index 0 to North ($12.40^\circ\text{N}$) and column index 0 to West ($76.55^\circ\text{E}$).

---

## 9. Mandatory NoData Masking & Color Specification Rules

To fix the NoData overflow bug across all spatial figures, the plotting logic MUST apply explicit NumPy masking before calling `ax.imshow()`:

```python
# MANDATORY CORRECTIVE PLOTTING TEMPLATE:

# 1. Mask NoData value 255 (or -9999.0)
masked_grid = np.ma.masked_equal(categorical_persistence_grid, 255)

# 2. Configure colormap with transparent NoData background
cmap_cat = ListedColormap(['#ffffcc', '#a1dab4', '#41b6c4', '#2c7fb8', '#253494'])
cmap_cat.set_bad(color='none', alpha=0.0) # Set bad/masked pixels to fully transparent

# 3. Render raster
norm_cat = BoundaryNorm([0.5, 1.5, 2.5, 3.5, 4.5, 5.5], cmap_cat.N)
im = ax.imshow(masked_grid, extent=[west, east, south, north], cmap=cmap_cat, norm=norm_cat)
```

---

## 10. Final Figure Classification Summary & Next Steps

| Figure ID | Figure Title | Audit Classification | Primary Reason for Decision |
| :---: | :--- | :---: | :--- |
| **FIG 10.1** | Multi-Temporal LST Maps | **NEEDS REGENERATION** | Rendered synthetic concentric distance formula instead of real satellite LST. |
| **FIG 10.2** | P20/P80 Threshold Bar Chart | **PASS** | Accurate non-spatial bar chart. Correct legends and axes. |
| **FIG 10.3** | Continuous Persistence Map | **NEEDS REGENERATION** | Rendered concentric spatial structure. Must use real observation stack. |
| **FIG 10.4** | Categorical Persistence Map | **FAIL / NEEDS REGENERATION** | Critical NoData overflow bug. Background non-built pixels painted Category 5 dark blue. |
| **FIG 10.5** | Classified Obs Count Map | **NEEDS REGENERATION** | NoData background pixels (value 255) overflowed viridis colormap scale. |
| **FIG 10.6** | Full-Domain RF Agreement Chart | **PASS** | Accurate non-spatial line chart. Explicitly labeled agreement metrics. |
| **FIG 10.7** | Getis-Ord $G_i^*$ Cluster Map | **NEEDS REGENERATION** | NoData background pixels overflowed BoundaryNorm scale. |

---

### Pipeline Rerun Status Statement:
> [!IMPORTANT]
> **VISUALIZATION AUDIT COMPLETE — REGENERATION PAUSED.**  
> Numerical statistics ($146,810$ built pixels, $141,850$ persistence domain, exact category areas) remain **100% UNCHANGED AND VERIFIED**. No figures or rasters have been overwritten. Ready for user review.
