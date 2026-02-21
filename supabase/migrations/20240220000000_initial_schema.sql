-- SaaS Expansion Schema (Idempotent)

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. PROFILES Table
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  username text unique,
  email text unique,
  avatar_url text,
  plan text default 'Free',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. API CREDENTIALS (Secure storage for sessions)
create table if not exists public.api_credentials (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  exchange text not null check (exchange in ('Binance', 'Bybit', 'OKX')),
  api_key_masked text not null, 
  api_key_encrypted text not null,
  api_secret_encrypted text not null, 
  proxies jsonb default '[]'::jsonb,
  target_percent numeric default 100,
  status text default 'Inactive' check (status in ('Active', 'Inactive')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Ensure user_id exists and is correctly constrained
do $$
begin
  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'api_credentials' and column_name = 'user_id') then
    alter table public.api_credentials add column user_id uuid references auth.users on delete cascade;
  end if;
  
  -- Clean up any orphaned rows before enforcing NOT NULL
  delete from public.api_credentials where user_id is null;
  
  alter table public.api_credentials alter column user_id set not null;
end $$;

-- 3. TRADES LOG (Historical data)
create table if not exists public.trades_log (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  session_id uuid references public.api_credentials on delete cascade,
  symbol text not null,
  side text check (side in ('LONG', 'SHORT')),
  entry_price numeric,
  exit_price numeric,
  pnl numeric,
  status text check (status in ('OPEN', 'CLOSED', 'CANCELLED')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Ensure user_id exists
do $$
begin
  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'trades_log' and column_name = 'user_id') then
    alter table public.trades_log add column user_id uuid references auth.users on delete cascade;
  end if;
  
  delete from public.trades_log where user_id is null;
  alter table public.trades_log alter column user_id set not null;
end $$;

-- 4. SIGNALS (Live feed)
create table if not exists public.signals (
  id uuid default uuid_generate_v4() primary key,
  symbol text not null,
  timeframe text,
  direction text check (direction in ('UP', 'DOWN')),
  confidence integer check (confidence >= 0 and confidence <= 100),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. SYSTEM UPDATES
create table if not exists public.system_updates (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  body text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. SUBSCRIPTIONS (Stripe sync)
create table if not exists public.subscriptions (
  user_id uuid references auth.users on delete cascade primary key,
  plan text check (plan in ('Starter', 'Pro', 'Elite')),
  status text,
  stripe_customer_id text,
  stripe_subscription_id text,
  current_period_end timestamp with time zone
);

-- Ensure user_id exists
do $$
begin
  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'subscriptions' and column_name = 'user_id') then
    -- Subscriptions uses user_id as PK, handle carefully
    delete from public.subscriptions where user_id is null; -- Probably empty anyway if PK
    alter table public.subscriptions add column if not exists user_id uuid references auth.users on delete cascade;
  end if;
  
  -- If it's the primary key but not constrained properly
  begin
    alter table public.subscriptions add primary key (user_id);
  exception when others then
    null; -- Already PK
  end;
end $$;

-- 7. COMMUNITY MESSAGES
create table if not exists public.community_messages (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  username text not null,
  channel text default 'trades' check (channel in ('trades', 'signals', 'system', 'general')),
  message text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Ensure user_id exists
do $$
begin
  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'community_messages' and column_name = 'user_id') then
    alter table public.community_messages add column user_id uuid references auth.users on delete cascade;
  end if;
  
  delete from public.community_messages where user_id is null;
  alter table public.community_messages alter column user_id set not null;
end $$;

-- 8. LEADERBOARD (Performance Stats)
create table if not exists public.leaderboard (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users on delete cascade not null,
  roi numeric default 0,
  win_rate numeric default 0,
  drawdown numeric default 0,
  profit numeric default 0,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Ensure user_id exists
do $$
begin
  if not exists (select 1 from information_schema.columns where table_schema = 'public' and table_name = 'leaderboard' and column_name = 'user_id') then
    alter table public.leaderboard add column user_id uuid references auth.users on delete cascade;
  end if;
  
  delete from public.leaderboard where user_id is null;
  alter table public.leaderboard alter column user_id set not null;
end $$;

-- Enable RLS
alter table public.profiles enable row level security;
alter table public.api_credentials enable row level security;
alter table public.trades_log enable row level security;
alter table public.signals enable row level security;
alter table public.system_updates enable row level security;
alter table public.subscriptions enable row level security;
alter table public.community_messages enable row level security;
alter table public.leaderboard enable row level security;

-- RLS Policies
do $$
begin
  -- Profiles
  if not exists (select 1 from pg_policies where policyname = 'Users can view their own profile.') then
    create policy "Users can view their own profile." on public.profiles for select using (auth.uid() = id);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Users can update their own profile.') then
    create policy "Users can update their own profile." on public.profiles for update using (auth.uid() = id);
  end if;

  -- API Credentials
  if not exists (select 1 from pg_policies where policyname = 'Users can manage their credentials.') then
    create policy "Users can manage their credentials." on public.api_credentials for all using (auth.uid() = user_id);
  end if;

  -- Trades Log
  if not exists (select 1 from pg_policies where policyname = 'Users can view their own trades.') then
    create policy "Users can view their own trades." on public.trades_log for select using (auth.uid() = user_id);
  end if;

  -- Signals & System Updates (Public Read)
  if not exists (select 1 from pg_policies where policyname = 'Anyone can read signals.') then
    create policy "Anyone can read signals." on public.signals for select using (true);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Anyone can read system updates.') then
    create policy "Anyone can read system updates." on public.system_updates for select using (true);
  end if;

  -- Subscriptions
  if not exists (select 1 from pg_policies where policyname = 'Users can view their own subscription.') then
    create policy "Users can view their own subscription." on public.subscriptions for select using (auth.uid() = user_id);
  end if;

  -- Community Messages
  if not exists (select 1 from pg_policies where policyname = 'Anyone can read community messages.') then
    create policy "Anyone can read community messages." on public.community_messages for select using (true);
  end if;
  if not exists (select 1 from pg_policies where policyname = 'Authenticated users can post.') then
    create policy "Authenticated users can post." on public.community_messages for insert with check (auth.role() = 'authenticated');
  end if;

  -- Leaderboard
  if not exists (select 1 from pg_policies where policyname = 'Anyone can view leaderboard.') then
    create policy "Anyone can view leaderboard." on public.leaderboard for select using (true);
  end if;
end $$;

-- Realtime Setup
do $$
begin
  alter publication supabase_realtime add table public.community_messages;
  alter publication supabase_realtime add table public.api_credentials;
  alter publication supabase_realtime add table public.trades_log;
  alter publication supabase_realtime add table public.signals;
exception
  when others then null;
end $$;
