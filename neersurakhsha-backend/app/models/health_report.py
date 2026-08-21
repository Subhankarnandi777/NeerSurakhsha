from sqlalchemy import Column, String, Integer, Boolean, JSON, DateTime, func, ForeignKey
from app.core.database import Base

class HealthReportModel(Base):
    __tablename__ = "health_reports"

    id = Column(String, primary_key=True, index=True)
    household_id = Column(String, nullable=False)
    patient_name = Column(String, nullable=False)
    age = Column(Integer, nullable=False)
    gender = Column(String, nullable=False)
    village = Column(String, nullable=False)
    report_date = Column(DateTime(timezone=True), server_default=func.now())
    symptoms = Column(JSON, nullable=False, default=list)
    severity = Column(String, nullable=False, default="Mild")
    source_id = Column(String, ForeignKey("water_sources.id", ondelete="SET NULL"), nullable=True)
    notes = Column(String, nullable=True)
    synced = Column(Boolean, default=True)
    created_by = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
