import { ObservationDate, LayerMetadata, ModelMetadata } from '../types';

export const MYSURU_CENTER: [number, number] = [12.305, 76.655];
export const MYSURU_DEFAULT_ZOOM = 12;

// Verified Landsat Observation Dates (Step 10 Stage 1 Real Data)
export const OBSERVATION_DATES: ObservationDate[] = [
  { date: '2023-04-01', satellite: 'Landsat 9', scene_id: 'LC09_144051_20230401' },
  { date: '2023-04-09', satellite: 'Landsat 8', scene_id: 'LC08_144051_20230409' },
  { date: '2023-04-17', satellite: 'Landsat 9', scene_id: 'LC09_144051_20230417' },
  { date: '2023-04-25', satellite: 'Landsat 8', scene_id: 'LC08_144051_20230425' },
  { date: '2023-05-03', satellite: 'Landsat 9', scene_id: 'LC09_144051_20230503' },
  { date: '2023-05-11', satellite: 'Landsat 8', scene_id: 'LC08_144051_20230511' },
  { date: '2023-05-19', satellite: 'Landsat 9', scene_id: 'LC09_144051_20230519' },
  { date: '2023-05-27', satellite: 'Landsat 8', scene_id: 'LC08_144051_20230527' },
];

export const LAYERS: LayerMetadata[] = [
  {
    id: 'lst',
    name: 'Land Surface Temp (LST)',
    shortName: 'LST Map',
    category: 'satellite',
    description: 'Landsat 8/9 ST_B10 surface temperature (°C)',
    accentColor: '#f97316', // Reserved Thermal Accent
    unit: '°C',
    isCategorical: false,
  },
  {
    id: 'ndvi',
    name: 'Normalized Diff Vegetation (NDVI)',
    shortName: 'NDVI Vegetation',
    category: 'satellite',
    description: 'Vegetation canopy density (-0.2 to +0.8)',
    accentColor: '#10b981', // Emerald Green
    unit: 'Index',
    isCategorical: false,
  },
  {
    id: 'ndbi',
    name: 'Normalized Diff Built-up (NDBI)',
    shortName: 'NDBI Built-up',
    category: 'satellite',
    description: 'Built-up surface & pavement index (-0.4 to +0.6)',
    accentColor: '#a855f7', // Purple
    unit: 'Index',
    isCategorical: false,
  },
  {
    id: 'rf_prob',
    name: 'RF Hotspot Probability',
    shortName: 'ML Hotspot Prob',
    category: 'ml',
    description: 'Random Forest Class 1 probability gradient',
    accentColor: '#06b6d4', // Cyan
    unit: 'Prob',
    isCategorical: false,
  },
  {
    id: 'rf_class',
    name: 'RF Hotspot Classification',
    shortName: 'ML Hotspot Class',
    category: 'ml',
    description: 'Binary hotspot classification (1 = Hotspot)',
    accentColor: '#ef4444', // Red/Crimson
    isCategorical: true,
  },
  {
    id: 'persistence',
    name: 'Multi-Temporal Persistence',
    shortName: 'Heat Persistence',
    category: 'spatial',
    description: 'Categorical hotspot stability across 8 dates',
    accentColor: '#f59e0b', // Amber
    isCategorical: true,
  },
  {
    id: 'gi_star',
    name: 'Getis-Ord Gi* Clusters',
    shortName: 'Gi* Clusters',
    category: 'spatial',
    description: 'Spatial hotspot/coldspot clustering statistics',
    accentColor: '#0891b2', // Teal
    isCategorical: true,
  },
];

// Locked Model Metadata (Step 10.8 & 10.9 Verified)
export const LOCKED_MODEL_METADATA: ModelMetadata = {
  model_name: 'random_forest_final_step10_8',
  algorithm: 'RandomForestClassifier (100 Trees)',
  sha256: '4cb736e53c66c78dbbcbc1cf7ca3ac965af01f1c7fae829502649b018e127280',
  predictors: ['NDVI', 'NDBI'],
  target: 'LST-derived thermal hotspot reference labels',
  hyperparameters: {
    n_estimators: 100,
    criterion: 'gini',
    max_depth: 5,
    min_samples_split: 10,
    min_samples_leaf: 5,
    max_features: 'sqrt',
    random_state: 42,
  },
  locked_test_metrics: {
    accuracy: 0.866667,
    precision: 0.865979,
    recall: 0.865979,
    f1_score: 0.865979,
    cohen_kappa: 0.733326,
    roc_auc: 0.933673,
    pr_auc: 0.936654,
    brier_score: 0.105892,
    confusion_matrix: {
      tn: 85,
      fp: 13,
      fn: 13,
      tp: 84,
    },
  },
  feature_importances: {
    NDBI: 0.610315,
    NDVI: 0.389685,
  },
};

// Mysuru Approximate AOI Bounding Box Polygon Coordinates [lat, lng]
export const MYSURU_AOI_BOUNDS: [number, number][] = [
  [12.40, 76.50],
  [12.40, 76.75],
  [12.15, 76.75],
  [12.15, 76.50],
];
