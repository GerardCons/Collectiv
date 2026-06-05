-- ============================================================================
-- Collectiv — Demo seed data
-- ============================================================================
-- Creates realistic demo content (vendor profiles, groups, events) using the
-- FIRST account in the database as the seed user.
--
-- HOW TO RUN:
--   1. Sign up for an account in the app (this becomes the seed user).
--   2. Open Supabase Dashboard → SQL Editor → New query.
--   3. Paste this entire file → Run.
--   4. The seed user's profile is updated to is_vendor = true with a demo shop.
--
-- Run as many times as needed — INSERT statements use ON CONFLICT DO NOTHING
-- so duplicate runs are safe.
-- ============================================================================

do $$
declare
  seed_id uuid;
begin

  -- Use the first registered user as the seed account
  select id into seed_id from public.profiles order by created_at limit 1;

  if seed_id is null then
    raise notice 'No users found. Sign up for an account first, then re-run this script.';
    return;
  end if;

  raise notice 'Seeding with user id: %', seed_id;

  -- -------------------------------------------------------------------------
  -- Make the seed user a vendor (demo shop)
  -- -------------------------------------------------------------------------
  update public.profiles
  set
    is_vendor    = true,
    business_name = 'YEG Card Vault',
    display_name  = coalesce(display_name, 'YEG Card Vault'),
    bio           = 'Edmonton''s premier trading card destination. Singles, sealed, and accessories for every collector.'
  where id = seed_id;

  insert into public.vendor_profiles (
    user_id, business_name, description, hours, phone, email,
    instagram, website, address, is_featured
  )
  values (
    seed_id,
    'YEG Card Vault',
    'Edmonton''s premier trading card destination. Specialising in Pokémon, One Piece, Sports Cards, and Yu-Gi-Oh!. Competitive buylist, top-tier singles, and a welcoming community space.',
    'Mon–Fri 11am–8pm · Sat 10am–6pm · Sun 12pm–5pm',
    '(780) 555-0142',
    'hello@yegcardvault.com',
    '@yegcardvault',
    'yegcardvault.com',
    '10355 82 Ave NW, Edmonton, AB T6E 1Z9',
    true
  )
  on conflict (user_id) do update set
    business_name = excluded.business_name,
    description   = excluded.description,
    hours         = excluded.hours,
    is_featured   = true;

  -- -------------------------------------------------------------------------
  -- Groups
  -- -------------------------------------------------------------------------
  insert into public.groups (id, owner_id, name, genre, description, is_public)
  values
    (
      'a1000000-0000-0000-0000-000000000001',
      seed_id,
      'Edmonton TCG Community',
      'Trading Cards',
      'The main hub for all trading card game players and collectors in the Edmonton area. Share pulls, organise meetups, and trade locally.',
      true
    ),
    (
      'a1000000-0000-0000-0000-000000000002',
      seed_id,
      'YEG Sports Cards',
      'Sports Cards',
      'Hockey, baseball, basketball, football — if it''s a sports card, it belongs here. Breaks, pickups, and PSA talk welcome.',
      true
    ),
    (
      'a1000000-0000-0000-0000-000000000003',
      seed_id,
      'One Piece YEG',
      'One Piece',
      'Dedicated to One Piece Card Game collectors and players in Edmonton. Deck builds, tournament results, and local trading.',
      true
    ),
    (
      'a1000000-0000-0000-0000-000000000004',
      seed_id,
      'Pokémon Edmonton',
      'Pokémon',
      'Pokémon TCG players and collectors in Edmonton. Vintage, modern, and everything in between.',
      true
    )
  on conflict (id) do nothing;

  -- Add seed user as owner/member of all seeded groups
  insert into public.group_members (group_id, user_id, role)
  values
    ('a1000000-0000-0000-0000-000000000001', seed_id, 'owner'),
    ('a1000000-0000-0000-0000-000000000002', seed_id, 'owner'),
    ('a1000000-0000-0000-0000-000000000003', seed_id, 'owner'),
    ('a1000000-0000-0000-0000-000000000004', seed_id, 'owner')
  on conflict (group_id, user_id) do nothing;

  -- -------------------------------------------------------------------------
  -- Events (upcoming — dates relative to seed time)
  -- -------------------------------------------------------------------------
  insert into public.events (
    id, host_user_id, name, event_type, genre,
    starts_at, ends_at, address, description, max_attendees
  )
  values
    (
      'b1000000-0000-0000-0000-000000000001',
      seed_id,
      'Edmonton Spring Trading Meetup',
      'meetup',
      'Trading Cards',
      now() + interval '14 days',
      now() + interval '14 days' + interval '4 hours',
      'YEG Card Vault · 10355 82 Ave NW, Edmonton, AB',
      'Monthly in-store trading meetup. Bring your binders, your trade list, and your best offers. All genres welcome — Pokémon, sports, One Piece, Yu-Gi-Oh!, and more.',
      80
    ),
    (
      'b1000000-0000-0000-0000-000000000002',
      seed_id,
      'Pokémon Regional Qualifier — YEG',
      'tournament',
      'Pokémon',
      now() + interval '21 days',
      now() + interval '21 days' + interval '8 hours',
      'Edmonton Convention Centre · 9797 Jasper Ave NW, Edmonton, AB',
      'Official Pokémon Regional Championship Qualifier. Standard format. Registration opens 30 minutes before event start. Bring your Player ID.',
      128
    ),
    (
      'b1000000-0000-0000-0000-000000000003',
      seed_id,
      'TCG Convention YEG 2026',
      'convention',
      'Trading Cards',
      now() + interval '45 days',
      now() + interval '47 days',
      'Northlands Expo Centre · 7515 118 Ave NW, Edmonton, AB',
      'Edmonton''s largest trading card convention. 60+ vendors, single card market, sealed breaks, artist signings, and side tournaments all weekend. Free entry Saturday morning.',
      null
    ),
    (
      'b1000000-0000-0000-0000-000000000004',
      seed_id,
      'One Piece Card Game Tournament',
      'tournament',
      'One Piece',
      now() + interval '10 days',
      now() + interval '10 days' + interval '5 hours',
      'YEG Card Vault · 10355 82 Ave NW, Edmonton, AB',
      'Weekly One Piece Card Game tournament. Best of 3, single elimination. $5 entry. Promo packs for top 4.',
      32
    ),
    (
      'b1000000-0000-0000-0000-000000000005',
      seed_id,
      'Sports Card Collectors Meetup',
      'meetup',
      'Sports Cards',
      now() + interval '7 days',
      now() + interval '7 days' + interval '3 hours',
      'Westmount Centre Food Court · 11001 Groat Rd NW, Edmonton, AB',
      'Casual sports card meetup. Bring cards to trade or sell. Hockey, baseball, basketball all welcome. Family-friendly event.',
      null
    )
  on conflict (id) do nothing;

  -- Auto-RSVP seed user as "going" to all their events
  insert into public.event_rsvps (event_id, user_id, status)
  values
    ('b1000000-0000-0000-0000-000000000001', seed_id, 'going'),
    ('b1000000-0000-0000-0000-000000000002', seed_id, 'going'),
    ('b1000000-0000-0000-0000-000000000003', seed_id, 'going'),
    ('b1000000-0000-0000-0000-000000000004', seed_id, 'going'),
    ('b1000000-0000-0000-0000-000000000005', seed_id, 'going')
  on conflict (event_id, user_id) do nothing;

  raise notice 'Seed complete.';
  raise notice '  Vendor profile: YEG Card Vault';
  raise notice '  Groups created: 4';
  raise notice '  Events created: 5 (all starting within the next 45 days)';
  raise notice '';
  raise notice 'Next steps:';
  raise notice '  1. Open the app and set the vendor business location on the map.';
  raise notice '  2. Add listings to populate the Marketplace.';
  raise notice '  3. Create a second account to test the social features.';

end;
$$;
