"""
PROJECT: Machine Learning-Based Urban Heat Hotspot Detection Using LST, NDVI and NDBI from Landsat Imagery
STUDY AREA: Mysuru, Karnataka, India
STEP 6: Generation of LST-Derived Thermal Hotspot Reference Labels (Python Version - Simplified Percentiles & Integer Counts)

PURPOSE:
1. Load Google Dynamic World V1 imagery to compute pre-monsoon mean built probability (10m).
2. Assign nominal 10m projection from Dynamic World scene via setDefaultProjection().
3. Explicitly aggregate Dynamic World built probability to Landsat's 30m grid using reduceResolution().
4. Construct project-defined 30m built-up confidence mask (built probability >= 0.5).
5. Restrict validated single-scene Landsat 9 LST (2023-04-01) to valid unmasked 30m built-up pixels.
6. Compute local relative thermal percentiles (P20 and P80) within the built-up spatial domain.
7. Compute exact integer pixel counts for valid built-up LST pixels, Class 0, Class 1, and Excluded.
"""

import ee
import geemap

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
    
    l8_raw = ee.ImageCollection("LANDSAT/LC08/C02/T1_L2").filterBounds(aoi).filterDate(start_date, end_date)
    l9_raw = ee.ImageCollection("LANDSAT/LC09/C02/T1_L2").filterBounds(aoi).filterDate(start_date, end_date)
    
    l8_proc = l8_raw.map(mask_landsat).map(apply_scale_factors).map(add_lst_celsius)
    l9_proc = l9_raw.map(mask_landsat).map(apply_scale_factors).map(add_lst_celsius)
    merged_proc = l8_proc.merge(l9_proc).sort('system:time_start')
    
    rep_img = ee.Image(merged_proc.first())
    rep_lst = rep_img.select('LST_Celsius')
    target_proj = rep_lst.projection()
    
    dw_col = ee.ImageCollection("GOOGLE/DYNAMICWORLD/V1").filterBounds(aoi).filterDate(start_date, end_date)
    dw_count = dw_col.size().getInfo()
    
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
    
    print("RAW LST PERCENTILE DICTIONARY:", percentiles)
    
    p20 = percentiles.get('LST_Celsius_p20')
    p80 = percentiles.get('LST_Celsius_p80')
    
    print(f"P20 (°C): {p20}")
    print(f"P80 (°C): {p80}")
    print(f"PERCENTILE THRESHOLD CHECK: {p80 > p20 if p20 is not None and p80 is not None else False}")
    
    if p20 is not None and p80 is not None and p80 > p20:
        non_hotspot_mask = urban_lst.lte(ee.Image.constant(p20)).rename('NonHotspot')
        hotspot_mask    = urban_lst.gte(ee.Image.constant(p80)).rename('Hotspot')
        valid_label_mask = non_hotspot_mask.Or(hotspot_mask)
        
        label_img = ee.Image(0).where(non_hotspot_mask, 0).where(hotspot_mask, 1).updateMask(valid_label_mask).rename('hotspot_label')
        
        valid_urban_pixel_mask = urban_lst.mask().gt(0).rename('ValidUrbanPixel')
        
        total_urban_count = round(valid_urban_pixel_mask.reduceRegion(reducer=ee.Reducer.sum(), geometry=aoi, scale=30, crs=target_proj, maxPixels=1e9, tileScale=4).getInfo().get('ValidUrbanPixel', 0))
        non_hot_count     = round(non_hotspot_mask.reduceRegion(reducer=ee.Reducer.sum(), geometry=aoi, scale=30, crs=target_proj, maxPixels=1e9, tileScale=4).getInfo().get('NonHotspot', 0))
        hot_count         = round(hotspot_mask.reduceRegion(reducer=ee.Reducer.sum(), geometry=aoi, scale=30, crs=target_proj, maxPixels=1e9, tileScale=4).getInfo().get('Hotspot', 0))
        excl_count        = total_urban_count - non_hot_count - hot_count
        
        print("=====================================================")
        print("STEP 6: THERMAL HOTSPOT REFERENCE LABEL REPORT (Python)")
        print("=====================================================")
        print(f"Total Valid Urban LST Pixels: {total_urban_count}")
        print(f"Class 0 (Non-Hotspot <= P20) Count: {non_hot_count} ({non_hot_count/total_urban_count*100:.1f}%)")
        print(f"Class 1 (Hotspot >= P80) Count: {hot_count} ({hot_count/total_urban_count*100:.1f}%)")
        print(f"Excluded Intermediate Count: {excl_count} ({excl_count/total_urban_count*100:.1f}%)")
        print("PERCENTILE CHECK: VALID")
    else:
        print("PERCENTILE CHECK: WARNING (Invalid or null percentiles)")
    print("=====================================================")
    
    Map = geemap.Map(center=[12.30, 76.665], zoom=11)
    label_vis = {'min': 0, 'max': 1, 'palette': ['blue', 'red']}
    Map.addLayer(built_prob_30m, {'min': 0.0, 'max': 1.0, 'palette': ['blue', 'white', 'orange', 'red']}, 'Dynamic World 30m Built Prob')
    Map.addLayer(rep_lst.clip(aoi), {'bands': ['LST_Celsius'], 'min': 25.0, 'max': 50.0, 'palette': ['blue', 'cyan', 'green', 'yellow', 'red']}, 'Representative LST °C')
    Map.addLayer(aoi, {'color': 'yellow', 'fillColor': '00000000'}, 'Mysuru Primary AOI')
    
    return Map

if __name__ == "__main__":
    main()
