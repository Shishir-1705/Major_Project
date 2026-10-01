/**
 * PROJECT: Machine Learning-Based Urban Heat Hotspot Detection Using LST, NDVI and NDBI from Landsat Imagery
 * STUDY AREA: Mysuru, Karnataka, India
 * STEP 6: Generation of LST-Derived Thermal Hotspot Reference Labels (Direct Percentiles & Integer Counts)
 * 
 * PURPOSE:
 * 1. Load Google Dynamic World V1 imagery to compute pre-monsoon mean built probability (10m).
 * 2. Explicitly aggregate Dynamic World built probability to Landsat's 30m grid using reduceResolution().
 * 3. Construct project-defined 30m built-up confidence mask (built probability >= 0.5).
 * 4. Restrict validated single-scene Landsat 9 LST (2023-04-01) to valid unmasked 30m built-up pixels.
 * 5. Compute local relative thermal percentiles (P20 and P80) within the built-up spatial domain.
 * 6. Compute exact integer pixel counts for valid built-up LST pixels, Class 0, Class 1, and Excluded.
 * 7. Generate binary LST-derived thermal hotspot reference labels:
 *    - LST <= P20 : 0 = NON-HOTSPOT / RELATIVELY COOLER BUILT-UP SURFACE
 *    - LST >= P80 : 1 = HOTSPOT / RELATIVELY ELEVATED THERMAL SURFACE
 *    - P20 < LST < P80 : MASKED / EXCLUDED (Middle 60% excluded for binary class separation)
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

// Dataset Identifiers
var l8DatasetID = "LANDSAT/LC08/C02/T1_L2";
var l9DatasetID = "LANDSAT/LC09/C02/T1_L2";
var dwDatasetID = "GOOGLE/DYNAMICWORLD/V1";

// ==============================================================================
// 2. PREPROCESSING FUNCTIONS & LANDSAT LST PIPELINE
// ==============================================================================

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

function applyScaleFactors(image) {
  var opticalBands = image.select('SR_B.').multiply(0.0000275).add(-0.2);
  var thermalBandKelvin = image.select('ST_B10').multiply(0.00341802).add(149.0);
  var stQA = image.select('ST_QA').multiply(0.01).rename('ST_QA_Kelvin');
  
  return image.addBands(opticalBands, null, true)
              .addBands(thermalBandKelvin, null, true)
              .addBands(stQA, null, true);
}

function addLSTCelsius(image) {
  var stKelvin = image.select('ST_B10');
  var lstCelsius = stKelvin.subtract(273.15).rename('LST_Celsius');
  return image.addBands(lstCelsius);
}

// Load Preprocessed Landsat Collection
var l8Raw = ee.ImageCollection(l8DatasetID).filterBounds(aoi).filterDate(startDate, endDate);
var l9Raw = ee.ImageCollection(l9DatasetID).filterBounds(aoi).filterDate(startDate, endDate);

var l8Processed = l8Raw.map(maskLandsat).map(applyScaleFactors).map(addLSTCelsius);
var l9Processed = l9Raw.map(maskLandsat).map(applyScaleFactors).map(addLSTCelsius);

var mergedProcessed = l8Processed.merge(l9Processed).sort('system:time_start');

// Representative Single Scene (Validated First Chronological Scene: 2023-04-01)
var repImage = mergedProcessed.first();
var repLST   = repImage.select('LST_Celsius');
var targetProj = repLST.projection();

// ==============================================================================
// 3. EXPLICIT SPATIAL ALIGNMENT & BUILT-UP MASK GENERATION
// ==============================================================================

// Query Dynamic World V1 collection over AOI and pre-monsoon period
var dwCol = ee.ImageCollection(dwDatasetID)
  .filterBounds(aoi)
  .filterDate(startDate, endDate);

var dwCount = dwCol.size();

// Native 10m mean built probability across pre-monsoon period
var builtProb10m = dwCol.select('built').mean();

// Obtain nominal 10m projection from an actual Dynamic World scene in collection
var dwProj = dwCol.first().select('built').projection();

// Explicit spatial aggregation from 10m to Landsat 30m grid
var builtProb30m = builtProb10m
  .setDefaultProjection(dwProj)
  .reduceResolution({
    reducer: ee.Reducer.mean(),
    maxPixels: 1024
  })
  .reproject({
    crs: targetProj
  })
  .clip(aoi);

// Project-defined 30m built-up confidence mask (built probability >= 0.5)
var builtMask30m = builtProb30m.gte(0.5);

// Restrict valid Landsat LST to valid unmasked 30m built-up pixels and rename band explicitly
var urbanLST = repLST
  .updateMask(builtMask30m)
  .rename('LST_Celsius');

// ==============================================================================
// 4. PERCENTILE CALCULATION & PRINT DIAGNOSTICS
// ==============================================================================

// Compute P20 and P80 percentiles of valid urban LST over AOI
var percentiles = urbanLST.reduceRegion({
  reducer: ee.Reducer.percentile([20, 80]),
  geometry: aoi,
  scale: 30,
  crs: targetProj,
  maxPixels: 1e9,
  tileScale: 4
});

// Print Raw Percentile Dictionary
print('RAW LST PERCENTILE DICTIONARY:', percentiles);

var p20 = ee.Number(percentiles.get('LST_Celsius_p20'));
var p80 = ee.Number(percentiles.get('LST_Celsius_p80'));

print('P20 (°C):', p20);
print('P80 (°C):', p80);
print('PERCENTILE THRESHOLD CHECK:', p80.gt(p20));

// Threshold Images
var p20Img = ee.Image.constant(p20);
var p80Img = ee.Image.constant(p80);

var nonHotspotMask = urbanLST.lte(p20Img).rename('NonHotspot');
var hotspotMask    = urbanLST.gte(p80Img).rename('Hotspot');
var validLabelMask = nonHotspotMask.or(hotspotMask);

// Binary label image construction
var labelImage = ee.Image(0)
  .where(nonHotspotMask, 0)
  .where(hotspotMask, 1)
  .updateMask(validLabelMask)
  .rename('hotspot_label');

// ==============================================================================
// 5. INTEGER PIXEL COUNTS & CLASS DISTRIBUTION DIAGNOSTICS
// ==============================================================================

// Valid Urban LST Pixel Mask (Integer Count via Sum)
var validUrbanPixelMask = urbanLST
  .mask()
  .gt(0)
  .rename('ValidUrbanPixel');

var validUrbanPixelCount = validUrbanPixelMask.reduceRegion({
  reducer: ee.Reducer.sum(),
  geometry: aoi,
  scale: 30,
  crs: targetProj,
  maxPixels: 1e9,
  tileScale: 4
}).get('ValidUrbanPixel');

// Class 0 Integer Pixel Count (LST <= P20)
var nonHotspotPixelCount = nonHotspotMask.reduceRegion({
  reducer: ee.Reducer.sum(),
  geometry: aoi,
  scale: 30,
  crs: targetProj,
  maxPixels: 1e9,
  tileScale: 4
}).get('NonHotspot');

// Class 1 Integer Pixel Count (LST >= P80)
var hotspotPixelCount = hotspotMask.reduceRegion({
  reducer: ee.Reducer.sum(),
  geometry: aoi,
  scale: 30,
  crs: targetProj,
  maxPixels: 1e9,
  tileScale: 4
}).get('Hotspot');

// Explicit Integer Conversions with .round()
var totalCountNum  = ee.Number(validUrbanPixelCount).round();
var nonHotCountNum = ee.Number(nonHotspotPixelCount).round();
var hotCountNum    = ee.Number(hotspotPixelCount).round();

var excludedCountNum = totalCountNum
  .subtract(nonHotCountNum)
  .subtract(hotCountNum);

var nonHotPct = ee.Algorithms.If(totalCountNum.gt(0), nonHotCountNum.divide(totalCountNum).multiply(100), 0);
var hotPct    = ee.Algorithms.If(totalCountNum.gt(0), hotCountNum.divide(totalCountNum).multiply(100), 0);
var exclPct   = ee.Algorithms.If(totalCountNum.gt(0), excludedCountNum.divide(totalCountNum).multiply(100), 0);

print('=====================================================');
print('STEP 6: THERMAL HOTSPOT REFERENCE LABEL DIAGNOSTIC REPORT');
print('=====================================================');
print('Dynamic World Collection Scene Count:', dwCount);
print('Representative Landsat Scene Index:', repImage.get('system:index'));
print('Acquisition Date:', repImage.date().format('YYYY-MM-dd HH:mm:ss'));
print('Acquisition Time Zone:', 'UTC');
print('Actual WRS Path / Row:', repImage.get('WRS_PATH'), '/', repImage.get('WRS_ROW'));
print('Processing Level:', repImage.get('PROCESSING_LEVEL'));
print('Spacecraft ID:', repImage.get('SPACECRAFT_ID'));
print('-----------------------------------------------------');
print('INTEGER PIXEL COUNTS & CLASS DISTRIBUTION (Landsat 30m Grid):');
print('Total Valid Urban LST Pixels:', totalCountNum);
print('Class 0 (Non-Hotspot <= P20) Pixel Count:', nonHotCountNum, '(', nonHotPct, '%)');
print('Class 1 (Hotspot >= P80) Pixel Count:', hotCountNum, '(', hotPct, '%)');
print('Excluded Intermediate (P20 < LST < P80) Pixel Count:', excludedCountNum, '(', exclPct, '%)');
print('-----------------------------------------------------');

// Validation Edge Case Status Checks
var dwCheck = ee.Algorithms.If(
  ee.Number(dwCount).gt(0),
  'VALID: Dynamic World collection present and non-empty.',
  'WARNING: Dynamic World collection is empty for study period.'
);

print('DYNAMIC WORLD DATASET CHECK:', dwCheck);
print('=====================================================');

// ==============================================================================
// 6. MAP CANVAS VISUALIZATION & DIAGNOSTIC LAYERS
// ==============================================================================

Map.centerObject(aoi, 11);
Map.setOptions('HYBRID');

var builtProbVis = {
  min: 0.0,
  max: 1.0,
  palette: ['blue', 'white', 'orange', 'red']
};

var lstCelsiusVis = {
  bands: ['LST_Celsius'],
  min: 25.0,
  max: 50.0,
  palette: ['blue', 'cyan', 'green', 'yellow', 'orange', 'red', 'darkred']
};

var labelVis = {
  min: 0,
  max: 1,
  palette: ['0000ff', 'ff0000']
};

Map.addLayer(builtProb30m, builtProbVis, '1. Dynamic World Mean Built Probability (Aligned 30m Grid)');
Map.addLayer(builtMask30m.selfMask().clip(aoi), {palette: ['ffaa00']}, '2. Project Built-Up Mask (30m Grid, prob >= 0.5)');
Map.addLayer(repLST.clip(aoi), lstCelsiusVis, '3. Representative LST Celsius (2023-04-01)');
Map.addLayer(labelImage.clip(aoi), labelVis, '4. LST-Derived Thermal Hotspot Reference Labels (0=Cooler, 1=Hotspot)');
Map.addLayer(aoi, {color: 'yellow', fillColor: '00000000'}, 'Mysuru Primary AOI Boundary');
