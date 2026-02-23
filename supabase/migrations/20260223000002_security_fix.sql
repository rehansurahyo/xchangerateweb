-- xChangeRate Security & Schema Alignment Fix
-- This migration adds columns required by the Next.js frontend and API routes.

DO $$ 
BEGIN
    -- 1. FIX api_credentials COLUMNS
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='api_credentials' AND column_name='user_id') THEN
        ALTER TABLE public.api_credentials ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='api_credentials' AND column_name='encrypted_api_key') THEN
        ALTER TABLE public.api_credentials ADD COLUMN encrypted_api_key TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='api_credentials' AND column_name='encrypted_api_secret') THEN
        ALTER TABLE public.api_credentials ADD COLUMN encrypted_api_secret TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='api_credentials' AND column_name='api_key_masked') THEN
        ALTER TABLE public.api_credentials ADD COLUMN api_key_masked TEXT;
    END IF;

    -- 2. Migrate legacy data if exists (Optional but helpful)
    -- If api_key/api_secret exist, we might want to move them but they are likely plain text
    -- and the code expects encrypted ones, so it's safer to just let users re-add.

    -- 3. ENSURE sessions_log has user_id and email consistent
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='sessions_log' AND column_name='user_id') THEN
        ALTER TABLE public.sessions_log ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='sessions_log' AND column_name='session_id') THEN
        ALTER TABLE public.sessions_log ADD COLUMN session_id UUID REFERENCES public.api_credentials(id) ON DELETE CASCADE;
    END IF;

     IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='sessions_log' AND column_name='name') THEN
        ALTER TABLE public.sessions_log ADD COLUMN name TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='sessions_log' AND column_name='status') THEN
        ALTER TABLE public.sessions_log ADD COLUMN status TEXT;
    END IF;

END $$;
