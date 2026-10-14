# Phase 2 — Analytical Pages: Implementation Batch 2 (Stages 6–8)

## 1. Executive Summary

This technical specification documents the implementation of the final batch of specialized geospatial analytical routes for the **Urban Heat Hotspot Detection Platform**:
1. **Heat Persistence ([/persistence](file:///D:/Major_Project/frontend/src/pages/PersistencePage.tsx))**: Multi-temporal hotspot recurrence analysis across 8 summer 2023 Landsat observations using the static key `categorical`.
2. **Gi\* Spatial Clusters ([/clusters](file:///D:/Major_Project/frontend/src/pages/ClustersPage.tsx))**: Getis-Ord $G_i^*$ spatial autocorrelation clustering identifying statistically significant hot spots ($p < 0.10$) using the static key `clustering`.
3. **Model & Spatial Evaluation ([/model](file:///D:/Major_Project/frontend/src/pages/ModelPage.tsx))**: Complete Random Forest architecture, hyperparameters, independent spatial test set metrics ($86.60\%$ F1-Score), confusion matrix ($N=195$), Gini feature importance attribution ($61.03\%$ NDBI vs $38.97\%$ NDVI), and verified SHA-256 model checksum.
4. **Research Methodology ([/methodology](file:///D:/Major_Project/frontend/src/pages/MethodologyPage.tsx))**: 13-stage comprehensive research documentation with an end-to-end processing pipeline flowchart.

---

## 2. Route Specifications & Static Key Architecture

### 2.1 Stage 6A — Heat Persistence (`/persistence`)
- **Primary Route**: `/persistence`
- **Active Layer**: `persistence`
- **Authoritative Static Key**: `categorical`
- **Backend Tile Routing**:
  `GET /api/v1/tiles/persistence/categorical/{z}/{x}/{y}.png`
  Resolves to: `results/step10_spatial_evaluation/categorical_persistence_30m.tif`.
- **Temporal Behavior**: Static multi-temporal synthesis layer across all 8 observation scenes; temporal timeline slider is intentionally disabled (`showTimeline={false}`) to prevent invalid date-parameter queries.
- **Categorical Classes & Empirical Data**:
  - *Category 5: >75–100% Recurrence (Persistent / Chronic)*: $8.806\text{ km}^2$ ($9.40\%$ of valid persistence domain) — rendered in Crimson Red (`#ef4444`).
  - *Category 4: >50–75% Recurrence (High)*: $0.544\text{ km}^2$ ($0.58\%$) — rendered in Orange (`#fb923c`).
  - *Category 3: >25–50% Recurrence (Moderate)*: $0.835\text{ km}^2$ ($0.89\%$) — rendered in Amber/Yellow (`#facc15`).
  - *Category 2: >0–25% Recurrence (Low / Transient)*: $1.678\text{ km}^2$ ($1.79\%$) — rendered in Cyan (`#06b6d4`).
  - *Category 1: 0% Recurrence (Never Hotspot)*: $81.795\text{ km}^2$ ($87.33\%$) — rendered transparently / Slate-800 (`#1e293b`).
  - *Total Valid Persistence Domain*: $93.657\text{ km}^2$.

### 2.2 Stage 6B — Gi\* Spatial Clusters (`/clusters`)
- **Primary Route**: `/clusters`
- **Active Layer**: `gi_star`
- **Authoritative Static Key**: `clustering`
- **Backend Tile Routing**:
  `GET /api/v1/tiles/gi_star/clustering/{z}/{x}/{y}.png`
  Resolves to: `results/step10_spatial_evaluation/gi_star_clustering_30m.tif`.
- **Temporal Behavior**: Static spatial autocorrelation layer; timeline slider disabled (`showTimeline={false}`).
- **Statistical Significance Classes (Empirical Findings)**:
  - *Hotspot 90% Confidence ($z \ge 1.645, p < 0.10$)*: $8.856\text{ km}^2$ ($9.46\%$ of built domain) — rendered in Orange-Red (`#f46d43`).
  - *Not Significant ($-1.645 < z < 1.645$)*: $84.801\text{ km}^2$ ($90.54\%$) — rendered transparently (`#1e293b`).
  - *Hotspots 95% ($z \ge 1.96$), 99% ($z \ge 2.58$) and Coldspots*: Accurately documented as $0.00\text{ km}^2$ in this summer 2023 dataset; no fictitious significance levels or coldspot boundaries are synthesized.
- **Spatial Corroboration**:
  The $8.856\text{ km}^2$ ($9.46\%$) statistically significant spatial cluster directly corroborates the $8.806\text{ km}^2$ ($9.40\%$) Category 5 chronic persistence zone in central urban Mysuru.

### 2.3 Stage 7 — Model Specifications & Spatial Evaluation (`/model`)
- **Primary Route**: `/model`
- **Algorithm**: `RandomForestClassifier (100 Trees)`
- **Locked Checksum**: `4cb736e53c66c78dbbcbc1cf7ca3ac965af01f1c7fae829502649b018e127280`
- **Feature Set**: Strictly optical predictors:
  - NDBI (Normalized Difference Built-up Index): $61.03\%$ Gini importance.
  - NDVI (Normalized Difference Vegetation Index): $38.97\%$ Gini importance.
  - Thermal LST and spatial coordinates were completely excluded from model inputs.
- **Hyperparameter Configuration**:
  `n_estimators`: 100, `max_depth`: 5, `min_samples_split`: 10, `min_samples_leaf`: 5, `max_features`: "sqrt", `bootstrap`: true, `random_state`: 42.
- **Independent Spatial Test Set Performance (N = 195 samples across 10 disjoint spatial blocks)**:
  - Accuracy: $86.67\%$ ($169 / 195$ correct)
  - F1-Score: $86.60\%$
  - Precision: $86.60\%$
  - Recall: $86.60\%$
  - Cohen's Kappa: $0.7333$
  - ROC-AUC: $93.37\%$
  - PR-AUC: $93.67\%$
  - Brier Score: $0.1059$
- **Confusion Matrix**:
  - True Negatives (TN): 85
  - False Positives (FP): 13
  - False Negatives (FN): 13
  - True Positives (TP): 84

### 2.4 Stage 8 — Research Methodology (`/methodology`)
- **Primary Route**: `/methodology`
- **Structure**: 13-stage comprehensive research documentation:
  1. *Research Objective*: Predictive mapping of relative surface thermal hotspots from optical imagery.
  2. *Study Area*: Mysuru, Karnataka, India (EPSG:32643, UTM Zone 43N, $132.13\text{ km}^2$ built domain).
  3. *Multi-Temporal Cadence*: 8 summer 2023 Landsat-8/9 scenes (Path 144, Row 51).
  4. *Radiometric LST Retrieval*: Split-window / single-channel atmospheric correction and FVC surface emissivity.
  5. *NDVI Calculation*: $\frac{\text{NIR} - \text{Red}}{\text{NIR} + \text{Red}}$ (Landsat Bands 5 and 4).
  6. *NDBI Calculation*: $\frac{\text{SWIR}_1 - \text{NIR}}{\text{SWIR}_1 + \text{NIR}}$ (Landsat Bands 6 and 5).
  7. *Pseudo-Reference Label Generation*: $P_{80}$ statistical percentile threshold per date.
  8. *Feature Extraction*: Urban built-up masking ($146,812$ valid pixels).
  9. *Random Forest Classification*: 100 estimators, max depth 5, optical predictors only.
  10. *Spatial Block Evaluation*: Spatial block hold-out protocol ($0$ spatial leakage).
  11. *Multi-Temporal Persistence*: Isolation of chronic heat zones from transient microclimates.
  12. *Getis-Ord $G_i^*$ Spatial Clustering*: Local spatial autocorrelation z-scores ($p < 0.10$).
  13. *Scientific Governance & Disclosures*: Skin temperature vs 2 m air temperature, pseudo-reference labels vs ground truth, relative hotspots vs meteorological heatwaves, correlation vs causation.
- **Visual Lineage**: 5-stage sequential processing flowchart rendered using clean, responsive Tailwind grid cards.

---

## 3. Shared Component Architecture & Reusability

All analytical pages reuse the core UI components without redundant map instantiation:
- **MapWorkspace (`frontend/src/components/map/MapWorkspace.tsx`)**: Reused in `/persistence` and `/clusters` with `showTimeline={false}`. Handles CARTO Voyager basemap, dynamic GeoTIFF tile streaming, AOI polygon boundary, coordinates tracker, and auto-resize observer.
- **MapDisplayControls (`frontend/src/components/controls/MapDisplayControls.tsx`)**: Embedded in the sidebars of both spatial pages for real-time opacity adjustment ($10\% - 100\%$) and AOI boundary toggling.
- **StatCard (`frontend/src/components/common/StatCard.tsx`)**: Standardized metric cards across all pages with loading skeletons and server offline indicators.
- **useAppStore (`frontend/src/store/useAppStore.ts`)**: Central Zustand store managing layer state, static keys, and cached asynchronous statistics.
