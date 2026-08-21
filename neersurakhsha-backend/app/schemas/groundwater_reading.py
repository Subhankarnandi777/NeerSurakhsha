from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class GroundwaterReadingBase(BaseModel):
    dwlr_id: str
    location_name: str
    water_table_depth_m: float
    trend: str = "Stable"

class GroundwaterReadingCreate(GroundwaterReadingBase):
    id: Optional[str] = None

class GroundwaterReadingResponse(GroundwaterReadingBase):
    id: str
    measured_at: Optional[datetime] = None

    class Config:
        from_attributes = True
