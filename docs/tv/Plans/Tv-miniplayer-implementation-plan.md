# TV mini player — implementation plan

Living plan for the **left-nav mini player** in **`apps/tv/`** (Music player **Phase 7**). Full-screen music player v1 is done; this slice adds persistent “now playing” chrome in **`PrimaryNav`** and wires **`PlaybackContext`** through the app.

**Coordinator:** [`plan.md`](./plan.md)  
**Parent slice:** [`Music-player-agent-handoff.md`](./Music-player-agent-handoff.md) — Phase 7  
**Mobile reference (behavior only, not layout):** [`docs/mobile/Stories/Miniplayer-component-story.md`](../../mobile/Stories/Miniplayer-component-story.md), mobile `MiniPlayer.jsx` + `PlaybackContext.jsx`

**Figma file:** [SM HTML TV MPR](https://www.figma.com/design/DfwtFG53ud7EHhvlPutvI8/SM-HTML-TV-MPR) (`DfwtFG53ud7EHhvlPutvI8`)

---

## Product goal (one paragraph)

When music is playing and the user is **not** on `/music/:channelId/play`, show a **mini player** at the top of the **primary nav**. **Collapsed nav:** square tile with channel art on an **accent / music gradient** fill. **Expanded nav:** fixed-width row with **60px thumbnail**, **song title**, and **artist** (no play/pause/skip on TV). The mini player is a **shortcut**: **Enter** or click opens the **full-screen player** for the active session. Home swimlanes reflect **`session.channelId`** as “playing.”

---

## Figma references

| Frame | Node | URL | Use |
|-------|------|-----|-----|
| **menuMiniPlayer** (component; collapsed + expanded variants) | `15521:27316` | [Open](https://www.figma.com/design/DfwtFG53ud7EHhvlPutvI8/SM-HTML-TV-MPR?node-id=15521-27316) | Variant specs, measurements |
| **Expanded nav — mini focused** | `15757:36079` | [Open](https://www.figma.com/design/DfwtFG53ud7EHhvlPutvI8/SM-HTML-TV-MPR?node-id=15757-36079) | Focus ring on mini; labels visible on nav |
| **Expanded nav — menu item focused** | `15516:26917` | [Open](https://www.figma.com/design/DfwtFG53ud7EHhvlPutvI8/SM-HTML-TV-MPR?node-id=15516-26917) | Mini expanded but **unfocused** (no 10px ring on mini); Home has focus ring |

**Related (already in code comments):** slot + spacer `15516:26821` / `15521:27316` in `PrimaryNav.css`.

### Variant: collapsed (`property1=collapsed`)

- **Square control:** `60px` cover + `10px` padding → **80×80** outer hit target (fits `--nav-items-width-collapsed: 80px`).
- **Radius:** `10px` on outer button.
- **Fill:** Figma **music gradient** (purple → blue). Product note: reads as **accent2 / brand** on TV — map to tokens (see Phase 2), not a one-off hex in JSX.
- **Content:** **thumbnail only** (`smCover` 60×60, `border-radius: 4px`).
- **No** title, artist, or transport controls.

### Variant: expanded (`property1=expanded`)

- **Row height:** `100px`; width clips inside nav panel (**250px** canvas per `--nav-items-width-expanded`; outer wrapper may be wider in Figma — implement to **nav panel width**, not 500px bleed).
- **Radius:** `20px` on outer button.
- **Padding:** `pl 20px`, `pr 10px`, `py 10px`.
- **Fill:** same music gradient + `backdrop-filter: blur(6px)` (prototype: optional if perf OK).
- **Thumbnail:** `60×60`, `4px` radius, `16px` gap to text.
- **Typography:** Roboto **Bold 24** title (`--color-on-accent` / white on gradient), Roboto **Regular 24** artist (`rgba(255,255,255,0.8)` or token).
- **Text:** single-line ellipsis on title and artist; fixed width within row.
- **No** play/pause, skip, like, or progress on TV mini player (unlike mobile `19777:32024`).

### Focus vs unfocused (expanded nav only)

| State | Mini player chrome |
|--------|-------------------|
| **Focused** (mini is active nav target) | Shared TV focus ring: `--tv-focus-ring-width` / `--tv-focus-ring-color` (not Figma container border) |
| **Unfocused** (another nav row focused) | Gradient + content visible; no focus ring |

**Implementation:** Collapsed nav — ring on **thumb wrap** (same pattern as nav icon-stack). Expanded nav — ring on **full mini row** (same as expanded `.primary-nav__link`).

---

## Mobile vs TV (scope boundary)

| Topic | Mobile | TV (this plan) |
|--------|--------|----------------|
| **Placement** | Fixed strip above bottom tabs | Top of **left `PrimaryNav`**, above Home / Search / Library |
| **Collapsed chrome** | N/A (always full strip width) | **80×80** thumb-only square |
| **Expanded chrome** | Thumb + text + **controls** | Thumb + text **only** |
| **Open full player** | Tap main area → `navigate(fullPlayerPath)` | **`onSelect`** → same path |
| **Preroll when opening from mini** | `location.state.expandFromMiniPlayer` skips preroll | **Add same state** on TV `MusicPlayer` when mini exists |
| **Scroll padding** | `--mini-player-offset` on `<html>` | **Not needed** (no bottom dock) |
| **Variants** | `music` / `podcasts` / `radio` | **Music v1 only** (`session.variant === "music"`) |
| **Hide when** | On `…/play` or no session | Same: `miniPlayerVisible` already in TV `PlaybackContext` |

---

## Current repo state

| Piece | Status |
|-------|--------|
| `PlaybackProvider` on TV | **Done** — `session`, `upsertMusicSession`, `miniPlayerVisible`, hide on `/music/.../play` |
| `MusicPlayer` upsert on play | **Done** — stub title/artist strings |
| `primary-nav__mini-player-slot` | **Placeholder** — empty, `aria-hidden` |
| `TvMiniPlayer` component | **Missing** |
| Nav focus indices | **0–2** = Home, Search, Library only — **mini not in nav order yet** |
| Home `playingChannelId` | **Stub** — `MUSIC_CHANNELS[0]` in `BroadHome.jsx` |
| `expandFromMini` on TV player | **Not wired** |
| Figma index | **To add** in `docs/tv/figma-nodes.md` |

---

## Locked decisions (defaults)

1. **Music only** for v1 — hide slot (or render nothing) when `session.variant !== "music"` or `!session.active`.
2. **No transport controls** on TV mini — shortcut + metadata display only.
3. **Shortcut** — `navigate(session.fullPlayerPath, { state: { expandFromMiniPlayer: true } })` so guest tier can skip preroll when returning from mini (parity with mobile).
4. **Visibility** — `miniPlayerVisible` from context; slot stays in DOM with `visibility: hidden` when inactive (per existing `PrimaryNav.css` comment — preserves menu Y).
5. **Collapsed vs expanded** — driven by **`navExpanded`** (`TvNavFocusContext`), not a separate user toggle.
6. **Do not port** mobile `MiniPlayer.jsx` layout or bottom offset effects.
7. **SMTV03** — not a layout source; use TV Figma + existing `KeyboardWrapper` / `FocusableButton` patterns.

---

## Implementation phases

### Phase 0 — Docs and Figma index

- [x] Add **Primary nav / mini player** table to `docs/tv/figma-nodes.md` (nodes above).
- [x] Link this plan from `Music-player-agent-handoff.md` Phase 7 and `plan.md` **Next steps**.

---

### Phase 1 — Tokens and layout (`index.css` + `PrimaryNav.css`)

- [x] Mini player tokens in `index.css`; slot height 100px.
- [x] Slot visibility + focus-ring buffer on `primary-nav__mini-player-item`.

---

### Phase 2 — `TvMiniPlayer` component

- [x] `TvMiniPlayer.jsx` + `TvMiniPlayer.css` — collapsed/expanded; shared focus ring (not Figma border).

---

### Phase 3 — Nav focus integration

- [x] Nav index 0 = mini; tabs shift; `TvNavFocusContext` dynamic `navMaxIndex`.
- [x] `PrimaryNav` mount + `KeyboardWrapper` shortcut.

---

### Phase 4 — `PlaybackContext` and full player parity

- [x] `MusicPlayer` `expandFromMiniPlayer` preroll skip.

---

### Phase 5 — Home “now playing” swimlanes

- [x] `BroadHome` `playingChannelId` from session.

---

### Phase 6 — QA and docs

- [x] `react-learning.md`, handoff + `plan.md` updated.
- [ ] Manual QA table (below) — click-through in browser.

**Acceptance:** `npm run build:tv` passes.

---

## Manual QA checklist

Run `npm run dev:tv` (port **5174**).

| Step | Action | Expected |
|------|--------|----------|
| 1 | No session | Mini slot empty/hidden; nav indices 0–2 = three tabs only |
| 2 | Channel Info → Play → Esc | Mini appears in nav (collapsed if nav collapsed) |
| 3 | **Left** into nav | Nav expands; mini shows thumb + title/artist when expanded |
| 4 | Focus mini → **Enter** | Full player opens; preroll skipped if guest already saw preroll |
| 5 | Esc from full player | Mini visible again; not on play route |
| 6 | Home swimlane | Playing indicator on active channel card |
| 7 | `/music/:id/play` | Nav hidden (`TvShell`); mini hidden via `miniPlayerVisible` |

---

## Files to touch (summary)

| File | Change |
|------|--------|
| `apps/tv/src/components/nav/TvMiniPlayer.jsx` | **New** |
| `apps/tv/src/components/nav/TvMiniPlayer.css` | **New** |
| `apps/tv/src/components/nav/PrimaryNav.jsx` | Mount mini; nav refs + `onSelect` |
| `apps/tv/src/components/nav/PrimaryNav.css` | Slot height, clip helpers |
| `apps/tv/src/context/TvNavFocusContext.jsx` | Dynamic nav item count / index 0 mini |
| `apps/tv/src/pages/MusicPlayer.jsx` | `expandFromMini` preroll skip |
| `apps/tv/src/pages/BroadHome.jsx` | `playingChannelId` from session |
| `apps/tv/src/index.css` | Mini player tokens |
| `docs/tv/figma-nodes.md` | Figma table |
| `docs/tv/Plans/Music-player-agent-handoff.md` | Link this plan |
| `docs/tv/Plans/plan.md` | Next steps |

---

## Out of scope (unless user asks)

- Podcast / radio mini variants
- Pause/skip/like on mini
- Mobile-style `--mini-player-offset` scroll padding
- Clearing session / stop button on mini
- Mini player on **limited catalog** (no `PrimaryNav` today — unchanged)
- Pixel-perfect 500px Figma wrapper width (implement to **250px** nav panel)

---

## Suggested PR scope

**One PR:** Phases 0–6 (component + nav focus + session wiring + Home playing state + docs).

Keep **vertical parked navigation** and unrelated Home experiments out of the same PR.

---

_Last updated: 2026-06-04 — initial plan from Figma `15521:27316`, `15757:36079`, `15516:26917` + product notes._
