from pydantic import BaseModel
from datetime import datetime

class GroundwaterReadingBase(BaseModel):
    sourceId: str
    water_level_depth: float

class GroundwaterReadingCreate(GroundwaterReadingBase):
<<<<<<< HEAD
    id: str
    date: str
=======
    pass
>>>>>>> 559c10258b8859c7ff71cb71d7ac8eb51d12222f

class GroundwaterReading(GroundwaterReadingBase):
    id: str
    date: datetime

    class Config:
        from_attributes = True
