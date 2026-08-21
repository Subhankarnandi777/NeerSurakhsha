from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.core.config import settings
from supabase import create_client, Client
import urllib.request
import json

# Setup SQLAlchemy engine (handling PostgreSQL database connection)
engine = create_engine(
    settings.DATABASE_URL,
    pool_pre_ping=True,
    echo=False
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Official Supabase Python Client Builder
def get_supabase_client():
    url = settings.SUPABASE_URL
    key = settings.SUPABASE_ANON_KEY
    if url and key and url != "https://your-supabase-project-id.supabase.co":
        try:
            return create_client(url, key)
        except Exception as e:
            print(f"Supabase client initialization warning: {e}")
    return None

# Lightweight Supabase REST Helper
class SupabaseRESTClient:
    def __init__(self, url: str, key: str):
        self.url = url.rstrip('/')
        self.key = key

    def _headers(self):
        return {
            "apikey": self.key,
            "Authorization": f"Bearer {self.key}",
            "Content-Type": "application/json",
            "Prefer": "return=representation"
        }

    def from_table(self, table: str, query: str = ""):
        endpoint = f"{self.url}/rest/v1/{table}?{query}"
        req = urllib.request.Request(endpoint, headers=self._headers())
        try:
            with urllib.request.urlopen(req) as resp:
                data = resp.read().decode('utf-8')
                return json.loads(data)
        except Exception as e:
            print(f"Supabase REST query error: {e}")
            return []

    def insert(self, table: str, payload: dict):
        endpoint = f"{self.url}/rest/v1/{table}"
        data_bytes = json.dumps(payload).encode('utf-8')
        req = urllib.request.Request(endpoint, data=data_bytes, headers=self._headers(), method='POST')
        try:
            with urllib.request.urlopen(req) as resp:
                res = resp.read().decode('utf-8')
                return json.loads(res) if res else payload
        except Exception as e:
            print(f"Supabase insert error: {e}")
            return payload

supabase_client = SupabaseRESTClient(settings.SUPABASE_URL, settings.SUPABASE_ANON_KEY)
supabase = get_supabase_client()
