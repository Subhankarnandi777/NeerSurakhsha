from typing import Optional, List
<<<<<<< HEAD
from pydantic import AliasChoices, BaseModel, Field
=======
from pydantic import BaseModel
>>>>>>> 559c10258b8859c7ff71cb71d7ac8eb51d12222f

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
<<<<<<< HEAD
    healthCasesCount: int = Field(
        default=0,
        validation_alias=AliasChoices("healthCasesCount", "health_cases_count"),
    )
    riskExplanation: Optional[List[str]] = Field(
        default=None,
        validation_alias=AliasChoices("riskExplanation", "risk_explanation"),
    )
=======
    healthCasesCount: int = 0
    riskExplanation: Optional[List[str]] = None
>>>>>>> 559c10258b8859c7ff71cb71d7ac8eb51d12222f
    recommendedAlternativeId: Optional[str] = None

class WaterSourceCreate(WaterSourceBase):
    id: str

class WaterSourceUpdate(WaterSourceBase):
    pass

class WaterSource(WaterSourceBase):
    id: str

    class Config:
        from_attributes = True
