"""
PROJECT: Machine Learning-Based Urban Heat Hotspot Detection Using LST, NDVI and NDBI from Landsat Imagery
STUDY AREA: Mysuru, Karnataka, India
STEP 7: Feature Matrix Extraction & Stratified Sampling (Python Version with Lon/Lat Metadata)

PURPOSE:
1. Filter raw Landsat 8/9 Level-2 collections explicitly for PROCESSING_LEVEL == 'L2SP'.
2. Assemble stacked 30m predictor image containing non-thermal indices (NDVI, NDBI), target labels (hotspot_label), and spatial metadata (longitude, latitude).
3. Strictly EXCLUDE LST_Celsius from predictor set X to prevent target leakage.
4. Perform stratified random sampling (500 samples per class, 1,000 total) over the 30m built-up domain with dropNulls=True.
5. Save sampled dataset locally to CSV (data/Mysuru_Urban_Heat_Hotspot_Features_Step7.csv) with selectors:
   ['NDVI', 'NDBI', 'hotspot_label', 'longitude', 'latitude']
"""

import os
import ee
import geemap
import pandas as pd

def mask_landsat(image):
    qa = image.select('QA_PIXEL')
    fill_bit          = 1 << 0
    dilated_cloud_bit = 1 << 1
    cirrus_bit        = 1 << 2
    cloud_bit         = 1 << 3
    cloud_shadow_bit  = 1 << 4
    snow_bit          = 1 << 5
    
    mask = qa.bitwiseAnd(fill_bit).eq(0) \
        .And(qa.bitwiseAnd(dilated_cloud_bit).eq(0)) \
        .And(qa.bitwiseAnd(cirrus_bit).eq(0)) \
        .And(qa.bitwiseAnd(cloud_bit).eq(0)) \
        .And(qa.bitwiseAnd(cloud_shadow_bit).eq(0)) \
        .And(qa.bitwiseAnd(snow_bit).eq(0))
        
    return image.updateMask(mask)

def apply_scale_factors(image):
    optical_bands = image.select('SR_B.').multiply(0.0000275).add(-0.2)
    thermal_band_kelvin = image.select('ST_B10').multiply(0.00341802).add(149.0)
    st_qa = image.select('ST_QA').multiply(0.01).rename('ST_QA_Kelvin')
    return image.addBands(optical_bands, None, True) \
                .addBands(thermal_band_kelvin, None, True) \
                .addBands(st_qa, None, True)

def add_lst_celsius(image):
    st_kelvin = image.select('ST_B10')
    lst_celsius = st_kelvin.subtract(273.15).rename('LST_Celsius')
    return image.addBands(lst_celsius)

def add_ndvi(image):
    nir = image.select('SR_B5')
    red = image.select('SR_B4')
    denom = nir.add(red)
    ndvi = image.expression('(NIR - RED) / (NIR + RED)', {'NIR': nir, 'RED': red}).rename('NDVI').updateMask(denom.neq(0))
    return image.addBands(ndvi)

def add_ndbi(image):
    swir1 = image.select('SR_B6')
    nir   = image.select('SR_B5')
    denom = swir1.add(nir)
    ndbi = image.expression('(SWIR1 - NIR) / (SWIR1 + NIR)', {'SWIR1': swir1, 'NIR': nir}).rename('NDBI').updateMask(denom.neq(0))
    return image.addBands(ndbi)

def main():
    try:
        ee.Initialize()
    except Exception:
        ee.Authenticate()
        ee.Initialize()
        
    aoi = ee.Geometry.Polygon([
        [
            [76.5500, 12.4000],
            [76.7800, 12.4000],
            [76.7800, 12.2000],
            [76.5500, 12.2000],
            [76.5500, 12.4000]
        ]
    ])
    
    start_date = '2023-04-01'
    end_date   = '2023-07-01'
    
    l8_raw = ee.ImageCollection("LANDSAT/LC08/C02/T1_L2") \
        .filterBounds(aoi) \
        .filterDate(start_date, end_date) \
        .filter(ee.Filter.eq('PROCESSING_LEVEL', 'L2SP'))
        
    l9_raw = ee.ImageCollection("LANDSAT/LC09/C02/T1_L2") \
        .filterBounds(aoi) \
        .filterDate(start_date, end_date) \
        .filter(ee.Filter.eq('PROCESSING_LEVEL', 'L2SP'))
    
    l8_proc = l8_raw.map(mask_landsat).map(apply_scale_factors).map(add_lst_celsius).map(add_ndvi).map(add_ndbi)
    l9_proc = l9_raw.map(mask_landsat).map(apply_scale_factors).map(add_lst_celsius).map(add_ndvi).map(add_ndbi)
    merged_proc = l8_proc.merge(l9_proc).sort('system:time_start')
    
    rep_img = ee.Image(merged_proc.first())
    rep_lst = rep_img.select('LST_Celsius')
    rep_ndvi = rep_img.select('NDVI')
    rep_ndbi = rep_img.select('NDBI')
    target_proj = rep_lst.projection()
    
    dw_col = ee.ImageCollection("GOOGLE/DYNAMICWORLD/V1").filterBounds(aoi).filterDate(start_date, end_date)
    built_prob_10m = dw_col.select('built').mean()
    dw_proj = dw_col.first().select('built').projection()
    
    built_prob_30m = built_prob_10m.setDefaultProjection(dw_proj) \
        .reduceResolution(reducer=ee.Reducer.mean(), maxPixels=1024) \
        .reproject(crs=target_proj).clip(aoi)
        
    built_mask_30m = built_prob_30m.gte(0.5)
    urban_lst = rep_lst.updateMask(built_mask_30m).rename('LST_Celsius')
    
    percentiles = urban_lst.reduceRegion(
        reducer=ee.Reducer.percentile([20, 80]),
        geometry=aoi,
        scale=30,
        crs=target_proj,
        maxPixels=1e9,
        tileScale=4
    ).getInfo()
    
    p20 = percentiles.get('LST_Celsius_p20')
    p80 = percentiles.get('LST_Celsius_p80')
    
    non_hotspot_mask = urban_lst.lte(ee.Image.constant(p20)).rename('NonHotspot')
    hotspot_mask    = urban_lst.gte(ee.Image.constant(p80)).rename('Hotspot')
    valid_label_mask = non_hotspot_mask.Or(hotspot_mask)
    
    label_img = ee.Image(0).where(non_hotspot_mask, 0).where(hotspot_mask, 1).updateMask(valid_label_mask).rename('hotspot_label')
    
    lon_lat = ee.Image.pixelLonLat()
    
    # Assembly of Feature Stack (LST strictly EXCLUDED, lon/lat attached)
    predictor_stack = ee.Image.cat([rep_ndvi, rep_ndbi, label_img, lon_lat.select(['longitude', 'latitude'])]).updateMask(built_mask_30m).updateMask(valid_label_mask)
    
    num_points_per_class = 500
    sample_seed = 42
    
    sampled_features = predictor_stack.stratifiedSample(
        numPoints=num_points_per_class,
        classBand='hotspot_label',
        region=aoi,
        scale=30,
        projection=target_proj,
        seed=sample_seed,
        geometries=False,
        dropNulls=True,
        tileScale=4
    )
    
    features_list = sampled_features.getInfo()['features']
    data = [f['properties'] for f in features_list]
    df = pd.DataFrame(data)
    
    # Reorder columns explicitly: ['NDVI', 'NDBI', 'hotspot_label', 'longitude', 'latitude']
    selectors = ['NDVI', 'NDBI', 'hotspot_label', 'longitude', 'latitude']
    df = df[selectors]
        
    os.makedirs("data", exist_ok=True)
    csv_path = os.path.join("data", "Mysuru_Urban_Heat_Hotspot_Features_Step7.csv")
    df.to_csv(csv_path, index=False)
    print(f"Sampled feature matrix with lon/lat successfully saved to: {csv_path}")

if __name__ == "__main__":
    main()
