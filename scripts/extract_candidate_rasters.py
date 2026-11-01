#!/usr/bin/env python3
"""
PROJECT: Machine Learning-Based Urban Heat Hotspot Detection Using LST, NDVI and NDBI from Landsat Imagery
STUDY AREA: Mysuru, Karnataka, India
SCRIPT: 10_extract_candidate_rasters.py

PURPOSE:
Extract genuine, satellite-derived LST, NDVI, NDBI, and VALID mask GeoTIFF rasters
from USGS Landsat 8/9 Level-2 Tier 1 collections via Google Earth Engine API v1.0+.
Candidate rasters are staged in data/step10/real/ without modifying production artifacts.

Target Dates (8 verified pre-monsoon Landsat acquisitions):
- 2023-04-01 (Landsat 9)
- 2023-04-09 (Landsat 8)
- 2023-04-17 (Landsat 9)
- 2023-04-25 (Landsat 8)
- 2023-05-03 (Landsat 9)
- 2023-05-11 (Landsat 8)
- 2023-05-19 (Landsat 9)
- 2023-05-27 (Landsat 8)

Authoritative Grid:
- CRS: EPSG:4326 (WGS 84)
- Extent: West=76.55, South=12.20, East=76.78, North=12.40
- Dimensions: 853 cols x 742 rows
- Spatial Resolution: ~30 m (0.00026963657678780775 x -0.00026954177897574125 deg)
"""

import os
import sys
import io
import time
import hashlib
import numpy as np
import rasterio
from rasterio.transform import from_bounds
from rasterio.crs import CRS
import ee

# Configuration
WEST, SOUTH, EAST, NORTH = 76.55, 12.20, 76.78, 12.40
WIDTH, HEIGHT = 853, 742
AFFINE_TRANSFORM = from_bounds(WEST, SOUTH, EAST, NORTH, WIDTH, HEIGHT)
CRS_EPSG = CRS.from_epsg(4326)

DATES = [
    '2023-04-01',
    '2023-04-09',
    '2023-04-17',
    '2023-04-25',
    '2023-05-03',
    '2023-05-11',
    '2023-05-19',
    '2023-05-27'
]

OUTPUT_DIR = os.path.join("data", "step10", "real")

def get_sha256(filepath):
    """Compute SHA-256 hash of a file."""
    h = hashlib.sha256()
    with open(filepath, "rb") as f:
        while chunk := f.read(65536):
            h.update(chunk)
    return h.hexdigest()

def process_and_export_date(d_str):
    """Extract LST, NDVI, NDBI, and VALID rasters for a single date."""
    t0 = time.time()
    print(f"\n[{d_str}] Processing scene...")
    
    aoi = ee.Geometry.Polygon([[[WEST, NORTH], [EAST, NORTH], [EAST, SOUTH], [WEST, SOUTH], [WEST, NORTH]]])
    
    # Query Tier 1 Level-2 collections
    l8 = ee.ImageCollection("LANDSAT/LC08/C02/T1_L2").filterBounds(aoi).filter(ee.Filter.eq('WRS_PATH', 144)).filter(ee.Filter.eq('WRS_ROW', 51))
    l9 = ee.ImageCollection("LANDSAT/LC09/C02/T1_L2").filterBounds(aoi).filter(ee.Filter.eq('WRS_PATH', 144)).filter(ee.Filter.eq('WRS_ROW', 51))
    merged = l8.merge(l9)
    
    d_next = ee.Date(d_str).advance(1, 'day')
    sub = merged.filterDate(d_str, d_next)
    count = sub.size().getInfo()
    if count == 0:
        raise RuntimeError(f"No scene found for date {d_str} in Path 144 Row 51!")
        
    scene = ee.Image(sub.first())
    scene_id = scene.get('LANDSAT_SCENE_ID').getInfo()
    spacecraft = scene.get('SPACECRAFT_ID').getInfo()
    print(f" -> Found: {scene_id} ({spacecraft})")
    
    # Footprint mask (valid pixels within Landsat swath)
    footprint = scene.select('QA_PIXEL').mask().gt(0)
    
    # Clear mask from QA_PIXEL:
    # Bit 0 = Fill
    # Bit 1 = Dilated Cloud
    # Bit 2 = Cirrus
    # Bit 3 = Cloud
    # Bit 4 = Cloud Shadow
    # Bit 5 = Snow
    qa = scene.select('QA_PIXEL')
    qa_clear = qa.bitwiseAnd(1 << 0).eq(0) \
        .And(qa.bitwiseAnd(1 << 1).eq(0)) \
        .And(qa.bitwiseAnd(1 << 2).eq(0)) \
        .And(qa.bitwiseAnd(1 << 3).eq(0)) \
        .And(qa.bitwiseAnd(1 << 4).eq(0)) \
        .And(qa.bitwiseAnd(1 << 5).eq(0)) \
        .And(footprint)
        
    # Thermal Surface Temperature (Band 10) in Celsius
    # Scale: 0.00341802, Offset: 149.0 (Kelvin) -> Celsius: -273.15
    st_b10 = scene.select('ST_B10')
    lst_celsius = st_b10.multiply(0.00341802).add(149.0).subtract(273.15).toFloat()
    lst_valid = st_b10.gt(0).And(qa_clear)
    
    # Optical Surface Reflectance Bands
    # Scale: 0.0000275, Offset: -0.2
    sr_b4 = scene.select('SR_B4').multiply(0.0000275).add(-0.2)
    sr_b5 = scene.select('SR_B5').multiply(0.0000275).add(-0.2)
    sr_b6 = scene.select('SR_B6').multiply(0.0000275).add(-0.2)
    
    ndvi_denom = sr_b5.add(sr_b4)
    ndbi_denom = sr_b6.add(sr_b5)
    
    # Physical validity constraints: reflectance >= 0 and denominator > 0.0001
    ndvi_valid = sr_b5.gte(0).And(sr_b4.gte(0)).And(ndvi_denom.gt(0.0001)).And(qa_clear)
    ndbi_valid = sr_b6.gte(0).And(sr_b5.gte(0)).And(ndbi_denom.gt(0.0001)).And(qa_clear)
    
    ndvi = sr_b5.subtract(sr_b4).divide(ndvi_denom).toFloat()
    ndbi = sr_b6.subtract(sr_b5).divide(ndbi_denom).toFloat()
    
    # Comprehensive valid mask: all 3 products valid and clear
    all_valid = lst_valid.And(ndvi_valid).And(ndbi_valid)
    
    # Output rasters with NoData=-9999.0 for continuous float, 0 for binary mask
    lst_out = ee.Image(-9999.0).toFloat().where(all_valid, lst_celsius)
    ndvi_out = ee.Image(-9999.0).toFloat().where(all_valid, ndvi)
    ndbi_out = ee.Image(-9999.0).toFloat().where(all_valid, ndbi)
    valid_out = all_valid.toUint8()
    
    stack = ee.Image.cat([lst_out, ndvi_out, ndbi_out, valid_out])
    
    # Server-side computation directly to target 853x742 EPSG:4326 grid
    params = {
        'expression': stack,
        'fileFormat': 'GEO_TIFF',
        'grid': {
            'crsCode': 'EPSG:4326',
            'affineTransform': {
                'scaleX': AFFINE_TRANSFORM.a,
                'shearX': AFFINE_TRANSFORM.b,
                'translateX': AFFINE_TRANSFORM.c,
                'shearY': AFFINE_TRANSFORM.d,
                'scaleY': AFFINE_TRANSFORM.e,
                'translateY': AFFINE_TRANSFORM.f
            },
            'dimensions': {'width': WIDTH, 'height': HEIGHT}
        }
    }
    
    print(f" -> Downloading server-side 4-band GeoTIFF via computePixels...")
    raw_bytes = ee.data.computePixels(params)
    
    with rasterio.open(io.BytesIO(raw_bytes)) as src:
        lst_arr = src.read(1)
        ndvi_arr = src.read(2)
        ndbi_arr = src.read(3)
        valid_arr = src.read(4)
        
    # Write separate candidate GeoTIFFs
    layers = [
        (f"lst_{d_str}.tif", lst_arr.astype(np.float32), -9999.0, 'float32'),
        (f"ndvi_{d_str}.tif", ndvi_arr.astype(np.float32), -9999.0, 'float32'),
        (f"ndbi_{d_str}.tif", ndbi_arr.astype(np.float32), -9999.0, 'float32'),
        (f"valid_{d_str}.tif", valid_arr.astype(np.uint8), 0, 'uint8')
    ]
    
    res = {}
    for fname, arr, nodata_val, dtype_str in layers:
        fpath = os.path.join(OUTPUT_DIR, fname)
        profile = {
            'driver': 'GTiff',
            'height': HEIGHT,
            'width': WIDTH,
            'count': 1,
            'dtype': dtype_str,
            'crs': CRS_EPSG,
            'transform': AFFINE_TRANSFORM,
            'nodata': nodata_val,
            'compress': 'lzw'
        }
        with rasterio.open(fpath, 'w', **profile) as dst:
            dst.write(arr, 1)
            
        sha = get_sha256(fpath)
        fsize = os.path.getsize(fpath)
        res[fname] = {'sha256': sha, 'size_bytes': fsize}
        
    v_pixels = (valid_arr == 1)
    n_valid = int(np.sum(v_pixels))
    pct_valid = (n_valid / (WIDTH * HEIGHT)) * 100.0
    
    v_lst = lst_arr[v_pixels]
    v_ndvi = ndvi_arr[v_pixels]
    v_ndbi = ndbi_arr[v_pixels]
    
    elapsed = time.time() - t0
    print(f" -> Completed in {elapsed:.1f}s | Valid pixels: {n_valid:,} ({pct_valid:.1f}%)")
    if n_valid > 0:
        print(f"    LST:  min={np.min(v_lst):.2f}°C, max={np.max(v_lst):.2f}°C, mean={np.mean(v_lst):.2f}°C")
        print(f"    NDVI: min={np.min(v_ndvi):.4f}, max={np.max(v_ndvi):.4f}, mean={np.mean(v_ndvi):.4f}")
        print(f"    NDBI: min={np.min(v_ndbi):.4f}, max={np.max(v_ndbi):.4f}, mean={np.mean(v_ndbi):.4f}")
    else:
        print(f"    Scene completely obscured by clouds over AOI.")
        
    return {
        'date': d_str,
        'scene_id': scene_id,
        'spacecraft': spacecraft,
        'valid_count': n_valid,
        'valid_pct': pct_valid,
        'files': res,
        'elapsed': elapsed
    }

def main():
    print("=" * 80)
    print("INCREMENT 3.10H: CANDIDATE REAL LANDSAT RASTER EXTRACTION")
    print("=" * 80)
    
    # 1. Initialize Earth Engine
    print("\n[Step 1] Initializing Google Earth Engine API...")
    ee.Initialize()
    print(" -> Earth Engine connection established successfully.")
    
    # 2. Prepare staging directory
    os.makedirs(OUTPUT_DIR, exist_ok=True)
    print(f"\n[Step 2] Staging output directory prepared: {OUTPUT_DIR}")
    
    # 3. Process all 8 dates
    print(f"\n[Step 3] Processing {len(DATES)} verified acquisition dates...")
    total_start = time.time()
    results = []
    
    for d in DATES:
        res = process_and_export_date(d)
        results.append(res)
        
    total_elapsed = time.time() - total_start
    print(f"\nAll 8 dates extracted successfully in {total_elapsed:.1f}s ({total_elapsed/60.0:.2f} min).")
    print(f"Total GeoTIFFs generated: {len(results) * 4} in {OUTPUT_DIR}/")

if __name__ == "__main__":
    main()
