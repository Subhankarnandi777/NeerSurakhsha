from fastapi import APIRouter
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from app.core.database import supabase_client
from app.api.v1.health_reports import submit_health_report
from app.api.v1.water_tests import submit_water_test
from app.schemas.health_report import HealthReportCreate
from app.schemas.water_test import WaterTestCreate

router = APIRouter(prefix="/sync", tags=["Offline Batch Synchronization"])

class SyncPayload(BaseModel):
    health_cases: Optional[List[Dict[str, Any]]] = []
    water_tests: Optional[List[Dict[str, Any]]] = []

@router.post("")
def sync_offline_payload(payload: SyncPayload):
    processed_health = 0
    processed_tests = 0

    if payload.health_cases:
        for case in payload.health_cases:
            try:
                report = HealthReportCreate(**case)
                submit_health_report(report)
                processed_health += 1
            except Exception as e:
                print(f"Sync health report error: {e}")

    if payload.water_tests:
        for test in payload.water_tests:
            try:
                wtest = WaterTestCreate(**test)
                submit_water_test(wtest)
                processed_tests += 1
            except Exception as e:
                print(f"Sync water test error: {e}")

    return {
        "status": "SUCCESS",
        "processed_health_cases": processed_health,
        "processed_water_tests": processed_tests,
        "message": f"Successfully synchronized {processed_health} health cases and {processed_tests} water tests."
    }
