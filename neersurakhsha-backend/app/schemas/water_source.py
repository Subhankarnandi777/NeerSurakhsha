from typing import Optional, List
from pydantic import BaseModel

class WaterSourceBase(BaseModel):
    name: str
    type: str
    status: str
    distance: Optional[float] = None
    lat: float
    lng: float
    householdsUsing: int
    lastTestResult: Optional[str] = None
    groundwaterTrend: Optional[str] = None
    healthCasesCount: int = 0
    riskExplanation: Optional[List[str]] = None
    recommendedAlternativeId: Optional[str] = None

class WaterSourceCreate(WaterSourceBase):
    id: str

class WaterSourceUpdate(WaterSourceBase):
    pass

class WaterSource(WaterSourceBase):
    id: str

    class Config:
        from_attributes = True
