-- ============================================================================
-- Migration 0003 — Phase 3: marketplace listings + 1-on-1 chat (+ Realtime)
-- ============================================================================
-- Run after 0002. Deploys:
--   * listings           — a card put up for sale (one active listing per card)
--   * conversations      — 1-on-1 chat container (participants-table pattern)
--   * conversation_participants
--   * messages           — text-only
--   * helper fns: is_conversation_participant(), get_or_create_conversation()
--   * a trigger to keep conversations.last_message_at fresh
--   * messages added to the supabase_realtime publication
-- ============================================================================

-- ---------------------------------------------------------------------------
-- listings
-- ---------------------------------------------------------------------------
create table if not exists public.listings (
  id               uuid primary key default gen_random_uuid(),
  card_id          uuid not null references public.cards (id) on delete cascade,
  seller_id        uuid not null references public.profiles (id) on delete cascade, -- denormalized
  price_cents      integer not null check (price_cents >= 0),  -- money as integer, never float
  currency         text not null default 'CAD',
  description      text,
  shipping_info    text,
  status           text not null default 'active'
                     check (status in ('active', 'sold', 'cancelled')),
  sold_to_user_id  uuid references public.profiles (id),
  listed_at        timestamptz not null default now(),
  sold_at          timestamptz,
  cancelled_at     timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

-- Only one ACTIVE listing per card.
create unique index if not exists listings_one_active_per_card
  on public.listings (card_id) where status = 'active';
create index if not exists listings_seller_idx on public.listings (seller_id);
create index if not exists listings_active_idx
  on public.listings (listed_at desc) where status = 'active';

drop trigger if exists listings_set_updated_at on public.listings;
create trigger listings_set_updated_at
  before update on public.listings
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- conversations / participants / messages
-- ---------------------------------------------------------------------------
create table if not exists public.conversations (
  id                  uuid primary key default gen_random_uuid(),
  context_listing_id  uuid references public.listings (id) on delete set null,
  last_message_at     timestamptz not null default now(),
  created_at          timestamptz not null default now()
);

create table if not exists public.conversation_participants (
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  user_id         uuid not null references public.profiles (id) on delete cascade,
  last_read_at    timestamptz,
  joined_at       timestamptz not null default now(),
  primary key (conversation_id, user_id)
);
create index if not exists cp_user_idx on public.conversation_participants (user_id);

create table if not exists public.messages (
  id              uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations (id) on delete cascade,
  sender_id       uuid not null references public.profiles (id) on delete cascade,
  body            text not null,
  created_at      timestamptz not null default now(),
  deleted_at      timestamptz
);
create index if not exists messages_conversation_idx
  on public.messages (conversation_id, created_at);

-- ---------------------------------------------------------------------------
-- Helper: is the user a participant? security definer to avoid RLS recursion
-- when conversation_participants policies reference the same table.
-- ---------------------------------------------------------------------------
create or replace function public.is_conversation_participant(conv uuid, uid uuid)
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.conversation_participants
    where conversation_id = conv and user_id = uid
  );
$$;

-- ---------------------------------------------------------------------------
-- Find-or-create a 1-on-1 conversation between the caller and another user.
-- security definer so it can seed both participant rows in one shot.
-- ---------------------------------------------------------------------------
create or replace function public.get_or_create_conversation(
  p_other_user uuid,
  p_listing_id uuid default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_me   uuid := auth.uid();
  v_conv uuid;
begin
  if v_me is null then
    raise exception 'not authenticated';
  end if;
  if v_me = p_other_user then
    raise exception 'cannot start a conversation with yourself';
  end if;

  -- Existing 1-on-1 conversation containing exactly these two users?
  select c.id into v_conv
  from public.conversations c
  where exists (
      select 1 from public.conversation_participants p
      where p.conversation_id = c.id and p.user_id = v_me)
    and exists (
      select 1 from public.conversation_participants p
      where p.conversation_id = c.id and p.user_id = p_other_user)
    and (
      select count(*) from public.conversation_participants p
      where p.conversation_id = c.id) = 2
  limit 1;

  if v_conv is not null then
    return v_conv;
  end if;

  insert into public.conversations (context_listing_id)
  values (p_listing_id)
  returning id into v_conv;

  insert into public.conversation_participants (conversation_id, user_id)
  values (v_conv, v_me), (v_conv, p_other_user);

  return v_conv;
end;
$$;

-- ---------------------------------------------------------------------------
-- Keep conversations.last_message_at in sync on each new message.
-- ---------------------------------------------------------------------------
create or replace function public.bump_conversation_last_message()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.conversations
    set last_message_at = new.created_at
    where id = new.conversation_id;
  return new;
end;
$$;

drop trigger if exists messages_bump_conversation on public.messages;
create trigger messages_bump_conversation
  after insert on public.messages
  for each row execute function public.bump_conversation_last_message();

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table public.listings                  enable row level security;
alter table public.conversations             enable row level security;
alter table public.conversation_participants enable row level security;
alter table public.messages                  enable row level security;

-- listings: anyone can read active listings; sellers read all of their own.
drop policy if exists "listings_select" on public.listings;
create policy "listings_select"
  on public.listings for select
  using (status = 'active' or seller_id = auth.uid());

drop policy if exists "listings_insert_own" on public.listings;
create policy "listings_insert_own"
  on public.listings for insert
  with check (seller_id = auth.uid());

drop policy if exists "listings_update_own" on public.listings;
create policy "listings_update_own"
  on public.listings for update
  using (seller_id = auth.uid())
  with check (seller_id = auth.uid());

-- conversations: visible to participants. (Created only via the RPC.)
drop policy if exists "conversations_select" on public.conversations;
create policy "conversations_select"
  on public.conversations for select
  using (public.is_conversation_participant(id, auth.uid()));

-- participants: visible if you are in the same conversation.
drop policy if exists "cp_select" on public.conversation_participants;
create policy "cp_select"
  on public.conversation_participants for select
  using (public.is_conversation_participant(conversation_id, auth.uid()));

-- let a participant update their own row (e.g. last_read_at).
drop policy if exists "cp_update_self" on public.conversation_participants;
create policy "cp_update_self"
  on public.conversation_participants for update
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- messages: read if a participant; send as yourself into your conversations.
drop policy if exists "messages_select" on public.messages;
create policy "messages_select"
  on public.messages for select
  using (public.is_conversation_participant(conversation_id, auth.uid()));

drop policy if exists "messages_insert" on public.messages;
create policy "messages_insert"
  on public.messages for insert
  with check (
    sender_id = auth.uid()
    and public.is_conversation_participant(conversation_id, auth.uid())
  );

drop policy if exists "messages_update_own" on public.messages;
create policy "messages_update_own"
  on public.messages for update
  using (sender_id = auth.uid())
  with check (sender_id = auth.uid());

-- ---------------------------------------------------------------------------
-- Realtime: stream message inserts to the chat screen.
-- ---------------------------------------------------------------------------
do $$
begin
  if not exists (
    select 1 from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'messages'
  ) then
    alter publication supabase_realtime add table public.messages;
  end if;
end;
$$;
