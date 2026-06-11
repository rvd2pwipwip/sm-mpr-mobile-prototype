# Search & Browse — TV implementation plan (prototype)

Teaching-oriented guide for building the **Search** primary-nav destination in **`apps/tv/`**: **Browse** (music, podcasts, radio) plus **live Search** (result swimlanes, More grids). Adapts mobile product rules and IA to **TV layout**, **D-pad focus**, and the [Figma TV browse frame](https://www.figma.com/design/DfwtFG53ud7EHhvlPutvI8/SM-HTML-TV-MPR?node-id=15822-35859) (`15822:35859`).

**Companion docs**

- Mobile implementation plan (behavior reference): [`docs/mobile/Plans/Search-Browse-implementation-plan.md`](../../mobile/Plans/Search-Browse-implementation-plan.md)
- Product story + **Integration notes:** [`docs/mobile/Stories/Search-story.md`](../../mobile/Stories/Search-story.md)
- Catalog scope (broad vs limited Search fork): [`docs/mobile/Plans/catalog-scope-search-browse-refactor.md`](../../mobile/Plans/catalog-scope-search-browse-refactor.md)
- Content profile (music-only vs full MPR): [`docs/mobile/Plans/music-only-mvp-plan.md`](../../mobile/Plans/music-only-mvp-plan.md)
- TV focus / swimlanes: [`cards-and-swimlanes-implementation-plan.md`](./cards-and-swimlanes-implementation-plan.md), [`vertical-parked-navigation.md`](../vertical-parked-navigation.md) (spec), [`vertical-parked-navigation-plan.md`](./vertical-parked-navigation-plan.md) (QA log)
- Figma index: [`docs/tv/figma-nodes.md`](../figma-nodes.md)
- Living TV plan: [`plan.md`](./plan.md)

**Prototype scope**

- **Fake data only**; client-side string match (same rules as mobile `searchCatalog`).
- **Broad catalog territory first** for browse richness; **limited catalog Search** included (field-only shell, no content-type tabs).
- **Full content types** in browse + search lanes when **Full MPR** profile is on; **music-only** gating wired from day one (toggle on **`/settings/user-type`**).
- Podcast / radio **detail routes** may be **placeholder stubs** until those screens are designed; music routes reuse existing **`/music/:channelId`** stack.

---

## Locked decisions (stakeholder answers)

| Topic | Decision |
|-------|----------|
| **Music browse layout** | Match **Figma TV** + mobile **`SearchMusicVibeBrowseRail`**: stacked vibe sections (Genre, Activity, Mood, Era, Theme), each with **pill row** + **sub-tiles or channel row** below — **not** SMTV03 limited-Home filter pattern. |
| **Limited lineup (150+)** | Match **mobile** limited music browse (genre **tile grid**), not TV `LimitedHome` genre filter swimlane. |
| **Limited catalog scope** | Include now: canonical **`/search`** only; no Music/Podcasts/Radio tabs; empty state = field (+ optional hint copy); results when query non-empty. Redirect **`/search/music` \| `podcasts` \| `radio`** → **`/search`** when `catalogScope === limited`. |
| **Search field focus** | **D-pad group** in vertical stack; **Clear** focusable in **same header row** as the field. |
| **On-screen keyboard** | **Out of scope** for this prototype. **PC keyboard** enters text in the search field when focused. Production assumes an external OS keyboard service. |
| **Podcast / radio taps** | **Placeholder** screens (“coming soon” / “Not available in this build” when music-only blocks type) until full layouts ship. |
| **Search results** | Horizontal **result swimlanes** like mobile; Artists/Tags = **square label tiles** (new TV component); Channels/Podcasts/Radio = existing **`MusicChannelCard`** / **`ContentTileCard`**. |
| **PrimaryNav reset** | Same three rules as mobile **BottomNav** (see Phase 7). |
| **Shared modules** | Move **`searchBrowsePaths`**, **`searchCatalog`**, **`musicArtists`** into **`@sm-mpr/shared`** so music-only lane/tab gating stays in sync with mobile. |
| **Radio browse depth** | Same staged depth as mobile Phase 4 (reference geo path + format tiles). |
| **Content profile** | Wire **`useContentProfile()`** now; switch **Full MPR** ↔ **music-only** on **`/settings/user-type`**. |

---

## Design spec coverage

| Source | What it gives you |
|--------|-------------------|
| **Figma `15822:35859`** | TV **browse mode** layout: fixed header (field 80px, Clear), centered **Music / Podcasts / Radio** tabs, stacked **vibe rows** (title + pills + 308px tiles). Layout reference only — not exhaustive for search-results mode or podcasts/radio browse. |
| **Mobile Figma + MCP** | Podcasts browse (`19805:39266`), radio top level (`19868:32686`), search results (`61:26534`), More grids (`23:17518`) — **behavior and IA**; adapt to TV swimlanes and `ContentGrid`. |
| **`Search-story.md`** | Locked browse ↔ search rules, reset semantics, Tags lane spec, radio hierarchy. |
| **TV `figma-nodes.md`** | Home measurements (140px / 100px insets, 308px cards, 28px titles) — reuse for Search body. |

**Gap to expect:** No TV Figma frame for **search-results mode** yet — implement using TV Home swimlane patterns. No TV frames for podcasts/radio browse — follow mobile IA with TV focus grids.

---

## Figma anchors (TV file)

| What | Node / URL | Notes |
|------|------------|--------|
| Search & Browse — broad catalog (layout) | `15822:35859` — [link](https://www.figma.com/design/DfwtFG53ud7EHhvlPutvI8/SM-HTML-TV-MPR?node-id=15822-35859) | Header `15822:36992`, tabs `15822:37059`, Genre row `15827:37085`, Activity `15827:37362` |
| Home (token reference) | `15515:41291` | Content insets, card 308px, focus ring 10px |

**Mobile anchors** (IA + drill-down): see mobile plan table — podcasts, radio International, subfilter grids, search results.

---

## Locked product rules (from Search-story Integration notes)

Implement on TV unless a **TV-specific** note below says otherwise:

1. **First character typed** → hide **Music / Podcasts / Radio** tabs; browse body replaced by **result swimlanes only** (lanes gated by content profile).
2. **Reset to Browse** — **Clear** preserves active content-type tab + strips **`?q=`**; **PrimaryNav Search from Home/Library** → last stored browse tab; **re-tap Search on `/search/*`** → **Music** + empty query (see Phase 7).
3. **Adaptive header** — browse mode: field + tabs; search mode: **field + Clear only**. Remeasure fixed header → update scroll **`padding-top`** (TV: `--tv-search-header-offset` on `<html>` or page root, same idea as mobile `--search-header-offset`).
4. **No on-screen keyboard** in the TV prototype; D-pad moves focus; typing uses PC keyboard when the field has DOM focus.
5. **Minimal chrome** — no Home-style Upgrade row on Search (Upgrade stays on Home header).
6. **URL** — broad: **`/search/music` \| `podcasts` \| `radio`** + **`?q=`** while searching; limited: **`/search`** + **`?q=`** only.

---

## Code you will reuse (TV)

| Piece | Location | Use on Search |
|--------|-----------|----------------|
| **Fixed swimlane** | `MusicChannelSwimlane.jsx`, `ContentTileSwimlane.jsx` | Result lanes; music browse channel rows; radio “popular in region” |
| **Filter pills** | `FilterButton.jsx`, `GenreFilterSwimlane.jsx` (pattern) | Vibe pill rows inside each music browse section |
| **Variable horizontal row** | `VariableSwimlane.jsx` | Pill scroller + sub-tile row |
| **Square tiles** | `ContentTileCard.jsx`, `MusicChannelCard.jsx` | Channels, podcasts, radio; sub-genre tiles need **label-only** variant (centered text on 308px square per Figma) |
| **More grid** | `ContentGrid.jsx`, `SwimlaneMore.jsx` | Search More screens (4 columns at default TV tokens) |
| **Focus stack** | `useScreenContentFocus`, `useTvVerticalGroupScroll`, `KeyboardWrapper` | Vertical groups for header, tabs, browse rows, result swimlanes |
| **Territory** | `TerritoryContext` | `musicLineupMode` (limited vs broad), `catalogScope` |
| **Content profile** | `ContentProfileContext` | Tabs, lanes, placeholder copy |
| **Shared data** | `@sm-mpr/shared` | `musicChannels`, `musicBrowseTaxonomy`, `podcasts`, `radioStations`, radio browse tree (after mobile parity) |

**Do not reuse** mobile `ContentSwimlane` / `SearchBrowseHeader` — build TV-specific header and row components.

---

## Code to share with mobile (`@sm-mpr/shared`)

Move (or add) in **Phase 0** so both apps import the same helpers:

| Module | Proposed path | Notes |
|--------|---------------|--------|
| Browse paths + session keys | `constants/searchBrowsePaths.js` | Today in `apps/mobile/src/constants/` — re-export from mobile after move |
| Search matchers | `search/searchCatalog.js` | Today in `apps/mobile/src/search/` |
| Artist stubs | `data/musicArtists.js` | Today in `apps/mobile/src/data/` |
| Result lane ids | `constants/productProfile.js` | **Already shared** — `enabledSearchResultLanes()` |

Update `packages/shared/package.json` `exports`. Mobile imports switch to `@sm-mpr/shared/...` in the same PR or immediately after TV Phase 0.

---

## Phase 0 — Shared search modules + route scaffold ✅ (prototype)

**Goal:** TV routes and shared search helpers exist; placeholder page replaced by routable shell.

**Routes (`App.jsx`)**

- **Broad:** `/search` → redirect to **`/search/${resolveBroadSearchBrowseTab(enabledTypes)}`**; `/search/music`, `/search/podcasts`, `/search/radio`; browse drill routes under `/search/browse/...` (mirror mobile paths for parity); More: `/search/more/catalog`, `/search/more/tags`, etc.
- **Limited:** `/search` only; `<Navigate>` from `/search/music|podcasts|radio` → `/search` preserving `?q=` when present.
- **Placeholders:** `/podcast/:id`, `/radio/:id` (or `/radio/:id/play`) → stub component with profile-aware message.

**Shipped (2026-06-09)**

- **`@sm-mpr/shared`:** `constants/searchBrowsePaths.js`, `search/searchCatalog.js`, `data/musicArtists.js`, `data/radioInternationalBrowse.js` (+ `package.json` exports). Mobile paths re-export from shared.
- **Routes:** `/search` → `SearchIndexRedirect`; `/search/music` \| `podcasts` \| `radio`; `/search/browse/*`, `/search/more/*` stubs; `/podcast/:id`, `/radio/:id` → `TvContentTypeUnavailable`.
- **Limited:** `Search.jsx` redirects broad tab paths to `/search`.

**Deliverable:** Shared `searchCatalog` + `searchBrowsePaths` in package; TV `Search.jsx` reads `catalogScope` + `contentProfile`. ✓

---

## Phase 1 — Search shell: header, focus groups ✅ (prototype)

**Goal:** Fixed top chrome per Figma `15822:36992`; D-pad can reach field and Clear; typing works via PC keyboard (no OS keyboard overlay).

**Components**

- **`TvSearchBrowseHeader.jsx`** + CSS — frosted bar (`backdrop-blur`, `pl 140px`, `pr 100px`, `pt 75px`, `pb 30px`); field row (`gap 20px`); placeholder copy from profile (full: “Search channels, artists, podcasts or radio…”; music-only: “Search channels, artists or tags”).
- **`TvSearchField.jsx`** — `<input>` visually styled as Figma `field_md` (80px height, 20px radius); magnifying glass icon; receives **text input** when focused.
- **`TvSearchClearButton.jsx`** — Figma Clear (`80px` height, bordered); visible when query non-empty; activates clear handler.
**Focus rows**

| Group | Row | Left/Right | Up/Down |
|-------|-----|------------|---------|
| 0 | Search field, Clear | Within row | Down to tabs (browse) |
| 1 | Music / Podcasts / Radio tabs | Within row; Left on Music enters nav | Up to search row |

**Left** from search field → `PrimaryNav`.

**Header offset:** `ResizeObserver` → `--tv-search-header-offset`; scroll body `padding-top: calc(var(--tv-search-header-offset) + var(--tv-search-header-gap))` (gap ~50px to match Figma content `pt 230px` minus header stack).

**State (`Search.jsx`)**

- `query`, debounced `debouncedQuery` (~250ms), mirror to **`?q=`** on current path (`replace`).
- `showBrowseTabs = query.trim() === ''` && broad && `shouldShowBrowseContentSwitcher`.
- `isSearchActive = query.trim() !== ''`.
- Browser Back/Forward restores `?q=` (same `location.key` pattern as mobile).

**Shipped (2026-06-09)**

- **`TvSearchBrowseHeader`** + CSS — field, **Clear**, profile-aware placeholder, content-type tabs (`FilterButton`).
- **`Search.jsx`** — `?q=` sync, debounce, browse vs search mode, limited empty hint, Phase 5 results placeholder; two-row header focus (search row + browse tabs).
- **`--tv-search-header-offset`** via `ResizeObserver`; **`PrimaryNav`** search `to` + re-tap reset (Phase 7 partial).

**Deliverable:** Header + query sync; body placeholder; two-row header focus. ✓

---

## Phase 2 — Music Browse (broad + limited lineup) ✅ (prototype)

**Goal:** Music tab body matches Figma stacked vibe layout (broad) and mobile limited genre grid (150+).

### Broad lineup (`musicLineupMode === broad`)

- Stack **`TvSearchMusicVibeSection`** for each **`BROAD_VIBES`** entry (Genre, Activity, Mood, Era, Theme) — port logic from mobile **`SearchMusicVibeBrowseRail`**:
  - Section title (Roboto Black 28px).
  - **`VariableSwimlane`** of **`FilterButton`** pills (`getChildTagsForBroadVibe`).
  - Below: **sub-tiles** (genre subs: “All Pop”, …) as **label squares** (308px, centered 34px text) **or** **`MusicChannelSwimlane`** when row is leaf channels.
  - **More** tile when channel count > `SWIMLANE_CARD_MAX` (9 on TV).
  - Pill selection memory: reuse **`useCategoryRailMemorySlug`** (move hook to shared or duplicate thin TV hook with same storage keys).
- Each section = **one or two focus groups** (pills group, cards group) — document group map in component file.
- **Territory easter egg:** optional parity with mobile (toggle lineup on repeated Music tab click) — low priority; wordmark toggle already exists on Home.

### Limited lineup (`musicLineupMode === limited`)

- **Genre tile grid** like mobile limited top level (`MUSIC_GENRES` → `/search/browse/music/category/:id` or TV grid → More).
- **Not** the `LimitedHome` genre filter + single swimlane pattern.

**Drill-down routes (broad + limited)**

- Mirror mobile: `/search/browse/music/category/:categoryId`, `/search/browse/music/vibe/:vibeId`, tag routes, artist grid — implemented as TV **`ContentGrid`** pages with `ScreenMemory` + Esc back.
- Channel tap → **`/music/:channelId`** (existing).

**Deliverable:** Music browse navigable broad + limited; D-pad through pills, tiles, and channel rows; Esc pops drill-downs.

**Shipped (2026-06-09)**

- **`TvSearchMusicVibeSection`** + **`TvSearchMusicBrowseBody`** — broad: five vibe stacks (pills + sub-tiles or channel swimlane); limited: horizontal genre label row.
- **`TvSearchLabelTile`** (308px label square); **`CategoryRailMemoryProvider`** + **`useCategoryRailMemorySlug`** (TV port).
- **`buildSearchMusicBrowseFocusLayout`** — dynamic focus groups from header group **2** (`SEARCH_FOCUS.bodyStart`); **`useTvVerticalGroupScroll`** on browse body.
- **Drill routes:** `SearchMusicCategory`, `SearchMusicVibe`, `SearchMusicBroadTagChannels` via **`TvSearchBrowseDrillPage`** + **`ContentGrid`**.

---

## Phase 3 — Podcasts Browse ✅ (prototype)

**Goal:** Mobile **`SearchPodcastsBrowse`** IA on TV.

- Conditional **library** tiles (Continue listening, Your Podcasts, …) when stub data populated — same rules as mobile `PodcastUserStateContext` (wire context to TV if not already, or stub counts). **Deferred:** mobile top-level browse is category swimlanes only today; library rows can follow when TV mounts `PodcastUserStateContext`.
- **Category swimlanes** on the Podcasts tab — one **`ContentTileSwimlane`** per **`PODCAST_CATEGORIES`** row (capped + More).
- **Category drill** — **`ContentTileCard`** in **`ContentGrid`** at **5 columns** (`getTvBrowseGridLayout()`); card width computed to fit the content area (no horizontal scroll; focus moves L/R inside the row).
- Categories → `/search/browse/podcasts/category/:id`; show tap → **`/podcast/:id`** placeholder until Podcast Info ships.

**Focus:** Browse tab uses **`useTvVerticalGroupScroll`** (parked ring) per category swimlane. Drill grids register each grid row as a scroll group; horizontal navigation stays inside the row (`ContentGrid` boundary escape only at row edges).

**Shipped (2026-06-09)**

- **`TvSearchPodcastsBrowseBody`** + **`buildSearchPodcastsBrowseFocusLayout`** — parked vertical scroll on Search Podcasts tab.
- **`SearchPodcastsCategory`** + route — 5-col grid via **`TvSearchBrowseDrillPage`** (parked row scroll).
- **`getTvBrowseGridLayout()`** / **`TV_BROWSE_GRID_COLUMNS`** in **`tvLayout.js`**; **`ContentGrid`** row refs + `forwardRef` for parked drill integration.

**Deliverable:** Podcasts tab matches mobile category swimlane IA; category More + show open reach placeholders. ✓

---

## Phase 4 — Radio Browse ✅ (prototype)

**Goal:** Mobile **Search-story** radio hierarchy at **same staged depth**.

- Top tiles: Near You, International, News, Talk, Sports, Public, Religion.
- **International:** continent list → reference path **North America → Canada → Alberta → cities** with **popular swimlane + geo pills** at subregion levels (mobile `Radio-Browse-implementation-plan.md`).
- Near You / format: station lists sorted by mock popularity.
- Station tap → **`/radio/:id`** placeholder (or tune stub).

**TV layout notes**

- **Same browse shell as Music/Podcasts:** field-only fixed header; **tabs in scroll content**; `search-browse-${tab}` scroll memory; first swimlane title aligns across content-type switches.
- Category rows: **`ContentTileSwimlane`**; International: continent pills + label tiles (`TvSearchRadioInternationalSection`).
- Drill grids: **5-col** `ContentGrid` via **`TvSearchBrowseDrillPage`**; geo combo: **`TvSearchRadioGeoRegion`** — **two swimlanes** (channels + sub-region buttons); vertical parked nav between lanes, horizontal parked nav within each lane.

**Shipped (2026-06-09)**

- **`TvSearchRadioBrowseBody`** + **`buildSearchRadioBrowseFocusLayout`** — Near You, International, format swimlanes on Radio tab.
- **`SearchRadioStationGrid`**, **`SearchRadioInternational`** (+ **`TvSearchRadioGeoRegion`**) — near-you/format grids; continent grid; NA → Canada → Alberta → cities path; leaf station grids.
- Routes under `/search/browse/radio/...`; shared layout with Music/Podcasts browse chrome.

**Deliverable:** One full geo path + format entry navigable; placeholders on play. ✓

---

## Phase 5 — Live search + result swimlanes

**Goal:** Non-empty query shows filtered lanes (profile-gated).

**Lanes** (from `enabledSearchResultLanes()`)

| Lane | TV presentation | Tap |
|------|-----------------|-----|
| Channels | `MusicChannelSwimlane` | `/music/:id` |
| Artists | Square **label tile** row (new `TvSearchLabelTile`) | `/search/browse/music/artist/:id` → channel grid |
| Tags | Same label tile | `/search/more/tags?q=` (exact tag) |
| Podcasts | `ContentTileSwimlane` | `/podcast/:id` stub |
| Episodes | Single-column list rows (new simple **`TvEpisodeRow`** or compact tile) | stub / dialog |
| Radio | `ContentTileSwimlane` | `/radio/:id` stub |

- Reuse **`searchCatalog`** functions; cap visible cards at 9 + **More**.
- **More** navigates to `/search/more/catalog?lane=&q=`.
- Empty lane → omit row (no “0 results” chrome).

**Focus groups:** Each populated swimlane = one vertical group (same as Home). Header group 0 hidden tabs when `isSearchActive`.

**Deliverable:** Typing filters catalog; lanes match mobile semantics; music-only shows three lanes only.

---

## Phase 6 — Search More + drill-down grids

**Goal:** Full result sets and tag/artist browse grids.

- **`TvSearchCatalogMore.jsx`** — `/search/more/catalog?lane=&q=` — `ContentGrid` by lane; episodes single-column.
- **`TvSearchTagsMore.jsx`** — `/search/more/tags?q=` — channel grid for exact tag (share logic with mobile `SearchTagsMore`).
- Artist channel grid, music category browse, podcast category — TV grids with focus memory.
- **Back (`Esc`)** → `navigate(-1)` to restore `/search/...?q=...`.

**Deliverable:** More + tag grids work; Back restores search field + lanes.

---

## Phase 7 — Reset + PrimaryNav integration

**Goal:** Match mobile **BottomNav** semantics in **`PrimaryNav.jsx`**.

1. **Clear** — `query ''`, remove `?q=`, browse mode; **keep** `/search/music` \| `podcasts` \| `radio` (broad) or `/search` (limited).
2. **PrimaryNav Search from another main tab** — `to={`/search/${resolveBroadSearchBrowseTab(enabledTypes)}`}` (broad) or `/search` (limited); no `?q=` in link.
3. **Re-tap Search while on `/search*`** — `preventDefault` on nav activate; `writeStoredBroadSearchBrowseTab('music')`; `navigate({ pathname: '/search/music', search: '' })` (broad) or `/search` (limited). **Always Music + empty field** on broad re-tap (per Search-story).
4. **`Search.jsx`:** `useLayoutEffect` persists browse tab to `sessionStorage` when on broad shell paths.

**`searchStackActive` for nav highlight:** Extend `isNavItemActive` for search item: active when `pathname.startsWith('/search')` (and `/radio/*` if mobile parity needed later).

**Deliverable:** Three reset paths behave predictably; stored tab survives Home → Search.

---

## Phase 8 — Content profile + limited scope polish

**Goal:** Music-only MVP gating and limited Search fork complete.

- **`shouldShowBrowseContentSwitcher`** — hide tabs when only music enabled.
- **`getBrowseTabsForProfile`** — filter tab focus order.
- Disabled podcast/radio routes → **“Not available in this build”** when music-only (reuse pattern from music-only plan §1.1).
- Limited scope redirects and empty hint copy.
- Toggle: **`/settings/user-type`** → Content profile **music-only** | **full MPR** (already on TV).

**Deliverable:** Switching profile on preview screen updates Search tabs, lanes, and placeholders without code changes.

---

## Phase 9 — Docs + acceptance

- Update **`docs/tv/figma-nodes.md`** — Search & Browse section + node `15822:35859`.
- Update **`docs/tv/Plans/plan.md`** — milestone under What we have done.
- Append **`docs/tv/react-learning.md`** — Search header offset, keyboard stub, header focus group.
- Cross-link mobile plan if shared module paths change.

**Acceptance checklist (manual)**

- [ ] Broad music: stacked vibe sections match Figma structure; limited music: genre grid like mobile.
- [ ] Limited catalog: `/search` only; no browse tabs; broad paths redirect.
- [ ] First character hides tabs; results lanes profile-aware.
- [ ] Clear vs PrimaryNav Search vs re-tap Search match mobile rules.
- [x] PC keyboard edits query when search field is focused (no on-screen keyboard overlay).
- [ ] D-pad: field, Clear, tabs, pills, tiles, swimlanes, nav boundary.
- [ ] More grids + Esc back restore `?q=`.
- [ ] Full MPR ↔ music-only toggle on `/settings/user-type` updates Search UI.
- [ ] Podcast/radio taps reach placeholder stubs.

---

## Suggested implementation order

```
Phase 0 (shared + routes)
  → Phase 1 (header + stub + query)
  → Phase 2 (music browse)
  → Phase 5 (search results) — can parallel after Phase 1 for faster demo
  → Phase 6 (More)
  → Phase 3–4 (podcasts, radio browse)
  → Phase 7–8 (nav reset, profile polish)
  → Phase 9 (docs)
```

Phases **3–4** can slip after **5–6** if you want a clickable **Music search + browse** vertical slice first.

---

## TV focus group map (draft)

| Group | Broad browse | Search active |
|-------|----------------|---------------|
| 0 | Field, Clear, tabs | Field, Clear |
| 1 | Music: vibe 1 pills | Result lane 1 |
| 2 | Music: vibe 1 tiles | Result lane 2 |
| … | … | … |
| n | Podcasts/radio body | … |

Exact indices depend on how many vibe sections are mounted; use **`useTvVerticalGroupScroll`** on the scroll container (same as `BroadHome`).

---

## Out of scope (unless requested)

- Real OS keyboard integration API or on-screen keyboard UI.
- Full Podcast Info / Radio player screens (placeholders only for this plan).
- TV limited **Home** refactor to mobile `LimitedBrowse` (separate **TV-2** item); this plan only requires **Search limited** behavior like mobile.

---

*Last updated: 2026-06-09* — Initial TV plan from stakeholder answers (stacked vibe browse, limited scope B, keyboard stub, shared modules, profile gating).
