# React learning notes — Stingray Music (MPR) mobile prototype

Short **append-only** notes for concepts introduced while building this repo. The project rules (`.cursor/rules/stingray-music-prototype.mdc`) summarize patterns for implementation; this file is the **longer memory** when you need a refresher.

**Design tokens (colors, spacing, card sizes)** — not React-specific, but the workflow for you and for UI passes lives in **`docs/design-tokens.md`**, with values in **`src/index.css`**.

**Context:** This prototype continues the same React learning journey as the sibling **karaoke** mobile prototype (layout, swimlanes, bottom nav). Company priorities moved work here; ideas you already practiced there still apply—this document records what we do **in this codebase** (music, podcasts, radio, Figma `UX-SM-MPR-Mobile-2604`).

---

## Content tile cards (shared layout + three wrappers)

- **Idea:** One **presentational** component (`ContentTileCard`) owns the **visual pattern**: fixed width (`--card-tile-width` or **compact** `--card-tile-width-compact`), square image with `--radius-media-thumb`, one-line **title** + optional **subtitle**, and a **`<button type="button">`** when `onSelect` is set (otherwise a **`<div>`**). Optional **`compact`** hides labels (e.g. **Listen again**); **`ghost`** renders a muted empty square for filler slots. Same **mobile-first** prototype scope — not full web a11y.
- **Domain cards** (`MusicChannelCard`, `PodcastCard`, `RadioStationCard`) are **thin**: they map `src/data/*` fields to `ContentTileCard`, optional **`compact`**, and **`onSelect`**.
- **Why:** Same layout in every swimlane; only the data mapping changes.
- **Files:** `src/components/ContentTileCard.jsx` + `ContentTileCard.css`, and the three `*Card.jsx` files next to it.

---

## Button (`Button.jsx` — CTA vs secondary)

- **Idea:** One **`<button>`** with a **`variant`** prop: **`cta`** = solid brand fill (`--color-accent2` / `--color-on-accent2`); **`subscribe-primary`** = subscription primary (**`--color-accent`** / **`--color-on-accent`**, Figma blue on the Upgrade screen); **`secondary`** = **no fill**, **2px** border (`--color-button-secondary-border` from `color-mix` on `--color-text`). Optional **`startIcon`** / **`endIcon`** are any **React nodes** (usually small inline **SVG** with `currentColor` so the icon matches the label).
- **Tokens:** `--button-height-md`, `--button-icon-size`, `--font-size-button`, etc. in **`index.css`** — tune to Figma `button/md` without editing the component.
- **Figma:** [Button / md — CTA + secondary](https://www.figma.com/design/duguG08ZOCWXQemLw59XJW/UX-SM-MPR-Mobile-2604?node-id=19726-48115).
- **`UpgradeButton`:** **`src/components/UpgradeButton.jsx`** wraps **`Button`** **`variant="cta"`** with **`startIcon`** = **`/upgrade.svg`** and label **Upgrade** — same chrome as **`HomeHeader`**; pass **`onClick`** (e.g. **`navigate('/upgrade')`**). Use on **music player** and future player screens so the CTA stays consistent.

---

## ButtonSmall (`ButtonSmall.jsx` — compact CTA / secondary)

- **Idea:** Figma **`button_sm`** (~40px row, 16px label) — same roles as big **`Button`** but smaller: **`variant="cta"`** = **`--color-accent`** fill + **`--color-on-accent`** label/icons (Channel Info **Play**); **`variant="secondary"`** = transparent + **`--color-button-secondary-border`** outline (**Like** / **Share**). Optional **`startIcon`** / **`endIcon`** (e.g. 20×20 SVG with **`currentColor`**). **`fullWidth`** defaults **`false`** (**hug** content); set **`fullWidth`** so the control **`width: 100%`** inside a flex column (e.g. **`music-info__actions-col`**).
- **Tokens:** **`--button-sm-*`** in **`index.css`**; styles in **`ButtonSmall.css`**.

---

## Home header (fixed bar + `useHomeHeaderOffset`)

- **Idea:** `HomeHeader` is **fixed** top chrome; the scroll column (`.home-body-scroll`) needs **`padding-top: var(--home-header-offset)`** so content starts below the bar. Because the bar is out of flow, the **measured** header height is written to `--home-header-offset` on `<html>` via **`useHomeHeaderOffset()`** in **`HomeHeader.jsx`** — **`useRef`**, **`useLayoutEffect`**, and **`ResizeObserver`**. Figma “hug” + padding = one **`offsetHeight`**; variants with different content heights **re-measure** automatically.
- **Long tutorial (step by step):** [`Home-Header-tutorial.md`](Tutorials/Home-Header-tutorial.md).

---

## Swimlane layout pattern (Figma column + full-bleed scroll)

- **Idea:** The **page column** (header, titles) uses the content inset; each **horizontal row** of cards is **full width** under the phone shell, with **padding on the inner flex row** so the first/last cards align with the column. See project rules → _Swimlane layout_ for the full checklist (`--space-content-inline`, siblings of `.content-inset`, hidden horizontal scrollbar, scroll-snap caution).
- **This repo:** `src/components/ContentSwimlane.jsx` + `ContentSwimlane.css` — `section` with padded **header** (title + “More”) + **`overflow-x: auto`** scrollport + **inner** flex row with `padding-inline: var(--space-content-inline)` and `gap: var(--card-tile-gap)`. Pass any combination of the `*Card` components as **children** to fill the row.
- **Sibling reference:** The karaoke prototype’s `SongSwimlane.jsx` + `SongSwimlane.css` is a working example of the same geometry with different card content.

---

## User type context + Subscription (Upgrade) screen

- **Idea:** **`createContext`** + **`UserTypeProvider`** in **`src/context/UserTypeContext.jsx`** hold prototype-wide **`userType`**: **`guest`**, **`freeStingray`**, **`freeProvided`**, or **`subscribed`**. **`useUserType()`** returns **`{ userType, setUserType }`**. Wrap the tree that needs it (here: entire **`App`** inside **`App.jsx`**) so **`HomeHeader`**, **`Subscription`**, and later ads can read the same state without **prop drilling**.
- **Route:** **`/upgrade`** → **`src/pages/Subscription.jsx`** (+ **`Subscription.css`**), aligned with Figma **`220:40551`**: fixed blurred **back** bar, headline + price, bullet benefits, **Upgrade now** ( **`Button`** **`variant="subscribe-primary"`** — blue **`--color-accent`** fill via **`btn--subscribe-primary`**), **Select provider** (secondary + external-link icon; sets **freeProvided** and opens Stingray provider SSO in a new tab), legal copy + Terms/Privacy links, and a dashed **Preview as** control row to flip type for demos.
- **`HomeHeader`** reads **`userType`**: **`guest`** and **`freeStingray`** show **Upgrade**; **`freeProvided`** shows an outlined **Provider** pill; **`subscribed`** shows **only** the centered wordmark (see **`docs/Stories/Home-screen-story.md`**).
- **Visual ads:** **`showVisualAds(userType)`** in **`src/utils/showVisualAds.js`** — **`true`** for **`guest`**, **`freeStingray`**, and **`freeProvided`**, **`false`** for **`subscribed`**. **`showUpgradeCallToAction(userType)`** is **`true`** for **`guest`** / **`freeStingray`** (same CTA in **`HomeHeader`** and full players). **`usesGuestMusicSkipCap(userType)`** applies the hourly music skip cap to those two tiers. **`VisualAdStrip`** ( **`variant="nav"`** under **`BottomNav`**, **`variant="player"`** on **`MusicPlayer`**); **`SwimlaneBannerAd`** on **Home** below **`HomeBanner`**; **`showPlayerPreroll(userType)`** (same tiers as **`usesGuestMusicSkipCap`**) gates **`PlayerPrerollAd`** (15s + Skip on music **`/play`** when **tuning** from browse — not when expanding from **`MiniPlayer`**; see **`navigate` + `location.state`** section). **`VisualAdsHtmlSync`** sets **`data-visual-ads`** on **`<html>`** for footer stack height. **`docs/visual-ads-and-user-types.md`**.
- **Router note:** **`BottomNav`** treats **`/upgrade`** and **`/music/*`** as part of the **Home** tab ( **`useLocation`** + extra active check) so the bottom bar matches Figma while stacked URLs stay bookmarkable. The **My Library** tab uses **`/my-library`** as its **`NavLink`** target; **`/info`** redirects there with **`<Navigate replace />`**. **`pathname.startsWith("/info")`** still counts as **My Library** active so **Contact us** and **About** stacks (**`/info/contact`**, **`/info/about`**) keep the same tab highlighted.

## Info tab — collapsible sections (Phase 2)

- **Idea:** **`InfoCollapsibleSection`** (**`src/components/InfoCollapsibleSection.jsx`**) uses a **`<button>`** row (**`aria-expanded`**, **`aria-controls`**) plus a **`<div role="region">`** with the **`hidden`** attribute when closed (removes collapsed content from keyboard / AT). Parent **`Info.jsx`** stores **`useState({ account: true, settings: false, info: false })`** and toggles with **`setOpen((prev) => ({ ...prev, [key]: !prev[key] }))`** so **Account** starts open and **Settings** / **Info** can be open at the same time as each other (**not** an exclusive accordion). Chevron is a **CSS mask** on **`currentColor`** so light/dark tokens apply.
- **Account body:** **`InfoAccountSection`** (**`5518:74009`**) reads **`useUserType()`** and renders **guest** / **freeStingray** / **freeProvided** / **subscribed** layouts with **`Button`** (**`subscribe-primary`** / **`secondary`**) and **`<a className="btn btn--secondary">`** for external Stingray links (**`src/constants/externalLinks.js`**). **Log out** calls **`setUserType("guest")`** for demos.
- **Settings body (Phase 4):** **`InfoSettingsSection`** — **Autoplay** row; **Audio Quality** list row (**`aria-haspopup="dialog"`** for tiers without lossless access) opens **`AppStackedDialog`** upsell (**`9585:70503`**) or expands **`SearchBrowseContentSwitcher`** for **`subscribed`** / **`freeProvided`**. Copy **`AUDIO_QUALITY_UPSELL`** + segments in **`infoSettings.js`**. **Communication preferences** row. **`AppStackedDialog`**: scrim + theme-aware **title band** (light app: dark header; dark app: light header) + body + actions; **`GuestSkipLimitDialog`** uses it; **`--z-stacked-modal`** in **`index.css`**.
- **Info body (Phase 5):** **`InfoHelpSection`** (**`src/components/InfoHelpSection.jsx`**) lists **FAQ** (**`<a href={INFO_FAQ_HREF}>`** from **`src/constants/infoHelpLinks.js`**, placeholder **`"#"`** until Figma gives the URL; **`externalFaqAnchorProps(INFO_FAQ_HREF)`** adds **`target="_blank"`** + **`rel="noopener noreferrer"`** on real **`https`** URLs), **Contact us** / **About** (**`<Link to={INFO_CONTACT_PATH}>`** / **`INFO_ABOUT_PATH`**), chevrons like **Settings**.
- **About + Contact (Phase 6):** **`InfoAbout.jsx`** + **`InfoAbout.css`** (**`5683:78416`**) — wordmark pair (light/dark like **`HomeHeader`**), version + copyright lines + trademark copy from **`infoAboutCopy.js`**, **Terms** / **Privacy** as outline pill **`<a>`** tags mapping **`LEGAL_LINKS`** from **`src/constants/legalLinks.js`** (**`target="_blank"`**, **`rel="noopener noreferrer"`**). **`InfoContact.jsx`** (**`5683:78189`**) body from **`infoContactCopy.js`** (**`5683:78191`**) with **`mailto:`** on support + privacy emails. **`Subscription.jsx`** imports the same **`LEGAL_LINKS`** so URLs stay single-source.
- **Routing change (My Library Phase 1–5):** The bottom tab lands on **`/my-library`** (**`pages/MyLibrary.jsx`**) with **`AppInfoSwimlane`** (gear + **App Info** square tiles). **`/info`** redirects to **`/my-library`**. **`/my-library/account-settings`** (**`MyLibraryAccountSettings.jsx`**) reuses **`InfoAccountSection`** + **`InfoSettingsSection`** with **both expanded** on load. **History:** three **`LibraryHistoryRail`** instances (**`segment`** **`music`** \| **`podcasts`** \| **`radio`**) filter **`useListenHistory().items`** by kind; always **More** + ghosts to **`LISTEN_AGAIN_RAIL_SLOT_CAP`**. **More** → **`/my-library/history/...`** → **`MyLibraryHistoryMore.jsx`**; **Clear** = **`clearHistoryByKind`**. **Phase 5:** **`LibraryLikedMusicSwimlane`** / **`LibraryLikedRadioSwimlane`** read **`useLikes().items`** (omit when empty; **More** → **`/my-library/likes/music`** \| **`radio`**); **`LibraryPodcastUserSwimlanes`** reads **`usePodcastUserState()`** (subscribed, continue listening, bookmarks, new episodes, downloads — each rail omitted when empty; **More** → Search **podcast library** browse paths). Hub order: App Info → Music History → liked music → Podcast History → podcast user rails → Radio History → liked radio. Paths **`INFO_*`**, **`MY_LIBRARY_ACCOUNT_SETTINGS_PATH`** in **`infoHelpLinks.js`**.

---

## AppStackedDialog — shared stacked promo / limit modal

- **Idea:** **`AppStackedDialog`** (`AppStackedDialog.jsx` + **`.css`**) is a **fixed** centered card: **scrim** (`onClose`) = **black 25%** in **light** app chrome, **white 25%** in **dark** app chrome (**`prefers-color-scheme`** + **`data-theme`**) + backdrop blur; **title band** via **`--app-stacked-dialog-header-*`**: **light app** = **black fill + light type**, **dark app** = **light gray fill + near-black type**; **body** (`children`), **primary** **`Button`**, optional **secondary** (outline or link), optional **tertiary** (link, e.g. **Not now** on guest skip). **`z-index`** **`--z-stacked-modal`**. Figma shell **`9585:70503`**. **`GuestSkipLimitDialog`** and **Info** audio upsell compose it.

---

## Music Channel Info + `useParams` (stacked URLs)

- **Idea:** **URL parameters** identify which fake catalog row you are viewing. **`useParams()`** from **`react-router-dom`** returns an object like **`{ channelId: "pop__channel-slug" }`** when the path is **`/music/:channelId`**. The page calls **`getMusicChannelById(channelId)`** from **`src/data/musicChannels.js`**; if **`null`**, render **`<Navigate to="/" replace />`** so bad links bounce home.
- **Routes:** **`/music/:channelId`** → **`MusicChannelInfo.jsx`** (Figma **`25:7067`**); **`/music/:channelId/play`** → **`MusicPlayer.jsx`** (Figma **`23:20013`**). **`Home`** passes **`onSelect={() => navigate(`/music/${channel.id}`)}`** into **`MusicChannelCard`**. **Related** tiles reuse **`ContentTileCard`** with **`navigate(`/music/${rel.id}`)`**. Action row uses **`ButtonSmall`** (**`fullWidth`** in the side column).
- **`BottomNav`:** Paths under **`/music`** but **not** ending in **`/play`** keep the **Home** tab visually active (same idea as **`/upgrade`**). On **`/music/:channelId/play`**, **`App.jsx`** omits **`BottomNav`** (`useLocation` + regex) so the player is full-screen; **`MusicPlayer`** uses its own top chrome and **`.music-player-screen.app-shell`** overrides default bottom padding (no tab bar stack height).

---

## React Router (`BrowserRouter`, `Routes`, `NavLink`)

- **This project:** `BrowserRouter` wraps the app in **`src/main.jsx`**. **`src/App.jsx`** defines **`<Routes>`** / **`<Route>`** (start with **`path="/"`** → **`<Home />`** in `src/pages/Home.jsx`). Add tab routes and detail routes here as you build screens.
- **Why two files?** The router must wrap the tree that contains `Routes`; keeping `BrowserRouter` in `main.jsx` is a common pattern so `App` stays a pure route table. Page components (Home, etc.) own **`main.app-shell`** and their layout.
- **Next:** `NavLink` in `BottomNav` with matching `Route` paths — URL = selected tab. See project rules → _Bottom navigation_.

---

## Bottom navigation (tabs)

- **This project:** `src/components/BottomNav.jsx` + `BottomNav.css`; tab icons are **`public/home.svg`**, **`search.svg`**, **`my-library.svg`** applied with **CSS `mask-image`** + **`background-color: currentColor`** so active/inactive tints still work. **`App.jsx`** mounts **`MiniPlayer`** + **`<BottomNav />`** as **siblings of `<Routes>`** (both hidden on **`/music/…/play`**). Tab items = **`NAV_ITEMS`** → **`NavLink`** with `end` on Home (`/`). **Third tab:** **My Library**, **`to="/my-library"`** (**`bottom-nav__icon-mask--my-library`**). Active tab = `className={({ isActive }) => …}` + `--active` styles; **`/upgrade`** and **`/music/*`** (except **`/play`**) keep **Home** active where Figma shows that stack; **`/my-library`** + **`/info/*`** keep **My Library** active (**`/info/contact`**, **`/info/about`**).
- **Padding:** **`--footer-stack-scroll-padding`** in **`index.css`** = **`calc(var(--mini-player-offset) + var(--bottom-nav-stack-height) + env(safe-area-inset-bottom, 0px))`**. **`main.app-shell`** uses it for **`padding-bottom`**; **`--mini-player-offset`** flips **`0`** / **`var(--mini-player-height)`** via **`PlaybackContext`** on **`<html>`**. **Full-height scrolling behind the footer:** add **`app-shell--footer-fixed`** on **`main`**, **`padding-top`/`bottom: 0`**, **`height: 100dvh`** — scroll lives in **`.home-body-scroll`**, **`.music-info__scroll`**, **`app-shell-footer-scroll`**, etc., each with **`padding-bottom: var(--footer-stack-scroll-padding)`**. **Simple tab stubs** (**Search**, **My Library**): **`app-shell-footer-scroll`** + **`safe-area`** top pad only. **Top** inset on the default (**non-footer-fixed**) shell still uses **`--safe-area-inset-top`**. **Home:** fixed **`HomeHeader`** — see [`Home-Header-tutorial.md`](Tutorials/Home-Header-tutorial.md). Content scrolls **behind** header and footer stacks.
- **Project rules** have the full token checklist → _Bottom navigation_.

---

## Miniplayer (footer strip + PlaybackContext)

- **Idea:** **`MiniPlayer`** (`src/components/MiniPlayer.jsx` + **`MiniPlayer.css`**) is a **fixed** bar **above** **`BottomNav`**, **`z-index`** **`--z-mini-player`** (above **`--z-chrome`**). **Figma:** component **`19777:32024`**. **`data-variant`** = **`music` | `podcasts` | `radio`** — controls follow **`docs/Stories/Miniplayer-component-story.md`**. Inverse tokens **`--miniplayer-*`** (plus **`color-scheme`**) are set **on `.mini-player`** in **`MiniPlayer.css`** so the strip is **dark when the app is light** and **light when the app is dark**.
- **PlaybackContext** (`src/context/PlaybackContext.jsx`): **`PlaybackProvider`** wraps **`App`** (inside **`BrowserRouter`**). **`miniPlayerVisible`** = session **`active`** + not on fullscreen **music play** (**`…/music/:channelId/play`**) **or podcast episode play** (**`…/podcast/:id/play/:episodeId`**). **`upsertMusicSession`** / **`upsertPodcastSession`** keep **`fullPlayerPath`** so tapping the MiniPlayer opens the full route with **`playOverDetailNavigateState({ expandFromMiniPlayer: true })`** (see **`MiniPlayer.jsx`**). Full players read **`PlaybackContext`** + **`location.state`** for preroll skip (**`Guest-preroll-grace-tutorial.md`**). **Teaching walkthrough:** [`Podcasts-and-episodes-deep-dive-tutorial.md`](Tutorials/Podcasts-and-episodes-deep-dive-tutorial.md).
- **Where to preview podcast/radio UI:** **`/`** podcasts swimlane and real **`/podcast/...`** / **`/radio/...`** play routes. (**Legacy Info tab demos were removed earlier; hub is `/my-library`.**)

---

## Guest music skip limit (Context + hourly stamps)

- **Idea:** **Guest** and **freeStingray** users on **music** get the same **prototype cap**: each skip adds an **expiry time** (`now + recovery`); at most **`GUEST_MUSIC_MAX_ACTIVE_SKIPS`** unexpired stamps. **`usesGuestMusicSkipCap(userType)`** in **`src/utils/showVisualAds.js`** gates the list; **`freeProvided`** / **`subscribed`** bypass. **Constants** live in **`src/constants/guestMusicSkips.js`**; **state** in **`GuestMusicSkipProvider`** (**`src/context/GuestMusicSkipContext.jsx`**) — keyed inner provider **`key={userType}`** clears tallies when **`UserTypeContext`** flips (demo on **`/upgrade`**). **`expiriesRef`** updates **synchronously** on consume so fast double-taps cannot read stale **`useState`**. **Prune** expired stamps on an **interval** (`GUEST_MUSIC_SKIP_PRUNE_INTERVAL_MS`) so the **count overlay** drops without another tap. **`MusicSkipButton`** (`size` **`mini`** | **`full`**) — **digit only** (**`--music-skip-count-on-full`** → **`var(--color-bg)`**; **`--music-skip-count-on-mini`** on **`.mini-player`** → **`var(--miniplayer-bg)`**; no shadow) over the skip icon. **`GuestSkipLimitDialog`** + **`--z-stacked-modal`** (alias **`--z-guest-skip-dialog`**) at cap. **Long walkthrough:** **`docs/Guest-music-skip-limit-tutorial.md`**; Figma [**`23:20013`**](https://www.figma.com/design/duguG08ZOCWXQemLw59XJW/UX-SM-MPR-Mobile-2604?node-id=23-20013) (badge), [**`5568:166350`**](https://www.figma.com/design/duguG08ZOCWXQemLw59XJW/UX-SM-MPR-Mobile-2604?node-id=5568-166350) (dialog).

---

## React Router `navigate` + `location.state` (guest preroll vs mini expand)

- **Problem:** Guest **`MusicPlayer`** **remounts** on **`/music/:channelId/play`**. We want **`PlayerPrerollAd`** only when the user **tunes** from browse (e.g. **Play** on **`MusicChannelInfo`**), not when **re-opening** the full player from **`MiniPlayer`** (same URL would otherwise show preroll again).
- **Idea:** Call **`navigate(path, { state: { … } })`** to attach **`location.state`**. Read it with **`useLocation()`** on the destination screen. **`MiniPlayer`** passes **`expandFromMiniPlayer: true`**. **`MusicPlayer`** initializes **`prerollComplete`** and **`playing`** as if preroll already finished when that flag is set; **`useLayoutEffect`** still picks up **pause** from **`PlaybackContext`** for the current channel.
- **Tune vs expand:** Channel **Play** uses **`navigate(\`/music/${id}/play\`)`** with **no** `state` → preroll runs for **`showPlayerPreroll`** tiers (**guest**, **free Stingray**). **Open full player** from the mini strip uses the `state` object above → skip preroll.
- **Caveat:** **`location.state`** is held in **history**, not the URL — it is **lost on a full page reload**. OK for this in-browser prototype.
- **Files:** **`MiniPlayer.jsx`**, **`MusicPlayer.jsx`**.

---

## Listen again — `ListenHistoryProvider` + compact tiles

- **Idea:** **Listening history** for the prototype lives in **`ListenHistoryProvider`** (`src/context/ListenHistoryContext.jsx`): **empty on load**, **in-memory**. **Music:** **`recordMusicChannelListen(id)`** when **`MusicPlayer`** is allowed to play (after **guest preroll** completes or when preroll is skipped). **Podcasts:** **`recordPodcastShowListen(podcastShowId)`** from **`PodcastPlayer`** after preroll and when the user engages (**play** or **progress > ~5%**), once per episode visit. **Radio:** **`recordRadioStationListen(stationId)`** from **`RadioPlayer`** after the same preroll gate as music (**`MusicPlayer`** parity). **Scoped clear:** **`clearHistoryByKind('music' | 'podcast' | 'radio')`** removes only that kind (**`isListenHistoryKind`** guard); **`clearListenHistory()`** still clears the full list (**Listen again More**). **Dedup** = move existing id to **newest**; cap with **`LISTEN_HISTORY_MAX_STORED`** (`src/constants/listenHistory.js`); kinds listed in **`LISTEN_HISTORY_KINDS`**. **Home** shows a **Listen again** **`ContentSwimlane`** only when `items.length > 0`, with **compact** **`MusicChannelCard`** / **`PodcastCard`** / **`RadioStationCard`** + **ghost** **`ContentTileCard`** fillers up to **`LISTEN_AGAIN_RAIL_SLOT_CAP`** (12). **More:** **`/more/listen-again`** → **`ListenAgainMore.jsx`** (grid like **`SwimlaneMore`**), **`ScreenHeader`** **`endSlot`** = text **Clear** (`screen-header__text-btn`). **`renderListenAgainTile`** in **`ListenAgainCard.jsx`** maps **`kind`** **`music` \| `podcast` \| `radio`**. **My Library** (Phase 4+) will **`filter`** the same **`items`** by kind. **`Home`** keeps a **comment block** above the lane for future **Favorites**.
- **Figma:** [Listen again — More + Clear](https://www.figma.com/design/duguG08ZOCWXQemLw59XJW/UX-SM-MPR-Mobile-2604?node-id=19801-39250).
- **Plan:** **`docs/Plans/plan.md`** → **Listen again (user history) — specification**.
- **Walkthrough (wiring):** [`Listen-again-tutorial.md`](Tutorials/Listen-again-tutorial.md).
- **Podcasts + episodes stack (files, hooks, line-by-line):** [`Podcasts-and-episodes-deep-dive-tutorial.md`](Tutorials/Podcasts-and-episodes-deep-dive-tutorial.md).

---

## Catalog scope (`catalogScope`) vs music lineup

- **Idea:** **Navigation / IA** will branch on **`limited` | `broad`** catalog (Info vs My Library, Browse home, etc.). **State** still lives in one place: **`TerritoryProvider`** (`src/context/TerritoryContext.jsx`). **`musicLineupMode`** drives Search/Browse music data shape; **`catalogScope`** is derived via **`catalogScopeFromMusicLineup()`** in **`src/constants/catalogScope.js`** (`CATALOG_SCOPE` mirrors **`MUSIC_LINEUP`** for now).
- **Usage:** **`const { catalogScope, musicLineupMode } = useTerritory()`**. Toggle is unchanged: **second tap on Music** in **Search** (`Search.jsx`) calls **`toggleMusicLineupMode`** — **`catalogScope`** updates with it.
- **Later:** If real rules split territory from IA, add separate state in **`TerritoryProvider`** and stop deriving **`catalogScope`** from lineup only.

---

## Search browse content switcher — layout before paint + tab-only motion

- **Problem:** A sliding thumb needs real **pixels** from the DOM (`left` / `width`). **Global** motion after mount (`useEffect([])`) plus **`ResizeObserver`** makes the thumb **animate again** when returning to Search (remount / layout nudge).
- **Pattern:** **`useLayoutEffect`** measures and sets state **before** paint. **`useState`** holds `{ left, width }`. Turn **`thumbMotion` on only when `activeIndex` changes** after the first layout pass of that mount (`isFirstLayoutRef` + `prevActiveIndexRef`). Reset motion with **`transitionend`** + a **timeout fallback** so resize-only updates **snap**. Default CSS keeps **`transition: none`** on the thumb.
- **Tutorial:** [`SearchBrowseContentSwitcher-thumb-layout-tutorial.md`](Tutorials/SearchBrowseContentSwitcher-thumb-layout-tutorial.md) — step-by-step. **Code:** `src/components/SearchBrowseContentSwitcher.jsx`. **Non-route reuse:** **`mode="local"`** + **`ariaLabel`** on **Info** audio quality (see **Info tab** section).

---

## Radio International — swimlane + geo pill row

- **Problem:** **Browse Radio → International** needs a **repeating subregion screen**: show **what is popular** in the current geo node **and** let the user drill into **child** regions (countries, provinces, cities) without inventing a new layout per level.
- **Pattern:** **`ContentSwimlane`** ( **`RadioStationCard`**, **More** when not a leaf) + a **pill row** (**`GeoBrowsePill`**) under an **Explore _Region_** heading (**`content-swimlane__title`**). **Leaf** nodes: swap the swimlane for a **2-col grid** of the same cards when there are **no child pills**. **Vertical rhythm:** parent **`.search-radio-intl__scroll`** is a column flex container with **`gap: var(--space-screen-gap)`** — prefer that over stacking **`margin-bottom`** on sections.
- **Data + URL:** **`radioInternationalBrowse.js`** (**`resolveGeoNodeFromSegments`**, **`getPopularStationsForGeoNode`**, **`getChildGeoNodes`**); **`SearchRadioInternationalStack.jsx`** parses **`/search/browse/radio/international/...`** segments. Invalid paths → **`<Navigate>`** back to radio browse.
- **Tune:** **`/radio/:stationId`** (**`RadioStationInfo`**) / **`/play`** (**`RadioPlayer`**).
- **Tutorial:** [`Radio-geo-subregion-swimlane-pills-tutorial.md`](Tutorials/Radio-geo-subregion-swimlane-pills-tutorial.md); **plan checklist:** [`Radio-Browse-implementation-plan.md`](Plans/Radio-Browse-implementation-plan.md).

---

## How to use this file

- When you learn something new with the AI or in docs, ask to **append a short section** here (or add it yourself).
- Prefer **one topic per section** with a `##` heading so you can jump in the outline.
- Keep examples tied to **this** app’s components and paths when possible.
