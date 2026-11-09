@echo off
start http://127.0.0.1:8000
"e:\XRD\.venv\Scripts\uvicorn.exe" server:app --host 127.0.0.1 --port 8000 --app-dir "e:\XRD"
