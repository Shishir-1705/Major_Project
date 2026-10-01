import math
from pyproj import Transformer

# PyProj Transformer from EPSG:4326 (WGS84 Lat/Lng) to EPSG:32643 (UTM Zone 43N)
transformer_4326_to_32643 = Transformer.from_crs("EPSG:4326", "EPSG:32643", always_xy=True)
transformer_3857_to_32643 = Transformer.from_crs("EPSG:3857", "EPSG:32643", always_xy=True)

def tile_to_wgs84_bbox(z: int, x: int, y: int):
    """
    Calculate WGS84 bounding box (min_lng, min_lat, max_lng, max_lat) for tile (z, x, y).
    """
    n = 2.0 ** z
    min_lng = x / n * 360.0 - 180.0
    max_lng = (x + 1) / n * 360.0 - 180.0

    lat_rad_max = math.atan(math.sinh(math.pi * (1.0 - 2.0 * y / n)))
    max_lat = math.degrees(lat_rad_max)

    lat_rad_min = math.atan(math.sinh(math.pi * (1.0 - 2.0 * (y + 1) / n)))
    min_lat = math.degrees(lat_rad_min)

    return min_lng, min_lat, max_lng, max_lat

def tile_to_target_crs_bbox(z: int, x: int, y: int, target_crs="EPSG:32643"):
    """
    Convert Web Mercator tile (z, x, y) to target CRS bounding box (min_x, min_y, max_x, max_y).
    """
    min_lng, min_lat, max_lng, max_lat = tile_to_wgs84_bbox(z, x, y)
    
    # Project corner points
    min_x, min_y = transformer_4326_to_32643.transform(min_lng, min_lat)
    max_x, max_y = transformer_4326_to_32643.transform(max_lng, max_lat)

    return min(min_x, max_x), min(min_y, max_y), max(min_x, max_x), max(min_y, max_y)
