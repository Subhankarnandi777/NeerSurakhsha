from sqlalchemy import Column, String, Integer, Float, JSON, DateTime, func
from app.core.database import Base

class WaterSourceModel(Base):
    __tablename__ = "water_sources"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, nullable=False)
    type = Column(String, nullable=False)
    status = Column(String, nullable=False, default="SAFE")
    distance = Column(Integer, default=0)
    lat = Column(Float, nullable=True)
    lng = Column(Float, nullable=True)
    households_using = Column(Integer, default=0)
    last_test_result = Column(String, default="Pending")
    groundwater_trend = Column(String, default="Stable")
    health_cases_count = Column(Integer, default=0)
    risk_explanation = Column(JSON, default=list)
    recommended_alternative_id = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
