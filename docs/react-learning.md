# React learning notes — Stingray Music (MPR) mobile prototype

Short **append-only** notes for concepts introduced while building this repo. The project rules (`.cursor/rules/stingray-music-prototype.mdc`) summarize patterns for implementation; this file is the **longer memory** when you need a refresher.

**Design tokens (colors, spacing, card sizes)** — not React-specific, but the workflow for you and for UI passes lives in **`docs/design-tokens.md`**, with values in **`src/index.css`**.

**Context:** This prototype continues the same React learning journey as the sibling **karaoke** mobile prototype (layout, swimlanes, bottom nav). Company priorities moved work here; ideas you already practiced there still apply—this document records what we do **in this codebase** (music, podcasts, radio, Figma `UX-SM-MPR-Mobile-2604`).

---

## Content tile cards (shared layout + three wrappers)

- **Idea:** One **presentational** component (`ContentTileCard`) owns the **visual pattern**: fixed width (`--card-tile-width`), square image with `--radius-media-thumb`, one-line **title** + optional **subtitle**, and a **`<div>`** with `onClick` for touch interaction. This stack targets a **native mobile** feel in the browser — **not** full web a11y or keyboard support (on purpose for this prototype). It takes plain strings + `imageUrl` — it does not know about music vs podcast.
- **Domain cards** (`MusicChannelCard`, `PodcastCard`, `RadioStationCard`) are **thin**: they read from the mock objects in `src/data/*`, map fields to `title` / `subtitle` (e.g. radio uses `frequencyLabel` when set, else `categoryLabel`), and pass an optional `onSelect` for later navigation.
- **Why:** Same layout in every swimlane; only the data mapping changes. A future **small / no-label** “Listen again” tile can be a `variant` on `ContentTileCard` or a separate class — without duplicating the three domain components’ data logic.
- **Files:** `src/components/ContentTileCard.jsx` + `ContentTileCard.css`, and the three `*Card.jsx` files next to it.

---

## Button (`Button.jsx` — CTA vs secondary)

- **Idea:** One **`<button>`** with a **`variant`** prop: **`cta`** = solid brand fill (`--color-accent2` / `--color-on-accent2`); **`subscribe-primary`** = subscription primary (**`--color-accent`** / **`--color-on-accent`**, Figma blue on the Upgrade screen); **`secondary`** = **no fill**, **2px** border (`--color-button-secondary-border` from `color-mix` on `--color-text`). Optional **`startIcon`** / **`endIcon`** are any **React nodes** (usually small inline **SVG** with `currentColor` so the icon matches the label).
- **Tokens:** `--button-height-md`, `--button-icon-size`, `--font-size-button`, etc. in **`index.css`** — tune to Figma `button/md` without editing the component.
- **Figma:** [Button / md — CTA + secondary](https://www.figma.com/design/duguG08ZOCWXQemLw59XJW/UX-SM-MPR-Mobile-2604?node-id=19726-48115).

---

## Home header (fixed bar + `useHomeHeaderOffset`)

- **Idea:** `HomeHeader` is **fixed** top chrome; the scroll column (`.home-body-scroll`) needs **`padding-top: var(--home-header-offset)`** so content starts below the bar. Because the bar is out of flow, the **measured** header height is written to `--home-header-offset` on `<html>` via **`useHomeHeaderOffset()`** in **`HomeHeader.jsx`** — **`useRef`**, **`useLayoutEffect`**, and **`ResizeObserver`**. Figma “hug” + padding = one **`offsetHeight`**; variants with different content heights **re-measure** automatically.
- **Long tutorial (step by step):** **`docs/Header.md`**.

---

## Swimlane layout pattern (Figma column + full-bleed scroll)

- **Idea:** The **page column** (header, titles) uses the content inset; each **horizontal row** of cards is **full width** under the phone shell, with **padding on the inner flex row** so the first/last cards align with the column. See project rules → _Swimlane layout_ for the full checklist (`--space-content-inline`, siblings of `.content-inset`, hidden horizontal scrollbar, scroll-snap caution).
- **This repo:** `src/components/ContentSwimlane.jsx` + `ContentSwimlane.css` — `section` with padded **header** (title + “More”) + **`overflow-x: auto`** scrollport + **inner** flex row with `padding-inline: var(--space-content-inline)` and `gap: var(--card-tile-gap)`. Pass any combination of the `*Card` components as **children** to fill the row.
- **Sibling reference:** The karaoke prototype’s `SongSwimlane.jsx` + `SongSwimlane.css` is a working example of the same geometry with different card content.

---

## User type context + Subscription (Upgrade) screen

- **Idea:** **`createContext`** + **`UserTypeProvider`** in **`src/context/UserTypeContext.jsx`** hold prototype-wide **`userType`**: **`guest`**, **`provided`**, or **`subscribed`**. **`useUserType()`** returns **`{ userType, setUserType }`**. Wrap the tree that needs it (here: entire **`App`** inside **`App.jsx`**) so **`HomeHeader`**, **`Subscription`**, and later ads can read the same state without **prop drilling**.
- **Route:** **`/upgrade`** → **`src/pages/Subscription.jsx`** (+ **`Subscription.css`**), aligned with Figma **`220:40551`**: fixed blurred **back** bar, headline + price, bullet benefits, **Upgrade now** ( **`Button`** **`variant="subscribe-primary"`** — blue **`--color-accent`** fill via **`btn--subscribe-primary`**), **Select provider** (secondary + external-link icon; sets **provided** and opens Stingray provider SSO in a new tab), legal copy + Terms/Privacy links, and a dashed **Preview as** control row to flip type for demos.
- **`HomeHeader`** reads **`userType`**: guest shows **Upgrade**; provided shows an outlined **Provider** pill; subscribed shows **only** the centered wordmark (see **`Home-screen-story.md`**).
- **Router note:** **`BottomNav`** treats **`/upgrade`** as part of the **Home** tab ( **`useLocation`** + extra active check) so the bottom bar matches the Figma comp while the URL stays **`/upgrade`**.

---

## React Router (`BrowserRouter`, `Routes`, `NavLink`)

- **This project:** `BrowserRouter` wraps the app in **`src/main.jsx`**. **`src/App.jsx`** defines **`<Routes>`** / **`<Route>`** (start with **`path="/"`** → **`<Home />`** in `src/pages/Home.jsx`). Add tab routes and detail routes here as you build screens.
- **Why two files?** The router must wrap the tree that contains `Routes`; keeping `BrowserRouter` in `main.jsx` is a common pattern so `App` stays a pure route table. Page components (Home, etc.) own **`main.app-shell`** and their layout.
- **Next:** `NavLink` in `BottomNav` with matching `Route` paths — URL = selected tab. See project rules → _Bottom navigation_.

---

## Bottom navigation (tabs)

- **This project:** `src/components/BottomNav.jsx` + `BottomNav.css`, icon paths in `MprNavIcons.jsx` (replace when Figma exports land). **`App.jsx`** mounts `<BottomNav />` as a **sibling of `<Routes>`** so the bar appears on **Home, Search, and Info**. Tab items = **`NAV_ITEMS`** array → **`NavLink`** with `end` on Home (`/`). Active tab = `className={({ isActive }) => …}` + `--active` styles; **`pathname === '/upgrade'`** also marks **Home** active (subscription flow lives under the Home tab in Figma).
- **Padding:** `main.app-shell` uses **`calc(var(--bottom-nav-stack-height) + env(safe-area-inset-bottom))`** bottom padding so scrollable content does not sit under the fixed bar (see `index.css`). **Top** inset on non-Home shell uses **`--safe-area-inset-top` (30px)** (prototype token, not `env(safe-area-inset-top)`). **Home:** fixed **`HomeHeader`** + **`home-body-scroll`** `padding-top` / **`--home-header-offset`** — see **`docs/Header.md`** and the **Home header** section above. As you scroll, content moves **up behind** the header (same `z-chrome` layer as the bottom bar).
- **Project rules** have the full token checklist → _Bottom navigation_.

---

## How to use this file

- When you learn something new with the AI or in docs, ask to **append a short section** here (or add it yourself).
- Prefer **one topic per section** with a `##` heading so you can jump in the outline.
- Keep examples tied to **this** app’s components and paths when possible.
