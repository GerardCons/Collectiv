-- ============================================================================
-- Migration 0004 — Phase 4: social feed (follows, feed_events, comments,
--                           reactions, notifications) + Realtime
-- ============================================================================
-- Run after 0003. Deploys:
--   * follows
--   * feed_events  — auto-populated by triggers when a card is showcased/listed
--   * comments     — polymorphic (listing | card)
--   * reactions    — polymorphic likes
--   * notifications — in-app, auto-created by triggers (follow/comment/like)
--   * Realtime on comments, reactions, notifications
-- ============================================================================

-- ---------------------------------------------------------------------------
-- follows
-- ---------------------------------------------------------------------------
create table if not exists public.follows (
  follower_id uuid not null references public.profiles (id) on delete cascade,
  followed_id uuid not null references public.profiles (id) on delete cascade,
  created_at  timestamptz not null default now(),
  primary key (follower_id, followed_id),
  constraint follows_no_self check (follower_id <> followed_id)
);
create index if not exists follows_followed_idx on public.follows (followed_id);

alter table public.follows enable row level security;

drop policy if exists "follows_select" on public.follows;
create policy "follows_select" on public.follows for select using (true);

drop policy if exists "follows_insert_own" on public.follows;
create policy "follows_insert_own" on public.follows for insert
  with check (follower_id = auth.uid());

drop policy if exists "follows_delete_own" on public.follows;
create policy "follows_delete_own" on public.follows for delete
  using (follower_id = auth.uid());

-- ---------------------------------------------------------------------------
-- feed_events (one row per showcase/list; deduped by a unique key)
-- ---------------------------------------------------------------------------
create table if not exists public.feed_events (
  id           uuid primary key default gen_random_uuid(),
  actor_id     uuid not null references public.profiles (id) on delete cascade,
  event_type   text not null,         -- 'card_showcased' | 'card_listed'
  subject_type text not null,         -- 'card' | 'listing'
  subject_id   uuid not null,
  metadata     jsonb not null default '{}'::jsonb,
  created_at   timestamptz not null default now(),
  unique (subject_type, subject_id, event_type)
);
create index if not exists feed_events_created_idx on public.feed_events (created_at desc);
create index if not exists feed_events_actor_idx on public.feed_events (actor_id);

alter table public.feed_events enable row level security;

-- Public read; actual subject privacy is enforced when the feed joins to the
-- live card/listing (RLS there hides private/sold items).
drop policy if exists "feed_events_select" on public.feed_events;
create policy "feed_events_select" on public.feed_events for select using (true);

-- Trigger: a card transitions into 'showcased'.
create or replace function public.feed_on_card_showcased()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if new.state = 'showcased' and (old.state is distinct from 'showcased') then
    insert into public.feed_events (actor_id, event_type, subject_type, subject_id, metadata)
    values (new.owner_id, 'card_showcased', 'card', new.id,
            jsonb_build_object('title', new.title))
    on conflict (subject_type, subject_id, event_type) do nothing;
  end if;
  return new;
end; $$;

drop trigger if exists cards_feed_showcased on public.cards;
create trigger cards_feed_showcased
  after update on public.cards
  for each row execute function public.feed_on_card_showcased();

-- Trigger: a new listing is created.
create or replace function public.feed_on_listing_created()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.feed_events (actor_id, event_type, subject_type, subject_id, metadata)
  values (new.seller_id, 'card_listed', 'listing', new.id,
          jsonb_build_object('price_cents', new.price_cents, 'card_id', new.card_id))
  on conflict (subject_type, subject_id, event_type) do nothing;
  return new;
end; $$;

drop trigger if exists listings_feed_created on public.listings;
create trigger listings_feed_created
  after insert on public.listings
  for each row execute function public.feed_on_listing_created();

-- ---------------------------------------------------------------------------
-- comments (polymorphic)
-- ---------------------------------------------------------------------------
create table if not exists public.comments (
  id          uuid primary key default gen_random_uuid(),
  author_id   uuid not null references public.profiles (id) on delete cascade,
  target_type text not null check (target_type in ('listing', 'card')),
  target_id   uuid not null,
  body        text not null,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  deleted_at  timestamptz
);
create index if not exists comments_target_idx
  on public.comments (target_type, target_id, created_at);

drop trigger if exists comments_set_updated_at on public.comments;
create trigger comments_set_updated_at
  before update on public.comments
  for each row execute function public.set_updated_at();

alter table public.comments enable row level security;

drop policy if exists "comments_select" on public.comments;
create policy "comments_select" on public.comments for select using (true);

drop policy if exists "comments_insert_own" on public.comments;
create policy "comments_insert_own" on public.comments for insert
  with check (author_id = auth.uid());

drop policy if exists "comments_update_own" on public.comments;
create policy "comments_update_own" on public.comments for update
  using (author_id = auth.uid()) with check (author_id = auth.uid());

drop policy if exists "comments_delete_own" on public.comments;
create policy "comments_delete_own" on public.comments for delete
  using (author_id = auth.uid());

-- ---------------------------------------------------------------------------
-- reactions (polymorphic likes)
-- ---------------------------------------------------------------------------
create table if not exists public.reactions (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references public.profiles (id) on delete cascade,
  target_type   text not null check (target_type in ('listing', 'card')),
  target_id     uuid not null,
  reaction_type text not null default 'like',
  created_at    timestamptz not null default now(),
  unique (user_id, target_type, target_id, reaction_type)
);
create index if not exists reactions_target_idx
  on public.reactions (target_type, target_id);

alter table public.reactions enable row level security;

drop policy if exists "reactions_select" on public.reactions;
create policy "reactions_select" on public.reactions for select using (true);

drop policy if exists "reactions_insert_own" on public.reactions;
create policy "reactions_insert_own" on public.reactions for insert
  with check (user_id = auth.uid());

drop policy if exists "reactions_delete_own" on public.reactions;
create policy "reactions_delete_own" on public.reactions for delete
  using (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- notifications
-- ---------------------------------------------------------------------------
create table if not exists public.notifications (
  id                uuid primary key default gen_random_uuid(),
  recipient_id      uuid not null references public.profiles (id) on delete cascade,
  notification_type text not null,        -- 'follow' | 'comment' | 'like'
  actor_id          uuid references public.profiles (id) on delete cascade,
  subject_type      text,
  subject_id        uuid,
  read_at           timestamptz,
  created_at        timestamptz not null default now()
);
create index if not exists notifications_recipient_idx
  on public.notifications (recipient_id, created_at desc);

alter table public.notifications enable row level security;

drop policy if exists "notifications_select_own" on public.notifications;
create policy "notifications_select_own" on public.notifications for select
  using (recipient_id = auth.uid());

drop policy if exists "notifications_update_own" on public.notifications;
create policy "notifications_update_own" on public.notifications for update
  using (recipient_id = auth.uid()) with check (recipient_id = auth.uid());

-- Notify on follow.
create or replace function public.notify_on_follow()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.notifications (recipient_id, notification_type, actor_id, subject_type, subject_id)
  values (new.followed_id, 'follow', new.follower_id, 'profile', new.follower_id);
  return new;
end; $$;

drop trigger if exists follows_notify on public.follows;
create trigger follows_notify
  after insert on public.follows
  for each row execute function public.notify_on_follow();

-- Notify the owner of a commented-on item (skip self-comments).
create or replace function public.notify_on_comment()
returns trigger language plpgsql security definer set search_path = public as $$
declare v_owner uuid;
begin
  if new.target_type = 'listing' then
    select seller_id into v_owner from public.listings where id = new.target_id;
  elsif new.target_type = 'card' then
    select owner_id into v_owner from public.cards where id = new.target_id;
  end if;
  if v_owner is not null and v_owner <> new.author_id then
    insert into public.notifications (recipient_id, notification_type, actor_id, subject_type, subject_id)
    values (v_owner, 'comment', new.author_id, new.target_type, new.target_id);
  end if;
  return new;
end; $$;

drop trigger if exists comments_notify on public.comments;
create trigger comments_notify
  after insert on public.comments
  for each row execute function public.notify_on_comment();

-- Notify the owner of a liked item (skip self-likes).
create or replace function public.notify_on_reaction()
returns trigger language plpgsql security definer set search_path = public as $$
declare v_owner uuid;
begin
  if new.target_type = 'listing' then
    select seller_id into v_owner from public.listings where id = new.target_id;
  elsif new.target_type = 'card' then
    select owner_id into v_owner from public.cards where id = new.target_id;
  end if;
  if v_owner is not null and v_owner <> new.user_id then
    insert into public.notifications (recipient_id, notification_type, actor_id, subject_type, subject_id)
    values (v_owner, 'like', new.user_id, new.target_type, new.target_id);
  end if;
  return new;
end; $$;

drop trigger if exists reactions_notify on public.reactions;
create trigger reactions_notify
  after insert on public.reactions
  for each row execute function public.notify_on_reaction();

-- ---------------------------------------------------------------------------
-- Realtime: live comments / reactions / notifications.
-- ---------------------------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array['comments', 'reactions', 'notifications'] loop
    if not exists (
      select 1 from pg_publication_tables
      where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = t
    ) then
      execute format('alter publication supabase_realtime add table public.%I', t);
    end if;
  end loop;
end; $$;
