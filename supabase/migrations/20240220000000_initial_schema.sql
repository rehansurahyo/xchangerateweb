-- XchangeRate V2 Schema
-- Based on: api_credentials, billing, profiles, sessions_log, settings, trades_log

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- DROP existing tables to ensure clean V2 state
drop table if exists public.trades_log;
drop table if exists public.sessions_log;
drop table if exists public.api_credentials;
drop table if exists public.billing;
drop table if exists public.profiles;
drop table if exists public.settings;

-- 1. PROFILES
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text unique not null,
  username text,
  full_name text,
  avatar_url text,
  is_admin boolean default false,
  billing_plan text default 'Free',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- 2. API CREDENTIALS
create table if not exists public.api_credentials (
  id uuid default uuid_generate_v4() primary key,
  email text not null,
  name text default 'Primary BTC',
  exchange text not null check (exchange in ('Binance', 'Bybit', 'OKX')),
  api_key text not null,
  api_secret text not null,
  target_percentage numeric default 100 check (target_percentage >= 0 and target_percentage <= 100),
  status text default 'Paused' check (status in ('Active', 'Paused')),
  start_balance numeric,
  start_time timestamp with time zone,
  ips text[] default '{}',
  full_ips text[] default '{}',
  threshold numeric default 0,
  portion_amount numeric default 0,
  is_new boolean default true,
  created_at timestamp with time zone default now()
);

-- 3. BILLING
create table if not exists public.billing (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  price numeric not null,
  features text[] default '{}',
  created_at timestamp with time zone default now()
);

-- 4. SESSIONS LOG
create table if not exists public.sessions_log (
  id uuid default uuid_generate_v4() primary key,
  email text not null,
  trades jsonb default '[]', -- Used for community messages and session snapshots
  created_at timestamp with time zone default now()
);

-- 5. SETTINGS
create table if not exists public.settings (
  id uuid default uuid_generate_v4() primary key,
  config jsonb default '{}',
  updated_at timestamp with time zone default now()
);

-- 6. TRADES LOG
create table if not exists public.trades_log (
  id uuid default uuid_generate_v4() primary key,
  email text not null,
  logs jsonb default '[]', -- Main trading metrics/logs
  created_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.api_credentials enable row level security;
alter table public.billing enable row level security;
alter table public.sessions_log enable row level security;
alter table public.settings enable row level security;
alter table public.trades_log enable row level security;

-- ------------------------------------------------------------
-- RLS POLICIES
-- ------------------------------------------------------------

-- PROFILES
create policy "user_read_own_profile" on public.profiles for select using (auth.uid() = id);
create policy "user_update_own_profile" on public.profiles for update using (auth.uid() = id);
create policy "admin_read_all_profiles" on public.profiles for select using (
  (select is_admin from public.profiles where id = auth.uid()) = true
);

-- API_CREDENTIALS
create policy "user_manage_own_credentials" on public.api_credentials for all using (
  email = auth.jwt() ->> 'email'
);
create policy "admin_read_all_credentials" on public.api_credentials for select using (
  (select is_admin from public.profiles where id = auth.uid()) = true
);

-- TRADES_LOG
create policy "user_read_own_trades" on public.trades_log for select using (
  email = auth.jwt() ->> 'email'
);
create policy "admin_read_all_trades" on public.trades_log for select using (
  (select is_admin from public.profiles where id = auth.uid()) = true
);

-- SESSIONS_LOG
create policy "user_read_own_sessions" on public.sessions_log for select using (
  email = auth.jwt() ->> 'email'
);
create policy "admin_read_all_sessions" on public.sessions_log for select using (
  (select is_admin from public.profiles where id = auth.uid()) = true
);

-- BILLING
create policy "public_read_billing" on public.billing for select using (true);
create policy "admin_manage_billing" on public.billing for all using (
  (select is_admin from public.profiles where id = auth.uid()) = true
);

-- SETTINGS
create policy "everyone_read_settings" on public.settings for select using (true);
create policy "admin_update_settings" on public.settings for update using (
  (select is_admin from public.profiles where id = auth.uid()) = true
);

-- ------------------------------------------------------------
-- AUTH TRIGGER FOR PROFILE CREATION
-- ------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Realtime Setup
alter publication supabase_realtime add table public.trades_log;
alter publication supabase_realtime add table public.sessions_log;
alter publication supabase_realtime add table public.api_credentials;

-- ------------------------------------------------------------
-- SECURITY HARDENING: Prevent self-promotion
-- ------------------------------------------------------------
create or replace function public.protect_admin_field()
returns trigger as $$
begin
  if (old.is_admin <> new.is_admin) then
    -- Check if the executor is an admin
    if not exists (
      select 1 from public.profiles 
      where id = auth.uid() and is_admin = true
    ) then
      new.is_admin := old.is_admin; -- Revert the change
    end if;
  end if;
  return new;
end;
$$ language plpgsql security definer;

create trigger on_profile_update_admin_check
  before update on public.profiles
  for each row execute procedure public.protect_admin_field();
