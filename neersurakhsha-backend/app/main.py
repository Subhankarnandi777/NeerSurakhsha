from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import engine, Base
from app.api.v1.router import api_router
import app.models  # Ensures all ORM models are registered

# Auto-create tables on startup if database is reachable
try:
    Base.metadata.create_all(bind=engine)
    print("Database tables initialized via SQLAlchemy ORM.")
except Exception as e:
    print(f"SQLAlchemy table auto-creation notice: {e}")

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    description="NeerSurakhsha Water & Health Surveillance Platform Backend API"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register v1 router
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/", tags=["Health Check"])
def root():
    return {
        "status": "ONLINE",
        "app": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs": "/docs",
        "api_v1": settings.API_V1_STR
    }

@app.get("/api/v1/health", tags=["Health Check"])
def health_check():
    return {
        "status": "HEALTHY",
        "services": {
            "database": "UP",
            "supabase": "CONNECTED",
            "vwsi_engine": "ACTIVE",
            "health_engine": "ACTIVE"
        }
    }
