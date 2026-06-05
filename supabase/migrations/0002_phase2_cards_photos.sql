-- ============================================================================
-- Migration 0002 — Phase 2: cards + card_photos + showcase visibility + storage
-- ============================================================================
-- Run after 0001. Deploys the card data model, opens up RLS so showcased/listed
-- cards (and the collections that hold them) are publicly readable for public
-- profiles, and provisions the Supabase Storage bucket for card photos.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- cards
-- ---------------------------------------------------------------------------
create table if not exists public.cards (
  id                  uuid primary key default gen_random_uuid(),
  collection_id       uuid not null references public.collections (id) on delete cascade,
  owner_id            uuid not null references public.profiles (id) on delete cascade, -- denormalized for query speed
  title               text not null,
  set_name            text,
  condition           text,                 -- text, not enum (Mint / Near Mint / ...)
  notes               text,
  primary_photo_path  text,                 -- Storage path (front), not a URL
  state               text not null default 'private'
                        check (state in ('private', 'showcased', 'listed')),
  metadata            jsonb not null default '{}'::jsonb,  -- Phase 11 extensibility
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  deleted_at          timestamptz
);

create index if not exists cards_collection_id_idx
  on public.cards (collection_id) where deleted_at is null;
create index if not exists cards_owner_id_idx
  on public.cards (owner_id) where deleted_at is null;
create index if not exists cards_public_idx
  on public.cards (owner_id)
  where deleted_at is null and state in ('showcased', 'listed');

drop trigger if exists cards_set_updated_at on public.cards;
create trigger cards_set_updated_at
  before update on public.cards
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- card_photos (optional multi-photo, e.g. front + back)
-- ---------------------------------------------------------------------------
create table if not exists public.card_photos (
  id         uuid primary key default gen_random_uuid(),
  card_id    uuid not null references public.cards (id) on delete cascade,
  path       text not null,
  position   integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists card_photos_card_id_idx
  on public.card_photos (card_id);

-- ---------------------------------------------------------------------------
-- RLS: cards
--   * owner sees everything they own (any state, even soft-deleted)
--   * everyone else sees only non-deleted showcased/listed cards
-- ---------------------------------------------------------------------------
alter table public.cards enable row level security;

drop policy if exists "cards_select" on public.cards;
create policy "cards_select"
  on public.cards for select
  using (
    owner_id = auth.uid()
    or (state in ('showcased', 'listed') and deleted_at is null)
  );

drop policy if exists "cards_insert_own" on public.cards;
create policy "cards_insert_own"
  on public.cards for insert
  with check (owner_id = auth.uid());

drop policy if exists "cards_update_own" on public.cards;
create policy "cards_update_own"
  on public.cards for update
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

drop policy if exists "cards_delete_own" on public.cards;
create policy "cards_delete_own"
  on public.cards for delete
  using (owner_id = auth.uid());

-- ---------------------------------------------------------------------------
-- RLS: card_photos (visible iff the parent card is visible to you)
-- ---------------------------------------------------------------------------
alter table public.card_photos enable row level security;

drop policy if exists "card_photos_select" on public.card_photos;
create policy "card_photos_select"
  on public.card_photos for select
  using (
    exists (
      select 1 from public.cards c
      where c.id = card_photos.card_id
        and (
          c.owner_id = auth.uid()
          or (c.state in ('showcased', 'listed') and c.deleted_at is null)
        )
    )
  );

drop policy if exists "card_photos_insert_own" on public.card_photos;
create policy "card_photos_insert_own"
  on public.card_photos for insert
  with check (
    exists (
      select 1 from public.cards c
      where c.id = card_photos.card_id and c.owner_id = auth.uid()
    )
  );

drop policy if exists "card_photos_delete_own" on public.card_photos;
create policy "card_photos_delete_own"
  on public.card_photos for delete
  using (
    exists (
      select 1 from public.cards c
      where c.id = card_photos.card_id and c.owner_id = auth.uid()
    )
  );

-- ---------------------------------------------------------------------------
-- collections: open SELECT to public (so public profiles can show collection
-- names for showcased cards). Writes stay owner-only. Replaces the Phase 1
-- owner-only "collections_all_own" policy.
-- ---------------------------------------------------------------------------
drop policy if exists "collections_all_own" on public.collections;

drop policy if exists "collections_select_all" on public.collections;
create policy "collections_select_all"
  on public.collections for select
  using (true);

drop policy if exists "collections_insert_own" on public.collections;
create policy "collections_insert_own"
  on public.collections for insert
  with check (auth.uid() = owner_id);

drop policy if exists "collections_update_own" on public.collections;
create policy "collections_update_own"
  on public.collections for update
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

drop policy if exists "collections_delete_own" on public.collections;
create policy "collections_delete_own"
  on public.collections for delete
  using (auth.uid() = owner_id);

-- ---------------------------------------------------------------------------
-- Storage: public bucket for card photos.
-- Paths are namespaced by user id: "{auth.uid}/{card_id}/{filename}".
-- Public read keeps Phase 2 simple; signed URLs are a later refinement.
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('card-photos', 'card-photos', true)
on conflict (id) do nothing;

drop policy if exists "card_photos_storage_read" on storage.objects;
create policy "card_photos_storage_read"
  on storage.objects for select
  using (bucket_id = 'card-photos');

drop policy if exists "card_photos_storage_insert" on storage.objects;
create policy "card_photos_storage_insert"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'card-photos'
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "card_photos_storage_update" on storage.objects;
create policy "card_photos_storage_update"
  on storage.objects for update to authenticated
  using (bucket_id = 'card-photos' and owner = auth.uid());

drop policy if exists "card_photos_storage_delete" on storage.objects;
create policy "card_photos_storage_delete"
  on storage.objects for delete to authenticated
  using (bucket_id = 'card-photos' and owner = auth.uid());
