# Tutorial: Understanding `MiniPlayer.jsx` (+ `MiniPlayer.css`)

This document walks through [`src/components/MiniPlayer.jsx`](../../src/components/MiniPlayer.jsx) and [`MiniPlayer.css`](../../src/components/MiniPlayer.css)—the visual **MiniPlayer** strip: layout, variants, **`usePlayback`**, and **`useNavigate`**.

**Prerequisite:** [`PlaybackContext-tutorial.md`](PlaybackContext-tutorial.md) (what **`session`** and **`miniPlayerVisible`** mean) and [`App-miniplayer-wiring-tutorial.md`](App-miniplayer-wiring-tutorial.md) (where **`MiniPlayer`** mounts).

**Companion:** Tokens on **`<body>`/`html`** and **`.app-shell`** padding appear in **`MiniPlayer-layout-tokens-tutorial.md`** (planned)—this file mentions them only where **`MiniPlayer.css`** consumes them (`--z-mini-player`, `--miniplayer-*`, `--bottom-nav-stack-height`, …).

---

## 1. What these files do

**`MiniPlayer.jsx`** renders the fixed **mini player chrome** above the tab bar when **`miniPlayerVisible`** from context is **`true`**. It supports three **variants** mirrored to Figma node **`19777:32024`** (**`music`**, **`podcasts`**, **`radio`**) via **`session.variant`** and **`data-variant`**.

It does **not** own playback “truth” (**`PlaybackContext.jsx`** does). It reads **`session`**, fires **`togglePlayPause`**, and optionally **`navigate(fullPlayerPath)`** to reopen the **full-screen** music route.

**`MiniPlayer.css`** positions the strip (fixed **`bottom`** above **`BottomNav`** stack), inverse colors, typography, masks for transport icons from **`public/`**, podcast two-line clamp, tap/focus resets.

---

## 2. Imports (lines 1–3)

```js
import { useNavigate } from "react-router-dom";
import { usePlayback } from "../context/PlaybackContext";
import "./MiniPlayer.css";
```

| Import | Purpose |
|--------|---------|
| **`useNavigate`** | Programmatic **`navigate(fullPlayerPath)`**—same API as **`Link`**, but imperative (called from **`openFullPlayer`**). |
| **`usePlayback`** | Custom hook — see **[`PlaybackContext-tutorial.md`](PlaybackContext-tutorial.md)**. |
| **`"./MiniPlayer.css"`** | Side-effect import; no default export—global class names prefixed **`mini-player`**. |

This component does **not** use **`useState`** — all playback state lives in **`PlaybackContext`**.

---

## 3. Small presentational pieces: masks + SVG (lines 5–63)

These are **plain function components** (no hooks). They keep **`MiniPlayer`** readable.

### `PlayPauseIcon` (lines 5–14)

Uses **`paused`** (**boolean**) to choose mask modifier classes:

- **`mini-player__mask-icon--pause`** → **`/pause.svg`**
- **`mini-player__mask-icon--play`** → **`/play.svg`**

Same **mask + `background-color: currentColor`** pattern as **`BottomNav`** / **`MiniPlayer.css`**—icons inherit **`var(--miniplayer-text)`**.

### `SkipIcon`

Single mask for **`skip.svg`**.

### `SeekReplay15Icon` / `SeekFwd30Icon`

**Mask icons** — **`/replay15.svg`**, **`/fwd30.svg`** in **`public/`** (same **`mask-image`** + **`currentColor`** pattern as play/pause). Used only for the **podcasts** variant seek buttons.

---

## 4. Router hook + context (`MiniPlayer`) — lines 67–73

```js
export default function MiniPlayer() {
  const navigate = useNavigate();
  const { session, miniPlayerVisible, togglePlayPause } = usePlayback();

  if (!miniPlayerVisible) {
    return null;
  }
```

### `useNavigate`

Returns **`navigate`**. **`BrowserRouter`** in **`main.jsx`** must wrap **`App.jsx`** (**[`App-miniplayer-wiring-tutorial.md`](App-miniplayer-wiring-tutorial.md)**)—otherwise **`useNavigate`** throws.

### Destructuring from **`usePlayback()`**

Three fields used here (others stay in context for **`MusicPlayer`**, **`Info`**, …):

| Field | Role in this component |
|-------|---------------------------|
| **`session`** | **`variant`**, **`title`**, **`subtitle`**, **`thumbnail`**, **`isPaused`**, **`fullPlayerPath`**. |
| **`miniPlayerVisible`** | Convenience flag (also **`session.active`** **&&** URL check in provider)—if **`false`**, **`return null`** (**early exit**) so React renders nothing for this subtree. |

**Why **`return null`?** Alternate design: **`App.jsx`** alone could gate mounting; we still **`return null`** when context says invisible so **`MiniPlayer`** behaves even if **`App.jsx`** mistakenly mounted it (**defensive**).

### Early return before **`session`** destructure?

After **`miniPlayerVisible`**, **`session`** remains valid—we only skip render when **`false`**. **`session`** is still the last-written object from **`PlaybackProvider`** (**could** be inactive theoretically; **`miniPlayerVisible`** implies **`active`** branch in provider).

---

## 5. Derived values — lines 75–79

```js
const { variant, title, subtitle, thumbnail, isPaused, fullPlayerPath } = session;

const openFullPlayer = () => {
  if (fullPlayerPath) navigate(fullPlayerPath);
};
```

**Destructuring** pulls fields used in JSX.

**`openFullPlayer`** — **`if (fullPlayerPath)`**:

- Music: **`/music/:channelId/play`** (**`upsertMusicSession`** sets **`fullPlayerPath`**).
- Podcast/radio stubs: **`fullPlayerPath === null`**—tap does **nothing** (product will add routes later).

Not **`async`**; **`navigate`** is synchronous-ish for user interaction.

---

## 6. Root **`<aside>`** — lines 81–85

```jsx
<aside
  className="mini-player"
  aria-label="Now playing"
  data-variant={variant}
>
```

- **`<aside>`** — often exposed as a **complementary** landmark; **`aria-label="Now playing"`** names it for assistive tech.
- **`data-variant={variant}`** — CSS selectors like **`.mini-player[data-variant="podcasts"] .mini-player__subtitle`** (fontsize tweak) **and** easier debugging (Inspect element → see **`music`** / **`podcasts`** / **`radio`**).

---

## 7. Main tap target (**`mini-player__main`)** — lines 87–127

```jsx
<button
  type="button"
  className={[ "mini-player__main", fullPlayerPath ? "" : "mini-player__main--no-fullscreen" ].filter(Boolean).join(" ")}
  onClick={openFullPlayer}
  aria-label={...}
>
```

### **`type="button"`**

Avoids **`submit`** if this component ever nests inside **`<form>`**.

### Conditional class **`mini-player__main--no-fullscreen`**

Adds **`cursor: default`** (**`MiniPlayer.css`**) when there is nowhere to **`navigate`**—podcast/radio previews.

### **`aria-label`**

Depends on **`fullPlayerPath`** so screen readers distinguish “open player” vs “preview strip only.”

### Thumbnail **`img`** vs placeholder

When **`thumbnail`** is non-empty (typical **music** session), render **`<img>`** with **`loading="lazy"`**; podcast/radio demos use **`""`** → **`div.mini-player__thumb--placeholder`** (muted tint).

**`alt=""`** — decorative here; visible **title** / **subtitle** carry the meaning for this prototype.

### Title / subtitle lines

Podcast **`title`** gets **`mini-player__title--podcast`** for **`-webkit-line-clamp: 2`** (**Figma** long episodes). **`[...].filter(Boolean).join(...)`** drops empty modifier class segments.

Subtitle always **`.mini-player__subtitle`** (**muted** color **CSS**).

---

## 8. Controls cluster — lines 129–137

```jsx
<div
  className={variant === "podcasts"
    ? "mini-player__controls mini-player__controls--podcast"
    : "mini-player__controls"}
  role="group"
  aria-label="Playback"
>
```

**`role="group"`** + **`aria-label="Playback"`** groups transport buttons (**not** wrapping in **`<fieldset>` / `<legend>`**—acceptable for prototypes; tighten for production a11y if needed).

**`mini-player__controls--podcast`** narrows **`gap`** (Figma **4px**) vs **`10px`** for music/radio—see **`MiniPlayer.css`**.

Three conditional **`{variant === … ? (…) : null}`** blocks—exactly **one** control row for **`music`**, **`podcasts`**, or **`radio`**.

| Variant | Buttons | Notes |
|---------|---------|--------|
| **`music`** | Play/pause (lg) + Skip (sm) | Skip has **`stopPropagation`**; no skip-behaviour wired yet (**prototype**). See [§11](#11-stoppropagation-and-sibling-dom). |
| **`podcasts`** | −15 · play/pause · +30 | Seek icons SVG. |
| **`radio`** | Play/pause only | Single large control per Figma. |

Each **`null`** branch returns **nothing** when variant mismatches (**explicit** mutually exclusive **`variant`** strings).

---

## 9. Control buttons and **`togglePlayPause`**

Playback buttons **`onClick`** call **`togglePlayPause()`** (context) except skip/seek stubs.

**Important:** **`PlayPauseIcon paused={isPaused}`** — when **`isPaused`** is **true**, the **paused** mask shows → user sees **play** (**resume**); when **`false`**, **pause**. Prop name **`paused`** lines up with **`isPaused`**.

---

## 10. `MiniPlayer.css` overview

Grouped by responsibility (line ranges approximate):

| Topic | Highlights |
|-------|-------------|
| **`.mini-player`** (shell) | **`position: fixed`**; **`bottom: calc(var(--bottom-nav-stack-height) + env(safe-area-inset-bottom))`** so the strip sits **above** the **`BottomNav`** stack (same **`--bottom-nav-stack-height`** token **`.app-shell`** uses as its baseline chrome height). **`left: 50%; transform: translateX(-50%); max-width: var(--app-max-width)`** — centers within the mobile frame (see **`App-miniplayer-wiring-tutorial.md`**). |
| **Inverse chrome** | **`--miniplayer-text`**, **`--miniplayer-bg`**, **`--miniplayer-muted`** from **`index.css`** (swap in dark theme). **`backdrop-filter`** uses **`chrome-backdrop-blur`**. **`border-radius`** on top corners only (**`var(--space-5)`** ≈ Figma **20px**). |
| **Stacking** | **`--z-mini-player`** above **`--z-chrome`** (**`BottomNav`**). |
| **Main column** | **`mini-player__main`**, **`__thumb`**, **`__text`**: flex, **`min-width: 0`** on text (**ellipsis** / **line-clamp**). Art **60×60**, **`radius-sm`**. |
| **Titles** | Non-podcast: **nowrap** + ellipsis; **`mini-player__title--podcast`**: **`line-clamp: 2`**, **`1rem`**. **`[data-variant="podcasts"]`** subtitle fontsize tweak. |
| **Transport** | **`mini-player__ctrl--lg`** **60×60**, **`--sm`** **40×40**. |
| **Mask icons** | **`pause.svg`**, **`play.svg`** (full-screen **`MusicPlayer`**: **`playerCtrlPause.svg`**, **`playerCtrlPlay.svg`**). **Podcast seeks:** **`replay15.svg`**, **`fwd30.svg`**. **Music skip:** **`skip.svg`**. Same **`mask-image`** technique as **`BottomNav`**; see [`react-learning.md`](../react-learning.md). |

Full token flow **padding underneath scroll content** (**`var(--mini-player-offset)`**) is set in **`PlaybackContext`**—not in this stylesheet—planned doc **layout tokens**.

---

## 11. **`stopPropagation` and sibling DOM**

The controls **`div`** and **`button.mini-player__main`** are **siblings** inside **`aside`**. Control clicks **do not bubble through** **`main`** (different subtree)—so **`stopPropagation`** is **not strictly required** for current wiring.

Keeping **`e.stopPropagation()`** guards against future refactors (e.g. wrapping both in **`onClick`** on **`aside`** or nesting controls)—harmless **`no-op`** on synthetic events otherwise.

---

## 12. Mental model checklist

1. **State flows down** from **`PlaybackContext`** — **`MiniPlayer`** is largely **presentation + navigation**.
2. **`miniPlayerVisible` false** → **`return null`** — nothing mounts (defensive if **`App.jsx`** gates mount too).
3. **`variant`** drives **which JSX block renders** (**three mutually exclusive branches**).
4. **`fullPlayerPath`** falsy → no **`navigate()`** call — tap does nothing productive; **`mini-player__main--no-fullscreen`** indicates preview-only (**cursor**) for podcast/radio demos.
5. **CSS** handles **inverse** theme + stacking above tabs; **`--mini-player-offset`** on **`html`** adjusts scroll gutters (**PlaybackContext**)—see upcoming layout-token tutorial.
6. **`data-variant`** + modifiers match **[`Miniplayer-component-story.md`](../Stories/Miniplayer-component-story.md)** control sets (**music**: play + skip; **podcasts**: ±15/+30 + play; **radio**: play only).

---

## 13. Suggested exercises

1. **Variant inspection:** With Info **Podcast bar** demo, Inspect **`data-variant`** and **`mini-player__title--podcast`** in DevTools.
2. **`navigate`** trace: **`console.log(fullPlayerPath)`** before **`navigate`**; open music MiniPlayer, tap **`main`**; confirm **`/music/.../play`**.
3. Remove **`e.stopPropagation()`** from one playback button handler — tapping should behave the same (siblings). Optionally add a temporary **`onClick`** on **`aside`** to see when **`stopPropagation`** would matter (**advanced**).
4. **CSS:** Temporarily set **`mini-player`** **`bottom`** to **`env(safe-area-inset-bottom)`** only (wrong)—you should see overlap with **`BottomNav`**. Revert and re-read **`--bottom-nav-stack-height`** + **`MiniPlayer.css`** **`bottom`** rule.

---

## 14. Related tutorials

| Doc |
|-----|
| [`PlaybackContext-tutorial.md`](PlaybackContext-tutorial.md) |
| [`App-miniplayer-wiring-tutorial.md`](App-miniplayer-wiring-tutorial.md) |
| [`MiniPlayer-layout-tokens-tutorial.md`](MiniPlayer-layout-tokens-tutorial.md) — **`index.css`** scroll padding + **`--mini-player-offset`** |

---

*Figma Miniplayer:* [`figma-nodes.md`](../figma-nodes.md) (**`19777:32024`**).
