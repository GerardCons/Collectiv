# Collectiv — Architecture Document

**Phase 0 deliverable.** Last updated: June 2026.

This document is the source of truth for cross-cutting architectural decisions across all 11 phases of the Collectiv build. Update it whenever a decision changes. Future-you and any collaborators should be able to understand the shape of the app from this document alone.

---

## Vision in one paragraph

Collectiv is the social infrastructure for collector communities — a mobile-first ecosystem where collectors, hobby shops, and event organizers manage collections, trade locally (buyer/seller coordination external, Facebook-Marketplace-style), follow each other through a Twitter-style activity feed, discover nearby sellers/shops/events on a map, join hobby-specific groups, and sense the real-time pulse of their local community through presence indicators. Launching in trading card games, architected for expansion into comics, retro gaming, and other collectibles.

---

## Tech stack

| Layer | Choice | Rationale |
|---|---|---|
| Mobile framework | React Native + Expo SDK 54 | SDK 54 is the latest that supports Expo Go on the App Store for free testing in 2026. Apple Developer enrollment deferred to 2027. |
| Routing | Expo Router (file-based) | Ships with the default template, declarative, supports typed routes. |
| Language | TypeScript | Non-negotiable for a codebase this size. Strict mode on. |
| Backend | Supabase (Postgres + Auth + Storage + Realtime) | One vendor, four needs, free tier sufficient through validation. Postgres means no vendor lock-in. |
| Server state | TanStack Query | Industry-standard cache layer for server state. |
| Client state | Zustand (introduced when needed) | Light-touch global state for UI flags. Not used in Phase 1. |
| App-wide state | React Context | Auth state only. Resist adding more. |
| Forms (Phase 2+) | React Hook Form + Zod | Industry-standard. Phase 2 learning topic. |
| Image storage | Supabase Storage | Paths stored in DB, URLs resolved at query time. |
| Maps (Phase 8) | react-native-maps | Standard choice. PostGIS on the backend. |
| Styling | StyleSheet (Phase 1-2), possibly NativeWind later | Polish is later work; don't introduce styling abstractions prematurely. |
| Distribution | EAS Build (Android APK) + Expo Go (iPhone QR) | Free, no app store fees until validation in 2027. |

---

## Database schema — all 11 phases

Designed up front to minimize migrations once real users exist. Deployed phase by phase to keep attack surface small. Tables marked **Phase X** are deployed when that phase begins.

### Currently deployed

**`profiles`** (Phase 1) — extends `auth.users`. One row per user.
- `id` (uuid, PK, FK to auth.users)
- `display_name`, `bio`, `avatar_path`
- `is_vendor` (boolean), `business_name` (nullable, only set when `is_vendor=true`)
- `pickup_location` (geography Point, Phase 8 column added now)
- `pickup_city`, `max_travel_radius_km` (Phase 8 columns)
- `last_seen_at`, `presence_status`, `broadcast_presence`, `broadcast_approximate_location`, `show_on_nearby_map` (Phase 9 columns added now)
- `created_at`, `updated_at`

**`collections`** (Phase 1) — a user's named group of cards.
- `id` (uuid PK), `owner_id` (FK profiles), `name`, `genre` (text, not enum), `description`
- `created_at`, `updated_at`, `deleted_at` (soft delete)

**Trigger:** `handle_new_user()` runs `after insert on auth.users` with `security definer`. Creates the profile row and seeds a "Main" collection so no user ever sees an empty Collections tab.

### Designed but not yet deployed

**`cards`** (Phase 2) — items in a collection.
- `id`, `collection_id`, `owner_id` (denormalized for query speed)
- `title`, `set_name`, `condition`, `notes`, `primary_photo_path`
- `state` (`'private'|'showcased'|'listed'`, check constraint)
- `metadata` (jsonb, default `{}`) — Phase 11 multi-category extensibility
- timestamps + `deleted_at`

**`card_photos`** (Phase 2) — optional multi-photo support.
- `id`, `card_id`, `path`, `position`, `created_at`

**`listings`** (Phase 3) — marketplace listings linked to cards.
- `id`, `card_id`, `seller_id` (denormalized), `price_cents` (integer, never float), `currency`
- `description`, `shipping_info`, `status` (`'active'|'sold'|'cancelled'`)
- `sold_to_user_id`, `listed_at`, `sold_at`, `cancelled_at`
- Partial unique index: only one `active` listing per card

**`conversations`** (Phase 3) — 1-on-1 chat container; participants-table pattern allows future group chat without migration.
- `id`, `context_listing_id` (nullable FK), `last_message_at`, `created_at`

**`conversation_participants`** (Phase 3) — join table.
- `(conversation_id, user_id)` composite PK, `last_read_at`, `joined_at`

**`messages`** (Phase 3) — text-only for build year.
- `id`, `conversation_id`, `sender_id`, `body`, `created_at`, `deleted_at`

**`follows`** (Phase 4) — user follows user.
- `(follower_id, followed_id)` composite PK, `check (follower_id <> followed_id)`

**`feed_events`** (Phase 4) — pre-materialized social feed events.
- `id`, `actor_id`, `event_type`, `subject_type`, `subject_id`, `metadata` (jsonb), `created_at`

**`comments`** (Phase 4, polymorphic) — used by listings, group posts, events.
- `id`, `author_id`, `target_type`, `target_id`, `body`, timestamps

**`reactions`** (Phase 4, polymorphic) — likes/emoji on anything.
- `id`, `user_id`, `target_type`, `target_id`, `reaction_type`, unique constraint to prevent dupes

**`notifications`** (Phase 4) — in-app notification badges across all features.
- `id`, `recipient_id`, `notification_type`, `actor_id`, `subject_type`, `subject_id`, `read_at`

**`groups`** (Phase 5), **`group_members`**, **`group_posts`** — hobby community groups.

**`vendor_profiles`** (Phase 6) — extends profiles when `is_vendor=true`.
- `user_id` (PK + FK), business name/hours/contact/address/banner/logo
- `business_location` (geography Point, distinct from `profiles.pickup_location`)
- `is_featured`, `is_seeded` (for Phase 10 cold-start data)

**`vendor_reviews`** (Phase 6) — thumbs-up/down per vendor per reviewer.

**`events`** (Phase 7) — meetups, tournaments, conventions.
- Includes `recurrence_rule` and `recurrence_parent_id` columns designed-but-unused for future iCal RRULE support.

**`event_rsvps`** (Phase 7) — going/interested/not_going status.

### Cross-cutting schema conventions

- **UUIDs everywhere** (`uuid primary key default gen_random_uuid()`). Matches `auth.users.id`.
- **snake_case** column names. PostgREST and Supabase tooling assume it.
- **`created_at` and `updated_at` on every table.** Timestamptz, not timestamp.
- **Soft deletes via `deleted_at`** on user-facing data tables (cards, listings, group_posts, events, messages).
- **Money as `integer price_cents`**, never floats. Currency in a separate column.
- **Text fields over Postgres enums** for evolving lists (`genre`, `condition`, `event_type`). Enum migrations are painful.
- **JSONB `metadata` columns** for category-specific extensibility (Phase 11).
- **PostGIS enabled day one.** All geographic columns are `geography(Point, 4326)`.
- **Polymorphic `target_type` + `target_id`** for comments/reactions/notifications. CHECK constraint on `target_type` values. No FK enforcement; integrity maintained at the app layer.
- **Storage paths in DB, not URLs.** CDN URLs change; paths don't.

---

## Authentication and authorization model

**Authentication:** Supabase Auth, email + password only for the build year. No social auth (Phase 11 polish). Sessions persisted in Expo SecureStore via custom storage adapter. `onAuthStateChange` subscription drives all app navigation — no manual route changes on signin/signout.

**Authorization:** Row-Level Security (RLS) on every table. App-side checks are not security. Common policy patterns:

- **Own-data tables** (collections, cards, listings, messages): `auth.uid() = owner_id` on all operations.
- **Public-read tables** (profiles, showcased cards, active listings, public groups): SELECT policy `using (true)`.
- **Membership-gated tables** (group_posts in private groups, conversation messages): SELECT policy joins through membership.
- **Vendor pages**: SELECT `using (true)` (public-discoverable); UPDATE only by owner.
- **Trigger functions** that write to RLS-protected tables use `security definer`.

**Vendor flag:** `profiles.is_vendor` is the source of truth. `vendor_profiles` is 1:1 optional extension. Toggling off in settings keeps the row (for re-enable) but hides vendor UI.

---

## Navigation structure

Expo Router file-based, two top-level route groups:

```
app/
├── _layout.tsx              # QueryClientProvider + AuthProvider
├── index.tsx                # cold-start router
├── (auth)/
│   ├── _layout.tsx          # bounces signed-in → /(tabs)
│   ├── welcome.tsx          # entry point for signed-out users
│   └── sign-in.tsx          # combined sign-in/sign-up via ?mode= param
└── (tabs)/
    ├── _layout.tsx          # bounces signed-out → /(auth)/welcome
    ├── index.tsx            # Home/Feed
    ├── collections/
    │   ├── index.tsx
    │   ├── [id].tsx
    │   └── [id]/add-card.tsx
    ├── marketplace.tsx
    ├── community.tsx        # groups + events
    ├── maps.tsx
    └── profile.tsx
```

**Route protection pattern:** layouts return `<Redirect>` from render based on `useAuth()`. Belt-and-suspenders: `index.tsx` handles cold start, layouts handle deep links and runtime transitions.

**Tabs:** 6 tabs total — Home, Collections, Marketplace, Community, Maps, Profile. Most are placeholders in Phase 1.

---

## Cross-cutting design decisions

These are decisions that affect multiple phases. Revisit before changing.

- **No App Store / Play Store in 2026.** Distribution via Expo Go QR (iPhone) and EAS-built signed APK (Android).
- **No in-app payments.** Marketplace is buyer-seller coordination only, Facebook Marketplace style.
- **UI/UX polish is deferred.** Phase 10 polish + possible hired designer in 2027.
- **Wednesdays are learning days.** No feature work.
- **Schema designed upfront, deployed phase-by-phase.** Reduces RLS attack surface and avoids commitment to columns that turn out wrong.
- **Migrations as text files in repo** under `supabase/migrations/`. Numbered sequentially. Supabase doesn't track them; the repo is the source of truth.
- **Server state in TanStack Query, client state in Context (auth) or Zustand (UI flags), screen-local state in useState.** Don't reach for global stores prematurely.
- **`router.back()` is always guarded with `canGoBack()`.** Falls back to a sensible explicit destination.
- **`<Redirect>` for declarative routing (layouts, guards). `router.push` for imperative (event handlers).**
- **Auth flows are state-driven, not navigation-driven.** Never `router.push` after signin/signout — let `onAuthStateChange` + guards handle it.

---

## What's deferred (and why)

- **NativeWind / Tailwind for RN** — polish concern, not Phase 1.
- **React Hook Form + Zod** — Phase 2, when forms get nontrivial.
- **Optimistic mutations** — Phase 2 Wednesday topic.
- **FlashList over FlatList** — Phase 2 Wednesday topic.
- **Realtime subscriptions** — Phase 3 (chat), Phase 4 (comments).
- **Push notifications** — explicitly deferred past build year. In-app badges only.
- **Group chat** — explicitly Phase 11+ work. Schema supports it (participants table) but UI is not built.
- **OAuth / social auth** — Phase 11 polish.
- **Onboarding tour** — Phase 10.
- **Privacy policy + ToS** — Phase 10 (free generators).

---

## Open questions to revisit

1. Are group posts visible to non-members? Affects RLS design for `group_posts`.
2. Should `conversations.context_listing_id` survive a listing being deleted, or `set null`?
3. `genre` as text vs. lookup table. Currently text for flexibility; could promote to table if vocabulary stabilizes.
4. Multi-photo on cards from Phase 2 or single-photo until Phase 6? Lean toward multi from Phase 2.
5. Featured vendor tier (`is_featured` boolean) — manual flag in 2026; product question whether this becomes paid in 2027+.

---

## File structure

```
collectiv/
├── app/                          # routes (see Navigation section)
├── lib/
│   └── supabase.ts               # client + SecureStore adapter
├── providers/
│   └── auth-provider.tsx         # Context + onAuthStateChange subscription
├── components/                   # (Phase 2+, shared UI)
├── hooks/                        # (Phase 2+, custom hooks like useCollections)
├── types/                        # (Phase 2+, database types from Supabase CLI)
├── supabase/
│   └── migrations/               # numbered SQL files, source of truth
├── docs/                         # this document + others
├── .env                          # EXPO_PUBLIC_SUPABASE_* (gitignored)
├── app.json                      # Expo config
├── package.json
└── tsconfig.json
```

---

## Phase progression summary

| Phase | Adds | Deploys | Key learning |
|---|---|---|---|
| 1 | Shell, auth, vendor flag | profiles, collections | Expo Router, RLS basics |
| 2 | Cards, photos, showcase | cards, card_photos | Supabase Storage, TanStack Query |
| 3 | Marketplace, chat | listings, conversations, conversation_participants, messages | Realtime, optimistic UI |
| 4 | Social feed | follows, feed_events, comments, reactions, notifications | Feed queries, infinite scroll |
| 5 | Groups | groups, group_members, group_posts | Many-to-many, content moderation |
| 6 | Vendor storefronts | vendor_profiles, vendor_reviews | Polymorphic profiles |
| 7 | Events | events, event_rsvps | Timezones, recurrence design |
| 8 | Maps | (uses existing geography cols) | PostGIS, react-native-maps |
| 9 | Presence/networking | (uses existing profile cols) | Realtime presence, privacy |
| 10 | Polish + seed data | — | Distribution, feedback collection |
| 11 | Multi-category | — | Out of build year, JSONB metadata makes this UI work |
