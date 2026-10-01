/**
 * PROJECT: Machine Learning-Based Urban Heat Hotspot Detection Using LST, NDVI and NDBI from Landsat Imagery
 * STUDY AREA: Mysuru, Karnataka, India
 * STEP 3: Landsat 8 & 9 Preprocessing — QA_PIXEL Masking & Scale-Factor Calibration (Corrected)
 * 
 * PURPOSE:
 * 1. Implement QA_PIXEL bitmasking for cloud, cloud shadow, dilated cloud, cirrus, snow, and fill data.
 * 2. Retain water bodies (do NOT mask water).
 * 3. Apply official USGS Collection 2 Level-2 multiplicative scale factors and additive offsets.
 * 4. Perform null-safe diagnostic checks on scaled reflectance and thermal values.
 * 
 * SCIENTIFIC CONSTRAINTS STRICTLY ENFORCED:
 * - NO hard-coded WRS Path/Row assertions.
 * - Null-safe ST_B10 thermal diagnostics.
 * - NO NDVI computation yet.
 * - NO NDBI computation yet.
 * - NO final LST layer creation yet.
 * - NO Machine Learning or hotspot label generation yet.
 */

// ==============================================================================
// 1. DEFINE AOI & STUDY PERIOD PARAMETERS
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
// 2. QA_PIXEL CLOUD / SHADOW MASKING FUNCTION
// ==============================================================================

/**
 * Applies QA_PIXEL bitmasking according to USGS Landsat Collection 2 Level-2 specs.
 * 
 * Bit Definitions:
 * - Bit 0: Fill (1 = Fill / No data)
 * - Bit 1: Dilated Cloud (1 = Dilated cloud)
 * - Bit 2: Cirrus (1 = High confidence cirrus)
 * - Bit 3: Cloud (1 = High confidence cloud)
 * - Bit 4: Cloud Shadow (1 = High confidence cloud shadow)
 * - Bit 5: Snow (1 = High confidence snow)
 * - Bit 6: Clear (1 = Clear surface)
 * - Bit 7: Water (1 = Water body) --> RETAINED (NOT MASKED)
 * 
 * @param {ee.Image} image - Raw Landsat Collection 2 Level-2 image
 * @returns {ee.Image} - Masked Landsat image with invalid pixels set to transparent
 */
function maskLandsat(image) {
  var qa = image.select('QA_PIXEL');
  
  var fillBit         = 1 << 0;
  var dilatedCloudBit = 1 << 1;
  var cirrusBit       = 1 << 2;
  var cloudBit        = 1 << 3;
  var cloudShadowBit  = 1 << 4;
  var snowBit         = 1 << 5;
  
  // Construct boolean mask: keep pixels where ALL invalid bits equal 0
  var mask = qa.bitwiseAnd(fillBit).eq(0)
    .and(qa.bitwiseAnd(dilatedCloudBit).eq(0))
    .and(qa.bitwiseAnd(cirrusBit).eq(0))
    .and(qa.bitwiseAnd(cloudBit).eq(0))
    .and(qa.bitwiseAnd(cloudShadowBit).eq(0))
    .and(qa.bitwiseAnd(snowBit).eq(0));
    
  return image.updateMask(mask);
}

// ==============================================================================
// 3. SCALE-FACTOR CALIBRATION FUNCTION
// ==============================================================================

/**
 * Applies official USGS Collection 2 Level-2 scale factors and offsets.
 * 
 * Equations:
 * - Surface Reflectance (SR_B1 to SR_B7): scaled = (DN * 0.0000275) - 0.2
 * - Surface Temperature (ST_B10): scaled Kelvin = (DN * 0.00341802) + 149.0
 * 
 * Note: Scales stored values into physical surface reflectance units and thermodynamic temperature (Kelvin).
 * 
 * @param {ee.Image} image - Landsat Level-2 image
 * @returns {ee.Image} - Calibrated image with scaled reflectance and thermal Kelvin bands
 */
function applyScaleFactors(image) {
  // Scale optical bands SR_B1 through SR_B7
  var opticalBands = image.select('SR_B.').multiply(0.0000275).add(-0.2);
  
  // Scale thermal band ST_B10 to Kelvin
  var thermalBandKelvin = image.select('ST_B10').multiply(0.00341802).add(149.0);
  
  // Replace unscaled bands with calibrated physical bands
  return image.addBands(opticalBands, null, true)
              .addBands(thermalBandKelvin, null, true);
}

// ==============================================================================
// 4. DATA COLLECTION INGESTION & PROCESSING PIPELINE
// ==============================================================================

// Load Raw Landsat 8 & 9 Collections over Mysuru AOI
var l8Raw = ee.ImageCollection(l8DatasetID).filterBounds(aoi).filterDate(startDate, endDate);
var l9Raw = ee.ImageCollection(l9DatasetID).filterBounds(aoi).filterDate(startDate, endDate);
var mergedRaw = l8Raw.merge(l9Raw).sort('system:time_start');

// Apply QA Masking and Scaling BEFORE Merging
var l8Processed = l8Raw.map(maskLandsat).map(applyScaleFactors);
var l9Processed = l9Raw.map(maskLandsat).map(applyScaleFactors);
var mergedProcessed = l8Processed.merge(l9Processed).sort('system:time_start');

// ==============================================================================
// 5. DIAGNOSTICS & METADATA VALIDATION REPORT
// ==============================================================================

print('=====================================================');
print('STEP 3: PREPROCESSING & CALIBRATION VALIDATION REPORT');
print('=====================================================');
print('Study Area:', 'Mysuru AOI (76.55-76.78 E, 12.20-12.40 N)');
print('Date Range:', startDate, 'to', endDate);
print('Raw Landsat 8 Scene Count:', l8Raw.size());
print('Raw Landsat 9 Scene Count:', l9Raw.size());
print('Total Raw Merged Collection Count:', mergedRaw.size());
print('Total Processed Collection Count:', mergedProcessed.size());
print('-----------------------------------------------------');

// Select Representative Image (First Scene in Merged Collection)
var repRawImage       = mergedRaw.first();
var repProcessedImage = mergedProcessed.first();

// Print Representative Scene Metadata Dynamically (No hardcoded Path/Row expectations)
print('REPRESENTATIVE SCENE METADATA:');
print('Scene System Index:', repRawImage.get('system:index'));
print('Acquisition Date:', repRawImage.date().format('YYYY-MM-dd HH:mm:ss'));
print('Acquisition Time Zone:', 'UTC');
print('Actual WRS Path:', repRawImage.get('WRS_PATH'));
print('Actual WRS Row:', repRawImage.get('WRS_ROW'));
print('Processing Level:', repRawImage.get('PROCESSING_LEVEL'));
print('Spacecraft ID:', repRawImage.get('SPACECRAFT_ID'));
print('Original Band Names:', repRawImage.bandNames());
print('-----------------------------------------------------');

// Calculate Mean Scaled Values over Mysuru AOI for Diagnostic Verification
var sampledValues = repProcessedImage.select(['SR_B4', 'SR_B5', 'SR_B6', 'ST_B10']).reduceRegion({
  reducer: ee.Reducer.mean(),
  geometry: aoi,
  scale: 30,
  maxPixels: 1e8
});

// Extract values for Null-Safe Evaluation
var stKelvinObj = sampledValues.get('ST_B10');

// Null-Safe Celsius Calculation & Availability Diagnostics
var stCelsiusDiag = ee.Algorithms.If(
  stKelvinObj,
  ee.Number(stKelvinObj).subtract(273.15),
  'ST_B10 unavailable or fully masked'
);

var stStatusReport = ee.Algorithms.If(
  stKelvinObj,
  'VALID: ST_B10 data is present and unmasked for this scene.',
  'WARNING: ST_B10 data is NULL or masked for this scene (Check Processing Level / Aux Data).'
);

print('DIAGNOSTIC SCALED BAND VALUES OVER AOI (Representative Scene):');
print('Red Reflectance (SR_B4):', sampledValues.get('SR_B4'));
print('NIR Reflectance (SR_B5):', sampledValues.get('SR_B5'));
print('SWIR1 Reflectance (SR_B6):', sampledValues.get('SR_B6'));
print('Thermal ST_B10 (Kelvin):', stKelvinObj);
print('Thermal ST_B10 (Celsius Diagnostic):', stCelsiusDiag);
print('ST_B10 AVAILABILITY CHECK:', stStatusReport);
print('=====================================================');

// ==============================================================================
// 6. MAP CANVAS VISUALIZATION & LAYER COMPARISON
// ==============================================================================

Map.centerObject(aoi, 11);
Map.setOptions('HYBRID');

// Scaled True-Color Visualization Parameters (Reflectance range: 0.0 to 0.3)
var scaledTrueColorVis = {
  bands: ['SR_B4', 'SR_B3', 'SR_B2'],
  min: 0.0,
  max: 0.3
};

// Diagnostic Surface Temperature Visualization (Kelvin range: 298 K to 323 K)
var thermalKelvinVis = {
  bands: ['ST_B10'],
  min: 298.0, // ~25°C
  max: 323.0, // ~50°C
  palette: ['blue', 'cyan', 'green', 'yellow', 'orange', 'red', 'darkred']
};

// 1. Raw Unmasked Representative Image (Scaled for comparison)
var repRawScaled = applyScaleFactors(repRawImage);
Map.addLayer(repRawScaled.clip(aoi), scaledTrueColorVis, '1. Representative Scene (BEFORE QA Masking)');

// 2. QA Masked & Scaled Representative Image
Map.addLayer(repProcessedImage.clip(aoi), scaledTrueColorVis, '2. Representative Scene (AFTER QA Masking)');

// 3. Calibrated Surface Temperature in Kelvin (Diagnostic Layer)
Map.addLayer(repProcessedImage.clip(aoi), thermalKelvinVis, '3. Surface Temperature ST_B10 (Kelvin Diagnostic)');

// 4. Mysuru AOI Boundary
Map.addLayer(aoi, {color: 'red', fillColor: '00000000'}, 'Mysuru Primary AOI Boundary');
