from fastapi import APIRouter
from typing import List
from app.schemas.groundwater_reading import GroundwaterReadingResponse, GroundwaterReadingCreate
from app.core.database import supabase_client
import uuid

router = APIRouter(prefix="/groundwater", tags=["Groundwater & DWLR Hydrogeology"])

@router.get("", response_model=List[GroundwaterReadingResponse])
def get_groundwater_readings():
    readings = supabase_client.from_table("groundwater_readings", "order=measured_at.desc")
    return readings

@router.post("", response_model=GroundwaterReadingResponse)
def submit_groundwater_reading(payload: GroundwaterReadingCreate):
    data = payload.model_dump()
    if not data.get("id"):
        data["id"] = f"GW-{str(uuid.uuid4())[:8].upper()}"

    inserted = supabase_client.insert("groundwater_readings", data)
    return inserted
