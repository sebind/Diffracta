# Diffracta

**Diffracta** is a publication-grade web application for powder X-ray diffraction (**XRD**) phase identification, QualX-style chemical/crystallographic restraint filtering, Miller index `(hkl)` assignment, full-profile Rietveld refinement, and true **300 DPI** journal figure & manuscript report generation.

Diffracta runs in two seamless modes:
- **Full-Stack FastAPI + SciPy Engine (`server.py`)** — Full server-side SQLite `.sq` indexing (e.g. PDF-2 / QualX databases), live Crystallography Open Database (**COD**) CIF structure-factor $F_{hkl}$ synthesis via Cromer–Mann 9-parameter scattering factors, OPTIMADE crystal structure queries, and two-stage Trust-Region Reflective (`trf`) Rietveld refinement.
- **Zero-Backend Static Mode (`index.html` + `static/app.js`)** — Runs 100% client-side in the browser (including GitHub Pages) with on-demand `sql.js` WebAssembly `.sq` parsing, live CORS-enabled COD/OPTIMADE queries, and a damped Levenberg–Marquardt Rietveld engine.

---

## Key Features

### 1. Multi-Format XRD Scan & Structure Import
- Drag-and-drop directly onto the graph canvas or use **+ Upload XRD** for `.xy`, `.csv`, `.txt`, `.dat`, `.xrdml` (PANalytical XML), and `.cif` crystallographic files.
- Interactive preset library (**ZnO Wurtzite**, **TiO₂ Anatase**, **BaTiO₃ Perovskite**, **Si NIST 640d**, **α-Al₂O₃ Corundum**).

### 2. Connected Crystallographic Databases & `Restraints`
- **Explicit Search-Match (`Auto Match`)**: Phase matching runs strictly on user command (**Auto Match** or **Search with restraints**), ranking candidate phases via Hanawalt /QualX bidirectional peak-position and intensity figure-of-merit (**FoM**) scoring.
- **Local Folder & `.sq` SQLite Databases (`db index`)**:
  - Pre-seeded with 16 curated reference `.cif` and `.json` phase cards in `database/`.
  - Connect external desktop `.sq` / `.sqlite` / `.db` databases (including PDF-2 `pdf2-1.sq` schemas with JCPDS `XXX-XXXX` formatting) without copying multi-hundred-MB files.
- **Crystallography Open Database (COD)**: Live REST search by formula, stoichiometry, element restraints, or COD ID, downloading `.cif` files and computing space-group symmetry equivalents, Cromer–Mann atomic form factors $f_j(\sin\theta/\lambda)$, Lorentz–polarization corrections, and exact Bragg intensities $|F_{hkl}|^2$.
- **OPTIMADE Consortium**: Live crystal structure retrieval across Materials Cloud and COD OPTIMADE endpoints.
- **6-Tab `Restraints` Filter Window**: Interactive 103-element Periodic Table (**And**, **Or**, **Not**, **Only**, **Just** logic modes + group/period toggles), Subfiles, Chemical Name, Entry IDs/ranges, Crystal System/Space Group, and Unit-Cell/Density bounds.

### 3. General 7-Crystal-System `(hkl)` Indexing & Full-Profile Rietveld Refinement
- **Reciprocal Metric Tensor $G^*$**: Exact $1/d_{hkl}^2$ evaluation across all 7 crystal systems (*Cubic*, *Tetragonal*, *Hexagonal*, *Trigonal*, *Orthorhombic*, *Monoclinic*, and *Triclinic*).
- **Two-Stage Crystallographic Rietveld Workflow**:
  - **Background**: Orthogonal Chebyshev polynomial baseline warm-started from non-peak anchor regions via weighted least squares.
  - **Specimen & Goniometer Geometry**: Joint refinement of symmetry-constrained unit cell $(a, b, c, \alpha, \beta, \gamma)$, goniometer zero-shift, and orthogonalized Bragg–Brentano specimen displacement $\Delta s \cos\theta$.
  - **Thompson–Cox–Hastings (TCH) Pseudo-Voigt Profile**: Separate Gaussian Caglioti $(U, V, W)$ and Lorentzian size–strain $(X_L, Y_L)$ breadth components mapped via 5th-order TCH polynomials.
  - **Cu $K\alpha_1 / K\alpha_2$ Rachinger Doublet & Texture**: Automatic $K\alpha_1$ ($\lambda_1 = 1.540598\text{ \AA}$) + $K\alpha_2$ ($\lambda_2 = 1.544426\text{ \AA}$) doublet modeling, March–Dollase preferred orientation $G_{hkl}(r_{\text{MD}})$, and overall Debye–Waller attenuation.
  - **Statistical & Microstructural Figures of Merit**: Weighted profile $R_{wp}$, profile $R_p$, expected $R_{\text{exp}}$, goodness-of-fit $\chi^2$, Rietveld Bragg factor $R_B$, instrumental-corrected Scherrer coherent domain size $D$ (nm), Stokes–Wilson microstrain $\varepsilon$ (%), and Ruland crystallinity index (%).

### 4. Interactive Publication Canvas, 300 DPI PNG & Manuscript Report
- **Interactive Canvas**: Mouse-wheel $2\theta$ zoom, click-drag horizontal $2\theta$ panning, live `2θ | d | I` cursor readout, and **Manual Edit** mode to drag or inline-edit `(hkl)` peak labels, pattern legends, axis titles, and top-right JCPDS/COD reference tags.
- **True 300 DPI PNG Export**: Exports `1800 × 1575 px` (`6.0 × 5.25 in`) figures with a binary PNG `pHYs` chunk (`11811 px/m` = 300 DPI) ready for journal submission.
- **Automated Report Generator**: One-click editable manuscript summary, side-by-side 300 DPI Indexed Pattern & Rietveld figures, structural/agreement tables, standalone HTML export, CSV peak table export, and print/PDF stylesheet.
- **Responsive Across Devices**: Fluidly adapts from ultrawide lab monitors (`>=1640px`), standard desktops, and compact `1366×768` laptops down to tablets (`<=1024px`) and mobile phones (`<=640px`).

---

## Quick Start

### Windows One-Click Launch
Double-click `start.bat` (uses `.venv` automatically if present, or system `python`), or run from PowerShell/Command Prompt:

```powershell
python -m venv .venv
.venv\Scripts\pip install -r requirements.txt
.venv\Scripts\python -m uvicorn server:app --host 127.0.0.1 --port 8000
```

### Linux / macOS (`uv` or `pip`)

```bash
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn server:app --host 0.0.0.0 --port 8000
```

Open **`http://127.0.0.1:8000`** in your browser.

### Docker

```bash
docker build -t diffracta .
docker run -p 8000:8000 diffracta
```

---

## Running Tests

```bash
pytest -v
node --check static/app.js
```

---

## Project Structure

```text
Diffracta/
├── index.html                 # Main application shell (synced with static/index.html)
├── server.py                  # FastAPI REST endpoints, security headers & static mount
├── xrd_engine.py              # Scientific XRD, COD CIF F_hkl, .sq SQLite & Rietveld engine
├── static/
│   ├── app.js                 # Interactive canvas, client crystallography & UI controller
│   ├── styles.css             # Responsive Swamp / Chive Blossom / Rose Red theme
│   ├── favicon.svg            # Diffracta vector mark
│   └── index.html             # Static fallback entrypoint
├── database/                  # Built-in reference .cif and .json phase cards
├── sample_data/               # Sample .xy scans, .cif structures & demo pdf2-1.sq
└── tests/
    └── test_app.py            # Automated backend, scientific workflow & DOM/JS test suite
```
