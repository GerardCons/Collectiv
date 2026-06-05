-- ============================================================================
-- Migration 0001 — Phase 1: profiles + collections
-- ============================================================================
-- Source of truth lives in this repo (Supabase does not track migrations).
-- Run this in the Supabase SQL editor (or `supabase db push`) once.
--
-- Deploys ONLY the Phase 1 surface area to keep the RLS attack surface small:
--   * profiles  (extends auth.users; includes Phase 8/9 columns added now)
--   * collections
--   * handle_new_user() trigger: creates the profile row, auto-generates a
--     unique username, and seeds a "Main" collection so the Portfolio tab is
--     never empty.
-- ============================================================================

-- PostGIS enabled day one (Phase 8 uses geography columns; we add them now so
-- we never have to migrate the profiles table once real users exist).
create extension if not exists postgis;

-- ---------------------------------------------------------------------------
-- profiles
-- ---------------------------------------------------------------------------
create table if not exists public.profiles (
  id                              uuid primary key references auth.users (id) on delete cascade,

  -- identity
  display_name                    text,
  username                        text not null unique,
  bio                             text,
  avatar_path                     text,                 -- Storage path, not URL (Phase 2)
  location_city                   text,                 -- "Edmonton, AB" — display only
  links                           jsonb not null default '{}'::jsonb,

  -- vendor flag (Phase 1 toggle; rich storefront is Phase 6)
  is_vendor                       boolean not null default false,
  business_name                   text,

  -- Phase 8 (Maps) — columns added now, unused until then
  pickup_location                 geography(Point, 4326),
  pickup_city                     text,
  max_travel_radius_km            integer,

  -- Phase 9 (Presence) — columns added now, unused until then
  last_seen_at                    timestamptz,
  presence_status                 text default 'offline',
  broadcast_presence              boolean not null default false,
  broadcast_approximate_location  boolean not null default false,
  show_on_nearby_map              boolean not null default false,

  created_at                      timestamptz not null default now(),
  updated_at                      timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- collections
-- ---------------------------------------------------------------------------
create table if not exists public.collections (
  id          uuid primary key default gen_random_uuid(),
  owner_id    uuid not null references public.profiles (id) on delete cascade,
  name        text not null,
  genre       text,                 -- text, not enum (evolving vocabulary)
  description text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  deleted_at  timestamptz           -- soft delete
);

create index if not exists collections_owner_id_idx
  on public.collections (owner_id)
  where deleted_at is null;

-- ---------------------------------------------------------------------------
-- updated_at maintenance
-- ---------------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists collections_set_updated_at on public.collections;
create trigger collections_set_updated_at
  before update on public.collections
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- handle_new_user(): runs after a row lands in auth.users.
-- security definer so it can write to RLS-protected tables.
-- ---------------------------------------------------------------------------
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  v_display_name text;
  v_base         text;
  v_username     text;
  v_suffix       integer := 0;
begin
  -- display_name comes from signUp({ options: { data: { display_name } } })
  v_display_name := nullif(trim(new.raw_user_meta_data ->> 'display_name'), '');

  -- Build a username slug: prefer display_name, fall back to the email local-part.
  v_base := lower(
    regexp_replace(
      coalesce(v_display_name, split_part(new.email, '@', 1)),
      '[^a-zA-Z0-9]+', '_', 'g'
    )
  );
  v_base := trim(both '_' from v_base);
  if v_base is null or v_base = '' then
    v_base := 'user';
  end if;

  -- Resolve collisions by appending an incrementing numeric suffix.
  v_username := v_base;
  while exists (select 1 from public.profiles where username = v_username) loop
    v_suffix := v_suffix + 1;
    v_username := v_base || v_suffix::text;
  end loop;

  insert into public.profiles (id, display_name, username)
  values (new.id, coalesce(v_display_name, v_base), v_username);

  -- Seed a default "Main" collection so the Portfolio tab is never empty.
  insert into public.collections (owner_id, name)
  values (new.id, 'Main');

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Row-Level Security
-- ---------------------------------------------------------------------------
alter table public.profiles    enable row level security;
alter table public.collections enable row level security;

-- profiles: public-read (needed for public profiles in Phase 2), self-write.
drop policy if exists "profiles_select_all"  on public.profiles;
create policy "profiles_select_all"
  on public.profiles for select
  using (true);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Insert is handled by the security-definer trigger, but allow self-insert as
-- a belt-and-suspenders fallback.
drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

-- collections: owner-only for all operations in Phase 1. A public-read policy
-- (for showcased cards on public profiles) is added in Phase 2.
drop policy if exists "collections_all_own" on public.collections;
create policy "collections_all_own"
  on public.collections for all
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);
