# Collectiv — Screen Sketch Order

**Phase 0 deliverable.** Target: ~25–30 screens sketched on paper or in Figma/Excalidraw. Existing wireframes count.

---

## How to sketch effectively

The goal is **thinking on paper, not designing.** A sketch is good when it forces a decision; it does not need to be beautiful.

**Each sketch should answer:**
1. What information does this screen primarily display?
2. What can the user *do* here? (Every tappable element listed.)
3. Where does each action *go*? (Arrow to the next screen.)
4. What's the empty state? (Often missed — what does this look like with zero data?)
5. What's the error state? (Skip for Phase 0; come back when polishing.)

**Tools, in order of preference:**
- **Paper + pencil** — fastest, lowest friction, easiest to throw away. Your existing wireframes are this style and they work.
- **Excalidraw** ([excalidraw.com](https://excalidraw.com), free, web-based) — if you want to share them or want the digital archive.
- **Figma** — overkill for sketching; reserve for the Phase 10 polish work with a hired designer.

**Keep them rough.** Boxes labeled "image" are fine. Text that says "title here" is fine. Hand-drawn icons are fine. If you find yourself picking exact colors or fonts, stop — that's polish work.

---

## Priority levels

| Priority | When | Detail level | Phases covered |
|---|---|---|---|
| **P1 — Detailed** | Sketch in Phase 0 before building begins | Each tappable element labeled, navigation arrows drawn | Phases 1–3 (the minimum coherent slice) |
| **P2 — Rough** | Sketch in Phase 0 if time permits | Boxes-and-labels with arrows | Phases 4–7 |
| **P3 — Very rough** | Just enough to remember the idea | Single thumbnail per screen | Phases 8–10 |

The P1 sketches are doing real architecture work — you're locking in the user flow before code makes flow changes expensive. The P2 and P3 sketches exist mainly so you don't forget what's coming.

---

## P1 — Phase 1 to 3 screens (detailed, ~16 screens)

Sketch these all before starting Session 2.

### 1. Welcome ✅ *(already sketched)*
- Logo / brand area
- Tagline
- "Create account" → Sign Up
- "I already have an account" → Sign In
- **Empty state:** none (always this content)

### 2. Sign Up
- Display name input
- Email input
- Password input
- "Sign Up" button → tabs (auto, via auth state)
- "Already have an account? Sign in" link → Sign In
- Back button → Welcome
- **Error states to think about:** email taken, password too short

### 3. Sign In
- Email input
- Password input
- "Sign In" button → tabs (auto)
- "Don't have an account? Sign up" link → Sign Up
- Back button → Welcome
- **Future:** "Forgot password" link (Phase 10 polish)

### 4. Tabs root with Home tab (placeholder)
- 6 tabs along the bottom: Home, Collections, Marketplace, Community, Maps, Profile
- For Phase 1 placeholder: just text saying "Phase 4 — Feed coming"
- This is a chance to lock in tab order and labels

### 5. Profile tab
- Avatar (placeholder circle), display name, email
- "Edit profile" button → Edit Profile
- "Settings" button → Settings (where vendor toggle lives)
- "Sign out" button (Phase 1 minimum implementation)
- **Phase 2+:** showcased cards grid below

### 6. Edit Profile
- Display name input (current value pre-filled)
- Bio textarea
- Avatar tap to change (Phase 2+, uses image picker)
- "Save" button → back to Profile

### 7. Settings
- Sections list: Account, Vendor, Privacy, About
- **Vendor section:** "I'm a vendor" toggle. When ON, reveals business name field. Save = flip `is_vendor` and write `business_name`.
- **Privacy section (Phase 9):** placeholder for presence and location toggles
- **Account section:** change password, delete account (Phase 10)

### 8. Collections list ✅ *(already sketched as Image 2.A grid + 2.B list)*
- Header with title "Main" or current collection name
- Grid (default) or list (toggle) of cards
- Empty state: "Add your first card" CTA (rare — seeded Main collection means most users don't see this for long, but cards-empty state is real)
- "+" button to add card
- Filter button → Filters sheet
- Switch collection button → Collection switcher sheet

### 9. Collection switcher sheet ✅ *(in your Image 2.D)*
- List of user's collections (Main, Pokémon, Sports, etc.)
- Each item: name, card count
- "+ New collection" button at bottom
- Tap a collection → switch and dismiss

### 10. New collection modal
- Collection name input
- Genre picker (Pokémon, Sports, One Piece, Yu-Gi-Oh!, Other)
- Description textarea (optional)
- "Create" button → new collection becomes active

### 11. Filters sheet ✅ *(in your Image 2.C)*
- Sort by: name, date added, condition, value (Phase 2+)
- Filter by: genre, condition, state (private/showcased/listed)
- "Apply" → close sheet, list updates

### 12. Add card flow — Step 1: Camera scan ✅ *(already sketched as Image 3.A)*
- Camera viewfinder
- "Front" and "Back" capture states
- Indicator: which side captured (checkmark)
- Manual entry fallback link → Add card form directly
- Cancel → back to collection

### 13. Add card flow — Step 2: Confirm + details ✅ *(in your Image 3.A continued)*
- Two thumbnails: front and back captured
- Title input (could be auto-filled from OCR in future)
- Set name dropdown or input
- Condition picker (Mint, Near Mint, Excellent, Good, etc.)
- Notes textarea
- Visibility: Private (default) / Showcased
- "Save" → card created, return to collection list

### 14. Card detail — three states ✅ *(already sketched as Image 4.1, 4.2, 4.3)*
Same screen, different state badge at top:
- **Private:** edit / delete / showcase button / list-for-sale button
- **Showcased:** unshowcase / list-for-sale
- **Listed:** view listing details, mark sold, cancel listing
- More menu (...) opens action sheet ✅ *(your Image 4.4)*
- Comments thread visible when card is listed/showcased ✅ *(your Image 4.6)*
- "Liked by" sheet on tap of like count ✅ *(your Image 4.5)*

### 15. Edit card
- Same as add card Step 2 but pre-filled
- "Save" or "Delete" (with confirm)

### 16. Public profile (other user's profile view)
- Their display name, avatar, bio
- Vendor badge (Phase 6) if applicable
- Showcased cards organized by collection (grid)
- "Follow" button (Phase 4)
- "Message" button (Phase 3, only after they have a listing — or always? product decision)

### 17. Marketplace browse (Phase 3)
- Header: search input
- Filter chips: Genre, Price range, Distance, Sort
- Grid of listings: photo, price, seller name, distance
- Tap → Listing detail
- Pull to refresh, infinite scroll

### 18. Listing detail (Phase 3)
- Large photo (carousel if multi-photo)
- Title, price, condition, set
- Seller info (avatar, name, vendor badge if applicable)
- "Message Seller" button → Conversation with pre-filled message
- Description
- Shipping info / pickup location
- Comments + reactions (Phase 4 polymorphic infra)

### 19. Seller dashboard (Phase 3)
- Tabs: Active / Sold / Cancelled
- List of own listings with quick actions: edit, mark sold, cancel
- Stats summary: total active, total earned (Phase 10)

### 20. Chat list (Phase 3)
- List of conversations, sorted by `last_message_at` desc
- Each row: other user avatar, name, preview of last message, unread badge, timestamp
- Tap → Conversation
- Empty state: "Message someone to start"

### 21. Conversation (Phase 3)
- Header: other user avatar + name + back button
- Message bubbles (mine right, theirs left)
- Real-time updates via Supabase Realtime
- TextInput at bottom + send button
- Context: if this conversation is about a listing, show a small card at top with listing preview
- Keyboard handling: KeyboardAvoidingView wraps everything

---

## P2 — Phase 4 to 7 screens (rough, ~10 screens)

Sketch in Phase 0 if you have time after P1, otherwise during the relevant phase's first day. Keep them rough.

### 22. Home feed (Phase 4)
- List of feed events: "X added Y to Z collection" + photo; "X listed Y for $N" + photo
- Sort: followed users first, then chronological
- Like / comment / share (share is Phase 10)
- Pull to refresh, infinite scroll
- Empty state for users following no one: "Find people to follow"

### 23. Followers / Following list (Phase 4)
- Reachable from profile (own or others)
- Avatar + name + follow/unfollow button per row
- Search within the list

### 24. Notifications screen (Phase 4)
- Optional — could be just badges throughout the app
- If a dedicated screen: list of notifications grouped by type
- Tap → relevant screen (comment → listing, follow → user profile)

### 25. Groups browse (Phase 5)
- Search input
- Filter by genre
- Card per group: name, genre, member count, recent activity indicator
- "+ Create group" button
- "Joined" section at top showing groups you're in

### 26. Group detail (Phase 5)
- Header: name, description, member count, "Leave" or "Join" button
- Tabs: Posts / Members / About
- Posts feed (reuses comment / reaction patterns)
- "+ New post" floating action button

### 27. Create group flow (Phase 5)
- Name, description, genre, optional cover image
- "Create" → land in the new group

### 28. Group post composer (Phase 5)
- Post type picker (Discussion / Giveaway / Announcement)
- Text body
- Optional photo
- "Post"

### 29. Vendor storefront (Phase 6)
- Banner image at top
- Logo + business name + business hours
- Contact CTAs (call, email, Instagram, website)
- "Vendor" badge prominently displayed
- Tabs: Inventory / Events / Reviews
- Inventory: full active listings grid (reuses marketplace card UI)
- Events (Phase 7): events this vendor hosts
- Reviews: thumbs up/down count + reviewer list

### 30. Vendor onboarding flow (Phase 6)
- Triggered when user flips `is_vendor` to true
- Multi-step: business name + description, hours, contact info, address (optional), upload banner/logo
- "Skip for now" option (can complete from Settings later)

### 31. Events browse (Phase 7)
- Within Community tab, alongside Groups
- Filter by genre, date range, type (Meetup/Tournament/Convention)
- Card per event: name, date, location, RSVP count
- "Upcoming" / "Past" toggle

### 32. Event detail (Phase 7)
- Cover image, name, date/time, location with map preview
- Host (user or vendor) with badge
- RSVP buttons: Going / Interested / Not Going
- Attendee list (showing avatars of going+interested)
- Discussion thread (reuses comments infra)
- Vendor event: link to vendor storefront

### 33. Create event flow (Phase 7)
- Name, description, type, genre
- Date and time picker (timezone-aware)
- Location picker (map + address autocomplete)
- Max attendees (optional)
- "Create"

---

## P3 — Phase 8 to 10 screens (very rough, ~5 screens)

These are placeholders for thinking. Single thumbnail each, label only.

### 34. Maps tab (Phase 8)
- Full-screen map with pins
- Pin types: regular seller (light), vendor (medium), featured vendor (heavy), event (date badge)
- Filter chips along top: All / Sellers / Vendors / Events / by genre
- List view toggle (top right)
- Bottom sheet preview when pin tapped: name, summary, "View" CTA
- Current location indicator

### 35. Pickup location setup (Phase 8)
- Triggered on first listing creation
- Map: drop a pin at your preferred meet-up area
- "Use my current location" button
- City confirmation
- Max travel radius slider
- Privacy reminder: this location is shared with buyers

### 36. Privacy / presence settings (Phase 9)
- Toggle: Broadcast my online status (default OFF in P0 design, decision pending)
- Toggle: Show me on the Nearby Collectors map (default OFF)
- Toggle: Broadcast exact location to followers only (default OFF)
- Plain language explanation under each: "When ON, others can see..."

### 37. Nearby collectors view (Phase 9)
- Lives in Maps tab as a toggleable overlay
- Fuzzed pins (rounded to ~500m) showing opted-in nearby collectors
- Tap a fuzzed pin → user profile
- Anonymized counter on Home: "12 collectors active near you"

### 38. Onboarding tour (Phase 10)
- 4–5 slide overlay shown to first-time users
- Each slide: highlights one tab and what it's for
- "Got it" dismisses tour permanently (stored in `profiles.onboarding_completed_at`)
- Skip button always available

---

## Total count

P1: 21 screens (16 base + 5 modal/sheet variants)
P2: 12 screens (10 base + 2 flow variants)
P3: 5 screens

Total: ~38 distinct surfaces. The plan asks for 25–30, and that's the right count if you collapse modals/sheets into their parent screens (e.g., the filters sheet is part of the Collections screen). However you count, the work is the same — sketch each surface once.

---

## Order to sketch

1. **Start with P1.** Do them in order listed above — they roughly mirror the user's first session in the app, which helps reasoning about flow.
2. **Sketch Welcome through Conversation (P1 #1–21) in one sitting if possible** — momentum helps you catch contradictions ("oh wait, if I let users edit a collection name, my switcher sheet needs to handle that update").
3. **Then P2 in casual evening sessions** — these can be 10-minute thumbnails. Don't over-invest; Phase 5+ details will shift based on Phase 1–4 feedback anyway.
4. **P3 last, very loose.** These exist mostly so you don't forget the privacy work in Phase 9 needs upfront design.

---

## When you're done

You'll know you're done sketching when:
- You can describe the journey from "user opens app for the first time" to "user lists a card and sells it" without consulting anything.
- You've caught at least one "wait, that doesn't work" problem and revised a sketch.
- The full sketch set lives somewhere durable (paper folder, Excalidraw file in repo, photos in a `docs/sketches/` folder).

The catching-a-problem part matters most. Sketches that don't surface friction haven't earned their keep.
