from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import CORS_ORIGINS
from .api.routes import router

app = FastAPI(
    title="Urban Heat Hotspot Intelligence API — Mysuru",
    description="FastAPI backend service exposing real satellite rasters (LST, NDVI, NDBI), locked Random Forest model predictions, and spatial statistics.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

# Configure CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Router
app.include_router(router)

@app.get("/", tags=["Health"])
def root():
    return {
        "status": "online",
        "service": "Urban Heat Hotspot Intelligence API",
        "study_area": "Mysuru, Karnataka, India",
        "docs": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="127.0.0.1", port=8000, reload=True)
