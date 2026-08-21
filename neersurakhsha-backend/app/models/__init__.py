from app.models.user import UserProfileModel
from app.models.water_source import WaterSourceModel
from app.models.health_report import HealthReportModel
from app.models.water_test import WaterTestModel
from app.models.groundwater_reading import GroundwaterReadingModel
from app.models.alert import AlertModel, AdvisoryModel

__all__ = [
    "UserProfileModel",
    "WaterSourceModel",
    "HealthReportModel",
    "WaterTestModel",
    "GroundwaterReadingModel",
    "AlertModel",
    "AdvisoryModel",
]
