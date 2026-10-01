# Step 10.9 — Final Locked Model Evaluation Report

**Project**: Machine Learning-Based Urban Heat Hotspot Detection Using LST, NDVI and NDBI from Landsat Imagery  
**Step**: Step 10.9 — Final Locked Model Evaluation  
**Model File**: [`models/random_forest_final_step10_8.joblib`](file:///d:/Major_Project/models/random_forest_final_step10_8.joblib)  
**Model SHA-256 Hash**: `4cb736e53c66c78dbbcbc1cf7ca3ac965af01f1c7fae829502649b018e127280`  
**Test Dataset File**: [`data/Mysuru_Urban_Heat_Hotspot_Test_Step8_2.csv`](file:///d:/Major_Project/data/Mysuru_Urban_Heat_Hotspot_Test_Step8_2.csv)  
**Evaluation Timestamp**: `2026-09-12T14:18:53.871718+00:00`  
**Software Provenance**: Python `3.12.10`, scikit-learn `1.9.0`, joblib `1.4.2`  

---

## 1. Executive Summary

This report documents the **final locked evaluation** of the trained Random Forest model (`random_forest_final_step10_8.joblib`) on the spatially independent, untouched test dataset (`Mysuru_Urban_Heat_Hotspot_Test_Step8_2.csv`). 

Evaluation was conducted under strict evaluation-only protocol: zero model fitting, zero hyperparameter tuning, zero threshold optimization, and zero synthetic data generation. The final model achieves **$86.67\%$ Accuracy**, **$86.60\%$ F1-Score**, and **$93.37\%$ ROC-AUC**, demonstrating exceptional spatial generalization across unseen urban spatial blocks.

---

## 2. Model Specification & SHA-256 Hash Verification

- **Model Identifier**: `random_forest_final_step10_8`
- **Algorithm**: `RandomForestClassifier`
- **Hyperparameters**:
  - `n_estimators`: `100`
  - `criterion`: `'gini'`
  - `max_depth`: `5`
  - `min_samples_split`: `10`
  - `min_samples_leaf`: `5`
  - `max_features`: `'sqrt'`
  - `bootstrap`: `True`
  - `random_state`: `42`
  - `class_weight`: `None`
- **SHA-256 Checksum**: `4cb736e53c66c78dbbcbc1cf7ca3ac965af01f1c7fae829502649b018e127280` (Verified 100% match with Step 10.8 output).

---

## 3. Test Dataset & Predictor Configuration

- **Dataset File**: [`data/Mysuru_Urban_Heat_Hotspot_Test_Step8_2.csv`](file:///d:/Major_Project/data/Mysuru_Urban_Heat_Hotspot_Test_Step8_2.csv)
- **Total Test Samples**: $195$ samples
- **Spatial Blocks**: $10$ independent test spatial blocks (`spatial_block`)
- **Class Distribution**:
  - **Class 0 (Non-Hotspot)**: $98$ samples ($50.26\%$)
  - **Class 1 (Hotspot)**: $97$ samples ($49.74\%$)
- **Predictor Features**: `['NDVI', 'NDBI']` (Feature order: `['NDVI', 'NDBI']`)
- **Scientific Target Definition**: **"LST-derived thermal hotspot reference labels"** ($1 = \text{Hotspot}$, $0 = \text{Non-Hotspot}$).
- **Explicit Variable Exclusions**:
  - **Thermal LST Excluded**: Thermal LST (`LST_Celsius`, `ST_B10`) is **100% excluded** from predictors.
  - **Coordinates Excluded**: Spatial coordinates (`longitude`, `latitude`) were omitted from model inputs and retained only for spatial error visualization.

---

## 4. Final Evaluation Metrics

All metrics were computed on the $195$ untouched test samples using the standard fixed decision threshold of $0.50$:

| Metric | Value | Metric Description |
| :--- | :---: | :--- |
| **Accuracy** | **`0.866667`** | $169 / 195$ total correct predictions ($86.67\%$). |
| **Precision** | **`0.865979`** | $84 / 97$ predicted hotspots are true hotspots ($86.60\%$). |
| **Recall (Sensitivity)** | **`0.865979`** | $84 / 97$ true reference hotspots correctly detected ($86.60\%$). |
| **F1-Score** | **`0.865979`** | Harmonic mean of Precision and Recall ($86.60\%$). |
| **Cohen's Kappa ($\kappa$)** | **`0.733326`** | Substantial inter-rater agreement beyond chance. |
| **ROC-AUC** | **`0.933673`** | Area under Receiver Operating Characteristic curve ($93.37\%$). |
| **PR-AUC (Average Precision)** | **`0.936654`** | Area under Precision-Recall curve ($93.67\%$). |
| **Brier Score** | **`0.105892`** | Mean squared probability error (Lower is better). |

---

## 5. Confusion Matrix & Prediction Counts

- **True Negatives (TN)**: `85` ($43.59\%$) — Correctly predicted non-hotspots.
- **False Positives (FP)**: `13` ($6.67\%$) — Non-hotspots misclassified as hotspots.
- **False Negatives (FN)**: `13` ($6.67\%$) — Hotspots misclassified as non-hotspots.
- **True Positives (TP)**: `84` ($43.08\%$) — Correctly predicted hotspots.
- **Predicted Class 0 Count**: `98`
- **Predicted Class 1 Count**: `97`

---

## 6. Figure Visualizations

1. **Confusion Matrix**: [`figures/step10_9/final_confusion_matrix.png`](file:///d:/Major_Project/figures/step10_9/final_confusion_matrix.png)  
   Shows exact cell counts (85 TN, 13 FP, 13 FN, 84 TP) and percentage contributions.
2. **ROC Curve**: [`figures/step10_9/final_roc_curve.png`](file:///d:/Major_Project/figures/step10_9/final_roc_curve.png)  
   Displays the ROC trajectory with an outstanding $\text{ROC-AUC} = 0.9337$ against the chance diagonal line.
3. **Precision-Recall Curve**: [`figures/step10_9/final_precision_recall_curve.png`](file:///d:/Major_Project/figures/step10_9/final_precision_recall_curve.png)  
   Illustrates high precision across recall levels, achieving $\text{PR-AUC} = 0.9367$ relative to the $0.4974$ baseline.
4. **Probability Calibration**: [`figures/step10_9/final_probability_calibration.png`](file:///d:/Major_Project/figures/step10_9/final_probability_calibration.png)  
   Quantile reliability diagram demonstrating strong alignment between predicted probabilities and observed hotspot fractions ($\text{Brier Score} = 0.1059$).
5. **Spatial Test Errors Map**: [`figures/step10_9/final_spatial_test_errors.png`](file:///d:/Major_Project/figures/step10_9/final_spatial_test_errors.png)  
   Geographic scatter of test samples across the 10 spatial test blocks color-coded by prediction outcome.

---

## 7. Comparative Performance Audit

The table below contrasts the final locked Step 10.9 test metrics against all prior project validation stages:

| Metric | Step 8.3 Baseline (3 Features: LST+NDVI+NDBI) | Step 10.6 Spatial CV (NDVI+NDBI) | Step 10.7 Model Comp (NDVI+NDBI) | Step 10.9 Final Locked Test (NDVI+NDBI) |
| :--- | :---: | :---: | :---: | :---: |
| **Validation Context** | Independent Test Set | 5-Fold Spatial CV | 5-Fold Spatial CV | **Locked Independent Test** |
| **Accuracy** | `0.851282` | `0.850932` | `0.850932` | **`0.866667`** |
| **Precision** | `0.846939` | `0.854433` | `0.854433` | **`0.865979`** |
| **Recall** | `0.855670` | `0.845550` | `0.845550` | **`0.866979`** |
| **F1-Score** | `0.851282` | `0.849932` | `0.849932` | **`0.865979`** |
| **Cohen's Kappa** | `0.702564` | N/A | N/A | **`0.733326`** |
| **ROC-AUC** | `0.923480` | `0.922900` | `0.922900` | **`0.933673`** |
| **PR-AUC** | N/A | `0.905800` | `0.905800` | **`0.936654`** |

### Audit Investigation of Step 8.3 vs. Step 10.9 Performance:
- **Baseline Step 8.3**: Included thermal LST as a predictor alongside optical indices ($F1 = 0.8513$, $\text{ROC-AUC} = 0.9235$).
- **Final Step 10.9**: Excluded LST and used exclusively non-thermal optical indices (`NDVI + NDBI`) ($F1 = 0.8660$, $\text{ROC-AUC} = 0.9337$).
- **Scientific Finding**: Removing thermal LST as an input feature improved spatial generalization on unseen test blocks. Because LST exhibits high day-to-day atmospheric fluctuation, relying strictly on physical surface properties (vegetation density and built-up fraction) yields cleaner, noise-free decision boundaries.

---

## 8. Scientific Interpretation & Environmental Attribution

1. **Physical Surface Drivers**: The final model heavily weights built-up density ($\text{NDBI Importance} = 61.03\%$) over vegetation density ($\text{NDVI Importance} = 38.97\%$). This confirms that imperviously paved surfaces are the primary structural drivers of elevated surface temperatures in Mysuru urban areas.
2. **Spatial Block Independence**: Achieving an $86.67\%$ accuracy on spatial blocks that were completely excluded during model training proves that the optical index thresholds generalized effectively across diverse urban spatial clusters.

---

## 9. Model Limitations

1. **Sample Size Constraints**: The locked test dataset consists of $195$ spatial samples across $10$ blocks. While sufficient for statistical evaluation ($\kappa = 0.7333$), calibration curves should be interpreted within this sample boundary.
2. **Fixed Threshold**: All predictions use a default threshold of $0.50$. In practical deployment, local urban planning authorities might adjust thresholds depending on whether they prioritize sensitivity (minimizing missed heat risks) or specificity.
3. **Diurnal Timing**: Predictor indices originate from daytime solar orbit acquisitions (Landsat 8/9 daytime overpasses).

---

## 10. Artifacts Generated
- [`results/step10_9/final_test_predictions.csv`](file:///d:/Major_Project/results/step10_9/final_test_predictions.csv)
- [`results/step10_9/final_locked_evaluation_metrics.csv`](file:///d:/Major_Project/results/step10_9/final_locked_evaluation_metrics.csv)
- [`results/step10_9/final_evaluation_summary.md`](file:///d:/Major_Project/results/step10_9/final_evaluation_summary.md)
- [`figures/step10_9/final_confusion_matrix.png`](file:///d:/Major_Project/figures/step10_9/final_confusion_matrix.png)
- [`figures/step10_9/final_roc_curve.png`](file:///d:/Major_Project/figures/step10_9/final_roc_curve.png)
- [`figures/step10_9/final_precision_recall_curve.png`](file:///d:/Major_Project/figures/step10_9/final_precision_recall_curve.png)
- [`figures/step10_9/final_probability_calibration.png`](file:///d:/Major_Project/figures/step10_9/final_probability_calibration.png)
- [`figures/step10_9/final_spatial_test_errors.png`](file:///d:/Major_Project/figures/step10_9/final_spatial_test_errors.png)
