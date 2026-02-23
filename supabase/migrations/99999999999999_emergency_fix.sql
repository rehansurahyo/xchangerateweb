-- XchangeRate SUPER FIX (Run this in Supabase SQL Editor)
-- This script fixes all missing columns, RLS policies, and triggers.

DO $$ 
BEGIN
    -- 1. FIX API_CREDENTIALS COLUMNS
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='api_credentials' AND column_name='created_at') THEN
        ALTER TABLE public.api_credentials ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='api_credentials' AND column_name='api_key') THEN
        ALTER TABLE public.api_credentials ADD COLUMN api_key TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='api_credentials' AND column_name='api_secret') THEN
        ALTER TABLE public.api_credentials ADD COLUMN api_secret TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='api_credentials' AND column_name='status') THEN
        ALTER TABLE public.api_credentials ADD COLUMN status TEXT DEFAULT 'Paused' CHECK (status IN ('Active', 'Paused'));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='api_credentials' AND column_name='target_percentage') THEN
        ALTER TABLE public.api_credentials ADD COLUMN target_percentage NUMERIC DEFAULT 100 CHECK (target_percentage BETWEEN 0 AND 100);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='api_credentials' AND column_name='ips') THEN
        ALTER TABLE public.api_credentials ADD COLUMN ips TEXT[] DEFAULT '{}';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='api_credentials' AND column_name='full_ips') THEN
        ALTER TABLE public.api_credentials ADD COLUMN full_ips TEXT[] DEFAULT '{}';
    END IF;

    -- 2. FIX PROFILES COLUMNS
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='is_admin') THEN
        ALTER TABLE public.profiles ADD COLUMN is_admin BOOLEAN DEFAULT FALSE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='billing_plan') THEN
        ALTER TABLE public.profiles ADD COLUMN billing_plan TEXT DEFAULT 'Free';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='created_at') THEN
        ALTER TABLE public.profiles ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW();
    END IF;

    -- 3. FIX SESSIONS_LOG/TRADES_LOG
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='sessions_log' AND column_name='trades') THEN
        ALTER TABLE public.sessions_log ADD COLUMN trades JSONB DEFAULT '[]';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='sessions_log' AND column_name='created_at') THEN
        ALTER TABLE public.sessions_log ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='trades_log' AND column_name='logs') THEN
        ALTER TABLE public.trades_log ADD COLUMN logs JSONB DEFAULT '[]';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='trades_log' AND column_name='created_at') THEN
        ALTER TABLE public.trades_log ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW();
    END IF;
END $$;

-- 4. FUNCTION TO BREAK RECURSION
CREATE OR REPLACE FUNCTION public.is_admin() 
RETURNS BOOLEAN AS $$
  SELECT is_admin FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

-- 5. ENABLE RLS
ALTER TABLE public.api_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trades_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- 6. RECREATE POLICIES (DROP FIRST)
DO $$ BEGIN
    DROP POLICY IF EXISTS "user_select_own_profile" ON public.profiles;
    DROP POLICY IF EXISTS "user_update_own_profile" ON public.profiles;
    DROP POLICY IF EXISTS "admin_select_all_profiles" ON public.profiles;
    DROP POLICY IF EXISTS "user_manage_own_credentials" ON public.api_credentials;
    DROP POLICY IF EXISTS "admin_select_all_credentials" ON public.api_credentials;
    DROP POLICY IF EXISTS "user_read_own_trades" ON public.trades_log;
    DROP POLICY IF EXISTS "admin_read_all_trades" ON public.trades_log;
    DROP POLICY IF EXISTS "user_read_own_sessions" ON public.sessions_log;
    DROP POLICY IF EXISTS "admin_read_all_sessions" ON public.sessions_log;
    DROP POLICY IF EXISTS "public_read_billing" ON public.billing;
    DROP POLICY IF EXISTS "admin_manage_billing" ON public.billing;
    DROP POLICY IF EXISTS "public_read_settings" ON public.settings;
    DROP POLICY IF EXISTS "admin_update_settings" ON public.settings;
END $$;

CREATE POLICY "user_select_own_profile" ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "user_update_own_profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "admin_select_all_profiles" ON public.profiles FOR SELECT USING (public.is_admin());

CREATE POLICY "user_manage_own_credentials" ON public.api_credentials FOR ALL USING (email = auth.jwt()->>'email');
CREATE POLICY "admin_select_all_credentials" ON public.api_credentials FOR SELECT USING (public.is_admin());

CREATE POLICY "user_read_own_trades" ON public.trades_log FOR SELECT USING (email = auth.jwt()->>'email');
CREATE POLICY "admin_read_all_trades" ON public.trades_log FOR SELECT USING (public.is_admin());

CREATE POLICY "user_read_own_sessions" ON public.sessions_log FOR SELECT USING (email = auth.jwt()->>'email');
CREATE POLICY "admin_read_all_sessions" ON public.sessions_log FOR SELECT USING (public.is_admin());

CREATE POLICY "public_read_billing" ON public.billing FOR SELECT USING (TRUE);
CREATE POLICY "admin_manage_billing" ON public.billing FOR ALL USING (public.is_admin());

CREATE POLICY "public_read_settings" ON public.settings FOR SELECT USING (TRUE);
CREATE POLICY "admin_update_settings" ON public.settings FOR UPDATE USING (public.is_admin());

-- 6. REALTIME
DO $$ BEGIN IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
ALTER PUBLICATION supabase_realtime ADD TABLE public.api_credentials, public.trades_log, public.sessions_log;
END IF; EXCEPTION WHEN others THEN RAISE NOTICE 'Skipping realtime'; END $$;

-- 7. AUTH TRIGGER
CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS TRIGGER AS $$ BEGIN
INSERT INTO public.profiles (id, email) VALUES (NEW.id, NEW.email) ON CONFLICT (id) DO NOTHING; RETURN NEW; END; $$ LANGUAGE plpgsql SECURITY DEFINER;
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
