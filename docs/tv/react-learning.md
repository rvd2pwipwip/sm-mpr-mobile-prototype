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
