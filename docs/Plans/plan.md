# Stingray Music (MPR) mobile prototype — implementation plan

This file is the **running plan**: what we intend to do, what we have done, and what is next. Use it to **onboard after a break** and to keep scope visible without digging through chat history.

**See also:** `docs/Stories/Home-screen-story.md` (product story for Home), `docs/Stories/Search-story.md` (Search & Browse story + **Integration notes**), `docs/Plans/Search-Browse-implementation-plan.md` (ordered build plan + Figma table), **`docs/Plans/Info-screen-implementation-plan.md`** (Info tab + Contact/About + audio quality — **before implementation**), **`docs/Plans/My-Library-implementation-plan.md`** (bottom tab My Library hub, App Info swimlane, unified listen history vs Home Listen again), `docs/figma-nodes.md` (Figma links), `src/data/*` (mock catalogs).

---

## Goals (prototype)

- **Clickable** mobile-first UX: music, podcasts, radio.
- **Fake data only**; no real APIs.
- **Figma** as layout reference; match structure and hierarchy, not pixel perfection by default.
- **User types** (`guest`, `freeStingray`, `freeProvider` in story; **`freeProvided`** in code, `subscribed`) reflected in **header, ads, and footer height** (stubs are OK).

---

## What we have done

- [x] Vite + React project scaffold.
- [x] Cursor project rules: `.cursor/rules/stingray-music-prototype.mdc` (swimlanes, bottom nav, tokens, fake data).
- [x] `docs/figma-nodes.md` — design file and screen node links.
- [x] `docs/Stories/Home-screen-story.md` — Home narrative (header, banner, swimlanes, footer, ads, user types).
- [x] `docs/Plans/plan.md` — this living plan (update as we ship scope).
- [x] Mock data modules:
  - [x] `src/data/musicChannels.js` — `MusicChannel`, `MUSIC_GENRES`, related channels for info screen.
  - [x] `src/data/podcasts.js` — `Podcast`, episodes, `PODCAST_CATEGORIES`.
  - [x] `src/data/radioStations.js` — `RadioStation`, `RADIO_STATION_CATEGORIES`, international nesting noted as follow-up in file + figma map.
- [x] `docs/react-learning.md` — started; append entries as we implement (swimlanes, Router, BottomNav, …).
- [x] `src/index.css` — global design tokens (spacing, colors, card + nav placeholders), theme overrides, `.app-shell` / `.content-inset` / `.home-screen`.
- [x] `docs/design-tokens.md` — designer workflow; Figma + `index.css` as sources of truth; MCP note.
- [x] **Card components** — `ContentTileCard` (shared layout) + `MusicChannelCard`, `PodcastCard`, `RadioStationCard` in `src/components/` (tokenized `--card-tile-*` / type styles in `index.css`).
- [x] **ContentSwimlane** — `src/components/ContentSwimlane` (inset title + More, full-bleed scroll, inner `padding-inline`).
- [x] **`react-router-dom`** — `BrowserRouter` in `main.jsx`; **`Home`** at `/` in `src/pages/Home.jsx`; `App.jsx` holds `<Routes>`.
- [x] **Chrome (step 4)** — **`BottomNav`** (Home, Search, Info) + **`HomeHeader`** + **`HomeBanner`** placeholder; `App.jsx` + `.app-shell` bottom padding for nav + safe area. **Visual ad strip** — under tabs + music player when `showVisualAds(userType)`; **`html[data-visual-ads]`** extends **`--bottom-nav-stack-height`** (see **`docs/visual-ads-and-user-types.md`**). **`MiniPlayer`** + **`PlaybackContext`** — footer strip above **`BottomNav`** (Figma **`19777:32024`**); **`--mini-player-offset`** expands scroll padding when active; **`Info`** demo buttons for podcast/radio stubs. **Footer layering:** **`MiniPlayer`**, **visual ad strip** (non-subscribed ad tiers), and **`BottomNav`** are **fixed overlays** pinned to the bottom of the phone shell (stacked **above** scrolling **`Routes`** / **`main`** so main content slides underneath; shell **`padding-bottom`** + tokens reserve clearance).
- [x] **Subscription (Upgrade) + user type** — **`UserTypeProvider`** (`src/context/UserTypeContext.jsx`) + **`showVisualAds()`** (`src/utils/showVisualAds.js`); route **`/upgrade`** → **`Subscription.jsx`** (Figma `220:40551`); **`Home`** Upgrade → navigate; **`HomeHeader`** variants (guest / freeStingray / freeProvided / subscribed); **`BottomNav`**: **`/upgrade`** counts as Home tab; **`Button`** variant **`subscribe-primary`**. **`VisualAdStrip`** + **`VisualAdsHtmlSync`** for footer ads. *Follow-up:* swimlane-level ads; finer **freeStingray** vs **freeProvided** rules if product requires it.
- [x] **`userType` `freeProvided` (Phase 0, Info plan)** — renamed from **`provided`** in **`src/`** + docs; **`Subscription`** **Preview as** uses **Free provider**. Details: **`docs/Plans/Info-screen-implementation-plan.md`** § Phase 0.
- [x] **Info tab — Phase 1 routes + stack shells** — **`/info/contact`** (**`InfoContact.jsx`**), **`/info/about`** (**`InfoAbout.jsx`**), **`InfoSubPage.css`** scroll under **`ScreenHeader`**; **`BottomNav`** **Info** active for **`/info/*`**; **`Info`** root scaffold. Details: **`docs/Plans/Info-screen-implementation-plan.md`** § Phase 1.
- [x] **Info tab — Phase 2 collapsible sections** — **`InfoCollapsibleSection`**; Account (default open) / Settings / Info placeholders. **`docs/Plans/Info-screen-implementation-plan.md`** § Phase 2.
- [x] **Info tab — Phase 3 Account section** — **`InfoAccountSection`** (**`5518:74009`**); **`externalLinks.js`** (**`PROVIDER_SSO_URL`**, **`STINGRAY_ACCOUNT_LOGIN_URL`**). **`docs/Plans/Info-screen-implementation-plan.md`** § Phase 3.
- [x] **Info tab — Phases 4–6 (Settings, help rows, About + Contact)** — **`InfoSettingsSection`** (Phase 4); **`InfoHelpSection`** + **`infoHelpLinks.js`** (Phase 5); **`InfoAbout.jsx`** / **`InfoAbout.css`** (**`5683:78416`**), **`InfoContact.jsx`** / **`InfoContact.css`** + **`infoContactCopy.js`** (**`5683:78191`**), shared **`legalLinks.js`** (`TERMS_URL`, `PRIVACY_URL`, **`LEGAL_LINKS`**) used by **`Subscription.jsx`** (Phase 6). Details: **`docs/Plans/Info-screen-implementation-plan.md`** § Phases 4–6.
- [x] **`ScreenHeader`** — `src/components/ScreenHeader.jsx` + `ScreenHeader.css`; fixed **80px** stack bar (Figma **`19737:48141`**); geometrically centered title; optional **`startSlot`** / **`endSlot`**; tokens **`--screen-header-*`** in `index.css`; first use: **`Subscription`**; also **Channel Info** (back-only header per Figma).
- [x] **Music stack (info + player)** — **`/music/:channelId`** → **`MusicChannelInfo.jsx`** (Figma **`25:7067`**); **`/music/:channelId/play`** → **`MusicPlayer.jsx`** (Figma **`23:20013`**: chrome with dismiss / guest **Upgrade** / cast; channel title; info → channel info; cover + prototype track lines; progress + play/pause + skip; ad footer strip); **`BottomNav` hidden** on **`…/play`** only; **`Home`** music tiles → **`navigate`**; invalid id → **`Navigate`** home; **`/music/:channelId`** (not play) keeps **Home** tab active.
- [x] **Podcast stack — Phases 1–6 (prototype)** — **Phases 1–5** (see prior bullet history). **Phase 6:** **`Home.jsx`** **`PodcastCard`** → **`/podcast/:id`**; **`SwimlaneMore`** **`podcasts`** grid same **`navigate`/tile** behavior; **`ListenAgainCard`** podcast branch (Phase 5). **Search** tab **Browse / Podcasts** body: see **Search & Browse — Phase 3** above. **Search** tab **Browse / Radio**: see **Phase 4** above.
- [x] **Listen again (user history)** — **`ListenHistoryProvider`**; **music** (**`MusicPlayer`**, after preroll) **+ podcast** (**`PodcastPlayer`**, after preroll, when engaged); **`ListenAgainCard`** → **`music`** | **`podcast`**; Home rail + **`/more/listen-again`**; **`src/constants/listenHistory.js`**.
- [x] **Search & Browse — Phase 0 (territory / lineup stub)** — **`TerritoryProvider`** (`src/context/TerritoryContext.jsx`): **`musicLineupMode`** **`limited`** | **`broad`**. **`src/constants/musicLineup.js`**. **`Search`** tab: browse tab stub; **second tap on Music** toggles lineup (**prototype-only easter egg** for demos, not shipping). See **`docs/Plans/Search-Browse-implementation-plan.md`** § Phase 0.
- [x] **Search & Browse — Phase 1 (shell)** — fixed **`SearchBrowseHeader`**; **`--search-header-offset`** + **`search-page-scroll`** in **`index.css`**; browse vs search (tabs hide when trimmed query non-empty); clear empty field resets **`browseTab`** to **Music**; lineup easter egg on header **Music** tab. **`/search/more/tags`** + **`SearchTagsMore`** + Channel Info **tag** → grid; **vibes/tags** vocabulary in **`Search-story`**. **`docs/Plans/Search-Browse-implementation-plan.md`** § Phase 1 / 6.
- [x] **Search & Browse — Phase 2 (music browse)** — **`musicBrowseTaxonomy.js`**; limited genre grid → **`SearchMusicCategory`**; broad vibes → **`SearchMusicVibe`** → tags → **`SearchMusicBroadTagChannels`**; **`SearchBrowseTile`**. See **`docs/Plans/Search-Browse-implementation-plan.md`** § Phase 2.
- [x] **Search & Browse — Phase 3 (podcasts browse)** — **`SearchPodcastsBrowse`**: library + **`PODCAST_CATEGORIES`** in one **`SearchBrowseTileGrid`** (library tiles only when populated); **`SearchPodcastsLibrary`** drill-down for each shelf; **`SearchPodcastsCategory`** (**`getPodcastsByCategory`**, 2-col **`PodcastCard`**) → **`/podcast/:id`**. Story: **`docs/Stories/Podcasts-story.md`**; Figma **`19805:39266`**. See **`docs/Plans/Search-Browse-implementation-plan.md`** § Phase 3.
- [x] **Search & Browse — Phase 4 (radio browse)** — **`SearchRadioBrowse`** (seven tiles); **`SearchRadioInternationalStack`** (continents + **North America → Canada → Alberta → cities** with **popular swimlane + geo pills** — walkthrough **`docs/Tutorials/Radio-geo-subregion-swimlane-pills-tutorial.md`**); **`SearchRadioStationGrid`** (Near You + format rows); **`radioInternationalBrowse.js`** + **`radioBrowsePaths.js`**; **`/radio/:stationId`** → **`RadioStationInfo`**; **`/radio/:stationId/play`** → **`RadioPlayer`** with **`upsertRadioSession`**. Plan detail: **`docs/Plans/Radio-Browse-implementation-plan.md`**.

## Home screen — implementation approach

**Recommended order** (aligns with component-first UX work):

1. **Card components (three content types)** — **done** (default + **compact** / **ghost** on **`ContentTileCard`** for **Listen again**).

2. **Swimlane / row** — **done** (`ContentSwimlane`). Inset **title + “More”**, full-bleed **horizontal scroll** with inner `padding-inline: var(--space-content-inline)`.

3. **Home page (first vertical slice)** — **done** for routing: **`/` → `Home`**, with `main.app-shell` → `home-screen` + swimlanes + **Listen again** when history non-empty. **Chrome** (nav, header, …) in step 4.

4. **Chrome after core content** — **done (baseline)**  
   `BottomNav`, `HomeHeader`, `HomeBanner` placeholder, nav + safe-area padding on **`.app-shell`**. Ads wired; **mini player** baseline shipped (see **What we have done**). *Follow-up:* **Favorites**, **Recommendations**, full banner art / SVGs from Figma.

5. **User mode stub** — **done (baseline)**  
   **`UserTypeContext`**: `guest` | `freeStingray` | `freeProvided` | `subscribed` — drives **`HomeHeader`** and **Subscription**; **`docs/Stories/Home-screen-story.md`** for chrome intent.

6. **Stacked routes (music first)** — **done (music)**  
   Info + player + **no tab bar** on player. Then mirror for podcast / radio.

---

## Listen again (user history) — specification (shipped)

**Product:** `docs/Stories/Home-screen-story.md`, `docs/UX/Home - UX Principles.md` (continuity of listening; mixed types; compact tiles).

**Figma**

- Home rail / ghost fillers (designer temp variables on Home): [`1:2`](https://www.figma.com/design/duguG08ZOCWXQemLw59XJW/UX-SM-MPR-Mobile-2604?node-id=1-2).
- **Listen again — More** screen with **Clear** (label-only control in header): [`19801:39250`](https://www.figma.com/design/duguG08ZOCWXQemLw59XJW/UX-SM-MPR-Mobile-2604?node-id=19801-39250) — listed in `docs/figma-nodes.md`.

**History model**

- **Starts empty** on load; **in-memory** is enough (optional `localStorage` later).
- **Updates from real listens** in the prototype (not a static mock list): **music** when playback is allowed after preroll; **podcasts** after preroll when the user presses play / scrubs past **~5%** (see **`PodcastPlayer`**); extend **radio** when that stack fires the same kind of event.
- **Dedupe + recency:** prepend or bump-on-repeat; cap stored entries for UI (rail shows up to **12** slots visually — see below).
- **Single source of truth:** one ordered **`items`** list in **`ListenHistoryProvider`**. **Home — Listen again** uses the **full list** (mixed recap, **unfiltered by type**). **My Library** adds **typed** rails by **`filter(kind)`** on the same store (music / podcasts / radio) — see **`docs/Plans/My-Library-implementation-plan.md`** § Single source of truth.

**Home — layout order (prepare for Favorites)**

- Below **banner** (and existing `.content-inset` blocks): leave a clear **placeholder** for **Favorites** (future): render **Favorites** here when populated; **then** **Listen again** when history is non-empty; then existing **Music → Podcasts → …** lanes. Comments or a small wrapper in `Home.jsx` keep the slot obvious.

**Home — Listen again swimlane**

- **Hidden entirely** when there is **no** history (`length === 0`).
- Reuse **`ContentSwimlane`** (title **Listen again**, **More** → full list route).
- **Tiles:** **compact, no labels** (extend **`ContentTileCard`** / card wrappers + tokens in **`index.css`**).
- **Ghost placeholders:** to the **right** of real history cards, render enough **non-interactive “ghost”** tile placeholders so the row visually **fills** the swimlane **up to 12 slots total** (real + ghosts ≤ 12). Match Figma intent (“filled rail”); tune opacity / skeleton via tokens. If real count ≥ 12, **no** ghosts (horizontal scroll only).

**More screen — full history grid**

- Route **`/more/listen-again`**; **mixed content** in one **full-width grid** (same pattern as **`SwimlaneMore`** / **View More**).
- **`ScreenHeader`**: same bar as other stack screens — **back** in **`startSlot`**, centered title **Listen again**, **`endSlot` = text-only “Clear”** (label button, no icon per Figma). **Clear** wipes history and returns user expectation: empty Home lane; grid empties.
- **Follow-up (later):** consider a **content-type tab strip** in the header area (à la **Search & Browse**) to filter Music / Podcasts / Radio; not in v1.

**Implementation (shipped)**

- **`src/constants/listenHistory.js`**, **`ListenHistoryProvider`** (`recordMusicChannelListen`, **`recordPodcastShowListen`**), **`ListenAgainCard.jsx`**, **`ListenAgainMore.jsx`**, **`MusicPlayer.jsx`**, **`PodcastPlayer.jsx`**, **`Home.jsx`**, **`App.jsx`**, **`ContentTileCard`**, **`ScreenHeader__text-btn`**.

---

## Guest music skip limit (prototype)

**Goal:** Simulate **guest-only** hourly skip caps for **music** streaming so UX can be reviewed before real entitlements land.

**User types**

- **`guest`** — capped skips (each skip starts its own countdown; overlapping “slots” up to a max).
- **`freeProvided`** and **`subscribed`** — **unlimited** for this prototype (**confirm licensing / partner rules later**).

**Product behavior**

- Applies only to **music channel** playback: **`MusicPlayer`** and **`MiniPlayer`** when **`variant === "music"`**. Podcast seek controls and radio are out of scope.
- Each successful skip pushes a **timestamp** at `now + recovery duration`. While that slot is active it counts toward the cap. When it expires, the **badge digit** decreases; **hide badge when zero**.
- Badge shows the **number of active (non-expired) skip slots** (first skip → `1`), aligned with Figma on the skip control ([`23:20013`](https://www.figma.com/design/duguG08ZOCWXQemLw59XJW/UX-SM-MPR-Mobile-2604?node-id=23-20013)).
- At the limit, show a **dialog**: **minutes until the oldest slot expires**, plus messaging that signing up / logging in removes the cap ([`5568:166350`](https://www.figma.com/design/duguG08ZOCWXQemLw59XJW/UX-SM-MPR-Mobile-2604?node-id=5568-166350)).
- **Successful skip v1:** **only updates counter / timers** — no fake “next track” or cover swap yet (**planned later** with pause-state artwork).

**Implementation (shipped)**

- **`src/constants/guestMusicSkips.js`** — **`GUEST_MUSIC_MAX_ACTIVE_SKIPS`**, **`GUEST_MUSIC_SKIP_RECOVERY_MS`**, **`GUEST_MUSIC_SKIP_PRUNE_INTERVAL_MS`**.
- **`GuestMusicSkipProvider`** — **`key={userType}`** inner tree reset; **`consumeGuestMusicSkip()`**; **`useGuestMusicSkips()`**; dialog state. **Tutorial:** **`docs/Tutorials/Guest-music-skip-limit-tutorial.md`**.
- **`MusicSkipButton`**, **`GuestSkipLimitDialog`**, **`MiniPlayer`** / **`MusicPlayer`** integration; **`--z-guest-skip-dialog`** in **`index.css`**.

**Persistence:** In-memory is enough for the prototype (optional `localStorage` later if flows need reload survival).

---

## Next steps (near term)

Ordered roughly **do first → do next**. Shipped baseline (tabs, Subscription, cards, swimlanes) lives under **What we have done** above.

1. [ ] **My Library tab** — Replaces Info hub; **`/my-library`**, App Info swimlane, unified history (**Listen again** = unfiltered Home rail; Library = filtered rails); phases in **`docs/Plans/My-Library-implementation-plan.md`**.

2. [ ] **Info tab — Phase 7 (cleanup + docs polish)** — Confirm no orphaned **`Info`** CSS; optional **`docs/Stories/Info-story.md`**. **`docs/Plans/Info-screen-implementation-plan.md`** § Phase 7. (Overlaps My Library refactor; consolidate when the Info root migrates.)

3. [ ] **Search & Browse (remaining)** — **`docs/Plans/Search-Browse-implementation-plan.md`** phases **5–8** (query swimlanes, More, reset polish). **Product:** `docs/Stories/Search-story.md`.

4. [ ] **Visual pass** — refine nav / header / card tokens; swap **placeholder SVGs** (icons, logo) from Figma.

## Backlog / later

- [ ] **Favorites** — liked content rail (sparse by design); insert **above** **Listen again** on Home when populated (slot reserved in spec above).
- [ ] **Recommendations** — generic stub, then “informed by” fake history.
- [ ] **Listen again + miniplayer (radio)** — **Radio** browse + **RadioStationInfo** / **RadioPlayer** ship today; **`ListenHistoryProvider`** should gain **`radio`** **`kind`** and **`recordRadioStationListen`** per **`docs/Plans/My-Library-implementation-plan.md`** (typed Library rails share the same **`items`** list as Home Listen again).
- [ ] **International radio (expand beyond v1)** — **`docs/Stories/Search-story.md`** (full geo tree + format IA beyond the **North America → Canada → Alberta → cities** mock); align `radioInternationalBrowse.js`, `radioStations.js`, + `docs/figma-nodes.md` when adding regions.
- [ ] **Territory** variants (150+ vs 1000+ channels) for browse, when building Search & Browse.

---

## How to maintain this file

- After **meaningful** work (a feature, a milestone, or a clear scope change): update **What we have done** and **Next steps**; adjust **Backlog** as needed.
- **Do not** log every tiny fix — focus on what future-you needs to remember.
- This file does **not** replace `docs/Stories/Home-screen-story.md` (product) or `figma-nodes.md` (design index); it **ties implementation to them**.

Path: **`docs/Plans/plan.md`** (implementation **plans** directory — separate from step-by-step **`docs/Tutorials/`**).

*Last updated: 2026-05-13* — **`My-Library-implementation-plan.md`** added (URLs **`/my-library`**, single history store: Home mixed vs Library filtered); **Next steps** reordered toward My Library implementation.
