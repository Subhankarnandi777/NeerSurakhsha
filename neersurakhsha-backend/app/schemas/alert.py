from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class AlertBase(BaseModel):
    title: str
    description: str
    severity: str = "Medium"
    village: str
    source_id: Optional[str] = None
    status: str = "ACTIVE"

class AlertCreate(AlertBase):
    id: Optional[str] = None

class AlertResponse(AlertBase):
    id: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class AdvisoryResponse(BaseModel):
    id: str
    title: str
    content: str
    category: str
    language: str
    target_role: Optional[str] = "ALL"
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
