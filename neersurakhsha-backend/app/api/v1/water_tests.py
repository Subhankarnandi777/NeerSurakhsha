from fastapi import APIRouter
from typing import List
from app.schemas.water_test import WaterTestResponse, WaterTestCreate
from app.core.database import supabase_client
from app.engines.health_engine import health_engine
import uuid

router = APIRouter(prefix="/water-tests", tags=["Water Quality Testing"])

@router.get("", response_model=List[WaterTestResponse])
def get_water_tests():
    tests = supabase_client.from_table("water_tests", "order=tested_at.desc")
    return tests

@router.post("", response_model=WaterTestResponse)
def submit_water_test(payload: WaterTestCreate):
    data = payload.model_dump()
    if not data.get("id"):
        data["id"] = f"WT-{str(uuid.uuid4())[:8].upper()}"

    inserted = supabase_client.insert("water_tests", data)

    # Update source with new test result
    source_id = data["source_id"]
    sources = supabase_client.from_table("water_sources", f"id=eq.{source_id}")
    if sources:
        source = sources[0]
        analysis = health_engine.analyze_health_cases_for_source(
            cases_count=source.get("health_cases_count", 0),
            h2s_result=data["h2s_test_result"],
            groundwater_trend=source.get("groundwater_trend", "Stable")
        )
        supabase_client.insert("water_sources", {
            "id": source_id,
            "last_test_result": data["h2s_test_result"],
            "status": analysis["status"],
            "risk_explanation": analysis["explanations"]
        })

    return inserted
