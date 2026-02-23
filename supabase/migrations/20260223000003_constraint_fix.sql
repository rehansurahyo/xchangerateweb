-- xChangeRate Constraint Fix
-- This script makes legacy api_key and api_secret columns optional to prevent insert failures.

DO $$ 
BEGIN
    -- 1. Relax NOT NULL constraints on legacy columns
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='api_credentials' AND column_name='api_key') THEN
        ALTER TABLE public.api_credentials ALTER COLUMN api_key DROP NOT NULL;
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='api_credentials' AND column_name='api_secret') THEN
        ALTER TABLE public.api_credentials ALTER COLUMN api_secret DROP NOT NULL;
    END IF;

    -- 2. Ensure exchange has a default to avoid similar issues
    ALTER TABLE public.api_credentials ALTER COLUMN exchange SET DEFAULT 'Binance';

END $$;
