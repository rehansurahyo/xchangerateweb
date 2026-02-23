-- ============================================================
-- XchangeRate Overhaul Fix — 2026-02-23
-- Run this in Supabase SQL Editor (idempotent, safe to re-run)
-- ============================================================

-- ──────────────────────────────────────────────────────────────
-- STEP 1: Ensure base tables exist (no-op if already present)
-- ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY,
    email TEXT UNIQUE NOT NULL
);

CREATE TABLE IF NOT EXISTS public.api_credentials (
    id   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    exchange TEXT NOT NULL DEFAULT 'Binance'
);

CREATE TABLE IF NOT EXISTS public.sessions_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS public.trades_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS public.billing (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    price NUMERIC NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid()
);

-- ──────────────────────────────────────────────────────────────
-- STEP 2: api_credentials — add all missing columns safely
-- ──────────────────────────────────────────────────────────────
DO $$ BEGIN
    -- name
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='api_credentials' AND column_name='name') THEN
        ALTER TABLE public.api_credentials ADD COLUMN name TEXT DEFAULT 'Primary Session';
    END IF;

    -- api_key (encrypted)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='api_credentials' AND column_name='api_key') THEN
        ALTER TABLE public.api_credentials ADD COLUMN api_key TEXT;
    END IF;

    -- api_secret (encrypted)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='api_credentials' AND column_name='api_secret') THEN
        ALTER TABLE public.api_credentials ADD COLUMN api_secret TEXT;
    END IF;

    -- status
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='api_credentials' AND column_name='status') THEN
        ALTER TABLE public.api_credentials ADD COLUMN status TEXT DEFAULT 'Paused';
    END IF;

    -- target_percentage
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='api_credentials' AND column_name='target_percentage') THEN
        ALTER TABLE public.api_credentials ADD COLUMN target_percentage NUMERIC DEFAULT 100;
    END IF;

    -- start_time (legacy)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='api_credentials' AND column_name='start_time') THEN
        ALTER TABLE public.api_credentials ADD COLUMN start_time TIMESTAMPTZ;
    END IF;

    -- created_at — THE KEY FIX (was missing, causing 400 errors)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='api_credentials' AND column_name='created_at') THEN
        ALTER TABLE public.api_credentials ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW();
    END IF;

    -- ips (array of IP strings)
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='api_credentials' AND column_name='ips') THEN
        ALTER TABLE public.api_credentials ADD COLUMN ips TEXT[] DEFAULT '{}';
    END IF;

    -- threshold
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='api_credentials' AND column_name='threshold') THEN
        ALTER TABLE public.api_credentials ADD COLUMN threshold NUMERIC DEFAULT 0;
    END IF;

    -- portion_amount
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='api_credentials' AND column_name='portion_amount') THEN
        ALTER TABLE public.api_credentials ADD COLUMN portion_amount NUMERIC DEFAULT 0;
    END IF;

    -- is_new
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='api_credentials' AND column_name='is_new') THEN
        ALTER TABLE public.api_credentials ADD COLUMN is_new BOOLEAN DEFAULT TRUE;
    END IF;

    -- start_balance
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='api_credentials' AND column_name='start_balance') THEN
        ALTER TABLE public.api_credentials ADD COLUMN start_balance NUMERIC;
    END IF;
END $$;

-- ──────────────────────────────────────────────────────────────
-- STEP 3: Handle full_ips column — ensure it is JSONB
--   If column doesn't exist → add as JSONB
--   If column exists as TEXT[] → convert to JSONB
-- ──────────────────────────────────────────────────────────────
DO $$
DECLARE
    col_type TEXT;
BEGIN
    SELECT data_type INTO col_type
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name   = 'api_credentials'
      AND column_name  = 'full_ips';

    IF col_type IS NULL THEN
        -- Column does not exist, add as JSONB
        ALTER TABLE public.api_credentials ADD COLUMN full_ips JSONB DEFAULT '[]'::JSONB;
    ELSIF col_type = 'ARRAY' OR col_type = 'text' THEN
        -- Column exists as TEXT[] (shown as ARRAY), convert to JSONB
        -- First rename old column, add new one, attempt cast, then drop old
        ALTER TABLE public.api_credentials RENAME COLUMN full_ips TO full_ips_old;
        ALTER TABLE public.api_credentials ADD COLUMN full_ips JSONB DEFAULT '[]'::JSONB;
        -- Attempt to migrate existing data (TEXT[] → JSONB)
        UPDATE public.api_credentials
        SET full_ips = COALESCE(
            (SELECT jsonb_agg(elem) FROM unnest(full_ips_old) AS elem),
            '[]'::JSONB
        )
        WHERE full_ips_old IS NOT NULL AND array_length(full_ips_old, 1) > 0;
        ALTER TABLE public.api_credentials DROP COLUMN full_ips_old;
    END IF;
    -- If already JSONB, no action needed
END $$;

-- ──────────────────────────────────────────────────────────────
-- STEP 4: Backfill created_at where still NULL
-- ──────────────────────────────────────────────────────────────
UPDATE public.api_credentials
SET created_at = COALESCE(start_time, NOW())
WHERE created_at IS NULL;

-- ──────────────────────────────────────────────────────────────
-- STEP 5: profiles — add missing columns
-- ──────────────────────────────────────────────────────────────
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='profiles' AND column_name='is_admin') THEN
        ALTER TABLE public.profiles ADD COLUMN is_admin BOOLEAN NOT NULL DEFAULT FALSE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='profiles' AND column_name='billing_plan') THEN
        ALTER TABLE public.profiles ADD COLUMN billing_plan TEXT DEFAULT 'Free';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='profiles' AND column_name='created_at') THEN
        ALTER TABLE public.profiles ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='profiles' AND column_name='full_name') THEN
        ALTER TABLE public.profiles ADD COLUMN full_name TEXT;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='profiles' AND column_name='avatar_url') THEN
        ALTER TABLE public.profiles ADD COLUMN avatar_url TEXT;
    END IF;
END $$;

-- ──────────────────────────────────────────────────────────────
-- STEP 6: sessions_log & trades_log — add missing columns
-- ──────────────────────────────────────────────────────────────
DO $$ BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='sessions_log' AND column_name='trades') THEN
        ALTER TABLE public.sessions_log ADD COLUMN trades JSONB DEFAULT '[]';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='sessions_log' AND column_name='created_at') THEN
        ALTER TABLE public.sessions_log ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW();
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='trades_log' AND column_name='logs') THEN
        ALTER TABLE public.trades_log ADD COLUMN logs JSONB DEFAULT '[]';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='trades_log' AND column_name='created_at') THEN
        ALTER TABLE public.trades_log ADD COLUMN created_at TIMESTAMPTZ DEFAULT NOW();
    END IF;
END $$;

-- ──────────────────────────────────────────────────────────────
-- STEP 7: SECURITY DEFINER helper — breaks RLS recursion
-- ──────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT COALESCE(
        (SELECT is_admin FROM public.profiles WHERE id = auth.uid()),
        FALSE
    );
$$;

-- ──────────────────────────────────────────────────────────────
-- STEP 8: Enable RLS on all tables
-- ──────────────────────────────────────────────────────────────
ALTER TABLE public.api_credentials  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions_log     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trades_log       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing          ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings         ENABLE ROW LEVEL SECURITY;

-- ──────────────────────────────────────────────────────────────
-- STEP 9: Drop old policies and recreate (no recursion)
-- ──────────────────────────────────────────────────────────────
DO $$ BEGIN
    -- profiles
    DROP POLICY IF EXISTS "user_can_read_own_profile"    ON public.profiles;
    DROP POLICY IF EXISTS "user_can_update_own_profile"  ON public.profiles;
    DROP POLICY IF EXISTS "admin_can_read_all_profiles"  ON public.profiles;
    DROP POLICY IF EXISTS "user_select_own_profile"      ON public.profiles;
    DROP POLICY IF EXISTS "user_update_own_profile"      ON public.profiles;
    DROP POLICY IF EXISTS "admin_select_all_profiles"    ON public.profiles;
    -- api_credentials
    DROP POLICY IF EXISTS "user_can_manage_own_credentials" ON public.api_credentials;
    DROP POLICY IF EXISTS "admin_can_read_all_credentials"  ON public.api_credentials;
    DROP POLICY IF EXISTS "user_manage_own_credentials"     ON public.api_credentials;
    DROP POLICY IF EXISTS "admin_select_all_credentials"    ON public.api_credentials;
    -- trades_log
    DROP POLICY IF EXISTS "user_can_read_own_trades"  ON public.trades_log;
    DROP POLICY IF EXISTS "admin_can_read_all_trades" ON public.trades_log;
    DROP POLICY IF EXISTS "user_read_own_trades"      ON public.trades_log;
    DROP POLICY IF EXISTS "admin_read_all_trades"     ON public.trades_log;
    -- sessions_log
    DROP POLICY IF EXISTS "user_can_read_own_sessions"  ON public.sessions_log;
    DROP POLICY IF EXISTS "admin_can_read_all_sessions" ON public.sessions_log;
    DROP POLICY IF EXISTS "user_read_own_sessions"      ON public.sessions_log;
    DROP POLICY IF EXISTS "admin_read_all_sessions"     ON public.sessions_log;
    -- billing
    DROP POLICY IF EXISTS "public_read_billing"    ON public.billing;
    DROP POLICY IF EXISTS "admin_manage_billing"   ON public.billing;
    -- settings
    DROP POLICY IF EXISTS "everyone_read_settings" ON public.settings;
    DROP POLICY IF EXISTS "public_read_settings"   ON public.settings;
    DROP POLICY IF EXISTS "admin_update_settings"  ON public.settings;
END $$;

-- profiles policies
CREATE POLICY "user_select_own_profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "user_update_own_profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "admin_select_all_profiles"
    ON public.profiles FOR SELECT
    USING (public.is_admin());

-- api_credentials policies
CREATE POLICY "user_manage_own_credentials"
    ON public.api_credentials FOR ALL
    USING (email = auth.jwt() ->> 'email');

CREATE POLICY "admin_select_all_credentials"
    ON public.api_credentials FOR SELECT
    USING (public.is_admin());

-- trades_log policies
CREATE POLICY "user_read_own_trades"
    ON public.trades_log FOR SELECT
    USING (email = auth.jwt() ->> 'email');

CREATE POLICY "user_insert_own_trades"
    ON public.trades_log FOR INSERT
    WITH CHECK (email = auth.jwt() ->> 'email');

CREATE POLICY "admin_read_all_trades"
    ON public.trades_log FOR SELECT
    USING (public.is_admin());

-- sessions_log policies
CREATE POLICY "user_read_own_sessions"
    ON public.sessions_log FOR SELECT
    USING (email = auth.jwt() ->> 'email');

CREATE POLICY "user_insert_own_sessions"
    ON public.sessions_log FOR INSERT
    WITH CHECK (email = auth.jwt() ->> 'email');

CREATE POLICY "admin_read_all_sessions"
    ON public.sessions_log FOR SELECT
    USING (public.is_admin());

-- billing policies
CREATE POLICY "public_read_billing"
    ON public.billing FOR SELECT
    USING (TRUE);

CREATE POLICY "admin_manage_billing"
    ON public.billing FOR ALL
    USING (public.is_admin());

-- settings policies
CREATE POLICY "public_read_settings"
    ON public.settings FOR SELECT
    USING (TRUE);

CREATE POLICY "admin_update_settings"
    ON public.settings FOR ALL
    USING (public.is_admin());

-- ──────────────────────────────────────────────────────────────
-- STEP 10: Realtime publication (idempotent)
-- ──────────────────────────────────────────────────────────────
DO $$ BEGIN
    IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
        -- Drop then re-add to avoid duplicate errors
        BEGIN
            ALTER PUBLICATION supabase_realtime DROP TABLE IF EXISTS
                public.api_credentials, public.trades_log, public.sessions_log;
        EXCEPTION WHEN others THEN NULL;
        END;
        ALTER PUBLICATION supabase_realtime ADD TABLE
            public.api_credentials, public.trades_log, public.sessions_log;
    END IF;
END $$;

-- ──────────────────────────────────────────────────────────────
-- STEP 11: Auth trigger — create profile on new user
-- ──────────────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO public.profiles (id, email)
    VALUES (NEW.id, NEW.email)
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
