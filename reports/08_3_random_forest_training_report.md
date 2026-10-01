# Step 8.3: Random Forest Baseline Model Training & Validation Report

## 1. Executive Summary & Model Configuration

A baseline **Random Forest Classifier** (`sklearn.ensemble.RandomForestClassifier`) was trained on the pre-monsoon Mysuru urban heat hotspot dataset using non-thermal predictors ONLY.

> [!IMPORTANT]
> **Target Leakage Prevention**: LST was used to construct the target hotspot_label but was excluded from the Random Forest predictor variables to prevent target leakage.

> [!NOTE]
> **Spatial Independence**: The test set consists of spatial blocks not shared with the training set (0 shared spatial blocks across 0.02° × 0.02° grid cells).

> [!CAUTION]
> **Boundary of Prediction**: The model predicts LST-derived thermal hotspot reference labels ($0 = \text{Cooler Built-up}$, $1 = \text{Thermal Hotspot}$) defined in Step 6. It does **NOT** predict 2 m shelter air temperature, ambient weather station measurements, or official Indian Meteorological Department (IMD) heatwave declarations.

### Approved Hyperparameter Configuration
```python
rf_baseline = RandomForestClassifier(
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

## 2. Training Results & Out-Of-Bag (OOB) Performance

* **Training Partition Source**: [`data/Mysuru_Urban_Heat_Hotspot_Train_Step8_2.csv`](file:///d:/Major_Project/data/Mysuru_Urban_Heat_Hotspot_Train_Step8_2.csv)
* **Training Sample Count**: `805` samples ($80.50\%$ of total dataset)
* **Training Class Distribution**:
  - Class 0 (Cooler Built-up): `402` samples ($49.94\%$)
  - Class 1 (Thermal Hotspot): `403` samples ($50.06\%$)
* **Out-Of-Bag (OOB) Score**: `0.852174` (**85.22%** OOB Accuracy)

---

## 3. Test Set Validation Performance (Untouched Test Partition)

* **Test Partition Source**: [`data/Mysuru_Urban_Heat_Hotspot_Test_Step8_2.csv`](file:///d:/Major_Project/data/Mysuru_Urban_Heat_Hotspot_Test_Step8_2.csv)
* **Test Sample Count**: `195` samples ($19.50\%$ of total dataset)
* **Test Class Distribution**:
  - Class 0 (Cooler Built-up): `98` samples ($50.26\%$)
  - Class 1 (Thermal Hotspot): `97` samples ($49.74\%$)

### Confusion Matrix (Untouched 10 Spatial Blocks)

| | Predicted Class 0 (Cooler) | Predicted Class 1 (Hotspot) | Total Actual |
| :--- | :---: | :---: | :---: |
| **Actual Class 0 (Cooler)** | **TN = 83** | **FP = 15** | 98 |
| **Actual Class 1 (Hotspot)** | **FN = 14** | **TP = 83** | 97 |
| **Total Predicted** | 97 | 98 | 195 |

### Comprehensive Classification Performance Metrics

| Classification Metric | Metric Value | Percentage / Interpretation |
| :--- | :---: | :--- |
| **Accuracy** | `0.851282` | **85.13%** Overall Correct Predictions |
| **Precision (Hotspot - Class 1)** | `0.846939` | **84.69%** Positive Predictive Value |
| **Recall / Sensitivity (Hotspot - Class 1)** | `0.855670` | **85.57%** True Positive Rate |
| **F1-Score (Hotspot - Class 1)** | `0.851282` | Harmonic mean of Precision & Recall |
| **Precision (Cooler - Class 0)** | `0.855670` | **85.57%** Negative Predictive Value |
| **Recall (Cooler - Class 0)** | `0.846939` | **84.69%** True Negative Rate |
| **F1-Score (Cooler - Class 0)** | `0.851282` | Harmonic mean for Class 0 |
| **Cohen's Kappa ($\kappa$)** | `0.702564` | Substantial Inter-rater Agreement |
| **ROC-AUC Score** | `0.923480` | **92.35%** Discriminative Ability (`predict_proba`) |

### Predicted Class Distribution (Test Set Inference)
* **Predicted Class 0 (Cooler)**: `97` samples ($49.74\%$)
* **Predicted Class 1 (Hotspot)**: `98` samples ($50.26\%$)
* *Assessment*: The predicted class ratio matches the actual test class distribution almost perfectly.

---

## 4. Feature Importance Audit

Feature importances extracted natively via Mean Decrease in Impurity (Gini MDI):

| Feature Name | Feature Type | Gini Importance | Relative Contribution |
| :--- | :--- | :---: | :---: |
| **NDBI** | Built-up/Impervious Index | `0.584312` | **58.43%** |
| **NDVI** | Vegetation Index | `0.415688` | **41.57%** |
| **Total Sum** | — | `1.000000` | **100.00%** |

* **Interpretation**: `NDBI` is the leading predictor of urban heat hotspots, contributing 58.43% of splitting power, reflecting the physical impact of impervious surfaces on elevated thermal skin response. `NDVI` contributes 41.57%, capturing vegetation cooling effects.

---

## 5. Summary of Output Artifacts Created

1. **Python Training Script**: [`scripts/08_3_train_random_forest.py`](file:///d:/Major_Project/scripts/08_3_train_random_forest.py)
2. **Serialized Model Binary**: [`models/random_forest_baseline_step8_3.joblib`](file:///d:/Major_Project/models/random_forest_baseline_step8_3.joblib)
3. **Confusion Matrix CSV**: [`results/08_3_confusion_matrix.csv`](file:///d:/Major_Project/results/08_3_confusion_matrix.csv)
4. **Feature Importances CSV**: [`results/08_3_feature_importance.csv`](file:///d:/Major_Project/results/08_3_feature_importance.csv)
5. **Test Predictions CSV**: [`results/08_3_test_predictions.csv`](file:///d:/Major_Project/results/08_3_test_predictions.csv)
6. **Training & Validation Report**: [`reports/08_3_random_forest_training_report.md`](file:///d:/Major_Project/reports/08_3_random_forest_training_report.md)
