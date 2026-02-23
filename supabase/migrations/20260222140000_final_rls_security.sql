-- XchangeRate V2: Final Security & RLS Policy Script
-- This script hardens the database using strict row-level security and triggers.

-- 1. Enable RLS on all tables
ALTER TABLE public.api_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trades_log ENABLE ROW LEVEL SECURITY;

-- 2. Drop existing policies to ensure clean application
DO $$ 
BEGIN
    -- profiles
    DROP POLICY IF EXISTS "user_select_own_profile" ON public.profiles;
    DROP POLICY IF EXISTS "user_update_own_profile" ON public.profiles;
    DROP POLICY IF EXISTS "admin_select_all_profiles" ON public.profiles;
    -- api_credentials
    DROP POLICY IF EXISTS "user_manage_own_credentials" ON public.api_credentials;
    DROP POLICY IF EXISTS "admin_select_all_credentials" ON public.api_credentials;
    -- trades_log
    DROP POLICY IF EXISTS "user_read_own_trades" ON public.trades_log;
    DROP POLICY IF EXISTS "admin_read_all_trades" ON public.trades_log;
    -- sessions_log
    DROP POLICY IF EXISTS "user_read_own_sessions" ON public.sessions_log;
    DROP POLICY IF EXISTS "admin_read_all_sessions" ON public.sessions_log;
    -- billing
    DROP POLICY IF EXISTS "public_read_billing" ON public.billing;
    DROP POLICY IF EXISTS "admin_manage_billing" ON public.billing;
    -- settings
    DROP POLICY IF EXISTS "public_read_settings" ON public.settings;
    DROP POLICY IF EXISTS "admin_update_settings" ON public.settings;
END $$;

-- 3. PROFILES: User can select/update own row; Admin can select all.
CREATE POLICY "user_select_own_profile" ON public.profiles 
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "user_update_own_profile" ON public.profiles 
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "admin_select_all_profiles" ON public.profiles 
    FOR SELECT USING (
        (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = TRUE
    );

-- 4. API_CREDENTIALS: User can manage own; Admin can read all.
CREATE POLICY "user_manage_own_credentials" ON public.api_credentials 
    FOR ALL USING (email = auth.jwt()->>'email');

CREATE POLICY "admin_select_all_credentials" ON public.api_credentials 
    FOR SELECT USING (
        (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = TRUE
    );

-- 5. TRADES_LOG: User can read own; Admin can read all.
CREATE POLICY "user_read_own_trades" ON public.trades_log 
    FOR SELECT USING (email = auth.jwt()->>'email');

CREATE POLICY "admin_read_all_trades" ON public.trades_log 
    FOR SELECT USING (
        (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = TRUE
    );

-- 6. SESSIONS_LOG: User can read own; Admin can read all.
CREATE POLICY "user_read_own_sessions" ON public.sessions_log 
    FOR SELECT USING (email = auth.jwt()->>'email');

CREATE POLICY "admin_read_all_sessions" ON public.sessions_log 
    FOR SELECT USING (
        (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = TRUE
    );

-- 7. BILLING: Public read; Admin write.
CREATE POLICY "public_read_billing" ON public.billing 
    FOR SELECT USING (TRUE);

CREATE POLICY "admin_manage_billing" ON public.billing 
    FOR ALL USING (
        (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = TRUE
    );

-- 8. SETTINGS: Public read; Admin update.
CREATE POLICY "public_read_settings" ON public.settings 
    FOR SELECT USING (TRUE);

CREATE POLICY "admin_update_settings" ON public.settings 
    FOR UPDATE USING (
        (SELECT is_admin FROM public.profiles WHERE id = auth.uid()) = TRUE
    );

-- 9. Realtime Publication Setup
DO $$ 
BEGIN
    IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
        ALTER PUBLICATION supabase_realtime ADD TABLE public.api_credentials;
        ALTER PUBLICATION supabase_realtime ADD TABLE public.trades_log;
        ALTER PUBLICATION supabase_realtime ADD TABLE public.sessions_log;
    END IF;
EXCEPTION WHEN others THEN
    RAISE NOTICE 'Skipping realtime setup, publication may not exist.';
END $$;

-- 10. Auth Trigger for Auto-Profile Insertion
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email)
    VALUES (NEW.id, NEW.email)
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
