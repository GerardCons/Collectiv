# Next Session Prompt — Collectiv UI Polish

---

Paste this as your opening message in the next Claude Code session:

---

**PROJECT:** Collectiv — React Native + Expo SDK 54 + Supabase mobile app for trading card collectors. Repo at `D:\Development\collectiv` on Windows (PowerShell shell).

**CURRENT STATE — ALL 10 PHASES COMPLETE (v1.02)**

10 migrations deployed (0001–0010). Every screen is built and working. Summary of what exists:

- **Auth:** sign-up, sign-in, forgot/reset password
- **Portfolio:** collections, add card (camera), card detail, edit card, list for sale, pickup location
- **Marketplace:** browse, listing detail (with meet-up area), seller dashboard
- **Chat:** conversation list, real-time chat
- **Social/Community:** home feed, follows, likes/comments, notifications, groups, group posts, events + RSVP
- **Vendor:** storefront editor, public storefront, vendor location
- **Maps:** MapView tab (seller/vendor/event pins), filter chips, pin bottom sheet
- **Presence:** online dot on profiles, active-collector counter on Home, Privacy settings
- **Settings:** full settings hub, vendor, privacy, legal rows
- **Polish:** onboarding tour (4 slides), avatar photo upload, EAS config, seed SQL

**Tech:** StyleSheet only (no NativeWind), TanStack Query, Zustand, Supabase Realtime, react-native-maps, expo-location, expo-image, expo-camera.

**Design tokens:** `constants/theme.ts` — accent `#E76F51` (coral), success `#2A9D8F` (teal), background `#FFFFFF`, surface `#F4F1ED`, text `#1A1A1A`.

**AGENTS.md rule:** Always read https://docs.expo.dev/versions/v54.0.0/ before writing Expo-specific code.

---

**THIS SESSION'S GOAL — HIGH-FIDELITY UI POLISH**

I will send you a full screenshot of one screen at a time. For each screenshot:

1. Look at it carefully — identify spacing issues, alignment, typography, color, empty states, anything that feels unpolished
2. Tell me what you see and what you'd fix (2–3 sentences max)
3. Wait for my go-ahead, then edit only that screen's file
4. No refactoring, no new features — visual polish only

I will go screen by screen in this order (roughly):
Welcome → Sign In → Sign Up → Home Feed → Portfolio → Card Detail → Marketplace → Listing Detail → Chat → Community → Group Detail → Event Detail → Maps → Profile → Settings → Privacy → Vendor

Start by asking me: **"Send me the first screenshot."**
