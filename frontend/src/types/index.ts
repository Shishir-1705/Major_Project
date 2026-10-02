export type LayerType = 
  | 'lst' 
  | 'ndvi' 
  | 'ndbi' 
  | 'rf_prob' 
  | 'rf_class' 
  | 'persistence' 
  | 'gi_star';

export interface ObservationDate {
  date: string;
  satellite: string;
  scene_id: string;
}

export interface DatesResponse {
  dates: ObservationDate[];
}

export interface LayerMetadata {
  id: LayerType;
  name: string;
  shortName?: string;
  category?: 'satellite' | 'ml' | 'spatial';
  type?: string;
  description: string;
  accentColor?: string;
  unit?: string;
  is_categorical?: boolean;
  isCategorical?: boolean;
  requires_date?: boolean;
  colormap?: string;
}

export interface LayersResponse {
  layers: LayerMetadata[];
}

export interface MetadataResponse {
  project_title: string;
  study_area: string;
  crs: string;
  bbox_wgs84: number[];
  total_area_km2: number;
  built_area_km2: number;
  built_pixels_count: number;
  observation_dates_count: number;
  locked_model_sha256: string;
}

export interface LockedTestMetrics {
  accuracy: number;
  precision: number;
  recall: number;
  f1_score: number;
  cohen_kappa: number;
  roc_auc: number;
  pr_auc: number;
  brier_score: number;
  confusion_matrix: {
    tn: number;
    fp: number;
    fn: number;
    tp: number;
  };
}

export interface ModelInfoResponse {
  model_name: string;
  algorithm: string;
  sha256: string;
  predictors: string[];
  target: string;
  hyperparameters: Record<string, any>;
  feature_importances: {
    NDBI: number;
    NDVI: number;
  };
  locked_test_metrics: LockedTestMetrics;
}

export type ModelMetadata = ModelInfoResponse;

export interface ZonalStatisticsResponse {
  layer: string;
  date?: string;
  min: number;
  max: number;
  mean: number;
  std: number;
  valid_pixels: number;
  nodata_pixels: number;
  total_pixels: number;
  area_km2: number;
}

export interface HotspotStatisticsResponse {
  date: string;
  total_built_pixels: number;
  hotspot_pixels: number;
  non_hotspot_pixels: number;
  hotspot_area_km2: number;
  non_hotspot_area_km2: number;
  total_built_area_km2: number;
  hotspot_percentage: number;
}

export interface PersistenceCategoryItem {
  category: string;
  obs_count_range: string;
  area_km2: number;
  percentage: number;
  color_hex: string;
}

export interface PersistenceStatisticsResponse {
  total_built_area_km2: number;
  categories: PersistenceCategoryItem[];
}

export interface GiStarClusterItem {
  cluster_type: string;
  confidence_level: string;
  area_km2: number;
  percentage: number;
  color_hex: string;
}

export interface GiStarStatisticsResponse {
  total_built_area_km2: number;
  clusters: GiStarClusterItem[];
}

export interface ToastMessage {
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  message: string;
  title?: string;
  duration?: number;
}
