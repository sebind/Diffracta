@echo off
setlocal
cd /d "%~dp0"

set "PORT=8000"
start "" "http://127.0.0.1:%PORT%"

if exist "%~dp0.venv\Scripts\python.exe" (
    "%~dp0.venv\Scripts\python.exe" -m uvicorn server:app --host 127.0.0.1 --port %PORT% --app-dir "%~dp0"
) else (
    python -m uvicorn server:app --host 127.0.0.1 --port %PORT% --app-dir "%~dp0"
)
