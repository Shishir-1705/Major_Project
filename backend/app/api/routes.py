from fastapi import APIRouter, HTTPException, Query, Response
from fastapi.responses import Response

from ..schemas.responses import (
    MetadataResponse, DatesResponse, LayersResponse, LayerMetadataItem,
    ModelInfoResponse, ZonalStatisticsResponse, HotspotStatisticsResponse,
    PersistenceStatisticsResponse, GiStarStatisticsResponse
)
from ..services.metadata_service import MetadataService
from ..services.statistics_service import StatisticsService
from ..services.raster_service import RasterService
from ..config import OBSERVATION_DATES

router = APIRouter(prefix="/api/v1", tags=["v1"])

@router.get("/metadata", response_model=MetadataResponse)
def get_metadata():
    """Returns overall project, spatial AOI, CRS, and locked model metadata."""
    return MetadataService.get_project_metadata()

@router.get("/dates", response_model=DatesResponse)
def get_dates():
    """Returns inventory of verified Landsat observation dates."""
    dates_list = MetadataService.get_observation_dates()
    return DatesResponse(dates=dates_list)

@router.get("/layers", response_model=LayersResponse)
def get_layers():
    """Returns metadata for all available satellite, ML, and spatial analysis layers."""
    layers = [
        LayerMetadataItem(
            id="lst",
            name="Land Surface Temperature (LST)",
            type="satellite",
            description="Landsat 8/9 ST_B10 surface temperature (°C)",
            unit="°C",
            is_categorical=False,
            requires_date=True,
            colormap="YlOrRd"
        ),
        LayerMetadataItem(
            id="ndvi",
            name="Normalized Difference Vegetation Index (NDVI)",
            type="satellite",
            description="Vegetation canopy density (-0.2 to +0.8)",
            unit="Index",
            is_categorical=False,
            requires_date=True,
            colormap="YlGn"
        ),
        LayerMetadataItem(
            id="ndbi",
            name="Normalized Difference Built-up Index (NDBI)",
            type="satellite",
            description="Built-up surface & pavement index (-0.4 to +0.6)",
            unit="Index",
            is_categorical=False,
            requires_date=True,
            colormap="YlOrBr"
        ),
        LayerMetadataItem(
            id="rf_prob",
            name="RF Hotspot Probability",
            type="ml",
            description="Random Forest Class 1 probability gradient (0.0 to 1.0)",
            unit="Probability",
            is_categorical=False,
            requires_date=True,
            colormap="Reds"
        ),
        LayerMetadataItem(
            id="rf_class",
            name="RF Hotspot Classification",
            type="ml",
            description="Binary hotspot classification (1 = Hotspot, 0 = Non-Hotspot)",
            unit="Class",
            is_categorical=True,
            requires_date=True,
            colormap="Crimson"
        ),
        LayerMetadataItem(
            id="persistence",
            name="Multi-Temporal Hotspot Persistence",
            type="spatial",
            description="Categorical hotspot stability across 8 observations (None, Transient, Moderate, Persistent)",
            unit="Category",
            is_categorical=True,
            requires_date=False,
            colormap="Amber-Red"
        ),
        LayerMetadataItem(
            id="gi_star",
            name="Getis-Ord Gi* Spatial Clusters",
            type="spatial",
            description="Spatial hotspot/coldspot clustering confidence levels (99%, 95%, 90% Hotspots, Coldspots)",
            unit="Cluster",
            is_categorical=True,
            requires_date=False,
            colormap="Red-Blue"
        ),
    ]
    return LayersResponse(layers=layers)

@router.get("/model", response_model=ModelInfoResponse)
def get_model_info():
    """Returns read-only metadata, locked hyperparameters, feature importances, and evaluation results for the locked Random Forest model."""
    return MetadataService.get_model_info()

@router.get("/tiles/{layer}/{date_or_key}/{z}/{x}/{y}.png")
def get_raster_tile(layer: str, date_or_key: str, z: int, x: int, y: int):
    """
    Renders dynamic 256x256 Web Mercator PNG map tiles from authoritative GeoTIFF rasters with caching.
    """
    valid_layers = ["lst", "ndvi", "ndbi", "ref_label", "rf_prob", "rf_class", "persistence", "gi_star", "built_mask"]
    if layer not in valid_layers:
        raise HTTPException(status_code=400, detail=f"Invalid layer '{layer}'. Must be one of {valid_layers}")

    if layer in ["lst", "ndvi", "ndbi", "ref_label", "rf_prob", "rf_class"]:
        if date_or_key not in OBSERVATION_DATES:
            raise HTTPException(status_code=400, detail=f"Invalid date '{date_or_key}'. Must be one of {OBSERVATION_DATES}")

    try:
        png_bytes = RasterService.get_tile_png(layer, date_or_key, z, x, y)
        return Response(
            content=png_bytes,
            media_type="image/png",
            headers={"Cache-Control": "public, max-age=86400"}
        )
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Tile rendering error: {str(e)}")

@router.get("/statistics/zonal", response_model=ZonalStatisticsResponse)
def get_zonal_statistics(
    layer: str = Query(..., description="Layer ID (e.g. lst, ndvi, ndbi, rf_prob, continuous_persistence)"),
    date: str = Query(None, description="Observation date (YYYY-MM-DD)")
):
    """Calculates zonal statistics (min, max, mean, std, valid pixels, area) from real project rasters."""
    try:
        return StatisticsService.get_zonal_statistics(layer, date)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/statistics/hotspot", response_model=HotspotStatisticsResponse)
def get_hotspot_statistics(date: str = Query(..., description="Observation date (YYYY-MM-DD)")):
    """Returns hotspot pixel counts, area in km², and hotspot percentage for a given observation date."""
    if date not in OBSERVATION_DATES:
        raise HTTPException(status_code=400, detail=f"Invalid date '{date}'. Must be one of {OBSERVATION_DATES}")
    try:
        return StatisticsService.get_hotspot_statistics(date)
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/statistics/persistence", response_model=PersistenceStatisticsResponse)
def get_persistence_statistics():
    """Returns 4-level categorical persistence areas (None, Transient, Moderate, Persistent)."""
    try:
        return StatisticsService.get_persistence_statistics()
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.get("/statistics/gi-star", response_model=GiStarStatisticsResponse)
def get_gi_star_statistics():
    """Returns Getis-Ord Gi* spatial cluster areas (99%, 95%, 90% Hotspots, Coldspots, Not Significant)."""
    try:
        return StatisticsService.get_gi_star_statistics()
    except FileNotFoundError as e:
        raise HTTPException(status_code=404, detail=str(e))
