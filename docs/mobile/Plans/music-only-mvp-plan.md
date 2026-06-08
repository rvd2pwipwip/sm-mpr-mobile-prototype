# Plan: Music-only MVP (content profile)

Living implementation plan for a **music-only** prototype variant while **keeping podcasts and radio restorable** without rewriting UI. Applies to **mobile** (`apps/mobile/`) and **TV** (`apps/tv/`) with the same product rules. Complements **catalog scope** (broad vs limited) — do not merge those axes.

**Status:** Mobile Phases 0–5 shipped (docs + acceptance matrix below). TV: **TV-0** profile toggle + **TV-1** Broad Home gating shipped; **TV-2** limited Home pending.

**See also:**

- `docs/mobile/Plans/catalog-scope-search-browse-refactor.md` — broad vs limited IA (unchanged)
- `docs/mobile/Plans/plan.md` — living mobile history
- `docs/tv/Plans/plan.md` — living TV history
- `docs/mobile/Stories/Home-screen-story.md` — MVP variant notes (shipped)
- `docs/mobile/Stories/Search-story.md` — MVP variant + integration notes

---

## 1. Product intent

Stakeholders need an **MVP prototype** that shows **music only** (no podcasts, no radio in browse surfaces), while **broad** and **limited** catalog scope both remain available.

**Later:** Podcasts and radio return; some territories may enable a subset of content types. Code must stay in the repo and flip back via **configuration**, not deletion.

### 1.1 Confirmed decisions (stakeholder answers)

| # | Topic | Decision |
|---|--------|----------|
| 1 | **Listen again** | Show **music items only**; filter out podcast/radio history rows when music-only profile is active. |
| 2 | **New Home swimlanes** | **New releases**, **Country essentials** — designer will supply **fixed mock channel id lists** (not generated slices). |
| 3 | **Disabled deep links** | `/podcast/*`, `/radio/*`, and disabled browse routes show a short **“Not available in this build”** stub (not silent redirect). |
| 4 | **Search placeholder** | Music-only copy: **`Search channels, artists or tags`** (sentence case in UI; match Figma if it differs). |
| 5 | **Internal demo control** | Toggle on **`/upgrade`** (mobile) to turn podcasts/radio **back on** for reviews; mirror on TV preview screen. |
| 6 | **TV** | Same content-profile rules as mobile (not mobile-only). |
| 7 | **Limited Browse user content** | **Music only** — hide podcast/radio history, likes, and podcast user swimlanes on limited landing. |

### 1.2 Unchanged for MVP

- **Catalog scope toggle** — wordmark still switches broad vs limited (`TerritoryContext`).
- **User types** — guest / freeStingray / freeProvided / subscribed behavior unchanged.
- **Routes and components** for podcasts/radio — **kept**, gated off.
- **Mock data modules** — `podcasts.js`, `radioStations.js`, geo radio tree — **unchanged**.
- **Bottom nav (broad)** — Home, Search, My Library remain (music-only is not a fourth tab).

---

## 2. Architecture: two independent axes

```
                    ┌─────────────────────────────────────┐
  catalogScope      │  broad  │  limited                  │
  (lineup size)     └─────────────────────────────────────┘
                              ×
                    ┌─────────────────────────────────────┐
  contentProfile    │  music  │  music+podcasts+radio       │
  (content types)   └─────────────────────────────────────┘
```

- **`catalogScope`** — already in `TerritoryContext` / `@sm-mpr/shared/constants/catalogScope.js`.
- **`contentProfile`** (new) — which **content types** are enabled: `music`, `podcasts`, `radio`.

**Default for demo:** music-only (`ENABLED_CONTENT_TYPES = ['music']`).

**Full MPR preview:** prototype toggle sets profile to all three types (session-persisted like user type).

---

## 3. Shared module design (`@sm-mpr/shared`)

### 3.1 New files (proposed)

| File | Role |
|------|------|
| `packages/shared/constants/contentTypes.js` | `CONTENT_TYPE` enum, `ALL_CONTENT_TYPES`, default enabled set |
| `packages/shared/constants/productProfile.js` | Composes enabled types; helpers `isContentTypeEnabled(type)` |
| `packages/shared/constants/homeSwimlanes.js` | Declarative **broad Home** swimlane registry (ids, content types, data keys) |
| `packages/shared/constants/myLibrarySections.js` | Declarative My Library section registry |
| `packages/shared/constants/searchResultLanes.js` | Declarative search result lane ids + labels |
| `packages/shared/data/homeMusicSwimlanes.js` | **New releases** / **Country essentials** channel id lists (filled when design provides lists) |

Export new modules from `packages/shared/package.json` `exports`.

### 3.2 Prototype persistence

| Key | Storage | Purpose |
|-----|---------|---------|
| `sm-mpr-prototype-content-profile` | `sessionStorage` | `music-only` \| `full-mpr` (or store enabled type array) |

Read on app init; write when demo toggle changes. Same tab survives refresh; new tab gets **default (music-only)** unless we later choose `localStorage`.

### 3.3 Context (mobile + TV)

**`ContentProfileProvider`** (or extend `TerritoryProvider` only if team prefers one “prototype knobs” context):

- `enabledContentTypes` — derived array
- `isContentTypeEnabled(type)` — boolean
- `contentProfileMode` — `music-only` \| `full-mpr` for toggle UI
- `setContentProfileMode(mode)` — updates storage + state

Place in `App.jsx` next to `TerritoryProvider` / `UserTypeProvider`.

### 3.4 Helpers (thin, no UI)

```js
// conceptual
enabledBrowseTabs()       // filter BROWSE_TABS
enabledSearchResultLanes() // channels | artists | tags only when music-only
shouldShowBrowseSwitcher() // enabledBrowseTabs().length > 1
filterListenHistoryByProfile(items)
```

Keep **filtering logic** in shared utils; **registries** list what exists when types are on.

---

## 4. Prototype demo control

### 4.1 Mobile — `Subscription.jsx` (`/upgrade`)

Add a second prototype group below **Preview as**:

- Label: **Content profile** (or **Preview catalog**)
- Toggles: **Music only** | **Full MPR** (music + podcasts + radio)
- `aria-label` parallel to user-type group
- Changing toggle updates `ContentProfileProvider` immediately (whole app re-renders gated sections)

### 4.2 TV — `TvUserTypePreview.jsx` (or equivalent)

Same two-way toggle so QA can validate focus counts when podcast/radio rails reappear.

### 4.3 Default

Committed config + empty storage = **music only**. Toggle to **Full MPR** does not change `catalogScope` or `userType`.

---

## 5. Disabled route stub

### 5.1 Component

**`ContentTypeUnavailable.jsx`** — full-screen or stacked shell:

- `ScreenHeader` with back
- Title: **Not available in this build**
- Short body: e.g. “Podcasts and radio are not included in this prototype build.”
- Optional link: **Return to Home** / **Back**

Reuse `ScreenHeader` / TV header patterns; one component per app if markup differs.

### 5.2 Route guards

Wrap or guard routes when `!isContentTypeEnabled('podcasts'|'radio')`:

| Route pattern | When disabled |
|---------------|----------------|
| `/podcast/:id`, `/podcast/:id/play` | Unavailable stub |
| `/radio/:id`, `/radio/:id/play` | Unavailable stub |
| `/search/podcasts`, `/search/podcasts/*` | Unavailable stub |
| `/search/radio`, `/search/radio/*` | Unavailable stub |
| `/search/browse/podcasts/*` | Unavailable stub |
| `/search/browse/radio/*` | Unavailable stub |
| `/my-library/history/podcasts`, podcast library paths | Unavailable stub or redirect to music library hub |
| `/my-library/likes/radio` | Unavailable stub |

**Music routes** always work. **Search** `/search/music` and music browse drill-downs always work.

Implementation options (pick one in Phase 1):

- **A.** Small wrapper `<RequireContentType type="podcasts">` around route `element`
- **B.** Central map in `App.jsx` that swaps `element` for stub when disabled

Prefer **A** for readability.

---

## 6. Mobile implementation — by surface

### Phase 0 — Config, context, stub, demo toggle

**Goal:** Infrastructure only; no visible Home changes yet.

- [x] Add shared `contentTypes.js`, `productProfile.js`, session storage helpers
- [x] Add `homeMusicSwimlanes.js` + MVP channel rows in `musicChannels.js` (designer lists; **Hot Country** → catalog **Hot Country US**, **Americana** → **Alt-Country/Americana**)
- [x] Add `ContentProfileProvider` (mobile + TV `App.jsx`)
- [x] Add `ContentTypeUnavailable.jsx`
- [x] Add `RequireContentType` route wrapper (+ library history/likes guards)
- [x] Guard podcast/radio player and browse routes (stub when music-only)
- [x] Add **Content profile** toggle on `Subscription.jsx` and `TvUserTypePreview.jsx`
- [ ] Unit smoke: `isContentTypeEnabled` + `filterListenHistoryByProfile` (optional small test file or manual checklist)

**Files:** `packages/shared/*`, `apps/mobile/src/context/ContentProfileContext.jsx`, `apps/mobile/src/components/RequireContentType.jsx`, `apps/mobile/src/pages/ContentTypeUnavailable.jsx`, `apps/mobile/src/App.jsx`, `apps/mobile/src/pages/Subscription.jsx`

---

### Phase 1 — Broad Home swimlanes

**Goal:** Music-only Home layout via registry gating (original swimlanes only).

- [x] Introduce `homeSwimlanes.js` registry (broad scope)
- [x] Refactor `Home.jsx` to map registry → components (keep existing components)
- [x] **Remove** from music-only profile: Popular podcasts, Top radio (registry `contentTypes` gating)
- [x] **Music-only only:** **New releases**, **Country essentials** (`musicOnlyOnly` in registry; hidden on full MPR Home)
- [x] **Listen again:** `filterListenHistoryByProfile` on Home + `ListenAgainMore.jsx`; hide rail if empty after filter
- [x] Keep **Most popular music**, **Recommendations** (unchanged for both profiles), **Provider lineup** (`freeProvided`), mid-stack banner ad
- [x] **Full MPR:** one music → one podcast → one radio swimlane stack (original Home order)

**Data dependency:** Designer delivers two arrays of channel ids + swimlane titles (confirm exact copy for “New releases” / “Country essentials”).

**Files:** `Home.jsx`, `SwimlaneMore.jsx`, `packages/shared/data/homeMusicSwimlanes.js`, `packages/shared/constants/homeSwimlanes.js`

---

### Phase 2 — Search (broad)

**Goal:** Music-only search UX on broad catalog.

- [x] `enabledBrowseTabs()` — music only → **hide** `SearchBrowseContentSwitcher` in `SearchBrowseHeader` when `!shouldShowBrowseContentSwitcher()`
- [x] Default `/search` redirect stays **music** tab (`resolveBroadSearchBrowseTab` in `searchBrowsePaths.js`; BottomNav + `SearchEntryRoute`)
- [x] `Search.jsx` — do not mount `SearchPodcastsBrowse` / `SearchRadioBrowse` when types disabled
- [x] `SearchResultsPanel` — use `enabledSearchResultLanes()` (channels, artists, tags only)
- [x] `SearchCatalogMore` — same lane filter (redirect disabled lanes)
- [ ] `searchCatalog.js` — optional: skip podcast/radio queries when disabled (deferred; skipped at panel/more layer)
- [x] Placeholder copy in `SearchBrowseHeader.jsx`: **Search channels, artists or tags**
- [x] Limited `/search` unchanged structurally (already no browse strip); results panel + empty copy respect lane filter

**Files:** `Search.jsx`, `SearchBrowseHeader.jsx`, `SearchResultsPanel.jsx`, `SearchCatalogMore.jsx`, `searchBrowsePaths.js`, `searchResultLanes.js`

---

### Phase 3 — My Library (broad)

**Goal:** Music-only library hub.

- [x] `myLibrarySections.js` registry
- [x] Refactor `MyLibrary.jsx` to map registry
- [x] Default profile sections: **Music history**, **Liked music** (and App Info swimlane if present)
- [x] Hide: podcast history, `LibraryPodcastUserSwimlanes`, radio history, `LibraryLikedRadioSwimlane`
- [x] Guard `/my-library/history/podcasts`, `/my-library/likes/radio`, podcast library routes with stub (`RequireLibrary*` + `RequireContentType` on podcast/radio routes)

**Files:** `MyLibrary.jsx`, `myLibrarySections.js`, `myLibraryHistory.js` (segment metadata may stay; gating at UI)

---

### Phase 4 — Limited Browse (landing)

**Goal:** Music-only limited Home/Browse.

- [x] Hide **Music | Podcasts | Radio** switcher when `!shouldShowBrowseContentSwitcher()` (`LimitedBrowse.jsx`)
- [x] Force effective browse tab to **`music`** when only one type enabled (`resolveLimitedBrowseTab` in `searchBrowsePaths.js`)
- [x] `LimitedBrowseTaxonomyRails.jsx` — only music taxonomy + music user rails (`LibraryLikedMusicSwimlane`, music **Listen again** / history)
- [x] Remove podcast/radio taxonomy swimlanes and user prepends from render when disabled (`isContentTypeEnabled` + `activeBrowseTab`)

**Files:** `LimitedBrowse.jsx`, `LimitedBrowseTaxonomyRails.jsx`, `searchBrowsePaths.js` (read stored tab through profile filter)

---

### Phase 5 — Polish, docs, acceptance

- [x] Update `Home-screen-story.md`, `Search-story.md` with MVP variant notes
- [x] `docs/mobile/react-learning.md` — short entry on content profile vs catalog scope
- [x] `docs/mobile/Plans/plan.md` — checklist when shipped
- [x] Design-review guide — mention **Full MPR** toggle on Upgrade for internal demos
- [x] Manual acceptance matrix (below) — runnable QA checklist before stakeholder demos

---

## 7. TV implementation

TV does not reuse `ContentSwimlane`; it uses **focus groups** per swimlane. Same **content profile** context and shared registries where possible; TV-specific **group counts** must shrink when rails are hidden.

### Phase TV-0 — Shared profile + demo toggle

- [x] `ContentProfileProvider` in `apps/tv/src/App.jsx`
- [x] Content profile toggle on `TvUserTypePreview.jsx` (or dedicated screen)
- [ ] `ContentTypeUnavailable` TV page + route guards for any podcast/radio routes if they exist (no podcast/radio routes on TV yet)

### Phase TV-1 — Broad Home (`BroadHome.jsx`)

- [x] Gate **Popular podcasts**, **Top radio** swimlanes when music-only (`useContentProfile`)
- [x] **New releases**, **Country essentials** (music-only; shared registry + `getVisibleBroadHomeTvSwimlanes`)
- [x] Recompute `groupCount`, `itemCounts`, `swimlaneGroups` from **enabled** rails only (dynamic layout in `BroadHome.jsx`)
- [x] Focus landing / scroll bounds follow first and last enabled swimlane group

### Phase TV-2 — Limited Home (`LimitedHome.jsx`)

- [ ] Hide content-type switcher when music-only (if present)
- [ ] Music genre filters + channel rail only; drop podcast/radio limited UI when disabled

### Phase TV-3 — Search / Library (when those TV screens exist)

- [ ] Apply same lane and section filters as mobile when TV Search/Library ships
- [ ] Document in `docs/tv/Plans/plan.md`

**Files:** `BroadHome.jsx`, `LimitedHome.jsx`, `homeFocusGroups.js`, `TvUserTypePreview.jsx`, `docs/tv/Plans/plan.md`

---

## 8. Data: new Home swimlanes

**Placeholder until design hands off lists:**

```js
// packages/shared/data/homeMusicSwimlanes.js (shape)
export const HOME_MUSIC_SWIMLANE_LISTS = {
  newReleases: {
    title: "New releases",
    channelIds: [], // TODO: design-provided stable ids
  },
  countryEssentials: {
    title: "Country essentials",
    channelIds: [],
  },
};
```

Helper: `getHomeSwimlaneChannels(key)` resolves ids → `MusicChannel` objects from `MUSIC_CHANNELS`; skip missing ids with console warn in dev.

**More routes (mobile):** extend `SwimlaneMore.jsx` `CATEGORIES` or add keys `new-releases`, `country-essentials` with titles matching swimlane headers.

---

## 9. File inventory (expected touch list)

| Area | Mobile | TV | Shared |
|------|--------|-----|--------|
| Config / profile | `ContentProfileContext.jsx` | same pattern | `contentTypes.js`, `productProfile.js`, registries |
| Demo toggle | `Subscription.jsx` | `TvUserTypePreview.jsx` | storage helpers |
| Route guard | `RequireContentType.jsx`, `App.jsx` | `App.jsx` | — |
| Stub page | `ContentTypeUnavailable.jsx` | TV variant | — |
| Home | `Home.jsx`, `SwimlaneMore.jsx` | `BroadHome.jsx`, focus constants | `homeSwimlanes.js`, `homeMusicSwimlanes.js` |
| Search | `Search.jsx`, `SearchBrowseHeader.jsx`, `SearchResultsPanel.jsx` | (when built) | `searchResultLanes.js` |
| Library | `MyLibrary.jsx` | (when built) | `myLibrarySections.js` |
| Limited | `LimitedBrowse.jsx`, `LimitedBrowseTaxonomyRails.jsx` | `LimitedHome.jsx` | browse tab helpers |
| Listen history | `ListenAgainCard` usage sites | — | `filterListenHistoryByProfile` |
| Docs | Stories, `plan.md`, react-learning | `docs/tv/Plans/plan.md` | — |

**Do not delete:** `PodcastCard`, `RadioStationCard`, `LibraryPodcastUserSwimlanes`, podcast/radio players, geo radio modules.

---

## 10. Acceptance checklist

**Manual QA** — run before design reviews or stakeholder demos. Implementation for mobile Phases 0–4 is complete; check boxes as you verify in the browser.

Run with **default profile (music only)** and again with **Full MPR** toggle on `/upgrade` (mobile) or **Settings → user type preview** (TV).

### Broad + music only

- [ ] Home shows: Listen again (music only), Most popular music, **New releases**, **Country essentials**, Recommendations — **no** podcast/radio lanes
- [ ] Home does **not** show podcast/radio tiles in Listen again
- [ ] Search: **no** Music/Podcasts/Radio strip; placeholder **Search channels, artists or tags**
- [ ] Search results: **Channels**, **Artists**, **Tags** only
- [ ] My Library: music history + liked music only
- [ ] `/podcast/...` and `/radio/...` → **Not available in this build**
- [ ] Music play flows unchanged

### Limited + music only

- [ ] `/` limited Browse: **no** content-type switcher
- [ ] Music genre swimlanes + music user content only
- [ ] `/search` results: music lanes only

### Full MPR toggle

- [ ] Upgrade (or TV preview): **Full MPR** restores prior podcast/radio Home lanes, browse tabs, library sections, and deep links
- [ ] Toggle back to **Music only** hides them again without reload bugs

### TV (music only)

- [ ] Broad Home focus moves only across **enabled** swimlane groups (no dead groups)
- [ ] New music swimlanes focusable; Enter → channel info

### Catalog scope

- [ ] Wordmark broad ↔ limited still works in both content profiles

---

## 11. Rollback / restore full MPR permanently

When product ships full MPR again:

1. Change **default** in `productProfile.js` to all content types (or remove music-only default).
2. Keep toggle for internal QA or remove prototype group from `Subscription.jsx`.
3. Registries already list podcast/radio entries — they render when types enabled.
4. No component resurrection required.

---

## 12. Suggested implementation order (summary)

1. **Phase 0** — Shared config, context, stub, route guards, demo toggle (mobile + TV provider)
2. **Phase 1** — Broad Home + new swimlane data + SwimlaneMore
3. **Phase 2** — Search copy + lane filtering
4. **Phase 3** — My Library registry
5. **Phase 4** — Limited Browse
6. **Phase TV-1** — TV Broad Home rail gating (shipped)
7. **Phase 5** — Docs + acceptance (shipped)
8. **Phase TV-2** — TV limited Home (pending)

**Phase 1 data:** channel name lists in `packages/shared/data/homeMusicSwimlanes.js` (resolved to catalog ids).

---

## 13. Open items (non-blocking)

- Exact Figma links for new swimlanes when frames exist
- Whether **Recommendations** stays on music-only Home (assumed **yes** unless design removes it)
- TV Search/Library parity timing if those routes are still stubs
