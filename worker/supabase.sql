-- Supabase schema for MenSpace Official Challenge
-- Run this in the SQL editor of your Supabase project.

-- public.profiles: kullanıcı başına tek benzersiz display_name
create table public.profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index profiles_display_name_unique on public.profiles (lower(display_name));

-- public.official_scores: Official Challenge skorları
create table public.official_scores (
  id bigint primary key generated always as identity,
  user_id uuid not null references auth.users(id) on delete cascade,
  display_name text not null,
  score numeric(7,2) not null,
  seconds integer,
  created_at timestamptz not null default now()
);

create index official_scores_top on public.official_scores (score desc, created_at asc);

alter table public.profiles enable row level security;
create policy "profiles read all" on public.profiles for select using (true);
create policy "profiles insert own" on public.profiles for insert with check (auth.uid() = user_id);
create policy "profiles update own" on public.profiles for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "profiles delete none" on public.profiles for delete using (false);

alter table public.official_scores enable row level security;
create policy "scores read all" on public.official_scores for select using (true);
create policy "scores insert service only" on public.official_scores for insert with check (false);
-- update/delete policy yok
