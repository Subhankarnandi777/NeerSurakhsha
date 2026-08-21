from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class HealthReportBase(BaseModel):
    household_id: str
    patient_name: str
    age: int
    gender: str
    village: str
    symptoms: List[str] = []
    severity: str = "Mild"
    source_id: Optional[str] = None
    notes: Optional[str] = None
    synced: bool = True

class HealthReportCreate(HealthReportBase):
    id: Optional[str] = None

class HealthReportResponse(HealthReportBase):
    id: str
    report_date: Optional[datetime] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
