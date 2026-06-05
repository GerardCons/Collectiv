-- ============================================================================
-- Migration 0005 — Phase 5: groups / communities
-- ============================================================================
-- Run after 0004. Deploys:
--   * groups, group_members, group_posts
--   * is_group_member() helper; creator auto-joined as 'owner'
--   * extends comments/reactions to target 'group_post' (reuses Phase 4 infra)
--   * notifications: new group posts notify the other members
--   * Realtime on group_posts
--
-- Design decision (was an open question): group posts are PUBLIC-read (so people
-- can browse a group before joining); only MEMBERS can post.
-- Group cover images / post photos reuse the existing 'card-photos' bucket, so
-- no new storage is provisioned here.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- groups
-- ---------------------------------------------------------------------------
create table if not exists public.groups (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  description text,
  genre       text,
  cover_path  text,
  created_by  uuid not null references public.profiles (id) on delete cascade,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);
create index if not exists groups_genre_idx on public.groups (genre);

drop trigger if exists groups_set_updated_at on public.groups;
create trigger groups_set_updated_at
  before update on public.groups
  for each row execute function public.set_updated_at();

alter table public.groups enable row level security;

drop policy if exists "groups_select" on public.groups;
create policy "groups_select" on public.groups for select using (true);

drop policy if exists "groups_insert_own" on public.groups;
create policy "groups_insert_own" on public.groups for insert
  with check (created_by = auth.uid());

drop policy if exists "groups_update_creator" on public.groups;
create policy "groups_update_creator" on public.groups for update
  using (created_by = auth.uid()) with check (created_by = auth.uid());

drop policy if exists "groups_delete_creator" on public.groups;
create policy "groups_delete_creator" on public.groups for delete
  using (created_by = auth.uid());

-- ---------------------------------------------------------------------------
-- group_members (many-to-many)
-- ---------------------------------------------------------------------------
create table if not exists public.group_members (
  group_id  uuid not null references public.groups (id) on delete cascade,
  user_id   uuid not null references public.profiles (id) on delete cascade,
  role      text not null default 'member',  -- 'owner' | 'member'
  joined_at timestamptz not null default now(),
  primary key (group_id, user_id)
);
create index if not exists group_members_user_idx on public.group_members (user_id);

alter table public.group_members enable row level security;

drop policy if exists "group_members_select" on public.group_members;
create policy "group_members_select" on public.group_members for select using (true);

drop policy if exists "group_members_join_self" on public.group_members;
create policy "group_members_join_self" on public.group_members for insert
  with check (user_id = auth.uid());

drop policy if exists "group_members_leave_self" on public.group_members;
create policy "group_members_leave_self" on public.group_members for delete
  using (user_id = auth.uid());

-- Membership helper (security definer → safe to use inside other policies).
create or replace function public.is_group_member(g uuid, uid uuid)
returns boolean language sql security definer set search_path = public stable as $$
  select exists (
    select 1 from public.group_members where group_id = g and user_id = uid
  );
$$;

-- The creator is auto-joined as owner.
create or replace function public.groups_add_owner()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.group_members (group_id, user_id, role)
  values (new.id, new.created_by, 'owner')
  on conflict (group_id, user_id) do nothing;
  return new;
end; $$;

drop trigger if exists groups_add_owner_trigger on public.groups;
create trigger groups_add_owner_trigger
  after insert on public.groups
  for each row execute function public.groups_add_owner();

-- ---------------------------------------------------------------------------
-- group_posts
-- ---------------------------------------------------------------------------
create table if not exists public.group_posts (
  id         uuid primary key default gen_random_uuid(),
  group_id   uuid not null references public.groups (id) on delete cascade,
  author_id  uuid not null references public.profiles (id) on delete cascade,
  post_type  text not null default 'discussion'
               check (post_type in ('discussion', 'giveaway', 'announcement')),
  body       text not null,
  photo_path text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz
);
create index if not exists group_posts_group_idx
  on public.group_posts (group_id, created_at desc);

drop trigger if exists group_posts_set_updated_at on public.group_posts;
create trigger group_posts_set_updated_at
  before update on public.group_posts
  for each row execute function public.set_updated_at();

alter table public.group_posts enable row level security;

-- Public read; only members may post.
drop policy if exists "group_posts_select" on public.group_posts;
create policy "group_posts_select" on public.group_posts for select using (true);

drop policy if exists "group_posts_insert_member" on public.group_posts;
create policy "group_posts_insert_member" on public.group_posts for insert
  with check (
    author_id = auth.uid()
    and public.is_group_member(group_id, auth.uid())
  );

drop policy if exists "group_posts_update_own" on public.group_posts;
create policy "group_posts_update_own" on public.group_posts for update
  using (author_id = auth.uid()) with check (author_id = auth.uid());

drop policy if exists "group_posts_delete_own" on public.group_posts;
create policy "group_posts_delete_own" on public.group_posts for delete
  using (author_id = auth.uid());

-- ---------------------------------------------------------------------------
-- Extend the polymorphic comments / reactions to cover group posts.
-- ---------------------------------------------------------------------------
alter table public.comments drop constraint if exists comments_target_type_check;
alter table public.comments add constraint comments_target_type_check
  check (target_type in ('listing', 'card', 'group_post'));

alter table public.reactions drop constraint if exists reactions_target_type_check;
alter table public.reactions add constraint reactions_target_type_check
  check (target_type in ('listing', 'card', 'group_post'));

-- Teach the comment/like notification triggers about group posts.
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
  end if;
  if v_owner is not null and v_owner <> new.author_id then
    insert into public.notifications (recipient_id, notification_type, actor_id, subject_type, subject_id)
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
  end if;
  if v_owner is not null and v_owner <> new.user_id then
    insert into public.notifications (recipient_id, notification_type, actor_id, subject_type, subject_id)
    values (v_owner, 'like', new.user_id, new.target_type, new.target_id);
  end if;
  return new;
end; $$;

-- A new group post notifies the other members.
create or replace function public.notify_on_group_post()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.notifications (recipient_id, notification_type, actor_id, subject_type, subject_id)
  select gm.user_id, 'group_post', new.author_id, 'group', new.group_id
  from public.group_members gm
  where gm.group_id = new.group_id and gm.user_id <> new.author_id;
  return new;
end; $$;

drop trigger if exists group_posts_notify on public.group_posts;
create trigger group_posts_notify
  after insert on public.group_posts
  for each row execute function public.notify_on_group_post();

-- ---------------------------------------------------------------------------
-- Realtime: live group post feed.
-- ---------------------------------------------------------------------------
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime' and schemaname = 'public' and tablename = 'group_posts'
  ) then
    alter publication supabase_realtime add table public.group_posts;
  end if;
end; $$;
