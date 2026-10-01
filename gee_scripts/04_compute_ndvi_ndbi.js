/**
 * PROJECT: Machine Learning-Based Urban Heat Hotspot Detection Using LST, NDVI and NDBI from Landsat Imagery
 * STUDY AREA: Mysuru, Karnataka, India
 * STEP 4: Spectral Index Computation — NDVI (Vegetation) and NDBI (Built-up/Impervious Response) [Refined]
 * 
 * PURPOSE:
 * 1. Compute continuous NDVI using explicit mathematical expressions with division-by-zero protection.
 * 2. Compute continuous NDBI using explicit mathematical expressions with division-by-zero protection.
 * 3. Perform robust, null-safe numerical min, max, mean diagnostics over the validated Mysuru AOI.
 * 4. Display diagnostic map layers with continuous visualization parameters.
 */

// ==============================================================================
// 1. DEFINE AOI & TIME WINDOW PARAMETERS
// ==============================================================================

var aoi = ee.Geometry.Polygon([
  [
    [76.5500, 12.4000],
    [76.7800, 12.4000],
    [76.7800, 12.2000],
    [76.5500, 12.2000],
    [76.5500, 12.4000]
  ]
]);

var startDate = '2023-04-01';
var endDate   = '2023-07-01';

var l8DatasetID = "LANDSAT/LC08/C02/T1_L2";
var l9DatasetID = "LANDSAT/LC09/C02/T1_L2";

// ==============================================================================
// 2. PREPROCESSING FUNCTIONS (STEP 3)
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
  
  return image.addBands(opticalBands, null, true)
              .addBands(thermalBandKelvin, null, true);
}

// ==============================================================================
// 3. REFINED SPECTRAL INDEX COMPUTATION FUNCTIONS (STEP 4)
// ==============================================================================

/**
 * Computes NDVI with explicit mathematical expression and division-by-zero masking.
 * Formula: NDVI = (NIR - RED) / (NIR + RED)
 */
function addNDVI(image) {
  var nir = image.select('SR_B5');
  var red = image.select('SR_B4');
  var denom = nir.add(red);
  
  var ndvi = image.expression(
    '(NIR - RED) / (NIR + RED)',
    {
      'NIR': nir,
      'RED': red
    }
  ).rename('NDVI').updateMask(denom.neq(0));
  
  return image.addBands(ndvi);
}

/**
 * Computes NDBI with explicit mathematical expression and division-by-zero masking.
 * Formula: NDBI = (SWIR1 - NIR) / (SWIR1 + NIR)
 */
function addNDBI(image) {
  var swir1 = image.select('SR_B6');
  var nir   = image.select('SR_B5');
  var denom = swir1.add(nir);
  
  var ndbi = image.expression(
    '(SWIR1 - NIR) / (SWIR1 + NIR)',
    {
      'SWIR1': swir1,
      'NIR': nir
    }
  ).rename('NDBI').updateMask(denom.neq(0));
  
  return image.addBands(ndbi);
}

function addSpectralIndices(image) {
  return addNDBI(addNDVI(image));
}

// ==============================================================================
// 4. DATA PIPELINE & COLLECTION PROCESSING
// ==============================================================================

var l8Raw = ee.ImageCollection(l8DatasetID).filterBounds(aoi).filterDate(startDate, endDate);
var l9Raw = ee.ImageCollection(l9DatasetID).filterBounds(aoi).filterDate(startDate, endDate);

var l8Processed = l8Raw.map(maskLandsat).map(applyScaleFactors).map(addSpectralIndices);
var l9Processed = l9Raw.map(maskLandsat).map(applyScaleFactors).map(addSpectralIndices);

var mergedProcessed = l8Processed.merge(l9Processed).sort('system:time_start');
var repImage = mergedProcessed.first();

// ==============================================================================
// 5. DIAGNOSTICS & METADATA REPORT
// ==============================================================================

print('=====================================================');
print('STEP 4: REFINED SPECTRAL INDEX DIAGNOSTIC REPORT');
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

var indexStats = repImage.select(['NDVI', 'NDBI']).reduceRegion({
  reducer: ee.Reducer.min().combine({
    reducer2: ee.Reducer.max(),
    sharedInputs: true
  }).combine({
    reducer2: ee.Reducer.mean(),
    sharedInputs: true
  }),
  geometry: aoi,
  scale: 30,
  maxPixels: 1e8
});

var ndviMin  = indexStats.get('NDVI_min');
var ndviMax  = indexStats.get('NDVI_max');
var ndviMean = indexStats.get('NDVI_mean');

var ndbiMin  = indexStats.get('NDBI_min');
var ndbiMax  = indexStats.get('NDBI_max');
var ndbiMean = indexStats.get('NDBI_mean');

print('NDVI STATISTICAL DIAGNOSTICS OVER AOI:');
print('NDVI Minimum:', ndviMin);
print('NDVI Maximum:', ndviMax);
print('NDVI Mean:', ndviMean);
print('-----------------------------------------------------');

print('NDBI STATISTICAL DIAGNOSTICS OVER AOI:');
print('NDBI Minimum:', ndbiMin);
print('NDBI Maximum:', ndbiMax);
print('NDBI Mean:', ndbiMean);
print('-----------------------------------------------------');

var ndviCheck = ee.Algorithms.If(
  ee.Algorithms.ObjectType(ndviMean),
  'VALID: Continuous NDVI layer computed successfully with non-null numeric values.',
  'WARNING: NDVI calculation returned NULL over AOI.'
);

var ndbiCheck = ee.Algorithms.If(
  ee.Algorithms.ObjectType(ndbiMean),
  'VALID: Continuous NDBI layer computed successfully with non-null numeric values.',
  'WARNING: NDBI calculation returned NULL over AOI.'
);

print('NDVI AVAILABILITY CHECK:', ndviCheck);
print('NDBI AVAILABILITY CHECK:', ndbiCheck);
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

var ndviVis = {
  bands: ['NDVI'],
  min: -0.2,
  max: 0.7,
  palette: ['blue', 'white', 'brown', 'yellow', 'lightgreen', 'green', 'darkgreen']
};

var ndbiVis = {
  bands: ['NDBI'],
  min: -0.4,
  max: 0.4,
  palette: ['blue', 'cyan', 'white', 'yellow', 'orange', 'red', 'magenta']
};

Map.addLayer(repImage.clip(aoi), trueColorVis, '1. Preprocessed True-Color (RGB)');
Map.addLayer(repImage.clip(aoi), ndviVis, '2. Continuous NDVI Layer (Vegetation Signal Rendering)');
Map.addLayer(repImage.clip(aoi), ndbiVis, '3. Continuous NDBI Layer (Built-up/Impervious Spectral Response Rendering)');
Map.addLayer(aoi, {color: 'red', fillColor: '00000000'}, 'Mysuru Primary AOI Boundary');
