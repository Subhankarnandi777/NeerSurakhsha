from typing import Any
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api import deps
from app.schemas.sync import SyncPayload, SyncResponse
from app.models.health_report import HealthCase
from app.models.water_source import WaterSource

router = APIRouter()

@router.post("/", response_model=SyncResponse)
def sync_data(
    *,
    db: Session = Depends(deps.get_db),
    payload: SyncPayload,
) -> Any:
    """
    Sync offline data from the frontend app.
    Process the payload and return the latest global state.
    """
    synced_count = 0
    # Process health cases
    for hc in payload.healthCases:
        # Check if exists
        existing = db.query(HealthCase).filter(HealthCase.id == hc.id).first()
        if not existing:
            new_case = HealthCase(
                id=hc.id,
                householdId=hc.householdId,
                patientName=hc.patientName,
                age=hc.age,
                gender=hc.gender,
                village=hc.village,
                date=hc.date,
                symptoms=hc.symptoms,
                severity=hc.severity,
                sourceId=hc.sourceId,
                notes=hc.notes,
                synced=True
            )
            db.add(new_case)
            
            # Increment healthCasesCount in the corresponding WaterSource and recompute
            source = db.query(WaterSource).filter(WaterSource.id == hc.sourceId).first()
            if source:
                from app.engines.decision_engine import recompute_source_status
                recompute_source_status(db, source, new_case)
            synced_count += 1
            
    db.commit()
    
    # Return updated sources for the frontend to update its store
    updated_sources = db.query(WaterSource).all()
    
    return SyncResponse(
        status="SUCCESS",
        syncedHealthCases=synced_count,
        updatedSources=updated_sources
    )
