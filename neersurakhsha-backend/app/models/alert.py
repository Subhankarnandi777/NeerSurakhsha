from sqlalchemy import Column, String, DateTime, func, ForeignKey
from app.core.database import Base

class AlertModel(Base):
    __tablename__ = "alerts"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    description = Column(String, nullable=False)
    severity = Column(String, nullable=False, default="Medium")
    village = Column(String, nullable=False)
    source_id = Column(String, ForeignKey("water_sources.id", ondelete="SET NULL"), nullable=True)
    status = Column(String, nullable=False, default="ACTIVE")
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class AdvisoryModel(Base):
    __tablename__ = "advisories"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, nullable=False)
    content = Column(String, nullable=False)
    category = Column(String, nullable=False, default="HEALTH")
    language = Column(String, nullable=False, default="en")
    target_role = Column(String, default="ALL")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
