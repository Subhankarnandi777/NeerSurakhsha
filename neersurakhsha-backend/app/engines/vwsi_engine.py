from sqlalchemy.orm import Session
from app.models.water_source import WaterSource
from app.models.water_test import WaterTest
from sqlalchemy import desc

def compute_vwsi(db: Session, source: WaterSource, health_risk: str, aquifer_trend: str):
    """
    Compute Village Water Safety Index (VWSI) based on water test results, 
    health risk, and aquifer trend.
    """
    # Get latest water test
    latest_test = db.query(WaterTest)\
                    .filter(WaterTest.sourceId == source.id)\
                    .order_by(desc(WaterTest.date))\
                    .first()
                    
    water_quality_safe = True
    if latest_test:
        if (latest_test.arsenic and latest_test.arsenic > 0.01) or \
           (latest_test.fluoride and latest_test.fluoride > 1.5) or \
           (latest_test.coliform and latest_test.coliform > 0):
            water_quality_safe = False
            
    # Matrix
    if health_risk == "HIGH" or not water_quality_safe:
        status = "HIGH_RISK"
    elif health_risk == "MODERATE":
        status = "CONTAMINATION_RISK" 
    elif aquifer_trend == "FALLING":
        status = "AVAILABILITY_RISK"
    else:
        status = "SAFE"
        
    source.status = status
    return status
