"""
PROJECT: Machine Learning-Based Urban Heat Hotspot Detection Using LST, NDVI and NDBI from Landsat Imagery
STUDY AREA: Mysuru, Karnataka, India
STEP 1: Area of Interest (AOI) Definition & Boundary Verification (Python Version)

DESCRIPTION:
Defines the spatial boundary (AOI) for Mysuru city and its immediate urban/peri-urban fringe using Python Earth Engine API & geemap.
Computes exact geodesic spatial metadata (Area in km², Centroid, Bounding Box) and initializes interactive visual map canvas.
"""

import ee
import geemap

def get_mysuru_aoi():
    """
    Initializes Earth Engine API and returns the Mysuru Area of Interest (AOI) geometry.
    
    Returns:
        ee.Geometry: Polygon geometry of Mysuru urban & peri-urban region.
    """
    try:
        ee.Initialize()
    except Exception:
        print("Initializing Earth Engine...")
        ee.Authenticate()
        ee.Initialize()

    # Defined Bounding Polygon for Mysuru Urban & Peri-Urban Region (~554 km²)
    # Longitude: 76.5500°E to 76.7800°E | Latitude: 12.2000°N to 12.4000°N
    mysuru_urban_bbox = ee.Geometry.Polygon([
        [
            [76.5500, 12.4000],  # Northwest corner
            [76.7800, 12.4000],  # Northeast corner
            [76.7800, 12.2000],  # Southeast corner
            [76.5500, 12.2000],  # Southwest corner
            [76.5500, 12.4000]   # Closing ring
        ]
    ])
    
    return mysuru_urban_bbox

def validate_and_visualize_aoi():
    """
    Computes spatial metrics and renders the AOI on an interactive geemap object.
    """
    aoi = get_mysuru_aoi()
    
    # FAO GAUL 2015 Level 2 (Districts)
    gaul_districts = ee.FeatureCollection("FAO/GAUL/2015/level2")
    mysuru_admin_district = gaul_districts \
        .filter(ee.Filter.eq('ADM1_NAME', 'Karnataka')) \
        .filter(ee.Filter.eq('ADM2_NAME', 'Mysore'))
    
    # Geodesic area in sq km
    area_sq_km = aoi.area(maxError=1).divide(1e6).getInfo()
    centroid = aoi.centroid(maxError=1).getInfo()['coordinates']
    gaul_count = mysuru_admin_district.size().getInfo()
    
    print("=====================================================")
    print("STEP 1: MYSURU AOI RIGOROUS VERIFICATION REPORT (Python)")
    print("=====================================================")
    print(f"Primary AOI Geometry Type: {aoi.type().getInfo()}")
    print(f"Primary AOI Geodesic Area: {area_sq_km:.2f} km²")
    print(f"Primary AOI Centroid (Lon, Lat): {centroid}")
    print(f"FAO GAUL Filter: ADM1_NAME=Karnataka, ADM2_NAME=Mysore")
    print(f"FAO GAUL Feature Count: {gaul_count}")
    print("=====================================================")
    
    Map = geemap.Map(center=[centroid[1], centroid[0]], zoom=11)
    Map.addLayer(mysuru_admin_district, {'color': 'blue'}, 'FAO GAUL Mysore District Boundary')
    Map.addLayer(aoi, {'color': 'red', 'fillColor': '00000000'}, 'Mysuru Urban/Peri-Urban AOI')
    
    return Map

if __name__ == "__main__":
    validate_and_visualize_aoi()
