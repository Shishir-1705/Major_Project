/**
 * PROJECT: Machine Learning-Based Urban Heat Hotspot Detection Using LST, NDVI and NDBI from Landsat Imagery
 * STUDY AREA: Mysuru, Karnataka, India
 * STEP 2: Landsat 8 & 9 Dataset Acquisition & Metadata Verification (Diagnostic Script)
 * 
 * PURPOSE:
 * Performs dataset discovery and metadata verification for USGS Landsat 8 & 9 Collection 2 Level-2 Tier 1.
 * Inspects scene availability, acquisition dates, WRS path/row, and cloud cover properties over Mysuru AOI.
 * 
 * SCIENTIFIC CONSTRAINTS STRICTLY ENFORCED:
 * - NO cloud masking applied yet.
 * - NO scale factors applied yet.
 * - NO spectral index computation (NDVI / NDBI).
 * - NO LST calculation.
 */

// ==============================================================================
// 1. DEFINE AOI & TIME PERIOD
// ==============================================================================

// Primary Mysuru Urban/Peri-Urban AOI Polygon (from Step 1 verification)
var aoi = ee.Geometry.Polygon([
  [
    [76.5500, 12.4000], // Northwest
    [76.7800, 12.4000], // Northeast
    [76.7800, 12.2000], // Southeast
    [76.5500, 12.2000], // Southwest
    [76.5500, 12.4000]  // Closing ring
  ]
]);

// Recommended Test Year & Study Window (April 1 to June 30, 2023)
var testYear  = 2023;
var startDate = testYear + '-04-01';
var endDate   = testYear + '-06-30';

// ==============================================================================
// 2. DATASET INGESTION & FILTERING (RAW COLLECTION 2 TIER 1 LEVEL 2)
// ==============================================================================

// Exact Earth Engine Dataset IDs
var l8DatasetID = "LANDSAT/LC08/C02/T1_L2";
var l9DatasetID = "LANDSAT/LC09/C02/T1_L2";

// Load Landsat 8 Collection 2 Level-2 Tier-1 (Filtered to AOI and Date Range)
var l8Collection = ee.ImageCollection(l8DatasetID)
  .filterBounds(aoi)
  .filterDate(startDate, endDate);

// Load Landsat 9 Collection 2 Level-2 Tier-1 (Filtered to AOI and Date Range)
var l9Collection = ee.ImageCollection(l9DatasetID)
  .filterBounds(aoi)
  .filterDate(startDate, endDate);

// Merge Landsat 8 and Landsat 9 Collections
var mergedCollection = l8Collection.merge(l9Collection);

// Sort merged collection chronologically
var sortedCollection = mergedCollection.sort('system:time_start');

// ==============================================================================
// 3. METADATA EXTRACTION & CONSOLE PRINTING
// ==============================================================================

print('=====================================================');
print('STEP 2: LANDSAT 8 & 9 DATASET DISCOVERY REPORT');
print('=====================================================');
print('Study Area:', 'Mysuru Urban & Peri-Urban AOI');
print('Test Study Window:', startDate, 'to', endDate);
print('Earth Engine Landsat 8 ID:', l8DatasetID);
print('Earth Engine Landsat 9 ID:', l9DatasetID);
print('-----------------------------------------------------');
print('Landsat 8 Image Count:', l8Collection.size());
print('Landsat 9 Image Count:', l9Collection.size());
print('Combined Image Count (L8 + L9):', sortedCollection.size());
print('=====================================================');

// Helper function to extract and format metadata per image
var extractMetadata = function(image) {
  var id = image.id();
  var date = image.date().format('YYYY-MM-dd HH:mm:ss');
  var cloudCover = image.get('CLOUD_COVER');
  var path = image.get('WRS_PATH');
  var row = image.get('WRS_ROW');
  return ee.Feature(null, {
    'system_id': id,
    'acquisition_date': date,
    'cloud_cover_percent': cloudCover,
    'wrs_path': path,
    'wrs_row': row
  });
};

// Map metadata extraction over collections
var l8Metadata = l8Collection.map(extractMetadata);
var l9Metadata = l9Collection.map(extractMetadata);
var combinedMetadata = sortedCollection.map(extractMetadata);

print('Landsat 8 Scene Metadata List:', l8Metadata);
print('Landsat 9 Scene Metadata List:', l9Metadata);
print('Combined Chronological Scene List:', combinedMetadata);
print('=====================================================');

// Print first image details to inspect band structure
var firstImage = sortedCollection.first();
print('Representative First Image Object:', firstImage);
print('First Image Band Names:', firstImage.bandNames());
print('First Image WRS Path/Row:', firstImage.get('WRS_PATH'), '/', firstImage.get('WRS_ROW'));
print('=====================================================');

// ==============================================================================
// 4. MAP VISUALIZATION (RAW UNMODIFIED IMAGE DISCOVERY)
// ==============================================================================

Map.centerObject(aoi, 11);
Map.setOptions('HYBRID');

// Unscaled Raw Level-2 Integer True Color Visualization Parameters
// Level-2 SR Digital Numbers typically range from ~7000 to ~15000 prior to scaling
var rawTrueColorVis = {
  bands: ['SR_B4', 'SR_B3', 'SR_B2'],
  min: 7000,
  max: 14000
};

// Add layers to Map canvas
Map.addLayer(firstImage, rawTrueColorVis, 'Representative Raw Landsat Scene (Unscaled True-Color)');
Map.addLayer(aoi, {color: 'red', fillColor: '00000000'}, 'Mysuru Primary AOI');
