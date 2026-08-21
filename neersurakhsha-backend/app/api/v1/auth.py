from fastapi import APIRouter, HTTPException, Depends, status
from app.schemas.user import UserRegisterRequest, UserLoginRequest, UserProfileResponse
from app.core.database import supabase_client
import uuid

router = APIRouter(prefix="/auth", tags=["Authentication & User Profiles"])

@router.post("/register", response_model=UserProfileResponse)
def register_user(payload: UserRegisterRequest):
    user_id = str(uuid.uuid4())
    profile_data = {
        "id": user_id,
        "full_name": payload.full_name,
        "email": payload.email,
        "phone": payload.phone,
        "role": payload.role,
        "village_name": payload.village_name or "Brahmapur Char"
    }

    # Store profile in Supabase profiles table
    created = supabase_client.insert("profiles", profile_data)
    return created

@router.post("/login")
def login_user(payload: UserLoginRequest):
    profiles = supabase_client.from_table("profiles", f"email=eq.{payload.identifier}")
    if not profiles:
        profiles = supabase_client.from_table("profiles", f"phone=eq.{payload.identifier}")

    if not profiles:
        # Fallback profile
        return {
            "token": "demo-jwt-token-123",
            "profile": {
                "id": "demo-user-123",
                "full_name": "Demo User",
                "email": payload.identifier,
                "role": payload.role or "ASHA Worker",
                "village_name": "Brahmapur Char"
            }
        }

    profile = profiles[0]
    return {
        "token": f"token-{profile['id']}",
        "profile": profile
    }

@router.get("/profile/{user_id}", response_model=UserProfileResponse)
def get_user_profile(user_id: str):
    profiles = supabase_client.from_table("profiles", f"id=eq.{user_id}")
    if not profiles:
        raise HTTPException(status_code=404, detail="User profile not found")
    return profiles[0]
