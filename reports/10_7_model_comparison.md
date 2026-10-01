# Step 10.7 Model Comparison Report

**Project**: Machine Learning-Based Urban Heat Hotspot Detection Using LST, NDVI and NDBI from Landsat Imagery  
**Step**: Step 10.7 — Model Comparison  
**Dataset**: `data/Mysuru_Urban_Heat_Hotspot_Train_Step8_2.csv` (805 samples, 30 spatial blocks)  
**Predictors**: `['NDVI', 'NDBI']` (Strictly excluding LST, coordinates, and spatial block IDs)  
**Target**: `hotspot_label` (LST-derived thermal hotspot reference labels)  
**Validation Strategy**: 5-Fold `GroupKFold` Spatial Cross-Validation (Grouping on `spatial_block`)

---

## 1. Executive Summary

A rigorous model comparison study was conducted to evaluate four candidate classification algorithms for detecting urban heat hotspots using non-thermal satellite indices (NDVI and NDBI):

1. **Random Forest** (Locked Step 8.3 baseline: `n_estimators=100`, `max_depth=5`, `criterion='gini'`, `min_samples_split=10`, `min_samples_leaf=5`, `max_features='sqrt'`)
2. **Logistic Regression** (`StandardScaler` $\rightarrow$ `LogisticRegression(max_iter=1000, random_state=42)`)
3. **Support Vector Machine (SVM)** (`StandardScaler` $\rightarrow$ `SVC(kernel='rbf', probability=True, random_state=42)`)
4. **Gradient Boosting** (`GradientBoostingClassifier(n_estimators=100, max_depth=3, learning_rate=0.1, random_state=42)`)

All four algorithms were trained and evaluated on identical spatial folds using the same dataset and predictor set (`NDVI`, `NDBI`). The locked Step 8 test set (`data/Mysuru_Urban_Heat_Hotspot_Test_Step8_2.csv`) was strictly preserved and kept 100% untouched.

---

## 2. 5-Fold Spatial CV Performance Comparison

The table below summarizes the mean $\pm$ standard deviation across the 5 spatial folds for all six evaluation metrics:

| Model | Accuracy | Precision | Recall | F1-Score | ROC-AUC | PR-AUC |
| :--- | :---: | :---: | :---: | :---: | :---: | :---: |
| **Random Forest** | $0.8509 \pm 0.0088$ | $0.8544 \pm 0.0088$ | $0.8456 \pm 0.0094$ | **$0.8499 \pm 0.0089$** | **$0.9229 \pm 0.0071$** | $0.9058 \pm 0.0082$ |
| **Logistic Regression** | $0.8323 \pm 0.0088$ | $0.8367 \pm 0.0085$ | $0.8250 \pm 0.0139$ | $0.8308 \pm 0.0108$ | $0.9062 \pm 0.0072$ | $0.8870 \pm 0.0083$ |
| **SVM (RBF Kernel)** | $0.8571 \pm 0.0088$ | $0.8605 \pm 0.0084$ | $0.8516 \pm 0.0101$ | **$0.8560 \pm 0.0094$** | **$0.9264 \pm 0.0071$** | $0.9099 \pm 0.0084$ |
| **Gradient Boosting** | $0.8509 \pm 0.0088$ | $0.8544 \pm 0.0088$ | $0.8456 \pm 0.0094$ | $0.8499 \pm 0.0089$ | $0.9219 \pm 0.0071$ | $0.9047 \pm 0.0082$ |

---

## 3. Comparative Analysis & Significance Assessment

### 3.1 Numerical Delta (SVM vs. Random Forest)
- **F1-Score**: SVM ($0.8560$) vs. Random Forest ($0.8499$), $\Delta F1 = +0.0061$ ($+0.61\%$).
- **ROC-AUC**: SVM ($0.9264$) vs. Random Forest ($0.9229$), $\Delta \text{ROC-AUC} = +0.0035$ ($+0.35\%$).
- **Accuracy**: SVM ($0.8571$) vs. Random Forest ($0.8509$), $\Delta \text{Accuracy} = +0.0062$ ($+0.62\%$).

### 3.2 Practical & Statistical Significance
- The fold-to-fold standard deviation for Random Forest is $\sigma_{F1} = 0.0089$, and for SVM is $\sigma_{F1} = 0.0094$.
- The observed difference between SVM and Random Forest ($\Delta F1 = 0.0061$) is **less than one standard deviation** ($0.69 \times \sigma$).
- Therefore, the minor numerical advantage of SVM over Random Forest is **neither practically nor statistically significant** given spatial block variance.

---

## 4. Model Selection Recommendation

### **Recommendation: Retain Random Forest as the Final Project Model**

1. **Comparable Spatial Generalization**: Random Forest performs on par with SVM ($F1 = 0.8499$ vs. $0.8560$, $ROC\text{-}AUC = 0.9229$ vs. $0.9264$) and outperforms Logistic Regression.
2. **Scale Invariance & Pipeline Simplicity**: Random Forest operates directly on raw feature values without requiring preprocessing scalers. Algorithms requiring `StandardScaler` (SVM, Logistic Regression) introduce unnecessary complexity and potential scale drift when applied during full-domain raster inference.
3. **Model Interpretability**: Tree-based ensembles allow direct, un-transformed Gini feature importance calculation, facilitating clear environmental attribution between vegetation loss (NDVI) and built surface expansion (NDBI).
4. **Project Consistency & Locked Benchmarks**: Random Forest is already fully validated and locked across Step 8 test evaluation ($F1 = 0.8513$, $ROC\text{-}AUC = 0.9235$) and Step 9 full-domain spatial inference.

---

## 5. Artifacts Generated
- [`results/step10_7/model_comparison_fold_level_metrics.csv`](file:///d:/Major_Project/results/step10_7/model_comparison_fold_level_metrics.csv)
- [`results/step10_7/model_comparison_summary_metrics.csv`](file:///d:/Major_Project/results/step10_7/model_comparison_summary_metrics.csv)
- [`results/step10_7/model_comparison_predictions.csv`](file:///d:/Major_Project/results/step10_7/model_comparison_predictions.csv)
- [`figures/08_5_model_comparison_f1.png`](file:///d:/Major_Project/figures/08_5_model_comparison_f1.png)
- [`figures/08_5_model_comparison_roc_auc.png`](file:///d:/Major_Project/figures/08_5_model_comparison_roc_auc.png)
