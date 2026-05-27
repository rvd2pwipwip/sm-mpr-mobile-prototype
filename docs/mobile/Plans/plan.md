# Stingray Music (MPR) mobile prototype — implementation plan

This file is the **running plan**: what we intend to do, what we have done, and what is next. Use it to **onboard after a break** and to keep scope visible without digging through chat history.

**Repo layout:** Root package **`sm-mpr-prototypes`** (npm workspaces). The **mobile** Vite app is **`apps/mobile/`**. Older bullets and links that mention **`src/...`** are relative to **`apps/mobile/src/`** unless noted otherwise. The **TV** app is **`apps/tv/`**; shared modules may live in **`packages/shared`** (`@sm-mpr/shared`).

**Docs layout:** All **mobile** product docs live under **`docs/mobile/`** — **`Plans/`**, **`Stories/`**, **`Tutorials/`**, **`UX/`**, plus root files (**`react-learning.md`**, **`figma-nodes.md`**, **`design-tokens.md`**, etc.). **TV** docs go under **`docs/tv/`** when added.

**See also:** `docs/mobile/Stories/Home-screen-story.md` (product story for Home), `docs/mobile/Stories/Search-story.md` (Search & Browse story + **Integration notes**), `docs/mobile/Plans/Search-Browse-implementation-plan.md` (ordered build plan + Figma table; **Phases 0–8**, acceptance checklist under **Phase 8**), **`docs/mobile/Plans/Full-screen-player-layout-refactor.md`** (music / radio / podcast fullscreen shell: header + footer anchoring, thumbnail clamp, phased migration), **`docs/mobile/Plans/catalog-scope-search-browse-refactor.md`** (limited vs broad IA: Browse landing, Search fork, no tab bar when limited), **`docs/mobile/Plans/Cast-prototype-implementation-plan.md`** (dumb cast flow: dialogs, thumbnail scrim, three fullscreen players — **before / during implementation**), **`docs/mobile/Plans/Info-screen-implementation-plan.md`** (Info tab + Contact/About + audio quality — **before implementation**), **`docs/mobile/Plans/My-Library-implementation-plan.md`** (bottom tab My Library hub, App Info swimlane, unified listen history vs Home Listen again), **`docs/mobile/Plans/ContentSwimlane-category-rail-variant.md`** (`ContentSwimlane` reference + category rail variant plan/tutorial), `docs/mobile/figma-nodes.md` (Figma links), `src/data/*` (mock catalogs).

---

## Goals (prototype)

- **Clickable** mobile-first UX: music, podcasts, radio.
- **Fake data only**; no real APIs.
- **Figma** as layout reference; match structure and hierarchy, not pixel perfection by default.
- **User types** (`guest`, `freeStingray`, `freeProvider` in story; **`freeProvided`** in code, `subscribed`) reflected in **header, ads, and footer height** (stubs are OK).

---

## What we have done

- [x] **Docs layout** — all mobile docs under **`docs/mobile/`** (**`Plans/`**, **`Stories/`**, **`Tutorials/`**, **`UX/`**, **`react-learning.md`**, **`figma-nodes.md`**, etc.); links updated repo-wide; **`docs/tv/`** reserved for TV docs.
- [x] **Monorepo** — npm workspaces (`apps/*`, `packages/*`); **`apps/mobile`** contains the former root Vite app; **`packages/shared`** stub for shared code.
- [x] **TV app scaffold** — **`apps/tv`** Vite + React workspace (dev port **5174**); routes **`/`**, **`/search`**, **`/my-library`**; **`TvShell`** + left **`PrimaryNav`**; **`UserTypeContext`** stub (same four user types as mobile); overscan + **`focus-visible`** tokens in **`apps/tv/src/index.css`**.
- [x] Vite + React project scaffold.
- [x] Cursor project rules: `.cursor/rules/stingray-music-prototype.mdc` (swimlanes, bottom nav, tokens, fake data).
- [x] `docs/mobile/figma-nodes.md` — design file and screen node links.
- [x] `docs/mobile/Stories/Home-screen-story.md` — Home narrative (header, banner, swimlanes, footer, ads, user types).
- [x] `docs/mobile/Plans/plan.md` — this living plan (update as we ship scope).
- [x] Mock data modules:
  - [x] `src/data/musicChannels.js` — `MusicChannel`, `MUSIC_GENRES`, related channels for info screen.
  - [x] `src/data/podcasts.js` — `Podcast`, episodes, `PODCAST_CATEGORIES`.
  - [x] `src/data/radioStations.js` — `RadioStation`, `RADIO_STATION_CATEGORIES`, international nesting noted as follow-up in file + figma map.
- [x] `docs/mobile/react-learning.md` — started; append entries as we implement (swimlanes, Router, BottomNav, …).
- [x] `src/index.css` — global design tokens (spacing, colors, card + nav placeholders), theme overrides, `.app-shell` / `.content-inset` / `.home-screen`.
- [x] `docs/mobile/design-tokens.md` — designer workflow; Figma + `index.css` as sources of truth; MCP note.
- [x] **Card components** — `ContentTileCard` (shared layout) + `MusicChannelCard`, `PodcastCard`, `RadioStationCard` in `src/components/` (tokenized `--card-tile-*` / type styles in `index.css`).
- [x] **ContentSwimlane** — `src/components/ContentSwimlane` (inset title + More, full-bleed scroll, inner `padding-inline`).
- [x] **`react-router-dom`** — `BrowserRouter` in `main.jsx`; **`Home`** at `/` in `src/pages/Home.jsx`; `App.jsx` holds `<Routes>`.
- [x] **Chrome (step 4)** — **`BottomNav`** (Home, Search, My Library) + **`HomeHeader`** + **`HomeBanner`** placeholder; `App.jsx` + `.app-shell` bottom padding for nav + safe area. **Visual ad strip** — under tabs + music player when `showVisualAds(userType)`; **`html[data-visual-ads]`** extends **`--bottom-nav-stack-height`** (see **`docs/mobile/visual-ads-and-user-types.md`**). **`MiniPlayer`** + **`PlaybackContext`** — footer strip above **`BottomNav`** (Figma **`19777:32024`**); **`--mini-player-offset`** expands scroll padding when active; **`Info`** demo buttons for podcast/radio stubs. **Footer layering:** **`MiniPlayer`**, **visual ad strip** (non-subscribed ad tiers), and **`BottomNav`** are **fixed overlays** pinned to the bottom of the phone shell (stacked **above** scrolling **`Routes`** / **`main`** so main content slides underneath; shell **`padding-bottom`** + tokens reserve clearance).
- [x] **Subscription (Upgrade) + user type** — **`UserTypeProvider`** (`src/context/UserTypeContext.jsx`) + **`showVisualAds()`** (`src/utils/showVisualAds.js`); route **`/upgrade`** → **`Subscription.jsx`** (Figma `220:40551`); **`Home`** Upgrade → navigate; **`HomeHeader`** variants (guest / freeStingray / freeProvided / subscribed); **`BottomNav`**: **`/upgrade`** counts as Home tab; **`Button`** variant **`subscribe-primary`**. **`VisualAdStrip`** + **`VisualAdsHtmlSync`** for footer ads. _Follow-up:_ swimlane-level ads; finer **freeStingray** vs **freeProvided** rules if product requires it.
- [x] **`userType` `freeProvided` (Phase 0, Info plan)** — renamed from **`provided`** in **`src/`** + docs; **`Subscription`** **Preview as** uses **Free provider**. Details: **`docs/mobile/Plans/Info-screen-implementation-plan.md`** § Phase 0.
- [x] **Info tab — Phase 1 routes + stack shells** — **`/info/contact`** (**`InfoContact.jsx`**), **`/info/about`** (**`InfoAbout.jsx`**), **`InfoSubPage.css`** scroll under **`ScreenHeader`**; **`BottomNav`** **Info** active for **`/info/*`**; **`Info`** root scaffold. Details: **`docs/mobile/Plans/Info-screen-implementation-plan.md`** § Phase 1.
- [x] **My Library tab — Phase 1 (hub scaffold + routing)** — **`/my-library`** → **`MyLibrary.jsx`**; **`/info`** → redirect **`/my-library`**; **`BottomNav`** third tab **My Library** (**`/my-library`**, **`/info/*`** still highlights tab); **`docs/mobile/Plans/My-Library-implementation-plan.md`** § Phase 1.
- [x] **My Library tab — Phase 2 (App Info swimlane + account)** — **`AppInfoSwimlane`** on hub; **`/my-library/account-settings`** (**`MyLibraryAccountSettings.jsx`**, Account + Settings both expanded); paths + **`externalFaqAnchorProps`** in **`infoHelpLinks.js`**; **`InfoHelpSection`** uses shared helpers. **`docs/mobile/Plans/My-Library-implementation-plan.md`** § Phase 2.
- [x] **My Library tab — Phase 3 (listen history + radio)** — **`ListenHistoryItem`** **`radio`** **`kind`**; **`recordRadioStationListen`** (**`RadioPlayer`**); **`clearHistoryByKind`** + **`isListenHistoryKind`**; **`ListenAgainCard`** radio tiles. **`docs/mobile/Plans/My-Library-implementation-plan.md`** § Phase 3.
- [x] **My Library tab — Phase 4 (typed history rails + More)** — **`LibraryHistoryRail`** segments (three **`ContentSwimlane`** rows, ghosts, **`alwaysShowMore`**); **`/my-library/history/:historySegment`** (**`MyLibraryHistoryMore.jsx`**, **`clearHistoryByKind`** + back); **`myLibraryHistory.js`**. **`docs/mobile/Plans/My-Library-implementation-plan.md`** § Phase 4.
- [x] **My Library tab — Phase 5 (conditional user rails)** — **`LibraryLikedMusicSwimlane`** / **`LibraryLikedRadioSwimlane`** (**`LikesContext`**); **`LibraryPodcastUserSwimlanes`** (**`PodcastUserStateContext`**, **More** → Search podcast library grids); hub order per **`My-Library-story`**; **`/my-library/likes/:likeKind`** (**`MyLibraryLikesMore.jsx`**). **`docs/mobile/Plans/My-Library-implementation-plan.md`** § Phase 5.
- [x] **Info tab — Phase 2 collapsible sections** — **`InfoCollapsibleSection`**; Account (default open) / Settings / Info placeholders. **`docs/mobile/Plans/Info-screen-implementation-plan.md`** § Phase 2.
- [x] **Info tab — Phase 3 Account section** — **`InfoAccountSection`** (**`5518:74009`**); **`externalLinks.js`** (**`PROVIDER_SSO_URL`**, **`STINGRAY_ACCOUNT_LOGIN_URL`**). **`docs/mobile/Plans/Info-screen-implementation-plan.md`** § Phase 3.
- [x] **Info tab — Phases 4–6 (Settings, help rows, About + Contact)** — **`InfoSettingsSection`** (Phase 4); **`InfoHelpSection`** + **`infoHelpLinks.js`** (Phase 5); **`InfoAbout.jsx`** / **`InfoAbout.css`** (**`5683:78416`**), **`InfoContact.jsx`** / **`InfoContact.css`** + **`infoContactCopy.js`** (**`5683:78191`**), shared **`legalLinks.js`** (`TERMS_URL`, `PRIVACY_URL`, **`LEGAL_LINKS`**) used by **`Subscription.jsx`** (Phase 6). Details: **`docs/mobile/Plans/Info-screen-implementation-plan.md`** § Phases 4–6.
- [x] **`ScreenHeader`** — `src/components/ScreenHeader.jsx` + `ScreenHeader.css`; fixed **80px** stack bar (Figma **`19737:48141`**); geometrically centered title; optional **`startSlot`** / **`endSlot`**; tokens **`--screen-header-*`** in `index.css`; first use: **`Subscription`**; also **Channel Info** (back-only header per Figma).
- [x] **Music stack (info + player)** — **`/music/:channelId`** → **`MusicChannelInfo.jsx`** (Figma **`25:7067`**); **`/music/:channelId/play`** → **`MusicPlayer.jsx`** (Figma **`23:20013`**: chrome with dismiss / guest **Upgrade** / cast; channel title; info → channel info; cover + prototype track lines; progress + play/pause + skip; ad footer strip); **`BottomNav` hidden** on **`…/play`** only; **`Home`** music tiles → **`navigate`**; invalid id → **`Navigate`** home; **`/music/:channelId`** (not play) keeps **Home** tab active.
- [x] **Full-screen player header + freeProvided brand row** — **`showUpgradeInFullPlayerHeader`** in **`showVisualAds.js`**: **`PlayerHeaderCenterSlot`** shows **Upgrade** for **`guest`**, **`freeStingray`**, and **`freeProvided`**; **`subscribed`** uses header spacer only. **`freeProvided`** also renders **`PlayerProvidedBrandRow`** ( **`ProviderLogoPair`**) below controls and above fixed **`VisualAdStrip--player`** on **`MusicPlayer`**, **`RadioPlayer`**, **`PodcastPlayer`**. (**`HomeHeader`** still uses **`showUpgradeCallToAction`** + separate provider placement.)
- [x] **Full-screen player layout refactor — Phases 1–5** — **`FullScreenPlayerShell`** ( **`MusicPlayer`**, **`RadioPlayer`**, **`PodcastPlayer`** ); **`MusicPlayer.css`** / **`PodcastPlayer.css`** subscribed + ad-parity footer slack (**Phase 2–3**); dynamic square art clamp via **`useFullscreenPlayerThumbSidePx`** + **`--player-thumb-side`** on all three routes (**Phase 4**); docs + acceptance checklist + **`docs/mobile/visual-ads-and-user-types.md`** fullscreen player subsection (**Phase 5**). Detail: **`docs/mobile/Plans/Full-screen-player-layout-refactor.md`**.
- [x] **Podcast stack — Phases 1–6 (prototype)** — **Phases 1–5** (see prior bullet history). **Phase 6:** **`Home.jsx`** **`PodcastCard`** → **`/podcast/:id`**; **`SwimlaneMore`** **`podcasts`** grid same **`navigate`/tile** behavior; **`ListenAgainCard`** podcast branch (Phase 5). **Search** tab **Browse / Podcasts** body: see **Search & Browse — Phase 3** above. **Search** tab **Browse / Radio**: see **Phase 4** above.
- [x] **Listen again (user history)** — **`ListenHistoryProvider`**; **music** (**`MusicPlayer`**, after preroll) **+ podcast** (**`PodcastPlayer`**, after preroll, when engaged) **+ radio** (**`RadioPlayer`**, after preroll, **`MusicPlayer`** parity); **`ListenAgainCard`** → **`music`** | **`podcast`** | **`radio`**; **`clearHistoryByKind`** for per-type clears (My Library Phase 4 UI); Home rail + **`/more/listen-again`**; **`src/constants/listenHistory.js`** (**`LISTEN_HISTORY_KINDS`**).
- [x] **Search & Browse — Phase 0 (territory / lineup stub)** — **`TerritoryProvider`** (`src/context/TerritoryContext.jsx`): **`musicLineupMode`** **`limited`** | **`broad`**; **`catalogScope`** from **`src/constants/catalogScope.js`**. **`src/constants/musicLineup.js`**; lineup persisted via **`readStoredMusicLineupMode`** / **`writeStoredMusicLineupMode`** in **`catalogScope.js`**. **Prototype lineup toggle:** wordmark on **`HomeHeader`** / **`LimitedBrowse`** only (**not** Search). See **`docs/mobile/Plans/Search-Browse-implementation-plan.md`** § Phase 0 and **`catalog-scope-search-browse-refactor.md`**.
- [x] **Search & Browse — Phase 1 (shell)** — **`SearchBrowseHeader`**; **`--search-header-offset`** + **`search-page-scroll`** in **`index.css`**; browse vs search (**Music / Podcasts / Radio** strip hides when trimmed query non-empty); **Clear** preserves the active content-type tab and strips **`?q=`** only. Debounced **`?q=`** on **`/search/music`** \| **`podcasts`** \| **`radio`** (and limited **`/search`**). **`docs/mobile/Plans/Search-Browse-implementation-plan.md`** § Phase 1.
- [x] **Search & Browse — Phase 2 (music browse)** — **`musicBrowseTaxonomy.js`**; limited genre grid → **`SearchMusicCategory`**; broad vibes → **`SearchMusicVibe`** → tags → **`SearchMusicBroadTagChannels`**; **`SearchBrowseTile`**. See **`docs/mobile/Plans/Search-Browse-implementation-plan.md`** § Phase 2.
- [x] **Search & Browse — Phase 3 (podcasts browse)** — **`SearchPodcastsBrowse`**: stacked **`ContentSwimlane`** rows (no category rail) per **`PODCAST_CATEGORIES`** (**`PodcastCard`** + capped **`More`**); below that, library + category tiles in one **`SearchBrowseTileGrid`** (library tiles only when populated); **`SearchPodcastsLibrary`** drill-down for each shelf; **`SearchPodcastsCategory`** (**`getPodcastsByCategory`**, 2-col **`PodcastCard`**) → **`/podcast/:id`**. Story: **`docs/mobile/Stories/Podcasts-story.md`**; Figma **`19805:39266`**. See **`docs/mobile/Plans/Search-Browse-implementation-plan.md`** § Phase 3.
- [x] **Search & Browse — Phase 4 (radio browse)** — **`SearchRadioBrowse`**: stacked **`ContentSwimlane`** rows per **`RADIO_STATION_CATEGORIES`** (**`RadioStationCard`** + capped **`More`**); **International** uses **`SearchRadioInternationalBrowseRail`** (**`CategoryPillsRail`** + **`INTERNATIONAL_CONTINENTS_PLANNED`**, **`useCategoryRailMemorySlug`** `search-radio-international`, **`getInternationalBrowseLaneRows`** real geo vs placeholder **`BrowseTagCard`** rows → **`radioInternationalPath`**); tile grid kept below swimlanes; **`SearchRadioInternationalStack`** (continents + **North America → Canada → Alberta → cities** with **popular swimlane + geo pills** — walkthrough **`docs/mobile/Tutorials/Radio-geo-subregion-swimlane-pills-tutorial.md`**); **`SearchRadioStationGrid`** (Near You + format rows); **`radioInternationalBrowse.js`** + **`radioBrowsePaths.js`**; **`/radio/:stationId`** → **`RadioStationInfo`**; **`/radio/:stationId/play`** → **`RadioPlayer`** with **`upsertRadioSession`**. Plan detail: **`docs/mobile/Plans/Radio-Browse-implementation-plan.md`**.
- [x] **Search & Browse — Phase 5 (live search swimlanes)** — **`SearchResultsPanel`**, **`src/search/searchCatalog.js`** (client-side match: channels, **Tags**, **Artists**, podcasts, episodes, radio); stub **`src/data/musicArtists.js`**; lanes use **`ContentSwimlane`** + **`EpisodeCard`** where needed; **does not** filter results by prior browse tab (**`Search-story`**). **`docs/mobile/Plans/Search-Browse-implementation-plan.md`** § Phase 5.
- [x] **Search & Browse — Phases 6–7 (More + reset / BottomNav)** — **`SearchTagsMore`**, **`SearchCatalogMore`**; **Back** returns to **`/search/...?q=...`**; **BottomNav** Search targets **last stored** browse tab (**`readStoredBroadSearchBrowseTab`** / **`writeStoredBroadSearchBrowseTab`**, **`searchBrowsePaths.js`**); **`/search`** (broad) redirects to that tab; **re-tap Search** while on **`/search/*`** resets **Music** + empty **`q`**. **`Search.jsx`** **`useLayoutEffect`** keeps storage aligned before paint. **`docs/mobile/Plans/Search-Browse-implementation-plan.md`** § Phases 6–7; **`docs/mobile/Stories/Search-story.md`** Integration notes.
- [x] **Search & Browse — Phase 8 (polish + acceptance + docs)** — Manual checklist (**`docs/mobile/Plans/Search-Browse-implementation-plan.md`** § Phase 8 — all **[x]**); **`docs/mobile/react-learning.md`** adaptive Search shell header note. Regression confirmed **limited** and **broad** catalogs.
- [x] **Catalog scope refactor — Phase A (entry + limited chrome)** — **`/`** renders **`LimitedBrowse.jsx`** when **`catalogScope === limited`** (**`Home`** when broad); **`BottomNav`** only when broad; **`html[data-catalog-scope]`** + **`--bottom-nav-stack-height: 0`** on limited for scroll padding. Details: **`docs/mobile/Plans/catalog-scope-search-browse-refactor.md`**.
- [x] **Catalog scope refactor — Header row + Search fork (Phase C / D partial)** — **`LimitedBrowse`**: stacked wordmark + **Upgrade** (guest / free Stingray) + **Search** / **Info** links + **`HomeBanner`**; **`/search`** canonical on limited with redirects from **`/search/music`** etc.; **limited Search** empty state (no browse grids); **removed** Search Music lineup easter egg (wordmark-only toggle). Plan: **`docs/mobile/Plans/catalog-scope-search-browse-refactor.md`**.
- [x] **Catalog scope refactor — Limited Browse taxonomy swimlanes (Phase C)** — **`LimitedBrowseTaxonomyRails`**: tab-scoped **user rails** (**`LibraryLikedMusicSwimlane`**, **`LibraryPodcastUserSwimlanes`**, **`LibraryLikedRadioSwimlane`**) prepended above **Listen again**; tab-scoped **Listen again** (matching history kinds); **Music** \| **Podcasts** \| **Radio** **`SearchBrowseContentSwitcher`** (**`mode="local"`**) between **`HomeBanner`** and rails; genre / category / format taxonomy swimlanes; **More** routes match **`/search/browse/...`**. **`docs/mobile/Plans/catalog-scope-search-browse-refactor.md`**.
- [x] **Catalog scope refactor — Limited ads parity + Phase E (docs)** — Footer **`LimitedCatalogFooterAd`** (**`VisualAdStrip`** **`variant="nav"`**) when **`showVisualAds`** on limited. **`hideFooterChromeForPath`** (**`utils/hideFooterChromeForPath.js`**, shared by **`LimitedCatalogFooterAd`** and **`App.jsx`**). **`index.css`:** **`html[data-catalog-scope="limited"][data-visual-ads]`** sets **`--bottom-nav-stack-height`** to **`--visual-ad-strip-min-height`**. In-feed **`SwimlaneBannerAd`** in **`LimitedBrowseTaxonomyRails`** after **two** taxonomy swimlanes. **Phase E docs:** **`docs/mobile/react-learning.md`**, **`catalog-scope-search-browse-refactor.md`** §6, and this **`plan.md`** update.

- [x] **Cast (dumb prototype)** — **`CastPrototypeProvider`** + **`CastPrototypeDialogs`** (**`CastToDialog`**, **`AppStackedDialog`** shells for Network / Local Network / Casting on); fullscreen **`MusicPlayer`**, **`RadioPlayer`**, **`PodcastPlayer`**: cast / casting icon mask, thumbnail scrim + overlay, **`docs/mobile/Plans/Cast-prototype-implementation-plan.md`**.
- [x] **Restore purchases (Tier A stub)** — **`RestorePurchasePrototypeDialog`** + **`useRestorePurchasePrototypeDialog`**: brief **Working...** then **`AppStackedDialog`** explaining no store connection; **`InfoAccountSection`** (guest, free Stingray) + **`Subscription`**.

## Home screen — implementation approach

**Recommended order** (aligns with component-first UX work):

1. **Card components (three content types)** — **done** (default + **compact** / **ghost** on **`ContentTileCard`** for **Listen again**).

2. **Swimlane / row** — **done** (`ContentSwimlane`). Inset **title + “More”**, full-bleed **horizontal scroll** with inner `padding-inline: var(--space-content-inline)`.

3. **Home page (first vertical slice)** — **done** for routing: **`/` → `Home`**, with `main.app-shell` → `home-screen` + swimlanes + **Listen again** when history non-empty. **Chrome** (nav, header, …) in step 4.

4. **Chrome after core content** — **done (baseline)**  
   `BottomNav`, `HomeHeader`, `HomeBanner` placeholder, nav + safe-area padding on **`.app-shell`**. Ads wired; **mini player** baseline shipped (see **What we have done**). **Broad Home** has **no** liked / Favorites rail (**`My Library`** only for that on broad catalog); **Recommendations** swimlane ships on Home. _Follow-up:_ full banner art / SVGs from Figma.

5. **User mode stub** — **done (baseline)**  
   **`UserTypeContext`**: `guest` | `freeStingray` | `freeProvided` | `subscribed` — drives **`HomeHeader`** and **Subscription**; **`docs/mobile/Stories/Home-screen-story.md`** for chrome intent.

6. **Stacked routes (music first)** — **done (music)**  
   Info + player + **no tab bar** on player. Then mirror for podcast / radio.

---

## Listen again (user history) — specification (shipped)

**Product:** `docs/mobile/Stories/Home-screen-story.md`, `docs/mobile/UX/Home - UX Principles.md` (continuity of listening; mixed types; compact tiles).

**Figma**

- Home rail / ghost fillers (designer temp variables on Home): [`1:2`](https://www.figma.com/design/duguG08ZOCWXQemLw59XJW/UX-SM-MPR-Mobile-2604?node-id=1-2).
- **Listen again — More** screen with **Clear** (label-only control in header): [`19801:39250`](https://www.figma.com/design/duguG08ZOCWXQemLw59XJW/UX-SM-MPR-Mobile-2604?node-id=19801-39250) — listed in `docs/mobile/figma-nodes.md`.

**History model**

- **Starts empty** on load; **in-memory** is enough (optional `localStorage` later).
- **Updates from real listens** in the prototype (not a static mock list): **music** when playback is allowed after preroll; **podcasts** after preroll when the user presses play / scrubs past **~5%** (see **`PodcastPlayer`**); **radio** after preroll when **`RadioPlayer`** playback is allowed ( **`MusicPlayer`** parity).
- **Dedupe + recency:** prepend or bump-on-repeat; cap stored entries for UI (rail shows up to **12** slots visually — see below).
- **Single source of truth:** one ordered **`items`** list in **`ListenHistoryProvider`**. **Home — Listen again** uses the **full list** (mixed recap, **unfiltered by type**). **Limited Browse** (**`LimitedBrowseTaxonomyRails`**) shows **Listen again** filtered to the active **Music** \| **Podcasts** \| **Radio** tab (**`music` \| `podcast` \| `radio`** in storage). **My Library** adds **typed** rails by **`filter(kind)`** on the same store (music / podcasts / radio) — see **`docs/mobile/Plans/My-Library-implementation-plan.md`** § Single source of truth.

**Broad Home — layout order (Favorites)**

- **Broad catalog** **`/`** (**`Home.jsx`**): **no** liked / Favorites swimlane for now (product scope); users open **My Library** for **`LibraryLiked*`** rails. Below **banner**: **Listen again** when history is non-empty, then **Music → Podcasts → …** (and **Recommendations**, etc.). **Limited Browse** (narrow catalog) still shows tab-scoped liked rails in **`LimitedBrowseTaxonomyRails`** — see **Catalog scope refactor — Phase C** above.

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

- **`src/constants/listenHistory.js`** (**`LISTEN_HISTORY_KINDS`**, **`isListenHistoryKind`**), **`ListenHistoryProvider`** (**`recordMusicChannelListen`**, **`recordPodcastShowListen`**, **`recordRadioStationListen`**, **`clearListenHistory`**, **`clearHistoryByKind`**), **`ListenAgainCard.jsx`**, **`ListenAgainMore.jsx`**, **`MusicPlayer.jsx`**, **`PodcastPlayer.jsx`**, **`RadioPlayer.jsx`**, **`Home.jsx`**, **`App.jsx`**, **`ContentTileCard`**, **`ScreenHeader__text-btn`**.

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
- **`GuestMusicSkipProvider`** — **`key={userType}`** inner tree reset; **`consumeGuestMusicSkip()`**; **`useGuestMusicSkips()`**; dialog state. **Tutorial:** **`docs/mobile/Tutorials/Guest-music-skip-limit-tutorial.md`**.
- **`MusicSkipButton`**, **`GuestSkipLimitDialog`**, **`MiniPlayer`** / **`MusicPlayer`** integration; **`--z-guest-skip-dialog`** in **`index.css`**.

**Persistence:** In-memory is enough for the prototype (optional `localStorage` later if flows need reload survival).

---

## ContentSwimlane — category rail variant

**Spec, UX locks, and roadmap:** **`docs/mobile/Plans/ContentSwimlane-category-rail-variant.md`**. **Code walkthrough:** **`docs/mobile/Tutorials/ContentSwimlane-category-rail-tutorial.md`**. **Broad music vibe rails** wiring: **`SearchMusicVibeBrowseRail`**, shared **`CategoryPillsRail`**, **`src/utils/categoryRailPillScroll.js`**, **`useCategoryRailMemorySlug`**, **`CategoryRailMemoryContext`**.

**Decisions (detail under “Roadmap notes” in the variant doc):**

- **Desktop keyboard and browser focus** — **Deferred** until a **desktop web** milestone or fork. This repo stays a **touch-first mobile prototype** in the browser; do not spend time on full keyboard navigation / `preventScroll` polish now. **Keep** lightweight landmarks (`aria-labelledby`, More labels, radiogroup-style pills) as low-cost handoff and occasional VoiceOver checks.
- **Category rail transition issue** (manual scroll then tap a distant pill; strip can appear to jump then settle) — **Known acceptable quirk** for now; likely browser **focus scroll** vs tween (see variant doc **Roadmap notes**). A small **focus / pointerDown** mitigation was **tried and reverted** (focus ring + incomplete edge-case fix).

---

## TV prototype — next steps

1. **D-pad / focus** — validate tab + arrow flow on primary nav and first content rows; add scroll-into-view for focused tiles when horizontal rails ship.
2. **Shared data** — hoist stable mock catalogs and user-type constants into **`packages/shared`** when TV screens need the same fixtures as mobile.
3. **Home screen** — first TV swimlane row (structure only; TV-specific card components, not mobile **`ContentSwimlane`** copy-paste).
4. **Business model forks** — keep TV overrides in **`apps/tv`** until stakeholder review; merge into shared config only when rules align.
5. **Legacy TV code** — if reviving last year's prototype, park under **`archive/tv-prototype-YYYY`** or **`apps/tv-legacy`** (separate workspace package).

---

## How to maintain this file

- After **meaningful** work (a feature, a milestone, or a clear scope change): update **What we have done** and **Next steps**; adjust **Backlog** as needed.
- **Do not** log every tiny fix — focus on what future-you needs to remember.
- This file does **not** replace `docs/mobile/Stories/Home-screen-story.md` (product) or `figma-nodes.md` (design index); it **ties implementation to them**.

Path: **`docs/mobile/Plans/plan.md`** (implementation **plans** directory — separate from step-by-step **`docs/mobile/Tutorials/`**).

_Last updated: 2026-05-27_ — all mobile docs consolidated under **`docs/mobile/`**; links updated repo-wide.

_Prior (2026-05-26):_ **`apps/tv`** scaffold (shell, primary nav, user-type stub, plan TV next steps).

_Prior (2026-05-26):_ **Broad Home**: no favorites / likes rail; document **My Library** + **`Home.jsx`** comment; backlog + Listen again layout note.

_Prior (2026-05-25):_ **Restore purchases Tier A** (`AppStackedDialog` stub, **`useRestorePurchasePrototypeDialog`**, **`Subscription`** + **`InfoAccountSection`**).

_Prior (2026-05-19):_ **Full-screen player refactor Phase 5** (docs + **`visual-ads-and-user-types.md`** player subsection + acceptance checklist); Phases **1–5** marked complete in **`plan.md`**.

_Prior (2026-05-19):_ **Full-screen player refactor Phase 4** (**`useFullscreenPlayerThumbSidePx`** on music / radio / podcast); **`plan.md`** + **`Full-screen-player-layout-refactor.md`** + **`react-learning.md`** updated.

_Prior (2026-05-19):_ **Search & Browse Phase 8** complete (**`docs/mobile/Plans/Search-Browse-implementation-plan.md`** checklist + **`docs/mobile/react-learning.md`** Search shell header); **Next steps** Phase 8 item removed.

_Prior (2026-05-15):_ **Backlog / later:** six stub items added (provider lineup, cast, share, artists & tags search results, restore purchase, global grace period).

_Prior (2026-05-15):_ **Search & Browse** **Phase 5–7** moved to **What we have done** (live search swimlanes, **More** grids, BottomNav **sessionStorage** browse tab + re-tap reset); **Phase 0–1** bullets corrected (wordmark lineup toggle, **Clear** / **`?q=`** behavior). **Next steps** trimmed (Phase 8 checklist, polish, Limited Browse header note); **My Library Phase 5** duplicate removed from next (already shipped above).

_Prior (2026-05-14):_ **ContentSwimlane** category rail section expanded (**keyboard/focus deferral**, **transition glitch** approach); tie-in **`docs/mobile/Plans/ContentSwimlane-category-rail-variant.md`** Roadmap notes.

_Prior (2026-05-13):_ **Catalog scope refactor** (Phases **A through E**) in **`docs/mobile/react-learning.md`**, **`docs/mobile/Plans/catalog-scope-search-browse-refactor.md`** (**Phase E** in §6), and **What we have done**.
