from fastapi import APIRouter, HTTPException
from typing import List
from app.schemas.health_report import HealthReportResponse, HealthReportCreate
from app.core.database import supabase_client
from app.engines.health_engine import health_engine
import uuid

router = APIRouter(prefix="/health-reports", tags=["Health Surveillance"])

@router.get("", response_model=List[HealthReportResponse])
def list_health_reports():
    reports = supabase_client.from_table("health_reports", "order=created_at.desc")
    return reports

@router.post("", response_model=HealthReportResponse)
def submit_health_report(payload: HealthReportCreate):
    data = payload.model_dump()
    if not data.get("id"):
        data["id"] = f"HC-{str(uuid.uuid4())[:8].upper()}"

    inserted = supabase_client.insert("health_reports", data)

    # Trigger health engine evaluation if source_id is provided
    if data.get("source_id"):
        source_id = data["source_id"]
        # Increment health case count for source
        sources = supabase_client.from_table("water_sources", f"id=eq.{source_id}")
        if sources:
            source = sources[0]
            new_count = source.get("health_cases_count", 0) + 1
            analysis = health_engine.analyze_health_cases_for_source(
                cases_count=new_count,
                h2s_result=source.get("last_test_result", "Pending"),
                groundwater_trend=source.get("groundwater_trend", "Stable")
            )
            # Update source risk status
            supabase_client.insert("water_sources", {
                "id": source_id,
                "health_cases_count": new_count,
                "status": analysis["status"],
                "risk_explanation": analysis["explanations"]
            })

    return inserted
