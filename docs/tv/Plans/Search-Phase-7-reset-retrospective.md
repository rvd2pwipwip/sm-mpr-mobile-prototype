# Search Phase 7 reset — retrospective (TV + mobile)

Living notes on why **Search reset / PrimaryNav integration** (Phase 7) was hard to ship, what broke in both prototypes, what we tried, and what might work later.

**Related plans**

- TV: [`Search-Browse-implementation-plan.md`](./Search-Browse-implementation-plan.md) — Phase 7
- Mobile: [`docs/mobile/Plans/Search-Browse-implementation-plan.md`](../../mobile/Plans/Search-Browse-implementation-plan.md) — Phase 7
- Product rules: [`docs/mobile/Stories/Search-story.md`](../../mobile/Stories/Search-story.md) — Integration notes (Clear vs BottomNav vs re-tap)

**Status (prototype, 2026-06-09):** Phase 7 is **partial**. **Clear**, **stored browse tab**, and **enter Search from Home/Library** work. **Re-tap Search while already on `/search*`** (reset to Music + empty field) is **not implemented**; it caused browse/results flicker on TV and mobile. URL hydration race fixes remain in **`Search.jsx`** on both apps.

---

## What Phase 7 was supposed to do

Phase 7 defines **three different ways** to leave "search mode" (typed query + results) and return to browse — not one button, three behaviors:

| User action | Query (`?q=`) | Browse tab (broad) |
|-------------|---------------|---------------------|
| **Clear** (in header) | Empty | **Keep** current Music / Podcasts / Radio |
| **Main nav Search** from Home or Library | Empty | **Last stored** tab (`sessionStorage`) |
| **Re-tap Search** while already on `/search*` | Empty | **Always Music** (product story) |

Mobile shipped this first via **`BottomNav`** (`onClick` + `navigate`). TV mirrored it in **`PrimaryNav`** (D-pad / Enter on Search). Both apps share the same **Search shell** ideas: `query` + `debouncedQuery`, `?q=` on the URL, and **`writeStoredBroadSearchBrowseTab`** on broad shell paths.

---

## Why "just reset the screen" is not one step

"Initial state" is not a single value. For Search to look and behave fresh, all of these must agree:

| Layer | Examples |
|-------|----------|
| **URL** | `/search/music` vs `/search/podcasts`; `?q=` present or not |
| **React state** | `query` (instant UI mode) vs `debouncedQuery` (results + URL writer; 250ms delay) |
| **UI mode** | Browse swimlanes vs result swimlanes (`isSearchActive` follows **`query`**, not `debouncedQuery`) |
| **Storage** | `sessionStorage` last browse tab |
| **TV only** | Focus groups, screen memory, vertical parked scroll `screenId` (`search-browse-podcasts` vs `search-results`) |

Re-tap changes **pathname and query at once** while **`Search.jsx` usually stays mounted** (same route component, new history entry). Local state does not automatically clear when the URL changes.

---

## Root cause: two writers for the same field

Both prototypes use the same pattern in **`Search.jsx`**:

1. **Hydrate from URL** when history changes (`location.key`) — reload `query` / `debouncedQuery` from `?q=`
2. **URL sync** — when `debouncedQuery` changes, `navigate(..., { replace: true })` to update `?q=`

That is correct for **typing** and **Back/Forward**. It breaks on **external navigation** that clears `?q=` (re-tap reset, or navigate to Music with empty search) when:

1. Navigate runs with `search: ""` but **React state still holds the old query** for one or more renders.
2. **Hydrate** ran in **`useEffect`** (after paint), **after** URL sync could already run with **stale `debouncedQuery`** and write `?q=` back.
3. **`query`** becomes empty → **browse UI**; URL or **`debouncedQuery`** still has the term → **results UI** — visible **flicker** between modes.

On **TV**, focus **layout effects** also react when browse tabs hide/show. Rapid mode changes contributed to **`Maximum update depth exceeded`** (infinite `setFocusedGroupIndex` loops) during some reset attempts.

**Mobile** has the same URL/state split but no TV focus stack; the user-visible symptom was the same **browse ↔ results flicker** when re-tapping Search on the bottom nav.

---

## How mobile was affected

Phase 7 was designed on **mobile** first:

- **`BottomNav.jsx`** — `NavLink` `to` = stored tab; **`onClick`** on re-tap called `preventDefault`, `writeStoredBroadSearchBrowseTab('music')`, and `navigate({ pathname: '/search/music', search: '' })`.
- **`Search.jsx`** — same `stackKey` + debounce + URL-sync effects as TV.

So the **re-tap rule lived in the nav layer**, but the **bug lived in Search state/URL sync** shared by both apps. Fixing TV alone would not fix mobile if BottomNav still forced a reset navigate. Conversely, removing re-tap only in TV left mobile broken until both were aligned.

**Still shared and working (not re-tap):**

- **`resolveBroadSearchBrowseTab`** / **`writeStoredBroadSearchBrowseTab`** — remember tab across Home ↔ Search
- **`/search`** redirect to stored tab (broad)
- **Clear** — empty field, keep tab, strip `?q=` via `handleQueryChange`

---

## What we tried (and how it failed)

### 1. Inline re-tap navigate (original Phase 7)

**TV `PrimaryNav` / mobile `BottomNav`:** navigate to `/search/music` + `search: ""`.

**Result:** Flicker; on TV sometimes **blank `#root`** / React crash from focus effects + state churn.

**Why:** Stale `debouncedQuery` rewrote `?q=` before hydrate cleared local state.

---

### 2. Extra reset logic inside `Search.jsx`

**Approaches:**

- `location.state.searchShellReset` + `useLayoutEffect` to clear `query`, focus, and call `navigate` again to clear state
- **`sessionStorage`** one-shot flag (`consumeSearchShellResetPending`)
- Move reset to **`useEffect`** instead of **`useLayoutEffect`**

**Result:** Crashes (update depth) or continued flicker; clearing state in Search **added a third writer** alongside URL sync and nav.

**Why:** Fighting the existing sync loop instead of fixing ordering; focus layout effects re-fired on every mode oscillation.

---

### 3. `searchNavReset.js` + `activatePrimaryNavSearch`

Centralized enter vs re-tap in a helper used by **`PrimaryNav`**.

**Result:** Same underlying race; harder to reason about because reset was split across nav + Search + storage.

---

### 4. `SearchShell.jsx` — remount on reset

**Idea:** `location.state` nonce → change React **`key`** on **`Search`** so `useState` re-initializes from empty URL (single source of truth).

**Result:** Remount helped state but **screen memory** (TV focus) persisted; still needed focus reset; combined with other effects was fragile. Session abandoned in favor of simpler mitigations.

**Hint for future:** Remount + clear **`search` screen memory** in one atomic step can work if done deliberately.

---

### 5. Remove re-tap only (no URL fix)

**Idea:** Re-tap Search = **no-op** (stay on current results / tab).

**Result:** Flicker **still reported** at last committed TV build because **any** history navigation that cleared `?q=` could trigger the same race (not only re-tap).

**Lesson:** Re-tap removal is a **product workaround**, not a full technical fix.

---

### 6. Hydrate in `useLayoutEffect` + skip one URL-sync pass (current mitigation)

**Changes (TV + mobile `Search.jsx`):**

- On **`location.key`** change, hydrate `query` / `debouncedQuery` from URL in **`useLayoutEffect`**
- Set **`skipUrlSyncRef`** so the next URL-sync **`useEffect`** does not write stale `debouncedQuery`
- Re-tap Search: **no navigate** while already on `/search*` (TV **`PrimaryNav`**, mobile **`BottomNav`**)

**Result:** Stops the flicker for the reported flow; **re-tap reset product rule** remains unimplemented.

**TV extras:** Safer focus-clamp when browse tabs hide; optional no-op guards in screen memory (when present).

---

## Current prototype behavior vs product story

| Rule | Product story | Prototype now |
|------|---------------|---------------|
| Clear | Empty field, keep tab | Works |
| Nav Search from Home/Library | Stored tab, empty `?q=` | Works |
| Re-tap Search on `/search*` | Music + empty field | **Not shipped** — no-op / stay on current screen |
| Persist tab on shell paths | `sessionStorage` | Works |

Use **Clear** when the goal is only to drop the query. Re-tap as "global Search reset" needs a future design pass.

---

## Directions to try later

Pick **one authoritative source of truth** per transition; avoid parallel `setQuery` + `navigate` + URL-sync in the same tick.

### A. URL-only reset (simplest)

- Re-tap = **one** `navigate({ pathname, search: '' }, { replace: true })`
- **No** `setQuery` in Search for reset
- Hydrate **only** from URL in **`useLayoutEffect`** (keep skip-url-sync guard)
- **Do not** remount unless necessary

### B. Remount + memory clear (TV-friendly)

- Wrapper route with `key={resetNonce}` on intentional reset
- On reset, clear **`search`** bucket in **`ScreenMemoryContext`** (focus + scroll)
- Good when focus graph changes radically between browse and results

### C. Shared hook (`packages/shared`)

Extract **`useSearchShellQuerySync`** used by TV and mobile so hydration order and guards stay identical. Reduces "fixed TV, broke mobile" drift.

### D. React Router data APIs

- Route **`loader`** returns `{ q }`; component derives query from loader data
- Or **`useSearchParams`** as the only write path for `?q=`
- Bigger refactor; best if Search shell is touched for other reasons

### E. Narrow re-tap without full reset

- Re-tap only **`enterContent()`** (current behavior) — document as intentional for prototype
- Or re-tap scrolls to top / focuses field **without** clearing query

### F. Testing checklist before calling Phase 7 done

1. Search → Podcasts → type query → results visible  
2. Main nav → Search (re-tap) — no flicker for 2+ seconds  
3. Same flow with **Back** and **Clear**  
4. TV: no focus loop in console; D-pad lands on search row when appropriate  
5. Mobile: bottom nav re-tap does not flash browse swimlanes over results  

---

## Files touched during Phase 7 work

| Area | Files |
|------|--------|
| TV nav | `apps/tv/src/components/nav/PrimaryNav.jsx` |
| Mobile nav | `apps/mobile/src/components/BottomNav.jsx` |
| Search shell | `apps/tv/src/pages/Search.jsx`, `apps/mobile/src/pages/Search.jsx` |
| Shared paths / storage | `packages/shared/constants/searchBrowsePaths.js` |
| Attempted (removed) | `apps/tv/src/utils/searchNavReset.js`, `apps/tv/src/routes/SearchShell.jsx` |
| TV focus | `apps/tv/src/hooks/useScreenContentFocus.js`, `ScreenMemoryContext.jsx` |

---

## Doc maintenance

When Phase 7 is re-attempted or permanently descoped:

- Update this file with the chosen approach and date
- Align **`Search-story.md`** Integration notes with prototype behavior or mark story as future
- Update Phase 7 section in TV and mobile **`Search-Browse-implementation-plan.md`**
- Append a short entry to **`docs/tv/react-learning.md`** and **`docs/mobile/react-learning.md`**
