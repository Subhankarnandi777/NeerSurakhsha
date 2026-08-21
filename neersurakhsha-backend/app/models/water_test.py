from sqlalchemy import Column, String, Float, DateTime, func, ForeignKey
from app.core.database import Base

class WaterTestModel(Base):
    __tablename__ = "water_tests"

    id = Column(String, primary_key=True, index=True)
    source_id = Column(String, ForeignKey("water_sources.id", ondelete="CASCADE"), nullable=False)
    h2s_test_result = Column(String, nullable=False)
    ph_level = Column(Float, nullable=True)
    turbidity = Column(Float, nullable=True)
    tds = Column(Float, nullable=True)
    notes = Column(String, nullable=True)
    tested_at = Column(DateTime(timezone=True), server_default=func.now())
    tested_by = Column(String, nullable=True)
