-- ===================================================
-- NEERSURAKHSHA COMPLETE SUPABASE DATABASE SCHEMA & RLS SETUP
-- ===================================================
-- Run this script in your Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql)

-- 1. Create Profiles Table (Linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  role TEXT NOT NULL DEFAULT 'ASHA Worker' CHECK (role IN ('ASHA Worker', 'Jal Sahi', 'PHED Officer', 'Village Lead', 'Citizen')),
  village_name TEXT DEFAULT 'Brahmapur Char',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Public read profiles" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Public insert profiles" ON public.profiles FOR INSERT WITH CHECK (true);

-- Trigger to sync Auth user metadata to public.profiles
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, email, phone, role, village_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'phone', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'ASHA Worker'),
    COALESCE(NEW.raw_user_meta_data->>'village_name', 'Brahmapur Char')
  )
  ON CONFLICT (id) DO UPDATE SET
    full_name = EXCLUDED.full_name,
    phone = EXCLUDED.phone,
    role = EXCLUDED.role,
    village_name = EXCLUDED.village_name,
    updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 2. Water Sources Table
CREATE TABLE IF NOT EXISTS public.water_sources (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'SAFE' CHECK (status IN ('SAFE', 'CONTAMINATION_RISK', 'AVAILABILITY_RISK', 'HIGH_RISK')),
  distance INTEGER DEFAULT 0,
  lat DOUBLE PRECISION,
  lng DOUBLE PRECISION,
  households_using INTEGER DEFAULT 0,
  last_test_result TEXT DEFAULT 'Pending',
  groundwater_trend TEXT DEFAULT 'Stable',
  health_cases_count INTEGER DEFAULT 0,
  risk_explanation JSONB DEFAULT '[]'::jsonb,
  recommended_alternative_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.water_sources ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read water_sources" ON public.water_sources FOR SELECT USING (true);
CREATE POLICY "Allow write water_sources" ON public.water_sources FOR ALL USING (true);

-- 3. Health Reports Table
CREATE TABLE IF NOT EXISTS public.health_reports (
  id TEXT PRIMARY KEY,
  household_id TEXT NOT NULL,
  patient_name TEXT NOT NULL,
  age INTEGER NOT NULL,
  gender TEXT NOT NULL,
  village TEXT NOT NULL,
  report_date TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  symptoms JSONB NOT NULL DEFAULT '[]'::jsonb,
  severity TEXT NOT NULL DEFAULT 'Mild' CHECK (severity IN ('Mild', 'Moderate', 'Severe')),
  source_id TEXT REFERENCES public.water_sources(id) ON DELETE SET NULL,
  notes TEXT,
  synced BOOLEAN DEFAULT true,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.health_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read health_reports" ON public.health_reports FOR SELECT USING (true);
CREATE POLICY "Allow insert health_reports" ON public.health_reports FOR INSERT WITH CHECK (true);

-- 4. Water Quality Tests Table
CREATE TABLE IF NOT EXISTS public.water_tests (
  id TEXT PRIMARY KEY,
  source_id TEXT NOT NULL REFERENCES public.water_sources(id) ON DELETE CASCADE,
  h2s_test_result TEXT NOT NULL CHECK (h2s_test_result IN ('Positive', 'Negative', 'Pending')),
  ph_level DOUBLE PRECISION,
  turbidity DOUBLE PRECISION,
  tds DOUBLE PRECISION,
  notes TEXT,
  tested_at TIMESTAMPTZ DEFAULT NOW(),
  tested_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL
);

ALTER TABLE public.water_tests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read water_tests" ON public.water_tests FOR SELECT USING (true);
CREATE POLICY "Allow insert water_tests" ON public.water_tests FOR INSERT WITH CHECK (true);

-- 5. Groundwater DWLR Readings Table
CREATE TABLE IF NOT EXISTS public.groundwater_readings (
  id TEXT PRIMARY KEY,
  dwlr_id TEXT NOT NULL,
  location_name TEXT NOT NULL,
  water_table_depth_m DOUBLE PRECISION NOT NULL,
  trend TEXT NOT NULL DEFAULT 'Stable' CHECK (trend IN ('Rising', 'Stable', 'Declining')),
  measured_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.groundwater_readings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read groundwater_readings" ON public.groundwater_readings FOR SELECT USING (true);
CREATE POLICY "Allow insert groundwater_readings" ON public.groundwater_readings FOR INSERT WITH CHECK (true);

-- 6. Alerts Table
CREATE TABLE IF NOT EXISTS public.alerts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'Medium' CHECK (severity IN ('Low', 'Medium', 'High', 'Critical')),
  village TEXT NOT NULL,
  source_id TEXT REFERENCES public.water_sources(id) ON DELETE SET NULL,
  status TEXT NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'RESOLVED', 'ACKNOWLEDGED')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.alerts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read alerts" ON public.alerts FOR SELECT USING (true);
CREATE POLICY "Allow write alerts" ON public.alerts FOR ALL USING (true);

-- 7. Community Advisories Table
CREATE TABLE IF NOT EXISTS public.advisories (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'HEALTH',
  language TEXT NOT NULL DEFAULT 'en',
  target_role TEXT DEFAULT 'ALL',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.advisories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow read advisories" ON public.advisories FOR SELECT USING (true);
CREATE POLICY "Allow write advisories" ON public.advisories FOR ALL USING (true);

-- 8. Seed Initial Sample Data
INSERT INTO public.water_sources (id, name, type, status, distance, lat, lng, households_using, last_test_result, groundwater_trend, health_cases_count, risk_explanation, recommended_alternative_id)
VALUES 
  ('HP-007', 'Primary Handpump 007', 'Handpump', 'HIGH_RISK', 120, 26.2, 91.7, 45, 'Positive', 'Rising', 8, '["H₂S test positive", "8 diarrhoea cases reported", "Groundwater level rising rapidly"]'::jsonb, 'TW-001'),
  ('TW-001', 'School Tubewell', 'Tubewell', 'SAFE', 450, 26.205, 91.708, 120, 'Negative', 'Stable', 0, '[]'::jsonb, NULL),
  ('DW-003', 'East Village Dug Well', 'Dug well', 'CONTAMINATION_RISK', 310, 26.195, 91.712, 30, 'Positive', 'Stable', 3, '["H₂S test positive"]'::jsonb, 'TW-001')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  status = EXCLUDED.status,
  health_cases_count = EXCLUDED.health_cases_count;

INSERT INTO public.alerts (id, title, description, severity, village, source_id, status)
VALUES
  ('ALT-101', 'Contamination Risk Detected', 'Primary Handpump 007 has tested positive for H₂S bacterial contamination.', 'Critical', 'Brahmapur Char', 'HP-007', 'ACTIVE'),
  ('ALT-102', 'Diarrhoea Cluster Warning', '8 cases of diarrhoea reported near Primary Handpump 007 in the last 48 hours.', 'High', 'Brahmapur Char', 'HP-007', 'ACTIVE')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.advisories (id, title, content, category, language, target_role)
VALUES
  ('ADV-01', 'Boil Water Before Consumption', 'Always boil drinking water for at least 1 minute during flooding or heavy rainfall.', 'HEALTH', 'en', 'ALL'),
  ('ADV-02', 'Use Chlorination Tablets', 'Use distributed halogen/chlorine tablets for community water storage containers.', 'WATER_SAFETY', 'en', 'ASHA Worker')
ON CONFLICT (id) DO NOTHING;
