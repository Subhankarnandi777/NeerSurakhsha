from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class UserProfileBase(BaseModel):
    full_name: str
    email: str
    phone: Optional[str] = None
    role: str = "ASHA Worker"
    village_name: Optional[str] = "Brahmapur Char"

class UserProfileCreate(UserProfileBase):
    pass

class UserProfileResponse(UserProfileBase):
    id: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class UserLoginRequest(BaseModel):
    identifier: str
    password: str
    role: Optional[str] = "ASHA Worker"

class UserRegisterRequest(BaseModel):
    email: str
    password: str
    full_name: str
    phone: str
    role: str = "ASHA Worker"
    village_name: Optional[str] = "Brahmapur Char"
