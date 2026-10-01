# Step 10.8 — Final Random Forest Model Training Report

**Project**: Machine Learning-Based Urban Heat Hotspot Detection Using LST, NDVI and NDBI from Landsat Imagery  
**Step**: Step 10.8 — Final Random Forest Model Training  
**Model Name**: `random_forest_final_step10_8`  
**Model Path**: [`models/random_forest_final_step10_8.joblib`](file:///d:/Major_Project/models/random_forest_final_step10_8.joblib)  
**Metadata Path**: [`models/random_forest_final_step10_8_metadata.json`](file:///d:/Major_Project/models/random_forest_final_step10_8_metadata.json)  
**Timestamp**: `2026-09-12T14:04:59.379667+00:00`  
**SHA-256 Hash**: `4cb736e53c66c78dbbcbc1cf7ca3ac965af01f1c7fae829502649b018e127280`  

---

## 1. Purpose of Final Training

Following the completion of the model comparison (Step 10.7) and feature ablation (Step 10.6) studies, **Random Forest** with **NDVI + NDBI** predictors was confirmed as the optimal, scale-invariant, and highly interpretable final model architecture for urban heat hotspot detection. 

The purpose of Step 10.8 is strictly to train and persist the final production model artifact using the established, locked hyperparameters on the full Step 8 spatial training set.

---

## 2. Dataset & Spatial Block Details

- **Dataset File**: [`data/Mysuru_Urban_Heat_Hotspot_Train_Step8_2.csv`](file:///d:/Major_Project/data/Mysuru_Urban_Heat_Hotspot_Train_Step8_2.csv)
- **Training Samples**: $805$ samples
- **Spatial Grouping**: $30$ distinct spatial blocks (`spatial_block`)
- **Class Distribution**:
  - **Class 0 (Non-Hotspot)**: $402$ samples ($49.94\%$)
  - **Class 1 (Hotspot)**: $403$ samples ($50.06\%$)
- **Data Integrity**: 
  - **Zero Synthetic Data**: $100\%$ real Landsat satellite observations.
  - **No Resampling/Rebalancing**: Original class structure strictly preserved.

---

## 3. Predictor Variables & Target Definition

- **Predictor Variables**: `['NDVI', 'NDBI']` (Normalized Difference Vegetation Index and Normalized Difference Built-up Index).
- **Target Variable**: `hotspot_label`
- **Scientific Target Definition**: **"LST-derived thermal hotspot reference labels"** (Binary classification: $1 = \text{Hotspot}$, $0 = \text{Non-Hotspot}$).
- **Explicit Variable Exclusions**:
  - **LST Excluded**: Thermal LST (`LST_Celsius`, `ST_B10`) is **100% excluded** from the model predictor matrix. The model relies strictly on non-thermal optical indices (NDVI and NDBI) to predict thermal hotspot labels.
  - **Coordinates Excluded**: Spatial coordinates (`longitude`, `latitude`) are **100% excluded** from predictors to prevent spatial location memorization.
  - **Group Identifiers Excluded**: Spatial block IDs (`spatial_block`) and sample indices are **100% excluded** from predictors.

---

## 4. Final Random Forest Configuration

The final model was trained using the exact locked baseline parameters established in Step 8.3 without hyperparameter tuning:

```python
RandomForestClassifier(
    n_estimators=100,
    criterion='gini',
    max_depth=5,
    min_samples_split=10,
    min_samples_leaf=5,
    max_features='sqrt',
    bootstrap=True,
    oob_score=True,
    random_state=42,
    class_weight=None,
    n_jobs=-1
)
```

---

## 5. Out-of-Bag (OOB) Diagnostic Performance

- **Final Model OOB Score**: **`0.859627`** ($85.96\%$)
- **Interpretation**: The Out-of-Bag (OOB) accuracy serves as an internal diagnostic estimate of ensemble convergence. It is **not** an independent test metric and does not replace spatial cross-validation or independent test set evaluation.

---

## 6. Gini Feature Importance

The final Gini feature importances were extracted directly from the trained model ensemble:

| Feature | Gini Importance | Percentage | Environmental Attribution |
| :--- | :---: | :---: | :--- |
| **NDBI** | `0.610315` | $61.03\%$ | Dominant driver: Impervious surface expansion and built infrastructure. |
| **NDVI** | `0.389685` | $38.97\%$ | Secondary driver: Vegetation loss and canopy cover reduction. |

*Note*: Importances sum strictly to $1.000000$ ($0.610315 + 0.389685 = 1.0$).

- **Feature Importance Artifacts**:
  - CSV: [`results/step10_8/final_model_feature_importance.csv`](file:///d:/Major_Project/results/step10_8/final_model_feature_importance.csv)
  - Figure: [`figures/step10_8/final_model_feature_importance.png`](file:///d:/Major_Project/figures/step10_8/final_model_feature_importance.png)

---

## 7. Model Integrity & Reload Verification

1. **SHA-256 Checksum Calculation**:
   - `4cb736e53c66c78dbbcbc1cf7ca3ac965af01f1c7fae829502649b018e127280`
2. **Reload Integrity Checks**:
   - Model was successfully reloaded from `models/random_forest_final_step10_8.joblib`.
   - Hyperparameters verified: `n_estimators = 100`, `max_depth = 5`, `random_state = 42`.
   - Feature order verified: `['NDVI', 'NDBI']`.
3. **Prediction Determinism Check**:
   - Class predictions (`predict`) and class probability matrices (`predict_proba`) between in-memory and reloaded models were compared across deterministic training samples.
   - **Verification Result**: **100% Exact Match** ($0$ discrepancy).

---

## 8. Software Environment & System Provenance

- **Python Version**: `3.12.10`
- **scikit-learn Version**: `1.9.0`
- **joblib Version**: `1.4.2`
- **Operating System**: Windows

---

## 9. Compliance Declarations

1. **Locked Test Set Protection**: The Step 8 locked spatial test set (`data/Mysuru_Urban_Heat_Hotspot_Test_Step8_2.csv`) was **100% untouched**, unread during training, and un-evaluated in this step.
2. **No Synthetic Data**: $0$ synthetic or mock samples were generated or used.
3. **Terminology Compliance**: Target is explicitly designated as *"LST-derived thermal hotspot reference labels"*. It is not described as ground-level measurements, field observations, or air temperature.
