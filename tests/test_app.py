import io
import os
import sqlite3
import pytest
from fastapi.testclient import TestClient
from server import app
import xrd_engine

client = TestClient(app)


@pytest.fixture(autouse=True)
def preserve_user_sq_index_cfg():
    """Preserves user's configured database/sq_index.cfg across test runs."""
    cfg_path = os.path.join(xrd_engine.DATABASE_DIR, "sq_index.cfg")
    orig_bytes = None
    if os.path.isfile(cfg_path):
        with open(cfg_path, "rb") as f:
            orig_bytes = f.read()
        os.remove(cfg_path)
    try:
        yield
    finally:
        if orig_bytes is not None:
            os.makedirs(os.path.dirname(cfg_path), exist_ok=True)
            with open(cfg_path, "wb") as f:
                f.write(orig_bytes)
        elif os.path.isfile(cfg_path):
            os.remove(cfg_path)


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

    assert html_root == html_static, "index.html and static/index.html must stay synchronized"

    ids = set(re.findall(r"getElementById\('([^']+)'\)", js))
    assert len(ids) >= 65
    for dom_id in ids:
        assert f'id="{dom_id}"' in html_root, f"Missing #{dom_id} in root index.html"
        assert f'id="{dom_id}"' in html_static, f"Missing #{dom_id} in static/index.html"


def test_sq_database_index_browse_upload_and_reset(tmp_path):
    import os
    xrd_engine.ensure_directories_and_seed()
    sq_sample = os.path.join(xrd_engine.SAMPLE_DIR, "pdf2-1.sq")
    assert os.path.isfile(sq_sample)

    try:
        # 1. Browse endpoint returns Desktop & discovered .sq files
        b_res = client.get("/api/database/sq-browse")
        assert b_res.status_code == 200
        b_data = b_res.json()
        assert "discovered_sq_files" in b_data
        assert any(f["name"] == "pdf2-1.sq" for f in b_data["discovered_sq_files"])

        # 2. Index pdf2-1.sq via path / filename
        idx_res = client.post("/api/database/sq-index", json={"path": sq_sample})
        assert idx_res.status_code == 200
        idx_data = idx_res.json()
        assert idx_data["total_sq_cards"] >= 20
        assert any(f["name"] == "pdf2-1.sq" for f in idx_data["files"])

        # 3. Check sq-status reflects active .sq file
        st_res = client.get("/api/database/sq-status")
        assert st_res.status_code == 200
        assert st_res.json()["total_sq_cards"] >= 20

        # 4. Upload a custom .sq SQLite3 file and verify indexing
        custom_sq_path = str(tmp_path / "desktop_custom.sq")
        xrd_engine.create_sq_database(
            custom_sq_path,
            [
                {
                    "id": "999-0001",
                    "jcpds": "999-0001",
                    "name": "Sylvite (KCl)",
                    "formula": "KCl",
                    "system": "Cubic",
                    "space_group": "Fm-3m",
                    "cell": {"a": 6.2917, "b": 6.2917, "c": 6.2917, "alpha": 90, "beta": 90, "gamma": 90},
                    "peaks": [
                        {"two_theta": 28.35, "d": 3.1458, "intensity": 100.0, "hkl": [2, 0, 0]},
                        {"two_theta": 40.51, "d": 2.2248, "intensity": 59.0, "hkl": [2, 2, 0]},
                        {"two_theta": 50.18, "d": 1.8165, "intensity": 23.0, "hkl": [2, 2, 2]},
                    ],
                }
            ],
        )
        with open(custom_sq_path, "rb") as fb:
            up_res = client.post(
                "/api/database/sq-upload",
                files={"file": ("desktop_custom.sq", fb.read(), "application/octet-stream")},
            )
        assert up_res.status_code == 200
        assert up_res.json()["total_sq_cards"] == 1
    finally:
        # Clean up uploaded test .sq file and reset sq_index.cfg
        uploaded_dest = os.path.join(xrd_engine.DATABASE_DIR, "desktop_custom.sq")
        if os.path.exists(uploaded_dest):
            os.remove(uploaded_dest)
        client.post("/api/database/sq-index", json={"path": ""})


def test_restraints_all_six_tabs():
    import os
    xrd_engine.ensure_directories_and_seed()
    sq_sample = os.path.join(xrd_engine.SAMPLE_DIR, "pdf2-1.sq")
    try:
        client.post("/api/database/sq-index", json={"path": sq_sample})

        # 1. Composition: JUST Zn and O (exact element set = ZnO only)
        r1 = client.post(
            "/api/database/filter",
            json={
                "source": "local",
                "restraints": {"composition": {"just_elements": ["Zn", "O"]}},
            },
        )
        assert r1.status_code == 200
        res1 = r1.json()["results"]
        assert len(res1) >= 1
        assert all(set(p["elements"]) == {"Zn", "O"} for p in res1)

        # 2. Composition: AND O + NOT Ti + # of elements = 2..2
        r2 = client.post(
            "/api/database/filter",
            json={
                "source": "local",
                "restraints": {
                    "composition": {
                        "and_elements": ["O"],
                        "not_elements": ["Ti"],
                        "min_elements": 2,
                        "max_elements": 2,
                    }
                },
            },
        )
        res2 = r2.json()["results"]
        assert len(res2) >= 3
        for p in res2:
            assert "O" in p["elements"]
            assert "Ti" not in p["elements"]
            assert len(p["elements"]) == 2

        # 3. Subfiles: Organic (O) from pdf2-1.sq (e.g., Urea / Aspirin / Glycine)
        r3 = client.post(
            "/api/database/filter",
            json={
                "source": "local",
                "restraints": {"subfiles": {"selected": ["O"], "mode": "or"}},
            },
        )
        res3 = r3.json()["results"]
        assert len(res3) >= 1
        assert all("O" in p.get("subfiles", []) for p in res3)

        # 4. Chemical name + Symmetry + Cell bounds
        r4 = client.post(
            "/api/database/filter",
            json={
                "source": "local",
                "restraints": {
                    "chemical_name": {"query": "Halite", "mode": "contains"},
                    "symmetry": {"systems": ["Cubic"], "space_group": "Fm-3m"},
                    "cell": {"a_min": 5.5, "a_max": 5.8},
                },
            },
        )
        res4 = r4.json()["results"]
        assert len(res4) == 1
        assert res4[0]["formula"] == "NaCl"

        # 5. Entries wildcard filter
        r5 = client.post(
            "/api/database/filter",
            json={
                "source": "local",
                "restraints": {"entries": {"ids_text": "021-*"}},
            },
        )
        res5 = r5.json()["results"]
        assert len(res5) >= 2
        assert all(p["id"].startswith("021-") for p in res5)
    finally:
        client.post("/api/database/sq-index", json={"path": ""})


def test_local_auto_search_match_with_identified_peaks_and_sq():
    import os
    import numpy as np
    xrd_engine.ensure_directories_and_seed()
    sq_sample = os.path.join(xrd_engine.SAMPLE_DIR, "pdf2-1.sq")

    try:
        client.post("/api/database/sq-index", json={"path": sq_sample})

        # Synthesize an uploaded Halite (NaCl) XRD scan (Halite is stored in pdf2-1.sq, not SEED_PHASES!)
        halite_peaks = [
            (27.36, 12.0),
            (31.69, 100.0),
            (45.45, 55.0),
            (53.85, 6.0),
            (56.47, 15.0),
            (66.23, 6.0),
            (75.30, 11.0),
        ]
        tt = np.linspace(20.0, 80.0, 1201)
        yy = np.full_like(tt, 60.0)
        for pos, inten in halite_peaks:
            yy += xrd_engine.pseudo_voigt(tt, pos, inten * 15.0, 0.22, 0.5)

        identified = xrd_engine.detect_experimental_peaks(tt.tolist(), yy.tolist(), prominence_pct=5.0)
        assert len(identified) >= 4

        res = client.post(
            "/api/search-match",
            json={
                "two_theta": np.round(tt, 4).tolist(),
                "intensity": np.round(yy, 2).tolist(),
                "identified_peaks": identified,
                "source": "local",
                "restraints": {"composition": {"and_elements": ["Na", "Cl"]}},
            },
        )
        assert res.status_code == 200
        matches = res.json()["matches"]
        assert len(matches) >= 1
        assert matches[0]["formula"] == "NaCl"
        assert matches[0]["fom"] > 80.0
        assert matches[0]["matched_peaks"] >= 5
    finally:
        client.post("/api/database/sq-index", json={"path": ""})


def test_qualx_pdf2_dvalue_intensita_schema_and_distinct_jcpds_peaks(tmp_path):
    """Verifies real QualX PDF-2 .sq columns (dvalue, intensita, mineralname, integer IDs) update JCPDS peaks."""
    qualx_sq = str(tmp_path / "pdf2-qualx.sq")
    conn = sqlite3.connect(qualx_sq)
    try:
        cur = conn.cursor()
        cur.execute("CREATE TABLE infodb (version TEXT, type TEXT)")
        cur.execute("INSERT INTO infodb VALUES ('2.0', 'PDF-2')")
        cur.execute(
            """
            CREATE TABLE id (
                id INTEGER PRIMARY KEY,
                name TEXT,
                mineralname TEXT,
                formula TEXT,
                spgr TEXT,
                dvalue TEXT,
                intensita TEXT,
                bestdval TEXT,
                nrec INTEGER
            )
            """
        )
        cur.execute("CREATE TABLE chemical (id INTEGER, chemical_element TEXT)")
        # 361451 -> 036-1451 (Zincite)
        cur.execute(
            "INSERT INTO id VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            (
                361451,
                "Zinc Oxide",
                "Zincite, syn",
                "Zn O",
                "P63mc",
                "2.8143,2.6033,2.4759,1.9111,1.6247",
                "57,44,100,23,32",
                "2.4759,2.8143,2.6033",
                0,
            ),
        )
        # 50628 -> 005-0628 (Halite)
        cur.execute(
            "INSERT INTO id VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
            (
                50628,
                "Sodium Chloride",
                "Halite, syn",
                "Na Cl",
                "Fm-3m",
                "3.2600,2.8210,1.9940,1.7010,1.6280",
                "13,100,55,2,15",
                "2.8210,1.9940,1.6280",
                0,
            ),
        )
        for el in ("Zn", "O"):
            cur.execute("INSERT INTO chemical VALUES (?, ?)", (361451, el))
        for el in ("Na", "Cl"):
            cur.execute("INSERT INTO chemical VALUES (?, ?)", (50628, el))
        conn.commit()
    finally:
        conn.close()

    phases, total = xrd_engine.load_phases_from_sq(qualx_sq)
    assert total == 2
    by_id = {p["id"]: p for p in phases}
    assert "036-1451" in by_id
    assert "005-0628" in by_id

    zno_pks = [pk["two_theta"] for pk in by_id["036-1451"]["peaks"]]
    nacl_pks = [pk["two_theta"] for pk in by_id["005-0628"]["peaks"]]
    assert zno_pks != nacl_pks
    assert any(abs(t - 36.25) < 0.08 for t in zno_pks)
    assert any(abs(t - 45.45) < 0.08 for t in nacl_pks)
    assert by_id["005-0628"]["system"] == "Cubic"
    assert by_id["036-1451"]["system"] == "Hexagonal"


def test_jcpds_legend_top_right_and_reference_sync_in_js():
    base = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    js = open(os.path.join(base, "static", "app.js"), encoding="utf-8").read()
    assert "function applyActiveReference(" in js
    assert "const blockRight = right - 44 + (state.labels.refOffset.dx || 0);" in js
    assert "const ry = top + 98 + (state.labels.refOffset.dy || 0);" in js


def test_cod_structure_factor_and_search_match(monkeypatch):
    import numpy as np

    cs3bi2i9_cif = """data_2106275
_chemical_formula_sum 'Bi2 Cs3 I9'
_symmetry_space_group_name_H-M 'P 63/m m c'
_cell_angle_alpha 90
_cell_angle_beta 90
_cell_angle_gamma 120
_cell_length_a 8.404
_cell_length_b 8.404
_cell_length_c 21.183
loop_
_symmetry_equiv_pos_as_xyz
x,y,z
x-y,x,z+1/2
-y,x-y,z
-x,-y,z+1/2
-x+y,-x,z
y,-x+y,z+1/2
-y,-x,-z+1/2
x-y,-y,-z
x,x-y,-z+1/2
y,x,-z
-x+y,y,-z+1/2
-x,-x+y,-z
-x,-y,-z
-x+y,-x,-z-1/2
y,-x+y,-z
x,y,-z-1/2
x-y,x,-z
-y,x-y,-z-1/2
y,x,z-1/2
-x+y,y,z
-x,-x+y,z-1/2
-y,-x,z
x-y,-y,z-1/2
x,x-y,z
loop_
_atom_site_label
_atom_site_type_symbol
_atom_site_fract_x
_atom_site_fract_y
_atom_site_fract_z
_atom_site_occupancy
I2 I-1 0.8369 0.6738 0.0805 1
I1 I-1 0.4929 0.9858 0.25 1
Cs2 Cs+1 0.3333 0.6667 0.0819 1
Bi1 Bi+3 0.3333 0.6667 0.8454 1
Cs1 Cs+1 0 0 0.25 1
"""
    parsed = xrd_engine.parse_cif_string(cs3bi2i9_cif, source_id="COD-2106275")
    assert parsed is not None
    # Verify structure-factor peaks include low-angle (101) ~12.85 deg and 100% (203) ~27.55 deg, and exclude extinct (111) ~21.54 deg
    tt_list = [pk["two_theta"] for pk in parsed["peaks"]]
    assert any(abs(t - 12.85) < 0.06 for t in tt_list)
    assert any(abs(t - 27.55) < 0.06 and pk["intensity"] == 100.0 for t, pk in zip(tt_list, parsed["peaks"]))
    assert not any(abs(t - 21.54) < 0.05 for t in tt_list)

    # Verify stoichiometric equivalence between chemist order "Cs3Bi2I9" and CIF Hill order "Bi2 Cs3 I9"
    filtered = xrd_engine.filter_phases_by_restraints([parsed], restraints=None, query="Cs3Bi2I9")
    assert len(filtered) == 1

    # Mock COD HTTP session for deterministic unit testing of /api/search-match and /api/database/filter with source="cod"
    class FakeResp:
        def __init__(self, status_code=200, json_data=None, text=""):
            self.status_code = status_code
            self._json = json_data
            self.text = text

        def json(self):
            return self._json

    class FakeSession:
        def get(self, url, params=None, timeout=5.0):
            if url.endswith("/result"):
                assert params.get("strictmin") == "3"
                assert params.get("strictmax") == "3"
                return FakeResp(200, json_data=[{"file": "2106275", "formula": "- Bi2 Cs3 I9 -", "a": "8.404", "b": "8.404", "c": "21.183", "alpha": "90", "beta": "90", "gamma": "120", "sg": "P 63/m m c"}])
            if url.endswith("2106275.cif"):
                return FakeResp(200, text=cs3bi2i9_cif)
            return FakeResp(404)

    monkeypatch.setattr(xrd_engine, "_create_resilient_http_session", lambda: FakeSession())
    monkeypatch.setattr(xrd_engine, "_fetch_cod_cif_text", lambda cid, session=None: cs3bi2i9_cif if str(cid) == "2106275" else None)

    # Synthesize experimental Cs3Bi2I9 scan from 10 to 55 deg
    tt = np.linspace(10.0, 55.0, 1400)
    yy = np.full_like(tt, 40.0)
    for pk in parsed["peaks"]:
        if 10.0 <= pk["two_theta"] <= 55.0:
            yy += xrd_engine.pseudo_voigt(tt, pk["two_theta"], pk["intensity"] * 14.0, 0.20, 0.5)

    # 1. Search-Match with source="cod" and sample_hint="Cs3Bi2I9.xy" (even with blank query!)
    res_sm = client.post(
        "/api/search-match",
        json={
            "two_theta": tt.tolist(),
            "intensity": yy.tolist(),
            "source": "cod",
            "query": "",
            "sample_hint": "Cs3Bi2I9.xy",
            "extra_phases": [{"id": "036-1451", "source": "Local DB", "formula": "ZnO", "peaks": [{"two_theta": 27.55, "intensity": 100.0, "d": 3.23}]}],
        },
    )
    assert res_sm.status_code == 200
    matches = res_sm.json()["matches"]
    assert len(matches) == 1
    assert matches[0]["id"] == "COD-2106275"
    assert matches[0]["source"] == "COD"
    assert matches[0]["fom"] > 80.0

    # 2. /api/database/filter with source="cod" and Composition Restraints (blank query)
    res_flt = client.post(
        "/api/database/filter",
        json={
            "source": "cod",
            "query": "",
            "restraints": {"composition": {"just_elements": ["Cs", "Bi", "I"]}},
        },
    )
    assert res_flt.status_code == 200
    flt_hits = res_flt.json()["results"]
    assert len(flt_hits) == 1
    assert flt_hits[0]["id"] == "COD-2106275"


def test_automatch_only_runs_when_explicitly_clicked():
    import re
    base = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    js = open(os.path.join(base, "static", "app.js"), encoding="utf-8").read()
    # Exclude function definition `async function runSearchMatch(`; only 2 explicit button handlers may invoke it
    calls = [
        ln.strip()
        for ln in js.splitlines()
        if "runSearchMatch(" in ln and not ln.strip().startswith("async function runSearchMatch")
    ]
    assert len(calls) == 2
    assert any("searchMatchBtn" in c for c in calls)
    # Also ensure searchMatchClient is only defined once and invoked once inside runSearchMatch
    sm_client_refs = [ln.strip() for ln in js.splitlines() if "searchMatchClient(" in ln]
    assert len(sm_client_refs) == 2


def test_rietveld_scientific_workflow_multi_system_and_ka2_doublet():
    import numpy as np

    db = xrd_engine.load_local_database()
    zno = next(p for p in db if p["id"] == "036-1451")
    si = next(p for p in db if p["id"] == "027-1402")

    # 1. Bichromatic Cu Ka1/Ka2 doublet scan with shifted lattice & specimen zero offset
    tt = np.linspace(25.0, 78.0, 1600)
    lam1, lam2 = 1.540598, 1.544426
    yy_ka12 = np.full_like(tt, 65.0)
    for pk in zno["peaks"]:
        if 25.0 <= pk["two_theta"] <= 78.0:
            th1 = np.radians((pk["two_theta"] + 0.04) / 2.0)
            s2 = np.clip(np.sin(th1) * (lam2 / lam1), -0.999, 0.999)
            tt2 = np.degrees(2.0 * np.arcsin(s2))
            amp = pk["intensity"] * 18.0
            yy_ka12 += xrd_engine.pseudo_voigt(tt, pk["two_theta"] + 0.04, amp, 0.16, 0.42)
            yy_ka12 += xrd_engine.pseudo_voigt(tt, tt2, 0.50 * amp, 0.16, 0.42)

    res_ka12 = xrd_engine.run_rietveld_refinement(tt.tolist(), yy_ka12.tolist(), zno, wavelength=lam1)
    m12 = res_ka12["metrics"]
    assert m12["rwp"] < 3.5
    assert m12["r_bragg"] < 2.5
    assert 0.35 <= m12["ka2_ratio"] <= 0.52
    assert m12["crystallinity_pct"] > 90.0

    # 2. Pre-normalized [0..1] intensity scan with realistic detector noise
    rng = np.random.default_rng(7)
    yy_norm = (yy_ka12 - yy_ka12.min()) / (yy_ka12.max() - yy_ka12.min())
    yy_norm = np.clip(yy_norm + rng.normal(0.0, 0.006, size=tt.shape), 0.0, None)
    res_norm = xrd_engine.run_rietveld_refinement(tt.tolist(), yy_norm.tolist(), zno, wavelength=lam1)
    assert res_norm["metrics"]["rwp"] < 12.0
    assert 0.2 < res_norm["metrics"]["chi2"] < 2.5

    # 3. Cubic symmetry constraint check (Silicon a == b == c)
    tt_si = np.linspace(24.0, 80.0, 1400)
    yy_si = np.full_like(tt_si, 50.0)
    for pk in si["peaks"]:
        yy_si += xrd_engine.pseudo_voigt(tt_si, pk["two_theta"], pk["intensity"] * 16.0, 0.18, 0.45)
    res_si = xrd_engine.run_rietveld_refinement(tt_si.tolist(), yy_si.tolist(), si, wavelength=lam1)
    msi = res_si["metrics"]
    assert msi["a"] == msi["b"] == msi["c"]
    assert abs(msi["a"] - 5.4309) < 0.005

    # 4. Monoclinic anisotropic cell refinement (Baddeleyite ZrO2)
    true_cell = {"a": 5.1520, "b": 5.2110, "c": 5.3180, "alpha": 90.0, "beta": 99.22, "gamma": 90.0}
    init_cell = {"a": 5.1450, "b": 5.2030, "c": 5.3120, "alpha": 90.0, "beta": 99.10, "gamma": 90.0}
    mono_true_pks = xrd_engine.compute_d_spacings_for_cell("Monoclinic", true_cell, lam1, 20.0, 65.0, 3)[:10]
    mono_ref = {
        "id": "037-1484",
        "jcpds": "037-1484",
        "name": "Baddeleyite (ZrO2)",
        "formula": "ZrO2",
        "system": "Monoclinic",
        "space_group": "P21/c",
        "cell": init_cell,
        "peaks": [
            {"two_theta": pk["two_theta"], "intensity": pk["intensity"], "hkl": pk["hkl"], "d": pk["d"]}
            for pk in xrd_engine.compute_d_spacings_for_cell("Monoclinic", init_cell, lam1, 20.0, 65.0, 3)[:10]
        ],
    }
    tt_m = np.linspace(20.0, 65.0, 1200)
    yy_m = np.full_like(tt_m, 45.0)
    for pk in mono_true_pks:
        yy_m += xrd_engine.pseudo_voigt(tt_m, pk["two_theta"], pk["intensity"] * 15.0, 0.20, 0.45)
    res_mono = xrd_engine.run_rietveld_refinement(tt_m.tolist(), yy_m.tolist(), mono_ref, wavelength=lam1)
    mm = res_mono["metrics"]
    assert mm["rwp"] < 5.0
    assert abs(mm["a"] - true_cell["a"]) < 0.01
    assert abs(mm["b"] - true_cell["b"]) < 0.01
    assert abs(mm["c"] - true_cell["c"]) < 0.01


def test_security_headers_and_favicon_routes():
    res_ico = client.get("/favicon.ico")
    assert res_ico.status_code == 200
    assert "svg" in res_ico.headers.get("content-type", "")
    assert res_ico.headers.get("x-content-type-options") == "nosniff"
    assert "strict-origin" in res_ico.headers.get("referrer-policy", "")

    res_svg = client.get("/favicon.svg")
    assert res_svg.status_code == 200


def test_responsive_breakpoints_and_gitignore_safety():
    base = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    css = open(os.path.join(base, "static", "styles.css"), encoding="utf-8").read()
    gitignore = open(os.path.join(base, ".gitignore"), encoding="utf-8").read()

    assert "100dvh" in css
    for bp in ("min-width: 1640px", "max-width: 1360px", "max-width: 1024px", "max-width: 640px"):
        assert bp in css

    assert "database/sq_index.cfg" in gitignore
    assert "database/.cod_cache/" in gitignore
    assert "database/*.sq" in gitignore




