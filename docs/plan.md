# Stingray Music (MPR) mobile prototype — implementation plan

This file is the **running plan**: what we intend to do, what we have done, and what is next. Use it to **onboard after a break** and to keep scope visible without digging through chat history.

**See also:** `docs/Home-screen-story.md` (product story for Home), `docs/figma-nodes.md` (Figma links), `src/data/*` (mock catalogs).

---

## Goals (prototype)

- **Clickable** mobile-first UX: music, podcasts, radio.
- **Fake data only**; no real APIs.
- **Figma** as layout reference; match structure and hierarchy, not pixel perfection by default.
- **User types** (guest, provided, subscribed) reflected in **header, ads, and footer height** (stubs are OK).

---

## What we have done

- [x] Vite + React project scaffold.
- [x] Cursor project rules: `.cursor/rules/stingray-music-prototype.mdc` (swimlanes, bottom nav, tokens, fake data).
- [x] `docs/figma-nodes.md` — design file and screen node links.
- [x] `docs/Home-screen-story.md` — Home narrative (header, banner, swimlanes, footer, ads, user types).
- [x] `docs/plan.md` — this living plan (update as we ship scope).
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
- [ ] **Chrome** — BottomNav, header, banner, mini player (per step 4).

---

## Home screen — implementation approach

**Recommended order** (aligns with component-first UX work):

1. **Card components (three content types)** — **done** (default tile; **small / no-label** variant later for Listen again).

2. **Swimlane / row** — **done** (`ContentSwimlane`). Inset **title + “More”**, full-bleed **horizontal scroll** with inner `padding-inline: var(--space-content-inline)`.

3. **Home page (first vertical slice)** — **done** for routing: **`/` → `Home`**, with `main.app-shell` → `home-screen` + swimlanes. **Chrome** (nav, header, …) in step 4.

4. **Chrome after core content**  
   `BottomNav`, `Home` header (branding, Upgrade / provider), banner, `padding-bottom` for nav + safe area. Then Listen again, Favorites, Recommendations, ads, mini player — with mock state where needed.

5. **User mode stub**  
   Context or simple state: guest | provided | subscribed — drives header CTA, ad visibility, and footer content height per `Home-screen-story.md`.

---

## Next steps (near term)

- [x] `react-router-dom` + `BrowserRouter` + **`Home`** at `/`.
- [ ] **More routes** — tab destinations, stacked detail/player flows (per Figma when confirmed) + `BottomNav` with `NavLink`.
- [x] **Cards** + **swimlane** (see above).
- [ ] Refine `--card-tile-*` from Figma if needed.
- [ ] Append to `docs/react-learning.md` when adding `NavLink` / BottomNav here.

---

## Backlog / later

- [ ] **Listen again** — mixed small tiles; `recentlyPlayed` mock.
- [ ] **Favorites** — liked content rail (sparse by design).
- [ ] **Recommendations** — generic stub, then “informed by” fake history.
- [ ] Detail screens: music channel info, podcast info, station info; then players + mini player.
- [ ] **International radio** hierarchy — `radioStations.js` + `docs/figma-nodes.md` notes.
- [ ] **Territory** variants (150+ vs 1000+ channels) for browse, when building Search & Browse.

---

## How to maintain this file

- After **meaningful** work (a feature, a milestone, or a clear scope change): update **What we have done** and **Next steps**; adjust **Backlog** as needed.
- **Do not** log every tiny fix — focus on what future-you needs to remember.
- This file does **not** replace `Home-screen-story.md` (product) or `figma-nodes.md` (design index); it **ties implementation to them**.

*Last updated: 2026-04-24* (Home route)
