from pydantic import BaseModel, Field
from typing import List, Dict, Optional, Any

class ObservationDateItem(BaseModel):
    date: str
    satellite: str
    scene_id: str

class DatesResponse(BaseModel):
    dates: List[ObservationDateItem]

class LayerMetadataItem(BaseModel):
    id: str
    name: str
    type: str
    description: str
    unit: Optional[str] = None
    is_categorical: bool
    requires_date: bool
    colormap: str

class LayersResponse(BaseModel):
    layers: List[LayerMetadataItem]

class MetadataResponse(BaseModel):
    project_title: str
    study_area: str
    crs: str
    bbox_wgs84: List[float]
    total_area_km2: float
    built_area_km2: float
    built_pixels_count: int
    observation_dates_count: int
    locked_model_sha256: str

class LockedTestMetrics(BaseModel):
    accuracy: float
    precision: float
    recall: float
    f1_score: float
    cohen_kappa: float
    roc_auc: float
    pr_auc: float
    brier_score: float
    confusion_matrix: Dict[str, int]

class ModelInfoResponse(BaseModel):
    model_name: str
    algorithm: str
    sha256: str
    predictors: List[str]
    target: str
    hyperparameters: Dict[str, Any]
    feature_importances: Dict[str, float]
    locked_test_metrics: LockedTestMetrics

class ZonalStatisticsResponse(BaseModel):
    layer: str
    date: Optional[str] = None
    min: float
    max: float
    mean: float
    std: float
    valid_pixels: int
    nodata_pixels: int
    total_pixels: int
    area_km2: float

class HotspotStatisticsResponse(BaseModel):
    date: str
    total_built_pixels: int
    hotspot_pixels: int
    non_hotspot_pixels: int
    hotspot_area_km2: float
    non_hotspot_area_km2: float
    total_built_area_km2: float
    hotspot_percentage: float

class PersistenceCategoryItem(BaseModel):
    category: str
    obs_count_range: str
    area_km2: float
    percentage: float
    color_hex: str

class PersistenceStatisticsResponse(BaseModel):
    total_built_area_km2: float
    categories: List[PersistenceCategoryItem]

class GiStarClusterItem(BaseModel):
    cluster_type: str
    confidence_level: str
    area_km2: float
    percentage: float
    color_hex: str

class GiStarStatisticsResponse(BaseModel):
    total_built_area_km2: float
    clusters: List[GiStarClusterItem]
