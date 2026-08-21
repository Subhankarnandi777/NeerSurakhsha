from sqlalchemy import Column, String, Float, DateTime, func
from app.core.database import Base

class GroundwaterReadingModel(Base):
    __tablename__ = "groundwater_readings"

    id = Column(String, primary_key=True, index=True)
    dwlr_id = Column(String, nullable=False, index=True)
    location_name = Column(String, nullable=False)
    water_table_depth_m = Column(Float, nullable=False)
    trend = Column(String, nullable=False, default="Stable")
    measured_at = Column(DateTime(timezone=True), server_default=func.now())
