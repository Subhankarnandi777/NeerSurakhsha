import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "NeerSurakhsha API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"

    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://postgres:postgres@localhost:5432/neersurakhsha")
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "https://your-supabase-project-id.supabase.co")
    SUPABASE_ANON_KEY: str = os.getenv("SUPABASE_ANON_KEY", "your-supabase-anon-key-here")
    SUPABASE_SERVICE_ROLE_KEY: str = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")

    SECRET_KEY: str = os.getenv("SECRET_KEY", "neersurakhsha-secret-key-2026")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days

    CORS_ORIGINS: List[str] = [
        "http://localhost:8000",
        "http://localhost:8081",
        "http://localhost:19006",
        "http://localhost:3000",
        "*",
    ]

    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

settings = Settings()
