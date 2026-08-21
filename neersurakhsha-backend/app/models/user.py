from sqlalchemy import Column, String, DateTime, func
from app.core.database import Base

class UserProfileModel(Base):
    __tablename__ = "profiles"

    id = Column(String, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    email = Column(String, nullable=False, index=True)
    phone = Column(String, nullable=True)
    role = Column(String, nullable=False, default="ASHA Worker")
    village_name = Column(String, nullable=True, default="Brahmapur Char")
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
