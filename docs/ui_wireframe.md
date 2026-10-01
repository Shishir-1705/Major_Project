# UI Wireframe & Layout Specification

**Project Title**: Machine Learning-Based Urban Heat Hotspot Detection Using LST, NDVI and NDBI from Landsat Imagery  
**Study Area**: Mysuru, Karnataka, India  
**Visual Theme**: **THERMAL INTELLIGENCE / GEO-ANALYTICS** (Dark Theme)  
**Document Version**: 1.0.0  
**Phase**: System Architecture & Application Design (Step 11)  

---

## 1. Application Layout Blueprint

The interface utilizes a desktop-first, full-screen map workspace layout divided into five functional regions:

```
+---------------------------------------------------------------------------------------------------+
| HEADER BAR: Project Title | Study Area Badge | Date Status | Section Tabs | Info Button          |
+---------------------------------------------------------------------------------------------------+
|                     |                                                       |                     |
| LAYER & DATE        | CENTRAL INTERACTIVE MAP WORKSPACE                     | RIGHT ANALYTICS     |
| CONTROL SIDEBAR     |                                                       | DRAWER / PANEL      |
| (Left, Width 300px) | (Center, Flex-Grow)                                   | (Right, Width 340px)|
|                     |                                                       |                     |
| - Layer Selector    | +---------------------------------------------------+ | - Key Metrics Card  |
|   • LST Map         | | [Map Controls: Zoom, AOI Toggle, Reset View]      | | - Layer Zonal Stats|
|   • NDVI Map        | |                                                   | | - ML Model Info   |
|   • NDBI Map        | |                  MAP CANVAS                       | |   • Features      |
|   • RF Probability  | |          (Mysuru AOI Boundary Polygon)            | |   • F1 & ROC-AUC  |
|   • RF Class        | |               (Active GeoTIFF Tile)               | |   • SHA-256 Hash  |
|   • Persistence     | |                                                   | | - Feature Importance|
|   • Gi* Clusters    | |                                                   | |   Bar Chart       |
|                     | | [Hover Coordinates & Value Inspection Badge]      | | - Category Breakdown|
| - Date Timeline     | | [Floating Interactive Map Legend (Bottom-Right)] | | - Export Reports  |
|   • 8 Acquisitions  | +---------------------------------------------------+ |                     |
|                     |                                                       |                     |
+---------------------------------------------------------------------------------------------------+
| FOOTER BAR: Data Attribution (Landsat 8/9, Dynamic World, GEE) | Scale Bar | Model Status: LOCKED |
+---------------------------------------------------------------------------------------------------+
```

---

## 2. Comprehensive Wireframe Breakdown by Section

### Section A: Overview Dashboard
- **Purpose**: Executive summary of Mysuru thermal environment and ML hotspot extent.
- **Key Visual Elements**:
  - Top 4 Stat Badges: Built Area ($132.13\text{ km}^2$), Selected Date Mean LST ($44.07^\circ\text{C}$), Hotspot Extent ($42.15\text{ km}^2$), Persistent Hotspot Area ($26.03\text{ km}^2$).
  - Central dual-panel preview: Side-by-side comparison of LST vs. RF Hotspot Classification.

---

### Section B: Thermal Map View
- **Purpose**: High-resolution spatial exploration of Landsat-derived Land Surface Temperature.
- **Key Visual Elements**:
  - Dynamic opacity slider ($0\% - 100\%$).
  - Continuous LST Color Ramp ($30^\circ\text{C}$ Deep Blue $\rightarrow 42.69^\circ\text{C}$ P20 Yellow $\rightarrow 47.06^\circ\text{C}$ P80 Red $\rightarrow 55^\circ\text{C}$ Dark Crimson).
  - Hover inspector displaying exact pixel temperature in °C.

---

### Section C: ML Hotspot Detection & Model Info Panel
- **Purpose**: Visualization of Random Forest predictions and model provenance.
- **Key Visual Elements**:
  - Layer Switcher: Hotspot Probability Gradient vs. Binary Hotspot Mask ($1 = \text{Crimson}$).
  - Dedicated **Model Information Card**:
```
+-------------------------------------------------------------+
| MODEL PROVENANCE & PERFORMANCE RECORD                      |
+-------------------------------------------------------------+
| Algorithm:       Random Forest Classifier (100 Trees)       |
| Predictors:      NDVI + NDBI (LST Excluded)                 |
| Target:          LST-derived thermal hotspot reference      |
| Spatial Test:    Spatially Held-Out Test Set (10 Blocks)   |
| Accuracy:        86.67%                                     |
| F1-Score:        86.60%                                     |
| ROC-AUC:         93.37%                                     |
| SHA-256 Hash:    4cb736e53c66c78dbbcbc1cf... [VERIFIED]     |
+-------------------------------------------------------------+
```

---

### Section D: Vegetation (NDVI) & Built-up (NDBI) Dual-Analysis
- **Purpose**: Environmental attribution connecting urban greenness and built infrastructure to heat.
- **Key Visual Elements**:
  - Split-screen or single layer overlay for NDVI ($YlGn$ palette) and NDBI ($YlOrBr$ palette).
  - Scatter plot chart in right drawer showing inverse correlation between NDVI and LST.

---

### Section E: Temporal Persistence Analysis
- **Purpose**: Analysis of heat stability across all 8 temporal acquisitions (April – May 2023).
- **Key Visual Elements**:
  - Categorical Persistence Layer: None ($0$), Transient ($1-2$), Moderate ($3-4$), Persistent ($5-8$).
  - Persistence Area Breakdown Donut Chart.

---

### Section F: Spatial Clusters (Getis-Ord $\text{G}_i^*$)
- **Purpose**: Identification of statistically significant spatial hotspot and coldspot clusters.
- **Key Visual Elements**:
  - $\text{G}_i^*$ Cluster Map ($99\%$, $95\%$, $90\%$ Confidence Hotspots & Coldspots).
  - Cluster summary table showing spatial extent in $\text{km}^2$.

---

### Section G: Methodology & Scientific Governance Modal
- **Purpose**: Educational and transparency documentation.
- **Key Visual Elements**:
  - Full workflow diagram.
  - Scientific terminology guidelines ("LST-derived thermal hotspot reference labels").
  - Data sources and Earth Engine processing details.
