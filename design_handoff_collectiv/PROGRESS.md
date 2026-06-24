# Collectiv — Project Progress & Status

_Mobile-first social marketplace for trading cards (sports + TCG focus), Edmonton-area location model. Direction 2 visual language. 390px phone frames, dense layouts, subtle-depth cards._

---

## Visual System (locked — see `design-tokens.css` / CLAUDE.md)
- **Coral `#E76F51`** — brand / CTA / prices / nav active
- **Purple `#7C3AED`** — social / community / groups
- **Green `#10B981`** — verified / success
- **Fonts:** DM Serif Display (collector headings) · DM Sans (UI/body) · Sora (social/community headings)
- 5 tabs: **Home · Portfolio · Market · Social · Map**. Profile via avatar (not a tab).

---

## Master Compile
**`Collectiv - All Screens.html`** — every finished screen on one design canvas (compact mode: section titles hidden in canvas chrome, per-screen labels shown, each section flows as one horizontal row). ~121 artboards.

Component source files:
- `screens-home.jsx` (HM_) · `screens-portfolio-v2.jsx` + `core-loop-screens.jsx` (C/AC_) · `screens-market-v2.jsx` (MV_) · `screens-social.jsx` (SC_) · `screens-map.jsx` (MP_) · `screens-profile.jsx` (PR_) · `screens-account.jsx` (AX_) · `screens-auth.jsx` (AU_) · `design-canvas.jsx` (shared canvas, now supports `columns`/`compact`).

---

## Status by Section

### ✅ Onboarding / Auth
- **Tutorial (4 slides):** Collect & Showcase (gradient placeholder cards, grade/category/condition tags) · List/Buy/Trade (6 scattered listing cards) · Join & Explore a Wide Community (group chat sharing showcase/listing/event) · Find Local Stores & Events (zoomed-out map w/ icon pins).
- **Auth:** Splash · Sign Up · Log In · Forgot Password · Verify Email.
- **Onboarding (5 steps):** Profile setup → Interests → Location & radius → Add first card ("Upload a card" — camera or gallery) → All set ("Go to my collection").

### ✅ Home
Feed · Composer · Notifications (bell) · Liked-by · Comments · Share sheet · Post ··· menu · Composer variants (Showcase / Photo / GIF / Poll).

### ✅ Portfolio
Home (new + with friends) · Add Card flow (Upload Your Card — camera/gallery, 6 states) · Add Collection (3) · Filter (2) · Card Detail states — **Market = your own listing** (Edit/Mark as Sold), **Showcased = your own** (likes/comments + Listings/Reviews) + others', Showcased ··· menu, Private.

### ✅ Market
Browse/Home (hero + grid cards show **condition + card type + distance**, no "FEATURED") · Location/radius · Sort · Filter · Search (3 states) · **Listing Detail — 2 types:** seller (tappable storefront card, "I'm Interested", no Make Offer) + your-own (Edit / Mark as Sold, offers-received row) · Chat.

### ✅ Social
Groups ⇄ Events (interactive) + **Manage** (⚙ top-right: menu w/ Invites/Notifications/Pins/Following/Membership — Create lives on **＋** icon) · Group views (member Discussion/Members/Media/Events tabs, ··· action sheet, in-group Search) · Public group (preview/joined) · Create Group · Invite picker · Create Event (**with Co-hosts** — owner + add mutual-follow co-hosts) · Events list (3 sorts) · **Event Detail** (full address, Interested/Going/···, Go-with-friends mutual-follow invites, Suggested events; **owner view = edit icon, no sticky Going bar**) · Event ··· action sheet.

### ✅ Map
Single **⑤ Map** row: Default (closed) → Search typing → Search results → List·Sellers/Vendors/Events → Preview·Seller/Vendor/Event.
- Google-Maps-style warm canvas, freely explorable (NOT the Market radius model). 3 uniform icon pins (Seller avatar / 🏪 Vendor / 📅 Event).
- Sheet detents: **closed / half only** (no full). Previews are half-detent + scroll internally.
- **Seller preview:** description + Listings/Reviews tabs. **Vendor preview:** photo, "Open now/Closed" tag, hours top-right by name, full address, Get directions, Listings/Reviews tabs. **Event preview:** mirrors event detail (minus invite/suggested).

### ✅ Profile / Account
- **Own:** icon tabs (Showcase/Listings/Activity/Reviews), Edit+Share+▾ dropdown (suggested accounts + joined-group circles), Listings tab, Settings (⚙), Edit Profile.
- **Other collector:** Follow/Message+▾, all tabs incl. Activity, ··· action sheet.
- **Vendor storefront:** Gallery/Listings/Reviews, ratings + cards-sold stats, Directions (not Follow), suggested vendors, ··· action sheet.
- **Settings** (Account w/ Edit Profile, Notifications, Privacy, Appearance, Help, Log out) · **Notifications** (grouped) · **Messages**.

### ✅ Messages
Inbox (**listing-context rows** show card thumbnail + title + 🏷 price chip) · New Message · Chat w/ listing context · Chat plain · Group chat · ··· action sheet.
- **Transaction Confirmation Flow (7+ steps):** Buyer chat (✓ confirm icon) → **Make an Offer sheet (Buy with cash OR Trade cards + optional cash)** → pending → Seller review (accept/deny, editable) → double-check → complete. On confirm, listed items auto-transfer to the buyer's portfolio.

---

## Open / Next Candidates
- Trade-offer **seller-side review** screen (seller seeing an incoming trade, not just a cash offer) — currently the seller review path assumes cash items.
- Real map tile renderer (current map is a styled geometric placeholder).
- Wire real card imagery into onboarding heroes (currently gradient placeholders; cropped real cards exist in `assets/`).
- Hook up live navigation between screens (most are static design frames).

---

## Conventions / Notes for Next Session
- All screens are **prop-driven static frames** composed onto `design-canvas.jsx`; the canvas is in **compact + single-row-per-section** mode.
- Action sheets follow a shared pattern: dim overlay + bottom sheet + recap header + rows (danger rows tinted coral).
- Previews/sheets that need scroll use `overflow:auto` inside a fixed-height sheet.
- Edits to a screen propagate to **both** the All-Screens compile and any standalone flow file that imports the same component.
- When `str_replace_edit` fails on whitespace/emoji mismatch, use `run_script` + `replaceText` for literal matching.
