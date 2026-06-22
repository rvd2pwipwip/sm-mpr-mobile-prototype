# TV full-screen player screensaver — implementation plan

Living plan for **screensaver mode** on TV **full-screen player** routes in **`apps/tv/`**. After idle time with no D-pad input, the player chrome is hidden and a **moving frame** (cover art + metadata + ad footer) is shown to reduce static burn-in. Any remote input returns to the player. Prototype shortcut: **`S`** on keyboard forces screensaver for QA.

**Figma reference:** [screensaver `15881:37493`](https://www.figma.com/design/DfwtFG53ud7EHhvlPutvI8/SM-HTML-TV-MPR?node-id=15881-37493)

**Companion docs**

- TV coordinator: [`plan.md`](./plan.md)
- Full-screen players: [`Music-player-agent-handoff.md`](./Music-player-agent-handoff.md)
- User types / ads: [`docs/tv/visual-ads-and-user-types.md`](../visual-ads-and-user-types.md)
- Figma index: [`docs/tv/figma-nodes.md`](../figma-nodes.md)

---

## Product behavior (locked from brief)

| Topic | Choice |
|--------|--------|
| **Trigger** | **30 s** idle on full-screen player routes; **60 s** elsewhere (prototype) |
| **Scope** | **App-wide** — all TV routes; metadata from **`PlaybackContext`** session (fallback Stingray placeholder when idle) |
| **Visual** | Player UI **replaced** (hidden); playback session **continues** (audio stub unchanged) |
| **Frame content** | Media thumbnail, **two** metadata lines, **TV provider promo** footer (per Figma `adFooterBanner` slot — not tier-gated) |
| **Motion** | Frame stays at one position **10 s**, then **500 ms** crossfade to a **new** position (old fades out while new fades in) |
| **Safe placement** | Frame must **never clip** viewport edges; **`--tv-safe-area-inset: 48px`** on 1080p |
| **Backdrop** | **Solid black** full viewport behind the moving frame |
| **Wake** | **Any D-pad input** (arrows, Enter, Select) **or click** (browser QA) exits screensaver and restores full player |
| **QA shortcut** | **`S`** key on **any** screen forces screensaver (keyboard only; not in D-pad order) |

---

## Decisions locked (stakeholder review)

| # | Topic | Choice | Notes |
|---|--------|--------|-------|
| 1 | **Footer banner** | **TV provider promo** — **always shown** | **Not** gated by `showVisualAds` / subscription tier; distinct from in-feed visual ads |
| 2 | **Screensaver backdrop** | **Solid black** (`#000` or `--tv-screensaver-backdrop`) | Full viewport behind floating frame |
| 3 | **Idle while paused** | **Timer still runs** when player is visible and preroll is done | Burn-in protection applies to static UI whether or not audio plays |
| 4 | **Esc while screensaver** | **Dismiss screensaver first**; Esc does **not** `navigate(-1)` until player is visible again | Matches wake-remote UX |
| 5 | **Safe area inset** | **`--tv-safe-area-inset: 48px`** | Confirmed for 1080p prototype |
| 6 | **Preroll / upgrade overlay** | **No screensaver** while preroll dialog is open or before `prerollComplete` | Timer starts only when normal player chrome is showing |
| 7 | **Podcast labels** | Show name (line 1) above episode title (line 2) | Matches Figma hierarchy |
| 8 | **Mouse (browser QA)** | **Click** anywhere on screensaver wakes player | D-pad remains primary TV input |

---

## Figma layout (`15881:37493`)

The screensaver is **not** a second full player layout. It is a **floating frame** (~**1000 x 540 px** in Figma) containing:

```
+--------------------------------------------------+
|  [cover 360]   |  Channel Name (Roboto Black 34)   |
|   rounded      |  Song Title   (Roboto Semi 40)    |
+--------------------------------------------------+
|         TV provider promo (h 140, full frame width) |
+--------------------------------------------------+
```

| Element | Figma | Reuse in code |
|---------|-------|----------------|
| Frame max width | ~1000px | Align with **`--tv-player-column-max-width`** |
| Cover | 360px square, ~32px radius | **`--tv-player-cover-size`**, existing cover styles |
| Cover ↔ text gap | 30px | **`--tv-player-cover-tta-gap`** |
| Text line gap | 5px | **`--tv-player-tta-line-gap`** |
| Block gap (cover row → promo) | 40px | **`--tv-space-screen-gap`** |
| Promo footer height | 140px | New **`--tv-screensaver-promo-height`** |
| Promo content | Roboto Thin 40px placeholder in Figma | **`TvPlayerScreensaverPromo`** — provider promo stub (e.g. provider wordmark / "Promo" placeholder); **not** `VisualAdStrip` |

**Metadata mapping (prototype strings from each player):**

| Variant | Line 1 (channel / show) | Line 2 (title) | Thumbnail |
|---------|-------------------------|----------------|-----------|
| Music | `channel.name` | Session / stub song title | `channel.thumbnail` |
| Podcast | Show title (`subtitle` in session) | Episode title (`title`) | Episode / show art |
| Radio | Station name | Live line (`subtitle` / frequency) | Station thumbnail |

Podcast line order matches Figma hierarchy (smaller channel/show above larger title).

---

## Architecture

### Components and hooks (new)

| File | Role |
|------|------|
| `apps/tv/src/hooks/useTvPlayerScreensaver.js` | Idle timer, active flag, position index, transition phase, input listeners |
| `apps/tv/src/components/player/TvPlayerScreensaver.jsx` | Frame markup: cover, labels, provider promo footer |
| `apps/tv/src/components/player/TvPlayerScreensaverPromo.jsx` | Footer promo strip (always on; no tier gate) |
| `apps/tv/src/components/player/TvPlayerScreensaver.css` | Frame layout, crossfade layers, positioned wrapper |
| `apps/tv/src/constants/tvPlayerScreensaver.js` | `IDLE_MS`, `HOLD_MS`, `FADE_MS`, safe-area helpers |
| `apps/tv/src/utils/tvScreensaverPosition.js` | Pick next `(top, left)` inside safe rect; avoid immediate repeat |

### Integration pattern

**Do not** add a new route. Each player page keeps its existing tree; when screensaver is active:

1. **Hide** player column / upgrade CTA (`visibility: hidden` or conditional render) — keeps React state (playing, focus memory) alive.
2. **Mount** `TvPlayerScreensaver` as a **sibling overlay** (`position: fixed; inset: 0; z-index` above player, below preroll dialog if ever concurrent).
3. Pass **variant-specific** metadata props (or a normalized `screensaverModel` object from session + route data).

Optional later refactor: thin **`TvPlayerScreensaverHost`** wrapper used by all three pages to avoid duplicating hook + overlay wiring.

### Idle timer (`useTvPlayerScreensaver`)

```
enabled = prerollComplete && !showPreroll
on any qualifying input -> reset idle timer; if screensaver active -> dismiss
after IDLE_MS quiet -> set screensaverActive true
```

**Qualifying input (wake / reset):**

- `ArrowUp` `ArrowDown` `ArrowLeft` `ArrowRight`
- `Enter` ` ` `Select`
- **`click`** — wake / reset (browser QA)
- **`S`** — forces enter (does not block default if combined with dismiss logic)

**Non-qualifying (prototype):**

- Mouse move — ignore
- Tab — already suppressed globally

Attach listener at **`window` capture** (`true`) so it runs before player focus handlers and does not depend on focused element.

### Position + crossfade

**Safe rectangle** (CSS or JS):

```
safeLeft   = safeAreaInset
safeTop    = safeAreaInset
safeWidth  = 1920 - 2 * safeAreaInset
safeHeight = 1080 - 2 * safeAreaInset
```

**Frame size:** measure rendered frame (`getBoundingClientRect`) or fixed width 1000px + computed height (includes promo footer).

**Next position:** random integer `left` / `top` such that:

```
left + frameWidth  <= safeLeft + safeWidth
top  + frameHeight <= safeTop + safeHeight
```

Avoid picking the same coordinates twice in a row (store last position).

**Timeline per position:**

| Phase | Duration | UI |
|-------|----------|-----|
| Hold | 10 s | Single layer at position A, opacity 1 |
| Transition | 500 ms | Layer A at A fades 1→0; Layer B at B fades 0→1 (simultaneous) |
| Hold | 10 s | Layer B only (swap roles for next transition) |

Implementation: two absolutely positioned frame shells (`__layer--a` / `__layer--b`) with `opacity` transition `500ms`; toggle active layer after transition ends. Position each layer with `top` / `left` in px.

### Focus and player chrome

While screensaver active:

- Set **`contentKeysEnabled: false`** and **`suspendDomFocus: true`** on `useTvPlayerScreenFocus` (pass through from page state).
- No focusable items on screensaver surface (`aria-hidden="true"` on decorative overlay acceptable for prototype).
- On dismiss: restore previous focus via existing **`syncDomFocus`**.

### Esc precedence

In **`GlobalTvKeys`** or screensaver hook (prefer hook with early capture):

- If screensaver active on a full-player path → **`preventDefault`**, dismiss screensaver, **do not** `navigate(-1)`.
- Else → existing Esc behavior.

Document interaction with **`TvPlayerPrerollAd`** (modal): preroll blocks screensaver; Esc on preroll unchanged.

---

## Styling notes

- Add tokens to **`apps/tv/src/index.css`**:
  - `--tv-safe-area-inset: 48px`
  - `--tv-screensaver-backdrop: #000`
  - `--tv-screensaver-promo-height: 140px`
  - `--tv-screensaver-fade-duration: 500ms`
  - `--tv-screensaver-z-index` (above player UI, below modal dialogs)
- Overlay root: `background: var(--tv-screensaver-backdrop)`; `overflow: hidden`.
- Frame: optional subtle elevation (shadow) so it reads as floating on black backdrop.
- Promo footer: TV **provider promo** stub (gray block + placeholder label per Figma); may reuse **`TvProviderLogoPair`** styling from headers later — **no** `showVisualAds` check.

---

## Phased implementation

### Phase 0 — Docs and tokens

- [x] Add screensaver row to **`docs/tv/figma-nodes.md`** (node `15881:37493` + measurements table).
- [x] Add safe-area + screensaver tokens to **`index.css`**.
- [x] Note in **`docs/tv/visual-ads-and-user-types.md`**: screensaver footer is **provider promo**, not visual-ad tier placement.

### Phase 1 — Core hook + component

- [x] `tvPlayerScreensaver.js` constants.
- [x] `tvScreensaverPosition.js` — safe rect math + random placement.
- [x] `TvPlayerScreensaver.jsx` + CSS — static frame at one position (no motion yet).
- [x] Unit-test position helper only if trivial; otherwise manual QA table.

### Phase 2 — Motion + crossfade

- [x] Two-layer crossfade + 10 s hold loop in hook.
- [x] Verify frame never clips at corners (min/max position QA matrix).

### Phase 3 — Wire music player

- [x] `MusicPlayer.jsx` — hook, overlay, hide column when active, `S` shortcut.
- [x] Esc dismiss integration.
- [x] Focus suspend / resume.

### Phase 4 — Podcast + radio parity

- [x] `PodcastPlayer.jsx` — same host pattern; podcast metadata mapping.
- [x] `RadioPlayer.jsx` — same host pattern; radio metadata mapping.

### Phase 5 — QA + coordinator

- [x] QA checklist (below) — code review + build verified 2026-06-18.
- [x] Link plan from **`docs/tv/Plans/plan.md`** (done / next steps).
- [x] **`docs/tv/react-learning.md`** entry (idle overlay + dual-layer crossfade).

---

## QA checklist

| # | Steps | Expected | Status |
|---|--------|----------|--------|
| 1 | Open music full player; wait 30 s without input | Screensaver appears; audio/session unchanged | Pass — `TV_PLAYER_SCREENSAVER_IDLE_MS`; overlay only hides chrome |
| 2 | Press any arrow | Full player returns; focus sensible | Pass — wake keys call `dismiss` + `syncDomFocus` |
| 3 | Press **S** on music player | Screensaver immediately | Pass — `enterScreensaver` in capture `keydown` |
| 4 | Screensaver running; press **Esc** | Screensaver dismisses; still on play route | Pass — `tryDismissTvPlayerScreensaver` before `navigate(-1)` |
| 5 | Screensaver running; wait through 2+ position changes | Crossfade ~500 ms; frame fully inside safe margin | Pass — dual-layer loop; `isScreensaverPositionInSafeRect` bounds helper |
| 6 | Guest preroll showing | No screensaver until preroll completes | Pass — `screensaverEnabled = !showPreroll && prerollComplete` |
| 7 | **subscribed** user type | Promo footer still visible; same motion | Pass — `TvPlayerScreensaverPromo` has no tier gate |
| 8 | Podcast + radio play routes | Show name above episode title; correct thumbnail | Pass — per-route `screensaverModel` mapping |
| 9 | Click screensaver (browser) | Full player returns | Pass — window capture `click` when `isActive` |
| 10 | Dismiss screensaver | Idle timer resets; 30 s wait required again | Pass — `scheduleIdleTimer` on wake; `useEffect` on `isActive` false |
| 11 | Paused playback, wait 30 s | Screensaver still enters | Pass — idle not tied to `playing` state |

**Manual spot-check in browser:** run `npm run dev` in `apps/tv`, open `/music/:channelId/play`, press **S**, confirm black backdrop + moving frame + promo footer; wake with arrow or Esc.

---

## Acceptance (slice complete)

- [x] Screensaver on all three full player routes
- [x] 30 s idle, 10 s hold, 500 ms crossfade, 48 px safe area
- [x] Provider promo footer (not visual-ad tier)
- [x] D-pad / click / Esc wake; **S** QA shortcut
- [x] Docs: `figma-nodes.md`, `visual-ads-and-user-types.md`, `react-learning.md`, `plan.md`

---

## Files touched (summary)

| File | Change |
|------|--------|
| `hooks/useTvPlayerScreensaver.js` | **New** |
| `components/player/TvPlayerScreensaver.jsx` | **New** |
| `components/player/TvPlayerScreensaver.css` | **New** |
| `components/player/TvPlayerScreensaverPromo.jsx` | **New** |
| `components/player/TvPlayerScreensaverPromo.css` | **New** (optional — may live in screensaver CSS) |
| `constants/tvPlayerScreensaver.js` | **New** |
| `utils/tvScreensaverPosition.js` | **New** |
| `pages/MusicPlayer.jsx` | Wire screensaver |
| `pages/PodcastPlayer.jsx` | Wire screensaver |
| `pages/RadioPlayer.jsx` | Wire screensaver |
| `components/focus/GlobalTvKeys.jsx` | Esc dismiss when active (if not handled in hook) |
| `index.css` | Safe area + screensaver tokens |
| `docs/tv/figma-nodes.md` | Node entry |
| `docs/tv/Plans/plan.md` | Link + done checkbox when shipped |

**Out of scope (unless requested):**

- Real ad creatives or ad server
- Screensaver on non-player routes (Home, Browse)
- Settings UI to change idle duration (constant is enough for prototype)
- SMTV03 port (no prior art in that repo)

---

**Ready for implementation** — all stakeholder decisions locked (see table above).
