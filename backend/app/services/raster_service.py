import os
import io
import hashlib
import numpy as np
import rasterio
from rasterio.transform import from_bounds as transform_from_bounds
from rasterio.windows import from_bounds as window_from_bounds
from PIL import Image
import matplotlib
import matplotlib.pyplot as plt
from pathlib import Path
from typing import Optional

from ..config import TILE_CACHE_DIR, DATA_STEP9_DIR, DATA_STEP10_DIR, RESULTS_STEP10_DIR, OBSERVATION_DATES
from ..utils.crs import tile_to_wgs84_bbox

class RasterService:
    # Authoritative WGS84 Spatial Grid for Mysuru Urban Study Area
    GRID_WEST = 76.55
    GRID_SOUTH = 12.20
    GRID_EAST = 76.78
    GRID_NORTH = 12.40
    GRID_WIDTH = 853
    GRID_HEIGHT = 742
    GRID_TRANSFORM = transform_from_bounds(GRID_WEST, GRID_SOUTH, GRID_EAST, GRID_NORTH, GRID_WIDTH, GRID_HEIGHT)

    @staticmethod
    def get_tile_png(layer: str, date_or_key: str, z: int, x: int, y: int) -> bytes:
        # Check LRU disk cache first with version prefix to invalidate stale empty tiles
        cache_key = f"v2_{layer}_{date_or_key}_{z}_{x}_{y}.png"
        cache_file = TILE_CACHE_DIR / cache_key
        if cache_file.exists():
            with open(cache_file, "rb") as f:
                return f.read()

        # Resolve GeoTIFF raster path
        raster_path = RasterService._resolve_raster_path(layer, date_or_key)
        if not raster_path.exists():
            raise FileNotFoundError(f"Raster file missing for layer '{layer}' and date/key '{date_or_key}': {raster_path}")

        # Calculate bounding box in WGS84
        min_lng, min_lat, max_lng, max_lat = tile_to_wgs84_bbox(z, x, y)

        # Read GeoTIFF window using Rasterio
        png_bytes = RasterService._render_tile_from_geotiff(raster_path, layer, min_lng, min_lat, max_lng, max_lat)

        # Save to disk cache
        try:
            with open(cache_file, "wb") as f:
                f.write(png_bytes)
        except Exception:
            pass  # Non-blocking cache write failure fallback

        return png_bytes

    @staticmethod
    def _resolve_raster_path(layer: str, date_or_key: str) -> Path:
        if layer in ["lst", "ndvi", "ndbi", "ref_label"]:
            return DATA_STEP10_DIR / f"{layer}_30m_{date_or_key}.tif"
        elif layer in ["rf_prob", "rf_class"]:
            return RESULTS_STEP10_DIR / f"{layer}_30m_{date_or_key}.tif"
        elif layer == "persistence":
            if date_or_key == "categorical":
                return RESULTS_STEP10_DIR / "categorical_persistence_30m.tif"
            return RESULTS_STEP10_DIR / "continuous_persistence_30m.tif"
        elif layer == "gi_star":
            if date_or_key == "clustering":
                return RESULTS_STEP10_DIR / "gi_star_clustering_30m.tif"
            return RESULTS_STEP10_DIR / "gi_star_statistic_30m.tif"
        elif layer == "built_mask":
            return DATA_STEP9_DIR / "built_mask_30m.tif"
        else:
            raise ValueError(f"Unsupported tile layer type '{layer}'")

    @staticmethod
    def _render_tile_from_geotiff(raster_path: Path, layer: str, min_lng: float, min_lat: float, max_lng: float, max_lat: float) -> bytes:
        west = RasterService.GRID_WEST
        south = RasterService.GRID_SOUTH
        east = RasterService.GRID_EAST
        north = RasterService.GRID_NORTH

        # Check if requested tile intersects the authoritative raster extent in WGS84
        if max_lng <= west or min_lng >= east or max_lat <= south or min_lat >= north:
            return RasterService._create_empty_transparent_png()

        # Window extraction using authoritative WGS84 geotransform
        window = window_from_bounds(min_lng, min_lat, max_lng, max_lat, transform=RasterService.GRID_TRANSFORM)

        resampling = rasterio.enums.Resampling.nearest if (layer in ["rf_class", "persistence", "gi_star", "built_mask"]) else rasterio.enums.Resampling.bilinear
        try:
            with rasterio.open(raster_path) as src:
                fill_val = np.nan if np.issubdtype(src.dtypes[0], np.floating) else (255 if src.dtypes[0] == np.uint8 else 0)
                arr = src.read(1, window=window, out_shape=(256, 256), resampling=resampling, boundless=True, fill_value=fill_val)
                nodata = src.nodata
        except Exception:
            return RasterService._create_empty_transparent_png()

        if arr is None or arr.size == 0:
            return RasterService._create_empty_transparent_png()

        # Mask NoData
        if np.issubdtype(arr.dtype, np.floating):
            valid_mask = ~np.isnan(arr) & ~np.isinf(arr) & (arr != -9999.0) & (arr > -9000.0)
        else:
            valid_mask = np.ones(arr.shape, dtype=bool)

        if arr.dtype == np.uint8:
            valid_mask = valid_mask & (arr != 255)

        if nodata is not None:
            valid_mask = valid_mask & (arr != nodata)

        if not np.any(valid_mask):
            return RasterService._create_empty_transparent_png()

        # Render RGBA image based on layer colormap
        rgba = np.zeros((256, 256, 4), dtype=np.uint8)

        if layer == "lst":
            # LST temperature scale: 30°C to 55°C
            norm = np.clip((arr - 30.0) / (55.0 - 30.0), 0.0, 1.0)
            cmap = matplotlib.colormaps['YlOrRd']
            colored = (cmap(norm) * 255).astype(np.uint8)
            rgba[valid_mask] = colored[valid_mask]
            rgba[~valid_mask] = [0, 0, 0, 0]

        elif layer == "ndvi":
            # NDVI scale: -0.2 to +0.8
            norm = np.clip((arr - (-0.2)) / (0.8 - (-0.2)), 0.0, 1.0)
            cmap = matplotlib.colormaps['YlGn']
            colored = (cmap(norm) * 255).astype(np.uint8)
            rgba[valid_mask] = colored[valid_mask]
            rgba[~valid_mask] = [0, 0, 0, 0]

        elif layer == "ndbi":
            # NDBI scale: -0.4 to +0.6
            norm = np.clip((arr - (-0.4)) / (0.6 - (-0.4)), 0.0, 1.0)
            cmap = matplotlib.colormaps['YlOrBr']
            colored = (cmap(norm) * 255).astype(np.uint8)
            rgba[valid_mask] = colored[valid_mask]
            rgba[~valid_mask] = [0, 0, 0, 0]

        elif layer == "rf_prob":
            # RF Probability: 0.0 to 1.0
            norm = np.clip(arr, 0.0, 1.0)
            cmap = matplotlib.colormaps['Reds']
            colored = (cmap(norm) * 255).astype(np.uint8)
            # Make low probabilities translucent
            alpha = (norm * 255).astype(np.uint8)
            colored[:, :, 3] = alpha
            rgba[valid_mask] = colored[valid_mask]
            rgba[~valid_mask] = [0, 0, 0, 0]

        elif layer == "rf_class":
            # Binary Hotspot Mask: 1 = Red (#dc2626), 0 = Transparent
            hotspot_mask = (arr == 1) & valid_mask
            rgba[hotspot_mask] = [220, 38, 38, 200]  # Crimson Red with 78% opacity
            rgba[~hotspot_mask] = [0, 0, 0, 0]

        elif layer == "persistence":
            if np.issubdtype(arr.dtype, np.floating):
                # Continuous Persistence: 0.0 to 1.0
                norm = np.clip(arr, 0.0, 1.0)
                cmap = matplotlib.colormaps['YlOrRd']
                colored = (cmap(norm) * 255).astype(np.uint8)
                rgba[valid_mask] = colored[valid_mask]
                rgba[~valid_mask] = [0, 0, 0, 0]
            else:
                # 5-Tier Categorical Persistence:
                # 5 = >75-100% Recurrence (Chronic / Persistent): Red #ef4444
                # 4 = >50-75% Recurrence (High): Orange #fb923c
                # 3 = >25-50% Recurrence (Moderate): Yellow #facc15
                # 2 = >0-25% Recurrence (Low): Cyan #06b6d4
                # 1 = 0% Recurrence (Never Hotspot): Subtle Slate #1e293b
                rgba[valid_mask & (arr == 5)] = [239, 68, 68, 220]    # Cat 5: Persistent (Red)
                rgba[valid_mask & (arr == 4)] = [251, 146, 60, 200]   # Cat 4: High (Orange)
                rgba[valid_mask & (arr == 3)] = [250, 204, 21, 180]   # Cat 3: Moderate (Yellow)
                rgba[valid_mask & (arr == 2)] = [6, 182, 212, 160]    # Cat 2: Low (Cyan)
                rgba[valid_mask & (arr == 1)] = [30, 41, 59, 100]     # Cat 1: Never Hotspot (Slate)
                rgba[~valid_mask | (arr == 0) | (arr == 255)] = [0, 0, 0, 0]

        elif layer == "gi_star":
            if np.issubdtype(arr.dtype, np.floating):
                # Continuous Gi* z-score: -2.0 to +4.0
                norm = np.clip((arr - (-2.0)) / (4.0 - (-2.0)), 0.0, 1.0)
                cmap = matplotlib.colormaps['RdYlBu_r']
                colored = (cmap(norm) * 255).astype(np.uint8)
                rgba[valid_mask] = colored[valid_mask]
                rgba[~valid_mask] = [0, 0, 0, 0]
            else:
                # Gi* Clusters: 1 = Significant Hotspot Cluster (Orange #f46d43), 0 = Not Significant (Transparent)
                rgba[valid_mask & (arr == 3)] = [153, 0, 0, 220]      # 99% Hotspot (Dark Red)
                rgba[valid_mask & (arr == 2)] = [215, 48, 39, 200]    # 95% Hotspot (Red)
                rgba[valid_mask & (arr == 1)] = [244, 109, 67, 200]   # Hotspot Cluster (Orange)
                rgba[valid_mask & (arr < 0)] = [69, 117, 180, 200]    # Coldspot (Blue)
                rgba[~valid_mask | (arr == 0) | (arr == 255)] = [0, 0, 0, 0]

        else:
            norm = np.clip(arr, 0.0, 1.0)
            cmap = matplotlib.colormaps['viridis']
            colored = (cmap(norm) * 255).astype(np.uint8)
            rgba[valid_mask] = colored[valid_mask]
            rgba[~valid_mask] = [0, 0, 0, 0]

        img = Image.fromarray(rgba, mode="RGBA")
        buf = io.BytesIO()
        img.save(buf, format="PNG", optimize=True)
        return buf.getvalue()

    @staticmethod
    def _create_empty_transparent_png() -> bytes:
        img = Image.new("RGBA", (256, 256), (0, 0, 0, 0))
        buf = io.BytesIO()
        img.save(buf, format="PNG")
        return buf.getvalue()
