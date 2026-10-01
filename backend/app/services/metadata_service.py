import os
import json
import hashlib
import pandas as pd
from pathlib import Path
from typing import Dict, Any, List

from ..config import (
    BASE_DIR, DATA_STEP10_DIR, RESULTS_STEP10_DIR, RESULTS_STEP10_9_DIR,
    LOCKED_MODEL_PATH, LOCKED_MODEL_METADATA_PATH, LOCKED_METRICS_PATH,
    OBSERVATION_DATES
)
from ..schemas.responses import MetadataResponse, ModelInfoResponse, LockedTestMetrics

class MetadataService:
    @staticmethod
    def get_project_metadata() -> MetadataResponse:
        sha256 = MetadataService._get_model_sha256()
        return MetadataResponse(
            project_title="Machine Learning-Based Urban Heat Hotspot Detection Using LST, NDVI and NDBI from Landsat Imagery",
            study_area="Mysuru, Karnataka, India",
            crs="EPSG:32643 (UTM Zone 43N)",
            bbox_wgs84=[76.50, 12.15, 76.75, 12.40],
            total_area_km2=461.50,
            built_area_km2=132.129,
            built_pixels_count=146810,
            observation_dates_count=len(OBSERVATION_DATES),
            locked_model_sha256=sha256
        )

    @staticmethod
    def get_observation_dates() -> List[Dict[str, str]]:
        satellites = [
            ("2023-04-01", "Landsat 9", "LC09_144051_20230401"),
            ("2023-04-09", "Landsat 8", "LC08_144051_20230409"),
            ("2023-04-17", "Landsat 9", "LC09_144051_20230417"),
            ("2023-04-25", "Landsat 8", "LC08_144051_20230425"),
            ("2023-05-03", "Landsat 9", "LC09_144051_20230503"),
            ("2023-05-11", "Landsat 8", "LC08_144051_20230511"),
            ("2023-05-19", "Landsat 9", "LC09_144051_20230519"),
            ("2023-05-27", "Landsat 8", "LC08_144051_20230527")
        ]
        return [{"date": d, "satellite": s, "scene_id": sc} for d, s, sc in satellites]

    @staticmethod
    def get_model_info() -> ModelInfoResponse:
        sha256 = MetadataService._get_model_sha256()

        # Read JSON metadata if available
        meta_dict = {}
        if LOCKED_MODEL_METADATA_PATH.exists():
            with open(LOCKED_MODEL_METADATA_PATH, "r", encoding="utf-8") as f:
                meta_dict = json.load(f)

        # Read CSV metrics if available
        acc = 0.866667
        prec = 0.865979
        rec = 0.865979
        f1 = 0.865979
        kappa = 0.733326
        roc_auc = 0.933673
        pr_auc = 0.936654
        brier = 0.105892
        cm = {"tn": 85, "fp": 13, "fn": 13, "tp": 84}

        if LOCKED_METRICS_PATH.exists():
            m_df = pd.read_csv(LOCKED_METRICS_PATH)
            r = m_df.iloc[0]
            acc = float(r['accuracy'])
            prec = float(r['precision'])
            rec = float(r['recall'])
            f1 = float(r['f1_score'])
            kappa = float(r['cohen_kappa'])
            roc_auc = float(r['roc_auc'])
            pr_auc = float(r['pr_auc'])
            brier = float(r['brier_score'])
            cm = {"tn": int(r['tn']), "fp": int(r['fp']), "fn": int(r['fn']), "tp": int(r['tp'])}

        return ModelInfoResponse(
            model_name="random_forest_final_step10_8",
            algorithm="RandomForestClassifier (100 Trees)",
            sha256=sha256,
            predictors=["NDVI", "NDBI"],
            target="LST-derived thermal hotspot reference labels",
            hyperparameters=meta_dict.get("hyperparameters", {
                "n_estimators": 100,
                "criterion": "gini",
                "max_depth": 5,
                "min_samples_split": 10,
                "min_samples_leaf": 5,
                "max_features": "sqrt",
                "bootstrap": True,
                "random_state": 42
            }),
            feature_importances={
                "NDBI": 0.610315,
                "NDVI": 0.389685
            },
            locked_test_metrics=LockedTestMetrics(
                accuracy=acc,
                precision=prec,
                recall=rec,
                f1_score=f1,
                cohen_kappa=kappa,
                roc_auc=roc_auc,
                pr_auc=pr_auc,
                brier_score=brier,
                confusion_matrix=cm
            )
        )

    @staticmethod
    def _get_model_sha256() -> str:
        if LOCKED_MODEL_PATH.exists():
            hasher = hashlib.sha256()
            with open(LOCKED_MODEL_PATH, "rb") as f:
                hasher.update(f.read())
            return hasher.hexdigest()
        return "4cb736e53c66c78dbbcbc1cf7ca3ac965af01f1c7fae829502649b018e127280"
