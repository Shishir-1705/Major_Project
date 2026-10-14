import pytest
from fastapi.testclient import TestClient
from backend.app.main import app

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
    # Fetch a valid tile over Mysuru region (z=12, x=2919, y=1943)
    response = client.get("/api/v1/tiles/lst/2023-04-01/12/2919/1943.png")
    assert response.status_code == 200
    assert response.headers["content-type"] == "image/png"
    assert len(response.content) > 0

def test_7_invalid_layer_error():
    response = client.get("/api/v1/tiles/invalid_layer_name/2023-04-01/12/2919/1943.png")
    assert response.status_code == 400
    assert "Invalid layer" in response.json()["detail"]

def test_8_invalid_date_error():
    response = client.get("/api/v1/tiles/lst/2099-01-01/12/2919/1943.png")
    assert response.status_code == 400
    assert "Invalid date" in response.json()["detail"]

def test_9_nodata_tile_rendering():
    # Tile far outside Mysuru study area should render transparent PNG without error
    response = client.get("/api/v1/tiles/lst/2023-04-01/12/0/0.png")
    assert response.status_code == 200
    assert response.headers["content-type"] == "image/png"

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
    assert data["valid_pixels"] == 155625
    assert data["unit"] == "Probability"

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
        assert data["valid_pixels"] == 155625

    # Multi-temporal / spatial layers
    res_persist = client.get("/api/v1/statistics/zonal?layer=persistence")
    assert res_persist.status_code == 200
    p_data = res_persist.json()
    assert p_data["unit"] == "Recurrence"
    assert p_data["min"] >= 0.0
    assert p_data["max"] <= 1.0
    assert p_data["valid_pixels"] == 104063

    res_gi = client.get("/api/v1/statistics/zonal?layer=gi_star")
    assert res_gi.status_code == 200
    gi_data = res_gi.json()
    assert gi_data["unit"] == "z-score"
    assert gi_data["valid_pixels"] == 104063

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
    assert len(data["clusters"]) == 5
    assert data["total_built_area_km2"] > 80.0
