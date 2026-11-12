import os
import re
import json
from contextlib import asynccontextmanager
from typing import List, Dict, Any, Optional

from fastapi import FastAPI, UploadFile, File, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field

import xrd_engine

STATIC_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "static")
os.makedirs(STATIC_DIR, exist_ok=True)

MAX_UPLOAD_BYTES = 10 * 1024 * 1024  # 10 MB per file


@asynccontextmanager
async def lifespan(app: FastAPI):
    xrd_engine.ensure_directories_and_seed()
    yield


app = FastAPI(
    title="Diffracta",
    version="1.0.0",
    lifespan=lifespan
)

app.add_middleware(GZipMiddleware, minimum_size=1000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def add_security_headers(request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
    return response


class SearchMatchRequest(BaseModel):
    two_theta: List[float] = Field(..., min_length=2)
    intensity: List[float] = Field(..., min_length=2)
    tolerance_deg: float = 0.45
    extra_phases: Optional[List[Dict[str, Any]]] = None
    identified_peaks: Optional[List[Dict[str, Any]]] = None
    restraints: Optional[Dict[str, Any]] = None
    query: str = ""
    source: str = "all"
    sample_hint: str = ""


class SqIndexRequest(BaseModel):
    path: Optional[str] = None


class DatabaseFilterRequest(BaseModel):
    restraints: Optional[Dict[str, Any]] = None
    query: str = ""
    source: str = "local"
    sample_hint: str = ""


class IndexPeaksRequest(BaseModel):
    two_theta: List[float] = Field(..., min_length=2)
    intensity: List[float] = Field(..., min_length=2)
    reference_phase: Optional[Dict[str, Any]] = None
    system: str = "Hexagonal"
    cell: Optional[Dict[str, float]] = None
    tolerance_deg: float = 0.55
    prominence_pct: float = 5.0


class RietveldRequest(BaseModel):
    two_theta: List[float] = Field(..., min_length=10)
    intensity: List[float] = Field(..., min_length=10)
    phase: Dict[str, Any]
    wavelength: float = 1.5406


class SavePhaseRequest(BaseModel):
    phase: Dict[str, Any]


def sanitize_filename(name: str, default: str = "custom.cif") -> str:
    base = os.path.basename(name or default)
    clean = re.sub(r"[^A-Za-z0-9._\-]", "_", base)
    return clean or default


@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "version": "1.0.0",
        "database_dir": xrd_engine.DATABASE_DIR
    }


@app.get("/api/init")
def api_init():
    series = xrd_engine.get_default_zno_series()
    local_db = xrd_engine.load_local_database()
    zno_ref = next((p for p in local_db if p.get("id") == "036-1451"), local_db[0] if local_db else None)

    top_trace = series[-1] if series else {"two_theta": [], "intensity": []}
    indexed = xrd_engine.assign_miller_indices(
        top_trace["two_theta"],
        top_trace["intensity"],
        reference_phase=zno_ref,
        tolerance_deg=0.55,
        prominence_pct=5.5
    ) if top_trace["two_theta"] else {"system": "Hexagonal", "cell": {}, "peaks": []}

    return {
        "database_dir": xrd_engine.DATABASE_DIR,
        "series": series,
        "local_db": local_db,
        "active_reference": zno_ref,
        "indexed": indexed,
        "matches": []
    }


@app.post("/api/upload")
async def api_upload_xrd(files: List[UploadFile] = File(...)):
    palette = ["#e60000", "#0018c4", "#006b1b", "#C21E56", "#7D6B91", "#18241E"]
    parsed_series = []
    for idx, uf in enumerate(files):
        raw_bytes = await uf.read()
        if len(raw_bytes) > MAX_UPLOAD_BYTES:
            raise HTTPException(status_code=413, detail=f"File exceeds 10 MB limit: {uf.filename}")

        text = raw_bytes.decode("utf-8", errors="ignore")
        safe_fname = sanitize_filename(uf.filename or f"Scan_{idx+1}.xy")
        ext = os.path.splitext(safe_fname)[1].lower()
        if ext == ".cif":
            cif_phase = xrd_engine.parse_cif_string(text, source_id=os.path.splitext(safe_fname)[0])
            if not cif_phase:
                raise HTTPException(status_code=400, detail=f"Invalid CIF file: {safe_fname}")
            import numpy as np
            tt = np.linspace(15.0, 80.0, 1600)
            yy = np.full_like(tt, 80.0)
            for pk in cif_phase["peaks"]:
                yy += xrd_engine.pseudo_voigt(tt, pk["two_theta"], pk["intensity"] * 18.0, 0.24, 0.55)
            parsed_series.append({
                "filename": safe_fname,
                "label": cif_phase["formula"],
                "two_theta": np.round(tt, 4).tolist(),
                "intensity": np.round(yy, 2).tolist(),
                "min_2theta": 15.0,
                "max_2theta": 80.0,
                "num_points": len(tt),
                "color": palette[idx % len(palette)]
            })
        else:
            try:
                item = xrd_engine.parse_xrd_content(text, safe_fname)
                item["color"] = palette[idx % len(palette)]
                parsed_series.append(item)
            except Exception as e:
                raise HTTPException(status_code=400, detail=str(e))
    return {"series": parsed_series}


@app.get("/api/database/local")
def api_get_local_db():
    return {
        "database_dir": xrd_engine.DATABASE_DIR,
        "sq_status": xrd_engine.get_sq_database_status(),
        "phases": xrd_engine.load_local_database()
    }


@app.get("/api/database/sq-status")
def api_sq_status():
    return xrd_engine.get_sq_database_status()


@app.get("/api/database/sq-browse")
def api_sq_browse(dir: Optional[str] = Query(None, description="Local directory to browse for .sq files")):
    return xrd_engine.scan_sq_directory(dir)


@app.post("/api/database/sq-index")
def api_set_sq_index(req: SqIndexRequest):
    try:
        status = xrd_engine.set_sq_database_path(req.path)
        return status
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to index .sq database: {e}")


@app.post("/api/database/sq-upload")
async def api_upload_sq_file(file: UploadFile = File(...)):
    fname = sanitize_filename(file.filename or "custom.sq", default="custom.sq")
    ext = os.path.splitext(fname)[1].lower()
    if ext not in (".sq", ".sqlite", ".sqlite3", ".db"):
        raise HTTPException(status_code=400, detail="Only .sq / SQLite database files are supported")
    dest = os.path.join(xrd_engine.DATABASE_DIR, fname)
    raw = await file.read()
    with open(dest, "wb") as f:
        f.write(raw)
    try:
        status = xrd_engine.set_sq_database_path(dest)
        return status
    except Exception as e:
        if os.path.exists(dest):
            os.remove(dest)
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/api/database/filter")
def api_filter_database(req: DatabaseFilterRequest):
    results: List[Dict[str, Any]] = []
    src = (req.source or "all").strip().lower()
    q_clean = req.query.strip()
    has_remote_restraints = xrd_engine._has_positive_remote_restraints(req.restraints)

    if src in ("local", "all", "sq"):
        results.extend(xrd_engine.load_local_database(include_sq=True, restraints=req.restraints, query=req.query))

    if src == "cod" or (src == "all" and (q_clean or has_remote_restraints)):
        cod_hits = xrd_engine.query_cod_database(
            q_clean,
            max_results=10 if src == "cod" else 6,
            restraints=req.restraints,
            sample_hint=req.sample_hint if src == "cod" else "",
        )
        results.extend(cod_hits)

    if src == "optimade" or (src == "all" and (q_clean or has_remote_restraints)):
        opt_hits = xrd_engine.query_optimade_database(
            q_clean,
            max_results=10 if src == "optimade" else 6,
            restraints=req.restraints,
            sample_hint=req.sample_hint if src == "optimade" else "",
        )
        results.extend(opt_hits)

    return {"results": results}


@app.post("/api/database/upload")
async def api_upload_to_local_db(files: List[UploadFile] = File(...)):
    saved = []
    for uf in files:
        raw_bytes = await uf.read()
        fname = sanitize_filename(uf.filename or "custom.cif")
        ext = os.path.splitext(fname)[1].lower()
        if ext in (".sq", ".sqlite", ".sqlite3", ".db"):
            dest = os.path.join(xrd_engine.DATABASE_DIR, fname)
            with open(dest, "wb") as f:
                f.write(raw_bytes)
            xrd_engine.set_sq_database_path(dest)
            saved.append(fname)
            continue
        if len(raw_bytes) > MAX_UPLOAD_BYTES:
            raise HTTPException(status_code=413, detail=f"File exceeds 10 MB limit: {uf.filename}")
        text = raw_bytes.decode("utf-8", errors="ignore")
        if ext not in (".cif", ".json"):
            raise HTTPException(status_code=400, detail="Only .cif, .json, and .sq files are supported for database import")
        dest = os.path.join(xrd_engine.DATABASE_DIR, fname)
        with open(dest, "w", encoding="utf-8") as f:
            f.write(text)
        saved.append(fname)
    return {
        "saved": saved,
        "phases": xrd_engine.load_local_database()
    }


@app.post("/api/database/save-local")
def api_save_phase_to_local(req: SavePhaseRequest):
    phase = req.phase
    pid = str(phase.get("id", "custom"))
    safe_name = re.sub(r"[^A-Za-z0-9_\-]", "_", f"{phase.get('formula', 'phase')}_{pid}")
    json_path = os.path.join(xrd_engine.DATABASE_DIR, f"{safe_name}.json")
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(phase, f, indent=2)
    cif_path = os.path.join(xrd_engine.DATABASE_DIR, f"{safe_name}.cif")
    with open(cif_path, "w", encoding="utf-8") as f:
        f.write(xrd_engine.generate_cif_from_phase(phase))
    return {
        "saved": safe_name,
        "phases": xrd_engine.load_local_database()
    }


@app.get("/api/database/search")
def api_search_databases(
    q: str = Query("", description="Formula, mineral name, JCPDS, or COD ID"),
    source: str = Query("all", description="local | cod | optimade | all")
):
    query_str = q.strip().lower()
    results = []

    if source in ("local", "all"):
        local_phases = xrd_engine.load_local_database()
        for p in local_phases:
            if (
                not query_str
                or query_str in p.get("name", "").lower()
                or query_str in p.get("formula", "").lower()
                or query_str in str(p.get("id", "")).lower()
                or query_str in str(p.get("jcpds", "")).lower()
                or query_str in str(p.get("cod_id", "")).lower()
            ):
                results.append(p)

    if query_str and source in ("cod", "all"):
        cod_hits = xrd_engine.query_cod_database(q.strip(), max_results=6)
        results.extend(cod_hits)

    if query_str and source in ("optimade", "all"):
        opt_hits = xrd_engine.query_optimade_database(q.strip(), max_results=6)
        results.extend(opt_hits)

    return {"results": results}


@app.post("/api/search-match")
def api_search_match(req: SearchMatchRequest):
    if len(req.two_theta) != len(req.intensity):
        raise HTTPException(status_code=400, detail="two_theta and intensity must have the same length")
    matches = xrd_engine.search_match_phases(
        req.two_theta,
        req.intensity,
        tolerance_deg=req.tolerance_deg,
        extra_phases=req.extra_phases,
        identified_peaks=req.identified_peaks,
        restraints=req.restraints,
        query=req.query,
        source=req.source,
        sample_hint=req.sample_hint,
    )
    return {"matches": matches}


@app.post("/api/index-peaks")
def api_index_peaks(req: IndexPeaksRequest):
    if len(req.two_theta) != len(req.intensity):
        raise HTTPException(status_code=400, detail="two_theta and intensity must have the same length")
    res = xrd_engine.assign_miller_indices(
        req.two_theta,
        req.intensity,
        reference_phase=req.reference_phase,
        system=req.system,
        cell=req.cell,
        tolerance_deg=req.tolerance_deg,
        prominence_pct=req.prominence_pct
    )
    return res


@app.post("/api/rietveld")
def api_rietveld(req: RietveldRequest):
    if len(req.two_theta) != len(req.intensity):
        raise HTTPException(status_code=400, detail="two_theta and intensity must have the same length")
    res = xrd_engine.run_rietveld_refinement(
        req.two_theta,
        req.intensity,
        req.phase,
        wavelength=req.wavelength
    )
    return res


class ReportRequest(BaseModel):
    two_theta: List[float] = Field(..., min_length=10)
    intensity: List[float] = Field(..., min_length=10)
    sample_name: str = "Sample"
    wavelength: float = 1.5406
    phase: Optional[Dict[str, Any]] = None


@app.post("/api/report")
def api_generate_report(req: ReportRequest):
    if len(req.two_theta) != len(req.intensity):
        raise HTTPException(status_code=400, detail="two_theta and intensity must have the same length")
    return xrd_engine.generate_full_report(
        req.two_theta,
        req.intensity,
        sample_name=req.sample_name,
        wavelength=req.wavelength,
        phase=req.phase
    )


@app.get("/api/preset/{name}")
def api_load_preset(name: str):
    import numpy as np
    local_db = xrd_engine.load_local_database()
    if name == "zno":
        return api_init()

    preset_map = {
        "tio2": ("021-1272", [("TiO2 Anatase", 0.0, "#e60000")]),
        "silicon": ("027-1402", [("Si NIST", 0.0, "#e60000")]),
        "batio3": ("005-0626", [("BaTiO3", 0.0, "#e60000")]),
        "al2o3": ("046-1212", [("α-Al2O3", 0.0, "#e60000")]),
    }
    pid, traces_cfg = preset_map.get(name, ("036-1451", [("ZnO", 0.0, "#e60000")]))
    ref = next((p for p in local_db if p["id"] == pid), local_db[0])

    tt = np.linspace(20.0, 75.0, 1800)
    rng = np.random.default_rng(11)
    series = []
    for label, shift, color in traces_cfg:
        y = np.full_like(tt, 85.0)
        for pk in ref["peaks"]:
            pos = pk["two_theta"] + shift
            if 20.0 <= pos <= 75.0:
                y += xrd_engine.pseudo_voigt(tt, pos, pk["intensity"] * 18.0, 0.24, 0.55)
        y = np.clip(y + rng.normal(0.0, np.sqrt(y) * 0.95), 10.0, None)
        series.append({
            "filename": f"{label}.xy",
            "label": label,
            "two_theta": np.round(tt, 4).tolist(),
            "intensity": np.round(y, 2).tolist(),
            "min_2theta": 20.0,
            "max_2theta": 75.0,
            "num_points": len(tt),
            "color": color
        })

    indexed = xrd_engine.assign_miller_indices(
        series[-1]["two_theta"],
        series[-1]["intensity"],
        reference_phase=ref
    )
    return {
        "database_dir": xrd_engine.DATABASE_DIR,
        "series": series,
        "local_db": local_db,
        "active_reference": ref,
        "indexed": indexed,
        "matches": []
    }


@app.get("/favicon.ico", include_in_schema=False)
@app.get("/favicon.svg", include_in_schema=False)
def serve_favicon():
    return FileResponse(os.path.join(STATIC_DIR, "favicon.svg"), media_type="image/svg+xml")


@app.get("/")
def serve_index():
    return FileResponse(os.path.join(STATIC_DIR, "index.html"))


app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")


if __name__ == "__main__":
    import uvicorn
    host = os.environ.get("HOST", "0.0.0.0")
    port = int(os.environ.get("PORT", "8000"))
    uvicorn.run("server:app", host=host, port=port, reload=False)
