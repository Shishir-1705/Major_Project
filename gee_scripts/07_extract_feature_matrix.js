/************************************************************
 * PROJECT:
 * Machine Learning-Based Urban Heat Hotspot Detection
 * Using LST, NDVI and NDBI from Landsat Imagery
 *
 * STUDY AREA:
 * Mysuru, Karnataka, India
 *
 * STEP 7:
 * Feature Matrix Extraction & Stratified Sampling
 * (With Spatial Metadata: Longitude & Latitude)
 *
 * PURPOSE:
 * 1. Reconstruct the validated Step 6 processing pipeline.
 * 2. Create ML predictors:
 *      X = NDVI, NDBI
 * 3. Use LST-derived hotspot_label as target Y.
 * 4. Attach pixel longitude & latitude as spatial metadata for spatially aware validation.
 * 5. Strictly exclude LST_Celsius from predictors.
 * 6. Extract 500 samples per class (1,000 total).
 * 7. Export the resulting feature table to CSV with selectors:
 *      ['NDVI', 'NDBI', 'hotspot_label', 'longitude', 'latitude']
 ************************************************************/


// ==========================================================
// 1. AOI & STUDY PERIOD
// ==========================================================

var aoi = ee.Geometry.Polygon([
  [
    [76.55, 12.40],
    [76.78, 12.40],
    [76.78, 12.20],
    [76.55, 12.20],
    [76.55, 12.40]
  ]
]);

var startDate = '2023-04-01';
var endDate   = '2023-07-01';

print('====================================================');
print('STEP 7: FEATURE MATRIX EXTRACTION & SAMPLING');
print('====================================================');

print('Study Period:', startDate, 'to', endDate);
print('AOI:', aoi);


// ==========================================================
// 2. DATASET IDENTIFIERS
// ==========================================================

var landsat8Dataset = 'LANDSAT/LC08/C02/T1_L2';
var landsat9Dataset = 'LANDSAT/LC09/C02/T1_L2';
var dwDataset       = 'GOOGLE/DYNAMICWORLD/V1';


// ==========================================================
// 3. LANDSAT CLOUD / SHADOW MASK
// ==========================================================

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


// ==========================================================
// 4. LANDSAT SCALE FACTORS
// ==========================================================

function applyScaleFactors(image) {

  var opticalBands = image
    .select('SR_B.')
    .multiply(0.0000275)
    .add(-0.2);

  var thermalBandKelvin = image
    .select('ST_B10')
    .multiply(0.00341802)
    .add(149.0);

  var stQA = image
    .select('ST_QA')
    .multiply(0.01)
    .rename('ST_QA_Kelvin');

  return image
    .addBands(opticalBands, null, true)
    .addBands(thermalBandKelvin, null, true)
    .addBands(stQA, null, true);
}


// ==========================================================
// 5. ADD LST IN CELSIUS
// ==========================================================

function addLSTCelsius(image) {

  var stKelvin = image.select('ST_B10');

  var lstCelsius = stKelvin
    .subtract(273.15)
    .rename('LST_Celsius');

  return image.addBands(lstCelsius);
}


// ==========================================================
// 6. NDVI
// ==========================================================

function addNDVI(image) {

  var nir = image.select('SR_B5');
  var red = image.select('SR_B4');

  var denominator = nir.add(red);

  var ndvi = image.expression(
    '(NIR - RED) / (NIR + RED)',
    {
      'NIR': nir,
      'RED': red
    }
  )
  .rename('NDVI')
  .updateMask(denominator.neq(0));

  return image.addBands(ndvi);
}


// ==========================================================
// 7. NDBI
// ==========================================================

function addNDBI(image) {

  var swir1 = image.select('SR_B6');
  var nir   = image.select('SR_B5');

  var denominator = swir1.add(nir);

  var ndbi = image.expression(
    '(SWIR1 - NIR) / (SWIR1 + NIR)',
    {
      'SWIR1': swir1,
      'NIR': nir
    }
  )
  .rename('NDBI')
  .updateMask(denominator.neq(0));

  return image.addBands(ndbi);
}


// ==========================================================
// 8. LOAD LANDSAT 8
// ==========================================================

var landsat8 = ee.ImageCollection(landsat8Dataset)
  .filterBounds(aoi)
  .filterDate(startDate, endDate)
  .filter(ee.Filter.eq('PROCESSING_LEVEL', 'L2SP'))
  .map(maskLandsat)
  .map(applyScaleFactors)
  .map(addLSTCelsius)
  .map(addNDVI)
  .map(addNDBI);


// ==========================================================
// 9. LOAD LANDSAT 9
// ==========================================================

var landsat9 = ee.ImageCollection(landsat9Dataset)
  .filterBounds(aoi)
  .filterDate(startDate, endDate)
  .filter(ee.Filter.eq('PROCESSING_LEVEL', 'L2SP'))
  .map(maskLandsat)
  .map(applyScaleFactors)
  .map(addLSTCelsius)
  .map(addNDVI)
  .map(addNDBI);


// ==========================================================
// 10. MERGE LANDSAT COLLECTIONS
// ==========================================================

var mergedProcessed = landsat8
  .merge(landsat9)
  .sort('system:time_start');

print('Landsat 8 Scene Count:', landsat8.size());
print('Landsat 9 Scene Count:', landsat9.size());
print('Combined Processed Scene Count:', mergedProcessed.size());


// ==========================================================
// 11. REPRESENTATIVE SCENE
// ==========================================================

var representativeImage = ee.Image(
  mergedProcessed.first()
);

print(
  'Representative Scene:',
  representativeImage.id()
);

print(
  'Representative Acquisition:',
  representativeImage
    .date()
    .format('YYYY-MM-dd HH:mm:ss')
);

print(
  'Representative WRS Path:',
  representativeImage.get('WRS_PATH')
);

print(
  'Representative WRS Row:',
  representativeImage.get('WRS_ROW')
);

print(
  'Processing Level:',
  representativeImage.get('PROCESSING_LEVEL')
);

print(
  'Spacecraft:',
  representativeImage.get('SPACECRAFT_ID')
);


// ==========================================================
// 12. TARGET PROJECTION
// ==========================================================

var targetProj = representativeImage
  .select('ST_B10')
  .projection();

print(
  'Target Projection:',
  targetProj
);


// ==========================================================
// 13. REPRESENTATIVE-SCENE VARIABLES
// ==========================================================

var representativeLST = representativeImage
  .select('LST_Celsius');

var representativeNDVI = representativeImage
  .select('NDVI');

var representativeNDBI = representativeImage
  .select('NDBI');


// ==========================================================
// 14. DYNAMIC WORLD BUILT-UP MASK
// ==========================================================

var dwCollection = ee.ImageCollection(dwDataset)
  .filterBounds(aoi)
  .filterDate(startDate, endDate);

print(
  'Dynamic World Scene Count:',
  dwCollection.size()
);


var builtProbability10m = dwCollection
  .select('built')
  .mean();


var dwProjection = dwCollection
  .first()
  .select('built')
  .projection();


var builtProbability30m = builtProbability10m
  .setDefaultProjection(dwProjection)
  .reduceResolution({
    reducer: ee.Reducer.mean(),
    maxPixels: 1024
  })
  .reproject({
    crs: targetProj
  })
  .clip(aoi);


var builtMask30m = builtProbability30m
  .gte(0.5)
  .rename('Built_Up_Mask');


// ==========================================================
// 15. CREATE LST-DERIVED TARGET LABEL
// ==========================================================

var urbanLST = representativeLST
  .updateMask(builtMask30m)
  .rename('LST_Celsius');


// ==========================================================
// 16. CALCULATE P20 AND P80
// ==========================================================

var percentiles = urbanLST.reduceRegion({
  reducer: ee.Reducer.percentile([20, 80]),
  geometry: aoi,
  scale: 30,
  crs: targetProj,
  maxPixels: 1e9,
  tileScale: 4
});


print(
  'RAW LST PERCENTILE DICTIONARY:',
  percentiles
);


var p20 = ee.Number(
  percentiles.get('LST_Celsius_p20')
);

var p80 = ee.Number(
  percentiles.get('LST_Celsius_p80')
);


print(
  'LST P20 (°C):',
  p20
);

print(
  'LST P80 (°C):',
  p80
);


print(
  'Percentile Threshold Check:',
  ee.Algorithms.If(
    p80.gt(p20),
    'VALID: P80 is greater than P20.',
    'WARNING: P80 is not greater than P20.'
  )
);


// ==========================================================
// 17. CREATE HOTSPOT LABEL
// ==========================================================

var nonHotspotMask = urbanLST
  .lte(ee.Image.constant(p20))
  .rename('NonHotspot');


var hotspotMask = urbanLST
  .gte(ee.Image.constant(p80))
  .rename('Hotspot');


var validLabelMask = nonHotspotMask
  .or(hotspotMask);


var labelImage = ee.Image(0)
  .where(nonHotspotMask, 0)
  .where(hotspotMask, 1)
  .updateMask(validLabelMask)
  .rename('hotspot_label')
  .toByte();


// ==========================================================
// 18. ASSEMBLE FEATURE STACK (WITH LON/LAT METADATA)
// ==========================================================
//
// X = NDVI + NDBI
// Y = hotspot_label
// Spatial Metadata = longitude, latitude
//
// LST_Celsius is deliberately NOT included.
//

var lonLat = ee.Image.pixelLonLat();

var predictorStack = ee.Image.cat([
  representativeNDVI,
  representativeNDBI,
  labelImage,
  lonLat.select(['longitude', 'latitude'])
])
.updateMask(builtMask30m)
.updateMask(validLabelMask);


print(
  'Feature Stack Bands:',
  predictorStack.bandNames()
);


// ==========================================================
// 19. VALID SAMPLING MASK
// ==========================================================

var samplingMask = builtMask30m
  .gt(0)
  .and(representativeNDVI.mask().gt(0))
  .and(representativeNDBI.mask().gt(0))
  .and(labelImage.mask().gt(0));


var samplingImage = predictorStack
  .updateMask(samplingMask);


// ==========================================================
// 20. STRATIFIED SAMPLING
// ==========================================================

var numPointsPerClass = 500;

var sampleSeed = 42;


var sampledFeatures = samplingImage
  .stratifiedSample({

    numPoints: numPointsPerClass,

    classBand: 'hotspot_label',

    region: aoi,

    scale: 30,

    projection: targetProj,

    seed: sampleSeed,

    geometries: false,

    dropNulls: true,

    tileScale: 4
  });


// ==========================================================
// 21. SAMPLE DIAGNOSTICS
// ==========================================================

var totalSampleCount = sampledFeatures.size();


var class0Count = sampledFeatures
  .filter(
    ee.Filter.eq('hotspot_label', 0)
  )
  .size();


var class1Count = sampledFeatures
  .filter(
    ee.Filter.eq('hotspot_label', 1)
  )
  .size();


var class0Num = ee.Number(class0Count);

var class1Num = ee.Number(class1Count);

var totalNum = ee.Number(totalSampleCount);


var class0Pct = ee.Algorithms.If(
  totalNum.gt(0),
  class0Num
    .divide(totalNum)
    .multiply(100),
  0
);


var class1Pct = ee.Algorithms.If(
  totalNum.gt(0),
  class1Num
    .divide(totalNum)
    .multiply(100),
  0
);


// ==========================================================
// 22. FEATURE PROPERTY AUDIT
// ==========================================================

var firstFeatureProperties = ee.Feature(
  sampledFeatures.first()
)
.propertyNames();


var containsLST = ee.List([

  firstFeatureProperties.contains('LST_Celsius'),

  firstFeatureProperties.contains('LST'),

  firstFeatureProperties.contains('ST_B10')

]).contains(true);


var leakageCheckStatus = ee.Algorithms.If(

  containsLST,

  'WARNING: Target leakage detected! Thermal band/LST is present in feature properties.',

  'VALID: LST_Celsius is strictly EXCLUDED from feature properties.'
);


// ==========================================================
// 23. EXPECTED PROPERTY CHECK
// ==========================================================

var ndviPresent =
  firstFeatureProperties.contains('NDVI');

var ndbiPresent =
  firstFeatureProperties.contains('NDBI');

var labelPresent =
  firstFeatureProperties.contains('hotspot_label');

var lonPresent =
  firstFeatureProperties.contains('longitude');

var latPresent =
  firstFeatureProperties.contains('latitude');


var expectedPropertyCheck = ee.Algorithms.If(

  ndviPresent,

  ee.Algorithms.If(

    ndbiPresent,

    ee.Algorithms.If(

      labelPresent,

      ee.Algorithms.If(

        lonPresent,

        ee.Algorithms.If(

          latPresent,

          'VALID: NDVI, NDBI, hotspot_label, longitude, and latitude are present.',

          'WARNING: latitude is missing.'

        ),

        'WARNING: longitude is missing.'

      ),

      'WARNING: hotspot_label is missing.'

    ),

    'WARNING: NDBI is missing.'

  ),

  'WARNING: NDVI is missing.'
);


// ==========================================================
// 24. PRINT FINAL DIAGNOSTIC REPORT
// ==========================================================

print('====================================================');

print(
  'STEP 7: FEATURE MATRIX EXTRACTION & SAMPLING'
);

print('====================================================');


print(
  'Landsat 8 L2SP Scene Count:',
  landsat8.size()
);


print(
  'Landsat 9 L2SP Scene Count:',
  landsat9.size()
);


print(
  'Combined L2SP Scene Count:',
  mergedProcessed.size()
);


print(
  'Representative Landsat Scene:',
  representativeImage.get('system:index')
);


print(
  'Representative Acquisition Date:',
  representativeImage
    .date()
    .format('YYYY-MM-dd HH:mm:ss')
);


print(
  'Acquisition Time Zone:',
  'UTC'
);


print(
  'Dynamic World Scene Count:',
  dwCollection.size()
);


print('----------------------------------------------------');


print(
  'LST RELATIVE PERCENTILES:'
);


print(
  'P20 (°C):',
  p20
);


print(
  'P80 (°C):',
  p80
);


print('----------------------------------------------------');


print(
  'PREDICTOR & TARGET SPECIFICATION:'
);


print(
  'Predictor Feature Names (X):',
  ['NDVI', 'NDBI']
);


print(
  'Target Property Name (Y):',
  'hotspot_label'
);


print(
  'Spatial Metadata:',
  ['longitude', 'latitude']
);


print(
  'Sampling Scale:',
  '30 meters'
);


print(
  'Sampling Seed:',
  sampleSeed
);


print(
  'Samples Per Class:',
  numPointsPerClass
);


print(
  'Drop Nulls Active:',
  true
);


print('----------------------------------------------------');


print(
  'SAMPLE SIZE & CLASS BALANCE:'
);


print(
  'Total Sampled Features Count:',
  totalSampleCount
);


print(
  'Class 0 (Non-Hotspot <= P20) Sample Count:',
  class0Count
);


print(
  'Class 0 Percentage:',
  class0Pct
);


print(
  'Class 1 (Hotspot >= P80) Sample Count:',
  class1Count
);


print(
  'Class 1 Percentage:',
  class1Pct
);


print('----------------------------------------------------');


print(
  'TARGET LEAKAGE PREVENTION CHECK:',
  leakageCheckStatus
);


print(
  'Sampled Feature Property Names:',
  firstFeatureProperties
);


print(
  'Expected Property Check:',
  expectedPropertyCheck
);


print('----------------------------------------------------');


print(
  'FIRST 5 SAMPLE ROWS:',
  sampledFeatures.limit(5)
);


print('====================================================');


// ==========================================================
// 25. EXPORT FEATURE TABLE
// ==========================================================

Export.table.toDrive({

  collection: sampledFeatures,

  description:
    'Mysuru_Urban_Heat_Hotspot_Features_Step7',

  fileNamePrefix:
    'Mysuru_Urban_Heat_Hotspot_Features_Step7',

  fileFormat: 'CSV',

  selectors: [
    'NDVI',
    'NDBI',
    'hotspot_label',
    'longitude',
    'latitude'
  ]

});


// ==========================================================
// 26. VISUALIZE SAMPLE LOCATIONS
// ==========================================================

var sampledFeaturesWithGeom = predictorStack
  .stratifiedSample({

    numPoints: 100,

    classBand: 'hotspot_label',

    region: aoi,

    scale: 30,

    projection: targetProj,

    seed: sampleSeed,

    geometries: true,

    dropNulls: true,

    tileScale: 4
  });


Map.centerObject(aoi, 11);

Map.setOptions('HYBRID');


Map.addLayer(
  labelImage.clip(aoi),
  {
    min: 0,
    max: 1,
    palette: ['blue', 'red']
  },
  'LST Hotspot Reference Labels (0=Cooler, 1=Hotspot)'
);


Map.addLayer(
  sampledFeaturesWithGeom.filter(
    ee.Filter.eq('hotspot_label', 0)
  ),
  {
    color: 'cyan'
  },
  'Sampled Class 0 Locations (Cooler)'
);


Map.addLayer(
  sampledFeaturesWithGeom.filter(
    ee.Filter.eq('hotspot_label', 1)
  ),
  {
    color: 'magenta'
  },
  'Sampled Class 1 Locations (Hotspot)'
);


Map.addLayer(
  aoi,
  {
    color: 'yellow',
    fillColor: '00000000'
  },
  'Mysuru Primary AOI Boundary'
);


// ==========================================================
// 27. FINAL METHODOLOGY SUMMARY
// ==========================================================

print('====================================================');

print(
  'STEP 7 METHODOLOGY SUMMARY'
);

print('====================================================');


print(
  'Predictors X:',
  'NDVI, NDBI'
);


print(
  'Target Y:',
  'hotspot_label'
);


print(
  'Spatial Metadata:',
  'longitude, latitude (NOT used as ML predictors)'
);


print(
  'LST Usage:',
  'Used only to construct target labels; excluded from X'
);


print(
  'Sampling:',
  '500 samples per class'
);


print(
  'Total Target Samples:',
  '1,000'
);


print(
  'Sampling Resolution:',
  '30 meters'
);


print(
  'Random Seed:',
  42
);


print(
  'Export:',
  'Mysuru_Urban_Heat_Hotspot_Features_Step7.csv'
);


print('====================================================');

print(
  'STEP 7 SCRIPT EXECUTION COMPLETE'
);

print('====================================================');
