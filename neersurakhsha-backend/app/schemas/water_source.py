from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class WaterSourceBase(BaseModel):
    name: str
    type: str
    status: str = "SAFE"
    distance: int = 0
    lat: Optional[float] = None
    lng: Optional[float] = None
    households_using: int = 0
    last_test_result: Optional[str] = "Pending"
    groundwater_trend: Optional[str] = "Stable"
    health_cases_count: int = 0
    risk_explanation: Optional[List[str]] = []
    recommended_alternative_id: Optional[str] = None

class WaterSourceCreate(WaterSourceBase):
    id: str

class WaterSourceResponse(WaterSourceBase):
    id: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
