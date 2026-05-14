# Plan: Catalog scope UX refactor (Home, navigation, Search, Browse)

This document captures the product intent for **broad** vs **limited** catalog scope, maps it to the current prototype (`CATALOG_SCOPE`, `TerritoryContext`, React Router), and proposes an implementation sequence.

**In-car sister UI (patterns are close; phone layout will differ):**

- [SM-HTML-InCar-MPR node 7508-322509](https://www.figma.com/design/sMhTukUlNNedadBSyRnOq5/SM-HTML-InCar-MPR?node-id=7508-322509)
- [SM-HTML-InCar-MPR node 7517-327527](https://www.figma.com/design/sMhTukUlNNedadBSyRnOq5/SM-HTML-InCar-MPR?node-id=7517-327527)
- [SM-HTML-InCar-MPR node 13501-31537](https://www.figma.com/design/sMhTukUlNNedadBSyRnOq5/SM-HTML-InCar-MPR?node-id=13501-31537)

---

## 1. Confirmation of intent (what you want to achieve)

### 1.1 Broad catalog

- **Entry:** App opens on **Home** (`/`) with the current hero: banner, then **music**, **podcasts**, and **radio** swimlanes.
- **Primary bottom navigation:** **Home**, **Search**, **My Library** (`BottomNav.jsx` when `catalogScope === broad`).
- **My Library:** **App Info**, **history**, and **user-driven content** swimlanes as today.
- **Search screen:** Combined **Search + Browse** under `/search/*` with content-type switcher. **Music** browse keeps **tag-style categories**: Genre, Activity, Mood, Era, Theme.

### 1.2 Limited catalog

- **No Home screen:** `/` does **not** show the broad Home layout (banner + mixed swimlanes).
- **Browse is the landing surface:** **`LimitedBrowse.jsx`** at **`/`** (or equivalent route).
- **No bottom navigation.** **Search** and **Info** are **only** in the **Browse header** (icons). **Mini player** rules stay the same as today: docked at bottom of the viewport or **above bottom visual ads** when ads are on (same stacking as broad).
- **Browse header (mobile layout -- stacked rows):** A single horizontal row is **too tight**. Use:
  1. **Row 1:** App **wordmark** -- **centered** (same prototype **lineup / catalog toggle** as broad **Home** wordmark tap).
  2. **Row 2:** **Upgrade** (same **pill** treatment as broad) **plus** **Search** and **Info** icons (Upgrade and icons share this row per your spec).
  3. **Then** any **banner** (or promo strip) **below** that chrome, then Browse body content.
- **Upgrade:** Shown for **guest + free tiers only** (hide for subscribed / equivalent).
- **Browse body:** **Stacked horizontal swimlanes** -- music by **genre**, podcasts by **topic**, radio by **format**; **user-driven content** appears **only** as **prepended swimlanes** on Browse (no separate My Library tab on limited).
- **Search:** Opens from **`/search`** (**single path** on limited for **bookmark hygiene**). **No** Music/Podcasts/Radio tabs. UI = **query field only** until the user types; **no** browse switcher, **no** browse cards or browse swimlanes in the empty state. After a query, show **search result swimlanes** below the field (reuse result presentation patterns from broad where it helps).

Together, limited scope is **full-screen Browse + header chrome + optional banner + stacked swimlanes**, with **Search** and **Info** as header actions and **no tab bar.**

---

## 2. Current prototype snapshot (baseline)

Already in the repo:

- **`catalogScope`** from **`musicLineupMode`** in `TerritoryContext.jsx` (`constants/catalogScope.js`).
- **`BottomNav`:** Broad = **Home + Search + My Library**. Today, **limited** still renders a third tab **Info** instead of My Library -- this will change to **hide `BottomNav` entirely** when `catalogScope === limited`.
- **`InfoRootRoute`:** `/info` redirects to `/my-library` when **broad**; **`Info.jsx`** hub when **limited** (header **Info** icon still uses **`/info`** after the refactor).
- **`Search` (`pages/Search.jsx`):** Browse tabs + query on one page; browse hides when query is non-empty.
- **`searchStackActive`:** Broad **BottomNav** highlights Search when path starts with **`/search`** or **`/radio`** (see below, section 8).

**Target delta:** Limited = **`LimitedBrowse.jsx` at `/`**, **`BottomNav` omitted**, Search page **fork** for limited UI, header-only **Search** / **Info**.

---

## 3. Information architecture (target routes)

### 3.1 Broad (minimal URL churn)

- **`/` -> Home** (current).
- **`/search/music`**, **`/search/podcasts`**, **`/search/radio`** -- combined Search/Browse (current).
- **`/my-library`** and **`/info/*`** as today.

### 3.2 Limited (resolved)

- **Landing:** **`/` -> `LimitedBrowse.jsx`** (not `Home.jsx`).
- **Browse vs drills:** Introduce **`/browse/*`** (or keep content-type under **`LimitedBrowse`** with internal state) for **Music / Podcasts / Radio** sections; taxonomy drill routes today under **`/search/browse/*`** should **resolve from Browse** on limited (either new **`/browse/...`** paths or aliases -- implementation detail in Phase C).
- **Search:** **Canonical URL `/search` only** on limited (**bookmark hygiene**; no `/search/music` etc.). Header link **`to="/search"`**. When scope is **limited**, **`<Navigate replace />`** from **`/search/music`**, **`/search/podcasts`**, **`/search/radio`** to **`/search`**, preserving **`search`** query params when applicable. **Broad** unchanged: **`/search/music`**, **`/search/podcasts`**, **`/search/radio`** with combined UI; default **`/search` -> `/search/music`** can stay for **broad** only.
- **`/info`:** Unchanged. Limited **Info icon** navigates here.

Player and entity deep links **`/music/*`, `/podcast/*`, `/radio/*`** unchanged.

---

## 4. Bottom navigation

### 4.1 Broad

- **Tabs:** Home | Search | My Library (unchanged).
- **`searchStackActive`, `homeStackActive`:** **Update as needed** when **`/radio`** playback or Browse routes change so the **Search** tab still reads correctly during radio flows (implementation task for broad only).
- **Mini player + ads:** Unchanged (player above tab bar / above nav strip ads when enabled).

### 4.2 Limited

- **No bottom navigation.** Remove or gate **`<BottomNav />`** when **`catalogScope === limited`** (same **`hideBottomNavForPath`** exclusions for fullscreen play / upgrade store if those routes still apply).
- **Search** and **Info** live only in **`LimitedBrowse`** header (and **Back** from Search returns to Browse, not to a tab).
- **Mini player:** Same visibility and **dock position** as broad (bottom of frame, or above bottom **visual ad strip** when `showVisualAds` applies). No tab bar under the player on limited.

---

## 5. UI components by scope

### 5.1 Wordmark / prototype toggle

- **Broad `HomeHeader`:** Wordmark tap toggles lineup (existing).
- **Limited `LimitedBrowse` header:** **Same toggle on wordmark tap** for broad vs limited demos.
- **Remove** the **Music double-tap** (or second tap) on the browse **content switcher** that toggles lineup in **`Search.jsx`** -- lineup changes **only** via **wordmark** after refactor.

### 5.2 Limited Browse chrome (`LimitedBrowseTopBar` or inline)

Stacked layout (narrow screens):

| Block | Content |
|-------|---------|
| Row 1 | **Wordmark**, centered; **tap = catalog toggle** |
| Row 2 | **Upgrade** pill (guest/free only) + **Search** icon + **Info** icon |
| Below | **Banner** (if present), then content-type switcher for Music/Podcasts/Radio and swimlane stack |

**Upgrade** matches **broad** pill styling; **omit** when user is not guest/free.

### 5.3 Search -- broad vs limited (same routes, different chrome)

| | Broad | Limited |
|---|--------|---------|
| **URLs** | **`/search/music`**, etc. (current) | **`/search` only** (Bookmark/share this path on limited; redirect off `/search/*` subpaths when limited) |
| **Header** | Search field + browse switcher | **Field only** -- no switcher |
| **Empty state** | Browse grids/cards/swimlanes | **No** browse UI -- empty or gentle prompt |
| **With query** | Current results panel | **Search result swimlanes** below field |

Implement as **`Search.jsx`** branching on **`catalogScope`**. **Limited:** only **`/search`**; **broad:** existing tab paths plus root redirect to **`/search/music`** as today.

**Routing note:** **`App.jsx`** must apply **scope-conditional** redirects (limited: **`/search/music` -> `/search`** with query preserved; broad: keep **`/search` -> `/search/music`** or equivalent).

### 5.4 Data for stacked swimlanes (Browse)

- **Music:** Per-genre swimlanes from **`MUSIC_GENRES` / `musicChannels.js`** (and taxonomy data).
- **Podcasts:** Per-topic swimlanes.
- **Radio:** Per-format swimlanes.

**Prepended user rows:** **`ListenHistoryContext`**, **`LikesContext`**, demo flags -- **Browse only** on limited.

---

## 6. Phased implementation plan

**Phase A -- Routing and entry**

1. Add **`LimitedBrowse.jsx`**; wire **`/`** when **`catalogScope === limited`**, broad keeps **`Home`**.

**Phase B -- Bottom nav**

2. **`App.jsx`:** Render **`<BottomNav />`** only when **`catalogScope === broad`** (or inverse: hide for limited). Adjust **padding-bottom** on **`app-shell`** for limited (no tab bar height — **still reserve** mini player + safe area + optional ad strip).

**Phase C -- Limited Browse**

3. **Header** (stacked rows, wordmark toggle, Upgrade visibility by **`useUserType`**, Search + Info icons).
4. **Stacked taxonomy swimlanes** for Music, Podcasts, Radio.

**Phase D -- Search fork**

5. **`Search.jsx`:** Limited branch -- **`/search` only**; **no** `SearchBrowseContentSwitcher` / browse chrome; **result swimlanes** when `q` present. **`App.jsx`:** limited redirects **`/search/music`**, **`/search/podcasts`**, **`/search/radio`** -> **`/search`** (preserve **`?q=`**).
6. Remove **lineup toggle** from **`Search`** Music tab interaction; document **wordmark-only** toggle in `TerritoryContext` comment.

**Phase E -- Docs**

7. **`docs/react-learning.md`** when you ask; **`docs/Plans/plan.md`** pointer.

---

## 7. Resolved product decisions (log)

| Topic | Decision |
|-------|----------|
| Landing component | **`LimitedBrowse.jsx`** at **`/`** (broad **`Home`** unchanged, no separate QA Home route) |
| Limited bottom nav | **None**; Search + Info **header-only** |
| Mini player | **Same rules** as broad; **dock bottom / above bottom ads** |
| Wordmark | **Prototype toggle** on limited and broad; **remove** Search Music **double-tap** toggle |
| Upgrade | **Guest + free only**; pill matches broad |
| Search URLs (limited) | **Canonical `/search` only**; redirect **`/search/*` tab paths** to **`/search`** when limited (bookmark hygiene) |
| Search URLs (broad) | **`/search/music`**, **`/search/podcasts`**, **`/search/radio`** as today |
| Search UI (limited) | **Field only** until query; then **result swimlanes**; **no** browse switcher or browse swimlanes when empty |
| Header layout | **Stacked:** centered wordmark row, then **Upgrade pill \| Search \| Info**, then **banner**, then body |
| Personal / library content (limited) | **Swimlanes on Browse only** |

---

## 8. IA clarifications (decided)

### 8.1 Single Search route, two layouts

**Context:** Broad shows **browse + search on one screen**. Limited uses **Browse** for taxonomy and **Search** for query-only.

**Decided:** **One `Search` route** (`Search.jsx`), with **`catalogScope`** choosing layout: **broad** = combined UI at **`/search/music`**, etc.; **limited** = **`/search` only** (single bookmarkable path) + **field + results swimlanes**. Share **hooks** (query sync, debounce, **`SearchResultsPanel`**). Do **not** fork into two unrelated Search apps.

### 8.2 `/` is one slot, two bodies

**Context:** "No Home" on limited does not remove the root URL.

**Decided:** **`/`** stays the **app entry**. **Broad** renders **`Home`**; **limited** renders **`LimitedBrowse`**. Same **slot**, **different** first screen. **Search** on limited is only **`/search`**; **broad** keeps **`/search/*` tab paths** under **`/search/music`**, etc.

### 8.3 Broad tab highlight during radio playback

**Context:** **`BottomNav`** ties **`searchStackActive`** to **`/search/...`** and some **`/radio/...`** paths so radio flows still feel under **Search** on **broad**.

**Decided:** **Maintain and adjust** that tab-highlight logic for **broad** whenever **`/radio`** playback routes or Browse-related paths change, so the **Search** tab stays correct during playback. **Limited:** no tab bar, so **no** change needed there.

---

## 9. Files likely touched (inventory)

| Area | Files |
|------|-------|
| Routes | `src/App.jsx` |
| Nav | `src/components/BottomNav.jsx` (render only when broad), **`App.jsx` shell padding** |
| Territory | `src/context/TerritoryContext.jsx` (comments; remove Search Easter-egg note for Music double-tap) |
| Search | `src/pages/Search.jsx`, `src/components/SearchBrowseHeader.jsx`, `src/constants/searchBrowsePaths.js` |
| New | **`src/pages/LimitedBrowse.jsx`**, header component + CSS, swimlane builders |
| Home | `Home.jsx` / `HomeHeader` -- broad only; optional **shared wordmark** extraction with **LimitedBrowse** if useful |

---

## 10. Success criteria (prototype-ready)

- **Territory / catalog scope** switches **broad** (Home + tabs + combined Search) vs **limited** ( **`LimitedBrowse` at `/`**, **no tab bar**, header Search/Info, forked Search page).
- Deep links **`/music/*`, `/podcast/*`, `/radio/*`** still work.
- **Swimlanes** follow **`--space-content-inline`** and **`SongSwimlane`** scroll pattern.
- **Upgrade** hidden for tiers where it should not show.
- **Wordmark** remains the **single** developer demo toggle for lineup (Music double-tap removed).

**No open IA items.** Plan is **ready for implementation**.
