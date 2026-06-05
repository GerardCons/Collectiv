# Collectiv

> Social infrastructure for collector communities — trading cards, comics, retro gaming, and beyond.

Collectiv is a mobile-first app where collectors can catalog their cards, showcase them, buy and sell locally, follow other collectors, join community groups, attend events, and discover nearby sellers and vendors on a live map. Built with React Native + Expo and Supabase.

**Current version:** 1.02  
**Build year:** 2026 (validation + distribution via Expo Go / Android APK)  
**App Store release:** 2027  
**Status:** ✅ All 10 phases complete — 10 migrations deployed  

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Prerequisites](#prerequisites)
3. [Environment Setup](#environment-setup)
4. [Running the App](#running-the-app)
5. [Database — Supabase Setup](#database--supabase-setup)
6. [Running Migrations](#running-migrations)
7. [Distribution](#distribution)
8. [Phase-by-Phase Feature Guide](#phase-by-phase-feature-guide)
   - [Phase 1 — Foundation, Auth & Collections](#phase-1--foundation-auth--collections)
   - [Phase 2 — Cards & Showcase](#phase-2--cards--showcase)
   - [Phase 3 — Marketplace & Real-Time Chat](#phase-3--marketplace--real-time-chat)
   - [Phase 4 — Social Feed](#phase-4--social-feed)
   - [Phase 5 — Groups / Communities](#phase-5--groups--communities)
   - [Phase 6 — Vendor Storefronts](#phase-6--vendor-storefronts)
   - [Phase 7 — Events System](#phase-7--events-system)
   - [Phase 8 — Maps / Local Discovery](#phase-8--maps--local-discovery)
   - [Phase 9 — Presence / Networking](#phase-9--presence--networking)
   - [Phase 10 — Polish & Seed Data](#phase-10--polish--seed-data)
9. [2027 Roadmap (Next Year)](#2027-roadmap-next-year)
10. [Project Structure](#project-structure)
11. [Architecture Decisions](#architecture-decisions)
12. [Known Limitations](#known-limitations)

---

## Tech Stack

| Layer | Choice | Notes |
|---|---|---|
| Framework | React Native + Expo SDK 54 | Supports Expo Go on App Store for free testing in 2026 |
| Routing | Expo Router (file-based) | Typed routes enabled |
| Language | TypeScript (strict mode) | No `any` except router cast workarounds |
| Backend | Supabase | Postgres + Auth + Storage + Realtime — one vendor, four needs |
| Server state | TanStack Query v5 | Cache, stale-time, optimistic updates |
| Client state | Zustand v5 | UI flags only; auth is Context |
| Auth state | React Context + `onAuthStateChange` | Never navigate imperatively after auth events |
| Maps | react-native-maps | Apple Maps on iOS (no key needed in Expo Go); Google Maps on Android (API key needed for production) |
| Location | expo-location | Foreground permission only |
| Image storage | Supabase Storage | Paths in DB, URLs resolved at query time |
| Styling | StyleSheet | No NativeWind yet — Phase 10 polish decision |
| Forms | React Hook Form + Zod | Phase 2+ forms |

---

## Prerequisites

- **Node.js** 18+ and **npm** 10+
- **Expo CLI** — `npm install -g expo-cli` (or use `npx expo` everywhere)
- **Expo Go** on your iPhone (scan QR from terminal) OR
- **Android device/emulator** for APK testing
- A **Supabase** project (free tier is sufficient through validation)
- **Git**

Optional for Android APK:
- **EAS CLI** — `npm install -g eas-cli`
- **Expo account** (free) — `eas login`

---

## Environment Setup

1. **Clone the repo**

   ```bash
   git clone https://github.com/<your-username>/collectiv.git
   cd collectiv
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Create the environment file**

   Copy the example and fill in your Supabase credentials:

   ```bash
   # Create .env in the project root (it is gitignored)
   ```

   `.env` contents:

   ```env
   EXPO_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

   Find these in your Supabase dashboard under **Settings → API**.

---

## Running the App

```bash
# Start the Expo development server
npx expo start
```

In the terminal output:
- Press **i** to open in iOS Simulator
- Press **a** to open in Android Emulator
- Scan the **QR code** with the Expo Go app on your phone (iPhone or Android)

> **Note:** All native modules (react-native-maps, expo-location, expo-camera, etc.) are bundled in Expo Go — no custom build needed for testing.

### Android APK (for sharing with testers)

```bash
# Build a signed APK via EAS
eas build --platform android --profile preview
```

This uploads to Expo's build servers and produces a downloadable `.apk`. Free on the Expo free tier (limited builds per month).

---

## Database — Supabase Setup

### 1. Create a Supabase project

Go to [supabase.com](https://supabase.com) → New Project. Choose a region close to your users.

### 2. Enable PostGIS

Supabase Dashboard → **Database → Extensions** → search for **PostGIS** → Enable.

> PostGIS is required for the Maps tab (Phase 8). The geography columns were added to the schema from day one, but the extension must be enabled before running migrations.

### 3. Enable Realtime on the relevant tables

After running all migrations, go to **Database → Replication** and ensure these tables have Realtime enabled:

- `messages` (Phase 3 — live chat)
- `comments` (Phase 4 — live comments)
- `reactions` (Phase 4 — live likes)
- `notifications` (Phase 4 — notification badge)
- `event_rsvps` (Phase 7 — RSVP counts)
- `profiles` (Phase 9 — presence / online dot)

> Migration 0009 enables Realtime on `profiles` via SQL. The others are enabled automatically by the Realtime subscription calls in the app hooks.

### 4. Storage buckets

The app uses a single bucket called `card-photos` for all images (card fronts/backs, group covers, event covers, vendor banners/logos).

Create it in **Storage → New Bucket**:
- Name: `card-photos`
- Public: **Yes** (images are served via CDN URLs)

---

## Running Migrations

Migrations are plain SQL files in `supabase/migrations/`. Supabase does not track them — the repo is the source of truth. Run them in order in the **SQL Editor** (Supabase Dashboard → SQL Editor → New query → paste → Run).

| File | Phase | What it deploys |
|---|---|---|
| `0001_phase1_profiles_collections.sql` | 1 | `profiles`, `collections`, `handle_new_user()` trigger, PostGIS extension, all Phase 8/9 columns added upfront |
| `0002_phase2_cards_photos.sql` | 2 | `cards`, `card_photos`, Storage RLS policies |
| `0003_phase3_marketplace_chat.sql` | 3 | `listings`, `conversations`, `conversation_participants`, `messages`, `find_or_create_conversation()` |
| `0004_phase4_social.sql` | 4 | `follows`, `feed_events`, `comments`, `reactions`, `notifications`, feed/notification triggers |
| `0005_phase5_groups.sql` | 5 | `groups`, `group_members`, `group_posts`, polymorphic comments/reactions extended to `group_post` |
| `0006_phase6_vendors.sql` | 6 | `vendor_profiles`, `vendor_reviews` |
| `0007_phase7_events.sql` | 7 | `events`, `event_rsvps`, RSVP notification trigger, Realtime on `event_rsvps` |
| `0008_phase8_maps.sql` | 8 | GIST spatial indexes, `map_pins()`, `update_pickup_location()`, `update_vendor_location()` RPCs |
| `0009_phase9_presence.sql` | 9 | Realtime on `profiles`, `active_collector_count()` RPC, `map_pins()` updated to require `show_on_nearby_map = true` |
| `0010_phase10_polish.sql` | 10 | Adds `profiles.onboarding_completed_at` for the first-run tour |

**Run them in order — each migration assumes the previous one is deployed.**

> If you see `ERROR: type "geometry" does not exist` when running migration 0008 or 0009, your PostGIS extension may be installed in the `extensions` schema instead of `public`. All functions use `set search_path = public, extensions` to handle this, but you must have the extension enabled first (see step 2 above).

### Seed data (optional but recommended)

After running all migrations, populate the app with realistic demo content:

1. Sign up for an account in the app — this becomes the seed user.
2. Open **SQL Editor → New query**, paste the contents of `supabase/seed.sql`, and run.

The script creates:
- **YEG Card Vault** — a featured vendor profile on the seed account
- **4 community groups** — Edmonton TCG Community, YEG Sports Cards, One Piece YEG, Pokémon Edmonton
- **5 upcoming events** — Spring Trading Meetup, Pokémon Regional Qualifier, TCG Convention YEG 2026, One Piece Tournament, Sports Card Collectors Meetup

The script is idempotent — safe to run multiple times.

### Password reset deep link

For the "Forgot password?" flow to work end-to-end, add the app's reset URL to Supabase:

**Supabase Dashboard → Auth → URL Configuration → Redirect URLs** → add:

```
collectiv://reset-password
```

---

## Distribution

### iPhone — Expo Go (no Apple Developer account needed)

1. Install **Expo Go** from the App Store on your iPhone.
2. Run `npx expo start` on your machine.
3. Open the Camera app and scan the QR code in the terminal.
4. The app loads over your local network.

> Both devices must be on the same Wi-Fi network. If that's not possible, use `npx expo start --tunnel` (requires `@expo/ngrok`).

### Android — APK sideload

1. Build: `eas build --platform android --profile preview`
2. Download the `.apk` from the Expo dashboard.
3. Enable **Install unknown apps** on the Android device.
4. Transfer and install the APK.

### Android Google Maps API Key

The Maps tab uses Google Maps on Android. In Expo Go this works without a key, but a production EAS build requires:

1. Create a project in [Google Cloud Console](https://console.cloud.google.com)
2. Enable **Maps SDK for Android**
3. Create an API key (restrict to your app's package name)
4. Add to `app.json`:

```json
"android": {
  "config": {
    "googleMaps": {
      "apiKey": "YOUR_API_KEY_HERE"
    }
  }
}
```

---

## Phase-by-Phase Feature Guide

### Phase 1 — Foundation, Auth & Collections

**Migration:** `0001_phase1_profiles_collections.sql`

**What it includes:**
- Email + password sign up / sign in with persistent sessions (Expo SecureStore)
- Password show/hide, inline validation
- Auto-generated unique username from display name
- 5-tab navigation: Home · Portfolio · Market · Community · Maps · Profile
- Profile screen with avatar initials, display name, @username, bio, location
- Edit Profile screen
- Settings hub (Vendor toggle, Privacy, Account sections)
- Collections system: default "Main" collection seeded on signup, switch-collection sheet, create new collection (name + genre + description)

**Backend:**
- `profiles` table extending `auth.users` — includes Phase 8/9 columns added upfront to avoid live-data migrations
- `collections` table with soft delete
- `handle_new_user()` trigger: auto-creates profile + unique username + seeds "Main" collection on every signup
- Row-Level Security on all tables

**Key files:**
- `app/(auth)/` — welcome, sign-in, sign-up screens
- `app/(tabs)/portfolio/` — collections and card management
- `app/profile/` — own + public profiles
- `app/settings/` — settings hub
- `providers/auth-provider.tsx` — session state + `onAuthStateChange`

---

### Phase 2 — Cards & Showcase

**Migration:** `0002_phase2_cards_photos.sql`

**What it includes:**
- **Live camera viewfinder** with a card-shaped guide overlay that auto-crops to the frame
- Front + back photo capture per card
- Step 2 form: name, set, condition (Mint/Near Mint/Excellent/Good/Poor), notes, visibility
- Card states: **Private** · **Showcased** · **Listed** (check constraint)
- Card detail screen with front/back photo toggle, edit, delete, showcase toggle, more-actions sheet
- Portfolio grid and list views with filter (All/Showcased/Listed/Private) and sort
- Public profile shows another collector's showcased cards by tab

**Backend:**
- `cards` table with `state` check constraint
- `card_photos` table for multi-photo support
- Supabase Storage `card-photos` bucket (paths in DB, CDN URLs resolved at query time)

**Key files:**
- `app/(tabs)/portfolio/add-card.tsx` — camera + details two-step flow
- `app/(tabs)/portfolio/card/[id].tsx` — card detail
- `hooks/use-cards.ts`

---

### Phase 3 — Marketplace & Real-Time Chat

**Migration:** `0003_phase3_marketplace_chat.sql`

**What it includes:**
- List any card for sale: price (CAD cents), description, pickup/shipping info
- One active listing per card (partial unique index enforced in DB)
- Marketplace browse: photo, price, seller, search, pull-to-refresh
- Listing detail: seller profile link, "Message Seller" CTA, social reactions (Phase 4 infra)
- Seller dashboard: Active / Sold / Cancelled tabs with Mark sold / Cancel actions
- **Real-time chat**: find-or-create conversation per seller, message bubbles, read receipts, unread dot on chat list
- After first listing creation: pickup location setup prompt (Phase 8 integration)

**Backend:**
- `listings` with partial unique index (only one `active` per card)
- `conversations` + `conversation_participants` (participants-table pattern supports future group chat)
- `messages` with soft delete
- `find_or_create_conversation()` security-definer function
- Realtime on `messages`

**Key files:**
- `app/(tabs)/market/` — marketplace browse + listing detail
- `app/(tabs)/portfolio/list-card.tsx` — list for sale
- `app/(tabs)/portfolio/pickup-location.tsx` — pickup location setup (Phase 8)
- `app/chat/` — chat list + conversation
- `hooks/use-listings.ts`, `hooks/use-chat.ts`

---

### Phase 4 — Social Feed

**Migration:** `0004_phase4_social.sql`

**What it includes:**
- **Follow / Unfollow** from any public profile
- Tappable Followers / Following lists on profiles
- **Home feed**: "X showcased Y" and "X listed Y for $N" events with card photos; followed users float to the top
- **Likes & comments** (polymorphic) on listings and showcased cards, with real-time updates
- "Liked by" sheet on tap of like count
- **Notifications**: follow / like / comment — Home tab badge, mark-as-read on open
- Notification routing: tap any notification → relevant screen

**Backend:**
- `follows` with self-follow check constraint
- `feed_events` pre-materialized by Postgres triggers (no N+1 fan-out problem at query time)
- `comments` polymorphic (`target_type` + `target_id`)
- `reactions` polymorphic with unique constraint
- `notifications` with auto-creation triggers
- Realtime on `comments`, `reactions`, `notifications`

**Key files:**
- `app/(tabs)/index.tsx` — Home feed
- `app/notifications.tsx` — notifications screen
- `components/social/social-section.tsx` — reusable likes + comments (used by listings, cards, group posts, events)
- `hooks/use-feed.ts`, `hooks/use-social.ts`, `hooks/use-notifications.ts`, `hooks/use-follows.ts`

---

### Phase 5 — Groups / Communities

**Migration:** `0005_phase5_groups.sql`

**What it includes:**
- Groups browse in the Community tab with search and "Joined" sort
- **Create group**: name, genre chip picker, description, optional cover photo
- **Group detail**: cover image, member count, Join / Leave button, Members tab (with OWNER badge), About tab, Posts tab
- **Post composer**: type picker (Discussion / Giveaway / Announcement), body, optional photo
- **Group post feed** with type badges, real-time new posts via Supabase Realtime
- **Post detail**: full post + likes & comments (reuses SocialSection)
- Find collectors search moved to a dedicated screen (person-add icon in Community header)
- Notifications: "X posted in a group you're in" → opens post; comment/like notifications on group posts

**Backend:**
- `groups`, `group_members`, `group_posts` tables
- `comments` and `reactions` `target_type` check constraint extended to include `group_post`
- Realtime on `group_posts`

**Key files:**
- `app/(tabs)/social/index.tsx` — Community tab (groups + events segment toggle)
- `app/(tabs)/social/[id].tsx` — Group detail
- `app/(tabs)/social/create-group.tsx`
- `app/(tabs)/social/new-post.tsx` — Post composer
- `app/(tabs)/social/post/[id].tsx` — Post detail
- `hooks/use-groups.ts`, `hooks/use-group-posts.ts`

---

### Phase 6 — Vendor Storefronts

**Migration:** `0006_phase6_vendors.sql`

**What it includes:**

**6A — Vendor profile editor (Settings → Vendor / business):**
- Banner + logo upload (reuses card-photos bucket)
- Business name, description, address, hours, phone, email, Instagram, website
- Business location on map (links to vendor-location screen)
- Verification row (Pending — manual review in 2027)
- Toggling off keeps the saved data for re-enable

**6B — Vendor storefront (public-facing):**
- Banner + logo header, business name, VENDOR badge
- Hours, address, description
- Contact CTAs: Call (tel:), Email (mailto:), Instagram, Website (deep links via `Linking.openURL`)
- Inventory grid of active listings (reuses marketplace card UI)
- Reviews tab: thumbs up/down tally + your own rating toggle (can't review yourself)
- "View storefront" button on any vendor's public profile
- "Vendors only" filter chip in the Marketplace

**Backend:**
- `vendor_profiles` 1:1 extension of profiles (only exists when `is_vendor = true`)
- `vendor_reviews` with self-review constraint and unique per reviewer per vendor
- `profiles.is_vendor` remains the source of truth; `vendor_profiles` holds rich detail

**Key files:**
- `app/settings/vendor.tsx` — storefront editor
- `app/settings/vendor-location.tsx` — business location map picker
- `app/profile/storefront.tsx` — public storefront
- `hooks/use-vendor.ts`

---

### Phase 7 — Events System

**Migration:** `0007_phase7_events.sql`

**What it includes:**
- Events browse in the Community tab (Groups / Events segment toggle), Upcoming / Past filter
- **Create event**: type chips (Meetup / Tournament / Convention / Other), genre, date + time text fields, address, description, max attendees, optional cover photo
- Creator auto-RSVPs as "going" on creation
- **Event detail**: cover, name, date, address, genre badge, host row (→ profile), Going / Interested / Can't go RSVP buttons, going count + attendee avatar row
- Host sees "You're hosting" badge instead of RSVP buttons
- Discussion thread on each event (reuses SocialSection — comments + likes)
- Host notification: "X is going to your event" → taps open the event
- Events with a location set appear as pins on the Maps tab (Phase 8)

**Backend:**
- `events` with `recurrence_rule` + `recurrence_parent_id` columns (unused — for future iCal RRULE support)
- `event_rsvps` with going/interested/not_going
- `comments` + `reactions` extended to cover `event` target type
- Notification trigger on RSVP insert/update
- Realtime on `event_rsvps`

**Key files:**
- `app/(tabs)/social/event/[id].tsx` — event detail
- `app/(tabs)/social/create-event.tsx`
- `hooks/use-events.ts`

---

### Phase 8 — Maps / Local Discovery

**Migration:** `0008_phase8_maps.sql`

> All geography columns (`pickup_location`, `business_location`, `events.location`) were added to the schema in Phases 1/6/7 — no new tables, only indexes + RPC functions.

**What it includes:**
- **Maps tab**: full-screen MapView (Apple Maps on iOS, Google Maps on Android)
- Three pin types with distinct colors and icons:
  - **Seller** (coral) — collectors who have opted into the map with a pickup location
  - **Vendor** (teal) — vendor storefronts with a business location set
  - **Event** (purple) — upcoming events with a location pinned
- Filter chips: All / Sellers / Vendors / Events
- Tap a pin → bottom sheet with image, title, subtitle, type badge, "View" button
- "My location" FAB — requests foreground permission, pans map to GPS position
- **Pickup location setup** (screen 35): triggered after first listing creation if no location is set; drag-map pin UI, "Use my location" button with reverse-geocode city prefill, travel radius chips (5/10/25/50 km)
- Seller's `pickup_city` displayed in listing detail so buyers see the meet-up area at a glance
- **Vendor business location** setter in Settings → Vendor / business → LOCATION row

**Backend RPCs:**
- `map_pins()` — unified query returning all three pin types with lat/lng extracted from PostGIS geography
- `update_pickup_location(lat, lng, city, radius_km)` — writes `profiles.pickup_location`
- `update_vendor_location(lat, lng)` — writes `vendor_profiles.business_location`
- GIST spatial indexes on all geography columns

**New packages:** `react-native-maps`, `expo-location`

**Key files:**
- `app/(tabs)/map.tsx` — Maps tab
- `app/(tabs)/portfolio/pickup-location.tsx` — pickup location setup
- `app/settings/vendor-location.tsx` — vendor location map picker
- `hooks/use-map.ts`

---

### Phase 9 — Presence / Networking

**Migration:** `0009_phase9_presence.sql`

> All presence columns (`last_seen_at`, `presence_status`, `broadcast_presence`, `broadcast_approximate_location`, `show_on_nearby_map`) were in `profiles` from Phase 1 — no new tables.

**What it includes:**
- **Presence tracking**: `PresenceProvider` wraps the app and listens to React Native `AppState` changes
  - App → foreground: stamps `last_seen_at = now()`, sets `presence_status = 'online'` (throttled to one write/minute)
  - App → background: sets `presence_status = 'offline'`
- **Online dot on public profiles**: teal dot on the Avatar when `broadcast_presence = true` and `last_seen_at` is within 5 minutes
- **"X collectors active" counter on Home tab**: green dot + count of opted-in collectors active in the last 30 minutes; refreshes every 2 minutes
- **Privacy settings screen** (Settings → Privacy):
  - **Show my online status** — `broadcast_presence` — lets others see the green dot
  - **Show me on the collector map** — `show_on_nearby_map` — your pickup pin appears on the Maps tab (off by default; no seller pins appear until users opt in)
  - **Share location with followers** — `broadcast_approximate_location`
  - All toggles save immediately on change; revert on error
- Map seller pins now require `show_on_nearby_map = true` (opt-in, not opt-out)
- Realtime enabled on `profiles` table for live `last_seen_at` updates

**Key files:**
- `providers/presence-provider.tsx` — AppState listener
- `hooks/use-presence.ts` — `isProfileOnline()` utility + `useActiveCollectorCount()`
- `components/ui/avatar.tsx` — `online` prop with green dot overlay
- `app/settings/privacy.tsx` — privacy toggles
- `app/profile/[id].tsx` — online dot on public profiles

---

### Phase 10 — Polish & Seed Data

**Migration:** `0010_phase10_polish.sql`

**What it includes:**

**Onboarding tour:**
- 4-slide full-screen modal shown to every new user on their first login
- Slides: Catalog your collection · Showcase & sell · Join the community · Discover locally
- "Skip" link available on every slide; "Get started" on the final slide
- Dismissed permanently by stamping `profiles.onboarding_completed_at` — never shown again
- Implemented as a `Modal` overlay in the tabs layout — tabs load underneath without blocking

**Password reset:**
- "Forgot password?" in the sign-in screen navigates to `app/(auth)/forgot-password.tsx`
- Sends a Supabase reset email via `supabase.auth.resetPasswordForEmail()` with `redirectTo: 'collectiv://reset-password'`
- `app/reset-password.tsx` handles the deep link: exchanges the PKCE `code` param for a session, then presents a new-password form
- `supabase.auth.updateUser({ password })` saves the new password
- **Required setup:** add `collectiv://reset-password` to Supabase Auth → URL Configuration → Redirect URLs

**Profile avatar upload:**
- "Change photo" in Edit Profile opens the device image library
- Photo is uploaded to Supabase Storage (`card-photos` bucket, `avatars/` path)
- `avatar_path` is saved to `profiles` on Save
- `Avatar` component now renders the real photo (via `expo-image`) when `avatar_path` is set; falls back to initials when not
- Avatar photo shown on public profiles and in all avatar components throughout the app

**Settings polish:**
- Privacy row navigates to the real Privacy settings screen (Phase 9)
- Email & password row navigates to Forgot Password (password change via reset flow)
- Legal section added: Privacy Policy and Terms of Service (external links)

**EAS Build configuration (`eas.json`):**
- `development` — dev client build with iOS Simulator support
- `preview` — internal distribution APK for Android testers
- `production` — auto-incrementing build for store submission

**Seed data (`supabase/seed.sql`):**
- Uses the first registered account as the seed user (no hardcoded UUIDs)
- Creates: YEG Card Vault vendor profile (featured), 4 community groups, 5 upcoming events
- Idempotent — safe to run multiple times
- See [Seed data](#seed-data-optional-but-recommended) above for instructions

**Backend:**
- `profiles.onboarding_completed_at` — timestamptz, null until tour is dismissed

**New files:**
- `components/ui/onboarding-tour.tsx`
- `app/(auth)/forgot-password.tsx`
- `app/reset-password.tsx`
- `eas.json`
- `supabase/seed.sql`

---

## 2027 Roadmap (Next Year)

The following phases are designed but explicitly deferred out of the 2026 build year.

### Phase 11 — Multi-Category Expansion

**Goal:** Expand beyond trading cards to comics, retro gaming, vinyl records, and other collectibles without schema migrations — the JSONB `metadata` column on `cards` makes this a UI-only change.

**Planned features:**
- Category picker on Add Card (Trading Cards / Comics / Retro Gaming / Vinyl / Other)
- Category-specific metadata fields rendered from a config map:
  - Comics: issue number, publisher, grade (CGC/CBCS), variant cover
  - Retro Gaming: platform, region, CIB/loose, label variant
  - Vinyl: label, pressing, matrix, condition (Goldmine standard)
  - Trading Cards: existing fields (set, condition, etc.)
- Marketplace filter by category
- Search across all categories
- Category-specific showcase layouts on public profiles
- Migration: `card_categories` lookup table for admin-managed vocabulary

---

### Phase 12 — App Store Release

**Goal:** Submit to Apple App Store (iOS) and Google Play Store (Android).

**Planned work:**
- Apple Developer Program enrollment ($99/year)
- Google Play Developer account ($25 one-time)
- App Store listing: screenshots, description, keywords, age rating
- Privacy policy URL (required by both stores)
- EAS Submit configuration for automated store uploads
- TestFlight beta for iOS (up to 10,000 testers)
- Production Supabase plan upgrade (free tier limits: 500MB DB, 1GB Storage, 50,000 MAU)
- Custom domain for Supabase project
- Performance profiling and FlashList migration (FlatList → FlashList for 60fps on long lists)

---

### Phase 13 — Payments & Offers

**Goal:** Optional in-app coordination layer for trades and offers. Not real payments — still no money moves through the app.

**Planned features:**
- Offer system: buyer makes an offer on a listing → seller accepts/counters/declines
- Trade proposals: offer card X for card Y
- Offer notification thread in chat (structured messages alongside free-form chat)
- "Price history" on a card (track price changes over time)
- Saved searches with push notifications ("alert me when a Charizard base set is listed under $500")

---

### Phase 14 — Push Notifications

**Goal:** Real push notifications to replace the in-app-only badge system.

**Planned work:**
- Expo Push Notifications service (handles APNs + FCM)
- `push_tokens` table: store per-device token linked to user
- Notification preferences (per-type opt-out): follows, likes, comments, group posts, events, offers
- Notification grouping (3 likes → "3 people liked your card")
- Deep link handling: tap notification → correct screen, even from cold start
- Expo EAS Update for OTA code pushes (bug fixes without store re-review)

---

### Phase 15 — Social Auth & OAuth

**Goal:** Add Google and Apple sign-in alongside the existing email/password flow.

**Planned work:**
- Supabase OAuth providers: Google, Apple
- Apple Sign In (required by App Store if any other OAuth is offered)
- Account linking: allow a user to add Google to their existing email account
- Expo AuthSession for the OAuth flow
- Profile migration: preserve existing data when linking accounts

---

### Phase 16 — Advanced Vendor Features

**Goal:** Paid vendor tier and advanced discovery.

**Planned features:**
- Featured vendor placement (paid tier — manual flag `is_featured` already in schema)
- Vendor analytics dashboard: listing views, profile visits, message volume, review score trend
- Bulk listing import (CSV upload)
- Inventory management: low-stock alerts, bulk price update
- Vendor-to-vendor wholesale offers
- Convention booth mode: display QR code for buyers to scan and open the storefront

---

### Phase 17 — Community Moderation

**Goal:** Give group owners and platform admins tools to keep communities healthy.

**Planned features:**
- Group owner can pin posts, remove members, delete posts
- Report system: flag a listing / post / user → routes to admin queue
- Block list (schema already has the `blocked_accounts` placeholder in Settings)
- Mute keywords in feed
- Auto-moderation: ML-based image flagging for inappropriate card images (Supabase Edge Function + external API)
- Platform admin dashboard (separate web app, not in the mobile build)

---

## Project Structure

```
collectiv/
├── app/
│   ├── _layout.tsx              # Root: QueryClient + Auth + Presence providers
│   ├── index.tsx                # Cold-start router (→ tabs or auth)
│   ├── (auth)/                  # welcome · sign-in · sign-up · forgot-password
│   ├── reset-password.tsx       # deep-link target for password reset emails
│   ├── (tabs)/
│   │   ├── _layout.tsx          # Tab bar (bounces signed-out)
│   │   ├── index.tsx            # Home feed + active-collector counter
│   │   ├── portfolio/           # Collections · cards · add-card · list-card · pickup-location
│   │   ├── market/              # Marketplace browse · listing detail · seller dashboard
│   │   ├── social/              # Community (groups + events) · group detail · event detail
│   │   └── map.tsx              # Maps tab
│   ├── chat/                    # Chat list · conversation
│   ├── profile/                 # Own profile · public [id] · edit · follows · storefront
│   ├── settings/                # Settings hub · vendor · vendor-location · privacy
│   └── notifications.tsx
│
├── components/
│   ├── form/field.tsx           # Labeled text input with error state
│   ├── portfolio/               # Card camera modal · filter sheet · collection sheets
│   ├── social/                  # SocialSection (likes + comments) · GroupPostCard
│   └── ui/                      # Avatar · Button · Header · BottomSheet · StateBadge · CardGrid · OnboardingTour
│
├── hooks/
│   ├── use-profile.ts           # Own + public profiles, search
│   ├── use-cards.ts             # Cards CRUD, showcased cards
│   ├── use-listings.ts          # Marketplace listings, seller dashboard
│   ├── use-chat.ts              # Conversations + messages
│   ├── use-follows.ts           # Follow/unfollow, stats
│   ├── use-feed.ts              # Home feed events
│   ├── use-social.ts            # Likes + comments (polymorphic)
│   ├── use-notifications.ts     # Notification list + unread count
│   ├── use-groups.ts            # Groups browse, join/leave, members
│   ├── use-group-posts.ts       # Group post CRUD
│   ├── use-vendor.ts            # Vendor profiles + reviews
│   ├── use-events.ts            # Events browse, RSVP
│   ├── use-map.ts               # Map pins, update pickup/vendor location
│   └── use-presence.ts          # isProfileOnline() + active collector count
│
├── providers/
│   ├── auth-provider.tsx        # Session context + onAuthStateChange
│   └── presence-provider.tsx   # AppState listener → last_seen_at updates
│
├── lib/
│   ├── supabase.ts              # Client + SecureStore session adapter
│   ├── format.ts                # formatPrice · formatEventDate · timeAgo · dollarsToCents
│   ├── storage.ts               # cardPhotoUrl · uploadCardImage
│   ├── image.ts                 # pickImage (library + camera)
│   └── card-constants.ts        # Shared genre chips, condition options
│
├── constants/
│   └── theme.ts                 # Colors · spacing · radius · fontSize tokens
│
├── supabase/
│   ├── migrations/              # 0001–0010 — source of truth for schema
│   └── seed.sql                 # demo data: vendor, groups, events (run once after signup)
│
└── docs/                        # Architecture · screen sketches · progress notes
```

---

## Architecture Decisions

- **No App Store in 2026.** Distribution via Expo Go (iPhone) and EAS APK (Android). Apple Developer enrollment deferred to 2027.
- **No in-app payments.** Marketplace is buyer–seller coordination only — Facebook Marketplace style. No money moves through the app.
- **Schema designed upfront, deployed phase by phase.** Phase 8/9 columns live in the `profiles` table from migration 0001 — avoids risky migrations once real users exist.
- **Migrations as text files, not tracked by Supabase.** The repo (`supabase/migrations/`) is the source of truth. Run them manually in order.
- **Auth flows are state-driven, not navigation-driven.** Never call `router.push` after sign-in/sign-out — let `onAuthStateChange` + layout guards handle it.
- **Money as integer cents, never floats.** `price_cents INTEGER` everywhere. Currency in a separate column.
- **Text fields over Postgres enums.** `genre`, `condition`, `event_type` are plain text with CHECK constraints. Enum migrations are painful on live data.
- **Polymorphic comments/reactions via `target_type` + `target_id`.** No FK enforcement — integrity maintained at the app layer. Covers: `listing`, `card`, `group_post`, `event`.
- **Storage paths in DB, not URLs.** CDN URLs change; paths don't. URLs resolved at render time via `cardPhotoUrl(path)`.
- **All presence settings default to OFF.** `broadcast_presence`, `show_on_nearby_map`, and `broadcast_approximate_location` are opt-in. No seller pins appear on the map until a user enables "Show me on the collector map" in Privacy settings.

---

## Known Limitations

| Limitation | Notes |
|---|---|
| Android Maps need a Google Maps API key | Works in Expo Go without a key; required for production APK. See [Distribution](#distribution). |
| No push notifications | In-app badges only. Push notifications are Phase 14 (2027). |
| No app store listing | Both stores require Phase 12 work in 2027. |
| Seller pins require map opt-in | Users must enable "Show me on the collector map" in Settings → Privacy. No seller pins appear until users opt in (default off). |
| Password reset requires Supabase redirect URL | Add `collectiv://reset-password` to Supabase Auth → URL Configuration → Redirect URLs or the deep link won't open the app. |
| `pickup_location` is approximate | The pin is a preferred meet-up area, not a precise home address. |
| Legal URLs are placeholders | Privacy Policy and Terms of Service links point to `collectiv.app/privacy` and `collectiv.app/terms` — update these before App Store submission. |
