# Developer guide — Stingray Music prototypes

Reference for **native mobile and TV engineers** using this repo as a **UX design handoff** while building production apps.

**What this is:** Clickable React prototypes (`apps/mobile`, `apps/tv`) with **fake data**, **stubbed auth/billing/streaming**, and **demo controls** to preview product variants. Flows and layout reflect intended UX; APIs and entitlements do not.

**What this is not:** A production codebase, API contract, or pixel-perfect Figma export.

---

## Quick start

**Prerequisites:** Node.js with npm.

```bash
npm install
npm run dev          # mobile (Vite default port, usually 5173)
npm run dev:tv       # TV (port 5174)
```

| Command                                | Purpose                                                                     |
| -------------------------------------- | --------------------------------------------------------------------------- |
| `npm run build` / `build:tv`           | Production build                                                            |
| `npm run media:sync`                   | One-time download of local cover art (~28 MB into `packages/shared/media/`) |
| `npm run dev:online` / `dev:online:tv` | Use remote placeholder images instead of synced media                       |

Cover art defaults to **local files** (`VITE_OFFLINE_MEDIA=true`). See `docs/mobile/offline-demo.md`.

**Viewing**

- **Mobile:** Browser at **460px x 990px** (phone frame in dev tools). Mobile prototype layouts are not responsive.
- **TV:** **1920 x 1080** locked viewport; **D-pad** navigation (Up/Down/Left/Right, Enter/Space activate, Esc back). No Tab in content.

**Shared code:** Mock catalogs, tier rules, and some contexts live in `packages/shared` (`@sm-mpr/shared`). Mobile and TV import the same product rules where possible.

---

## Default demo state

On a **fresh browser tab** (no `sessionStorage`):

| Axis            | Default        |
| --------------- | -------------- |
| User type       | `guest`        |
| Content profile | **Music only** |
| Catalog scope   | **Broad**      |

User type resets on full page reload. Catalog scope and content profile persist per tab in `sessionStorage` until cleared.

**Recommended starting point for exploration:** guest + music-only + broad. Switch variants only when reviewing a specific requirement.

---

## Configuration axes

Four **independent** axes drive what you see. Combine them deliberately — e.g. **limited catalog + Full MPR** is valid and common for territory IA review.

| Axis                | Values                                                | Affects (summary)                                                                                                      |
| ------------------- | ----------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| **User type**       | `guest`, `freeStingray`, `freeProvided`, `subscribed` | Header chrome, upgrade CTA, visual ads, music preroll, hourly skip cap, provider branding, account-gated actions       |
| **Content profile** | Music only (default), Full MPR                        | Whether podcasts and radio appear in Home, Search, Listen again, My Library, and player routes                         |
| **Catalog scope**   | Broad (default), Limited                              | Home IA, primary navigation, Search URL shape, where user library surfaces live                                        |
| _(TV limited only)_ | Stacked taxonomy Browse                               | Limited Home uses **stacked genre/topic/format swimlanes** (mobile `LimitedBrowse` parity), not a separate demo toggle |

**Source of truth for tier rules:** `packages/shared/utils/userTierRules.js`  
**Account-gated library actions:** `packages/shared/utils/userContentGates.js` (likes, podcast subscribe, episode bookmark — guests blocked)

---

## Demo controls

| Control                               | Mobile                                                            | TV                                                                          | Input         | Persists                 |
| ------------------------------------- | ----------------------------------------------------------------- | --------------------------------------------------------------------------- | ------------- | ------------------------ |
| **User type**                         | `/upgrade` scroll to **Preview as**                               | `/settings/user-type` (also: click **Info** or **My Library** screen title) | Touch / mouse | In-memory until reload   |
| **Content profile**                   | `/upgrade` → **Content profile**                                  | `/settings/user-type`                                                       | Touch / mouse | `sessionStorage` per tab |
| **Catalog scope**                     | Tap **wordmark** on broad Home or Limited Browse header           | Click **wordmark** on Home header                                           | Mouse only    | `sessionStorage` per tab |
| **Seed Listen again / library rails** | `/upgrade` → **Populate Clear / More demo data**                  | `/settings/user-type` → same control                                        | Touch / mouse | In-memory until reload   |
| **Player screensaver**                | —                                                                 | On a full-screen player (`/music/.../play`, podcast, radio): press **S** to show immediately (also enters after **30s** idle). **Esc** dismisses; D-pad / Enter wakes. | Keyboard      | Session only             |
| **Theme**                             | System light/dark, or `data-theme="light"` / `"dark"` on `<html>` | Same                                                                        | —             | —                        |

**Mobile tier screen:** Home → **Upgrade** (or `/upgrade`). Also holds subscription UI stubs and provider SSO demo.

**TV tier screen:** Home → **Upgrade** opens `/upgrade` (subscription copy); **Preview as** and **Content profile** live on `/settings/user-type`.

**Listen again / likes:** In-memory only. Refresh clears history and likes unless you use the seed control or play content during the session.

---

## User types

| `userType`     | Who (prototype)          | Header         | Visual ads (footer, in-feed, player strip) | Music preroll (15s) | Hourly skip cap (6 active) | Notes                                                    |
| -------------- | ------------------------ | -------------- | ------------------------------------------ | ------------------- | -------------------------- | -------------------------------------------------------- |
| `guest`        | Not signed in            | Upgrade CTA    | Yes                                        | Yes                 | Yes                        | Account required for likes, podcast subscribe, bookmarks |
| `freeStingray` | Stingray account, no sub | Upgrade CTA    | Yes                                        | Yes                 | Yes                        | Same monetization as guest in prototype                  |
| `freeProvided` | Partner / cable access   | Provider logos | Yes                                        | No                  | No                         | Upgrade in player header; provider brand row on players  |
| `subscribed`   | Paying / entitled        | Wordmark only  | No                                         | No                  | No                         | Cleanest chrome                                          |

Detail and placement map: `docs/mobile/visual-ads-and-user-types.md` (TV summary: `docs/tv/visual-ads-and-user-types.md`).

**TV player screensaver:** Full-screen idle screensaver includes a **provider promo** in the moving frame. This is **not** a visual ad — it shows for **all** tiers including subscribed. Demo: on any full-screen player after preroll, press **S** (or wait 30s idle). See `docs/tv/Plans/Tv-player-screensaver-implementation-plan.md`.

---

## Catalog scope (broad vs limited)

Territory IA fork — **not** the same as music-only vs Full MPR.

### Broad (default)

|                  | Mobile                                  | TV                                                   |
| ---------------- | --------------------------------------- | ---------------------------------------------------- |
| **Home `/`**     | Classic sampler (`Home.jsx`)            | Broad Home swimlanes                                 |
| **Primary nav**  | Bottom tabs: Home, Search, My Library   | Left nav: Home, Search, My Library                   |
| **Search**       | `/search` → last tab or `/search/music` | `/search/music`, `/search/podcasts`, `/search/radio` |
| **Info**         | `/info` redirects to **My Library**     | `/info` redirects to **My Library**                  |
| **User library** | **My Library** tab                      | **My Library** in left nav                           |

### Limited

|                  | Mobile                                                                                             | TV                                                                           |
| ---------------- | -------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------- |
| **Home `/`**     | **Browse-first** landing (`LimitedBrowse.jsx`) — Music / Podcasts / Radio tabs, taxonomy swimlanes | **Limited Home** — same tab model, **stacked taxonomy swimlanes**            |
| **Primary nav**  | **No bottom tab bar**; Search + Info in header                                                     | **No left nav**; Search + Info in header; mini player in header when playing |
| **Search**       | Single `/search` (tab URLs fold back)                                                              | Same tabbed Search routes; browse body differs                               |
| **Info**         | Classic Info hub at `/info`                                                                        | Info hub at `/info`                                                          |
| **User library** | Likes, Listen again, podcast library as **rails inside Browse tabs** — no My Library tab           | Same pattern on Limited Home tabs                                            |

**Demo control:** wordmark tap toggles broad ↔ limited.

Detail: `docs/mobile/Home-limited-catalog-and-layout.md`

---

## Content profile (music-only vs Full MPR)

Default **music-only** hides podcasts and radio across the app. **Full MPR** restores the three content-type sampler and mixed Listen again.

| Surface              | Music only                                                    | Full MPR                                           |
| -------------------- | ------------------------------------------------------------- | -------------------------------------------------- |
| Broad Home swimlanes | Music rails + Recommendations (no podcast/radio sampler rows) | Music → podcasts → radio sampler + recommendations |
| Listen again         | Music history only                                            | Music, podcast, radio                              |
| Search lanes / tabs  | Music lanes only; podcast/radio routes stubbed                | Full browse + search lanes                         |
| My Library           | Music-focused sections                                        | Full history, likes, podcast library rails         |

Independent of catalog scope. Toggle on `/upgrade` (mobile) or `/settings/user-type` (TV).

Detail: `docs/mobile/Plans/music-only-mvp-plan.md`

---

## Screen map (compact)

Routes live in `apps/mobile/src/App.jsx` and `apps/tv/src/App.jsx`. Figma node index: `docs/mobile/figma-nodes.md`, `docs/tv/figma-nodes.md`.

| Area                | Key routes                                                              | Variant notes                                                                            |
| ------------------- | ----------------------------------------------------------------------- | ---------------------------------------------------------------------------------------- |
| **Home**            | `/`                                                                     | Broad sampler vs limited Browse-first                                                    |
| **Search & Browse** | `/search`, `/search/:tab`, `/search/browse/...`                         | Broad: tabbed + deep browse. Limited: query-first `/search`. Profile gates podcast/radio |
| **My Library**      | `/my-library`, `/my-library/...`                                        | **Broad only** (tab / left nav). Limited surfaces user content on Home Browse tabs       |
| **Info / Account**  | `/info`, `/info/about`, `/info/contact`, `/my-library/account-settings` | Broad: Info via My Library hub. Limited: `/info` hub                                     |
| **Music**           | `/music/:id`, `/music/:id/play`                                         | Preroll + skip cap by user type                                                          |
| **Podcast**         | `/podcast/:id`, `/podcast/:id/play/:episodeId`                          | Full MPR only; guest account gates on subscribe/bookmark                                 |
| **Radio**           | `/radio/:id`, `/radio/:id/play`                                         | Full MPR only                                                                            |
| **Upgrade / tiers** | `/upgrade`, `/upgrade/store`                                            | Mobile: all demo controls. TV: `/settings/user-type` for Preview as + profile            |
| **More grids**      | `/more/:categoryId`, `/more/listen-again`                               | Swimlane overflow                                                                        |

**Footer chrome (mobile):** Bottom nav hidden on fullscreen play routes and some upgrade flows. Mini player docks above nav when playback is active.

**TV focus:** Vertical **parked** scroll on long screens (Home, Search browse, Limited Home). Spec: `docs/tv/vertical-parked-navigation.md`. **Esc** on Limited Home with active playback can focus the header mini player.

---

## UX decisions to carry into production

Short rules — rationale and narrative live in linked Stories / UX docs.

1. **Home is a sampler**, not the full catalog. Deep catalog lives in Search / Browse.
2. **Three content types, one app chrome** — shared tabs (broad), mini player, fullscreen player family, Listen again across types when Full MPR is on.
3. **Limited catalog** — Browse-first Home replaces a separate sampler Home; user library merges into Browse tabs.
4. **Personalization rails** — Show Listen again, likes, and podcast library sections **only when populated** (or after seed demo).
5. **Browse vs Search** — Broad Search combines live search + browse tabs. Limited Search is query-first with taxonomy on Home.
6. **Monetization is tier-specific** — Footer ads, in-feed banner, player strip, preroll, and skip cap are **not** one global “ads on/off” flag. See user type table above.
7. **Guest library actions** — Liking channels/stations, subscribing to podcasts, and bookmarking episodes require an account (stub dialogs).
8. **Music-only MVP** — Default demo reflects a music-first ship slice; Full MPR is the complete three-type product.

| Topic            | Doc                                                                                                 |
| ---------------- | --------------------------------------------------------------------------------------------------- |
| Home             | `docs/mobile/Stories/Home-screen-story.md`, `docs/mobile/UX/Home - UX Principles.md`                |
| Search & Browse  | `docs/mobile/Stories/Search-story.md`, `docs/mobile/UX/Search and Browse - UX Principles.md`        |
| My Library       | `docs/mobile/Stories/My-Library-story.md`, `docs/mobile/UX/My Lybrary - UX Principles.md`           |
| Mini player      | `docs/mobile/Stories/Miniplayer-component-story.md`, `docs/mobile/UX/Miniplayer - UX Principles.md` |
| Podcasts         | `docs/mobile/Stories/Podcasts-story.md`, `docs/mobile/UX/Podcasts - UX Principles.md`               |
| User types + ads | `docs/mobile/visual-ads-and-user-types.md`                                                          |

---

## Mobile vs TV

| Topic               | Mobile                            | TV                                               |
| ------------------- | --------------------------------- | ------------------------------------------------ |
| Input               | Touch-first, horizontal swimlanes | D-pad, focus groups, 9 cards + More per swimlane |
| Primary nav         | Fixed bottom tabs (broad)         | Collapsible left nav (broad)                     |
| Tier demo UI        | `/upgrade`                        | `/settings/user-type`                            |
| Viewport            | ~460px phone shell                | 1920 x 1080                                      |
| Shared data & rules | `@sm-mpr/shared`                  | Same package                                     |

Same **user types**, **catalog scope**, and **content profile** vocabulary on both platforms.

---

## Stubbed (do not treat as production behavior)

- Real SSO, App Store / Play billing, restore purchases backend (dialog stub only)
- Ad fill, mediation, IAB sizes
- Real audio streaming, DRM, offline downloads
- Cast / share beyond reserved UI overlays (mobile)
- Persistence beyond tab `sessionStorage` for demo toggles
- Desktop keyboard navigation on mobile

---

## Suggested review paths (~5–10 min each)

Use these to self-QA a requirement before inferring behavior from code alone.

1. **Guest, broad, music-only** — Home sampler → play a music channel → preroll → skip until cap dialog.
2. **Full MPR** — Toggle content profile → Home shows podcast/radio rows → mixed Listen again after playback.
3. **Limited catalog** — Wordmark toggle → no My Library tab (mobile) / no left nav (TV) → taxonomy Browse on Home.
4. **Subscribed** — Preview as subscribed → no ad strips; header wordmark only.
5. **Free provider** — Provider header → play music without preroll; provider row on player.
6. **TV limited + playback** — Limited Home → play music → header mini player → Esc focuses mini player.

---

## Deeper reference

| Need                      | Location                                                    |
| ------------------------- | ----------------------------------------------------------- |
| Limited catalog IA        | `docs/mobile/Home-limited-catalog-and-layout.md`            |
| Music-only implementation | `docs/mobile/Plans/music-only-mvp-plan.md`                  |
| Catalog / Search refactor | `docs/mobile/Plans/catalog-scope-search-browse-refactor.md` |
| Mobile Figma index        | `docs/mobile/figma-nodes.md`                                |
| TV Figma index            | `docs/tv/figma-nodes.md`                                    |
| TV focus / parked scroll  | `docs/tv/vertical-parked-navigation.md`                     |
| TV user types + ads       | `docs/tv/visual-ads-and-user-types.md`                      |
| Implementation history    | `docs/mobile/Plans/plan.md`, `docs/tv/Plans/plan.md`        |
| Design tokens             | `docs/mobile/design-tokens.md`                              |

---

## Appendix — one-page cheat sheet

**Run:** `npm install` → `npm run dev` (mobile) or `npm run dev:tv` (5174)

**Default:** guest · music-only · broad catalog

| Want to see…                           | Do this                                                           |
| -------------------------------------- | ----------------------------------------------------------------- |
| Another user tier                      | Mobile: `/upgrade` → Preview as. TV: `/settings/user-type`        |
| Podcasts + radio                       | Content profile → **Full MPR**                                    |
| Territory limited IA                   | Click **wordmark** (broad Home or limited Browse header)          |
| Listen again / library rails populated | Seed control on `/upgrade` or `/settings/user-type`; use Full MPR |
| No ads                                 | Preview as **subscribed**                                         |
| Guest skip cap + preroll               | `guest` or `freeStingray` → play music                            |
| Provider branding, no preroll          | **freeProvided**                                                  |
| TV player screensaver                  | Full-screen play route → press **S** (or wait 30s idle); **Esc** to dismiss |
| Local cover art missing                | `npm run media:sync` once on Wi-Fi                                |

**Tier quick matrix**

|              | Ads | Preroll | Skip cap | Upgrade in header |
| ------------ | --- | ------- | -------- | ----------------- |
| guest        | yes | yes     | yes      | yes               |
| freeStingray | yes | yes     | yes      | yes               |
| freeProvided | yes | no      | no       | yes (+ provider)  |
| subscribed   | no  | no      | no       | no                |

**Broad vs limited (one line)**  
Broad = Home sampler + My Library + tabbed Search. Limited = Browse-first Home, no My Library nav, user rails on Browse tabs.

**Code anchors**  
Tier rules: `packages/shared/utils/userTierRules.js` · Routes: `apps/mobile/src/App.jsx`, `apps/tv/src/App.jsx`
