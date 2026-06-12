# TV Podcasts — incremental implementation plan

Living plan for **podcasts and episodes** in **`apps/tv/`**, mirroring the **mobile prototype behavior** (subscribe, bookmark, download, resume, full player, mini player) while using **TV layout, D-pad focus, and Figma TV frames**. Work in **phases**; each phase should be clickable before starting the next.

**Companion docs**

- Mobile plan (behavior reference): [`docs/mobile/Plans/Podcasts-implementation-plan.md`](../../mobile/Plans/Podcasts-implementation-plan.md)
- Mobile story: [`docs/mobile/Stories/Podcasts-story.md`](../../mobile/Stories/Podcasts-story.md)
- TV coordinator: [`plan.md`](./plan.md)
- Music player (pattern to copy): [`Music-player-implementation-plan.md`](./Music-player-implementation-plan.md), [`Tv-miniplayer-implementation-plan.md`](./Tv-miniplayer-implementation-plan.md)
- Search entry points (already wired to `/podcast/:id` stub): [`Search-Browse-implementation-plan.md`](./Search-Browse-implementation-plan.md)
- Focus model: [`vertical-parked-navigation.md`](../vertical-parked-navigation.md)

**No real audio** — playback is **UI state only** (progress, play/pause, speed label, seek stubs), same as mobile.

---

## Decisions to lock (match mobile unless noted)

| Topic | Choice | TV notes |
|--------|--------|----------|
| **Routes** | `/podcast/:podcastId` (info) · `/podcast/:podcastId/play/:episodeId` (full player) | Same as mobile; invalid ids → `Navigate` home |
| **Catalog** | `@sm-mpr/shared/data/podcasts.js` | Already used on TV Home / Search |
| **Library state** | In-memory **`PodcastUserStateContext`** (subscribe, bookmark, download, progress) | Reset on reload OK |
| **Playback speed** | Tap cycles `PODCAST_SPEED_STEPS` (`0.6` … `2`, wrap) | Hoist constant to **`packages/shared`** |
| **Preroll** | `showPlayerPreroll(userType)` + `GuestPrerollGraceContext` + `expandFromMiniPlayer` | Reuse **`TvPlayerPrerollAd`** |
| **Account gates** | `userMaySubscribePodcasts`, `userMayBookmarkEpisodes`, `userMayDownloadEpisodesOffline` from **`@sm-mpr/shared/utils/userContentGates.js`** | Already on TV for music likes |
| **Nav chrome** | Hide **`PrimaryNav`** on full podcast player (like music `/play`) | Extend **`TvShell`** regex |
| **Episode list layout on info** | **List row** (`7545:22722`) as default | **Card** (`10841:24500`) reserved for grid / library surfaces |
| **Mini player** | Shortcut to full player only (no ±15/+30 on TV nav) | Differs from mobile mini transport |
| **Listen again / history** | Optional late phase | Mobile uses **`ListenHistoryContext`**; TV My Library is thin today |

**Playback speed sequence (tap advances, wraps):** `0.6` → `0.8` → `1` → `1.2` → `1.4` → `1.6` → `1.8` → `2` → `0.6` — display with `x` suffix.

---

## Figma anchors (TV file `DfwtFG53ud7EHhvlPutvI8`)

| What | Node | URL |
|------|------|-----|
| **Podcast info** (hero + episode list) | `7551:27042` | [Open](https://www.figma.com/design/DfwtFG53ud7EHhvlPutvI8/SM-HTML-TV-MPR?node-id=7551-27042) |
| **Episode list row** | `7545:22722` | [Open](https://www.figma.com/design/DfwtFG53ud7EHhvlPutvI8/SM-HTML-TV-MPR?node-id=7545-22722) |
| **Episode card** (~2 channel-card width) | `10841:24500` | [Open](https://www.figma.com/design/DfwtFG53ud7EHhvlPutvI8/SM-HTML-TV-MPR?node-id=10841-24500) |
| **Podcast player (primary)** | `7531:342033` | [Open](https://www.figma.com/design/DfwtFG53ud7EHhvlPutvI8/SM-HTML-TV-MPR?node-id=7531-342033) |
| **Music player** (structural parity) | `23:20013` | [Open](https://www.figma.com/design/DfwtFG53ud7EHhvlPutvI8/SM-HTML-TV-MPR?node-id=23-20013) |
| **Nav mini player** | `15521:27316` | [Open](https://www.figma.com/design/DfwtFG53ud7EHhvlPutvI8/SM-HTML-TV-MPR?node-id=15521-27316) |

**Measurements to tokenize** (from MCP pull):

**Podcast info (`7551:27042`)**

- Body: `px 100px`, top `pt 110px`, column `gap 70px`, max content ~`1240px`
- Hero row: `400×400` art (`radius 30px`) + text column `gap 40px`
- Title: Roboto Black `34px`; description: Regular `28px`, max width `800px`
- Subscribe pill: height `80px`, icon `40px`, border `2px`, horizontal padding `24px` / `34px`
- Episode section: vertical `gap 30px` between rows

**Episode list row (`7545:22722`)**

- Row: `max-w 1240px`, `p 20px`, `gap 25px`, `radius 30px`, fill `onbckg 10%`
- Thumb area `160×160` (image `120×120`, `radius 10px`)
- Title Semibold `28px`; meta line Regular `28px` + `30px` status dot
- Progress bar `4px` (hidden when not in progress)
- Bookmark / download actions `80×80`, `gap 26px`

**Episode card (`10841:24500`)**

- Card: `656×308`, `p 30px`, `gap 20px`, `radius 30px`
- Thumb `100×100` top-left; actions top-right
- Same typography / meta / progress as list row

**Podcast player frame:** `7531:342033` — show title, info + subscribe, cover 360px, episode TTA, progress, speed / −15 / play / +30 / bookmark.

---

## Current TV state (inventory)

| Piece | Status |
|-------|--------|
| Shared `podcasts.js`, `getPodcastById`, `findPodcastAndEpisode` | **Done** |
| Home / Search / Limited Home → `/podcast/:id` | **Done** (lands on stub) |
| `/podcast/:podcastId` route | **Stub** — `TvContentTypeUnavailable` |
| `/podcast/.../play/...` route | **Missing** |
| `PodcastUserStateContext` | **Mobile only** (`apps/mobile/src/context/`) |
| `PODCAST_SPEED_STEPS` | **Mobile only** (`apps/mobile/src/constants/podcastPlayback.js`) |
| `PlaybackContext.upsertPodcastSession` | **Mobile only**; TV has music session only |
| `TvMiniPlayer` podcast variant | **Not wired** (`session.variant === "music"` only) |
| `TvEpisodeRow` | **Search results only** (no bookmark/download) |
| `TvPlayerPrerollAd`, grace, tier gates | **Done** (music player) |
| Podcast browse library tiles (Continue listening, Your Podcasts, …) | **Deferred** in Search plan Phase 7 until context ships |

---

## Mobile vs TV — what to share vs rebuild

| Area | Share (`@sm-mpr/shared` or copy logic) | TV-only |
|------|----------------------------------------|---------|
| Catalog + lookups | `podcasts.js` helpers | — |
| Tier / gate functions | `userContentGates.js`, `userTierRules.js` | — |
| Duration helpers | Hoist `podcastDuration.js` from mobile if not shared | — |
| Speed steps | Hoist `PODCAST_SPEED_STEPS` | — |
| `PodcastUserState` reducer shape | **Prefer shared provider module** or duplicate thin TV context importing shared `deriveContinueListening` | Mount in `App.jsx` |
| Pages / components | — | `PodcastInfo`, `PodcastPlayer`, `TvEpisodeListItem`, `TvEpisodeCard` |
| Focus | — | `useScreenContentFocus`, `KeyboardWrapper`, vertical groups |
| Shell | — | `TvShell` hide nav; `PrimaryNav` mini player |

---

## Phase 0 — Shared foundations + routes (small, unblock everything) — **done**

**Goal:** TV can resolve podcast ids and register play routes without UI.

1. **Hoist to `packages/shared`** (mobile re-export shims):
   - `constants/podcastPlayback.js` → `PODCAST_SPEED_STEPS`
   - `utils/podcastDuration.js` → `formatPlaybackClock`, `approxDurationSecondsFromLabel`
   - Optional: extract **`deriveContinueListening`** + types from mobile `PodcastUserStateContext` into `packages/shared/podcasts/podcastUserState.js` (pure helpers only)
2. **`App.jsx`:** Replace podcast stub with real page placeholder component; add `/podcast/:podcastId/play/:episodeId` route + `PodcastPlayerRoute` with `key={`${podcastId}-${episodeId}-${userType}`}` (mirror music).
3. **`TvShell`:** Hide nav on `/podcast/:podcastId/play/:episodeId` (extend `FULL_PLAYER_PATH` regex).
4. **`PrimaryNav` `isNavItemActive`:** Treat `/podcast/*` as Home-adjacent (like `/music/*`) when updating nav highlight.

**Deliverable:** Routes exist; invalid podcast/episode redirects home; nav hides on play URL.

**Click test:** Manually navigate to `/podcast/<valid-id>` — still stub or empty shell until Phase 1.

---

## Phase 1 — `PodcastUserStateContext` on TV — **done** (shipped in Phase 0)

**Goal:** Same stub library semantics as mobile.

1. Add **`PodcastUserStateProvider`** to TV (`apps/tv/src/context/`) — start by **copying mobile provider** and switching imports to `@sm-mpr/shared/data/podcasts.js`.
2. Mount in **`App.jsx`** inside router (beside `PlaybackProvider`).
3. Expose: `toggleSubscribe`, `toggleBookmark`, `toggleDownload`, `setEpisodeProgress`, `getEpisodeProgress`, `isSubscribed`, `isBookmarked`, `isDownloaded`, derived lists (`continueListening`, `subscribedPodcasts`, `bookmarkedEpisodes`, `downloadedEpisodes`, `newEpisodeRows`).

**Deliverable:** Dev-only toggle buttons or temporary test page can flip subscribe/bookmark and see derived lists update.

---

## Phase 2 — Podcast Info page (`/podcast/:podcastId`) — **done**

**Goal:** Figma **`7551:27042`** — hero, Subscribe, description, vertical episode list.

**Structure (mirror `MusicChannelInfo.jsx` focus patterns):**

| Focus group | Content |
|-------------|---------|
| 0 | Subscribe (+ Share stub optional) |
| 1 | Description overflow → dialog (reuse `ChannelInfoDescription` pattern) |
| 2+ | Episode rows (one group per row **or** one scrollable group — prefer **one row = one focus index** for D-pad down) |

**Implementation steps**

1. **`PodcastInfo.jsx`** — `getPodcastById`, invalid → `<Navigate to="/" />`.
2. Hero: `400px` art, title, subscribe button (toggle + `userMaySubscribePodcasts` → `TvAccountRequiredDialog`).
3. Description clamp + “More…” dialog (reuse channel-info description components where possible).
4. Episode list uses **`TvEpisodeListItem`** (Phase 3) — row body **Enter** → `navigate(/podcast/:id/play/:episodeId)`.
5. **Resume:** If `getEpisodeProgress(episodeId) > 0`, show progress bar on row; optional stub resume chip on row (mobile `EpisodeCard` parity).
6. Bookmark / download on row call context toggles with account gates (actions are separate focus targets within row — Left/Right inside row).

**Deliverable:** Home → podcast tile → **Podcast Info** with real data; Subscribe toggles; episode row opens play route (player can be shell).

---

## Phase 3 — Episode UI components — **partial** (`TvEpisodeListItem` done; `TvEpisodeCard` backlog)

**Goal:** Reusable TV episode surfaces for info, search, and later library grids.

### `TvEpisodeListItem` — Figma `7545:22722` — **done**

- Props: episode, show title (optional), `progressFraction`, `isBookmarked`, `isDownloaded`, `isNew`, focus props
- Variants: new dot (accent), in-progress (progress visible), downloaded (clear-download icon)
- Separate focusable actions: bookmark, download (do not navigate on action activate)
- Reuse / extend **`TvEpisodeRow`** CSS where sensible; info page row is **wider** and includes actions

### `TvEpisodeCard` — Figma `10841:24500`

- Same data props; card layout for **2-column grids** (~`656px` width at default tokens)
- Use later in: bookmarked episodes grid, downloaded episodes, Search More episodes (if product wants cards vs list)

### Icons

- Reuse mobile mask pattern (`public/bookmarkEpisode.svg`, etc.) or TV icon masks consistent with `MusicChannelInfo` action icons

**Deliverable:** Storybook-style preview on Focus Demo **or** visible on Podcast Info list.

---

## Phase 4 — Full podcast player (`/podcast/:podcastId/play/:episodeId`)

**Goal:** Mobile **`PodcastPlayer`** behavior in **TV music player** chrome (`23:20013` structure).

**Feature checklist**

- [ ] Invalid ids → home redirect
- [ ] **`TvPlayerPrerollAd`** when `showPlayerPreroll(userType)` && !`expandFromMiniPlayer` && !`graceActive`
- [ ] Artwork (episode thumb), show title (subtitle), episode title (primary)
- [ ] Progress bar + elapsed / remaining (stub tick via `setEpisodeProgress`)
- [ ] Play / pause (UI only)
- [ ] **−15 s** / **+30 s** (adjust progress; clamp 0–1)
- [ ] **Speed** — tap cycles `PODCAST_SPEED_STEPS`, label `Nx`
- [ ] **Bookmark** toggle (gate + dialog)
- [ ] **Subscribe** shortcut (optional; mobile has it in player header)
- [ ] **Esc / Back** → `navigate(/podcast/:podcastId)` (collapse to info, session stays active — mirror mobile minimize)
- [ ] Focus groups: meta actions row, transport row (play, seek back, seek forward, speed)

**PlaybackContext:** On mount (after preroll gate), call **`upsertPodcastSession`** with episode title, show title, thumb, `fullPlayerPath`.

**Deliverable:** Info → episode → full player → Esc → back to info with session active.

---

## Phase 5 — `PlaybackContext` + mini player (podcast variant)

**Goal:** Same session loop as mobile Phase 5.

1. Extend TV **`PlaybackContext`**:
   - `upsertPodcastSession` (copy from mobile)
   - `hideMiniOnFullPlayer` includes `/podcast/.../play/...`
2. **`PrimaryNav`:** Show mini when `session.variant === "podcasts"` (same slot as music)
3. Mini tap → `navigate(fullPlayerPath, { state: { expandFromMiniPlayer: true } })`
4. Optional: podcast gradient token on mini (Figma music gradient today — product may want podcast accent later)

**Deliverable:** Play episode → full player (mini hidden) → Esc to info → **mini visible in nav** → Enter mini → full player without second preroll.

---

## Phase 6 — Entry points (stop landing on stubs)

Wire navigation that already points at `/podcast/:id`:

| Source | Work |
|--------|------|
| **`BroadHome.jsx`** | Popular podcasts swimlane — already navigates |
| **`LimitedHomeStackedBody.jsx`** | Category podcast lanes |
| **`TvSearchResultsBody`**, **`TvSearchCatalogMore`** | Podcast + episode hits |
| **`SearchPodcastsCategory`**, **`TvSearchPodcastsBrowseBody`** | Category drill grids |
| **`SwimlaneMore`** | If podcast more routes exist |

Episode hits from search: choose **show info** vs **play episode** — mobile episode rows on search go to show; keep parity unless UX asks for direct play.

**Deliverable:** No `TvContentTypeUnavailable` for podcasts in **full MPR** profile.

---

## Phase 7 — Search Browse library tiles (podcast-specific rows)

**Goal:** Mobile **Browse / Podcasts** personal sections on TV (`TvSearchPodcastsBrowseBody`).

Conditional rows (hide when empty), derived from `PodcastUserStateContext`:

| Row | Source | Layout |
|-----|--------|--------|
| Continue listening | `continueListening` | Horizontal swimlane; tile → **play** route with progress |
| Your Podcasts | `subscribedPodcasts` | `ContentTileSwimlane` |
| Your Episodes | `bookmarkedEpisodes` | `TvEpisodeCard` or list swimlane |
| New Episodes | `newEpisodeRows` | Episode cards |
| Downloaded Episodes | `downloadedEpisodes` | Episode cards |

Unblocks **Search plan Phase 7** item: “optional podcast library tiles when `PodcastUserStateContext` ships on TV”.

**Deliverable:** Subscribe on info → **Your Podcasts** row appears on Search → Podcasts browse.

---

## Phase 8 — Monetization + account dialogs parity

- **Guest / freeStingray:** preroll on episode play; upgrade CTA in player (reuse `TvUpgradeButton` pattern)
- **Subscribe / bookmark / download** blocked for guest → `TvAccountRequiredDialog` with correct copy keys (mirror mobile `openAccountRequiredDialog` reasons)
- **Subscribed:** no preroll, no upgrade strip
- **Visual ads:** follow TV policy (in-feed only today; no in-player strip unless design adds)

**Deliverable:** `/settings/user-type` preview matches mobile tier table for podcast play.

---

## Phase 9 — Listen history + My Library (optional / later)

- Port or share **`ListenHistoryContext`**; `recordPodcastShowListen` on meaningful play
- **Listen again** swimlane on TV Home (if / when Home ships mixed-type listen again)
- My Library podcast history segment (mobile has `LibraryPodcastUserSwimlanes`)

Defer until Phases 1–6 feel solid.

---

## Phase 10 — Docs + acceptance

- Add nodes to **`docs/tv/figma-nodes.md`**
- Update **`docs/tv/Plans/plan.md`** milestones
- Append **`docs/tv/react-learning.md`** (episode row focus, podcast session)
- Cross-link mobile tutorial: [`Podcasts-and-episodes-deep-dive-tutorial.md`](../../mobile/Tutorials/Podcasts-and-episodes-deep-dive-tutorial.md)

### Acceptance checklist (manual, after Phase 6 minimum)

1. Home podcast tile → **Podcast Info** → episode → **full player** (nav hidden) → **Esc** → info + **mini in nav** → mini Enter → full player (no repeat preroll when grace / expand flag applies).
2. **Subscribe** toggles; row appears in Search browse when Phase 7 done.
3. **Bookmark / download** on episode row update icon state; guest gets account dialog.
4. **Speed** cycles `0.6` … `2` and wraps.
5. **−15 / +30** move progress bar (stub).
6. Invalid `/podcast/bad` or bad episode id → **Home**.
7. **Music-only** profile still blocks podcast routes with unavailable copy (`ContentProfileContext`).

---

## Suggested implementation order

```
Phase 0 (shared hoist + routes + shell)
  → Phase 1 (PodcastUserStateContext)
  → Phase 3 (episode components) — can overlap Phase 2
  → Phase 2 (Podcast Info)
  → Phase 4 (Podcast Player)
  → Phase 5 (Playback + mini)
  → Phase 6 (entry points)
  → Phase 7 (browse library rows)
  → Phase 8 (monetization QA)
  → Phase 9 (history — optional)
  → Phase 10 (docs)
```

**Minimum vertical slice for a demo:** Phases **0 → 1 → 2 → 4 → 5 → 6** (info + play + mini + Home tile).

**Parallel-friendly:** Phase 3 components while Phase 1 lands; Phase 8 can be validated alongside Phase 4.

---

## Decisions locked (2026-06-12)

1. **Podcast full player** — Primary Figma [`7531:342033`](https://www.figma.com/design/DfwtFG53ud7EHhvlPutvI8/SM-HTML-TV-MPR?node-id=7531-342033); music player `23:20013` remains structural parity reference.
2. **Search episode hit** — **show info** (mobile + TV music parity); direct play is in-car only.
3. **Episode card vs list** — **list** on Podcast Info; **card** for library grids.
4. **Share / Cast** — **skip on TV** (no cast; users are already on TV).
5. **`PodcastUserStateProvider`** — **one shared provider** in `@sm-mpr/shared/context/PodcastUserStateContext.jsx`; mobile + TV re-export or import directly.

---

## Files likely touched (reference)

| New / major | Pattern source |
|-------------|----------------|
| `apps/tv/src/pages/PodcastInfo.jsx` | `MusicChannelInfo.jsx`, mobile `PodcastInfo.jsx` |
| `apps/tv/src/pages/PodcastPlayer.jsx` | `MusicPlayer.jsx`, mobile `PodcastPlayer.jsx` |
| `apps/tv/src/components/podcasts/TvEpisodeListItem.jsx` | Figma `7545:22722`, mobile `EpisodeCard.jsx` |
| `apps/tv/src/components/podcasts/TvEpisodeCard.jsx` | Figma `10841:24500` |
| `apps/tv/src/context/PodcastUserStateContext.jsx` | mobile same |
| `packages/shared/constants/podcastPlayback.js` | mobile `podcastPlayback.js` |
| `apps/tv/src/context/PlaybackContext.jsx` | mobile `PlaybackContext.jsx` |
| `apps/tv/src/components/nav/PrimaryNav.jsx` | podcast mini variant |
| `apps/tv/src/components/TvShell.jsx` | play route hide nav |
| `apps/tv/src/App.jsx` | routes + providers |

---

_Last updated: 2026-06-12 — initial TV plan; Figma nodes from user links + MCP._
