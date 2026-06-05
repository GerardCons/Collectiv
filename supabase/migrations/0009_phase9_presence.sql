-- ============================================================================
-- Migration 0009 — Phase 9: Presence / Networking
-- ============================================================================
-- No new tables — all presence columns were added to profiles in 0001:
--   last_seen_at, presence_status, broadcast_presence,
--   broadcast_approximate_location, show_on_nearby_map
--
-- Deploys:
--   * Enable Realtime on profiles (for live last_seen_at / presence_status)
--   * Index on last_seen_at for the active-collector count query
--   * active_collector_count() RPC — how many opted-in users are active
--   * Update map_pins() to gate seller pins on show_on_nearby_map = true
-- ============================================================================

-- ---------------------------------------------------------------------------
-- Realtime on profiles
-- ---------------------------------------------------------------------------
alter publication supabase_realtime add table public.profiles;

-- ---------------------------------------------------------------------------
-- Index for fast active-collector count
-- ---------------------------------------------------------------------------
create index if not exists profiles_presence_idx
  on public.profiles (last_seen_at desc)
  where broadcast_presence = true and last_seen_at is not null;

-- ---------------------------------------------------------------------------
-- active_collector_count() — number of opted-in users active in last 30 min
-- ---------------------------------------------------------------------------
create or replace function public.active_collector_count()
returns bigint
language sql
security definer
stable
set search_path = public
as $$
  select count(*)
  from public.profiles
  where broadcast_presence = true
    and last_seen_at > now() - interval '30 minutes'
$$;

-- ---------------------------------------------------------------------------
-- map_pins() — updated to gate seller pins on show_on_nearby_map = true.
-- Vendors and events are unaffected (always opted in when location is set).
-- ---------------------------------------------------------------------------
create or replace function public.map_pins()
returns table (
  id         uuid,
  pin_type   text,
  lat        double precision,
  lng        double precision,
  title      text,
  subtitle   text,
  image_path text,
  route_hint text
)
language sql
security definer
stable
set search_path = public, extensions
as $$
  -- collectors who have opted into the map AND set a pickup location
  select
    p.id,
    'seller'::text                               as pin_type,
    ST_Y(p.pickup_location::geometry)            as lat,
    ST_X(p.pickup_location::geometry)            as lng,
    coalesce(p.display_name, p.username)         as title,
    coalesce(p.pickup_city, '@' || p.username)   as subtitle,
    p.avatar_path                                as image_path,
    'profile'::text                              as route_hint
  from public.profiles p
  where p.pickup_location is not null
    and p.is_vendor = false
    and p.show_on_nearby_map = true

  union all

  -- vendors with a storefront location set
  select
    vp.user_id                                              as id,
    'vendor'::text                                          as pin_type,
    ST_Y(vp.business_location::geometry)                   as lat,
    ST_X(vp.business_location::geometry)                   as lng,
    coalesce(p.business_name, p.display_name, p.username)  as title,
    coalesce(vp.address, 'Local vendor')                   as subtitle,
    coalesce(vp.logo_path, vp.banner_path)                 as image_path,
    'storefront'::text                                     as route_hint
  from public.vendor_profiles vp
  join public.profiles p on p.id = vp.user_id
  where vp.business_location is not null
    and p.is_vendor = true

  union all

  -- upcoming events that have a location pinned
  select
    e.id,
    'event'::text                                as pin_type,
    ST_Y(e.location::geometry)                  as lat,
    ST_X(e.location::geometry)                  as lng,
    e.name                                       as title,
    coalesce(e.address, e.event_type)           as subtitle,
    e.cover_path                                 as image_path,
    'event'::text                                as route_hint
  from public.events e
  where e.location is not null
    and e.starts_at > now()
    and e.deleted_at is null
$$;
