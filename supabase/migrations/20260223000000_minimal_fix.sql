-- xChangeRateWeb: Minimal Safe Migration
-- Targeted fixes for created_at 400 error and full_ips type mismatch
-- No CREATE TABLE or global policy wipes used here.

DO $$ 
BEGIN
    -- 1. Add api_credentials.created_at if missing
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='api_credentials' AND column_name='created_at') THEN
        ALTER TABLE public.api_credentials ADD COLUMN created_at TIMESTAMPTZ DEFAULT now();
        
        -- Backfill from start_time if it exists, otherwise use now()
        UPDATE public.api_credentials 
        SET created_at = COALESCE(start_time, now()) 
        WHERE created_at IS NULL;
    END IF;

    -- 2. Ensure ips exists and is TEXT[]
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='api_credentials' AND column_name='ips') THEN
        ALTER TABLE public.api_credentials ADD COLUMN ips TEXT[] DEFAULT '{}';
    END IF;

    -- 3. Safely convert full_ips (text[] or jsonb[]) to JSONB (single jsonb array)
    -- We use a rename-and-rebuild strategy to prevent cast errors.
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='api_credentials' AND column_name='full_ips' AND data_type != 'jsonb') 
       OR EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='api_credentials' AND column_name='full_ips' AND udt_name = '_jsonb') THEN
        
        -- Rename old column for safety
        ALTER TABLE public.api_credentials RENAME COLUMN full_ips TO full_ips_old;
        
        -- Add new JSONB column
        ALTER TABLE public.api_credentials ADD COLUMN full_ips JSONB DEFAULT '[]'::jsonb;
        
        -- Migrate data: Convert any previous array format to a single JSONB array
        UPDATE public.api_credentials 
        SET full_ips = to_jsonb(full_ips_old)
        WHERE full_ips_old IS NOT NULL;
        
        -- Clean up (Drop old column after successful migration)
        ALTER TABLE public.api_credentials DROP COLUMN full_ips_old;
    END IF;

END $$;
