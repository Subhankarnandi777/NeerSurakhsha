from fastapi import APIRouter
from app.api.v1.auth import router as auth_router
from app.api.v1.sources import router as sources_router
from app.api.v1.health_reports import router as health_router
from app.api.v1.water_tests import router as tests_router
from app.api.v1.groundwater import router as groundwater_router
from app.api.v1.alerts import router as alerts_router
from app.api.v1.sync import router as sync_router

api_router = APIRouter()

api_router.include_router(auth_router)
api_router.include_router(sources_router)
api_router.include_router(health_router)
api_router.include_router(tests_router)
api_router.include_router(groundwater_router)
api_router.include_router(alerts_router)
api_router.include_router(sync_router)
