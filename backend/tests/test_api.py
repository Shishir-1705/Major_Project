import io
import numpy as np
from PIL import Image
import pytest
from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.config import USE_CANDIDATE_DATA

client = TestClient(app)

def test_1_root_health_check():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json()["status"] == "online"

def test_1b_health_endpoints():
    response_root = client.get("/health")
    assert response_root.status_code == 200
    assert response_root.json() == {"status": "ok", "service": "urban-heat-hotspot-api"}

    response_v1 = client.get("/api/v1/health")
    assert response_v1.status_code == 200
    assert response_v1.json() == {"status": "ok", "service": "urban-heat-hotspot-api"}

def test_2_metadata_endpoint():
    response = client.get("/api/v1/metadata")
    assert response.status_code == 200
    data = response.json()
    assert data["study_area"] == "Mysuru, Karnataka, India"
    assert data["crs"] == "EPSG:32643 (UTM Zone 43N)"
    assert data["observation_dates_count"] == 8
    assert data["locked_model_sha256"] == "4cb736e53c66c78dbbcbc1cf7ca3ac965af01f1c7fae829502649b018e127280"

def test_3_layers_endpoint():
    response = client.get("/api/v1/layers")
    assert response.status_code == 200
    data = response.json()
    layer_ids = [l["id"] for l in data["layers"]]
    assert "lst" in layer_ids
    assert "ndvi" in layer_ids
    assert "ndbi" in layer_ids
    assert "rf_prob" in layer_ids
    assert "rf_class" in layer_ids
    assert "persistence" in layer_ids
    assert "gi_star" in layer_ids

def test_4_dates_endpoint():
    response = client.get("/api/v1/dates")
    assert response.status_code == 200
    data = response.json()
    dates = [d["date"] for d in data["dates"]]
    assert len(dates) == 8
    assert "2023-04-01" in dates
    assert "2023-05-27" in dates

def test_5_model_endpoint():
    response = client.get("/api/v1/model")
    assert response.status_code == 200
    data = response.json()
    assert data["model_name"] == "random_forest_final_step10_8"
    assert data["predictors"] == ["NDVI", "NDBI"]
    assert data["sha256"] == "4cb736e53c66c78dbbcbc1cf7ca3ac965af01f1c7fae829502649b018e127280"
    metrics = data["locked_test_metrics"]
    assert metrics["accuracy"] == 0.866667
    assert metrics["f1_score"] == 0.865979
    assert metrics["roc_auc"] == 0.933673

def test_6_valid_raster_tile_rendering():
    # Fetch a valid tile over Mysuru region (z=12, x=2920, y=1906)
    response = client.get("/api/v1/tiles/lst/2023-04-01/12/2920/1906.png")
    assert response.status_code == 200
    assert response.headers["content-type"] == "image/png"
    assert len(response.content) > 1000  # Must not be the 334-byte empty placeholder
    img = Image.open(io.BytesIO(response.content))
    arr = np.array(img)
    assert np.count_nonzero(arr[:, :, 3] > 0) > 0  # Must contain visible pixels

def test_6b_all_seven_layers_tile_rendering():
    # Verify non-zero alpha rendering for all 7 analytical layers over Mysuru
    test_cases = [
        ("lst", "2023-04-01"),
        ("ndvi", "2023-04-01"),
        ("ndbi", "2023-04-01"),
        ("rf_prob", "2023-04-01"),
        ("rf_class", "2023-04-01"),
        ("persistence", "categorical"),
        ("gi_star", "clustering"),
    ]
    for layer, date_or_key in test_cases:
        res = client.get(f"/api/v1/tiles/{layer}/{date_or_key}/12/2920/1906.png")
        assert res.status_code == 200
        assert res.headers["content-type"] == "image/png"
        assert len(res.content) > 400
        img = Image.open(io.BytesIO(res.content))
        arr = np.array(img)
        assert np.count_nonzero(arr[:, :, 3] > 0) > 0, f"Layer {layer} produced no visible pixels"

def test_6b_peripheral_tile_rendering_preserves_valid_pixels():
    """Verify that peripheral tiles crossing the built-domain boundary preserve valid pixels without NaN erosion."""
    # Tile 12/2921/1906 covers the eastern peripheral fringe of Mysuru (cols 662-853, rows 63-381)
    for layer, date_or_key, expected_min_pixels in [
        ("lst", "2023-04-09", 400),
        ("ndvi", "2023-04-09", 400),
        ("ndbi", "2023-04-09", 400),
        ("rf_prob", "2023-04-09", 400),
        ("rf_class", "2023-04-09", 20),
        ("persistence", "categorical", 300),
    ]:
        res = client.get(f"/api/v1/tiles/{layer}/{date_or_key}/12/2921/1906.png")
        assert res.status_code == 200
        assert res.headers["content-type"] == "image/png"
        img = Image.open(io.BytesIO(res.content))
        arr = np.array(img)
        visible_pixels = np.count_nonzero(arr[:, :, 3] > 0)
        assert visible_pixels >= expected_min_pixels, (
            f"Layer {layer} lost peripheral pixels: got {visible_pixels}, expected >= {expected_min_pixels}"
        )

def test_6c_outside_boundary_tiles_strictly_transparent():
    """Verify that tiles completely outside the valid raster extent remain 100% transparent."""
    # Tiles outside the AOI bounding box (AOI is 76.55 to 76.78 lon, 12.20 to 12.40 lat)
    # 12/2917/1905 has max lon 76.4648 < 76.55; 12/2922/1908 is far south-east; 12/0/0 is origin
    for tile_coords in ["12/2917/1905", "12/2922/1908", "12/0/0"]:
        res = client.get(f"/api/v1/tiles/lst/2023-04-09/{tile_coords}.png")
        assert res.status_code == 200
        img = Image.open(io.BytesIO(res.content))
        arr = np.array(img)
        assert np.count_nonzero(arr[:, :, 3] > 0) == 0, f"Tile {tile_coords} leaked visible pixels outside AOI"

def test_7_invalid_layer_error():
    response = client.get("/api/v1/tiles/invalid_layer_name/2023-04-01/12/2920/1906.png")
    assert response.status_code == 400
    assert "Invalid layer" in response.json()["detail"]

def test_8_invalid_date_error():
    response = client.get("/api/v1/tiles/lst/2099-01-01/12/2920/1906.png")
    assert response.status_code == 400
    assert "Invalid date" in response.json()["detail"]

def test_9_nodata_tile_rendering():
    # Tile far outside Mysuru study area should render transparent PNG without error
    response = client.get("/api/v1/tiles/lst/2023-04-01/12/0/0.png")
    assert response.status_code == 200
    assert response.headers["content-type"] == "image/png"
    img = Image.open(io.BytesIO(response.content))
    arr = np.array(img)
    assert np.count_nonzero(arr[:, :, 3]) == 0  # All pixels must be fully transparent

def test_10_zonal_statistics_endpoint():
    response = client.get("/api/v1/statistics/zonal?layer=lst&date=2023-04-01")
    assert response.status_code == 200
    data = response.json()
    assert data["layer"] == "lst"
    assert data["date"] == "2023-04-01"
    assert data["min"] > 20.0
    assert data["max"] < 65.0
    assert data["valid_pixels"] > 0
    assert data["area_km2"] > 100.0
    assert data["unit"] == "°C"

def test_10b_zonal_statistics_rf_prob_nodata_filtering():
    # Verify that -9999 NoData pixels are strictly excluded and valid probabilities are [0, 1]
    response = client.get("/api/v1/statistics/zonal?layer=rf_prob&date=2023-04-01")
    assert response.status_code == 200
    data = response.json()
    assert data["layer"] == "rf_prob"
    assert data["date"] == "2023-04-01"
    assert data["min"] >= 0.0
    assert data["max"] <= 1.0
    assert 0.0 <= data["mean"] <= 1.0
    assert data["min"] != -9999.0
    expected_pixels = 147137 if USE_CANDIDATE_DATA else 155625
    assert data["valid_pixels"] == expected_pixels
    assert data["unit"] == "Probability"

    # Also verify production path fallback
    res_prod = client.get("/api/v1/statistics/zonal?layer=rf_prob&date=2023-04-01&candidate=false")
    assert res_prod.status_code == 200
    assert res_prod.json()["valid_pixels"] == 155625

def test_10c_zonal_statistics_all_layers():
    # Test NDVI, NDBI, RF Class, Persistence, and Gi*
    for layer, expected_unit in [
        ("ndvi", "Index"),
        ("ndbi", "Index"),
        ("rf_class", "Class"),
    ]:
        res = client.get(f"/api/v1/statistics/zonal?layer={layer}&date=2023-04-01")
        assert res.status_code == 200, f"Layer {layer} failed: {res.text}"
        data = res.json()
        assert data["unit"] == expected_unit
        if USE_CANDIDATE_DATA:
            if layer in ["ndvi", "ndbi"]:
                assert data["valid_pixels"] == 519625
            else:
                assert data["valid_pixels"] == 147137
        else:
            assert data["valid_pixels"] == 155625

        # Check production fallback
        res_prod = client.get(f"/api/v1/statistics/zonal?layer={layer}&date=2023-04-01&candidate=false")
        assert res_prod.status_code == 200
        assert res_prod.json()["valid_pixels"] == 155625

    # Multi-temporal / spatial layers
    res_persist = client.get("/api/v1/statistics/zonal?layer=persistence")
    assert res_persist.status_code == 200
    p_data = res_persist.json()
    assert p_data["unit"] == "Recurrence"
    assert p_data["min"] >= 0.0
    assert p_data["max"] <= 1.0
    expected_p_pixels = 150274 if USE_CANDIDATE_DATA else 104063
    assert p_data["valid_pixels"] == expected_p_pixels

    res_gi = client.get("/api/v1/statistics/zonal?layer=gi_star")
    assert res_gi.status_code == 200
    gi_data = res_gi.json()
    assert gi_data["unit"] == "z-score"
    expected_gi_pixels = 150274 if USE_CANDIDATE_DATA else 104063
    assert gi_data["valid_pixels"] == expected_gi_pixels

    # Production fallback checks
    res_p_prod = client.get("/api/v1/statistics/zonal?layer=persistence&candidate=false")
    assert res_p_prod.status_code == 200
    assert res_p_prod.json()["valid_pixels"] == 104063

    res_gi_prod = client.get("/api/v1/statistics/zonal?layer=gi_star&candidate=false")
    assert res_gi_prod.status_code == 200
    assert res_gi_prod.json()["valid_pixels"] == 104063

def test_11_hotspot_statistics_endpoint():
    response = client.get("/api/v1/statistics/hotspot?date=2023-04-01")
    assert response.status_code == 200
    data = response.json()
    assert data["date"] == "2023-04-01"
    assert data["total_built_pixels"] > 100000
    assert data["hotspot_pixels"] > 0
    assert data["hotspot_percentage"] > 0.0

def test_12_persistence_statistics_endpoint():
    response = client.get("/api/v1/statistics/persistence")
    assert response.status_code == 200
    data = response.json()
    assert len(data["categories"]) >= 4
    assert data["total_built_area_km2"] > 80.0

def test_13_gi_star_statistics_endpoint():
    response = client.get("/api/v1/statistics/gi-star")
    assert response.status_code == 200
    data = response.json()
    expected_clusters = 3 if USE_CANDIDATE_DATA else 5
    assert len(data["clusters"]) == expected_clusters
    assert data["total_built_area_km2"] > 80.0

    if USE_CANDIDATE_DATA:
        assert data["total_nodes"] == 150274
        assert abs(data["total_built_area_km2"] - 135.247) < 0.01

        cluster_types = [c["cluster_type"] for c in data["clusters"]]
        assert any("Hotspot" in t for t in cluster_types)
        assert any("Coldspot" in t for t in cluster_types)
        assert any("Not" in t and "Significant" in t for t in cluster_types)

        # Check internal arithmetic consistency
        area_sum = sum(c["area_km2"] for c in data["clusters"])
        pct_sum = sum(c["percentage"] for c in data["clusters"])
        assert abs(area_sum - data["total_built_area_km2"]) < 0.01
        assert abs(pct_sum - 100.0) < 0.1

        # Check denominator consistency
        for c in data["clusters"]:
            expected_pct = (c["area_km2"] / data["total_built_area_km2"]) * 100
            assert abs(c["percentage"] - expected_pct) < 0.1

    # Test production fallback
    res_prod = client.get("/api/v1/statistics/gi-star?candidate=false")
    assert res_prod.status_code == 200
    prod_data = res_prod.json()
    assert len(prod_data["clusters"]) == 5
    assert prod_data["total_nodes"] == 104063
    assert abs(prod_data["total_built_area_km2"] - 93.657) < 0.01

def test_14_candidate_mode_tile_serving():
    # Verify candidate tile vs production tile serving works cleanly
    res_cand = client.get("/api/v1/tiles/lst/2023-04-01/12/2920/1906.png?candidate=true")
    assert res_cand.status_code == 200
    assert len(res_cand.content) > 1000

    res_prod = client.get("/api/v1/tiles/lst/2023-04-01/12/2920/1906.png?candidate=false")
    assert res_prod.status_code == 200
    assert len(res_prod.content) > 1000
