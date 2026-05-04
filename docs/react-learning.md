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

- **Idea:** **`createContext`** + **`UserTypeProvider`** in **`src/context/UserTypeContext.jsx`** hold prototype-wide **`userType`**: **`guest`**, **`provided`**, or **`subscribed`**. **`useUserType()`** returns **`{ userType, setUserType }`**. Wrap the tree that needs it (here: entire **`App`** inside **`App.jsx`**) so **`HomeHeader`**, **`Subscription`**, and later ads can read the same state without **prop drilling**.
- **Route:** **`/upgrade`** → **`src/pages/Subscription.jsx`** (+ **`Subscription.css`**), aligned with Figma **`220:40551`**: fixed blurred **back** bar, headline + price, bullet benefits, **Upgrade now** ( **`Button`** **`variant="subscribe-primary"`** — blue **`--color-accent`** fill via **`btn--subscribe-primary`**), **Select provider** (secondary + external-link icon; sets **provided** and opens Stingray provider SSO in a new tab), legal copy + Terms/Privacy links, and a dashed **Preview as** control row to flip type for demos.
- **`HomeHeader`** reads **`userType`**: guest shows **Upgrade**; provided shows an outlined **Provider** pill; subscribed shows **only** the centered wordmark (see **`docs/Stories/Home-screen-story.md`**).
- **Visual ads:** **`showVisualAds(userType)`** in **`src/utils/showVisualAds.js`** — **`true`** for **`guest`** / **`provided`**, **`false`** for **`subscribed`**. **`VisualAdStrip`** ( **`variant="nav"`** under **`BottomNav`**, **`variant="player"`** on **`MusicPlayer`**); **`SwimlaneBannerAd`** on **Home** below **`HomeBanner`**; **`showPlayerPreroll(userType)`** gates **`PlayerPrerollAd`** (15s + Skip, **guest** only on music **`/play`** when **tuning** from browse — not when expanding from **`MiniPlayer`**; see **`navigate` + `location.state`** section). **`VisualAdsHtmlSync`** sets **`data-visual-ads`** on **`<html>`** for footer stack height. **`docs/visual-ads-and-user-types.md`**.
- **Router note:** **`BottomNav`** treats **`/upgrade`** and **`/music/*`** as part of the **Home** tab ( **`useLocation`** + extra active check) so the bottom bar matches Figma while stacked URLs stay bookmarkable.

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

- **This project:** `src/components/BottomNav.jsx` + `BottomNav.css`; tab icons are **`public/home.svg`**, **`search.svg`**, **`infoGear.svg`** applied with **CSS `mask-image`** + **`background-color: currentColor`** so active/inactive tints still work. **`App.jsx`** mounts **`MiniPlayer`** + **`<BottomNav />`** as **siblings of `<Routes>`** (both hidden on **`/music/…/play`**). Tab items = **`NAV_ITEMS`** → **`NavLink`** with `end` on Home (`/`). Active tab = `className={({ isActive }) => …}` + `--active` styles; **`/upgrade`** and **`/music/*`** (except **`/play`**) keep **Home** active where Figma shows that stack.
- **Padding:** **`--footer-stack-scroll-padding`** in **`index.css`** = **`calc(var(--mini-player-offset) + var(--bottom-nav-stack-height) + env(safe-area-inset-bottom, 0px))`**. **`main.app-shell`** uses it for **`padding-bottom`**; **`--mini-player-offset`** flips **`0`** / **`var(--mini-player-height)`** via **`PlaybackContext`** on **`<html>`**. **Full-height scrolling behind the footer:** add **`app-shell--footer-fixed`** on **`main`**, **`padding-top`/`bottom: 0`**, **`height: 100dvh`** — scroll lives in **`.home-body-scroll`**, **`.music-info__scroll`**, **`app-shell-footer-scroll`**, etc., each with **`padding-bottom: var(--footer-stack-scroll-padding)`**. **Simple tab stubs** (**Search**, **Info**): **`app-shell-footer-scroll`** + **`safe-area`** top pad only. **Top** inset on the default (**non-footer-fixed**) shell still uses **`--safe-area-inset-top`**. **Home:** fixed **`HomeHeader`** — see [`Home-Header-tutorial.md`](Tutorials/Home-Header-tutorial.md). Content scrolls **behind** header and footer stacks.
- **Project rules** have the full token checklist → _Bottom navigation_.

---

## Miniplayer (footer strip + PlaybackContext)

- **Idea:** **`MiniPlayer`** (`src/components/MiniPlayer.jsx` + **`MiniPlayer.css`**) is a **fixed** bar **above** **`BottomNav`**, **`z-index`** **`--z-mini-player`** (above **`--z-chrome`**). **Figma:** component **`19777:32024`**. **`data-variant`** = **`music` | `podcasts` | `radio`** — controls follow **`docs/Stories/Miniplayer-component-story.md`**. Inverse tokens **`--miniplayer-*`** flip for light vs dark app chrome (see **`index.css`**).
- **PlaybackContext** (`src/context/PlaybackContext.jsx`): **`PlaybackProvider`** wraps **`App`** (inside **`BrowserRouter`**). **`miniPlayerVisible`** = session **`active`** + not on fullscreen **music play** (**`…/music/:channelId/play`**) **or podcast episode play** (**`…/podcast/:id/play/:episodeId`**). **`upsertMusicSession`** / **`upsertPodcastSession`** keep **`fullPlayerPath`** so tapping the MiniPlayer opens the full route with **`playOverDetailNavigateState({ expandFromMiniPlayer: true })`** (see **`MiniPlayer.jsx`**). Full players read **`PlaybackContext`** + **`location.state`** for preroll skip (**`Guest-preroll-grace-tutorial.md`**). **Teaching walkthrough:** [`Podcasts-and-episodes-deep-dive-tutorial.md`](Tutorials/Podcasts-and-episodes-deep-dive-tutorial.md).
- **Where to preview podcast/radio UI:** **`/`** podcasts swimlane; **`Info`** (**Podcast bar** / **Radio bar**) stubs call **`PlaybackContext`** demos (**`Clear`** = **`clearSession`**) beside real **`/podcast/...`** routes.

---

## Guest music skip limit (Context + hourly stamps)

- **Idea:** **Guest** users on **music** only get a **prototype cap**: each skip adds an **expiry time** (`now + recovery`); at most **`GUEST_MUSIC_MAX_ACTIVE_SKIPS`** unexpired stamps. **`provided`** / **`subscribed`** bypass the list. **Constants** live in **`src/constants/guestMusicSkips.js`**; **state** in **`GuestMusicSkipProvider`** (**`src/context/GuestMusicSkipContext.jsx`**) — keyed inner provider **`key={userType}`** clears tallies when **`UserTypeContext`** flips (demo on **`/upgrade`**). **`expiriesRef`** updates **synchronously** on consume so fast double-taps cannot read stale **`useState`**. **Prune** expired stamps on an **interval** (`GUEST_MUSIC_SKIP_PRUNE_INTERVAL_MS`) so the **count overlay** drops without another tap. **`MusicSkipButton`** (`size` **`mini`** | **`full`**) — **digit only** (**`var(--color-bg)`** vs **`var(--miniplayer-bg)`** via **`--music-skip-count-on-*`** tokens; no shadow) over the skip icon. **`GuestSkipLimitDialog`** + **`--z-guest-skip-dialog`** at cap. **Long walkthrough:** **`docs/Guest-music-skip-limit-tutorial.md`**; Figma [**`23:20013`**](https://www.figma.com/design/duguG08ZOCWXQemLw59XJW/UX-SM-MPR-Mobile-2604?node-id=23-20013) (badge), [**`5568:166350`**](https://www.figma.com/design/duguG08ZOCWXQemLw59XJW/UX-SM-MPR-Mobile-2604?node-id=5568-166350) (dialog).

---

## React Router `navigate` + `location.state` (guest preroll vs mini expand)

- **Problem:** Guest **`MusicPlayer`** **remounts** on **`/music/:channelId/play`**. We want **`PlayerPrerollAd`** only when the user **tunes** from browse (e.g. **Play** on **`MusicChannelInfo`**), not when **re-opening** the full player from **`MiniPlayer`** (same URL would otherwise show preroll again).
- **Idea:** Call **`navigate(path, { state: { … } })`** to attach **`location.state`**. Read it with **`useLocation()`** on the destination screen. **`MiniPlayer`** passes **`expandFromMiniPlayer: true`**. **`MusicPlayer`** initializes **`prerollComplete`** and **`playing`** as if preroll already finished when that flag is set; **`useLayoutEffect`** still picks up **pause** from **`PlaybackContext`** for the current channel.
- **Tune vs expand:** Channel **Play** uses **`navigate(\`/music/${id}/play\`)`** with **no** `state` → preroll runs for guests. **Open full player** from the mini strip uses the `state` object above → skip preroll.
- **Caveat:** **`location.state`** is held in **history**, not the URL — it is **lost on a full page reload**. OK for this in-browser prototype.
- **Files:** **`MiniPlayer.jsx`**, **`MusicPlayer.jsx`**.

---

## Listen again — `ListenHistoryProvider` + compact tiles

- **Idea:** **Listening history** for the prototype lives in **`ListenHistoryProvider`** (`src/context/ListenHistoryContext.jsx`): **empty on load**, **in-memory**. **Music:** **`recordMusicChannelListen(id)`** when **`MusicPlayer`** is allowed to play (after **guest preroll** completes or when preroll is skipped). **Podcasts:** **`recordPodcastShowListen(podcastShowId)`** from **`PodcastPlayer`** after preroll and when the user engages (**play** or **progress > ~5%**), once per episode visit. **Dedup** = move existing id to **newest**; cap with **`LISTEN_HISTORY_MAX_STORED`** (`src/constants/listenHistory.js`). **Home** shows a **Listen again** **`ContentSwimlane`** only when `items.length > 0`, with **compact** **`MusicChannelCard`** / **`PodcastCard`** + **ghost** **`ContentTileCard`** fillers up to **`LISTEN_AGAIN_RAIL_SLOT_CAP`** (12). **More:** **`/more/listen-again`** → **`ListenAgainMore.jsx`** (grid like **`SwimlaneMore`**), **`ScreenHeader`** **`endSlot`** = text **Clear** (`screen-header__text-btn`). **`renderListenAgainTile`** in **`ListenAgainCard.jsx`** centralizes **`kind: 'music' | 'podcast'`**. **`Home`** keeps a **comment block** above the lane for future **Favorites**.
- **Figma:** [Listen again — More + Clear](https://www.figma.com/design/duguG08ZOCWXQemLw59XJW/UX-SM-MPR-Mobile-2604?node-id=19801-39250).
- **Plan:** **`docs/plan.md`** → **Listen again (user history) — specification**.
- **Walkthrough (wiring):** [`Listen-again-tutorial.md`](Tutorials/Listen-again-tutorial.md).
- **Podcasts + episodes stack (files, hooks, line-by-line):** [`Podcasts-and-episodes-deep-dive-tutorial.md`](Tutorials/Podcasts-and-episodes-deep-dive-tutorial.md).

---

## How to use this file

- When you learn something new with the AI or in docs, ask to **append a short section** here (or add it yourself).
- Prefer **one topic per section** with a `##` heading so you can jump in the outline.
- Keep examples tied to **this** app’s components and paths when possible.
