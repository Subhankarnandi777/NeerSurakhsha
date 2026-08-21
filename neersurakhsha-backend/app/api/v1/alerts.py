from fastapi import APIRouter
from typing import List
from app.schemas.alert import AlertResponse, AdvisoryResponse, AlertCreate
from app.core.database import supabase_client
import uuid

router = APIRouter(prefix="/alerts", tags=["Alerts & Advisories"])

DEFAULT_ALERTS = [
    {
        "id": "ALT-101",
        "title": "Contamination Risk Detected",
        "description": "Primary Handpump 007 has tested positive for H₂S bacterial contamination.",
        "severity": "Critical",
        "village": "Brahmapur Char",
        "source_id": "HP-007",
        "status": "ACTIVE"
    },
    {
        "id": "ALT-102",
        "title": "Diarrhoea Cluster Warning",
        "description": "8 cases of diarrhoea reported near Primary Handpump 007 in the last 48 hours.",
        "severity": "High",
        "village": "Brahmapur Char",
        "source_id": "HP-007",
        "status": "ACTIVE"
    }
]

DEFAULT_ADVISORIES = [
    {
        "id": "ADV-01",
        "title": "Boil Water Before Consumption",
        "content": "Always boil drinking water for at least 1 minute during flooding or heavy rainfall.",
        "category": "HEALTH",
        "language": "en",
        "target_role": "ALL"
    },
    {
        "id": "ADV-02",
        "title": "Use Chlorination Tablets",
        "content": "Use distributed halogen/chlorine tablets for community water storage containers.",
        "category": "WATER_SAFETY",
        "language": "en",
        "target_role": "ASHA Worker"
    }
]

@router.get("", response_model=List[AlertResponse])
def get_alerts():
    alerts = supabase_client.from_table("alerts", "status=eq.ACTIVE")
    if not alerts:
        return DEFAULT_ALERTS
    return alerts

@router.post("", response_model=AlertResponse)
def create_alert(payload: AlertCreate):
    data = payload.model_dump()
    if not data.get("id"):
        data["id"] = f"ALT-{str(uuid.uuid4())[:8].upper()}"

    inserted = supabase_client.insert("alerts", data)
    return inserted

@router.get("/advisories", response_model=List[AdvisoryResponse])
def get_advisories():
    advisories = supabase_client.from_table("advisories")
    if not advisories:
        return DEFAULT_ADVISORIES
    return advisories
