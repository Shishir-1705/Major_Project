#!/usr/bin/env python3
"""
PROJECT: Machine Learning-Based Urban Heat Hotspot Detection Using LST, NDVI and NDBI from Landsat Imagery
STUDY AREA: Mysuru, Karnataka, India
STEP 10 (STAGE 2): Real Multi-Temporal Persistence, RF Comparison & Getis-Ord Gi* Analysis

PURPOSE:
1. Rebuild multi-temporal persistence pipeline strictly using real Landsat 8/9 Level-2 rasters from data/step10/real/.
2. Enforce authoritative built mask data/step9/built_mask_30m.tif (146,810 built pixels).
3. Completely eliminate all synthetic formulas (dist_from_center, microclimate_score, target_p_ref, np.random).
4. Compute date-specific P20(t) and P80(t) thresholds over valid built-up LST pixels.
5. Compute primary continuous persistence Pref(x) = Nhotspot(x) / Nclassified(x) for Nclassified(x) >= 4.
6. Classify persistence into 5 standard scientific categories (0%, >0-25%, >25-50%, >50-75%, >75-100%).
7. Perform secondary RF model spatial agreement evaluation using read-only baseline model models/random_forest_baseline_step8_3.joblib.
8. Perform Getis-Ord Gi* spatial autocorrelation analysis using 8-neighbor Queen contiguity and BH FDR correction (pFDR < 0.05).
9. Export results to results/step10/real/.
"""

import os
import sys
import joblib
import numpy as np
import pandas as pd
import tifffile
from scipy import stats

try:
    from pysal.explore import esda
    from libpysal.weights import Queen, DistanceBand
    HAS_PYSAL = True
except ImportError:
    HAS_PYSAL = False

try:
    import rasterio
    from rasterio.transform import from_bounds
    from rasterio.crs import CRS
    HAS_RASTERIO = True
except ImportError:
    HAS_RASTERIO = False

def save_geotiff(filename, array, transform=None, crs_epsg=None, nodata=-9999.0, dtype='float32'):
    """Save array as GeoTIFF."""
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    if HAS_RASTERIO and transform is not None:
        height, width = array.shape
        with rasterio.open(
            filename, 'w',
            driver='GTiff',
            height=height,
            width=width,
            count=1,
            dtype=dtype,
            crs=crs_epsg if crs_epsg else 'EPSG:32643',
            transform=transform,
            nodata=nodata
        ) as dst:
            dst.write(array.astype(dtype), 1)
    else:
        tifffile.imwrite(filename, array.astype(dtype))

def calculate_bh_fdr(p_values):
    """Calculates Benjamini-Hochberg FDR adjusted p-values."""
    n = len(p_values)
    sorted_indices = np.argsort(p_values)
    sorted_p = p_values[sorted_indices]
    
    adjusted_p = np.zeros(n)
    cum_min = 1.0
    for i in range(n - 1, -1, -1):
        rank = i + 1
        p_adj = sorted_p[i] * n / rank
        cum_min = min(cum_min, p_adj)
        adjusted_p[i] = cum_min
        
    rev_indices = np.zeros(n, dtype=int)
    rev_indices[sorted_indices] = np.arange(n)
    return adjusted_p[rev_indices]

def main():
    print("=" * 75)
    print("STEP 10 (STAGE 2): REAL MULTI-TEMPORAL PERSISTENCE & GI* PIPELINE")
    print("=" * 75)
    
    data_real_dir = os.path.join("data", "step10", "real")
    results_real_dir = os.path.join("results", "step10", "real")
    reports_dir = "reports"
    
    os.makedirs(results_real_dir, exist_ok=True)
    os.makedirs(reports_dir, exist_ok=True)
    
    # 1. Load Authoritative Step 9 Built Mask
    built_mask_path = os.path.join("data", "step9", "built_mask_30m.tif")
    if not os.path.exists(built_mask_path):
        raise FileNotFoundError(f"Authoritative Step 9 built mask not found at {built_mask_path}")
        
    built_mask = tifffile.imread(built_mask_path)
    height, width = built_mask.shape
    valid_built_indices = np.where(built_mask == 1)
    n_built = len(valid_built_indices[0])
    
    print(f"\n[1/7] Loaded Authoritative Built-up Mask: {built_mask_path}")
    print(f" -> Matrix Dimensions: {width} cols x {height} rows")
    print(f" -> Mapped Built Domain: {n_built:,} pixels ({n_built * 0.0009:.4f} km² in UTM 43N)")
    
    west, east = 76.55, 76.78
    south, north = 12.20, 12.40
    
    if HAS_RASTERIO:
        transform = from_bounds(west, south, east, north, width, height)
        crs_epsg = CRS.from_epsg(32643)
    else:
        transform, crs_epsg = None, None

    # 2. Load Read-Only Baseline Random Forest Model Binary
    model_path = os.path.join("models", "random_forest_baseline_step8_3.joblib")
    if not os.path.exists(model_path):
        raise FileNotFoundError(f"Trained Random Forest model binary missing at {model_path}")
        
    print(f"\n[2/7] Loading Fitted Read-Only Random Forest Baseline Model: {model_path}")
    rf_model = joblib.load(model_path)
    print(f" -> Model type: {type(rf_model).__name__}")
    print(f" -> Estimators: {rf_model.n_estimators}, Max Depth: {rf_model.max_depth}")
    
    # Target 8 Dates
    dates = [
        '2023-04-01', '2023-04-09', '2023-04-17', '2023-04-25',
        '2023-05-03', '2023-05-11', '2023-05-19', '2023-05-27'
    ]
    
    hotspot_count_grid = np.zeros((height, width), dtype=np.int16)
    cooler_count_grid = np.zeros((height, width), dtype=np.int16)
    classified_valid_count_grid = np.zeros((height, width), dtype=np.int16)
    
    date_inventory_rows = []
    rf_eval_rows = []
    
    print("\n[3/7] Processing Real Rasters for 8 Pre-Monsoon Dates...")
    
    for idx, d_str in enumerate(dates):
        lst_path = os.path.join(data_real_dir, f"lst_{d_str}.tif")
        ndvi_path = os.path.join(data_real_dir, f"ndvi_{d_str}.tif")
        ndbi_path = os.path.join(data_real_dir, f"ndbi_{d_str}.tif")
        valid_path = os.path.join(data_real_dir, f"valid_{d_str}.tif")
        
        if not os.path.exists(lst_path):
            raise FileNotFoundError(f"Real LST raster missing for date {d_str} at {lst_path}")
            
        lst_grid = tifffile.imread(lst_path)
        ndvi_grid = tifffile.imread(ndvi_path)
        ndbi_grid = tifffile.imread(ndbi_path)
        valid_mask_grid = tifffile.imread(valid_path) if os.path.exists(valid_path) else (lst_grid != -9999.0)
        
        # Valid built pixels for this date
        date_valid_built = (built_mask == 1) & (valid_mask_grid == 1) & (lst_grid != -9999.0) & (~np.isnan(lst_grid))
        valid_built_cnt = int(np.sum(date_valid_built))
        
        date_built_lst = lst_grid[date_valid_built]
        
        p20 = float(np.percentile(date_built_lst, 20))
        p80 = float(np.percentile(date_built_lst, 80))
        
        is_cooler = date_valid_built & (lst_grid <= p20)
        is_hotspot = date_valid_built & (lst_grid >= p80)
        
        ref_label_grid = np.full((height, width), 255, dtype=np.uint8)
        ref_label_grid[is_cooler] = 0
        ref_label_grid[is_hotspot] = 1
        
        hotspot_count_grid[is_hotspot] += 1
        cooler_count_grid[is_cooler] += 1
        classified_valid_count_grid[is_cooler | is_hotspot] += 1
        
        date_inventory_rows.append({
            'date': d_str,
            'valid_built_pixels': valid_built_cnt,
            'lst_min_c': round(float(np.min(date_built_lst)), 2),
            'lst_max_c': round(float(np.max(date_built_lst)), 2),
            'lst_mean_c': round(float(np.mean(date_built_lst)), 2),
            'lst_std_c': round(float(np.std(date_built_lst)), 2),
            'p20_c': round(p20, 2),
            'p80_c': round(p80, 2),
            'hotspot_pixels': int(np.sum(is_hotspot)),
            'cooler_pixels': int(np.sum(is_cooler))
        })
        
        # Secondary RF Model Prediction
        valid_built_idx = np.where(date_valid_built)
        X_date = pd.DataFrame({
            'NDVI': ndvi_grid[valid_built_idx],
            'NDBI': ndbi_grid[valid_built_idx]
        })
        
        probs_date = rf_model.predict_proba(X_date)[:, 1]
        preds_date = (probs_date >= 0.5).astype(np.uint8)
        
        rf_prob_grid = np.full((height, width), -9999.0, dtype=np.float32)
        rf_class_grid = np.full((height, width), 255, dtype=np.uint8)
        
        rf_prob_grid[valid_built_idx] = probs_date
        rf_class_grid[valid_built_idx] = preds_date
        
        # Save date-specific RF output rasters
        save_geotiff(os.path.join(results_real_dir, f"rf_prob_30m_{d_str}.tif"), rf_prob_grid, transform, crs_epsg, nodata=-9999.0, dtype='float32')
        save_geotiff(os.path.join(results_real_dir, f"rf_class_30m_{d_str}.tif"), rf_class_grid, transform, crs_epsg, nodata=255, dtype='uint8')
        
        # Full-Domain RF-to-LST-Reference Spatial Agreement
        classified_mask = (ref_label_grid == 0) | (ref_label_grid == 1)
        y_ref = ref_label_grid[classified_mask]
        y_pred = rf_class_grid[classified_mask]
        
        tp = int(np.sum((y_ref == 1) & (y_pred == 1)))
        tn = int(np.sum((y_ref == 0) & (y_pred == 0)))
        fp = int(np.sum((y_ref == 0) & (y_pred == 1)))
        fn = int(np.sum((y_ref == 1) & (y_pred == 0)))
        
        acc = (tp + tn) / len(y_ref)
        prec = tp / (tp + fp) if (tp + fp) > 0 else 0
        rec = tp / (tp + fn) if (tp + fn) > 0 else 0
        f1 = 2 * prec * rec / (prec + rec) if (prec + rec) > 0 else 0
        
        rf_eval_rows.append({
            'date': d_str,
            'eval_label': 'Full-Domain RF-to-LST-Reference Spatial Agreement',
            'classified_reference_pixels': len(y_ref),
            'tp': tp, 'tn': tn, 'fp': fp, 'fn': fn,
            'accuracy': round(acc, 6),
            'precision': round(prec, 6),
            'recall': round(rec, 6),
            'f1_score': round(f1, 6)
        })
        
        print(f" -> Date {d_str}: Valid Built={valid_built_cnt:,} | P20={p20:.2f}°C, P80={p80:.2f}°C | RF Agreement F1={f1:.4f}")
        
    df_date_inv = pd.DataFrame(date_inventory_rows)
    df_date_inv.to_csv(os.path.join(results_real_dir, "date_thresholds_inventory.csv"), index=False)
    
    df_rf_eval = pd.DataFrame(rf_eval_rows)
    df_rf_eval.to_csv(os.path.join(results_real_dir, "rf_vs_reference_metrics.csv"), index=False)
    
    # 4. Primary Multi-Temporal Persistence Calculation
    print("\n[4/7] Computing Primary Multi-Temporal Hotspot Persistence Domain...")
    
    valid_persistence_mask = (built_mask == 1) & (classified_valid_count_grid >= 4)
    n_persistence_pixels = int(np.sum(valid_persistence_mask))
    persistence_area_km2 = n_persistence_pixels * 0.0009
    
    print(f" -> Real Persistence Domain (Nclassified >= 4): {n_persistence_pixels:,} pixels ({persistence_area_km2:.4f} km²)")
    
    continuous_persistence_grid = np.full((height, width), -9999.0, dtype=np.float32)
    continuous_persistence_grid[valid_persistence_mask] = (
        hotspot_count_grid[valid_persistence_mask] / classified_valid_count_grid[valid_persistence_mask]
    )
    
    # Categorical Persistence Classification
    categorical_persistence_grid = np.full((height, width), 255, dtype=np.uint8)
    
    pref_vals = continuous_persistence_grid[valid_persistence_mask]
    cat_vals = np.zeros(n_persistence_pixels, dtype=np.uint8)
    
    c1_mask = pref_vals == 0.0
    c2_mask = (pref_vals > 0.0) & (pref_vals <= 0.25)
    c3_mask = (pref_vals > 0.25) & (pref_vals <= 0.50)
    c4_mask = (pref_vals > 0.50) & (pref_vals <= 0.75)
    c5_mask = (pref_vals > 0.75) & (pref_vals <= 1.00)
    
    cat_vals[c1_mask] = 1
    cat_vals[c2_mask] = 2
    cat_vals[c3_mask] = 3
    cat_vals[c4_mask] = 4
    cat_vals[c5_mask] = 5
    
    categorical_persistence_grid[valid_persistence_mask] = cat_vals
    
    category_summary = [
        {'category_id': 1, 'category_name': '0% (Non-Hotspot)', 'pixel_count': int(np.sum(c1_mask)), 'area_km2': round(int(np.sum(c1_mask)) * 0.0009, 4), 'pct_of_domain': round(int(np.sum(c1_mask))/n_persistence_pixels*100, 2)},
        {'category_id': 2, 'category_name': '>0–25% (Infrequent)', 'pixel_count': int(np.sum(c2_mask)), 'area_km2': round(int(np.sum(c2_mask)) * 0.0009, 4), 'pct_of_domain': round(int(np.sum(c2_mask))/n_persistence_pixels*100, 2)},
        {'category_id': 3, 'category_name': '>25–50% (Moderate)', 'pixel_count': int(np.sum(c3_mask)), 'area_km2': round(int(np.sum(c3_mask)) * 0.0009, 4), 'pct_of_domain': round(int(np.sum(c3_mask))/n_persistence_pixels*100, 2)},
        {'category_id': 4, 'category_name': '>50–75% (Frequent)', 'pixel_count': int(np.sum(c4_mask)), 'area_km2': round(int(np.sum(c4_mask)) * 0.0009, 4), 'pct_of_domain': round(int(np.sum(c4_mask))/n_persistence_pixels*100, 2)},
        {'category_id': 5, 'category_name': '>75–100% (Persistent)', 'pixel_count': int(np.sum(c5_mask)), 'area_km2': round(int(np.sum(c5_mask)) * 0.0009, 4), 'pct_of_domain': round(int(np.sum(c5_mask))/n_persistence_pixels*100, 2)}
    ]
    
    df_cat = pd.DataFrame(category_summary)
    df_cat.to_csv(os.path.join(results_real_dir, "persistence_category_areas_utm43n.csv"), index=False)
    
    print(df_cat.to_string())
    
    # Save real persistence rasters
    save_geotiff(os.path.join(results_real_dir, "continuous_persistence_30m.tif"), continuous_persistence_grid, transform, crs_epsg, nodata=-9999.0, dtype='float32')
    save_geotiff(os.path.join(results_real_dir, "categorical_persistence_30m.tif"), categorical_persistence_grid, transform, crs_epsg, nodata=255, dtype='uint8')
    save_geotiff(os.path.join(results_real_dir, "classified_obs_count_30m.tif"), classified_valid_count_grid, transform, crs_epsg, nodata=0, dtype='int16')

    # 5. Getis-Ord Gi* Spatial Autocorrelation Analysis
    print("\n[5/7] Executing Getis-Ord Gi* Spatial Autocorrelation Analysis...")
    
    gi_star_stat_grid = np.full((height, width), -9999.0, dtype=np.float32)
    gi_star_p_raw_grid = np.full((height, width), -9999.0, dtype=np.float32)
    gi_star_p_fdr_grid = np.full((height, width), -9999.0, dtype=np.float32)
    gi_star_class_grid = np.full((height, width), 255, dtype=np.uint8)  # 255 NoData, 0 Not Sig, 1 Hotspot (+), 2 Coldspot (-)
    
    p_indices = np.where(valid_persistence_mask)
    p_rows, p_cols = p_indices[0], p_indices[1]
    p_vals = pref_vals
    
    # Compute local spatial statistics over Queen 8-neighbor window
    mean_pref = np.mean(p_vals)
    std_pref = np.std(p_vals)
    n_nodes = len(p_vals)
    
    # Queen 8-neighbor spatial weights
    gi_stats = np.zeros(n_nodes)
    
    # Fast vectorized grid neighborhood for 3x3 window
    pad_pref = np.pad(continuous_persistence_grid, 1, mode='constant', constant_values=np.nan)
    
    sum_w_x = np.zeros(n_nodes)
    sum_w = np.zeros(n_nodes)
    sum_w2 = np.zeros(n_nodes)
    
    for dr in [-1, 0, 1]:
        for dc in [-1, 0, 1]:
            neighbor_vals = pad_pref[p_rows + 1 + dr, p_cols + 1 + dc]
            valid_n = ~np.isnan(neighbor_vals) & (neighbor_vals != -9999.0)
            
            sum_w_x += np.where(valid_n, neighbor_vals, 0.0)
            sum_w += valid_n.astype(float)
            sum_w2 += valid_n.astype(float) # w_ij = 1 binary
            
    S = np.sqrt(np.sum((p_vals - mean_pref)**2) / n_nodes)
    numerator = sum_w_x - mean_pref * sum_w
    denominator = S * np.sqrt((n_nodes * sum_w2 - sum_w**2) / (n_nodes - 1))
    
    gi_stats = np.where(denominator > 0, numerator / denominator, 0.0)
    p_raw = 2.0 * (1.0 - stats.norm.cdf(np.abs(gi_stats)))
    p_fdr = calculate_bh_fdr(p_raw)
    
    gi_class = np.zeros(n_nodes, dtype=np.uint8)  # 0 Not Significant
    gi_class[(p_fdr < 0.05) & (gi_stats > 0)] = 1  # Hotspot cluster
    gi_class[(p_fdr < 0.05) & (gi_stats < 0)] = 2  # Coldspot cluster
    
    gi_star_stat_grid[valid_persistence_mask] = gi_stats
    gi_star_p_raw_grid[valid_persistence_mask] = p_raw
    gi_star_p_fdr_grid[valid_persistence_mask] = p_fdr
    gi_star_class_grid[valid_persistence_mask] = gi_class
    
    n_sig_hotspots = int(np.sum(gi_class == 1))
    n_sig_coldspots = int(np.sum(gi_class == 2))
    n_not_sig = int(np.sum(gi_class == 0))
    
    gi_summary = [
        {'cluster_type': 'Significant Hotspot (Gi* > 0, pFDR < 0.05)', 'pixel_count': n_sig_hotspots, 'area_km2': round(n_sig_hotspots * 0.0009, 4), 'pct_domain': round(n_sig_hotspots / n_nodes * 100, 2)},
        {'cluster_type': 'Significant Coldspot (Gi* < 0, pFDR < 0.05)', 'pixel_count': n_sig_coldspots, 'area_km2': round(n_sig_coldspots * 0.0009, 4), 'pct_domain': round(n_sig_coldspots / n_nodes * 100, 2)},
        {'cluster_type': 'Not Significant (pFDR >= 0.05)', 'pixel_count': n_not_sig, 'area_km2': round(n_not_sig * 0.0009, 4), 'pct_domain': round(n_not_sig / n_nodes * 100, 2)}
    ]
    
    df_gi = pd.DataFrame(gi_summary)
    df_gi.to_csv(os.path.join(results_real_dir, "gi_star_summary_statistics.csv"), index=False)
    print(df_gi.to_string())
    
    save_geotiff(os.path.join(results_real_dir, "gi_star_statistic_30m.tif"), gi_star_stat_grid, transform, crs_epsg, nodata=-9999.0, dtype='float32')
    save_geotiff(os.path.join(results_real_dir, "gi_star_pvalue_fdr_30m.tif"), gi_star_p_fdr_grid, transform, crs_epsg, nodata=-9999.0, dtype='float32')
    save_geotiff(os.path.join(results_real_dir, "gi_star_clustering_30m.tif"), gi_star_class_grid, transform, crs_epsg, nodata=255, dtype='uint8')

    print("\n=" * 75)
    print("STAGE 2 REAL MULTI-TEMPORAL PERSISTENCE & GI* ANALYSIS COMPLETE")
    print("=" * 75)

if __name__ == "__main__":
    main()
