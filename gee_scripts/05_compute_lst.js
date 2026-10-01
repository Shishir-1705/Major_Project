/**
 * PROJECT: Machine Learning-Based Urban Heat Hotspot Detection Using LST, NDVI and NDBI from Landsat Imagery
 * STUDY AREA: Mysuru, Karnataka, India
 * STEP 5: Land Surface Temperature (LST) Derivation & Calibration [Corrected]
 * 
 * PURPOSE:
 * 1. Utilize official USGS Landsat Collection 2 Level-2 Surface Temperature (ST_B10) product.
 * 2. Convert calibrated ST_B10 (Kelvin) to Land Surface Temperature in degrees Celsius (°C).
 * 3. Inspect ST_QA (Surface Temperature Uncertainty in Kelvin) for quality assurance.
 * 4. Perform robust, null-safe valid-pixel counts, min, max, mean LST and ST_QA diagnostics over Mysuru AOI.
 * 
 * SCIENTIFIC CONSTRAINTS STRICTLY ENFORCED:
 * - Uses official Collection 2 Level-2 ST_B10 product; does NOT recalculate LST from raw thermal DN.
 * - Identifies Land Surface Temperature (LST / radiometric skin temperature), NOT 2m shelter air temperature.
 * - NO arbitrary ST_QA numerical quality thresholds.
 * - NO heatwave declarations or comparisons to official IMD weather station threshold criteria.
 * - NO hotspot thresholds, ML classification, or index combinations yet.
 */

// ==============================================================================
// 1. DEFINE AOI & TIME WINDOW PARAMETERS
// ==============================================================================

// Validated Mysuru Urban/Peri-Urban AOI Bounding Polygon
var aoi = ee.Geometry.Polygon([
  [
    [76.5500, 12.4000], // Northwest
    [76.7800, 12.4000], // Northeast
    [76.7800, 12.2000], // Southeast
    [76.5500, 12.2000], // Southwest
    [76.5500, 12.4000]  // Closing ring
  ]
]);

// Verified Pre-Monsoon Study Window (April 1 to July 1, 2023 - Exclusive end date includes June 30)
var startDate = '2023-04-01';
var endDate   = '2023-07-01';

// Earth Engine Collection 2 Level-2 Dataset IDs
var l8DatasetID = "LANDSAT/LC08/C02/T1_L2";
var l9DatasetID = "LANDSAT/LC09/C02/T1_L2";

// ==============================================================================
// 2. PREPROCESSING FUNCTIONS (STEP 3 & STEP 4)
// ==============================================================================

/**
 * Applies QA_PIXEL bitmasking for cloud, shadow, cirrus, dilated cloud, snow, and fill data.
 * Retains water body pixels (Bit 7).
 */
function maskLandsat(image) {
  var qa = image.select('QA_PIXEL');
  
  var fillBit         = 1 << 0;
  var dilatedCloudBit = 1 << 1;
  var cirrusBit       = 1 << 2;
  var cloudBit        = 1 << 3;
  var cloudShadowBit  = 1 << 4;
  var snowBit         = 1 << 5;
  
  var mask = qa.bitwiseAnd(fillBit).eq(0)
    .and(qa.bitwiseAnd(dilatedCloudBit).eq(0))
    .and(qa.bitwiseAnd(cirrusBit).eq(0))
    .and(qa.bitwiseAnd(cloudBit).eq(0))
    .and(qa.bitwiseAnd(cloudShadowBit).eq(0))
    .and(qa.bitwiseAnd(snowBit).eq(0));
    
  return image.updateMask(mask);
}

/**
 * Applies official USGS Collection 2 Level-2 scale factors to optical SR, thermal ST, and ST_QA.
 * Optical SR: scaled = (DN * 0.0000275) - 0.2
 * Thermal ST_B10: scaled Kelvin = (DN * 0.00341802) + 149.0
 * ST_QA: scaled Kelvin uncertainty = (DN * 0.01)
 */
function applyScaleFactors(image) {
  var opticalBands = image.select('SR_B.').multiply(0.0000275).add(-0.2);
  var thermalBandKelvin = image.select('ST_B10').multiply(0.00341802).add(149.0);
  var stQA = image.select('ST_QA').multiply(0.01).rename('ST_QA_Kelvin');
  
  return image.addBands(opticalBands, null, true)
              .addBands(thermalBandKelvin, null, true)
              .addBands(stQA, null, true);
}

// ==============================================================================
// 3. LAND SURFACE TEMPERATURE (LST) DERIVATION (STEP 5)
// ==============================================================================

/**
 * Converts calibrated Surface Temperature (ST_B10 in Kelvin) to Land Surface Temperature in Celsius (°C).
 * Formula: LST_Celsius = ST_Kelvin - 273.15
 * 
 * @param {ee.Image} image - Scaled Landsat Level-2 image containing 'ST_B10'
 * @returns {ee.Image} - Image with added 'LST_Celsius' band
 */
function addLSTCelsius(image) {
  var stKelvin = image.select('ST_B10');
  var lstCelsius = stKelvin.subtract(273.15).rename('LST_Celsius');
  return image.addBands(lstCelsius);
}

// ==============================================================================
// 4. DATA PIPELINE & COLLECTION PROCESSING
// ==============================================================================

// Load Raw Collections
var l8Raw = ee.ImageCollection(l8DatasetID).filterBounds(aoi).filterDate(startDate, endDate);
var l9Raw = ee.ImageCollection(l9DatasetID).filterBounds(aoi).filterDate(startDate, endDate);

// Map Preprocessing and LST Derivation BEFORE Merging
var l8Processed = l8Raw.map(maskLandsat).map(applyScaleFactors).map(addLSTCelsius);
var l9Processed = l9Raw.map(maskLandsat).map(applyScaleFactors).map(addLSTCelsius);

// Merge Collections and Sort Chronologically
var mergedProcessed = l8Processed.merge(l9Processed).sort('system:time_start');

// Select Representative Image (First Scene in Merged Collection)
var repImage = mergedProcessed.first();

// ==============================================================================
// 5. DIAGNOSTICS & METADATA REPORT
// ==============================================================================

print('=====================================================');
print('STEP 5: LAND SURFACE TEMPERATURE (LST) DIAGNOSTIC REPORT');
print('=====================================================');
print('Processed Image Collection Size:', mergedProcessed.size());
print('Representative Scene Index:', repImage.get('system:index'));
print('Acquisition Date:', repImage.date().format('YYYY-MM-dd HH:mm:ss'));
print('Acquisition Time Zone:', 'UTC');
print('Actual WRS Path:', repImage.get('WRS_PATH'));
print('Actual WRS Row:', repImage.get('WRS_ROW'));
print('Processing Level:', repImage.get('PROCESSING_LEVEL'));
print('Spacecraft ID:', repImage.get('SPACECRAFT_ID'));
print('Available Bands in Scene:', repImage.bandNames());
print('-----------------------------------------------------');

// Calculate Valid Pixel Counts, MIN, MAX, and MEAN for LST (Kelvin & Celsius) and ST_QA over Mysuru AOI
var lstStats = repImage.select(['ST_B10', 'LST_Celsius', 'ST_QA_Kelvin']).reduceRegion({
  reducer: ee.Reducer.min().combine({
    reducer2: ee.Reducer.max(),
    sharedInputs: true
  }).combine({
    reducer2: ee.Reducer.mean(),
    sharedInputs: true
  }).combine({
    reducer2: ee.Reducer.count(),
    sharedInputs: true
  }),
  geometry: aoi,
  scale: 30,
  maxPixels: 1e8
});

// Extract Numerical Values
var stCount = lstStats.get('ST_B10_count');

var stKelvinMin  = lstStats.get('ST_B10_min');
var stKelvinMax  = lstStats.get('ST_B10_max');
var stKelvinMean = lstStats.get('ST_B10_mean');

var lstCelsiusMin  = lstStats.get('LST_Celsius_min');
var lstCelsiusMax  = lstStats.get('LST_Celsius_max');
var lstCelsiusMean = lstStats.get('LST_Celsius_mean');

var stQAMin  = lstStats.get('ST_QA_Kelvin_min');
var stQAMax  = lstStats.get('ST_QA_Kelvin_max');
var stQAMean = lstStats.get('ST_QA_Kelvin_mean');

print('ST_B10 VALID PIXEL COUNT OVER AOI:');
print('Valid ST_B10 Pixel Count:', stCount);
print('-----------------------------------------------------');

print('LST KELVIN DIAGNOSTICS OVER AOI (ST_B10):');
print('LST Kelvin Minimum:', stKelvinMin);
print('LST Kelvin Maximum:', stKelvinMax);
print('LST Kelvin Mean:', stKelvinMean);
print('-----------------------------------------------------');

print('LST CELSIUS DIAGNOSTICS OVER AOI (LST_Celsius):');
print('LST Celsius Minimum (°C):', lstCelsiusMin);
print('LST Celsius Maximum (°C):', lstCelsiusMax);
print('LST Celsius Mean (°C):', lstCelsiusMean);
print('-----------------------------------------------------');

print('ST_QA UNCERTAINTY DIAGNOSTICS OVER AOI (Kelvin):');
print('ST_QA Uncertainty Minimum (K):', stQAMin);
print('ST_QA Uncertainty Maximum (K):', stQAMax);
print('ST_QA Uncertainty Mean (K):', stQAMean);
print('-----------------------------------------------------');

// Robust Server-Side Availability & Valid-Pixel Count Verification
var stCheck = ee.Algorithms.If(
  ee.Algorithms.ObjectType(stCount),
  ee.Algorithms.If(
    ee.Number(stCount).gt(0),
    'VALID: Level-2 ST_B10 surface temperature product has valid unmasked pixels over AOI.',
    'WARNING: ST_B10 contains 0 valid unmasked pixels over AOI.'
  ),
  'WARNING: ST_B10 band is missing or NULL.'
);

print('LST ST_B10 VALIDITY & AVAILABILITY CHECK:', stCheck);
print('=====================================================');

// ==============================================================================
// 6. MAP VISUALIZATION & DIAGNOSTIC LAYERS
// ==============================================================================

Map.centerObject(aoi, 11);
Map.setOptions('HYBRID');

var trueColorVis = {
  bands: ['SR_B4', 'SR_B3', 'SR_B2'],
  min: 0.0,
  max: 0.3
};

// Continuous LST Celsius Diagnostic Display (For Rendering Only; NOT Hotspot Thresholds)
var lstCelsiusVis = {
  bands: ['LST_Celsius'],
  min: 25.0,
  max: 50.0,
  palette: ['blue', 'cyan', 'green', 'yellow', 'orange', 'red', 'darkred']
};

// Continuous ST_QA Display (For Rendering Only; Higher values = Greater Uncertainty)
var stQAVis = {
  bands: ['ST_QA_Kelvin'],
  min: 0.5,
  max: 4.0,
  palette: ['green', 'yellow', 'orange', 'red']
};

Map.addLayer(repImage.clip(aoi), trueColorVis, '1. Preprocessed True-Color (RGB)');
Map.addLayer(repImage.clip(aoi), lstCelsiusVis, '2. LST Celsius — ST_B10 Diagnostic');
Map.addLayer(repImage.clip(aoi), stQAVis, '3. ST_QA Uncertainty (Kelvin Diagnostic)');
Map.addLayer(aoi, {color: 'red', fillColor: '00000000'}, 'Mysuru Primary AOI Boundary');
