import os
import rasterio
import numpy as np
import pandas as pd
from pathlib import Path
from typing import Dict, Any, Optional

from ..config import (
    DATA_STEP9_DIR, DATA_STEP10_DIR, RESULTS_STEP10_DIR,
    PERSISTENCE_AREAS_PATH, OBSERVATION_DATES
)
from ..schemas.responses import (
    ZonalStatisticsResponse, HotspotStatisticsResponse,
    PersistenceStatisticsResponse, PersistenceCategoryItem,
    GiStarStatisticsResponse, GiStarClusterItem
)

# Authoritative Landsat 30m Pixel Area in UTM Zone 43N: 30m x 30m = 900 m² = 0.0009 km²
PIXEL_AREA_KM2 = 0.0009

class StatisticsService:
    @staticmethod
    def _resolve_raster_path(layer: str, date: Optional[str] = None) -> Path:
        if layer in ["lst", "ndvi", "ndbi", "ref_label"]:
            if not date or date not in OBSERVATION_DATES:
                raise ValueError(f"Date '{date}' is invalid for layer '{layer}'")
            return DATA_STEP10_DIR / f"{layer}_30m_{date}.tif"

        elif layer in ["rf_prob", "rf_class"]:
            if not date or date not in OBSERVATION_DATES:
                raise ValueError(f"Date '{date}' is invalid for layer '{layer}'")
            return RESULTS_STEP10_DIR / f"{layer}_30m_{date}.tif"

        elif layer == "continuous_persistence":
            return RESULTS_STEP10_DIR / "continuous_persistence_30m.tif"

        elif layer == "categorical_persistence":
            return RESULTS_STEP10_DIR / "categorical_persistence_30m.tif"

        elif layer == "gi_star_statistic":
            return RESULTS_STEP10_DIR / "gi_star_statistic_30m.tif"

        elif layer == "gi_star_clustering":
            return RESULTS_STEP10_DIR / "gi_star_clustering_30m.tif"

        elif layer == "built_mask":
            return DATA_STEP9_DIR / "built_mask_30m.tif"

        else:
            raise ValueError(f"Unknown layer type '{layer}'")

    @staticmethod
    def get_zonal_statistics(layer: str, date: Optional[str] = None) -> ZonalStatisticsResponse:
        raster_path = StatisticsService._resolve_raster_path(layer, date)
        if not raster_path.exists():
            raise FileNotFoundError(f"Authoritative raster file missing: {raster_path}")

        with rasterio.open(raster_path) as src:
            arr = src.read(1)
            nodata_val = src.nodata

            if nodata_val is not None:
                mask = (arr != nodata_val) & (~np.isnan(arr))
            else:
                mask = ~np.isnan(arr)

            valid_arr = arr[mask]
            total_pixels = int(arr.size)
            valid_pixels = int(valid_arr.size)
            nodata_pixels = total_pixels - valid_pixels

            # Calculate pixel area in km² using 30m pixel resolution (0.0009 km²)
            area_km2 = float(valid_pixels * PIXEL_AREA_KM2)

            if valid_pixels > 0:
                min_val = float(np.min(valid_arr))
                max_val = float(np.max(valid_arr))
                mean_val = float(np.mean(valid_arr))
                std_val = float(np.std(valid_arr))
            else:
                min_val, max_val, mean_val, std_val = 0.0, 0.0, 0.0, 0.0

        return ZonalStatisticsResponse(
            layer=layer,
            date=date,
            min=round(min_val, 4),
            max=round(max_val, 4),
            mean=round(mean_val, 4),
            std=round(std_val, 4),
            valid_pixels=valid_pixels,
            nodata_pixels=nodata_pixels,
            total_pixels=total_pixels,
            area_km2=round(area_km2, 3)
        )

    @staticmethod
    def get_hotspot_statistics(date: str) -> HotspotStatisticsResponse:
        rf_class_path = RESULTS_STEP10_DIR / f"rf_class_30m_{date}.tif"
        if not rf_class_path.exists():
            raise FileNotFoundError(f"RF Class raster missing for date {date}: {rf_class_path}")

        with rasterio.open(rf_class_path) as src:
            arr = src.read(1)
            nodata_val = src.nodata
            if nodata_val is not None:
                valid_mask = (arr != nodata_val) & (~np.isnan(arr))
            else:
                valid_mask = ~np.isnan(arr)

            hotspot_count = int(np.sum((arr == 1) & valid_mask))
            non_hotspot_count = int(np.sum((arr == 0) & valid_mask))
            total_built = hotspot_count + non_hotspot_count

            hotspot_area = float(hotspot_count * PIXEL_AREA_KM2)
            non_hotspot_area = float(non_hotspot_count * PIXEL_AREA_KM2)
            total_built_area = float(total_built * PIXEL_AREA_KM2)
            hotspot_pct = (hotspot_count / total_built * 100.0) if total_built > 0 else 0.0

        return HotspotStatisticsResponse(
            date=date,
            total_built_pixels=total_built,
            hotspot_pixels=hotspot_count,
            non_hotspot_pixels=non_hotspot_count,
            hotspot_area_km2=round(hotspot_area, 3),
            non_hotspot_area_km2=round(non_hotspot_area, 3),
            total_built_area_km2=round(total_built_area, 3),
            hotspot_percentage=round(hotspot_pct, 2)
        )

    @staticmethod
    def get_persistence_statistics() -> PersistenceStatisticsResponse:
        if PERSISTENCE_AREAS_PATH.exists():
            df = pd.read_csv(PERSISTENCE_AREAS_PATH)
            categories = []
            total_area = float(df['area_km2_utm43n'].sum())
            color_map = {
                "Category 1: 0% Recurrence (Never Hotspot)": "#1e293b",
                "Category 2: >0-25% Recurrence (Low)": "#06b6d4",
                "Category 3: >25-50% Recurrence (Moderate)": "#facc15",
                "Category 4: >50-75% Recurrence (High)": "#fb923c",
                "Category 5: >75-100% Recurrence (Persistent / Chronic)": "#ef4444",
                # Fallback keys if short names used
                "None (0 obs)": "#1e293b",
                "Transient (1-2 obs)": "#facc15",
                "Moderate (3-4 obs)": "#fb923c",
                "Persistent (5-8 obs)": "#ef4444"
            }
            range_map = {
                "None (0 obs)": "0",
                "Transient (1-2 obs)": "1-2",
                "Moderate (3-4 obs)": "3-4",
                "Persistent (5-8 obs)": "5-8"
            }
            for _, row in df.iterrows():
                cat_name = str(row['category_name'])
                area = float(row['area_km2_utm43n'])
                pct = float(row['pct_of_valid_persistence_domain'])
                categories.append(PersistenceCategoryItem(
                    category=cat_name,
                    obs_count_range=range_map.get(cat_name, str(row.get('recurrence_range', 'N/A'))),
                    area_km2=round(area, 3),
                    percentage=round(pct, 2),
                    color_hex=color_map.get(cat_name, "#06b6d4")
                ))
            return PersistenceStatisticsResponse(
                total_built_area_km2=round(total_area, 3),
                categories=categories
            )

        # Fallback to raster computation
        raster_path = RESULTS_STEP10_DIR / "categorical_persistence_30m.tif"
        if not raster_path.exists():
            raise FileNotFoundError(f"Categorical persistence raster missing: {raster_path}")

        with rasterio.open(raster_path) as src:
            arr = src.read(1)
            valid_mask = arr != src.nodata if src.nodata is not None else ~np.isnan(arr)
            c0 = int(np.sum((arr == 0) & valid_mask))
            c1 = int(np.sum((arr == 1) & valid_mask))
            c2 = int(np.sum((arr == 2) & valid_mask))
            c3 = int(np.sum((arr == 3) & valid_mask))
            total = c0 + c1 + c2 + c3
            tot_area = total * PIXEL_AREA_KM2

            return PersistenceStatisticsResponse(
                total_built_area_km2=round(tot_area, 3),
                categories=[
                    PersistenceCategoryItem(category="None (0 obs)", obs_count_range="0", area_km2=round(c0*PIXEL_AREA_KM2, 3), percentage=round(c0/total*100, 2), color_hex="#1e293b"),
                    PersistenceCategoryItem(category="Transient (1-2 obs)", obs_count_range="1-2", area_km2=round(c1*PIXEL_AREA_KM2, 3), percentage=round(c1/total*100, 2), color_hex="#facc15"),
                    PersistenceCategoryItem(category="Moderate (3-4 obs)", obs_count_range="3-4", area_km2=round(c2*PIXEL_AREA_KM2, 3), percentage=round(c2/total*100, 2), color_hex="#fb923c"),
                    PersistenceCategoryItem(category="Persistent (5-8 obs)", obs_count_range="5-8", area_km2=round(c3*PIXEL_AREA_KM2, 3), percentage=round(c3/total*100, 2), color_hex="#ef4444")
                ]
            )

    @staticmethod
    def get_gi_star_statistics() -> GiStarStatisticsResponse:
        raster_path = RESULTS_STEP10_DIR / "gi_star_clustering_30m.tif"
        if not raster_path.exists():
            raise FileNotFoundError(f"Gi* clustering raster missing: {raster_path}")

        with rasterio.open(raster_path) as src:
            arr = src.read(1)
            valid_mask = arr != src.nodata if src.nodata is not None else ~np.isnan(arr)
            
            c_99 = int(np.sum((arr == 3) & valid_mask))
            c_95 = int(np.sum((arr == 2) & valid_mask))
            c_90 = int(np.sum((arr == 1) & valid_mask))
            c_ns = int(np.sum((arr == 0) & valid_mask))
            c_cs = int(np.sum((arr < 0) & valid_mask))
            total = c_99 + c_95 + c_90 + c_ns + c_cs
            tot_area = total * PIXEL_AREA_KM2

            return GiStarStatisticsResponse(
                total_built_area_km2=round(tot_area, 3),
                clusters=[
                    GiStarClusterItem(cluster_type="Hotspot 99% Confidence", confidence_level="99%", area_km2=round(c_99*PIXEL_AREA_KM2, 3), percentage=round(c_99/total*100, 2), color_hex="#990000"),
                    GiStarClusterItem(cluster_type="Hotspot 95% Confidence", confidence_level="95%", area_km2=round(c_95*PIXEL_AREA_KM2, 3), percentage=round(c_95/total*100, 2), color_hex="#d73027"),
                    GiStarClusterItem(cluster_type="Hotspot 90% Confidence", confidence_level="90%", area_km2=round(c_90*PIXEL_AREA_KM2, 3), percentage=round(c_90/total*100, 2), color_hex="#f46d43"),
                    GiStarClusterItem(cluster_type="Coldspot Cluster", confidence_level="90-99%", area_km2=round(c_cs*PIXEL_AREA_KM2, 3), percentage=round(c_cs/total*100, 2), color_hex="#4575b4"),
                    GiStarClusterItem(cluster_type="Not Significant", confidence_level="N/A", area_km2=round(c_ns*PIXEL_AREA_KM2, 3), percentage=round(c_ns/total*100, 2), color_hex="#1e293b")
                ]
            )
