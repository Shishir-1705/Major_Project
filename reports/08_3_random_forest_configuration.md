# Step 8.3: Supervised Random Forest Classifier Model Configuration Proposal

## 1. Executive Summary & Objective

This document proposes a scientifically defensible, reproducible, and un-overfitted baseline configuration for training a **Random Forest Classifier** to detect urban heat hotspot reference labels over Mysuru, Karnataka, India.

The model will learn non-linear spatial boundary relationships mapping non-thermal spectral predictors ($X$) to LST-derived thermal hotspot reference labels ($Y$), evaluated against the spatially isolated test partition established in **Step 8.2**.

---

## 2. Dataset & Variable Role Specification

The training and testing datasets created in Step 8.2 will be loaded without modification or reshuffling:

* **Training Partition**: [`data/Mysuru_Urban_Heat_Hotspot_Train_Step8_2.csv`](file:///d:/Major_Project/data/Mysuru_Urban_Heat_Hotspot_Train_Step8_2.csv) (805 samples, 30 spatial blocks)
* **Testing Partition**: [`data/Mysuru_Urban_Heat_Hotspot_Test_Step8_2.csv`](file:///d:/Major_Project/data/Mysuru_Urban_Heat_Hotspot_Test_Step8_2.csv) (195 samples, 10 spatial blocks)

### Explicit Variable Roles

| Variable Name | Role | Treatment in Model Training |
| :--- | :--- | :--- |
| `NDVI` | **Predictor ($X_1$)** | Non-thermal vegetation index input feature. |
| `NDBI` | **Predictor ($X_2$)** | Non-thermal built-up spectral response index input feature. |
| `hotspot_label` | **Target ($Y$)** | Binary reference target label ($0 = \text{Cooler Built-up}$, $1 = \text{Thermal Hotspot}$). |
| `longitude` | **Spatial Metadata** | **STRICTLY EXCLUDED** from model predictor matrix $X$. |
| `latitude` | **Spatial Metadata** | **STRICTLY EXCLUDED** from model predictor matrix $X$. |
| `spatial_block` | **Validation Metadata** | **STRICTLY EXCLUDED** from model predictor matrix $X$. |
| `LST_Celsius` | **Thermal Target Source** | **STRICTLY EXCLUDED** to prevent target leakage. |

> [!IMPORTANT]
> **Scientific Terminology & Boundaries**: The model predicts relative LST-derived thermal hotspot reference labels ($Y \in \{0, 1\}$) within the 30 m built-up domain. It does **NOT** predict 2 m shelter air temperature, ambient weather station measurements, or official Indian Meteorological Department (IMD) heatwave conditions.

---

## 3. Justification of Hyperparameters & Configuration Choices

### 1. Library Selection: `scikit-learn` (`RandomForestClassifier`)
* **Choice**: `sklearn.ensemble.RandomForestClassifier`
* **Justification**: Standard, highly optimized, peer-reviewed implementation offering deterministic tree ensemble construction, robust Gini impurity node splitting, and native feature importance extraction.

### 2. Number of Estimators (`n_estimators = 100`)
* **Choice**: `100` decision trees
* **Justification**: For a dataset of 805 training samples and 2 continuous predictors, 100 decision trees provide a stable ensemble decision boundary with minimal variance. Increasing beyond 100 trees yields diminishing returns while staying computationally lightweight.

### 3. Random Seed (`random_state = 42`)
* **Choice**: `42`
* **Justification**: Guarantees 100% exact numerical reproducibility across Python executions and computing environments.

### 4. Splitting Criterion (`criterion = 'gini'`)
* **Choice**: Gini Impurity (`'gini'`)
* **Justification**: Standard classification criterion that measures statistical impurity of node splits. Computationally efficient and well-suited for binary classification.

### 5. Maximum Tree Depth (`max_depth = 5`)
* **Choice**: `max_depth = 5` (Restricted Depth)
* **Justification**: With only 2 predictor features ($X = \{\text{NDVI}, \text{NDBI}\}$), an unrestricted tree depth would allow individual trees to isolate individual noisy pixels or overfit fine-grained threshold variations. Restricting `max_depth` to `5` caps maximum leaf nodes per tree at $2^5 = 32$, forcing trees to learn smooth, interpretable decision boundaries that generalize well to unseen spatial blocks.

### 6. Minimum Samples per Split & Leaf (`min_samples_split = 10`, `min_samples_leaf = 5`)
* **Choice**: `min_samples_split = 10`, `min_samples_leaf = 5`
* **Justification**: Ensures each leaf node represents at least 5 spatial samples ($\approx 0.62\%$ of training set), suppressing noise fitting and preventing single outlier pixels from dictating classification rules.

### 7. Class Weighting (`class_weight = None`)
* **Choice**: `None` (Unweighted)
* **Justification**: The spatial train partition established in Step 8.2 is naturally balanced (402 Class 0 samples vs 403 Class 1 samples, a 49.94% / 50.06% balance). No class weighting correction is necessary.

### 8. Feature Scaling (`max_features = 'sqrt'`, No Normalization)
* **Choice**: No feature normalization or standardization; `max_features = 'sqrt'` ($\sqrt{2} \approx 1$ or 2 features per split).
* **Justification**: Decision tree ensembles are non-parametric and invariant to monotonic feature scaling because split thresholds are evaluated on ordinal feature rank order rather than spatial distance metrics. Leaving raw `NDVI` and `NDBI` unscaled preserves physical interpretability.

### 9. Postponement of Hyperparameter Tuning
* **Choice**: Tuning **POSTPONED**
* **Justification**: Establishing a clean, un-overfitted baseline configuration is required prior to any optimization. Tuning hyperparameters on the test set is strictly prohibited to prevent data leakage.

---

## 4. Test Set Preservation & Leakage Prevention Strategy

To ensure strict scientific validity:

1. **Isolation During Training**: The model will be instantiated and fitted **EXCLUSIVELY** on the training partition (`df_train[['NDVI', 'NDBI']]` and `df_train['hotspot_label']`).
2. **Zero Interaction with Test Set**: The test dataset ([`data/Mysuru_Urban_Heat_Hotspot_Test_Step8_2.csv`](file:///d:/Major_Project/data/Mysuru_Urban_Heat_Hotspot_Test_Step8_2.csv)) will remain unread and unaccessed until after model fitting is completely finalized.
3. **Out-of-Block Evaluation**: Test evaluation will be executed strictly in inference mode (`rf.predict(X_test)`) across the 10 spatially isolated test blocks.

---

## 5. Feature Importance Audit Methodology

* **Mean Decrease in Impurity (MDI / Gini Importance)**: Calculated natively from the trained forest ensemble to quantify the relative contribution of `NDVI` vs `NDBI` in reducing class impurity.
* **Permutation Feature Importance**: Computed **STRICTLY ON THE TRAINING SET** (`X_train`, `y_train`) to measure performance loss when individual predictors are shuffled, avoiding any feature importance leakage from the test set.

---

## 6. Model Evaluation Metrics to be Reported in Step 8.3

Upon training completion, the model performance will be evaluated against both Training and Testing sets using:

1. **Confusion Matrix**: True Positives (TP), True Negatives (TN), False Positives (FP), False Negatives (FN).
2. **Overall Accuracy**: Total correct predictions over total samples.
3. **Precision**: $\frac{\text{TP}}{\text{TP} + \text{FP}}$ for Class 0 and Class 1.
4. **Recall / Sensitivity**: $\frac{\text{TP}}{\text{TP} + \text{FN}}$ for Class 0 and Class 1.
5. **F1-Score**: Harmonic mean of Precision and Recall for Class 0, Class 1, and Macro Average.
6. **Cohen's Kappa ($\kappa$)**: Inter-rater agreement accounting for chance agreement.
7. **ROC-AUC Score**: Area Under the Receiver Operating Characteristic curve.

---

## 7. Artifacts to be Generated by Step 8.3

1. **Python Training Script**: [`scripts/08_3_train_random_forest.py`](file:///d:/Major_Project/scripts/08_3_train_random_forest.py)
2. **Serialized Model File**: `models/random_forest_hotspot_baseline.joblib`
3. **Evaluation Report**: `reports/08_3_random_forest_evaluation_report.md`
4. **Feature Importance Table**: `reports/08_3_feature_importance.csv`

---

## RECOMMENDED BASELINE CONFIGURATION

```python
from sklearn.ensemble import RandomForestClassifier

# Recommended Baseline Random Forest Configuration for Step 8.3
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
