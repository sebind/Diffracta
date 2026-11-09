import io
from fastapi.testclient import TestClient
from server import app
import xrd_engine

client = TestClient(app)


def test_health():
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json()["status"] == "ok"


def test_init_endpoint_single_pattern():
    res = client.get("/api/init")
    assert res.status_code == 200
    data = res.json()
    assert len(data["series"]) == 1
    assert data["active_reference"]["id"] == "036-1451"
    assert len(data["local_db"]) >= 16
    shown_hkls = [p["hkl_str"] for p in data["indexed"]["peaks"] if p["show_label"]]
    assert "(100)" in shown_hkls
    assert "(002)" in shown_hkls
    assert "(101)" in shown_hkls


def test_search_match_and_indexing():
    series = xrd_engine.get_default_zno_series()
    res = client.post(
        "/api/search-match",
        json={
            "two_theta": series[0]["two_theta"],
            "intensity": series[0]["intensity"],
            "tolerance_deg": 0.45
        }
    )
    assert res.status_code == 200
    matches = res.json()["matches"]
    assert len(matches) > 0
    assert matches[0]["id"] == "036-1451"
    assert matches[0]["fom"] > 80.0


def test_rietveld_refinement():
    series = xrd_engine.get_default_zno_series()
    db = xrd_engine.load_local_database()
    zno = next(p for p in db if p["id"] == "036-1451")

    res = client.post(
        "/api/rietveld",
        json={
            "two_theta": series[0]["two_theta"],
            "intensity": series[0]["intensity"],
            "phase": zno,
            "wavelength": 1.5406
        }
    )
    assert res.status_code == 200
    data = res.json()
    assert data["metrics"]["rwp"] < 15.0
    assert 3.20 < data["metrics"]["a"] < 3.30
    assert 5.15 < data["metrics"]["c"] < 5.26
    assert "microstrain_pct" in data["metrics"]
    assert "crystallinity_pct" in data["metrics"]


def test_full_report_generation():
    series = xrd_engine.get_default_zno_series()
    res = client.post(
        "/api/report",
        json={
            "two_theta": series[0]["two_theta"],
            "intensity": series[0]["intensity"],
            "sample_name": "ZnO_Test"
        }
    )
    assert res.status_code == 200
    rep = res.json()
    assert rep["sample_name"] == "ZnO_Test"
    assert rep["matched_phase"]["id"] == "036-1451"
    assert len(rep["indexed"]["peaks"]) >= 7
    assert rep["rietveld"]["metrics"]["rwp"] < 15.0


def test_upload_xy_file():
    xy_content = "20.0 100.0\n31.77 650.0\n34.42 520.0\n36.25 1100.0\n70.0 95.0\n"
    files = [("files", ("test_scan.xy", io.BytesIO(xy_content.encode("utf-8")), "text/plain"))]
    res = client.post("/api/upload", files=files)
    assert res.status_code == 200
    parsed = res.json()["series"]
    assert len(parsed) == 1
    assert parsed[0]["num_points"] == 5


def test_frontend_dom_ids_and_assets():
    import os
    import re
    base = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    html_root = open(os.path.join(base, "index.html"), encoding="utf-8").read()
    html_static = open(os.path.join(base, "static", "index.html"), encoding="utf-8").read()
    js = open(os.path.join(base, "static", "app.js"), encoding="utf-8").read()

    ids = set(re.findall(r"getElementById\('([^']+)'\)", js))
    assert len(ids) >= 35
    for dom_id in ids:
        assert f'id="{dom_id}"' in html_root, f"Missing #{dom_id} in root index.html"
        assert f'id="{dom_id}"' in html_static, f"Missing #{dom_id} in static/index.html"
