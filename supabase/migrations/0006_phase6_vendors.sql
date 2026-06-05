-- ============================================================================
-- Migration 0006 — Phase 6: vendor storefronts + reviews
-- ============================================================================
-- Run after 0005. Deploys:
--   * vendor_profiles — 1:1 rich business extension of a profile (is_vendor=true)
--   * vendor_reviews  — thumbs up/down, one per reviewer per vendor
--
-- profiles.is_vendor stays the source of truth for "is this a vendor"; this
-- table holds the storefront detail. The app keeps profiles.business_name in
-- sync for the lightweight vendor badge.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- vendor_profiles
-- ---------------------------------------------------------------------------
create table if not exists public.vendor_profiles (
  user_id           uuid primary key references public.profiles (id) on delete cascade,
  business_name     text,
  description       text,
  hours             text,
  phone             text,
  email             text,
  instagram         text,
  website           text,
  address           text,
  banner_path       text,                 -- Storage path (reuses card-photos bucket)
  logo_path         text,
  business_location geography(Point, 4326), -- distinct from profiles.pickup_location
  is_featured       boolean not null default false,  -- manual flag, no paid tier yet
  is_seeded         boolean not null default false,  -- Phase 10 cold-start data
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

drop trigger if exists vendor_profiles_set_updated_at on public.vendor_profiles;
create trigger vendor_profiles_set_updated_at
  before update on public.vendor_profiles
  for each row execute function public.set_updated_at();

alter table public.vendor_profiles enable row level security;

drop policy if exists "vendor_profiles_select" on public.vendor_profiles;
create policy "vendor_profiles_select" on public.vendor_profiles for select using (true);

drop policy if exists "vendor_profiles_insert_own" on public.vendor_profiles;
create policy "vendor_profiles_insert_own" on public.vendor_profiles for insert
  with check (user_id = auth.uid());

drop policy if exists "vendor_profiles_update_own" on public.vendor_profiles;
create policy "vendor_profiles_update_own" on public.vendor_profiles for update
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- vendor_reviews (thumbs up / down)
-- ---------------------------------------------------------------------------
create table if not exists public.vendor_reviews (
  id          uuid primary key default gen_random_uuid(),
  vendor_id   uuid not null references public.profiles (id) on delete cascade,
  reviewer_id uuid not null references public.profiles (id) on delete cascade,
  is_positive boolean not null,           -- thumbs up = true, down = false
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique (vendor_id, reviewer_id),
  constraint vendor_reviews_no_self check (vendor_id <> reviewer_id)
);
create index if not exists vendor_reviews_vendor_idx on public.vendor_reviews (vendor_id);

drop trigger if exists vendor_reviews_set_updated_at on public.vendor_reviews;
create trigger vendor_reviews_set_updated_at
  before update on public.vendor_reviews
  for each row execute function public.set_updated_at();

alter table public.vendor_reviews enable row level security;

drop policy if exists "vendor_reviews_select" on public.vendor_reviews;
create policy "vendor_reviews_select" on public.vendor_reviews for select using (true);

drop policy if exists "vendor_reviews_insert_own" on public.vendor_reviews;
create policy "vendor_reviews_insert_own" on public.vendor_reviews for insert
  with check (reviewer_id = auth.uid());

drop policy if exists "vendor_reviews_update_own" on public.vendor_reviews;
create policy "vendor_reviews_update_own" on public.vendor_reviews for update
  using (reviewer_id = auth.uid()) with check (reviewer_id = auth.uid());

drop policy if exists "vendor_reviews_delete_own" on public.vendor_reviews;
create policy "vendor_reviews_delete_own" on public.vendor_reviews for delete
  using (reviewer_id = auth.uid());
