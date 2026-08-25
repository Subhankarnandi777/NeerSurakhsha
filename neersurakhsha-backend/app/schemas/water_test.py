from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class WaterTestBase(BaseModel):
    sourceId: str
    ph_level: Optional[float] = None
    turbidity: Optional[float] = None
    fluoride: Optional[float] = None
    arsenic: Optional[float] = None
    coliform: Optional[float] = None

class WaterTestCreate(WaterTestBase):
<<<<<<< HEAD
    id: str
    date: str
=======
    pass
>>>>>>> 559c10258b8859c7ff71cb71d7ac8eb51d12222f

class WaterTest(WaterTestBase):
    id: str
    date: datetime

    class Config:
        from_attributes = True
