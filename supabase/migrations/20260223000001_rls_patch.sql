-- xChangeRateWeb: Optional RLS Patch
-- Fixes "infinite recursion detected in policy" for the profiles table.
-- Creates a SECURITY DEFINER helper to check admin status safely.

-- 1. Create SECURITY DEFINER helper if missing
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  -- We query the profiles table inside a SECURITY DEFINER function
  -- to avoid RLS loop (the function bypasses the policy checks on profiles).
  RETURN EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND is_admin = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Update problematic policies (Targeted fix)
-- We check if the policy exists before dropping/recreating.
DO $$ 
BEGIN
    -- If profiles recursion is happening, it's usually because the policy 
    -- on "profiles" itself tries to query "profiles".
    
    -- Example: Drop the old recursive policy on profiles if it exists
    -- Note: Replace 'Admins can do everything' with the actual policy name if known
    IF EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Admins can access everything') THEN
        DROP POLICY "Admins can access everything" ON public.profiles;
    END IF;

    -- Add the safe version that uses the SECURITY DEFINER helper
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'profiles' AND policyname = 'Safe Admin Access') THEN
        CREATE POLICY "Safe Admin Access" ON public.profiles
        FOR ALL USING (public.is_admin());
    END IF;

END $$;
