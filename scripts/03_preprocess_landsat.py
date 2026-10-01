"""
PROJECT: Machine Learning-Based Urban Heat Hotspot Detection Using LST, NDVI and NDBI from Landsat Imagery
STUDY AREA: Mysuru, Karnataka, India
STEP 3: Landsat 8 & 9 Preprocessing — QA_PIXEL Masking & Scale-Factor Calibration (Python Version - Corrected)

PURPOSE:
1. Implement QA_PIXEL bitmasking for cloud, cloud shadow, dilated cloud, cirrus, snow, and fill data.
2. Retain water bodies (do NOT mask water).
3. Apply official USGS Collection 2 Level-2 multiplicative scale factors and additive offsets.
4. Perform null-safe diagnostic checks on scaled reflectance, thermal Kelvin/Celsius values, and ST availability.
"""

import ee
import geemap

def mask_landsat(image):
    """
    Applies QA_PIXEL bitmasking for fill, dilated cloud, cirrus, cloud, cloud shadow, and snow.
    Retains water body pixels (Bit 7).
    """
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
    """
    Applies official USGS Collection 2 Level-2 scale factors to optical SR and thermal ST (Kelvin).
    """
    optical_bands = image.select('SR_B.').multiply(0.0000275).add(-0.2)
    thermal_band_kelvin = image.select('ST_B10').multiply(0.00341802).add(149.0)
    
    return image.addBands(optical_bands, None, True) \
                .addBands(thermal_band_kelvin, None, True)

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
    merged_raw = l8_raw.merge(l9_raw).sort('system:time_start')
    
    l8_processed = l8_raw.map(mask_landsat).map(apply_scale_factors)
    l9_processed = l9_raw.map(mask_landsat).map(apply_scale_factors)
    merged_processed = l8_processed.merge(l9_processed).sort('system:time_start')
    
    raw_count = merged_raw.size().getInfo()
    proc_count = merged_processed.size().getInfo()
    
    print("=====================================================")
    print("STEP 3: PREPROCESSING & CALIBRATION REPORT (Python)")
    print("=====================================================")
    print(f"Raw Merged Collection Count: {raw_count}")
    print(f"Processed Merged Collection Count: {proc_count}")
    
    rep_raw = ee.Image(merged_raw.first())
    rep_proc = ee.Image(merged_processed.first())
    
    props = rep_raw.getInfo()['properties']
    print("-----------------------------------------------------")
    print(f"Representative Scene Index: {props.get('system:index')}")
    print(f"Actual WRS Path/Row: {props.get('WRS_PATH')}/{props.get('WRS_ROW')}")
    print(f"Processing Level: {props.get('PROCESSING_LEVEL')}")
    print(f"Spacecraft ID: {props.get('SPACECRAFT_ID')}")
    
    sampled = rep_proc.select(['SR_B4', 'SR_B5', 'SR_B6', 'ST_B10']).reduceRegion(
        reducer=ee.Reducer.mean(),
        geometry=aoi,
        scale=30,
        maxPixels=1e8
    ).getInfo()
    
    print("-----------------------------------------------------")
    print(f"Red Reflectance (SR_B4): {sampled.get('SR_B4')}")
    print(f"NIR Reflectance (SR_B5): {sampled.get('SR_B5')}")
    print(f"SWIR1 Reflectance (SR_B6): {sampled.get('SR_B6')}")
    
    st_kelvin = sampled.get('ST_B10')
    if st_kelvin is not None:
        celsius = st_kelvin - 273.15
        print(f"Thermal ST_B10 (Kelvin): {st_kelvin}")
        print(f"Thermal ST_B10 (Celsius Diagnostic): {celsius:.2f} °C")
        print("ST_B10 AVAILABILITY CHECK: VALID (ST_B10 is present)")
    else:
        print("Thermal ST_B10 (Kelvin): None")
        print("ST_B10 AVAILABILITY CHECK: WARNING (ST_B10 is NULL or fully masked)")
    print("=====================================================")
    
    Map = geemap.Map(center=[12.30, 76.665], zoom=11)
    vis_params = {'bands': ['SR_B4', 'SR_B3', 'SR_B2'], 'min': 0.0, 'max': 0.3}
    Map.addLayer(rep_proc.clip(aoi), vis_params, '2. Representative Scene (AFTER QA Masking)')
    Map.addLayer(aoi, {'color': 'red', 'fillColor': '00000000'}, 'Mysuru Primary AOI')
    
    return Map

if __name__ == "__main__":
    main()
