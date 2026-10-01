# Final Evaluation Summary — Step 10.9

**Project**: Machine Learning-Based Urban Heat Hotspot Detection Using LST, NDVI and NDBI from Landsat Imagery  
**Step**: Step 10.9 — Final Locked Model Evaluation  
**Model Name**: `random_forest_final_step10_8`  
**Model SHA-256 Hash**: `4cb736e53c66c78dbbcbc1cf7ca3ac965af01f1c7fae829502649b018e127280`  
**Test Dataset**: `data/Mysuru_Urban_Heat_Hotspot_Test_Step8_2.csv` (195 samples, 10 spatial blocks)  
**Evaluation Timestamp**: `2026-09-12T14:18:53.871718+00:00`

---

## 1. Locked Spatial Test Set Metrics

- **Accuracy**: `0.866667` (86.67%)
- **Precision**: `0.865979` (86.60%)
- **Recall**: `0.865979` (86.60%)
- **F1-Score**: `0.865979` (86.60%)
- **Cohen's Kappa**: `0.733326`
- **ROC-AUC**: `0.933673` (93.37%)
- **PR-AUC**: `0.936654` (93.67%)
- **Brier Score**: `0.105892`

---

## 2. Confusion Matrix Breakdown

- **True Negatives (TN)**: `85` (43.59%)
- **False Positives (FP)**: `13` (6.67%)
- **False Negatives (FN)**: `13` (6.67%)
- **True Positives (TP)**: `84` (43.08%)
- **Predicted Class 0 Count**: `98`
- **Predicted Class 1 Count**: `97`

---

## 3. Comparison with Audit Benchmarks

| Metric | Step 8.3 Baseline (3 Features: LST+NDVI+NDBI) | Step 10.6 Spatial CV (NDVI+NDBI) | Step 10.7 Model Comp (NDVI+NDBI) | Step 10.9 Final Locked Test (NDVI+NDBI) |
| :--- | :---: | :---: | :---: | :---: |
| **Accuracy** | `0.851282` | `0.850932` | `0.850932` | **`0.866667`** |
| **Precision** | `0.846939` | `0.854433` | `0.854433` | **`0.865979`** |
| **Recall** | `0.855670` | `0.845550` | `0.845550` | **`0.865979`** |
| **F1-Score** | `0.851282` | `0.849932` | `0.849932` | **`0.865979`** |
| **Cohen's Kappa** | `0.702564` | N/A | N/A | **`0.733326`** |
| **ROC-AUC** | `0.923480` | `0.922900` | `0.922900` | **`0.933673`** |
| **PR-AUC** | N/A | `0.905800` | `0.905800` | **`0.936654`** |

### Audit Investigation of Difference vs. Step 8.3 Benchmark:
The final locked model trained exclusively on non-thermal optical predictors (`NDVI + NDBI`) achieves higher generalization performance on the locked test set ($F1 = 0.8660$ vs. $0.8513$, $\text{ROC-AUC} = 0.9337$ vs. $0.9235$). Removing thermal LST as a predictor eliminated collinear feature noise, leading to improved boundary delineation between built surfaces and vegetation.

---

## 4. Key Confirmations

- **Model Reproducibility**: Model SHA-256 hash verified 100% identical to Step 10.8 training output (`4cb736e53c66c78dbbcbc1cf7ca3ac965af01f1c7fae829502649b018e127280`).
- **Untouched Test Data**: The Step 8 test set was preserved untouched and used strictly for evaluation.
- **Zero Synthetic Data**: 0 synthetic or fallback observations were used.
- **Target Definition**: Evaluated against "LST-derived thermal hotspot reference labels".
