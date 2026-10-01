"""
PROJECT: Machine Learning-Based Urban Heat Hotspot Detection Using LST, NDVI and NDBI from Landsat Imagery
STUDY AREA: Mysuru, Karnataka, India
STEP 2: Landsat 8/9 Data Acquisition, QA Cloud/Shadow Masking & Physical Scale-Factor Calibration (Python Version)

DESCRIPTION:
Filters USGS Landsat 8 & 9 Collection 2 Level-2 datasets for Mysuru AOI (April 1 - June 30).
Applies QA_PIXEL bitmasking for clouds/shadows and official USGS scale factors to calibrate optical SR & thermal ST.
"""

import ee
import geemap

def mask_landsat_sr(image):
    """
    Masks clouds, cloud shadows, dilated clouds, and cirrus using QA_PIXEL bitmask.
    """
    qa = image.select('QA_PIXEL')
    
    dilated_cloud_bit = 1 << 1
    cirrus_bit        = 1 << 2
    cloud_bit         = 1 << 3
    cloud_shadow_bit  = 1 << 4
    
    mask = qa.bitwiseAnd(dilated_cloud_bit).eq(0) \
        .And(qa.bitwiseAnd(cirrus_bit).eq(0)) \
        .And(qa.bitwiseAnd(cloud_bit).eq(0)) \
        .And(qa.bitwiseAnd(cloud_shadow_bit).eq(0))
        
    return image.updateMask(mask)

def apply_scale_factors(image):
    """
    Applies USGS Collection 2 Level-2 scale factors and converts thermal band to Celsius.
    """
    optical_bands = image.select('SR_B.').multiply(0.0000275).add(-0.2)
    thermal_band_kelvin = image.select('ST_B10').multiply(0.00341802).add(149.0)
    thermal_band_celsius = thermal_band_kelvin.subtract(273.15).rename('ST_Celsius')
    
    return image.addBands(optical_bands, None, True) \
                .addBands(thermal_band_kelvin, None, True) \
                .addBands(thermal_band_celsius)

def acquire_landsat_composite(aoi, start_date='2023-04-01', end_date='2023-06-30'):
    """
    Acquires, filters, masks, scales, and composites Landsat 8 & 9 imagery over Mysuru AOI.
    """
    l8 = ee.ImageCollection("LANDSAT/LC08/C02/T1_L2") \
        .filterBounds(aoi) \
        .filterDate(start_date, end_date) \
        .filter(ee.Filter.lt('CLOUD_COVER', 30))
        
    l9 = ee.ImageCollection("LANDSAT/LC09/C02/T1_L2") \
        .filterBounds(aoi) \
        .filterDate(start_date, end_date) \
        .filter(ee.Filter.lt('CLOUD_COVER', 30))
        
    merged = l8.merge(l9)
    
    processed = merged.map(mask_landsat_sr).map(apply_scale_factors)
    composite = processed.median().clip(aoi)
    
    return {
        'l8_count': l8.size().getInfo(),
        'l9_count': l9.size().getInfo(),
        'total_count': merged.size().getInfo(),
        'composite': composite
    }

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
    
    res = acquire_landsat_composite(aoi)
    
    print("=====================================================")
    print("STEP 2: LANDSAT DATA ACQUISITION REPORT (Python)")
    print("=====================================================")
    print(f"Landsat 8 Scenes Found: {res['l8_count']}")
    print(f"Landsat 9 Scenes Found: {res['l9_count']}")
    print(f"Total Merged Scenes: {res['total_count']}")
    print("=====================================================")
    
    Map = geemap.Map(center=[12.30, 76.665], zoom=11)
    
    true_color_vis = {'bands': ['SR_B4', 'SR_B3', 'SR_B2'], 'min': 0.0, 'max': 0.3}
    temp_vis = {'bands': ['ST_Celsius'], 'min': 25.0, 'max': 50.0, 'palette': ['blue', 'cyan', 'green', 'yellow', 'orange', 'red']}
    
    Map.addLayer(res['composite'], true_color_vis, 'Landsat 8/9 True Color (RGB)')
    Map.addLayer(res['composite'], temp_vis, 'Surface Temperature (°C)')
    Map.addLayer(aoi, {'color': 'red', 'fillColor': '00000000'}, 'Mysuru AOI')
    
    return Map

if __name__ == "__main__":
    main()
