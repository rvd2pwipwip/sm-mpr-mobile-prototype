# Stingray Music (MPR) TV prototype — implementation plan

Living plan for **`apps/tv/`**: what we intend to do, what we have done, and what is next. Use this to onboard after a break.

**Repo layout:** **`apps/tv/`** is the TV Vite app (port **5174**). Shared mock data lives in **`packages/shared`** (`@sm-mpr/shared`). Mobile remains **`apps/mobile/`**.

**Docs layout:** **`docs/tv/`** — **`Plans/`**, **`figma-nodes.md`**, **`react-learning.md`**. Mobile docs under **`docs/mobile/`** remain the product reference for content IA and catalog rules.

**See also:**

- **`docs/tv/Plans/Music-player-agent-handoff.md`** — **start here** for music player implementation (clean-slate agent brief)
- **`docs/tv/Plans/Music-player-implementation-plan.md`** — detailed player plan (reference)
- **`docs/tv/Plans/vertical-parked-navigation-plan.md`** — vertical parked focus ring (tag-row pattern on Y); Phase A geometry in `tvFocusGeometry.js`
- **`docs/tv/Plans/cards-and-swimlanes-implementation-plan.md`** — phased build plan for focus, cards, swimlanes (start here for implementation)
- **`docs/tv/figma-nodes.md`** — TV Figma index ([SM HTML TV MPR](https://www.figma.com/design/DfwtFG53ud7EHhvlPutvI8/SM-HTML-TV-MPR?node-id=0-1))
- **`docs/mobile/Stories/Home-screen-story.md`** — broad Home content ordering (mobile; TV adapts layout)
- **SMTV03 workspace** — prior-year TV prototype; reference for focus/swimlane patterns only (not a port source)

---

## Goals (prototype)

- **Clickable** TV UX: music first, then podcasts and radio.
- **Fake data only**; shared catalogs with mobile via **`@sm-mpr/shared`**.
- **Figma TV file** as layout reference; structure and hierarchy over pixel perfection unless called out.
- **D-pad navigation** — no third-party spatial-nav library; patterns adapted from SMTV03 where they worked.
- **Broad catalog territory first**; limited catalog (filter rows, SMTV03-style Home) later.
- **User types** — same four tiers as mobile; **player + preroll** implemented per **`Music-player-implementation-plan.md`** (preview UI deferred to that plan Phase 6).

---

## Architectural decisions (locked)

| Topic | Decision |
|-------|----------|
| vs SMTV03 | **Rebuild** in monorepo; SMTV03 is reference, not a copy-paste port |
| vs mobile | Same **mock data** and product IA; **TV-specific** layout and focus components (do not reuse `ContentSwimlane`) |
| Component library | **No** `@smtv/tv-component-library` in this app; cards built in-repo with CSS tokens |
| Focus model | Vertical **groups** + horizontal **index** per swimlane (SMTV03 pattern, cleaned up) |
| Input | **D-pad only** for prototype nav; **Esc** = back; **Enter / Space** = activate; **no Tab** in content |
| Viewport | **1920 x 1080** locked; responsive browser frame later |
| Primary nav | **Collapsible** (icon rail vs expanded); Left from first card enters nav; Right returns to last focused card |
| Swimlane cap | **9** visible cards + **More** tile (mobile uses 12) |
| Card content | **Image + title** only; custom focus ring; optional **playing** state; episode cards are a later shape |
| StrictMode | Disable in `main.jsx` if double-mount breaks focus sync |

---

## What we have done

- [x] **`apps/tv` scaffold** — Vite + React; routes `/`, `/search`, `/my-library`; `TvShell` + `PrimaryNav`; `UserTypeContext` stub
- [x] **Overscan + focus tokens** — starter `index.css` (realigned to TV Figma light theme in Phase 0)
- [x] **`docs/tv/`** — plan, cards-and-swimlanes plan, `figma-nodes.md`, `react-learning.md`
- [x] **Phase 0 — shared data + TV shell** — `@sm-mpr/shared` (`musicChannels`, `musicBrowseTaxonomy`, `musicLineup`, `catalogScope`); mobile re-exports; TV 1920x1080 viewport, light tokens, `TerritoryProvider`, wordmark toggle, StrictMode off
- [x] **Phase 1 — focus foundation** — focus contexts, `KeyboardWrapper`, collapsible `PrimaryNav`, demo focus rows, Esc back route (`/focus-demo`)
- [x] **Phase 2 — content cards** — `ContentTileCard`, `MusicChannelCard`, `FocusableTile`, preview row on Home
- [x] **Phase 3 — fixed swimlane** — `FixedSwimlane`, `SwimlaneRow`, `SwimlaneMoreTile`, `MusicChannelSwimlane` on Home
- [x] **Phase 4 — two Home swimlanes** — Most popular + Recommendations rails; `/music/:channelId` info stub; More routes for both rails; demo focus row removed from Home
- [x] **Phase 5 — More grid and Channel Info** — `ContentGrid` (4 columns at default tokens), D-pad More screens, expanded info with Play stub and Related row
- [x] **Phase 6 — Variable swimlane and limited catalog** — `VariableSwimlane`, `GenreFilterSwimlane`, `LimitedHome` vs `BroadHome` via territory toggle

---

## What we have done (recent)

- [x] **Vertical parked navigation — Phase D+E** — double rAF polish, limited footer ad + scroll reserve, QA on parked up/down
- [x] **Vertical parked navigation — Phase B+C** — `useTvVerticalGroupScroll` ring-top parking + `BroadHome` / `LimitedHome` wiring; see **`vertical-parked-navigation-plan.md`**
- [x] **Home harmonization** — broad Home swimlanes match mobile order (music, podcasts, in-feed ad, radio, recommendations); **`@sm-mpr/shared`** tier rules + podcasts/radio data; SMTV03-style **`TvFooterAdBanner`**; **`/settings/user-type`** preview — see **`docs/tv/visual-ads-and-user-types.md`**
- [x] **Music player v1** — Phases 0–5 per **`Music-player-agent-handoff.md`**: shared `userContentGates`, TV providers, `/music/:channelId/play`, `TvPlayerPrerollAd`, Figma `23:20013` layout, Channel Info Play wired; mini player deferred (Phase 7)
- [x] **Music player Phase 6** — `/settings/user-type` tier QA UI + handoff QA table; preroll grace resets on `userType` change (matches skip cap)
- [x] **TV mini player (Phase 7)** — `TvMiniPlayer` in `PrimaryNav`, nav focus index 0, shortcut to full player; see [`Tv-miniplayer-implementation-plan.md`](./Tv-miniplayer-implementation-plan.md)

---

## Next steps (ordered)

1. **Phase 7+ backlog** — podcasts/radio cards, Search & Browse, TV in-player visual ads (if design adds frames)

Detail for cards/rails: **`docs/tv/Plans/cards-and-swimlanes-implementation-plan.md`**.

---

## How to maintain this file

- After a **meaningful milestone**, update **What we have done** and **Next steps**.
- Do not replace **`figma-nodes.md`** or mobile product stories; this file **coordinates** implementation.
- Append TV lessons to **`docs/tv/react-learning.md`** as patterns land in code.

_Last updated: 2026-06-03_
