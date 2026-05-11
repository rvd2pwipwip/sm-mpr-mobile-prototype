# Search & Browse — implementation plan (prototype)

Teaching-oriented guide for building the **Search** tab: **Browse** (music, podcasts, radio) plus **Search** (live query, result swimlanes, More grids). Turns product intent, **Integration notes**, and Figma anchors into **ordered work** aligned with patterns you already ship (Home swimlanes, **SwimlaneMore**, **ScreenHeader**, **PodcastUserStateContext**, fixed footer stack).

**Companion docs**

- Story + **Integration notes:** [`docs/Stories/Search-story.md`](../Stories/Search-story.md)
- Podcasts browse detail (conditional rows, card sizing): [`docs/Stories/Podcasts-story.md`](../Stories/Podcasts-story.md), [`Podcasts-implementation-plan.md`](Podcasts-implementation-plan.md) (Phase 7)
- **Radio Browse (detailed):** [`Radio-Browse-implementation-plan.md`](Radio-Browse-implementation-plan.md)
- Figma index: [`docs/figma-nodes.md`](../figma-nodes.md)
- Living repo plan: [`plan.md`](plan.md) — update when this slice ships
- Layout patterns: [`docs/react-learning.md`](../react-learning.md) (swimlanes, BottomNav), project rules in `.cursor/rules/stingray-music-prototype.mdc`

**Prototype scope**

- **Fake data only**; search is **client-side string match** over catalog + stub **artist** records (see Phase 5).
- **No** Home-style header on this tab: **minimal chrome** per Integration notes (no Upgrade, provider logo, or centered brand).

---

## Design spec coverage (what we have vs what to pull live)

| Source | What it gives you |
|--------|-------------------|
| **`docs/figma-nodes.md`** | Canonical **screen** URLs for Search & Browse **150+** / **1000+**, **radio** browse + **International** drill-down, **Search results**, **Subfilter grid**, **View More grid**; frame size **460×990** |
| **`docs/Stories/Search-story.md`** | Narrative + **locked** browse vs search behavior, reset rules, header modes, keyboard/footer, full radio IA |
| **Figma MCP** (`get_design_context` / screenshot) | Typography, spacing, tab/search field specs—use when building each phase; MCP output is **reference**, map to **`index.css`** tokens |

**Gap to expect:** Music **1000+** browse adds **vibe** / **tag** taxonomy (UI: **Genre, Activity, Mood, Era, Theme** plus their **tag** subcategories — see **Search-story** Integration notes) that is **not** fully modeled in `musicChannels.js` today beyond per-channel **`tags[]`**; plan assumes you **extend mock data** for browse trees (Phase 2).

---

## Figma anchors (read + implement)

| What | Node / URL | Notes |
|------|------------|--------|
| Search & Browse (limited lineup ~150) | `270:45400` — [link](https://www.figma.com/design/duguG08ZOCWXQemLw59XJW/UX-SM-MPR-Mobile-2604?node-id=270-45400) | Music: genre grid at top level |
| Search & Browse (broad lineup ~1000+) | `19553:131521` — [link](https://www.figma.com/design/duguG08ZOCWXQemLw59XJW/UX-SM-MPR-Mobile-2604?node-id=19553-131521) | Music: five top categories + subfilters |
| Search results (swimlanes) | `61:26534` — [link](https://www.figma.com/design/duguG08ZOCWXQemLw59XJW/UX-SM-MPR-Mobile-2604?node-id=61-26534) | **Channels, Artists, Podcasts, Episodes, Radio** in file; product adds **Tags** (vibe tag matches — spec in **`Search-story`**, not in this frame) |
| Subfilter / deep browse grid | `49:332563` — [link](https://www.figma.com/design/duguG08ZOCWXQemLw59XJW/UX-SM-MPR-Mobile-2604?node-id=49-332563) | Reuse for music drill-down tiles |
| View More grid (vertical 2-col) | `23:17518` — [link](https://www.figma.com/design/duguG08ZOCWXQemLw59XJW/UX-SM-MPR-Mobile-2604?node-id=23-17518) | Align **Search result “More”** with **SwimlaneMore** patterns |
| Browse / Podcasts body | `19805:39266` — [link](https://www.figma.com/design/duguG08ZOCWXQemLw59XJW/UX-SM-MPR-Mobile-2604?node-id=19805-39266) | Conditional rows + category grid (~175px cards, **30px** gap, **`--space-content-inline`**) |
| Search & Browse, **radio** | `19868:32686` — [link](https://www.figma.com/design/duguG08ZOCWXQemLw59XJW/UX-SM-MPR-Mobile-2604?node-id=19868-32686) | Top-level radio tiles (Near You, International, formats) |
| **Browse Radio International** | `19676:35051` — [link](https://www.figma.com/design/duguG08ZOCWXQemLw59XJW/UX-SM-MPR-Mobile-2604?node-id=19676-35051) | Continent chooser; continent artwork may mirror [InCar continent graphics](https://www.figma.com/design/sMhTukUlNNedadBSyRnOq5/SM-HTML-InCar-MPR?node-id=13515-37235) (`13515:37235`) |
| **Browse International Subregion** | `19871:33556` — [link](https://www.figma.com/design/duguG08ZOCWXQemLw59XJW/UX-SM-MPR-Mobile-2604?node-id=19871-33556) | **Combo layout:** horizontal **Popular in this region** swimlane + **pill** buttons for the next geo level(s) |
| Shared components | `19777:32024` Miniplayer, `19586:136643` Episode Card | Episode **single-column** grid in More where story requires |

---

## Locked product rules (from Integration notes)

Implement these (see **Search-story** Integration notes for nuance on **Reset**):

1. **First character typed** → replace **entire** Browse UI **and** **Music / Podcasts / Radio** tabs; show **only** search field (hugging height) + result swimlanes (**Channels**, **Artists**, **Tags**, **Podcasts**, **Episodes**, **Radio** — only populated lanes). Result categories **≠** content-type tabs; **do not** filter results by the browse tab the user was on.
2. **Reset to Browse** depends on **how** the user leaves search mode (see **Phase 7**): **Clear** keeps the current **Music / Podcasts / Radio** tab and strips **`?q=`** only; **BottomNav Search** (**`to="/search/music"`**) and **leave tab + tap Search again** always land on **Music** with an empty field (**`/search`** redirects to **`/search/music`**).
3. **Header** height is **adaptive**; **remeasure** and update **scroll padding** when switching browse ↔ search mode (same philosophy as **`HomeHeader`** + **`--home-header-offset`** on Home—consider a **`--search-header-offset`** or generic `--top-fixed-chrome-offset` set from `ResizeObserver` / `useLayoutEffect`).
4. **Keyboard** **overlaps** bottom chrome (miniplayer, visual ads, tabs)—no requirement to pin footer above keyboard in v1.
5. **Radio** Browse targets **full** geo + format story (Near You, International hierarchy, News/Talk/Sports/Public/Religion)—align **`radioStations.js`** over time; staged data is OK if UX structure is right (**`figma-nodes.md`** radio section + **Search-story**).

---

## Code you will reuse

| Piece | Location | Use on Search |
|--------|-----------|----------------|
| **Swimlane row** | `ContentSwimlane.jsx` + CSS | Home parity: inset title + **More**, horizontal cards, inner `padding-inline` token |
| **More grid** | `SwimlaneMore.jsx` + CSS | Copy pattern for **Search More** or **generalize** with a `variant` + data prop |
| **Cards** | `MusicChannelCard`, `PodcastCard`, `RadioStationCard`, **`EpisodeCard`** | Result tiles; episodes may need compact row variant for swimlane |
| **ScreenHeader** | `ScreenHeader.jsx` | **Search More** deep screens (back, title =lane name) |
| **Shell + scroll** | `app-shell`, `app-shell--footer-fixed`, `app-shell-footer-scroll`, `--footer-stack-scroll-padding` | Same as **Search.jsx** stub, **ListenAgainMore**, **SwimlaneMore** |
| **Podcast library stubs** | `PodcastUserStateContext` | Browse: **Your Podcasts**, bookmarks, downloads, **continue listening** derivation |
| **Routes** | `App.jsx` | **`/search` → `/search/music`**, **`/search/music` \| `podcasts` \| `radio`**, browse trees under **`/search/browse/...`**, **`/search/more/catalog`**, **`/search/more/tags`**, … |

---

## Phase 0 — Territory / lineup mode (stub) ✅ (prototype)

**Goal:** Drive **150+** vs **1000+** music browse without a real geo-IP API.

**Shipped behavior**

- **Tutorial (step-by-step + diagram):** [`Music-lineup-tutorial.md`](Music-lineup-tutorial.md).
- **`TerritoryProvider`** (`src/context/TerritoryContext.jsx`) exposes **`musicLineupMode`**: **`limited`** | **`broad`**, plus **`setMusicLineupMode`** and **`toggleMusicLineupMode`**. Labels/helpers live in **`src/constants/musicLineup.js`**.
- **`App.jsx`** wraps the app with **`TerritoryProvider`** (inside **`UserTypeProvider`**) so any screen can read lineup mode.
- **Demo / easter egg (prototype only — not for end product):** On **`Search`**, the **Music** content-type tab uses **`onClick`**: if **Music is already selected**, the click **toggles** **`musicLineupMode`**; otherwise it selects Music. Lets designers demo both Figma variants (**`270:45400`** vs **`19553:131521`**) without a settings screen.

**Deliverable:** Later phases call **`useTerritory()`** to branch music browse; **limited** → top level = **`MUSIC_GENRES`** tiles; **broad** → top level = five **vibes** (Genre, Activity, Mood, Era, Theme) + nested **tag** routes.

---

## Phase 1 — Search shell: fixed adaptive header + browse body scaffold ✅ (prototype)

**Goal:** **Minimal** top stack (**search field** always; **content-type tabs** only in browse mode), scrollable body below.

**Shipped**

1. **`main.app-shell.app-shell--footer-fixed.search-page`** + **`search-page-scroll`** with **`padding-bottom: var(--footer-stack-scroll-padding)`** and **`padding-top: calc(var(--search-header-offset) + var(--search-header-scroll-gap))`** (**`index.css`**).
2. **`SearchBrowseHeader`** (`src/components/SearchBrowseHeader.jsx` + `.css`) — **not** `HomeHeader`: frosted fixed bar, **`/search.svg`** in field, clear control when non-empty, tabs when **`showBrowseTabs`**.
3. **`useSearchBrowseHeaderOffset`** (in same file) — **`ResizeObserver`** publishes **`--search-header-offset`** on **`<html>`**; **removeProperty** on unmount (mirrors **`HomeHeader`**).
4. **Search.jsx** — **`query`**, **`browseTab`** from pathname; **`showBrowseTabs`** = **`query.trim().length === 0`**; **search mode** = non-empty trim → tabs hidden. **Clear** → empty field, browse again, **same** content-type route (**`/search/music`**, **`/search/podcasts`**, **`/search/radio`**); strips **`?q=`** only (does **not** force Music). Debounced query is mirrored to **`?q=`** so **Back** from More / detail restores results.
5. **`BROWSE_TABS`** exported from **`SearchBrowseHeader`** for a single tab list.

**Deliverable:** Browse body placeholders per tab; header height remeasures when switching browse ↔ search.

---

## Phase 2 — Music Browse (150+ and 1000+) ✅ (prototype)

**Limited lineup (150+ path)**

- Top grid: **one tile per genre** (`MUSIC_GENRES`) → **`/search/browse/music/category/:categoryId`** → 2-col **`MusicChannelCard`** grid → **`/music/:id`**.
- **Code:** **`Search.jsx`** (limited tiles) + **`SearchMusicCategory.jsx`**.

**Broad lineup (1000+ path)**

- Top grid: five **vibes** (**`BROAD_VIBES`** in **`musicBrowseTaxonomy.js`**) → **`/search/browse/music/vibe/:vibeId`** → **tags** (**`getChildTagsForBroadVibe`**).
  - **Genre** vibe: same genre rows as limited → **`/search/browse/music/category/:id`**.
  - **Activity / Mood / Era / Theme:** prototype **tag** rows (labels matched via **`getMusicChannelsWithTag`**) → **`/search/browse/music/vibe/:vibeId/tag/:tagSlug`** → **`SearchMusicBroadTagChannels.jsx`**.
- **Code:** **`Search.jsx`** (broad tiles) + **`SearchMusicVibe.jsx`** + **`SearchMusicBroadTagChannels.jsx`** + **`SearchBrowseTile`**.

**Shared**

- **`musicBrowseTaxonomy.js`** — vibes, non-genre tag tables (aligned with real **`channel.tags`** where possible).
- **Figma:** **`270:45400`**, **`19553:131521`**, **`49:332563`** (reference; tiles are stub layout).

**Deliverable:** Search tab → music tiles → channel list → **Channel Info** ✓

---

## Phase 3 — Podcasts Browse ✅ (prototype)

**Goal:** Match **Browse / Podcasts** story + **Podcasts-implementation-plan** Phase 7.

**Shipped**

- **`SearchPodcastsBrowse.jsx`** — when **Search** browse tab is **Podcasts**: one **`SearchBrowseTileGrid`** — populated **library** tiles (**Continue listening**, **Your Podcasts**, **Your Episodes**, **New Episodes**, **Downloaded Episodes**), each with **label + light `search-browse-tile__inline-count` digit**, sit **before** catalog **`PODCAST_CATEGORIES`** tiles at the **same** grid level; library tiles → **`/search/browse/podcasts/library/:librarySection`**.
- **`SearchPodcastsLibrary.jsx`** — library drill-down: **episode** shelves use a vertical **`EpisodeCard`** stack; **Your Podcasts** uses the same 2-col **`PodcastCard`** grid as category browse.
- **`SearchPodcastsCategory.jsx`** — 2-col **`PodcastCard`** grid (**`SwimlaneMore.css`**) → **`/podcast/:id`**.
- **`App.jsx`** — **`/search/browse/podcasts/library/:librarySection`** (register **before** **`/search/browse/podcasts/category/:categoryId`**).
- **`podcastSearchLibrary.js`** — slug constants + **`podcastLibraryBrowsePath()`**.

**Figma:** **`19805:39266`**.

**Deliverable:** Podcasts tab matches product story; tiles navigate to real show screens ✓

---

## Phase 4 — Radio Browse (full IA)

**Goal:** **Search-story** radio hierarchy (geo + format), with **International** screens that match **Browse International Subregion** — not a flat “International” list as the final UX.

**Figma (mobile):** **`19868:32686`** (radio top level), **`19676:35051`** (International / continents), **`19871:33556`** (subregion: popular swimlane + geo pills). **Line-by-line plan:** [`Radio-Browse-implementation-plan.md`](Radio-Browse-implementation-plan.md).

**Layouts**

- **Top level (`/search/radio`):** tiles **Near You**, **International**, **News**, **Talk**, **Sports**, **Public**, **Religion** — order per **`19868:32686`**.
- **International — continent list:** tile/grid of continents (art/icons: optional export from InCar **`13515:37235`** — see Radio tutorial).
- **International — every geo level after a continent:** **combined screen** — (1) **`ContentSwimlane`** (or equivalent) with a **sample of the most popular** stations **in the current region**; (2) **pill-shaped** controls for **child geo** (countries, provinces, cities, …) when children exist. No children at the deepest leaf → swimlane can still show popular stations; full catalog can be a **More** grid or vertical list as a follow-up.
- **Near You & format categories:** station surfacing sorted with deterministic **popularity** mock order (same spirit as subregion swimlane).

**Mock data (prototype v1)**

- Full **International** tree is **not** required on day one. Implement **one** reference path only: **North America → Canada → Alberta → cities** (plus stations tagged to that path for the swimlane). Other continents/countries may render as **disabled**, **“coming soon”**, or omitted until data exists — decide in implementation; document the choice in the Radio tutorial.
- **`radioStations.js`** / **`RADIO_STATIONS`** may stay the flat catalog for Home & Phase 5 search; prefer a **`radioBrowseTree.js`** (or similar) for geo hierarchy + **`intlPopularityRank`** (or equivalent) for “popular in region.”

**Deliverable:** User can open **Radio** on Search, reach **International**, drill **North America → Canada → Alberta → city**, see **popular swimlane + pills** at each step data supports; station taps go to **radio** detail / tune **stub** when that route exists.

---

## Phase 5 — Search (query + swimlanes)

**Goal:** **`61:26534`** behavior + **Tags** swimlane (**Search-story**; not in legacy Figma).

**Query UX**

- Focus shows keyboard; **clear** replaces search icon when non-empty (story).
- **Live** search: debounce ~150–300ms optional; filter runs on **`MUSIC_CHANNELS`**, **`PODCASTS`**, episodes (flatten from shows), **`RADIO_STATIONS`**, plus **Artists** source.

**Artists lane**

- **No** artist browse in app; add **`src/data/musicArtists.js`** (or `artistNames` on channels) with `{ id, name, thumbnail?, representativeChannelIds[] }` for **client-side** matching. Tapping an artist can navigate to **`/music/:channelId`** (first rep) or a tiny **artist** stub screen—decide in Phase 5; **simplest:** land on first channel.

**Tags lane**

- Match query against **vibe tag** strings on channels (**`channel.tags`** — same labels as **Channel Info** `.music-info__tag`). **More** → **`/search/more/tags?q=`** (see **Phase 6** partial ship).

**Swimlanes**

- Reuse **`ContentSwimlane`** per populated category: **Channels, Artists, Tags, Podcasts, Episodes, Radio**.
- **Episode** swimlane: use **`EpisodeCard`** or list row; cap visible count + **More** when over limit (story).

**Deliverable:** Typing filters catalog; clearing returns to Browse on the **preserved** content-type tab (strip **`?q=`** only).

---

## Phase 6 — Search More + navigation ✅ (prototype)

**Goal:** **More** on each result lane → vertical grid like **`SwimlaneMore`** / **`23:17518`**; **episodes** **single-column** where story says.

**Shipped (prototype slice)**

- **`SearchTagsMore.jsx`** at **`/search/more/tags?q=`** — 2-col **`MusicChannelCard`** grid for all channels sharing a **vibe tag** ( **`getMusicChannelsWithTag`** in **`musicChannels.js`**). **Channel Info** `.music-info__tag` navigates here (equivalent to Search → **Tags** **More**).
- **`SearchCatalogMore.jsx`** at **`/search/more/catalog?lane=&q=`** — one route for **Channels, Artists, Tags, Podcasts, Episodes, Radio** **More** grids; **`lane`** picks the list. **`q`** is the same search string as on **`/search/{music|podcasts|radio}?q=`** so the stack stays consistent.

**Deliverable:** More screens show full filtered lists; **Back** (**`navigate(-1)`**) pops to the prior history entry — typically **`/search/...?q=...`**, so the search field + swimlanes return without relying on ephemeral **`location.state`**.

---

## Phase 7 — Reset + BottomNav integration ✅ (prototype)

**Goal:** Document **implemented** reset behavior (**`Search.jsx`** + **`BottomNav.jsx`**); matches **`docs/Stories/Search-story.md`** Integration notes.

1. **Clear** (header control or empty field) → **`query` ''**, **`?q=`** removed, browse mode (**tabs visible**); pathname stays **`/search/music`** | **`/search/podcasts`** | **`/search/radio`** — **preserve** whichever tab the user had.
2. **BottomNav Search:** **`NavLink`** **`to="/search/music"`** (no **`?q=`**). From **Home**, **Info**, or any non-Search route, tap **Search** → **Music**, empty field (**`/search`** index route **redirects** to **`/search/music`** — there is **no** long-lived **`/search`** screen). Returning from another main tab does **not** need a **`useEffect`** reset: mounting **`/search/music`** plus missing **`q`** yields browse.
3. **Re-tap Search while Search is active:** **`to`** is always **`/search/music`** (path-only — no search string). Examples: **`/search/podcasts?q=foo` → `/search/music`** clears query **and** switches to Music (navigation happens because path or search differs from target). **`/search/music?q=foo` → `/search/music`** drops **`q`** (**`replace`** is not required on BottomNav — default **push** is fine for the prototype). If the user is already on **`/search/music`** with no **`q`** and taps **Search**, **React Router** treats it as **same destination** → **no** navigation; UI is already reset. **No** **`onClick`**, **`pathname === '/search'`**, or **`resetSearchBrowse()``** helper — not applicable with **`/search` → `/search/music`** routing.

**Deliverable:** Clear vs **BottomNav Search** behaviors are distinct and predictable; **URL** carries **`?q=`** while searching so **Back** from deeper screens still works together with **Phase 6**.

---

## Phase 8 — Polish + docs

- **`plan.md`**: move **Search & Browse** to **What we have done** when acceptance passes.
- **`docs/react-learning.md`**: short entry on **adaptive fixed header** + **Search reset** pattern if non-obvious.
- **Acceptance checklist (manual)**
  - [ ] Limited vs broad music top level matches territory stub.
  - [ ] Podcast conditional rows hide when empty.
  - [ ] Radio hierarchy navigable through at least one full path to stations.
  - [ ] Search replaces browse chrome; swimlanes include **Tags**; Artists shows when query hits stub artists.
  - [ ] More grids + back behavior correct.
  - [ ] Reset: **Clear** restores browse with **same** content-type tab; **BottomNav Search** / leave tab + tap Search restores **Music** + empty query.
  - [ ] Footer stack + keyboard overlap acceptable; miniplayer still usable after dismiss keyboard.

---

## After you ship

- Update **`plan.md`** and **`docs/figma-nodes.md`** only if node map or data notes materially change.
- Keep **podcast** and **radio** player stacks aligned with **`visual-ads-and-user-types.md`** when users tune from Search surfaces.

---

*Last updated: 2026-05-08* — **Phase 6 / 7** doc sync: **`/search/more/catalog`**, **`?q=`** on search-tab URLs, **Clear** preserves content-type tab, **BottomNav** **`to="/search/music"`** replaces older **`onClick` / `/search`** notes. **Docs:** implementation plans live under **`docs/Plans/`**. **Phase 4** radio: **Figma** anchors (**`19868:32686`**, **`19676:35051`**, **`19871:33556`**), **International subregion** pattern walkthrough [`Radio-geo-subregion-swimlane-pills-tutorial.md`](../Tutorials/Radio-geo-subregion-swimlane-pills-tutorial.md) + [**`Radio-Browse-implementation-plan.md`**](Radio-Browse-implementation-plan.md). **Phase 3** podcasts browse shipped earlier.
