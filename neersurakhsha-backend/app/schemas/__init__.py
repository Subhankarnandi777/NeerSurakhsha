from app.schemas.user import UserProfileBase, UserProfileCreate, UserProfileResponse, UserLoginRequest, UserRegisterRequest
from app.schemas.water_source import WaterSourceBase, WaterSourceCreate, WaterSourceResponse
from app.schemas.health_report import HealthReportBase, HealthReportCreate, HealthReportResponse
from app.schemas.water_test import WaterTestBase, WaterTestCreate, WaterTestResponse
from app.schemas.groundwater_reading import GroundwaterReadingBase, GroundwaterReadingCreate, GroundwaterReadingResponse
from app.schemas.alert import AlertBase, AlertCreate, AlertResponse, AdvisoryResponse

__all__ = [
    "UserProfileBase",
    "UserProfileCreate",
    "UserProfileResponse",
    "UserLoginRequest",
    "UserRegisterRequest",
    "WaterSourceBase",
    "WaterSourceCreate",
    "WaterSourceResponse",
    "HealthReportBase",
    "HealthReportCreate",
    "HealthReportResponse",
    "WaterTestBase",
    "WaterTestCreate",
    "WaterTestResponse",
    "GroundwaterReadingBase",
    "GroundwaterReadingCreate",
    "GroundwaterReadingResponse",
    "AlertBase",
    "AlertCreate",
    "AlertResponse",
    "AdvisoryResponse",
]
