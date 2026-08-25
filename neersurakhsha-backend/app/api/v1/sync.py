from typing import Any
<<<<<<< HEAD
import datetime
=======
>>>>>>> 559c10258b8859c7ff71cb71d7ac8eb51d12222f
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api import deps
from app.schemas.sync import SyncPayload, SyncResponse
from app.models.health_report import HealthCase
from app.models.water_source import WaterSource
<<<<<<< HEAD
from app.models.water_test import WaterTest
from app.models.groundwater_reading import GroundwaterReading
=======
>>>>>>> 559c10258b8859c7ff71cb71d7ac8eb51d12222f

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
            
<<<<<<< HEAD
    synced_water_tests = 0
    if payload.waterTests:
        for wt in payload.waterTests:
            existing = db.query(WaterTest).filter(WaterTest.id == wt.id).first()
            if not existing:
                try:
                    dt = datetime.datetime.fromisoformat(wt.date.replace('Z', '+00:00'))
                except:
                    dt = datetime.datetime.utcnow()
                new_wt = WaterTest(
                    id=wt.id,
                    sourceId=wt.sourceId,
                    date=dt,
                    coliform=wt.coliform,
                    ph_level=wt.ph_level,
                    turbidity=wt.turbidity,
                    fluoride=wt.fluoride,
                    arsenic=wt.arsenic
                )
                db.add(new_wt)
                synced_water_tests += 1

    synced_gw_readings = 0
    if payload.groundwaterReadings:
        for gw in payload.groundwaterReadings:
            existing = db.query(GroundwaterReading).filter(GroundwaterReading.id == gw.id).first()
            if not existing:
                try:
                    dt = datetime.datetime.fromisoformat(gw.date.replace('Z', '+00:00'))
                except:
                    dt = datetime.datetime.utcnow()
                new_gw = GroundwaterReading(
                    id=gw.id,
                    sourceId=gw.sourceId,
                    date=dt,
                    water_level_depth=gw.water_level_depth
                )
                db.add(new_gw)
                synced_gw_readings += 1
                
=======
>>>>>>> 559c10258b8859c7ff71cb71d7ac8eb51d12222f
    db.commit()
    
    # Return updated sources for the frontend to update its store
    updated_sources = db.query(WaterSource).all()
    
    return SyncResponse(
        status="SUCCESS",
        syncedHealthCases=synced_count,
<<<<<<< HEAD
        syncedWaterTests=synced_water_tests,
        syncedGroundwaterReadings=synced_gw_readings,
=======
>>>>>>> 559c10258b8859c7ff71cb71d7ac8eb51d12222f
        updatedSources=updated_sources
    )
