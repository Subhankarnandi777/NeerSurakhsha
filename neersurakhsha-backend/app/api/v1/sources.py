from fastapi import APIRouter, HTTPException
from typing import List
from app.schemas.water_source import WaterSourceResponse, WaterSourceCreate
from app.core.database import supabase_client
from app.engines.vwsi_engine import vwsi_engine

router = APIRouter(prefix="/sources", tags=["Water Sources"])

DEFAULT_SOURCES = [
    {
        "id": "HP-007",
        "name": "Primary Handpump 007",
        "type": "Handpump",
        "status": "HIGH_RISK",
        "distance": 120,
        "lat": 26.2,
        "lng": 91.7,
        "households_using": 45,
        "last_test_result": "Positive",
        "groundwater_trend": "Rising",
        "health_cases_count": 8,
        "risk_explanation": [
            "H₂S test positive",
            "8 diarrhoea cases reported",
            "Groundwater level rising rapidly"
        ],
        "recommended_alternative_id": "TW-001"
    },
    {
        "id": "TW-001",
        "name": "School Tubewell",
        "type": "Tubewell",
        "status": "SAFE",
        "distance": 450,
        "lat": 26.205,
        "lng": 91.708,
        "households_using": 120,
        "last_test_result": "Negative",
        "groundwater_trend": "Stable",
        "health_cases_count": 0,
        "risk_explanation": [],
        "recommended_alternative_id": None
    }
]

@router.get("", response_model=List[WaterSourceResponse])
def get_all_sources():
    sources = supabase_client.from_table("water_sources")
    if not sources:
        return DEFAULT_SOURCES
    return sources

@router.get("/{source_id}", response_model=WaterSourceResponse)
def get_source_by_id(source_id: str):
    sources = supabase_client.from_table("water_sources", f"id=eq.{source_id}")
    if not sources:
        matching = [s for s in DEFAULT_SOURCES if s["id"] == source_id]
        if matching:
            return matching[0]
        raise HTTPException(status_code=404, detail="Water source not found")
    return sources[0]

@router.post("", response_model=WaterSourceResponse)
def create_water_source(payload: WaterSourceCreate):
    inserted = supabase_client.insert("water_sources", payload.model_dump())
    return inserted

@router.get("/vwsi/summary")
def get_vwsi_summary():
    sources = supabase_client.from_table("water_sources") or DEFAULT_SOURCES
    summary = vwsi_engine.calculate_vwsi(sources)
    return summary
