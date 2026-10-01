"""
PROJECT: Machine Learning-Based Urban Heat Hotspot Detection Using LST, NDVI and NDBI from Landsat Imagery
STUDY AREA: Mysuru, Karnataka, India
STEP 4: Spectral Index Computation — NDVI & NDBI (Python Version - Refined)

PURPOSE:
1. Compute continuous NDVI using explicit expressions with division-by-zero protection.
2. Compute continuous NDBI using explicit expressions with division-by-zero protection.
3. Perform robust null-safe numerical min, max, mean diagnostics over Mysuru AOI.
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
    return image.addBands(optical_bands, None, True).addBands(thermal_band_kelvin, None, True)

def add_ndvi(image):
    nir = image.select('SR_B5')
    red = image.select('SR_B4')
    denom = nir.add(red)
    ndvi = image.expression(
        '(NIR - RED) / (NIR + RED)',
        {'NIR': nir, 'RED': red}
    ).rename('NDVI').updateMask(denom.neq(0))
    return image.addBands(ndvi)

def add_ndbi(image):
    swir1 = image.select('SR_B6')
    nir   = image.select('SR_B5')
    denom = swir1.add(nir)
    ndbi = image.expression(
        '(SWIR1 - NIR) / (SWIR1 + NIR)',
        {'SWIR1': swir1, 'NIR': nir}
    ).rename('NDBI').updateMask(denom.neq(0))
    return image.addBands(ndbi)

def add_spectral_indices(image):
    return add_ndbi(add_ndvi(image))

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
    
    l8_proc = l8_raw.map(mask_landsat).map(apply_scale_factors).map(add_spectral_indices)
    l9_proc = l9_raw.map(mask_landsat).map(apply_scale_factors).map(add_spectral_indices)
    merged_proc = l8_proc.merge(l9_proc).sort('system:time_start')
    
    rep_img = ee.Image(merged_proc.first())
    props = rep_img.getInfo()['properties']
    
    print("=====================================================")
    print("STEP 4: REFINED SPECTRAL INDEX DIAGNOSTIC REPORT (Python)")
    print("=====================================================")
    print(f"Processed Collection Count: {merged_proc.size().getInfo()}")
    print(f"Representative Scene Index: {props.get('system:index')}")
    print(f"WRS Path/Row: {props.get('WRS_PATH')}/{props.get('WRS_ROW')}")
    
    reducer = ee.Reducer.min().combine(ee.Reducer.max(), sharedInputs=True).combine(ee.Reducer.mean(), sharedInputs=True)
    stats = rep_img.select(['NDVI', 'NDBI']).reduceRegion(
        reducer=reducer,
        geometry=aoi,
        scale=30,
        maxPixels=1e8
    ).getInfo()
    
    ndvi_mean = stats.get('NDVI_mean')
    ndbi_mean = stats.get('NDBI_mean')
    
    print("-----------------------------------------------------")
    print(f"NDVI Min: {stats.get('NDVI_min')} | Max: {stats.get('NDVI_max')} | Mean: {ndvi_mean}")
    print(f"NDBI Min: {stats.get('NDBI_min')} | Max: {stats.get('NDBI_max')} | Mean: {ndbi_mean}")
    
    if ndvi_mean is not None:
        print("NDVI AVAILABILITY CHECK: VALID (Non-null numeric NDVI mean)")
    else:
        print("NDVI AVAILABILITY CHECK: WARNING (NDVI mean is NULL)")
        
    if ndbi_mean is not None:
        print("NDBI AVAILABILITY CHECK: VALID (Non-null numeric NDBI mean)")
    else:
        print("NDBI AVAILABILITY CHECK: WARNING (NDBI mean is NULL)")
    print("=====================================================")
    
    Map = geemap.Map(center=[12.30, 76.665], zoom=11)
    ndvi_vis = {'bands': ['NDVI'], 'min': -0.2, 'max': 0.7, 'palette': ['blue', 'white', 'brown', 'yellow', 'green', 'darkgreen']}
    ndbi_vis = {'bands': ['NDBI'], 'min': -0.4, 'max': 0.4, 'palette': ['blue', 'cyan', 'white', 'yellow', 'red', 'magenta']}
    
    Map.addLayer(rep_img.clip(aoi), ndvi_vis, 'Continuous NDVI Layer')
    Map.addLayer(rep_img.clip(aoi), ndbi_vis, 'Continuous NDBI Layer')
    Map.addLayer(aoi, {'color': 'red', 'fillColor': '00000000'}, 'Mysuru Primary AOI')
    
    return Map

if __name__ == "__main__":
    main()
