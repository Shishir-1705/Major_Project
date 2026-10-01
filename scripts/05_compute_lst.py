"""
PROJECT: Machine Learning-Based Urban Heat Hotspot Detection Using LST, NDVI and NDBI from Landsat Imagery
STUDY AREA: Mysuru, Karnataka, India
STEP 5: Land Surface Temperature (LST) Derivation & Calibration (Python Version - Corrected)

PURPOSE:
1. Utilize official USGS Landsat Collection 2 Level-2 Surface Temperature (ST_B10) product.
2. Convert calibrated ST_B10 (Kelvin) to Land Surface Temperature in degrees Celsius (°C).
3. Inspect ST_QA (Surface Temperature Uncertainty in Kelvin) for quality assurance.
4. Perform robust valid-pixel count, min, max, mean LST and ST_QA diagnostics over Mysuru AOI.
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
    props = rep_img.getInfo()['properties']
    
    print("=====================================================")
    print("STEP 5: LAND SURFACE TEMPERATURE (LST) REPORT (Python)")
    print("=====================================================")
    print(f"Processed Collection Count: {merged_proc.size().getInfo()}")
    print(f"Representative Scene Index: {props.get('system:index')}")
    print(f"WRS Path/Row: {props.get('WRS_PATH')}/{props.get('WRS_ROW')}")
    print(f"Processing Level: {props.get('PROCESSING_LEVEL')}")
    
    reducer = ee.Reducer.min().combine(ee.Reducer.max(), sharedInputs=True) \
                .combine(ee.Reducer.mean(), sharedInputs=True) \
                .combine(ee.Reducer.count(), sharedInputs=True)
                
    stats = rep_img.select(['ST_B10', 'LST_Celsius', 'ST_QA_Kelvin']).reduceRegion(
        reducer=reducer,
        geometry=aoi,
        scale=30,
        maxPixels=1e8
    ).getInfo()
    
    st_count = stats.get('ST_B10_count')
    celsius_mean = stats.get('LST_Celsius_mean')
    st_qa_min = stats.get('ST_QA_Kelvin_min')
    st_qa_max = stats.get('ST_QA_Kelvin_max')
    st_qa_mean = stats.get('ST_QA_Kelvin_mean')
    
    print("-----------------------------------------------------")
    print(f"Valid ST_B10 Pixel Count: {st_count}")
    print(f"LST Kelvin Min: {stats.get('ST_B10_min')} | Max: {stats.get('ST_B10_max')} | Mean: {stats.get('ST_B10_mean')}")
    print(f"LST Celsius Min: {stats.get('LST_Celsius_min'):.2f} °C | Max: {stats.get('LST_Celsius_max'):.2f} °C | Mean: {celsius_mean:.2f} °C")
    print(f"ST_QA Uncertainty Min: {st_qa_min:.2f} K | Max: {st_qa_max:.2f} K | Mean: {st_qa_mean:.2f} K")
    
    if st_count and st_count > 0:
        print("ST_B10 VALIDITY CHECK: VALID (Unmasked ST pixels exist over AOI)")
    else:
        print("ST_B10 VALIDITY CHECK: WARNING (ST_B10 has 0 valid pixels over AOI)")
    print("=====================================================")
    
    Map = geemap.Map(center=[12.30, 76.665], zoom=11)
    lst_vis = {'bands': ['LST_Celsius'], 'min': 25.0, 'max': 50.0, 'palette': ['blue', 'cyan', 'green', 'yellow', 'orange', 'red', 'darkred']}
    st_qa_vis = {'bands': ['ST_QA_Kelvin'], 'min': 0.5, 'max': 4.0, 'palette': ['green', 'yellow', 'orange', 'red']}
    
    Map.addLayer(rep_img.clip(aoi), lst_vis, 'LST Celsius — ST_B10 Diagnostic')
    Map.addLayer(rep_img.clip(aoi), st_qa_vis, 'ST_QA Uncertainty (Kelvin Diagnostic)')
    Map.addLayer(aoi, {'color': 'red', 'fillColor': '00000000'}, 'Mysuru Primary AOI')
    
    return Map

if __name__ == "__main__":
    main()
