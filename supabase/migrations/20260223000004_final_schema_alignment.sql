-- xChangeRate Final Schema Alignment
-- This script ensures all columns have proper defaults and relaxes constraints to match the application logic.

DO $$ 
BEGIN
    -- 1. FIX target_percentage
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='api_credentials' AND column_name='target_percentage') THEN
        ALTER TABLE public.api_credentials ALTER COLUMN target_percentage SET DEFAULT 100;
        ALTER TABLE public.api_credentials ALTER COLUMN target_percentage DROP NOT NULL;
    END IF;

    -- 2. FIX threshold and portion_amount
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='api_credentials' AND column_name='threshold') THEN
        ALTER TABLE public.api_credentials ALTER COLUMN threshold SET DEFAULT 0;
        ALTER TABLE public.api_credentials ALTER COLUMN threshold DROP NOT NULL;
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='api_credentials' AND column_name='portion_amount') THEN
        ALTER TABLE public.api_credentials ALTER COLUMN portion_amount SET DEFAULT 0;
        ALTER TABLE public.api_credentials ALTER COLUMN portion_amount DROP NOT NULL;
    END IF;

    -- 3. Ensure ips and full_ips have defaults
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='api_credentials' AND column_name='ips') THEN
        ALTER TABLE public.api_credentials ALTER COLUMN ips SET DEFAULT '{}';
    END IF;

    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='api_credentials' AND column_name='full_ips') THEN
        -- check if it is jsonb
        IF (SELECT data_type FROM information_schema.columns WHERE table_name='api_credentials' AND column_name='full_ips') = 'jsonb' THEN
            ALTER TABLE public.api_credentials ALTER COLUMN full_ips SET DEFAULT '[]'::jsonb;
        ELSE
             ALTER TABLE public.api_credentials ALTER COLUMN full_ips SET DEFAULT '{}';
        END IF;
    END IF;

END $$;
