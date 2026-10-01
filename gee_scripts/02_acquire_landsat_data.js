/**
 * PROJECT: Machine Learning-Based Urban Heat Hotspot Detection Using LST, NDVI and NDBI from Landsat Imagery
 * STUDY AREA: Mysuru, Karnataka, India
 * STEP 2: Landsat 8/9 Data Acquisition, QA Cloud/Shadow Masking & Physical Scale-Factor Calibration
 * 
 * DESCRIPTION:
 * Filters USGS Landsat 8 & 9 Collection 2 Level-2 Surface Reflectance / Surface Temperature datasets
 * for the pre-monsoon study window (April 1 - June 30).
 * Applies QA_PIXEL bitmasking for clouds, cloud shadows, dilated clouds, and cirrus.
 * Applies official USGS multiplicative scale factors and additive offsets to optical and thermal bands.
 */

// ==============================================================================
// 1. DEFINE AOI & STUDY PERIOD PARAMETERS
// ==============================================================================

// Defined Mysuru Urban/Peri-Urban AOI Polygon (from Step 1)
var aoi = ee.Geometry.Polygon([
  [
    [76.5500, 12.4000],
    [76.7800, 12.4000],
    [76.7800, 12.2000],
    [76.5500, 12.2000],
    [76.5500, 12.4000]
  ]
]);

// Study Window: Pre-Monsoon Period (April 1 to June 30)
var startDate = '2023-04-01';
var endDate   = '2023-06-30';

// ==============================================================================
// 2. QA CLOUD & SHADOW MASKING FUNCTION
// ==============================================================================

/**
 * Masks clouds, cloud shadows, dilated clouds, and cirrus in Landsat Collection 2 Level-2 images.
 * Uses bitwise operations on the QA_PIXEL band.
 * 
 * Bit 1: Dilated Cloud
 * Bit 2: Cirrus
 * Bit 3: Cloud
 * Bit 4: Cloud Shadow
 */
function maskLandsatSR(image) {
  var qa = image.select('QA_PIXEL');
  
  var dilatedCloudBitMask = 1 << 1;
  var cirrusBitMask       = 1 << 2;
  var cloudBitMask        = 1 << 3;
  var cloudShadowBitMask  = 1 << 4;
  
  // Create binary mask: Keep pixels where all cloud/shadow bits are 0
  var mask = qa.bitwiseAnd(dilatedCloudBitMask).eq(0)
    .and(qa.bitwiseAnd(cirrusBitMask).eq(0))
    .and(qa.bitwiseAnd(cloudBitMask).eq(0))
    .and(qa.bitwiseAnd(cloudShadowBitMask).eq(0));
    
  return image.updateMask(mask);
}

// ==============================================================================
// 3. PHYSICAL SCALE-FACTOR & CALIBRATION FUNCTION
// ==============================================================================

/**
 * Applies official USGS Collection 2 Level-2 scale factors to optical and thermal bands.
 * Optical Bands (SR_B1 to SR_B7): Reflectance = (DN * 0.0000275) - 0.2
 * Thermal Band (ST_B10): Temperature (Kelvin) = (DN * 0.00341802) + 149.0
 * Converts Kelvin to Celsius: ST_Celsius = ST_Kelvin - 273.15
 */
function applyScaleFactors(image) {
  // Scale optical Surface Reflectance bands
  var opticalBands = image.select('SR_B.').multiply(0.0000275).add(-0.2);
  
  // Scale thermal Surface Temperature band (Kelvin)
  var thermalBandKelvin = image.select('ST_B10').multiply(0.00341802).add(149.0);
  
  // Convert Surface Temperature from Kelvin to Celsius
  var thermalBandCelsius = thermalBandKelvin.subtract(273.15).rename('ST_Celsius');
  
  // Replace original scaled bands with calibrated physical bands
  return image.addBands(opticalBands, null, true)
              .addBands(thermalBandKelvin, null, true)
              .addBands(thermalBandCelsius);
}

// ==============================================================================
// 4. DATA ACQUISITION & COLLECTION FILTERING
// ==============================================================================

// Load Landsat 8 Collection 2 Level-2
var l8Collection = ee.ImageCollection("LANDSAT/LC08/C02/T1_L2")
  .filterBounds(aoi)
  .filterDate(startDate, endDate)
  .filter(ee.Filter.lt('CLOUD_COVER', 30));

// Load Landsat 9 Collection 2 Level-2
var l9Collection = ee.ImageCollection("LANDSAT/LC09/C02/T1_L2")
  .filterBounds(aoi)
  .filterDate(startDate, endDate)
  .filter(ee.Filter.lt('CLOUD_COVER', 30));

// Merge Landsat 8 and Landsat 9 collections
var mergedCollection = l8Collection.merge(l9Collection);

// Process Collection: Apply QA masking and Scale Factors
var processedCollection = mergedCollection
  .map(maskLandsatSR)
  .map(applyScaleFactors);

// Generate spatial median composite over pre-monsoon window
var medianComposite = processedCollection.median().clip(aoi);

// ==============================================================================
// 5. VALIDATION REPORT & CONSOLE CHECKS
// ==============================================================================

print('=====================================================');
print('STEP 2: LANDSAT DATA ACQUISITION & PROCESSING REPORT');
print('=====================================================');
print('Study Period:', startDate, 'to', endDate);
print('Landsat 8 Scenes Found:', l8Collection.size());
print('Landsat 9 Scenes Found:', l9Collection.size());
print('Total Merged Scenes:', mergedCollection.size());
print('Bands in Processed Composite:', medianComposite.bandNames());
print('=====================================================');

// ==============================================================================
// 6. MAP VISUALIZATION
// ==============================================================================

Map.centerObject(aoi, 11);
Map.setOptions('HYBRID');

// True Color Composite (Bands 4, 3, 2) - Reflectance range [0, 0.3]
var trueColorVis = {
  bands: ['SR_B4', 'SR_B3', 'SR_B2'],
  min: 0.0,
  max: 0.3
};

// False Color InfraRed (CIR) Composite (Bands 5, 4, 3) - Vegetation highlighted red
var cirVis = {
  bands: ['SR_B5', 'SR_B4', 'SR_B3'],
  min: 0.0,
  max: 0.4
};

// Surface Temperature Vis (°C) - Pre-monsoon surface heat [25°C to 50°C]
var tempVis = {
  bands: ['ST_Celsius'],
  min: 25.0,
  max: 50.0,
  palette: ['blue', 'cyan', 'green', 'yellow', 'orange', 'red', 'darkred']
};

// Add Visualization Layers to Map Canvas
Map.addLayer(medianComposite, trueColorVis, 'Landsat 8/9 True Color (RGB)');
Map.addLayer(medianComposite, cirVis, 'Landsat 8/9 Color IR (CIR)');
Map.addLayer(medianComposite, tempVis, 'Uncalibrated Surface Temperature (°C)');
Map.addLayer(aoi, {color: 'red', fillColor: '00000000'}, 'Mysuru AOI');
