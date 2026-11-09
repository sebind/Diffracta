# Diffracta

Web application for X-ray diffraction (XRD) phase matching, Miller index `(hkl)` assignment, Rietveld refinement, and 300 DPI publication figure export.

## Features

- **Multi-Format XRD Import**: `.xy`, `.csv`, `.txt`, `.dat`, `.xrdml`, and `.cif`.
- **Connected Databases**:
  - **Local Folder (`database/`)**: Pre-seeded with 16 reference `.cif` and `.json` phase cards and dynamically indexes any new `.cif` or `.json` files placed in the directory.
  - **Crystallography Open Database (COD)**: Live REST API query and `.cif` structure-factor calculation.
  - **OPTIMADE / RRUFF**: Live crystal structure queries across Materials Cloud, COD OPTIMADE, and RRUFF/ICDD reference cards.
- **Miller Index Assignment**: Automated peak detection and `(hkl)` indexing via reference phases or unit-cell parameters ($a, b, c$).
- **Rietveld Refinement**: Non-linear least-squares full-profile refinement (pseudo-Voigt peak shape, Caglioti $U, V, W$, unit cell $a, c$, zero-shift, Chebyshev polynomial background, Scherrer crystallite size, $R_{wp}, R_p, R_{exp}, \chi^2$).
- **Publication Graph & 300 DPI PNG Export**: Stacked, Rietveld, and Overlay plots rendered at `1800 × 1575 px` with an embedded PNG `pHYs` chunk (`11811 px/m` = 300 DPI).

## Quick Start

### Using `uv`

```bash
uv venv
uv pip install -r requirements.txt
uv run uvicorn server:app --host 0.0.0.0 --port 8000
```

### Using `pip`

```bash
pip install -r requirements.txt
python server.py
```

### Using Docker

```bash
docker build -t diffracta .
docker run -p 8000:8000 diffracta
```

Open `http://localhost:8000`.
