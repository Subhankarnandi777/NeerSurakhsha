from typing import List, Optional
from pydantic import BaseModel
from .health_report import HealthCaseCreate, HealthCase
from .water_source import WaterSource

class SyncPayload(BaseModel):
    healthCases: List[HealthCaseCreate]
    # In the future, test results could be added here
    
class SyncResponse(BaseModel):
    status: str
    syncedHealthCases: int
    updatedSources: List[WaterSource]
