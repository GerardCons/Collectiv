-- ============================================================================
-- Migration 0008 — Phase 8: Maps / local discovery
-- ============================================================================
-- No new tables — all geography columns were added upfront:
--   profiles.pickup_location            (0001)
--   vendor_profiles.business_location   (0006)
--   events.location                     (0007)
--
-- Deploys:
--   * Ensures PostGIS is enabled (idempotent)
--   * GIST spatial indexes on all three geography columns
--   * map_pins()              — unified RPC returning seller / vendor / event pins
--   * update_pickup_location()— writes profiles.pickup_location from lat/lng
--   * update_vendor_location()— writes vendor_profiles.business_location
--
-- NOTE: Newer Supabase projects install extensions into the `extensions` schema,
-- not `public`. All functions below set search_path = public, extensions so that
-- ST_Y / ST_X / ST_MakePoint / ST_SetSRID are found regardless of which schema
-- PostGIS landed in.
-- ============================================================================

-- Ensure PostGIS is available (safe no-op if already installed)
create extension if not exists postgis;

-- ---------------------------------------------------------------------------
-- Spatial indexes (GIST) — needed for ST_DWithin / bbox queries later
-- ---------------------------------------------------------------------------
create index if not exists profiles_pickup_location_gist
  on public.profiles using gist (pickup_location)
  where pickup_location is not null;

create index if not exists vendor_profiles_business_location_gist
  on public.vendor_profiles using gist (business_location)
  where business_location is not null;

create index if not exists events_location_gist
  on public.events using gist (location)
  where location is not null;

-- ---------------------------------------------------------------------------
-- map_pins() — returns all visible pins with lat / lng extracted
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
  -- collectors who have set a pickup location
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

-- ---------------------------------------------------------------------------
-- update_pickup_location() — called from the pickup-location setup screen
-- Converts client lat/lng into a geography point and saves it.
-- ---------------------------------------------------------------------------
create or replace function public.update_pickup_location(
  p_lat       double precision,
  p_lng       double precision,
  p_city      text    default null,
  p_radius_km integer default null
)
returns void
language plpgsql
security definer
set search_path = public, extensions
as $$
begin
  update public.profiles
  set
    pickup_location      = ST_SetSRID(ST_MakePoint(p_lng, p_lat), 4326)::geography,
    pickup_city          = coalesce(p_city, pickup_city),
    max_travel_radius_km = coalesce(p_radius_km, max_travel_radius_km)
  where id = auth.uid();
end;
$$;

-- ---------------------------------------------------------------------------
-- update_vendor_location() — called from the vendor settings screen
-- ---------------------------------------------------------------------------
create or replace function public.update_vendor_location(
  p_lat double precision,
  p_lng double precision
)
returns void
language plpgsql
security definer
set search_path = public, extensions
as $$
begin
  update public.vendor_profiles
  set business_location = ST_SetSRID(ST_MakePoint(p_lng, p_lat), 4326)::geography
  where user_id = auth.uid();
end;
$$;
