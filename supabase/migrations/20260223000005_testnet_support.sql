-- xChangeRate Testnet Support
-- Adds is_testnet column to allow switching between Binance Production and Testnet.

DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='api_credentials' AND column_name='is_testnet') THEN
        ALTER TABLE public.api_credentials ADD COLUMN is_testnet BOOLEAN DEFAULT FALSE;
    END IF;
END $$;
