-- ═══════════════════════════════════════
-- PULSO — Database Schema
-- ═══════════════════════════════════════

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ── Users (extends Supabase Auth) ──
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  company_name text,
  sector text,
  team_size text,
  tools text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ── Connected Sources ──
create table public.sources (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  provider text not null, -- 'gmail', 'outlook', 'teams', 'aircall', 'notion'
  connected_at timestamptz default now(),
  last_sync timestamptz,
  status text default 'connected', -- 'connected', 'error', 'disconnected'
  metadata jsonb default '{}'
);

-- ── Analyses (each scan run) ──
create table public.analyses (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  source text not null, -- 'gmail', 'outlook', 'mock'
  emails_analyzed int default 0,
  people_detected int default 0,
  processes_detected int default 0,
  status text default 'running', -- 'running', 'completed', 'failed'
  started_at timestamptz default now(),
  completed_at timestamptz,
  error_message text
);

-- ── Detected Processes ──
create table public.processes (
  id uuid default uuid_generate_v4() primary key,
  analysis_id uuid references public.analyses(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  description text,
  confidence int, -- 0-100
  score int, -- 0-100
  status text default 'healthy', -- 'healthy', 'warning', 'critical'
  steps jsonb default '[]',
  roles jsonb default '[]',
  flows jsonb default '[]',
  insights jsonb default '[]',
  bottleneck text,
  data_source text,
  is_user_modified boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ── User Corrections (learning) ──
create table public.corrections (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  process_id uuid references public.processes(id) on delete cascade not null,
  field_changed text not null, -- 'name', 'steps', 'roles', etc.
  old_value jsonb,
  new_value jsonb,
  created_at timestamptz default now()
);

-- ── Company Vocabulary (learned terms) ──
create table public.vocabulary (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  term text not null,
  meaning text not null,
  learned_from text default 'manual', -- 'onboarding', 'correction', 'manual'
  created_at timestamptz default now()
);

-- ── Sparring Sessions ──
create table public.sparring_sessions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  messages jsonb default '[]',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ── Row Level Security ──
alter table public.profiles enable row level security;
alter table public.sources enable row level security;
alter table public.analyses enable row level security;
alter table public.processes enable row level security;
alter table public.corrections enable row level security;
alter table public.vocabulary enable row level security;
alter table public.sparring_sessions enable row level security;

-- Users can only see their own data
create policy "Users see own profile" on public.profiles for all using (auth.uid() = id);
create policy "Users see own sources" on public.sources for all using (auth.uid() = user_id);
create policy "Users see own analyses" on public.analyses for all using (auth.uid() = user_id);
create policy "Users see own processes" on public.processes for all using (auth.uid() = user_id);
create policy "Users see own corrections" on public.corrections for all using (auth.uid() = user_id);
create policy "Users see own vocabulary" on public.vocabulary for all using (auth.uid() = user_id);
create policy "Users see own sparring" on public.sparring_sessions for all using (auth.uid() = user_id);

-- ── Auto-create profile on signup ──
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
