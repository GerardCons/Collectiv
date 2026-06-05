-- ============================================================================
-- Migration 0007 — Phase 7: events + RSVPs
-- ============================================================================
-- Run after 0006. Deploys:
--   * events       — meetups, tournaments, conventions
--   * event_rsvps  — going / interested / not_going
--   * extends comments/reactions to cover 'event'
--   * notifications: RSVP on your event notifies the host
--   * Realtime on event_rsvps
-- ============================================================================

-- ---------------------------------------------------------------------------
-- events
-- ---------------------------------------------------------------------------
create table if not exists public.events (
  id                    uuid primary key default gen_random_uuid(),
  host_user_id          uuid not null references public.profiles (id) on delete cascade,
  name                  text not null,
  description           text,
  event_type            text not null default 'meetup'
                          check (event_type in ('meetup','tournament','convention','other')),
  genre                 text,
  starts_at             timestamptz not null,
  ends_at               timestamptz,
  address               text,
  max_attendees         integer,
  cover_path            text,
  -- Phase 8: geography added now so we never need to migrate events once real
  -- data exists. Unused until the Maps tab launches.
  location              geography(Point, 4326),
  -- Future recurrence support (schema-only for now, UI in 2027+)
  recurrence_rule       text,
  recurrence_parent_id  uuid references public.events (id),
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  deleted_at            timestamptz
);
create index if not exists events_starts_at_idx on public.events (starts_at) where deleted_at is null;
create index if not exists events_host_idx on public.events (host_user_id) where deleted_at is null;

drop trigger if exists events_set_updated_at on public.events;
create trigger events_set_updated_at
  before update on public.events
  for each row execute function public.set_updated_at();

alter table public.events enable row level security;

drop policy if exists "events_select" on public.events;
create policy "events_select" on public.events for select using (deleted_at is null);

drop policy if exists "events_insert_own" on public.events;
create policy "events_insert_own" on public.events for insert
  with check (host_user_id = auth.uid());

drop policy if exists "events_update_own" on public.events;
create policy "events_update_own" on public.events for update
  using (host_user_id = auth.uid()) with check (host_user_id = auth.uid());

drop policy if exists "events_delete_own" on public.events;
create policy "events_delete_own" on public.events for delete
  using (host_user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- event_rsvps
-- ---------------------------------------------------------------------------
create table if not exists public.event_rsvps (
  event_id   uuid not null references public.events (id) on delete cascade,
  user_id    uuid not null references public.profiles (id) on delete cascade,
  status     text not null check (status in ('going','interested','not_going')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (event_id, user_id)
);
create index if not exists event_rsvps_event_idx on public.event_rsvps (event_id);
create index if not exists event_rsvps_user_idx on public.event_rsvps (user_id);

drop trigger if exists event_rsvps_set_updated_at on public.event_rsvps;
create trigger event_rsvps_set_updated_at
  before update on public.event_rsvps
  for each row execute function public.set_updated_at();

alter table public.event_rsvps enable row level security;

drop policy if exists "event_rsvps_select" on public.event_rsvps;
create policy "event_rsvps_select" on public.event_rsvps for select using (true);

drop policy if exists "event_rsvps_upsert_own" on public.event_rsvps;
create policy "event_rsvps_upsert_own" on public.event_rsvps for insert
  with check (user_id = auth.uid());

drop policy if exists "event_rsvps_update_own" on public.event_rsvps;
create policy "event_rsvps_update_own" on public.event_rsvps for update
  using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists "event_rsvps_delete_own" on public.event_rsvps;
create policy "event_rsvps_delete_own" on public.event_rsvps for delete
  using (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- Extend polymorphic comments / reactions to 'event'
-- ---------------------------------------------------------------------------
alter table public.comments drop constraint if exists comments_target_type_check;
alter table public.comments add constraint comments_target_type_check
  check (target_type in ('listing','card','group_post','event'));

alter table public.reactions drop constraint if exists reactions_target_type_check;
alter table public.reactions add constraint reactions_target_type_check
  check (target_type in ('listing','card','group_post','event'));

-- Extend comment / like notification triggers to handle 'event'.
create or replace function public.notify_on_comment()
returns trigger language plpgsql security definer set search_path = public as $$
declare v_owner uuid;
begin
  if new.target_type = 'listing' then
    select seller_id into v_owner from public.listings where id = new.target_id;
  elsif new.target_type = 'card' then
    select owner_id into v_owner from public.cards where id = new.target_id;
  elsif new.target_type = 'group_post' then
    select author_id into v_owner from public.group_posts where id = new.target_id;
  elsif new.target_type = 'event' then
    select host_user_id into v_owner from public.events where id = new.target_id;
  end if;
  if v_owner is not null and v_owner <> new.author_id then
    insert into public.notifications
      (recipient_id, notification_type, actor_id, subject_type, subject_id)
    values (v_owner, 'comment', new.author_id, new.target_type, new.target_id);
  end if;
  return new;
end; $$;

create or replace function public.notify_on_reaction()
returns trigger language plpgsql security definer set search_path = public as $$
declare v_owner uuid;
begin
  if new.target_type = 'listing' then
    select seller_id into v_owner from public.listings where id = new.target_id;
  elsif new.target_type = 'card' then
    select owner_id into v_owner from public.cards where id = new.target_id;
  elsif new.target_type = 'group_post' then
    select author_id into v_owner from public.group_posts where id = new.target_id;
  elsif new.target_type = 'event' then
    select host_user_id into v_owner from public.events where id = new.target_id;
  end if;
  if v_owner is not null and v_owner <> new.user_id then
    insert into public.notifications
      (recipient_id, notification_type, actor_id, subject_type, subject_id)
    values (v_owner, 'like', new.user_id, new.target_type, new.target_id);
  end if;
  return new;
end; $$;

-- Notify the event host when someone RSVPs 'going' or 'interested'.
create or replace function public.notify_on_rsvp()
returns trigger language plpgsql security definer set search_path = public as $$
declare v_host uuid;
begin
  if new.status in ('going','interested') then
    select host_user_id into v_host from public.events where id = new.event_id;
    if v_host is not null and v_host <> new.user_id then
      insert into public.notifications
        (recipient_id, notification_type, actor_id, subject_type, subject_id)
      values (v_host, 'rsvp', new.user_id, 'event', new.event_id)
      on conflict do nothing;
    end if;
  end if;
  return new;
end; $$;

drop trigger if exists event_rsvps_notify on public.event_rsvps;
create trigger event_rsvps_notify
  after insert or update on public.event_rsvps
  for each row execute function public.notify_on_rsvp();

-- ---------------------------------------------------------------------------
-- Realtime
-- ---------------------------------------------------------------------------
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public' and tablename = 'event_rsvps'
  ) then
    alter publication supabase_realtime add table public.event_rsvps;
  end if;
end; $$;
