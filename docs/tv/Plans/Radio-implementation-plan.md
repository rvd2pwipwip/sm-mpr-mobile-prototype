# TV Radio stations — incremental implementation plan

Living plan for **radio stations** in **`apps/tv/`**, mirroring the **mobile prototype behavior** (browse, station info, like, full player, listen history) while using **TV layout, D-pad focus, and existing TV components**. Work in **phases**; each phase should be clickable before starting the next.

**Companion docs**

- Mobile browse plan: [`docs/mobile/Plans/Radio-Browse-implementation-plan.md`](../../mobile/Plans/Radio-Browse-implementation-plan.md)
- Mobile story (Search + browse rules): [`docs/mobile/Stories/Search-story.md`](../../mobile/Stories/Search-story.md)
- TV coordinator: [`plan.md`](./plan.md)
- Search Radio browse (already shipped): [`Search-Browse-implementation-plan.md`](./Search-Browse-implementation-plan.md) Phase 4
- Music player (structural pattern): [`Music-player-implementation-plan.md`](./Music-player-implementation-plan.md)
- Podcast info (hero + focus pattern): [`Podcasts-implementation-plan.md`](./Podcasts-implementation-plan.md) Phase 2
- Limited Home layout B: [`Limited-Home-layout-comparison.md`](./Limited-Home-layout-comparison.md)
- Focus model: [`vertical-parked-navigation.md`](../vertical-parked-navigation.md)

**No real audio** — playback is **UI state only** (play/pause, live progress stub), same as mobile.

---

## Decisions locked (stakeholder review)

| Topic | Choice | TV notes |
|--------|--------|----------|
| **Routes** | `/radio/:stationId` (info) · `/radio/:stationId/play` (full player) | Same as mobile; invalid ids → `Navigate` to `/search/radio` |
| **Catalog** | `@sm-mpr/shared/data/radioStations.js` + `radioInternationalBrowse.js` (`resolveRadioStationForStub`) | Already used on TV Home / Search / Limited Home |
| **Station info layout** | In-car Figma **`13524:34458`** (`radioInfo`) | **Elements and layout** are source of truth; **reuse TV components** (`TvUpgradeButton`, `ChannelInfoDescription`, focus hooks) — **not** in-car pill-shaped buttons |
| **Share** | **Omit on TV** | Mobile info + player have Share; TV matches **`MusicChannelInfo`** / **`MusicPlayer`** (no Share) |
| **Like** | `useMusicRadioLikeAction("radio", id)` + `userMayLikeMusicRadio` | Already on TV for music; same hook for radio info + player |
| **Full player** | **In scope** — required so **Play** and **radio history** work | Structural parity with **`MusicPlayer.jsx`**; transport is **play/pause only** + **Live** label (mobile `RadioPlayer.jsx`) — **no skip** |
| **Preroll** | `showPlayerPreroll(userType)` + `GuestPrerollGraceContext` | Reuse **`TvPlayerPrerollAd`** |
| **Listen history** | `ListenHistoryContext.recordRadioStationListen` on first allowed playback | Powers **Listen again** (limited Home radio tab) + **My Library radio history** |
| **Nav chrome** | Hide **`PrimaryNav`** on `/radio/:stationId/play` | Extend **`TvShell`** `FULL_PLAYER_PATH` regex |
| **Mini player** | **Deferred** — radio variant not in v1 | Full player only; session still upserts for future mini player |
| **Limited Home (layout B)** | Same as mobile when **Radio** tab selected: content switcher + **Listen again** (typed) + **Your radio stations** + taxonomy rails | See Phase 4 — TV is **partial** today (Listen again yes; liked radio + Near You / International missing) |

---

## Figma anchors

### Radio station info (in-car — layout source of truth)

| What | Node | URL |
|------|------|-----|
| **Radio info** (`radioInfo`) | `13524:34458` | [SM HTML InCar MPR](https://www.figma.com/design/sMhTukUlNNedadBSyRnOq5/SM-HTML-InCar-MPR?node-id=13524-34458) |

**Measurements to tokenize** (from MCP pull; map to `apps/tv/src/index.css` or page CSS):

**Radio info (`13524:34458`)**

- Body: `pt 150px`, `px 100px` (align with TV channel/podcast info page chrome)
- Hero row: `gap 40px` — thumb **`308×308`**, `radius 30px`
- Title block: `gap 10px` — title Roboto Black **`34px`**; description Regular **`28px`**
- Actions row: `gap 10px` — Play (primary) + Like (secondary); on TV render with **`TvUpgradeButton`** (rectangular TV control), not in-car pill components
- Metadata row: four columns — **Location**, **Genres**, **Language**, **Website** — label Black **`24px`**, value Regular **`28px`**

**TV adaptation notes**

- Reuse **`music-channel-info`** / **`podcast-info`** page spacing tokens where they already match (`--tv-content-inline`, title sizes).
- Description overflow → **`ChannelInfoDescription`** + **`ChannelInfoDescriptionDialog`** (same as **`MusicChannelInfo`**).
- **No** tags swimlane or related-channels row on radio info (not in in-car frame).
- Metadata can be **static text** in v1 (not individually focusable); website value is display-only prototype copy.

### Radio full player (TV structural reference)

| What | Node | URL |
|------|------|-----|
| **Music player** (TV chrome to copy) | `23:20013` | [SM HTML TV MPR](https://www.figma.com/design/DfwtFG53ud7EHhvlPutvI8/SM-HTML-TV-MPR?node-id=23-20013) |

Radio player differs from music: **info + like** only (no Share), cover + **Now playing** / station name / frequency line, **Live** progress strip, **play/pause only** (no skip, no ±15). Match mobile `RadioPlayer.css` semantics inside TV player layout.

### Browse (already implemented on TV)

| What | Mobile node | Notes |
|------|-------------|--------|
| Radio browse top level | `19868:32686` | TV: **`TvSearchRadioBrowseBody`** |
| International subregion | `19871:33556` | TV: **`TvSearchRadioInternationalSection`** + geo drill |

---

## Current TV state (inventory)

| Piece | Status |
|-------|--------|
| Shared `radioStations.js`, `radioInternationalBrowse.js`, `resolveRadioStationForStub` | **Done** |
| Broad Home — Top radio stations swimlane (tiles render) | **Done** — tiles → `/radio/:id`; More → `/more/radio` |
| Home More `/more/radio` | **Done** — `SwimlaneMore.jsx` radio grid |
| Search Radio browse + International drill | **Done** |
| Search results / station grids → `/radio/:id` | **Done** (lands on stub) |
| `/radio/:stationId` | **Done** — `RadioStationInfo.jsx` |
| `/radio/:stationId/play` | **Done** — Phase 1 shell (`RadioPlayer.jsx`) |
| `RadioStationInfo` page | **Done** |
| `RadioPlayer` page | **Done** — full player UI (preroll, info, like, live transport) |
| `PlaybackContext.upsertRadioSession` | **Done** |
| `ListenHistory.recordRadioStationListen` on TV | **Done** — called from `RadioPlayer` |
| My Library — radio history swimlane (empty state) | **Done** (`TvLibraryHistorySwimlane` segment `radio`) |
| My Library — liked radio swimlane | **Done** (hidden when empty; navigates to stub) |
| Limited Home — Listen again on Radio tab | **Done** (`LISTEN_HISTORY_KIND_FOR_BROWSE_TAB.radio`) |
| Limited Home — Your radio stations | **Done** — `TvLibraryLikedRadioSection` on Radio tab |
| Limited Home — Near You + International + format taxonomy | **Done** — `limitedHomeRadioStackedLayout.js` |
| `useMusicRadioLikeAction` | **Done** |
| `TvPlayerPrerollAd`, grace, tier gates | **Done** (music player) |
| Radio mini player variant | **Deferred** |

---

## Mobile vs TV — what to share vs rebuild

| Area | Share (`@sm-mpr/shared` or existing TV) | TV-only |
|------|----------------------------------------|---------|
| Catalog + lookups | `radioStations.js`, `resolveRadioStationForStub` | — |
| Tier / gate functions | `userContentGates.js`, `userTierRules.js` | — |
| Listen history | `ListenHistoryContext` (already mounted on TV) | Call `recordRadioStationListen` from player |
| Likes | `LikesContext` + `useMusicRadioLikeAction` | — |
| Browse body | — | **Done** — no rebuild |
| Pages | — | `RadioStationInfo`, `RadioPlayer` |
| Home / More wiring | — | Fix `BroadHome`, extend `SwimlaneMore` |
| Limited Home radio tab | — | Liked rail + full taxonomy stack |
| Focus | — | `useScreenContentFocus`, `KeyboardWrapper`, vertical groups |
| Shell | — | `TvShell` hide nav on play route |

---

## Phase 0 — Navigation glue + Home More — **done**

**Goal:** Every existing radio entry point reaches a real route (stub replaced in Phase 1).

1. **`BroadHome.jsx`** — Top radio swimlane:
   - `onSelectItem={(item) => navigate(\`/radio/${item.id}\`)}`
   - `onMore={() => navigate("/more/radio")}`
2. **`SwimlaneMore.jsx`** — Add **`/more/radio`** config:
   - Title: **Top radio stations**
   - Grid: all `RADIO_STATIONS` via `TvDrillGridPage` + `ContentTileCard`
   - Tap → `/radio/:id`
3. **`App.jsx`** — Register `/more/radio` route if not already covered by existing More route table.

**Deliverable:** Home radio tile → `/radio/:id`; More → full station grid.

**Click test:** Broad Home → Top radio stations → any tile; More → grid → tile.

---

## Phase 1 — Playback foundation + play route shell — **done**

**Goal:** TV session model supports radio; play URL registered; nav hides on full player.

1. **`PlaybackContext.jsx`**:
   - Add **`upsertRadioSession`** (mirror mobile: `variant: "radio"`, `radioStationId`, `fullPlayerPath: /radio/:id/play`)
   - Extend **`hideMiniOnFullPlayer`** regex for `/radio/:id/play`
2. **`App.jsx`**:
   - Add `/radio/:stationId/play` route + `RadioPlayerRoute` with `key={\`${stationId}-${userType}\`}` (tier remount parity)
   - Wrap in `RequireContentType` for `CONTENT_TYPE.radio`
3. **`TvShell.jsx`** — Extend `FULL_PLAYER_PATH` with `/radio/:stationId/play`
4. **`playbackMiniPlayer.js`** (if needed) — helper to read active radio station id from session for playing indicators

**Deliverable:** Manual navigation to `/radio/<valid-id>/play` mounts player shell (UI in Phase 3); session updates.

---

## Phase 2 — Radio station info (`/radio/:stationId`) — **done**

**Goal:** In-car **`13524:34458`** layout using existing TV info components.

**New files**

- `apps/tv/src/pages/RadioStationInfo.jsx`
- `apps/tv/src/pages/RadioStationInfo.css` (extend or mirror `MusicChannelInfo.css` tokens)

**Structure (mirror `MusicChannelInfo.jsx` + mobile metadata)**

| Focus group | Content |
|-------------|---------|
| 0 | **Play**, **Like** (Left/Right) — `TvUpgradeButton` + `useMusicRadioLikeAction` |
| 1 (optional) | Description **More...** when clamped — `ChannelInfoDescription` + dialog |
| — | Metadata row (static): Location, Genres, Language, Website |

**Data**

- `resolveRadioStationForStub(stationId)` — covers home catalog + geo mock stations
- `metaRows` logic from mobile `RadioStationInfo.jsx` (location from city/country or frequency; genres from tags)

**Routes**

- Replace `/radio/:stationId` stub in **`App.jsx`** with **`RadioStationInfo`**
- Invalid id → `<Navigate to="/search/radio" replace />`

**Actions**

- **Play** → `navigate(\`/radio/${station.id}/play\`)` with `playOverDetailNavigateState()` if shared helper exists on TV (or plain navigate)
- **Like** → existing hook (account gate dialog for guest tiers)

**Out of scope for this page**

- Share
- Tags swimlane
- Related stations row

**Click test:** Search Radio → station tile → info; Play focuses and navigates (player UI Phase 3).

---

## Phase 3 — Radio full player (`/radio/:stationId/play`) — **done**

**Goal:** Play from info works; listen history records; back lands on info.

**New files**

- `apps/tv/src/pages/RadioPlayer.jsx`
- `apps/tv/src/pages/RadioPlayer.css` (live progress + transport overrides)

**Pattern:** Copy **`MusicPlayer.jsx`** focus groups and preroll flow; simplify transport to mobile radio semantics.

| Area | Behavior |
|------|----------|
| **Resolve station** | `resolveRadioStationForStub(stationId)` |
| **Preroll** | `TvPlayerPrerollAd` when `showPlayerPreroll(userType)`; respect `expandFromMiniPlayer` + grace |
| **Session** | `upsertRadioSession` when playback allowed; sync pause from session |
| **History** | `recordRadioStationListen(station.id)` once when playback allowed (not on every pause toggle) |
| **Meta actions** | Info → `/radio/:id` (replace); Like → `useMusicRadioLikeAction` |
| **Hero** | Station art 360px; lines: **Now playing (prototype)**, station name, frequency/category subtitle |
| **Progress** | Decorative live bar + **Live** label (no seek) |
| **Transport** | `TvPlayerTransport` — **play/pause only** (no `TvMusicSkipButton`) |
| **Dismiss** | Esc / back → `/radio/:id` replace (or `navigate(-1)` when `expandFromMiniPlayer`) |
| **Share / Cast** | **Omit** |

**Shell**

- `PrimaryNav` hidden on play route (Phase 1)
- No in-player visual ad strip in v1 unless TV design adds it later (match music player default)

**Click test**

1. Info → Play → preroll (guest) → player UI
2. Play/pause toggles session
3. Like works; account gate for guest
4. Info button returns to station info
5. My Library → Radio history shows station after play
6. Limited Home → Radio tab → Listen again shows station

---

## Phase 4 — Limited Home radio tab parity — **done**

**Goal:** Layout B stacked body matches mobile `LimitedBrowseTaxonomyRails` for **Radio** tab.

**Already done**

- Content switcher includes Radio when profile allows
- **Listen again** swimlane when `item.kind === "radio"` (typed filter via `LISTEN_HISTORY_KIND_FOR_BROWSE_TAB`)

**Add / fix**

1. **Your radio stations** — Mount **`TvLibraryLikedRadioSection`** in **`LimitedHomeStackedBody`** when `activeBrowseTab === CONTENT_TYPE.radio` (mirror podcasts' `TvLibraryPodcastUserSwimlanes` placement: after Listen again, before taxonomy lanes). Hidden when no likes (component already returns null).
2. **Taxonomy stack** — Replace radio-only `buildLimitedHomeStackedLanes` format list with mobile order:
   - **Near You** swimlane (if stations exist) → More `/search/browse/radio/near-you`
   - **International** section — reuse **`TvSearchRadioInternationalSection`** (or thin wrapper with same props as Search browse)
   - **In-feed ad** after Near You + International (or International + first format when no Near You) — mirror mobile `LimitedRadioTaxonomySwimlanes` mid-stack rule
   - **Format** swimlanes (News, Talk, Sports, Public, Religion) → More `/search/browse/radio/format/:formatId`
3. **Fix More path** — Limited stacked body currently uses `/search/browse/radio/category/:id`; mobile uses **`/search/browse/radio/format/:formatId`** — align TV route.
4. **Focus layout** — Update **`LimitedHome.jsx`** group counts / offsets when radio tab adds liked rail + extra lanes (mirror podcast tab layout math).
5. **Playing indicator** — Pass `playingRadioStationId` into swimlanes when session `variant === "radio"` (Phase 5 polish if not done here).

**Reference:** `apps/mobile/src/components/LimitedBrowseTaxonomyRails.jsx` — `LimitedRadioTaxonomySwimlanes`, `LibraryLikedRadioSwimlane`.

**Click test:** Limited catalog → Home → switch to **Radio** → see Listen again (after play), Your radio stations (after like), Near You, International, format rows; tiles → station info.

---

## Phase 5 — History, library, and playing indicators polish — **done**

**Goal:** All radio history surfaces show tiles and playing state consistently.

1. **`TvLibraryHistorySwimlane`** + **`TvLibraryHistorySection`** — Add `playingRadioStationId`; highlight tile when active session is radio
2. **`TvListenAgainSwimlane`** — Support radio playing highlight (if not already via shared tile resolver paths)
3. **`BroadHome`** — Optional `playingItemId` on top radio swimlane when radio session active
4. **`LimitedHomeStackedBody`** — `playingItemId` for radio taxonomy tiles
5. **`ListenAgainMore`** / **`MyLibraryHistoryMore`** — Confirm radio tiles navigate to `/radio/:id` (shared `resolveListenAgainItems` already paths correctly)
6. **`docs/tv/figma-nodes.md`** — Add in-car radio info node + note TV player uses music player frame structurally
7. **`docs/tv/Plans/plan.md`** — Mark radio stations slice in progress / done

---

## Deferred (explicit backlog)

| Item | Notes |
|------|--------|
| **Radio mini player** | `TvMiniPlayer` variant; see [`Tv-miniplayer-implementation-plan.md`](./Tv-miniplayer-implementation-plan.md) |
| **Cast / Share on player** | Out of TV scope |
| **In-player visual ad strip** | Same open question as music TV player |
| **Provider brand row on radio player** | Defer unless design adds |
| **Full International geo data** | Prototype stays Canada / Alberta path; browse already stubbed |

---

## File checklist (expected touch list)

| File | Phase |
|------|-------|
| `apps/tv/src/pages/BroadHome.jsx` | 0, 5 |
| `apps/tv/src/pages/SwimlaneMore.jsx` | 0 |
| `apps/tv/src/App.jsx` | 0, 1, 2, 3 |
| `apps/tv/src/context/PlaybackContext.jsx` | 1 |
| `apps/tv/src/components/TvShell.jsx` | 1 |
| `apps/tv/src/pages/RadioStationInfo.jsx` + `.css` | 2 |
| `apps/tv/src/pages/RadioPlayer.jsx` + `.css` | 3 |
| `apps/tv/src/components/limited/LimitedHomeStackedBody.jsx` | 4, 5 |
| `apps/tv/src/pages/LimitedHome.jsx` | 4 |
| `apps/tv/src/utils/limitedHomeStackedLanes.js` | 4 (may split near-you / international helpers) |
| `apps/tv/src/components/library/TvLibraryHistorySwimlane.jsx` | 5 |
| `apps/tv/src/components/library/TvLibraryHistorySection.jsx` | 5 |
| `docs/tv/figma-nodes.md` | 5 |
| `docs/tv/Plans/plan.md` | 5 |

**No changes expected** to `packages/shared/data/radioStations.js` or browse components unless a bug is found during click-through.

---

## Acceptance checklist (end-to-end)

- [x] Broad Home — Top radio stations → info; More → grid → info
- [x] Search Radio — category / International / grids → info
- [x] Station info — Play, Like, description, metadata match in-car layout (TV buttons)
- [x] Play — full player, preroll for guest/freeStingray, play/pause, Live label, no skip
- [x] Info from player returns to station info
- [x] Like on info + player; guest sees account-required dialog
- [x] My Library — Radio history populates after listen; clear works
- [x] My Library — Your radio stations (when liked) → info
- [x] Limited Home — Radio tab: Listen again + Your radio stations + Near You + International + formats
- [x] Invalid station id redirects to `/search/radio`
- [x] `npm run build` passes for `apps/tv`

---

## Suggested implementation order

```
Phase 0 (Home wiring + More)
  → Phase 1 (session + routes)
  → Phase 2 (Radio info)
  → Phase 3 (Radio player + history)
  → Phase 4 (Limited Home radio tab)
  → Phase 5 (polish + docs)
```

Phases 2 and 1 can be one PR if preferred; Phase 3 should follow Phase 2 so Play is not a dead end.
