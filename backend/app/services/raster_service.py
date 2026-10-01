import os
import io
import hashlib
import numpy as np
import rasterio
from rasterio.windows import from_bounds
from PIL import Image
import matplotlib.pyplot as plt
import matplotlib.cm as cm
from pathlib import Path
from typing import Optional

from ..config import TILE_CACHE_DIR, DATA_STEP9_DIR, DATA_STEP10_DIR, RESULTS_STEP10_DIR, OBSERVATION_DATES
from ..utils.crs import tile_to_target_crs_bbox

class RasterService:
    @staticmethod
    def get_tile_png(layer: str, date_or_key: str, z: int, x: int, y: int) -> bytes:
        # Check LRU disk cache first
        cache_key = f"{layer}_{date_or_key}_{z}_{x}_{y}.png"
        cache_file = TILE_CACHE_DIR / cache_key
        if cache_file.exists():
            with open(cache_file, "rb") as f:
                return f.read()

        # Resolve GeoTIFF raster path
        raster_path = RasterService._resolve_raster_path(layer, date_or_key)
        if not raster_path.exists():
            raise FileNotFoundError(f"Raster file missing for layer '{layer}' and date/key '{date_or_key}': {raster_path}")

        # Calculate bounding box in EPSG:32643
        min_x, min_y, max_x, max_y = tile_to_target_crs_bbox(z, x, y)

        # Read GeoTIFF window using Rasterio
        png_bytes = RasterService._render_tile_from_geotiff(raster_path, layer, min_x, min_y, max_x, max_y)

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
    def _render_tile_from_geotiff(raster_path: Path, layer: str, min_x: float, min_y: float, max_x: float, max_y: float) -> bytes:
        with rasterio.open(raster_path) as src:
            bounds = src.bounds
            
            # Check if tile intersects raster extent
            if (max_x < bounds.left or min_x > bounds.right or max_y < bounds.bottom or min_y > bounds.top):
                return RasterService._create_empty_transparent_png()

            # Window extraction
            window = from_bounds(min_x, min_y, max_x, max_y, transform=src.transform)
            
            try:
                arr = src.read(1, window=window, out_shape=(256, 256), resampling=rasterio.enums.Resampling.bilinear)
            except Exception:
                return RasterService._create_empty_transparent_png()

            nodata = src.nodata

        if arr is None or arr.size == 0:
            return RasterService._create_empty_transparent_png()

        # Mask NoData
        if nodata is not None:
            valid_mask = (arr != nodata) & (~np.isnan(arr))
        else:
            valid_mask = ~np.isnan(arr)

        if not np.any(valid_mask):
            return RasterService._create_empty_transparent_png()

        # Render RGBA image based on layer colormap
        rgba = np.zeros((256, 256, 4), dtype=np.uint8)

        if layer == "lst":
            # LST temperature scale: 30°C to 55°C
            norm = np.clip((arr - 30.0) / (55.0 - 30.0), 0.0, 1.0)
            cmap = cm.get_cmap('YlOrRd')
            colored = (cmap(norm) * 255).astype(np.uint8)
            rgba[valid_mask] = colored[valid_mask]
            rgba[~valid_mask] = [0, 0, 0, 0]

        elif layer == "ndvi":
            # NDVI scale: -0.2 to +0.8
            norm = np.clip((arr - (-0.2)) / (0.8 - (-0.2)), 0.0, 1.0)
            cmap = cm.get_cmap('YlGn')
            colored = (cmap(norm) * 255).astype(np.uint8)
            rgba[valid_mask] = colored[valid_mask]
            rgba[~valid_mask] = [0, 0, 0, 0]

        elif layer == "ndbi":
            # NDBI scale: -0.4 to +0.6
            norm = np.clip((arr - (-0.4)) / (0.6 - (-0.4)), 0.0, 1.0)
            cmap = cm.get_cmap('YlOrBr')
            colored = (cmap(norm) * 255).astype(np.uint8)
            rgba[valid_mask] = colored[valid_mask]
            rgba[~valid_mask] = [0, 0, 0, 0]

        elif layer == "rf_prob":
            # RF Probability: 0.0 to 1.0
            norm = np.clip(arr, 0.0, 1.0)
            cmap = cm.get_cmap('Reds')
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
            # Categorical Persistence: 0=None, 1=Transient, 2=Moderate, 3=Persistent
            rgba[valid_mask & (arr == 3)] = [239, 68, 68, 220]    # Persistent (Red)
            rgba[valid_mask & (arr == 2)] = [251, 146, 60, 200]   # Moderate (Orange)
            rgba[valid_mask & (arr == 1)] = [250, 204, 21, 180]   # Transient (Yellow)
            rgba[~valid_mask | (arr == 0)] = [0, 0, 0, 0]

        elif layer == "gi_star":
            # Gi* Clusters: 3=99% Hotspot, 2=95% Hotspot, 1=90% Hotspot, -1=Coldspot
            rgba[valid_mask & (arr == 3)] = [153, 0, 0, 220]      # 99% Hotspot (Dark Red)
            rgba[valid_mask & (arr == 2)] = [215, 48, 39, 200]    # 95% Hotspot (Red)
            rgba[valid_mask & (arr == 1)] = [244, 109, 67, 180]   # 90% Hotspot (Orange)
            rgba[valid_mask & (arr < 0)] = [69, 117, 180, 200]    # Coldspot (Blue)
            rgba[~valid_mask | (arr == 0)] = [0, 0, 0, 0]

        else:
            norm = np.clip(arr, 0.0, 1.0)
            cmap = cm.get_cmap('viridis')
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
