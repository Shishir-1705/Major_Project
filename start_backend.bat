@echo off
echo ============================================================
echo Starting Urban Heat Hotspot Detection FastAPI Backend Server
echo ============================================================
echo Endpoint: http://127.0.0.1:8000
echo Documentation: http://127.0.0.1:8000/docs
echo Health Check: http://127.0.0.1:8000/health
echo ============================================================
echo.

python -m uvicorn backend.app.main:app --host 127.0.0.1 --port 8000 --reload
