# React learning — TV prototype (`apps/tv`)

Project-specific, **append-only** notes for React and TV navigation patterns as you build the Stingray Music TV prototype. Mobile notes live in **`docs/mobile/react-learning.md`**.

**Implementation plans:** **`docs/tv/Plans/plan.md`**, **`docs/tv/Plans/cards-and-swimlanes-implementation-plan.md`**.

---

## Monorepo: TV app vs mobile app

- **`apps/tv/`** — 1920 x 1080, D-pad focus, collapsible left nav, transform-based swimlanes.
- **`apps/mobile/`** — phone frame, touch scroll, bottom nav.
- **`packages/shared/`** — mock catalogs both apps import (starting with `musicChannels.js`).

Same product data; **different** presentation components. Do not copy mobile `ContentSwimlane` into TV.

---

## Entries

## 2026-06-04 — TV player transport (`TvPlayerTransport`)

- **Play/pause** uses `public/play.svg` and `public/pause.svg` (icon only — no mobile circular `playerCtrl*` frame).
- **Rounded rect** hit target: `--tv-player-play-pause-size` (80px), `--tv-player-play-pause-radius` (10px), 10px focus ring per Figma `23:20013`.
- **Centering:** `grid-template-columns: 1fr auto 1fr` (same as mobile `music-player__transport`) — play/pause stays on the horizontal center of the bar; optional `startSlot` / `endSlot` for podcast rewind, skip, speed, etc.

## 2026-06-04 — TV music player + preroll

- **Route:** `/music/:channelId/play` — `MusicPlayerRoute` remounts with `key={channelId-userType}` (same as mobile).
- **Entry:** Channel Info **Play** → `navigate(.../play)`; **Esc** → `GlobalTvKeys` `navigate(-1)` (preroll / account / skip dialogs use `aria-modal="true"` so Esc dismisses the dialog first).
- **Tier rules:** `@sm-mpr/shared/utils/userTierRules.js` (`showPlayerPreroll`) and `userContentGates.js` (`userMayLikeMusicRadio`) — no duplicate strings in player files.
- **Providers:** `GuestPrerollGraceProvider`, `PlaybackProvider` (no `--mini-player-offset` yet), `GuestMusicSkipProvider`, `LikesProvider`, `AccountRequiredDialogProvider` in `App.jsx`.
- **Preroll:** `TvPlayerPrerollAd` — 15s + Skip; grace from `GuestPrerollGraceContext`.
- **Focus groups on player:** meta (info, like) → transport (play/pause, skip); `navEnterEnabled: false`; default focus **play/pause** after preroll. Primary nav hidden on play route (`TvShell`).
- **Preview types (Phase 6):** `/settings/user-type` — pick a tier (stays on page, like mobile Subscription), status line shows preroll yes/no, **Open music player** runs QA on first catalog channel. `GuestPrerollGraceProvider` uses `key={userType}` so switching guest ↔ subscribed shows preroll again without a full reload.
- **Mini player (Phase 7):** `TvMiniPlayer` in `PrimaryNav` slot — collapsed 80px thumb vs expanded **500px** row + title/artist; **no transport controls**. Focus uses `--tv-focus-ring-*` (collapsed: ring on thumb wrap; expanded: ring on row), not Figma container border. Nav index **0** = mini when `miniPlayerVisible` (same roster as Home / Search / Library). **`PrimaryNav`** listens for **Up/Down/Right** at `window` capture while `focusZone === nav` so D-pad always moves `navFocusedIndex`, not only the focused button. **Enter** on mini opens full player with `expandFromMiniPlayer` state.

## 2026-06-09 — Vertical parked navigation spec (canonical doc)

**`docs/tv/vertical-parked-navigation.md`** — product rules (`parkY`, top/bottom unpark, chrome vs scroll inner), hook contract, integration checklist, Home vs Search notes. **Focus order** (search field, tabs, body rows) is separate from **scroll geometry** (only nodes inside `.tv-home__scroll` inner get `translateY`). Landing sets `parkY` from the **focused element**, not a group box; vertical steps stay linear `+1`/`-1` (no skip-nav). Geometry is element-based; scroll retriggers on **group** change (one horizontal band per group).

## 2026-06-03 — Home vertical parked focus (ring top)

`useTvVerticalGroupScroll` (alias **`useTvVerticalParkedScroll`**) keeps the **focus ring top** on a fixed **`parkY`** line (measured once per screen visit from the landing control). Content scrolls via **`translateY`** while the ring stays visually still — same idea as **`VariableSwimlane`** / Channel Info tags, on the Y axis. Geometry lives in **`tvFocusGeometry.js`**. **Down:** scroll until bottom + **`--tv-scroll-park-down-bias`** is visible, then the ring unparks toward the last focusable group. **Up:** reverse at bottom, then parked scroll until **`offsetY === 0`**, then unpark toward the top. Pass **`getFocusedElement`**, **`lastFocusableGroupIndex`** (skip ad-only rows), and **`landingGroupIndex`**. Full spec: **`docs/tv/vertical-parked-navigation.md`**.

## 2026-06-03 — Home vertical scroll parking (row fit) — superseded

Previous row-fit scroll in `useTvVerticalGroupScroll` replaced by parked ring-top behavior (entry above).

## 2026-06-03 — Home ads + user types (mobile parity)

- **Tier rules:** `@sm-mpr/shared/utils/userTierRules.js` (`showVisualAds`, `showPlayerPreroll`, etc.) — same as mobile.
- **In-feed ad:** `TvSwimlaneBannerAd` on broad Home between podcasts and radio rails (matches mobile `Home.jsx`).
- **In-feed banner ad:** `TvSwimlaneBannerAd` on broad Home and limited Home **stacked** layout (mid-stack); not used on limited filter layout A.
- **Preview types:** `/settings/user-type` — use Home **Upgrade** or navigate directly; pick **Subscribed** to hide the in-feed banner.

## 2026-05-27 — Monorepo shared mock data (`@sm-mpr/shared`)

Music catalog modules live in **`packages/shared/data/`** (`musicChannels.js`, `musicBrowseTaxonomy.js`, plus IA JSON). Territory helpers live in **`packages/shared/constants/`**. Mobile keeps thin **re-export** shims under `apps/mobile/src/data/` so existing imports keep working; TV imports from **`@sm-mpr/shared`** directly.

Run **`npm install`** at the repo root after pulling so workspaces link the package.

## 2026-05-27 — TV viewport frame (`TvViewport`)

The TV app renders inside a fixed **1920 x 1080** frame (`.tv-viewport`) centered in the browser. The outer body stays dark so you can see the TV "bezel." Tokens in **`apps/tv/src/index.css`** match Figma Home light theme (`#fafafa` background).

## 2026-05-27 — Territory toggle (wordmark click)

**`TerritoryProvider`** defaults to **broad** catalog. Click **STINGRAY MUSIC** in the home header to toggle limited / broad (mouse only; `tabIndex={-1}` so D-pad will not land on it). Uses the same **`sessionStorage`** key as mobile.

## 2026-05-27 — TV focus zones (nav vs content)

D-pad focus splits into two **zones**: **`nav`** (collapsible primary nav) and **`content`** (the active screen). **`TvNavFocusContext`** tracks the zone; **`ScreenMemoryContext`** remembers each screen's vertical group index; **`GroupFocusNavigationContext`** remembers horizontal index per group.

- **Up** from content (first group) or **Left** from the first demo button enters the nav (nav expands).
- **Right** from nav, or **Down** on the last nav item, enters content (nav collapses) and restores the last focused button.
- **Tab** is blocked globally (except text fields).

Files: `context/TvNavFocusContext.jsx`, `hooks/useScreenContentFocus.js`, `components/nav/PrimaryNav.jsx`.

## 2026-05-27 — KeyboardWrapper (render prop)

**`KeyboardWrapper`** wraps **`FocusableButton`** with a **render prop** `(focusProps) => ...` so ref and `onKeyDown` reach the button. Handles **Enter**, **Space**, and arrow keys. Pattern adapted from SMTV03; see `components/focus/KeyboardWrapper.jsx`.

## 2026-05-27 — ContentTileCard (TV square tile)

**`ContentTileCard`** is the TV square tile: **308px** thumbnail, **16px** gap, **24px** title, **10px** focus border on the thumbnail wrapper (Figma Home). **`MusicChannelCard`** maps shared catalog data; **`FocusableTile`** combines **`KeyboardWrapper`** + tile for D-pad rows.

**`playing`** adds a dark scrim + animated equalizer bars on the thumbnail. Home preview row shows the first catalog channel as playing. Files: `components/cards/ContentTileCard.jsx`, `MusicChannelCard.jsx`.

## 2026-05-27 — FixedSwimlane (transform parking)

**`FixedSwimlane`** slides a row with **`translateX`** so the focused **308px** card stays in view (SMTV03 pattern). **Left/Right** are handled on `window` when the swimlane group is active; **Up/Down/Enter** stay on **`KeyboardWrapper`** + cards. **`SwimlaneRow`** adds the inset title; **`SwimlaneMoreTile`** is the trailing square when `sourceCount > 9` (`SWIMLANE_CARD_MAX`). Home **Most popular music** row uses **`MusicChannelSwimlane`**.

## 2026-05-27 — Home: two music swimlanes (Phase 4)

Broad Home stacks **Most popular music** (group 0) and **Recommendations** (group 1) — same titles and shared data as mobile. **`useScreenContentFocus("home")`** sets **`groupCount: 2`** and **`swimlaneGroups: [0, 1]`** so both rows own horizontal scroll; **Up** from rail 1 enters nav; **Down** moves between rails. **Enter** on a channel opens **`/music/:channelId`** (`MusicChannelInfo.jsx` stub). **More** tiles route to **`/more/music`** or **`/more/recommendations`**. Screen memory keeps each rail's horizontal index when you Esc back from info or More stubs.

## 2026-05-27 — ContentGrid and More screens (Phase 5)

**`ContentGrid`** is the 2D card grid for More routes (adapted from SMTV03 `ChannelGrid`). Column count comes from **`getTvGridColumnCount()`** in **`tvLayout.js`**: viewport minus nav rail minus content insets, floored to fit **308px** cards with **30px** gaps (**4 columns** at default tokens). Arrow keys move **`{ row, col }`**; **Up** or **Left** on the first row/column escapes to nav. **`ScreenMemoryContext`** stores **`gridFocusedPosition`** per More screen (`more-music`, `more-recommendations`). **`MusicChannelInfo`** adds a focusable **Play** stub, description, tags, and a **Related** swimlane from shared **`relatedChannels`**.

## 2026-05-27 — Swimlane restore without scroll flash

When Esc returns to Home with a **parked** swimlane index (e.g. **More** tile), **`FixedSwimlane`** must not animate the row into place. **`useLayoutEffect`** measures viewport width and applies the final **`translateX`** before paint; the row stays **`visibility: hidden`** until width is known. CSS **`transition`** is off on that first frame and turns on only after **`requestAnimationFrame`** so in-place Left/Right still animates.

## 2026-05-27 — Vertical nav at screen level (`useScreenContentFocus`)

Swimlanes handle **Left/Right** on `window` when their group is active, so those keys work without DOM focus on a card. **Up/Down** used to rely on **`KeyboardWrapper`** on the focused tile — after Esc back from a child route, DOM focus was often missing until Left/Right ran. **`useScreenContentFocus`** now registers a capture-phase **Up/Down** listener in the content zone, plus **`registerItemRef`** / **`requestAnimationFrame`** retries to restore DOM focus for Enter.

## 2026-05-27 — Limited catalog Home (Phase 6)

**`Home`** switches on **`TerritoryContext`**: **`BroadHome`** (two music rails, screen memory **`home-broad`**) vs **`LimitedHome`** (genre **`GenreFilterSwimlane`** + one **`MusicChannelSwimlane`**, memory **`home-limited`**). Filters come from shared **`MUSIC_GENRES`** (mobile LimitedBrowse IA). **`VariableSwimlane`** measures filter button widths and parks with **`translateX`** like **`FixedSwimlane`**. While the filter group is focused, offset follows **`focusedIndex`**; when focus is on the channel rail, **`ensureActiveVisible`** scrolls to **`activeIndex`** without moving focus. **`FilterButton`** uses SMTV03-style rounded rects (**8px** radius, **10px** outline focus ring) — not mobile pill chips. More from a genre rail opens **`/more/music/:categoryId`**.

## 2026-06-09 — Search shell (Phases 0–1)

- **Shared search:** `searchBrowsePaths`, `searchCatalog`, `musicArtists`, `radioInternationalBrowse` live in **`@sm-mpr/shared`**; mobile re-exports. TV and mobile share query matching and browse-tab session keys.
- **Routes:** `/search` → redirect (broad) or limited shell; `/search/music` | `podcasts` | `radio`; drill stubs under `/search/browse/*` and `/search/more/*`.
- **`TvSearchBrowseHeader`:** fixed frosted bar; **`ResizeObserver`** sets **`--tv-search-header-offset`** on `<html>`. Focus group **0**: search `<input>` (index 0), **Clear** (1 when non-empty), content-type tabs (browse only). Left from field → primary nav.
- **Search mode:** first non-whitespace character hides tabs; body swaps to results placeholder (Phase 5). **`?q=`** on URL (debounced) so Back restores the query.
- **Search text entry:** PC keyboard only; no on-screen keyboard overlay in this prototype (OS keyboard out of scope).
- **Header focus rows:** Group **0** = search field + Clear (Left/Right). Group **1** = Music / Podcasts / Radio tabs (Left/Right; **Left** on Music enters nav). **Down** / **Up** move between rows (`SEARCH_FOCUS` in `searchFocusGroups.js`).
- **PrimaryNav Search:** enter from Home uses **`resolveBroadSearchBrowseTab`**; re-tap on `/search/*` is **no-op** (focus only). **`Search.jsx`:** hydrate `query` from URL in **`useLayoutEffect`** on **`location.key`** change + skip one URL-sync pass so stale **`debouncedQuery`** does not rewrite **`?q=`**.

## 2026-06-09 — Home vertical scroll survives tab switches

- **Problem:** `ScreenMemoryContext` kept **focus group + card index** (`home-broad`) but **`useTvVerticalGroupScroll`** reset **`offsetY`** on unmount (Home → Search → Home).
- **Fix:** Optional **`screenId`** on the hook persists **`scrollOffsetY`** and **`parkLineY`** in the same screen memory bucket. On remount, initial transform uses saved offset; **`restoreVisit`** re-parks before paint if needed. **`BroadHome`** / **`LimitedHome`** pass **`home-broad`** / **`home-limited`**.
- **Transitions after return:** Restored **`parkLineY`** skipped the path that adds **`tv-home__scroll-inner--animated`**. **`scheduleScrollTransition()`** runs when park line already exists (restored or remeasured), after the first paint — same double **`rAF`** as first visit.

## 2026-06-09 — Limited Home layout B (stacked swimlanes)

- **Default:** `LIMITED_HOME_LAYOUT.stacked` in **`sessionStorage`** (`limitedHomeLayout.js`). **Layout A** (`filter`) kept for stakeholder AB — toggle on **`/settings/user-type`** (click only, `tabIndex={-1}`).
- **Body:** **`LimitedHomeStackedBody`** — one **`MusicChannelSwimlane`** or **`ContentTileSwimlane`** per taxonomy row (mobile **`LimitedBrowseTaxonomyRails`** IA); **`TvSwimlaneBannerAd`** after the **second** lane.
- **Header B:** **`TvLimitedHomeHeaderStacked`** embeds **`TvMiniPlayer`** (expanded) when playback is active; **Esc** on Home focuses mini player via **`LimitedHomeEscContext`** (wins over global back only while handler is registered).
- **Focus:** dynamic group count from **`buildLimitedHomeStackedLanes`** + **`useTvVerticalGroupScroll`** (same parked-scroll pattern as broad Home).

---

## 2026-06-09 — Limited Home header (search affordance)

Limited catalog hides **`PrimaryNav`**, so Search must live in the header. **`TvLimitedHomeHeader`** (Figma `15831:37572`) uses a **three-column grid** (`1fr auto 1fr`): wordmark start, **`TvHomeContentSwitcher`** center, actions end (Upgrade or provider logo + info + search icons). The center column stays centered when Upgrade is absent because end/start columns share equal flex tracks.

- **Search icon** → **`/search`** (limited shell).
- **Info icon** → **`/settings/user-type`** (prototype settings).
- **D-pad:** header is focus group **0**; tabs and icons are one horizontal index row (Left/Right).

---

## 2026-06-12 — TV podcasts (Phases 0–10)

**Plan:** [`docs/tv/Plans/Podcasts-implementation-plan.md`](./Plans/Podcasts-implementation-plan.md)  
**Mobile tutorial (shared behavior):** [`docs/mobile/Tutorials/Podcasts-and-episodes-deep-dive-tutorial.md`](../mobile/Tutorials/Podcasts-and-episodes-deep-dive-tutorial.md)

### Podcast Info + episode row focus

- **Routes:** `/podcast/:podcastId` (`PodcastInfo`), `/podcast/:podcastId/play/:episodeId` (`PodcastPlayer`). Invalid ids → `<Navigate to="/" />`.
- **Focus groups on info:** group **0** = Play + Subscribe (Left/Right); optional description **More** group; each episode row is its own vertical group with **3 horizontal slots** (`EPISODE_FOCUS_SLOTS` in `episodeFocusSlots.js`): body → bookmark → download.
- **Enter on body** navigates to play route; **Enter on actions** toggles library state (with `userMay*` gates → `TvAccountRequiredDialog`). Not a swimlane — **`useScreenContentFocus`** owns Up/Down; Left/Right move within the row via `handleMoveLeft` / `handleMoveRight`.
- **Components:** `TvEpisodeListItem` (list), `TvEpisodeCard` (656px swimlane/grid), shared `TvEpisodeActionButtons.jsx`.

### Podcast session + mini player

- **`PodcastUserStateProvider`** in `@sm-mpr/shared/context/PodcastUserStateContext.jsx` — subscribe, bookmark, download, progress (same reducer as mobile).
- **`PlaybackContext.upsertPodcastSession`** — called from `PodcastPlayer` after preroll gate; sets `session.variant === "podcasts"`, `fullPlayerPath`, titles, thumb.
- **Mini:** `shouldShowTvMiniPlayer` + `PrimaryNav` index 0; Enter opens full player with `{ expandFromMiniPlayer: true }` (skips repeat preroll when grace applies). **`TvShell`** hides nav on play URLs.
- **Listen history:** `recordPodcastShowListen` after preroll + play or >5% progress stub.

### Library swimlanes (Phase 7)

- **Limited:** Home → Podcasts tab, before taxonomy (`TvLibraryPodcastUserSwimlanes`).
- **Broad:** **My Library** only (not Search browse). More drill: `/search/browse/podcasts/library/:librarySection`.

---

## 2026-06-12 — Listen again on TV (Phase 9)

- **Shared** `ListenHistoryContext` + `listenAgainItems.js` in `@sm-mpr/shared`; TV mounts provider in `App.jsx`.
- **`TvListenAgainSwimlane`** — compact tiles (`--tv-card-size-compact`, 192px), mixed music/podcast/radio. Trailing tile: **Clear** when `<= 9` items, **More** when `10+` (`showsListenAgainMoreTile` in `swimlaneUtils.js`).
- **Clear speed bump:** `TvListenHistoryClearDialog` — mobile `AppStackedDialog` layout; **`createPortal`** to `.tv-viewport` so `transform` on scroll parents does not clip the panel.
- **Grid:** `/more/listen-again` — header **Clear** (top right); Up from first row focuses Clear; **`ContentGrid`** skips window Enter when `focused={false}` so header buttons work.
- **After clear:** `useRestoreFocusAfterListenAgainClear` — focus card 0 on the next swimlane; `FixedSwimlane` horizontal offset resets with index 0.

---

## 2026-06-12 — MixedWidthSwimlane (variable card widths)

- **`FixedSwimlane`** — one `slotWidth` for every slot; keep using it for uniform rows (music channels, podcast tiles, Listen again compact tiles).
- **`MixedWidthSwimlane`** — same `slotCount` + `renderSlot` API as `FixedSwimlane`, but **measures each slot** after layout (`ResizeObserver`) and parks scroll with **`calcMeasuredSwimlaneOffset`** (`swimlaneScroll.js`, shared with **`VariableSwimlane`** filter pills).
- **`SwimlaneRow`** — pass **`mixedWidth`** to swap in `MixedWidthSwimlane` without duplicating title chrome.
- **First use:** **`TvEpisodeCardSwimlane`** — wide episode cards (656px) + square trailing **Clear** / **More** (`--tv-card-size`); horizontal scroll stays correct when focus reaches the last slot.

---

## 2026-06-09 — Search music browse (Phase 2)

- **Broad lineup:** **`TvSearchMusicVibeSection`** mirrors mobile **`SearchMusicVibeBrowseRail`** — **`GenreFilterSwimlane`** (pills) + either **`TvSearchLabelTileSwimlane`** (sub-tags) or **`MusicChannelSwimlane`** (leaf channels + More). Focus groups start at **`SEARCH_FOCUS.bodyStart` (2)**; each vibe uses two groups (pills, cards).
- **Limited lineup:** one horizontal genre row (**`MUSIC_GENRES`** → **`/search/browse/music/category/:id`**), not the Limited Home filter pattern.
- **Pill memory:** **`CategoryRailMemoryProvider`** + **`useCategoryRailMemorySlug`** (same session keys as mobile).
- **Drill-downs:** **`TvSearchBrowseDrillPage`** wraps **`ContentGrid`** (4 columns); Esc → **`navigate(-1)`** via **`GlobalTvKeys`**.
- **Vertical scroll:** Search browse body reuses **`useTvVerticalGroupScroll`** with screen memory **`search`** (same Home tab-switch fix).
