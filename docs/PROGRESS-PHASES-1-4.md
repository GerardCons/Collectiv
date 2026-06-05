# Collectiv — Progress Summary (Phases 1–4)

_Last updated: June 2026. This covers everything built and working so far — the
"minimum coherent slice" (Phases 1–3) plus the social layer (Phase 4)._

---

## What Collectiv is today

A working mobile app (React Native + Expo, Supabase backend) where collectors can:
**sign up → catalog their cards with photos → showcase them → list them for sale →
discover other collectors → chat in real time → follow people and see a live feed
with likes & comments.**

No app store needed — it runs in **Expo Go** (iPhone) and as an **Android APK**.

---

## ✅ Phase 1 — Foundation, Auth & Collections

| Area | What works |
|---|---|
| **Auth** | Email + password sign up / log in, session persists across restarts (SecureStore). Password show/hide, inline validation. |
| **Navigation** | 5 tabs — Home · Portfolio · Market · Social · Map. Profile & Settings are pushed screens. |
| **Profile** | Your profile (avatar initials, name, @username, bio, location, vendor badge), Edit Profile (incl. unique-username handling). |
| **Settings** | Hub with grouped sections, **Sign out**, and the **Vendor/business** toggle (flips `is_vendor`, captures business name). |
| **Collections** | A seeded **"Main"** collection per account, switch-collection sheet, **New collection** (name + genre + description), filter/sort sheet. |

**Backend:** `profiles`, `collections`, a signup trigger that auto-creates the profile + unique username + seeds "Main". Row-Level Security on everything.

## ✅ Phase 2 — Cards & Showcase

| Area | What works |
|---|---|
| **Add card** | **Live camera viewfinder** with a card-shaped guide that **auto-crops to the frame**, or choose from library. Front + back photos. Step 2: name, set, condition, notes, visibility. |
| **Card detail** | Three states (Private / Showcased / Listed), front/back photo toggle, edit, delete, **showcase toggle**, more-actions sheet. |
| **Portfolio** | Real card grid & list views with **filter** (All/Showcased/Listed/Private) and **sort**; live card count. |
| **Public profile** | Visit any collector's profile and see their **showcased** cards by tab. |

**Backend:** `cards`, `card_photos`, a public **Storage bucket** for photos (paths stored in DB), showcase-aware RLS.

## ✅ Phase 3 — Marketplace & Real-time Chat

| Area | What works |
|---|---|
| **List for sale** | From any card → set price/description/pickup → card becomes **Listed** (one active listing per card). |
| **Marketplace** | Browse active listings (photo, price, seller), search, pull-to-refresh. |
| **Listing detail** | Photo, price, seller (→ their profile), description; seller can **Mark sold / Cancel**. |
| **Seller dashboard** | Active / Sold / Cancelled tabs with quick actions. |
| **Chat** | **Message seller** opens a conversation (pre-filled), **real-time messaging** (Supabase Realtime), chat list with unread dots, read receipts. |

**Backend:** `listings`, `conversations`, `conversation_participants`, `messages`, a find-or-create-conversation function, Realtime on messages.

## ✅ Phase 4 — Social Feed

| Area | What works |
|---|---|
| **Follow** | Follow / unfollow from any profile; tappable **Followers / Following** lists; live counts. |
| **Home feed** | Auto-populated — "X showcased Y" / "X listed Y for $N" with photo; followed users float to the top. |
| **Likes & comments** | On listings **and** showcased cards, with **real-time** updates and a **"liked by"** sheet. |
| **Notifications** | Follow / like / comment notifications, a **Home-tab badge**, mark-as-read on open. |

**Backend:** `follows`, `feed_events` (auto-populated by triggers), polymorphic `comments` + `reactions`, `notifications` (auto-created by triggers), Realtime on comments/reactions/notifications.

---

## Screen inventory (all 21 P1 + Phase-4 screens)

Auth (3) · Tabs+Home feed · Profile · Edit profile · Settings · Vendor · Collections · Switch sheet · New collection · Filter sheet · Add card · Card detail (+ more menu) · Edit card · Public profile · List for sale · Marketplace · Listing detail · Seller dashboard · Chat list · Conversation · Followers/Following · Notifications.

---

## Deliberately deferred (not bugs)

- **No payments** — marketplace is buyer–seller coordination only (meet up / arrange externally).
- **Avatars are initials** — photo upload for profile avatars is later; card photos are real.
- **No password reset yet** — the link exists but is inert.
- **In-app notifications only** — no push notifications.
- **Not built yet:** Groups (P5), rich Vendor storefronts (P6), Events (P7), Maps/local discovery (P8), live presence (P9), final polish/onboarding (P10).

---

## Tech stack

React Native + Expo SDK 54 · Expo Router · TypeScript (strict) · Supabase (Postgres + Auth + Storage + Realtime) · TanStack Query · StyleSheet. All database changes are versioned SQL in `supabase/migrations/` (0001–0004).
