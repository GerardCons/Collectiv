# Collectiv — Phase 0 Learning Checklist

**Phase 0 deliverable.** Two-week hard cap (Jun 1 – Jun 14, 2026). Finishing earlier is fine.

---

## How to use this document

Eight tracks, each ~2–6 hours. Aim for **understanding the concept and being able to recognize it in your existing codebase**, not memorization. After each track, do the small exercise in your existing project sandbox to verify. Mark tracks complete by editing the checkbox in this file.

**Stuck rule:** 45 minutes flailing on any single concept → stop, switch tracks, return tomorrow with fresh eyes.

**Suggested week structure:**

| Week | Tracks |
|---|---|
| Week 1 | Tracks 1–4 (React, TypeScript, RN primitives, Flexbox) |
| Week 2 | Tracks 5–8 (Expo Router, Supabase RLS, TanStack Query, Zustand) |

Two tracks per Wednesday-style learning day = roughly 2 weeks. Faster is fine.

---

## Track 1 — React fundamentals

**Why it matters for Collectiv:** Every screen is a component. Every interactive element uses state. Every effect (subscriptions, data fetching) uses hooks. You cannot write Collectiv without this.

**Primary resource:** [react.dev/learn](https://react.dev/learn) — the official "Learn React" section. It was rewritten in 2023 and is genuinely excellent. Read these pages in order:
- Quick Start
- Tutorial: Tic-Tac-Toe (do it; the muscle memory matters)
- Describing the UI (Components, JSX, Props)
- Adding Interactivity (Events, State, Re-rendering)
- Managing State (useState in depth, lifting state up)
- Escape Hatches (useEffect, useRef — skim, you'll meet these for real in Track 7)

**Supplementary:**
- Theo (t3.gg) YouTube — "useEffect mistakes" and similar shorts. Sharp commentary on common bad patterns.
- Beyond Fireship "React in 100 seconds" for a quick high-level overview before deep dive.

**Concept checklist:**
- [ ] Functional components and JSX
- [ ] Props (passing data down)
- [ ] `useState` and the re-render model
- [ ] Event handlers (`onPress`, `onChange`)
- [ ] Conditional rendering (`mode === 'sign-in' && ...`)
- [ ] Rendering lists with `.map()` and `key` prop
- [ ] `useEffect` for side effects + dependency array
- [ ] `useContext` for accessing context values
- [ ] Lifting state up vs colocation
- [ ] Why you don't mutate state directly (`setUser({...user, name: 'X'})`)

**Exercise (~30 min in sandbox):** In `app/(tabs)/profile.tsx`, add a counter below the email that increments when you press a button. Add a second button that resets it. Use `useState` only.

**Completion check:** Open your existing `sign-in.tsx` and explain out loud what each `useState`, each conditional render, and the `onPress` handlers are doing. If you can narrate the file fluently, you're done.

---

## Track 2 — TypeScript with React

**Why it matters for Collectiv:** You'll be typing database rows, route params, query results, and form data. Bad types make refactoring scary; good types make it safe.

**Primary resource:**
- [React TypeScript Cheatsheets](https://react-typescript-cheatsheet.netlify.app/) — the "Basic" section is what you need now.
- Matt Pocock's [Total TypeScript YouTube](https://www.youtube.com/@mattpocockuk) — beginner videos on generics, discriminated unions.

**Concept checklist:**
- [ ] Typing props with interface or type alias
- [ ] `ReactNode` vs `JSX.Element` vs `ReactElement` (use `ReactNode` for children)
- [ ] Typing `useState`: `useState<string>('')`, `useState<User | null>(null)`
- [ ] Event handler types: `(e: GestureResponderEvent) => void`
- [ ] Generic typing: `useQuery<Collection[]>(...)`
- [ ] Discriminated unions (`type Mode = 'sign-in' | 'sign-up'`)
- [ ] `as const` for literal narrowing
- [ ] Reading TS errors without panic (they're verbose but usually informative)

**Exercise (~30 min):** Define a `Collection` type matching your Postgres schema. Then define a function `getCollectionDisplayName(c: Collection): string` that returns the name, or "Untitled" if name is empty. Verify TS catches you if you try to pass a `string` instead of a `Collection`.

**Completion check:** Look at your `useLocalSearchParams<{ mode?: Mode }>()` line in `sign-in.tsx`. Explain the `?` and the angle brackets. If that all makes sense, move on.

---

## Track 3 — React Native primitives

**Why it matters for Collectiv:** These are the building blocks of every screen. There's no `<div>` in RN; everything is `<View>`, `<Text>`, etc.

**Primary resource:**
- [reactnative.dev/docs/components-and-apis](https://reactnative.dev/docs/components-and-apis) — official component reference.
- Notjust.dev (Vadim Savin) YouTube — "React Native crash course" or similar. Practical and Expo-friendly.

**Components to actually understand (not just memorize):**

| Component | What it does | When to reach for it |
|---|---|---|
| `View` | The div-equivalent. Layout container. | Everywhere; default container. |
| `Text` | All text content. Cannot have non-Text children. | Any user-readable string. |
| `Image` | Static image rendering. | Prefer `expo-image` for caching + perf. |
| `Pressable` | Modern touchable primitive. | All buttons and tappable elements. |
| `TextInput` | User text input. | Forms, search bars, chat. |
| `FlatList` | Virtualized list renderer. | Any list with >10 items. Phase 2 cards, Phase 3 marketplace. |
| `ScrollView` | Non-virtualized scrolling container. | Short content that overflows the screen; never for long lists. |
| `KeyboardAvoidingView` | Shifts content above the keyboard. | Forms with inputs near the bottom. |
| `ActivityIndicator` | Loading spinner. | While async work is pending. |
| `Alert` | Native modal alert. | Quick error display in Phase 1 (replaced by toast UI later). |

**Concept checklist:**
- [ ] `View` cannot have raw text children (must wrap in `Text`)
- [ ] `Text` can be nested inside other `Text` for inline styling
- [ ] `Pressable` vs deprecated `TouchableOpacity` (always use `Pressable`)
- [ ] `FlatList` requires `data`, `renderItem`, and `keyExtractor`
- [ ] `ScrollView` loads all children at once (perf trap for long lists)
- [ ] `KeyboardAvoidingView` behavior differs iOS vs Android (`behavior="padding"` is common)
- [ ] `expo-image` is preferred over base `Image` for caching

**Exercise (~45 min in sandbox):** Replace `app/(tabs)/collections.tsx` placeholder with a `FlatList` that renders a hardcoded array of 5 mock collection objects. Each list item should be a `View` containing two `Text` elements (name + genre). Add a `Pressable` "Add" button at the bottom that logs to console.

**Completion check:** You can build a screen with a list, an input, and a button without consulting docs every five minutes.

---

## Track 4 — Flexbox in React Native

**Why it matters for Collectiv:** Every screen layout uses flex. RN flex has subtle differences from web flex.

**Primary resource:**
- [reactnative.dev/docs/flexbox](https://reactnative.dev/docs/flexbox) — short, focused.
- Optional: Flexbox Froggy ([flexboxfroggy.com](https://flexboxfroggy.com/)) — game-based practice. Note it's web flexbox; the differences are noted below.

**RN-specific differences to internalize:**
- Default `flexDirection` is **`column`** (web default is `row`).
- Default `alignContent` is **`flex-start`** (web is `stretch`).
- Default `flexShrink` is **`0`** (web is `1`).
- `flex: 1` on a child means "fill remaining space along the main axis."

**Concept checklist:**
- [ ] `flex: 1` to fill space
- [ ] `flexDirection: 'row' | 'column'`
- [ ] `justifyContent` (main axis: top/bottom in column)
- [ ] `alignItems` (cross axis: left/right in column)
- [ ] `gap` for spacing between children (modern, clean)
- [ ] Absolute positioning with `position: 'absolute'` + `top/left/right/bottom`
- [ ] When to use `padding` vs `margin` vs `gap`

**Exercise (~30 min):** Build a layout: an outer `View` with `flex: 1`; inside it, a top bar with three items (left-aligned title, right-aligned two icons), a centered content area that takes the rest of the space, and a bottom row of two equally-wide buttons. No images needed — colored `View`s and `Text` labels are enough.

**Completion check:** Can you predict, by reading style props alone, where elements will appear on screen? When you can, move on.

---

## Track 5 — Expo Router

**Why it matters for Collectiv:** You've already used it. Now understand it deeply so route protection, dynamic segments, and shared layouts feel obvious by Phase 2.

**Primary resource:**
- [docs.expo.dev/router/introduction](https://docs.expo.dev/router/introduction) — read in order:
  - Introduction
  - Basics / Notation
  - Basics / Layouts
  - Basics / Navigation
  - Hooks (especially `useLocalSearchParams`, `useRouter`)
  - Advanced / Authentication patterns

**Concept checklist:**
- [ ] File-based routes: `index.tsx` is `/`, `foo.tsx` is `/foo`
- [ ] Dynamic segments: `[id].tsx` matches `/anything`, accessed via `useLocalSearchParams`
- [ ] Route groups: `(group)/` doesn't appear in URL, used for shared layout
- [ ] `_layout.tsx` renders before children, used for headers and providers
- [ ] `<Stack>`, `<Tabs>`, `<Slot>` — three layout types
- [ ] `<Redirect>` is declarative; `router.push/replace/back` are imperative
- [ ] `router.canGoBack()` guard before `router.back()`
- [ ] Typed routes require Metro running; restart TS server when stale
- [ ] How `useFocusEffect` differs from `useEffect` (re-runs when screen gains focus)

**Exercise (~45 min in sandbox):** Create a new route `app/(tabs)/collections/[id].tsx` that displays "Collection {id}" using `useLocalSearchParams`. From `app/(tabs)/collections.tsx`, add a `Pressable` that navigates to `/collections/test-123` via `router.push`. Verify the back button works.

**Completion check:** You can explain the entire navigation flow of the existing Collectiv codebase (cold start, signin, signout, deep linking) from memory.

---

## Track 6 — Supabase: tables, RLS, realtime, auth

**Why it matters for Collectiv:** Every screen in Phase 2+ queries Supabase. RLS is your actual security model — bugs here are real vulnerabilities.

**Primary resource:**
- [supabase.com/docs/guides/database](https://supabase.com/docs/guides/database) — tables, relations, functions
- [supabase.com/docs/guides/auth/row-level-security](https://supabase.com/docs/guides/auth/row-level-security) — **most important page on this list**
- [supabase.com/docs/guides/auth/quickstarts/react-native](https://supabase.com/docs/guides/auth/quickstarts/react-native) — auth specifics for RN
- [supabase.com/docs/guides/realtime](https://supabase.com/docs/guides/realtime) — overview only for now; deep dive in Phase 3
- Supabase YouTube channel — "RLS deep dive" content

**Concept checklist:**
- [ ] How `auth.uid()` works in policies (returns NULL if anon, UUID if signed in)
- [ ] FOR SELECT/INSERT/UPDATE/DELETE — write a policy per operation
- [ ] `USING` (filter for SELECT/UPDATE/DELETE) vs `WITH CHECK` (validate for INSERT/UPDATE)
- [ ] Why disabling RLS on a table = anyone can read everything via the anon key
- [ ] `security definer` functions and when they're needed (your signup trigger uses this)
- [ ] Foreign key constraints, ON DELETE CASCADE vs SET NULL vs RESTRICT
- [ ] Indexes — what they speed up and what they cost
- [ ] Partial unique indexes (e.g., your "one active listing per card")
- [ ] `gen_random_uuid()` vs sequence IDs
- [ ] Realtime channels concept (subscribe to a table or row changes)

**Exercise (~1 hour):** In Supabase SQL Editor, deliberately break and fix RLS:
1. Sign in as your user in the app.
2. In SQL Editor as anon role, try `SELECT * FROM profiles;`. You'll see your row only (existing policy says "everyone can read profiles" — so actually you see everyone's, which is currently 1 user).
3. Add a new policy: `CREATE POLICY "profiles readable only by self" ON profiles FOR SELECT USING (auth.uid() = id);` — but FIRST drop the existing "viewable by everyone" policy.
4. Confirm anon can no longer see anything; signed-in user sees only own.
5. **Revert** these changes — restore the "viewable by everyone" policy. Future phases need public-readable profiles.
6. Save the SQL of both changes as a `.sql` file in a scratch folder. This is also practice for migration discipline.

**Completion check:** You can read any RLS policy and predict who can see what.

---

## Track 7 — TanStack Query

**Why it matters for Collectiv:** Every screen in Phase 2+ reads server data through TanStack Query. The `useQuery` + `useMutation` + `invalidateQueries` trio is the most-repeated pattern in the codebase.

**Primary resource:**
- [tanstack.com/query/latest/docs/framework/react/quick-start](https://tanstack.com/query/latest/docs/framework/react/quick-start) — official quick start.
- TkDodo's blog series — search "TkDodo React Query" — considered the canonical deep dive. Read at least "Practical React Query."
- Skip optimistic updates for now (Phase 2 Wednesday topic).

**Concept checklist:**
- [ ] `useQuery` returns `{ data, isLoading, error, refetch, ... }`
- [ ] Query keys are arrays: `['collections', userId]` — change the key, change the cache entry
- [ ] `staleTime` (how long data is fresh) vs `gcTime`/`cacheTime` (how long data lives in cache)
- [ ] `useMutation` for writes; returns `{ mutate, isPending, error }`
- [ ] `queryClient.invalidateQueries({ queryKey: ['collections'] })` — refetches matching queries
- [ ] Why `QueryClient` is created once at app root (your `_layout.tsx` already does this)
- [ ] Enabled/disabled queries (`enabled: !!userId` to wait for prerequisite data)
- [ ] Error handling: don't try/catch inside the query fn unless you want to swallow errors; let TQ catch them

**Exercise (~1 hour, paper or sandbox):** Write the function signature and query key for the following queries you'll need in Phase 2:
- Fetch all my collections
- Fetch one collection by ID
- Fetch all cards in a collection
- Fetch one card by ID
- Fetch another user's showcased cards (public)

Then write the function signature for these mutations:
- Create a new collection
- Add a card to a collection
- Update a card's state to 'showcased'
- Delete a collection

For each mutation, write the `invalidateQueries` calls you'd need to refresh affected lists.

**Completion check:** You can explain why TanStack Query exists instead of just `useEffect + fetch`. (Hint: cache sharing across screens, deduplication, refetch on focus, stale-while-revalidate.)

---

## Track 8 — Zustand

**Why it matters for Collectiv:** Smaller scope than the others. Useful when you need cross-screen UI state (Phase 2+ might want a draft-card store, Phase 5 might want active group filter state). Not used in Phase 1.

**Primary resource:**
- [github.com/pmndrs/zustand](https://github.com/pmndrs/zustand) — readme is the docs. Read the whole thing; it's short.

**Concept checklist:**
- [ ] `create((set, get) => ({ ... }))` to define a store
- [ ] Selectors: `useStore(state => state.value)` to subscribe to a slice
- [ ] `set(state => ({...}))` updater pattern
- [ ] Why selectors prevent re-renders on unrelated state changes
- [ ] When NOT to use Zustand (server state — use TanStack Query; auth state — use Context)
- [ ] Persist middleware (you won't need this until Phase 9+ for preferences)

**Exercise (~20 min):** Write (don't deploy) a hypothetical store for "is the add-card modal open." It should have `isOpen: boolean`, `openModal`, `closeModal`. Then write the selector hook a component would use to read just `isOpen` without subscribing to action references.

**Completion check:** You understand why Zustand exists alongside Context and TanStack Query, and you can identify which one fits each use case. Quick test — which would you use for:
- The current user's session (Context)
- A list of marketplace listings from Supabase (TanStack Query)
- "Is the filter sheet open" across two screens (Zustand)
- The currently-typed text in a search input (`useState`, screen-local)

---

## End-of-phase exit criteria

- [ ] All 8 tracks marked complete
- [ ] Architecture document committed to repo at `docs/01-architecture.md`
- [ ] Screen sketches: at least the 16 Priority 1 screens drawn (see screen sketch order doc)
- [ ] You feel uncomfortable but ready. **You will not feel "fully ready." That's normal.** The plan says: comfort comes from doing.

When all of these are checked, Phase 0 is done and you may begin Phase 2 work (Collections list + create via TanStack Query). Phase 1 is already mostly complete from this session; the only remaining Phase 1 work is the vendor toggle flow in profile settings, which can be done as the first warmup task in Session 2.

---

## Resources index (one-stop)

**Docs:**
- React: [react.dev/learn](https://react.dev/learn)
- React Native: [reactnative.dev](https://reactnative.dev)
- Expo Router: [docs.expo.dev/router](https://docs.expo.dev/router)
- Supabase: [supabase.com/docs](https://supabase.com/docs)
- TanStack Query: [tanstack.com/query/latest](https://tanstack.com/query/latest)
- Zustand: [github.com/pmndrs/zustand](https://github.com/pmndrs/zustand)
- TypeScript + React Cheatsheet: [react-typescript-cheatsheet.netlify.app](https://react-typescript-cheatsheet.netlify.app)

**YouTube channels (from the study plan):**
- Notjust.dev (Vadim Savin) — practical RN tutorials
- William Candillon — animations (Phase 10 polish)
- Catalin Miron — RN UI patterns
- Theo (t3.gg) — TypeScript, sharp takes
- Beyond Fireship — quick concept intros
- Matt Pocock — TypeScript depth

**Communities:**
- Expo Discord (join now, lurk during Phase 0)
- r/reactnative, r/SideProject
