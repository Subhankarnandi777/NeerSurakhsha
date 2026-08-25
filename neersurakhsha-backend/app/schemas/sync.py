from typing import List, Optional
from pydantic import BaseModel
from .health_report import HealthCaseCreate, HealthCase
from .water_source import WaterSource
<<<<<<< HEAD
from .water_test import WaterTestCreate
from .groundwater_reading import GroundwaterReadingCreate

class SyncPayload(BaseModel):
    healthCases: List[HealthCaseCreate]
    waterTests: Optional[List[WaterTestCreate]] = []
    groundwaterReadings: Optional[List[GroundwaterReadingCreate]] = []
=======

class SyncPayload(BaseModel):
    healthCases: List[HealthCaseCreate]
    # In the future, test results could be added here
>>>>>>> 559c10258b8859c7ff71cb71d7ac8eb51d12222f
    
class SyncResponse(BaseModel):
    status: str
    syncedHealthCases: int
<<<<<<< HEAD
    syncedWaterTests: int = 0
    syncedGroundwaterReadings: int = 0
=======
>>>>>>> 559c10258b8859c7ff71cb71d7ac8eb51d12222f
    updatedSources: List[WaterSource]
