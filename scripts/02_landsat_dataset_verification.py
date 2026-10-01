"""
PROJECT: Machine Learning-Based Urban Heat Hotspot Detection Using LST, NDVI and NDBI from Landsat Imagery
STUDY AREA: Mysuru, Karnataka, India
STEP 2: Landsat 8 & 9 Dataset Acquisition & Metadata Verification (Python Diagnostic Script)

PURPOSE:
Performs dataset discovery and metadata verification for USGS Landsat 8 & 9 Collection 2 Level-2 Tier 1.
Inspects scene availability, acquisition dates, WRS path/row, and cloud cover properties over Mysuru AOI.

SCIENTIFIC CONSTRAINTS STRICTLY ENFORCED:
- NO cloud masking applied yet.
- NO scale factors applied yet.
- NO spectral index computation (NDVI / NDBI).
- NO LST calculation.
"""

import ee
import geemap

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
    
    test_year = 2023
    start_date = f"{test_year}-04-01"
    end_date = f"{test_year}-06-30"
    
    l8_id = "LANDSAT/LC08/C02/T1_L2"
    l9_id = "LANDSAT/LC09/C02/T1_L2"
    
    l8_col = ee.ImageCollection(l8_id).filterBounds(aoi).filterDate(start_date, end_date)
    l9_col = ee.ImageCollection(l9_id).filterBounds(aoi).filterDate(start_date, end_date)
    merged = l8_col.merge(l9_col).sort('system:time_start')
    
    l8_count = l8_col.size().getInfo()
    l9_count = l9_col.size().getInfo()
    total_count = merged.size().getInfo()
    
    print("=====================================================")
    print("STEP 2: LANDSAT 8 & 9 DATASET DISCOVERY REPORT (Python)")
    print("=====================================================")
    print(f"Study Area: Mysuru Urban & Peri-Urban AOI")
    print(f"Test Study Window: {start_date} to {end_date}")
    print(f"Landsat 8 ID: {l8_id} | Count: {l8_count}")
    print(f"Landsat 9 ID: {l9_id} | Count: {l9_count}")
    print(f"Total Combined Scenes (L8 + L9): {total_count}")
    print("=====================================================")
    
    # Print scene dates and cloud cover
    scenes = merged.getInfo()['features']
    for idx, s in enumerate(scenes):
        props = s['properties']
        date_str = ee.Date(props['system:time_start']).format('YYYY-MM-dd HH:mm').getInfo()
        cloud = props.get('CLOUD_COVER', 'N/A')
        path = props.get('WRS_PATH', 'N/A')
        row = props.get('WRS_ROW', 'N/A')
        sat = props.get('SPACECRAFT_ID', 'Landsat')
        print(f"[{idx+1}] {sat} | Date: {date_str} | Path/Row: {path}/{row} | Cloud Cover: {cloud}%")
        
    Map = geemap.Map(center=[12.30, 76.665], zoom=11)
    first_img = ee.Image(merged.first())
    vis_params = {'bands': ['SR_B4', 'SR_B3', 'SR_B2'], 'min': 7000, 'max': 14000}
    Map.addLayer(first_img, vis_params, 'Unscaled Raw Landsat True Color')
    Map.addLayer(aoi, {'color': 'red', 'fillColor': '00000000'}, 'Mysuru Primary AOI')
    
    return Map

if __name__ == "__main__":
    main()
