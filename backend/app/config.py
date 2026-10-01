import os
from pathlib import Path

# Project Base Directory
BASE_DIR = Path(__file__).resolve().parent.parent.parent

# Data Paths
DATA_STEP9_DIR = BASE_DIR / "data" / "step9"
DATA_STEP10_DIR = BASE_DIR / "data" / "step10"
RESULTS_STEP10_DIR = BASE_DIR / "results" / "step10"
RESULTS_STEP10_9_DIR = BASE_DIR / "results" / "step10_9"
MODELS_DIR = BASE_DIR / "models"
TILE_CACHE_DIR = BASE_DIR / ".tile_cache"

# Model File
LOCKED_MODEL_PATH = MODELS_DIR / "random_forest_final_step10_8.joblib"
LOCKED_MODEL_METADATA_PATH = MODELS_DIR / "random_forest_final_step10_8_metadata.json"
LOCKED_METRICS_PATH = RESULTS_STEP10_9_DIR / "final_locked_evaluation_metrics.csv"
PERSISTENCE_AREAS_PATH = RESULTS_STEP10_DIR / "persistence_category_areas_utm43n.csv"

# Verified Observation Dates
OBSERVATION_DATES = [
    "2023-04-01",
    "2023-04-09",
    "2023-04-17",
    "2023-04-25",
    "2023-05-03",
    "2023-05-11",
    "2023-05-19",
    "2023-05-27"
]

# CORS Origins
CORS_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000"
]

# Ensure cache directory exists
os.makedirs(TILE_CACHE_DIR, exist_ok=True)
