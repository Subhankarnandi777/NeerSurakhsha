import os
import sys
import psycopg2
from app.core.config import settings

def init_db():
    print("=" * 60)
    print("NeerSurakhsha Supabase Database Auto-Initializer")
    print("=" * 60)

    db_url = settings.DATABASE_URL
    print(f"Connecting to database: {db_url.split('@')[-1] if '@' in db_url else db_url}")

    # Locate supabase_schema.sql
    schema_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "supabase_schema.sql"))
    if not os.path.exists(schema_path):
        schema_path = os.path.abspath(os.path.join(os.path.dirname(__file__), "supabase_schema.sql"))

    if not os.path.exists(schema_path):
        print(f"ERROR: Could not find supabase_schema.sql at {schema_path}")
        return

    with open(schema_path, "r", encoding="utf-8") as f:
        sql_script = f.read()

    try:
        conn = psycopg2.connect(db_url)
        conn.autocommit = True
        cursor = conn.cursor()
        print("Executing schema script...")
        cursor.execute(sql_script)
        print("[SUCCESS] All database tables, RLS policies, triggers, and seed data created successfully!")
        cursor.close()
        conn.close()
    except Exception as e:
        print(f"[WARNING] Database connection error: {e}")
        print("\nTip: Ensure your Supabase DATABASE_URL is set in neersurakhsha-backend/.env:")
        print("DATABASE_URL=postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres")
        print("\nAlternatively, copy the contents of supabase_schema.sql into your Supabase Dashboard SQL Editor (https://supabase.com/dashboard/project/_/sql) and click RUN.")

if __name__ == "__main__":
    init_db()
