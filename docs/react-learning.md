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

## Swimlane layout pattern (Figma column + full-bleed scroll)

- **Idea:** The **page column** (header, titles) uses the content inset; each **horizontal row** of cards is **full width** under the phone shell, with **padding on the inner flex row** so the first/last cards align with the column. See project rules → _Swimlane layout_ for the full checklist (`--space-content-inline`, siblings of `.content-inset`, hidden horizontal scrollbar, scroll-snap caution).
- **This repo:** When you add a swimlane component (e.g. a `ContentSwimlane` or music-specific row), wire the same DOM shape: `section` with a padded **header** + **`overflow-x: auto`** scrollport + **inner** row with `padding-inline: var(--space-content-inline)`.
- **Sibling reference:** The karaoke prototype’s `SongSwimlane.jsx` + `SongSwimlane.css` is a working example of the same geometry with different card content.

---

## React Router (`BrowserRouter`, `Routes`, `NavLink`)

- _To be expanded when routing is added to this project._  
- **Reminder:** `BrowserRouter` wraps anything that uses `Routes`, `Route`, or hooks like `useNavigate` / `useMatch`. Often lives in `main.jsx` or `App.jsx`.

---

## Bottom navigation (tabs)

- _To be expanded when `BottomNav` (or equivalent) is added here._  
- **Ideas you can reuse:** URL as source of truth with `NavLink`, `end` on the home tab, `NAV_ITEMS` array mapped to tabs, tokens for bar height and `.app-shell` bottom padding. See project rules → _Bottom navigation_.

---

## How to use this file

- When you learn something new with the AI or in docs, ask to **append a short section** here (or add it yourself).
- Prefer **one topic per section** with a `##` heading so you can jump in the outline.
- Keep examples tied to **this** app’s components and paths when possible.
