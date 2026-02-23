-- Phase 0: XchangeRate V2 Schema Idempotent Fix
-- This script adds missing columns and fixes constraints without losing data if possible.

-- 1. Create tables if they don't exist
CREATE TABLE IF NOT EXISTS public.profiles (id UUID PRIMARY KEY, email TEXT UNIQUE NOT NULL);
CREATE TABLE IF NOT EXISTS public.api_credentials (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), email TEXT NOT NULL, exchange TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS public.billing (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), name TEXT NOT NULL, price NUMERIC NOT NULL);
CREATE TABLE IF NOT EXISTS public.sessions_log (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), email TEXT NOT NULL);
CREATE TABLE IF NOT EXISTS public.settings (id UUID PRIMARY KEY DEFAULT gen_random_uuid());
CREATE TABLE IF NOT EXISTS public.trades_log (id UUID PRIMARY KEY DEFAULT gen_random_uuid(), email TEXT NOT NULL);

-- 2. Add missing columns to api_credentials
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='api_credentials' AND column_name='created_at') THEN
        ALTER TABLE public.api_credentials ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW();
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
END $$;

-- 3. Add missing columns to other tables
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='is_admin') THEN
        ALTER TABLE public.profiles ADD COLUMN is_admin BOOLEAN DEFAULT FALSE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='billing_plan') THEN
        ALTER TABLE public.profiles ADD COLUMN billing_plan TEXT DEFAULT 'Free';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='created_at') THEN
        ALTER TABLE public.profiles ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW();
    END IF;
    
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

-- 4. Enable RLS and Publication (repeat safely)
ALTER TABLE public.api_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trades_log ENABLE ROW LEVEL SECURITY;

-- 5. Final Reset for Publication
ALTER PUBLICATION supabase_realtime DROP TABLE IF EXISTS public.trades_log, public.sessions_log, public.api_credentials;
ALTER PUBLICATION supabase_realtime ADD TABLE public.trades_log, public.sessions_log, public.api_credentials;

-- 2. API Credentials Table
CREATE TABLE IF NOT EXISTS public.api_credentials (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL,
    name TEXT DEFAULT 'Primary BTC',
    exchange TEXT NOT NULL CHECK (exchange IN ('Binance', 'Bybit', 'OKX')),
    api_key TEXT NOT NULL,
    api_secret TEXT NOT NULL,
    target_percentage NUMERIC DEFAULT 100 CHECK (target_percentage BETWEEN 0 AND 100),
    status TEXT DEFAULT 'Paused' CHECK (status IN ('Active', 'Paused')),
    start_balance NUMERIC,
    start_time TIMESTAMPTZ,
    ips TEXT[] DEFAULT '{}',
    full_ips TEXT[] DEFAULT '{}',
    threshold NUMERIC DEFAULT 0,
    portion_amount NUMERIC DEFAULT 0,
    is_new BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Billing Table
CREATE TABLE IF NOT EXISTS public.billing (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    price NUMERIC NOT NULL,
    features TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Sessions Log Table
CREATE TABLE IF NOT EXISTS public.sessions_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL,
    trades JSONB DEFAULT '[]', -- Use for trades list in dashboard/community
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Settings Table
CREATE TABLE IF NOT EXISTS public.settings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    config JSONB DEFAULT '{}',
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Trades Log Table
CREATE TABLE IF NOT EXISTS public.trades_log (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    email TEXT NOT NULL,
    logs JSONB DEFAULT '[]',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.api_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trades_log ENABLE ROW LEVEL SECURITY;

-- ------------------------------------------------------------
-- RLS POLICIES
-- ------------------------------------------------------------

-- PROFILES
CREATE POLICY "user_can_read_own_profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "user_can_update_own_profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "admin_can_read_all_profiles" ON public.profiles
    FOR SELECT USING (
        (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = TRUE
    );

-- API_CREDENTIALS
CREATE POLICY "user_can_manage_own_credentials" ON public.api_credentials
    FOR ALL USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "admin_can_read_all_credentials" ON public.api_credentials
    FOR SELECT USING (
        (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = TRUE
    );

-- TRADES_LOG
CREATE POLICY "user_can_read_own_trades" ON public.trades_log
    FOR SELECT USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "admin_can_read_all_trades" ON public.trades_log
    FOR SELECT USING (
        (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = TRUE
    );

-- SESSIONS_LOG
CREATE POLICY "user_can_read_own_sessions" ON public.sessions_log
    FOR SELECT USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));

CREATE POLICY "admin_can_read_all_sessions" ON public.sessions_log
    FOR SELECT USING (
        (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = TRUE
    );

-- BILLING
CREATE POLICY "public_read_billing" ON public.billing
    FOR SELECT USING (TRUE);

CREATE POLICY "admin_manage_billing" ON public.billing
    FOR ALL USING (
        (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = TRUE
    );

-- SETTINGS
CREATE POLICY "everyone_read_settings" ON public.settings
    FOR SELECT USING (TRUE);

CREATE POLICY "admin_update_settings" ON public.settings
    FOR ALL USING (
        (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = TRUE
    );

-- ------------------------------------------------------------
-- AUTH TRIGGER FOR PROFILE CREATION
-- ------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email)
    VALUES (NEW.id, NEW.email);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Realtime Setup
ALTER PUBLICATION supabase_realtime ADD TABLE public.trades_log;
ALTER PUBLICATION supabase_realtime ADD TABLE public.sessions_log;
ALTER PUBLICATION supabase_realtime ADD TABLE public.api_credentials;
