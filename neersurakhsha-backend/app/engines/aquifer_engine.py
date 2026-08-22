from sqlalchemy.orm import Session
from app.models.water_source import WaterSource
from app.models.groundwater_reading import GroundwaterReading
from sqlalchemy import desc

def evaluate_aquifer_trend(db: Session, source: WaterSource):
    """
    Compute trend (RISING/FALLING/STABLE) from recent GroundwaterReadings.
    """
    readings = db.query(GroundwaterReading)\
                 .filter(GroundwaterReading.sourceId == source.id)\
                 .order_by(desc(GroundwaterReading.date))\
                 .limit(5).all()
                 
    if len(readings) < 2:
        source.groundwaterTrend = "STABLE"
        return "STABLE"
        
    # Oldest to newest
    readings.reverse()
    
    # water_level_depth is depth from surface. Increasing depth = FALLING water table.
    first_depth = readings[0].water_level_depth
    last_depth = readings[-1].water_level_depth
    
    # Basic linear diff for prototype
    diff = last_depth - first_depth
    
    if diff > 0.5: # Water table dropped by > 0.5m
        trend = "FALLING"
    elif diff < -0.5: # Water table rose by > 0.5m
        trend = "RISING"
    else:
        trend = "STABLE"
        
    source.groundwaterTrend = trend
    return trend
