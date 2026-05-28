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
