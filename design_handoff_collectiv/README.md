# Handoff: Collectiv — Trading Card Social Marketplace

## Overview
Collectiv is a **mobile-first social marketplace for trading cards** (sports cards + TCG: Pokémon, Magic, One Piece, etc.), with an Edmonton-area local-meetup model. This package contains the full set of designed screens across all 5 tabs plus onboarding, auth, profiles, settings, notifications, messages, and a peer-to-peer transaction (buy/trade) flow.

## About the Design Files
The files in this bundle are **design references created in HTML/React-via-Babel** — prototypes showing intended look and behavior, **not** production code to copy directly. They render as static, prop-driven design frames laid out on a pannable "design canvas" for review.

Your task is to **recreate these designs in the target codebase's environment** using its established patterns, component library, navigation, and state management. If no front-end environment exists yet, choose an appropriate stack (the designs assume a native-feeling mobile app — React Native, Expo, SwiftUI, or a mobile-first React/Vue PWA are all reasonable). Do **not** ship the Babel-in-browser HTML as production.

## Fidelity
**High-fidelity.** Final colors, typography, spacing, radii, and interaction states are specified in `design-tokens.css` and used consistently. Recreate the UI pixel-accurately using the codebase's libraries, pulling exact values from the tokens file. Phone frames are designed at **390px logical width**.

## Visual System (locked)

### Colors (see `design-tokens.css` for the full set + dark mode)
| Token | Hex | Use |
|---|---|---|
| `--brand-primary` (Coral) | `#E76F51` | brand, CTAs, prices, nav active |
| `--brand-secondary` (Purple) | `#7C3AED` | social / community / groups |
| `--color-success` (Green) | `#10B981` | verified, success, "Open now" |
| `--color-warning` (Amber) | `#f59e0b` | closed, caution |
| `--color-error` (Red) | `#ef4444` | deny, block, danger rows |
| `--bg-base` | `#fef9f5` | app background (warm off-white) |
| `--bg-surface` | `#fef0e8` | cards, inputs, chips |
| `--fg-primary` | `#1a1210` | primary text |
| `--fg-secondary` | `#6b5c52` | secondary text |
| `--fg-tertiary` | `#aa9a90` | tertiary / meta text |
| `--border-default` | `#f0ddd0` | dividers, card borders |

A full **dark mode** palette is defined under `[data-theme="dark"]`.

### Typography
- **DM Serif Display** — collector/display headings (collection names, prices on detail pages, portfolio headers)
- **DM Sans** — all body & UI text
- **Sora** — social/community headings (feed titles, group names, usernames, event titles, activity badges)
- Sizes: xs 11 · sm 13 · base 15 · md 17 · lg 20 · xl 24 · 2xl 28 · 3xl 34 (px)
- Weights: 400 / 500 / 600 / 700 / 800

### Spacing / Radius / Shadow
- Spacing scale: 4 · 8 · 12 · 16 · 20 · 24 · 32 · 40 px
- Radius: sm 6 · md 10 · lg 14 · xl 20 · full 999 px
- Shadows: sm `0 1px 3px rgba(0,0,0,.08)` · md `0 4px 12px rgba(0,0,0,.12)` · lg `0 8px 24px rgba(0,0,0,.16)`

### Density & cards
Dense 3-column grids in browse/portfolio views (6–9 cards visible). Cards use subtle depth: soft shadow, rounded corners (`--radius-lg`), badge overlays on the image (grade, condition, HOT/NEW).

## App Structure
Bottom tab bar, 5 tabs: **Home · Portfolio · Market · Social · Map**. Profile is reached via the avatar (not a tab). Active tab uses coral; inactive uses `--tab-bar-inactive`.

## Screens / Views

### Onboarding / Auth (`screens-auth.jsx`)
- **Tutorial (4 slides):** feature highlights with a 400px hero band, progress bar, Skip + Next/Get-started. Slides: Collect & Showcase (fanned gradient cards) · List/Buy/Trade (scattered listing cards) · Join the Community (group chat preview) · Find Local Stores & Events (icon-pin map).
- **Auth:** Splash, Sign Up, Log In, Forgot Password, Verify Email (OTP).
- **Onboarding (5 steps):** Profile setup → Interests (genre grid: Pokémon TCG / Sports / Magic / One Piece / Yu-Gi-Oh! / Lorcana / Digimon / Others — Sports & Others expand to sub-genre sets) → Location & radius → Upload first card (camera or gallery) → All set.

### Home (`screens-home.jsx`, prefix `HM_`)
Feed, Composer, Notifications (bell), Liked-by list, Comments thread, Share sheet, Post ··· menu, and composer variants: Showcase / Photo / GIF / Poll.

### Portfolio (`screens-portfolio-v2.jsx` + `core-loop-screens.jsx`, prefix `C`/`AC_`)
Home (new + with-friends), Add Card flow ("Upload Your Card" — camera/gallery, 6 states), Add Collection (3), Filter (2), Card Detail states — **Market mode = your own listing** (Edit / Mark as Sold), **Showcased = your own** (likes/comments + Listings/Reviews) and others', Showcased ··· menu, Private.

### Market (`screens-market-v2.jsx`, prefix `MV_`)
Browse/Home (hero banner + dense grid; cards show **condition + card type + distance**), Location/radius sheet, Sort, Filter (incl. genre), Search (empty/typing/results), **Listing Detail — two types:** seller view (tappable storefront card + "I'm Interested") and your-own (Edit / Mark as Sold + offers-received row), Chat.

### Social (`screens-social.jsx`, prefix `SC_`)
Groups ⇄ Events toggle. Header has a **＋ create** icon and a **bell**; a **⚙ menu** (Invites/Notifications/Pins/Following/Membership). Group views: member Discussion/Members/Media/Events tabs, ··· action sheet, in-group Search. Public group (preview/joined). Create Group, Invite picker, **Create Event (with Co-hosts** — owner + mutual-follow co-hosts). Events list (3 sorts). **Event Detail** (full one-line address, Interested/Going/···, Go-with-friends mutual-follow invites, Suggested events; **owner view shows an edit icon**, no sticky bar). Event ··· action sheet.

### Map (`screens-map.jsx`, prefix `MP_`)
Freely-explorable Google-Maps-style warm canvas (pan/zoom/search real places — **distinct from** the Market radius model). 3 uniform circular icon pins: **Seller** (avatar) / **Vendor** (🏪) / **Event** (📅). Bottom sheet has **two detents only: closed / half** (no full). Filter chips (Sellers/Vendors/Events) with none selected by default → sheet closed.
- **Seller preview:** description + Listings/Reviews tabs.
- **Vendor preview:** storefront photo, "Open now/Closed" tag, hours top-right by name, full address, Get directions (→ external maps), Listings/Reviews tabs.
- **Event preview:** mirrors the event detail page (poster, date/time, address+directions, Interested/Going/···, going avatars, genre tags, About, host) — minus invite/suggested sections.
- Previews are half-detent and scroll internally.

### Profile (`screens-profile.jsx`, prefix `PR_`)
Instagram-style icon tabs. **Own:** Showcase/Listings/Activity/Reviews; Edit + Share + ▾ dropdown (suggested accounts + joined-group highlight circles); Settings (⚙) and Edit Profile reachable from header. **Other collector:** Follow/Message + ▾, all tabs + ··· action sheet. **Vendor storefront:** Gallery/Listings/Reviews, ratings + cards-sold stats, **Directions** (not Follow), suggested vendors, ··· action sheet.

### Account (`screens-account.jsx`, prefix `AX_`)
- **Settings:** Account (Edit Profile, email, password, phone), Notifications prefs, Privacy & visibility, Appearance (theme), Help, Log out.
- **Notifications:** grouped Today / This week / Earlier; types = social / messages / events / marketplace.
- **Messages:** Inbox (rows with **listing-context** show card thumbnail + title + 🏷 price chip), New Message compose, Chat with listing context, Chat plain, Group chat, ··· action sheet.

### Transaction (Buy/Trade) Confirmation Flow (`screens-account.jsx`, prefix `AX_TX`)
A peer-to-peer deal completed inside chat. **Two scenarios throughout: Buy (cash, optionally bundling extra cards) and Trade (offer cards from your collection ± cash).**
1. Buyer chat with a pinned listing card + ✓ confirm action.
2. **Make an Offer sheet** — Buy/Trade segmented toggle; Buy has a cash-amount input + "Add more cards" → dialog of the seller's other listings; Trade lets you pick your own cards + optional cash.
3. Buyer pending.
4. Seller notified (Review ›) — buy vs trade copy.
5. **Seller review** — Buy shows bundled cards + cash total; Trade shows You-give / You-receive + cash. Actions: Accept / **Counter** / **Deny**.
6. Seller double-check confirm (transfer summary; two-way for trade).
7. Transfer complete (cards auto-move between portfolios).
- **Counter (4 screens):** seller composes (buy/trade) + buyer receives (buy/trade).
- **Deny (4 screens):** seller declines (buy/trade) + buyer sees declined (buy/trade) with "send a new offer".

On acceptance, listed items **automatically transfer to the buyer's portfolio** — no manual re-adding.

## Interactions & Behavior
- **Bottom sheets / action sheets:** dim overlay (`rgba(14,13,12,0.4)`) + sheet sliding from bottom, `22px 22px 0 0` radius, drag-handle pill, recap header, rows; **danger rows** (block/report/deny/delete) tinted with `--color-error` on a faint red background.
- **Tabs:** active indicator is a coral underline (icon tabs) or coral text + underline (text tabs).
- **Map sheet detents:** closed ↔ half; tapping the handle closes. Pin tap selects + snaps sheet to that item's half-detent preview, dims the map.
- **Transaction state machine:** offer → pending → (accept | counter ⇄ | deny) → confirm → complete. Counter loops between parties; deny ends with listing staying live.
- **Mutual-follow gating:** event/co-host invites only allow people the user mutually follows.

## State Management (suggested)
- Auth/session; onboarding step + selections (interests, location radius).
- Portfolio collections & cards; per-card visibility mode (market/showcased/private).
- Market filters (sort, genre, condition, radius), search query.
- Social: group membership, event RSVP (interested/going), co-hosts.
- Map: active filter chip, selected pin, sheet detent.
- Messages: threads, listing-context attachment, **transaction status** per deal (offer kind buy/trade, items, cash, counter history).

## Design Tokens
All values are in **`design-tokens.css`** (CSS custom properties, light + dark). Use it as the single source of truth — colors, spacing, type scale, radii, shadows, and component tokens (cards, buttons, inputs, avatars, badges, price, verified) are all defined there.

## Assets
- Fonts: **DM Serif Display, DM Sans, Sora** (Google Fonts).
- Card imagery in the prototypes is **gradient placeholders** with grade/condition/category badge overlays; a few cropped real card scans live in `assets/` (onboarding) but production should use real listing photography.
- Icons are Unicode glyphs/emoji as placeholders — swap for the codebase's icon set.
- The map is a **styled geometric placeholder**; production needs a real tile renderer (Mapbox / Google Maps / Apple Maps) behind the same pin + sheet layer.

## Files (in this bundle)
- `Collectiv - All Screens.html` — master compile of every screen (open in a browser to view).
- `design-tokens.css` — **the source of truth for all visual values.**
- Component sources: `screens-home.jsx`, `screens-portfolio-v2.jsx`, `core-loop-screens.jsx`, `screens-market-v2.jsx`, `screens-social.jsx`, `screens-map.jsx`, `screens-profile.jsx`, `screens-account.jsx`, `screens-auth.jsx`.
- `design-canvas.jsx` — the review canvas wrapper (not part of the product; ignore for implementation).

> Note: each screen file is plain React rendered via in-browser Babel and reads design values inline (mirrored from `design-tokens.css`). Treat the JSX as a precise spec of structure, copy, and styling — then rebuild with the target codebase's components.
