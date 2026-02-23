-- Fix full_ips type mismatch
ALTER TABLE public.api_credentials 
ALTER COLUMN full_ips TYPE JSONB[] USING full_ips::JSONB[];

-- Ensure default is set correctly
ALTER TABLE public.api_credentials 
ALTER COLUMN full_ips SET DEFAULT '{}';
