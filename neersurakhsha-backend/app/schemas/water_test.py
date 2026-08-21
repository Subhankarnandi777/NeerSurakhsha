from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class WaterTestBase(BaseModel):
    source_id: str
    h2s_test_result: str
    ph_level: Optional[float] = None
    turbidity: Optional[float] = None
    tds: Optional[float] = None
    notes: Optional[str] = None

class WaterTestCreate(WaterTestBase):
    id: Optional[str] = None

class WaterTestResponse(WaterTestBase):
    id: str
    tested_at: Optional[datetime] = None

    class Config:
        from_attributes = True
