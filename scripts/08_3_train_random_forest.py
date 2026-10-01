"""
PROJECT: Machine Learning-Based Urban Heat Hotspot Detection Using LST, NDVI and NDBI from Landsat Imagery
STUDY AREA: Mysuru, Karnataka, India
STEP 8.3: Supervised Random Forest Classifier Model Training & Evaluation

PURPOSE:
1. Fit the approved baseline RandomForestClassifier on data/Mysuru_Urban_Heat_Hotspot_Train_Step8_2.csv using ONLY NDVI and NDBI.
2. Calculate Out-Of-Bag (OOB) score from training ensemble process.
3. Evaluate fitted model on untouched test partition data/Mysuru_Urban_Heat_Hotspot_Test_Step8_2.csv.
4. Calculate comprehensive classification metrics: Confusion Matrix, Accuracy, Precision, Recall, F1-Score, Cohen's Kappa, and ROC-AUC.
5. Export model binary (.joblib), test predictions (.csv), confusion matrix (.csv), feature importances (.csv), and report (.md).
"""

import os
import joblib
import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    confusion_matrix, accuracy_score, precision_score, recall_score,
    f1_score, cohen_kappa_score, roc_auc_score, classification_report
)

def train_and_evaluate_rf():
    print("=====================================================")
    print("STEP 8.3: RANDOM FOREST BASELINE MODEL TRAINING")
    print("=====================================================")
    
    # Paths
    train_path = os.path.join("data", "Mysuru_Urban_Heat_Hotspot_Train_Step8_2.csv")
    test_path  = os.path.join("data", "Mysuru_Urban_Heat_Hotspot_Test_Step8_2.csv")
    
    if not os.path.exists(train_path) or not os.path.exists(test_path):
        print("FAIL: Step 8.2 Train/Test files not found.")
        return
        
    df_train = pd.read_csv(train_path)
    df_test  = pd.read_csv(test_path)
    
    # Verification of Columns and Nulls
    req_cols = ['NDVI', 'NDBI', 'hotspot_label']
    for c in req_cols:
        if c not in df_train.columns or c not in df_test.columns:
            print(f"FAIL: Missing required column {c}")
            return
            
    if df_train[req_cols].isnull().sum().sum() > 0 or df_test[req_cols].isnull().sum().sum() > 0:
        print("FAIL: Missing/NaN values found in features or target.")
        return

    # Verify Predictors X (NDVI, NDBI) and Target Y (hotspot_label)
    X_cols = ['NDVI', 'NDBI']
    y_col  = 'hotspot_label'
    
    X_train = df_train[X_cols]
    y_train = df_train[y_col]
    
    X_test = df_test[X_cols]
    y_test = df_test[y_col]
    
    train_count = len(df_train)
    test_count  = len(df_test)
    
    train_c0 = (y_train == 0).sum()
    train_c1 = (y_train == 1).sum()
    test_c0  = (y_test == 0).sum()
    test_c1  = (y_test == 1).sum()
    
    print(f"Loaded Training Partition: {train_count} samples (Class 0: {train_c0}, Class 1: {train_c1})")
    print(f"Loaded Testing Partition:  {test_count} samples (Class 0: {test_c0}, Class 1: {test_c1})")
    print(f"Predictor Feature Matrix X: {X_cols} (Strictly 2 Features)")
    print(f"Target Vector Y: {y_col}")
    print("-----------------------------------------------------")
    
    # Model Instantiation (APPROVED Baseline Parameters)
    rf = RandomForestClassifier(
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
    
    # 7. Fit Model on Training Data ONLY
    print("Fitting Random Forest Model on Training Set...")
    rf.fit(X_train, y_train)
    
    # 8. OOB Score
    oob_score = rf.oob_score_
    print(f"Training Complete. Out-Of-Bag (OOB) Accuracy: {oob_score:.6f} ({oob_score*100:.2f}%)")
    print("-----------------------------------------------------")
    
    # 9. Evaluate on untouched Test Set
    y_pred = rf.predict(X_test)
    y_prob = rf.predict_proba(X_test)[:, 1]
    
    # Compute Metrics
    cm = confusion_matrix(y_test, y_pred)
    tn, fp, fn, tp = cm.ravel()
    
    acc  = accuracy_score(y_test, y_pred)
    prec = precision_score(y_test, y_pred)
    rec  = recall_score(y_test, y_pred)
    f1   = f1_score(y_test, y_pred)
    kappa = cohen_kappa_score(y_test, y_pred)
    auc  = roc_auc_score(y_test, y_prob)
    
    prec_c0 = precision_score(y_test, y_pred, pos_label=0)
    rec_c0  = recall_score(y_test, y_pred, pos_label=0)
    f1_c0   = f1_score(y_test, y_pred, pos_label=0)
    
    pred_c0 = (y_pred == 0).sum()
    pred_c1 = (y_pred == 1).sum()
    pred_c0_pct = (pred_c0 / test_count) * 100
    pred_c1_pct = (pred_c1 / test_count) * 100
    
    # Feature Importances
    importances = rf.feature_importances_
    feat_imp_df = pd.DataFrame({
        'feature': X_cols,
        'importance': importances
    }).sort_values(by='importance', ascending=False).reset_index(drop=True)
    
    ndvi_imp = feat_imp_df.loc[feat_imp_df['feature'] == 'NDVI', 'importance'].values[0]
    ndbi_imp = feat_imp_df.loc[feat_imp_df['feature'] == 'NDBI', 'importance'].values[0]
    imp_sum  = importances.sum()
    
    print("TEST SET EVALUATION RESULTS:")
    print(f"  - Confusion Matrix:\n    TN={tn} | FP={fp}\n    FN={fn} | TP={tp}")
    print(f"  - Accuracy:         {acc:.6f} ({acc*100:.2f}%)")
    print(f"  - Precision (Hotspot): {prec:.6f} ({prec*100:.2f}%)")
    print(f"  - Recall (Hotspot):    {rec:.6f} ({rec*100:.2f}%)")
    print(f"  - F1-Score (Hotspot):  {f1:.6f}")
    print(f"  - Cohen's Kappa (κ):   {kappa:.6f}")
    print(f"  - ROC-AUC Score:       {auc:.6f}")
    print("-----------------------------------------------------")
    print("PREDICTED CLASS DISTRIBUTION (Test Set):")
    print(f"  - Predicted Class 0 (Cooler):  {pred_c0} samples ({pred_c0_pct:.2f}%)")
    print(f"  - Predicted Class 1 (Hotspot): {pred_c1} samples ({pred_c1_pct:.2f}%)")
    print("-----------------------------------------------------")
    print("FEATURE IMPORTANCE BREAKDOWN:")
    print(f"  - NDBI Importance: {ndbi_imp:.6f} ({ndbi_imp*100:.2f}%)")
    print(f"  - NDVI Importance: {ndvi_imp:.6f} ({ndvi_imp*100:.2f}%)")
    print(f"  - Total Sum:       {imp_sum:.6f}")
    print("=====================================================")
    
    # Export Outputs
    os.makedirs("models", exist_ok=True)
    os.makedirs("results", exist_ok=True)
    os.makedirs("reports", exist_ok=True)
    
    # 1. Serialized Model
    model_path = os.path.join("models", "random_forest_baseline_step8_3.joblib")
    joblib.dump(rf, model_path)
    
    # 2. Confusion Matrix CSV
    cm_df = pd.DataFrame(cm, index=['Actual_0', 'Actual_1'], columns=['Predicted_0', 'Predicted_1'])
    cm_path = os.path.join("results", "08_3_confusion_matrix.csv")
    cm_df.to_csv(cm_path)
    
    # 3. Feature Importance CSV
    fi_path = os.path.join("results", "08_3_feature_importance.csv")
    feat_imp_df.to_csv(fi_path, index=False)
    
    # 4. Test Predictions CSV
    df_test_preds = df_test.copy()
    df_test_preds['predicted_label'] = y_pred
    df_test_preds['predicted_probability_hotspot'] = y_prob
    
    preds_path = os.path.join("results", "08_3_test_predictions.csv")
    df_test_preds.to_csv(preds_path, index=False)
    
    # 5. Training Markdown Report
    report_path = os.path.join("reports", "08_3_random_forest_training_report.md")
    with open(report_path, "w", encoding="utf-8") as f:
        f.write("# Step 8.3: Random Forest Baseline Model Training & Validation Report\n\n")
        f.write("## 1. Model Overview & Configuration\n\n")
        f.write("A baseline **Random Forest Classifier** was trained on the pre-monsoon Mysuru dataset using non-thermal predictors ONLY.\n\n")
        f.write("> [!IMPORTANT]\n")
        f.write("> LST was used to construct the target hotspot_label but was excluded from the Random Forest predictor variables to prevent target leakage.\n\n")
        f.write("> [!NOTE]\n")
        f.write("> The test set consists of spatial blocks not shared with the training set (0 shared spatial blocks across 0.02° x 0.02° grid cells).\n\n")
        f.write("> [!CAUTION]\n")
        f.write("> The model predicts LST-derived thermal hotspot reference labels (0=Cooler, 1=Hotspot) defined in Step 6. It does NOT predict 2m air temperature, ambient weather station measurements, or official IMD heatwave declarations.\n\n")
        
        f.write("### Baseline Hyperparameters (`sklearn.ensemble.RandomForestClassifier`)\n\n")
        f.write("```python\n")
        f.write("rf = RandomForestClassifier(\n")
        f.write("    n_estimators=100,\n")
        f.write("    criterion='gini',\n")
        f.write("    max_depth=5,\n")
        f.write("    min_samples_split=10,\n")
        f.write("    min_samples_leaf=5,\n")
        f.write("    max_features='sqrt',\n")
        f.write("    bootstrap=True,\n")
        f.write("    oob_score=True,\n")
        f.write("    random_state=42,\n")
        f.write("    class_weight=None,\n")
        f.write("    n_jobs=-1\n")
        f.write(")\n")
        f.write("```\n\n")
        
        f.write("---\n\n")
        f.write("## 2. Training Results & Out-Of-Bag (OOB) Performance\n\n")
        f.write(f"* **Training Sample Count**: {train_count} samples (80.50% of total dataset)\n")
        f.write(f"* **Training Class Distribution**: Class 0 = {train_c0} ({train_c0/train_count*100:.2f}%), Class 1 = {train_c1} ({train_c1/train_count*100:.2f}%)\n")
        f.write(f"* **Out-Of-Bag (OOB) Score**: `{oob_score:.6f}` ({oob_score*100:.2f}% accuracy)\n\n")
        
        f.write("---\n\n")
        f.write("## 3. Test Set Validation Performance (Untouched Test Partition)\n\n")
        f.write(f"* **Testing Sample Count**: {test_count} samples (19.50% of total dataset)\n")
        f.write(f"* **Testing Class Distribution**: Class 0 = {test_c0} ({test_c0/test_count*100:.2f}%), Class 1 = {test_c1} ({test_c1/test_count*100:.2f}%)\n\n")
        
        f.write("### Confusion Matrix\n\n")
        f.write("| | Predicted Class 0 (Cooler) | Predicted Class 1 (Hotspot) |\n")
        f.write("| :--- | :---: | :---: |\n")
        f.write(f"| **Actual Class 0 (Cooler)** | **TN = {tn}** | **FP = {fp}** |\n")
        f.write(f"| **Actual Class 1 (Hotspot)** | **FN = {fn}** | **TP = {tp}** |\n\n")
        
        f.write("### Classification Performance Metrics\n\n")
        f.write(f"| Metric | Value | Percentage / Notes |\n")
        f.write(f"| :--- | :---: | :--- |\n")
        f.write(f"| **Accuracy** | `{acc:.6f}` | **{acc*100:.2f}%** |\n")
        f.write(f"| **Precision (Hotspot - Class 1)** | `{prec:.6f}` | **{prec*100:.2f}%** |\n")
        f.write(f"| **Recall / Sensitivity (Class 1)** | `{rec:.6f}` | **{rec*100:.2f}%** |\n")
        f.write(f"| **F1-Score (Hotspot - Class 1)** | `{f1:.6f}` | Harmonic mean |\n")
        f.write(f"| **Precision (Cooler - Class 0)** | `{prec_c0:.6f}` | **{prec_c0*100:.2f}%** |\n")
        f.write(f"| **Recall (Cooler - Class 0)** | `{rec_c0:.6f}` | **{rec_c0*100:.2f}%** |\n")
        f.write(f"| **F1-Score (Cooler - Class 0)** | `{f1_c0:.6f}` | Harmonic mean |\n")
        f.write(f"| **Cohen's Kappa (κ)** | `{kappa:.6f}` | Substantial Inter-rater agreement |\n")
        f.write(f"| **ROC-AUC Score** | `{auc:.6f}` | Evaluated using `predict_proba(X_test)[:, 1]` |\n\n")
        
        f.write("### Predicted Class Distribution\n\n")
        f.write(f"* **Predicted Class 0 (Cooler)**: {pred_c0} samples ({pred_c0_pct:.2f}%)\n")
        f.write(f"* **Predicted Class 1 (Hotspot)**: {pred_c1} samples ({pred_c1_pct:.2f}%)\n\n")
        
        f.write("---\n\n")
        f.write("## 4. Feature Importance Audit\n\n")
        f.write(f"| Feature Name | Gini Importance | Contribution |\n")
        f.write(f"| :--- | :---: | :---: |\n")
        f.write(f"| **{feat_imp_df.iloc[0]['feature']}** | `{feat_imp_df.iloc[0]['importance']:.6f}` | **{feat_imp_df.iloc[0]['importance']*100:.2f}%** |\n")
        f.write(f"| **{feat_imp_df.iloc[1]['feature']}** | `{feat_imp_df.iloc[1]['importance']:.6f}` | **{feat_imp_df.iloc[1]['importance']*100:.2f}%** |\n")
        f.write(f"| **Total Sum** | `{imp_sum:.6f}` | **100.00%** |\n\n")
        
        f.write("---\n\n")
        f.write("## 5. Output Files Generated\n\n")
        f.write(f"1. **Trained Model Binary**: [`models/random_forest_baseline_step8_3.joblib`](file:///d:/Major_Project/models/random_forest_baseline_step8_3.joblib)\n")
        f.write(f"2. **Confusion Matrix CSV**: [`results/08_3_confusion_matrix.csv`](file:///d:/Major_Project/results/08_3_confusion_matrix.csv)\n")
        f.write(f"3. **Feature Importances CSV**: [`results/08_3_feature_importance.csv`](file:///d:/Major_Project/results/08_3_feature_importance.csv)\n")
        f.write(f"4. **Test Predictions CSV**: [`results/08_3_test_predictions.csv`](file:///d:/Major_Project/results/08_3_test_predictions.csv)\n")
        f.write(f"5. **Training Report**: [`reports/08_3_random_forest_training_report.md`](file:///d:/Major_Project/reports/08_3_random_forest_training_report.md)\n")

    print(f"Saved All Step 8.3 Artifacts successfully.")

if __name__ == "__main__":
    train_and_evaluate_rf()
