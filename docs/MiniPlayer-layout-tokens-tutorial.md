# Tutorial: Mini player layout tokens (`index.css` + runtime `--mini-player-offset`)

This document explains **how scrollable content clears the footer stack** — **mini player strip** + **bottom navigation** (+ optional **visual ad**) — **without hiding content behind fixed layers**. Central pieces live in **`src/index.css`**; **`--mini-player-offset`** is updated at runtime from **`PlaybackContext`**.

**Prerequisites:** [`PlaybackContext-tutorial.md`](PlaybackContext-tutorial.md), [`MiniPlayer-component-tutorial.md`](MiniPlayer-component-tutorial.md) (fixed **`bottom`** in **`MiniPlayer.css`**), [`visual-ads-and-user-types.md`](visual-ads-and-user-types.md).

---

## 1. The problem fixed-height bars create

Fixed elements (**`BottomNav`**, **`MiniPlayer`**) sit **outside** the normal layout flow—the **viewport** still shows scrolling content underneath if you don’t reserve **equal** space **at the bottom of the scrolling region**.

This repo uses **`padding-bottom`** on scroll containers (**`.app-shell`** or inner **`overflow-y: auto`** columns like **`.home-body-scroll`**) via **`var(--footer-stack-scroll-padding)`** (**`calc(...)`** of **CSS variables**) so:

- Designers can tune **`--mini-player-height`** **once**.
- **`PlaybackContext`** can flip **`--mini-player-offset`** **without** JSX passing inline styles into every **`main`**.

---

## 2. Token inventory ( `:root` in `index.css` )

| Token | Default | Role |
|-------|---------|------|
| **`--mini-player-height`** | **`80px`** | Matches Figma mini strip height (**`MiniPlayer`** **`min-height`**). |
| **`--mini-player-offset`** | **`0px`** on **`:root`**; **`<html>`** inline style overrides when the mini strip is visible (**§4**). |
| **`--footer-stack-scroll-padding`** | **`calc(...)`** | Single token for **`padding-bottom`** on **`main`** (default **`app-shell`**) **or** on inner **`overflow-y: auto`** scrollers — sum of **`--mini-player-offset`**, **`--bottom-nav-stack-height`**, **`env(safe-area-inset-bottom)`**. |
| **`--bottom-nav-stack-height`** | **`calc(...)`** | Total **height of the bottom chrome column** from the bottom of the viewport **up through** tab row + optional ad strip (see **§3**). |
| **`--bottom-nav-ad-height`** | **`0px`** by default | Becomes **`--visual-ad-strip-min-height`** when **`html[data-visual-ads]`** is set (**guest / provided**). |
| **`--visual-ad-strip-min-height`** | **`86px`** | Placeholder ad block under tabs. |
| **`--z-chrome`** | **`100`** | Shared layer for **primary** fixed chrome (**`BottomNav`** uses this). |
| **`--z-mini-player`** | **`110`** | Mini strip renders **above** **`--z-chrome`** while still **below** e.g. **`--z-player-preroll`**. |
| **`--chrome-backdrop-blur`** | **`6px`** | Blur strength for **`BottomNav`** and mini strip (`MiniPlayer`). |
| **`--miniplayer-bg`**, **`--miniplayer-text`**, **`--miniplayer-muted`** | Inverse “footer” look vs main app (**§6**). |

---

## 3. `--bottom-nav-stack-height` — one number for tab + indicator + ads

Defined as a **`calc`** sums:

```text
padding-top (tabs strip)
  + icon size
  + gap to label
  + label size
  + gap to indicator
  + indicator height
  + ad strip height (--bottom-nav-ad-height, often 0)
```

Because **`VisualAdsHtmlSync`** sets **`html[data-visual-ads]`**, **`index.css`** can bump **`--bottom-nav-ad-height`** without JavaScript recomputing the whole **`calc`** by hand (**[`visual-ads-and-user-types.md`](visual-ads-and-user-types.md)**).

**Why it matters:** **`MiniPlayer.css`** positions **`bottom: calc(var(--bottom-nav-stack-height) + env(safe-area-inset-bottom))`** — the strip’s **anchor** is measured from the viewport bottom past **tabs (+ ad)** + **safe area**.

---

## 4. `--mini-player-offset` — defaulted in `:root`, **set on `<html>` in JS**

**Default in stylesheet:** **`0px`** (**`:root`**, lines 111–113).

**Runtime** (**`PlaybackProvider`**, **`PlaybackContext.jsx`**):

```js
document.documentElement.style.setProperty(
  "--mini-player-offset",
  miniPlayerVisible ? "var(--mini-player-height)" : "0px",
);
```

When **`miniPlayerVisible`** becomes **`false`**, cleanup resets **`"--mini-player-offset"`** **`0px`** (see Playback tutorial **`useEffect`**).

**Cascade:** **`style` on **`element`** overrides **` :root`** for that property on descendants—so pages reading **`var(--mini-player-offset)`** get **live** **`0`** vs **`80px`** without recompiling **`index.css`**.

**Naming:** **`offset`** = “extra inset **above** **`--bottom-nav-stack-height`** for scroll padding” — not the **screen Y** position of the mini bar (that is **`bottom`** in **`MiniPlayer.css`**).

---

## 5. Bottom padding on scrollable shells — `--footer-stack-scroll-padding`

Defined once on **`:root`**:

```css
--footer-stack-scroll-padding: calc(
  var(--mini-player-offset) + var(--bottom-nav-stack-height) +
    env(safe-area-inset-bottom, 0px)
);
```

**Reading order (terms):**

1. **`--mini-player-offset`** — space for **fixed** mini strip when visible ( **`0`** or **`var(--mini-player-height)`** ).
2. **`--bottom-nav-stack-height`** — space for **fixed** tab bar (+ ad).
3. **`env(safe-area-inset-bottom)`** — home indicator / device safe area.

### 5.1 `.app-shell` (default stacked pages — scroll is the shell)

```css
padding: var(--safe-area-inset-top) 0 var(--footer-stack-scroll-padding);
```

**Net effect:** When **`main`** is the scroll container (routes that **do not** use **`.app-shell--footer-fixed`**), the last line of content can scroll up until it clears the mini bar and the tab stack.

### 5.2 Full-viewport **`main`** + inner scroller (**`.app-shell--home`**, **`.app-shell--footer-fixed`**)

**Home** (**`.app-shell--home`**) and **Music Channel Info**, **Subscription**, **Swimlane “More”**, **Search**, **Info**, etc. set **`padding-top: 0`** and **`padding-bottom: 0`** on **`main`**, put **`overflow-y: auto`** on a **flex child**, and **`padding-bottom: var(--footer-stack-scroll-padding)`** on that same child so content **fills the viewport** and **scrolls behind** fixed **`BottomNav`** / **`MiniPlayer`**.

Those inner scrollers (**`.home-body-scroll`**, **`.music-info__scroll`**, **`.subscription-screen__scroll`**, **`.swimlane-more__scroll`**, **`.app-shell-footer-scroll`**, …) share:

```css
padding-bottom: var(--footer-stack-scroll-padding);
```

**Tab stubs without a stacked screen header** use **`.app-shell-footer-scroll`** with **`padding-top: var(--safe-area-inset-top)`** only — no duplicate bottom **`calc`** in component CSS.

**Rule:** Prefer **`var(--footer-stack-scroll-padding)`** on whichever element is **`overflow-y: auto`** — never subtract the footer twice (avoid bottom padding on both **`main`** and the inner scroller unless one is **`0`**).

---

## 6. Inverse mini chrome — `--miniplayer-*` vs global theme

Light app default (**`:root`**, lines 136–139): mini bar reads **dark-tinted** background + light text (**contrast on** light **page** scroll).

**System dark** (**`@media (prefers-color-scheme: dark)`** on **`:root:not([data-theme])`**, lines 163–166) and **`html[data-theme="dark"]`** flip **`--miniplayer-*`** to a **light** strip on **dark** app chrome.

**`html[data-theme="light"]`** reasserts the **dark** mini bar (lines 189–191).

**Principle** (from product docs): **inverse** so the footer strip stays legible on whatever scrolls underneath.

---

## 7. Stacking (`z-index`) — mini vs tabs vs pre-roll

Numerical order (higher draws on top when contexts overlap):

- **`--z-chrome`** (**`100`**) — **`BottomNav`**, Home header chrome.
- **`--z-mini-player`** (**`110`**) — **`MiniPlayer`** when stacking contexts overlap.
- **`--z-player-preroll`** (**`250`**) — guest pre-roll overlays.

Physically **`MiniPlayer`** is positioned **`bottom`** **above** **`BottomNav`**, so overlap is small; **`z-index`** covers stacking-context edge cases.

---

## 8. Visual stack (bottom → up)

```text
[ viewport bottom + env(safe-area-inset-bottom) inside BottomNav padding ]
[ tab row · optional VisualAdStrip ]
[ MiniPlayer strip (fixed, anchored above ↑ ) ]
[ scrolling page content ]
```

**`MiniPlayer`** **`bottom`** in **`MiniPlayer.css`** equals **`calc(var(--bottom-nav-stack-height) + env(safe-area-inset-bottom))`** — the **bottom edge** of the mini bar lines up with the **top** of the bottom chrome block (tabs + optional ad + safe-area padding inside **`BottomNav`**), so the strip sits **above** the tab row as in Figma.

---

## 9. Special case: full-screen music player

**`MusicPlayer.css`** overrides **`.music-player-screen.app-shell`** padding to **`0 0 env(safe-area-bottom)`** only — **no** mini offset, **no** tab stack reserved there, because **`App.jsx`** **unmounts** **`MiniPlayer`**/**`BottomNav`** on **`/music/.../play`** and playback UI is full height.

**`--mini-player-offset`** on **`html`** is still **`0`** on that route via **`PlaybackContext`** — consistent if any page still read the variable.

---

## 10. Mental model checklist

1. **`--bottom-nav-stack-height`** — vertical space for the **tab row + optional ad + safe-area padding** inside **`BottomNav`** ( **`MiniPlayer`** anchors **above** this block).
2. **`--mini-player-offset`** = extra scroll **padding** equal to **`--mini-player-height`** when the mini strip is visible.
3. **`PlaybackContext`** sets **`--mini-player-offset`** on **`<html>`** — **`index.css`** consumes it in **`calc(...)`** for padding.
4. **`html[data-visual-ads]`** increases **`--bottom-nav-stack-height`** — **`MiniPlayer`** **`bottom`** **and** scroll **`calc(...)`** both pick it up.
5. **Full-footer screens** (**`.app-shell--home`**, **`.app-shell--footer-fixed`**) put **`padding-bottom: var(--footer-stack-scroll-padding)`** on the **inner** **`overflow-y: auto`** column, **`not`** on **`main`** ( **`main`** has **`padding-bottom: 0`** so the viewport is edge-to-edge and content scrolls under the stacks).

---

## 11. Suggested exercises

1. In DevTools → **Elements** → **`<html>`** → **Styles**, watch **`--mini-player-offset`** flip when you show/hide the mini bar (music flow + minimize).
2. Toggle **`data-visual-ads`** on **`<html>`** (or switch user type) and confirm **`--bottom-nav-stack-height`** changes in **Computed** — **`MiniPlayer`** should move up with the taller footer.
3. Temporarily set **`--mini-player-height`** to **`120px`** in **`index.css`** — scroll gap and mini strip **min-height** should track if wiring is correct.
4. Inspect **Computed** **`--footer-stack-scroll-padding`** on **Home** vs **Music Channel Info** — it should track **`--mini-player-offset`** and **`--bottom-nav-stack-height`** identically wherever the footer shows.

---

## 12. Related tutorials

| Doc |
|-----|
| [`PlaybackContext-tutorial.md`](PlaybackContext-tutorial.md) |
| [`MiniPlayer-component-tutorial.md`](MiniPlayer-component-tutorial.md) |
| [`App-miniplayer-wiring-tutorial.md`](App-miniplayer-wiring-tutorial.md) |
| [`design-tokens.md`](design-tokens.md) — designer ↔ **`index.css`** workflow |

**Next in plan (Phase 3):** [`MusicPlayer-playback-sync-tutorial.md`](MiniPlayer-learning-plan.md) — **`MusicPlayer.jsx`** + **`upsertMusicSession`**.

---

*Last updated: 2026-04-28*
