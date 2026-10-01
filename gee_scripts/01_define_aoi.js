/**
 * PROJECT: Machine Learning-Based Urban Heat Hotspot Detection Using LST, NDVI and NDBI from Landsat Imagery
 * STUDY AREA: Mysuru, Karnataka, India
 * STEP 1: Area of Interest (AOI) Definition & Boundary Verification (Corrected & Refined)
 * 
 * DESCRIPTION:
 * Defines the spatial boundary (AOI) for Mysuru city and its immediate urban/peri-urban fringe.
 * Compares the custom bounding polygon against GEE's FAO GAUL Level-2 administrative dataset.
 * Computes exact geodesic spatial metadata (Area in km², Centroid, Bounding Box) and renders styled vector layers.
 */

// ==============================================================================
// 1. DEFINE AREA OF INTEREST (AOI)
// ==============================================================================

// RECOMMENDED AOI STRATEGY: Defined Bounding Polygon for Mysuru Urban & Peri-Urban Region
// Bounding coordinates:
// - Longitude: 76.5500°E (West) to 76.7800°E (East) [~25 km width]
// - Latitude:  12.2000°N (South) to 12.4000°N (North) [~22.2 km height]
// Encloses: Mysuru City Corporation (MCC) urban core, Hebbal & Hootagalli Industrial Areas,
// Infosys Campus, Chamundi Hill, outer Ring Road, Mysuru Airport (Mandakalli), and peri-urban fringe.
var mysuruUrbanBbox = ee.Geometry.Polygon([
  [
    [76.5500, 12.4000], // Northwest corner
    [76.7800, 12.4000], // Northeast corner
    [76.7800, 12.2000], // Southeast corner
    [76.5500, 12.2000], // Southwest corner
    [76.5500, 12.4000]  // Closing ring (Northwest)
  ]
]);

// ADMINISTRATIVE DATASET IN GEE: FAO GAUL 2015 Level 2 (Districts)
// NOTE: FAO GAUL Level 2 represents the entire Mysore District (~6,300 km²), NOT just the city boundary.
// CRITICAL SCHEMATIC RULE: The dataset uses historical spelling 'Mysore' for ADM2_NAME and 'Karnataka' for ADM1_NAME.
// Filtering for 'Mysuru' will return an EMPTY FeatureCollection (0 features).
var gaulDistricts = ee.FeatureCollection("FAO/GAUL/2015/level2");
var mysuruAdminDistrict = gaulDistricts
  .filter(ee.Filter.eq('ADM1_NAME', 'Karnataka'))
  .filter(ee.Filter.eq('ADM2_NAME', 'Mysore'));

// Primary AOI Selection: Custom Urban & Peri-Urban Bounding Geometry
var aoi = mysuruUrbanBbox;

// Export AOI object for downstream processing modules (Data acquisition, LST, ML training)
exports.aoi = aoi;

// ==============================================================================
// 2. METADATA CALCULATION & VALIDATION
// ==============================================================================

// Calculate geometry surface area in square kilometers using WGS84 geodesic calculation
var areaSqKm = aoi.area({maxError: 1}).divide(1e6);

// Calculate centroid of the study area
var centroid = aoi.centroid({maxError: 1});

// Get bounding box coordinates
var bounds = aoi.bounds();

// Count features in administrative district filter
var gaulCount = mysuruAdminDistrict.size();

// Print validation metadata to console
print('=====================================================');
print('STEP 1: MYSURU AOI RIGOROUS VERIFICATION REPORT');
print('=====================================================');
print('Primary AOI Geometry Type:', aoi.type());
print('Primary AOI Geodesic Area (sq km):', areaSqKm);
print('Primary AOI Centroid (Lon, Lat):', centroid.coordinates());
print('Primary AOI Bounding Box:', bounds.coordinates());
print('FAO GAUL District Name Filtered:', 'ADM1_NAME = Karnataka, ADM2_NAME = Mysore');
print('FAO GAUL District Feature Count:', gaulCount);
print('=====================================================');

// ==============================================================================
// 3. MAP VISUALIZATION & LAYER STYLING
// ==============================================================================

// Center map view on Mysuru centroid at zoom level 11
Map.centerObject(centroid, 11);

// Set default basemap to Satellite hybrid for urban surface visibility
Map.setOptions('HYBRID');

// Define vector layer styling
var urbanBboxStyle = {
  color: 'ff1100',       // Bright Red border
  fillColor: 'ff11001a',  // Semi-transparent red fill (10% opacity)
  width: 2
};

var adminDistrictStyle = {
  color: '0066ff',       // Blue border for full Mysore district
  fillColor: '00000000', // Transparent fill
  width: 1.5,
  lineType: 'dashed'
};

// Add layers to GEE Map canvas
Map.addLayer(mysuruAdminDistrict.style(adminDistrictStyle), {}, 'FAO GAUL Mysore District Boundary (~6,300 sq km)');
Map.addLayer(aoi.style(urbanBboxStyle), {}, 'Mysuru Urban/Peri-Urban AOI (~554 sq km)');
Map.addLayer(centroid, {color: 'yellow'}, 'Mysuru Centroid');
