# Full-screen player layout refactor — implementation plan

Living notes for aligning **music**, **radio**, and **podcast** fullscreen routes behind one layout model. **Design intent** comes from product conversation (Feb 2026); **code today** spans **`MusicPlayer.jsx`** + **`MusicPlayer.css`**, **`RadioPlayer.jsx`** + **`RadioPlayer.css`**, **`PodcastPlayer.jsx`** + **`PodcastPlayer.css`**, **`VisualAdStrip`**, **`PlayerHeaderCenterSlot`**, **`PlayerProvidedBrandRow`**.

---

## Constraints (locked)

1. **Top anchor:** The **first row is always the header**. Its **top edge** stays aligned to the **top of the viewport** (plus header/top safe-area padding). Nothing below may shift the header vertically.

2. **Bottom anchor:** Some **bottom-most chrome** keeps its **bottom edge** on the **bottom of the viewport** (plus bottom safe-area padding). Depending on **`userType`** / tier, that chrome is effectively:
   - **Player controls** only (**subscribed**: no provider row, no ad strip), or  
   - **Controls + provider row** with **fixed player ad strip** still glued to physical bottom (**`freeProvided`** + ads), or  
   - **Controls** with **fixed player ad strip** as the viewport-bottom chrome (**guest** / **`freeStingray`**).

   Implementation detail: **`VisualAdStrip--player`** stays **`position: fixed`** at the shell bottom when ads are on; **in-flow** content reserves **`--visual-ad-player-reserve-height`** so nothing hides under it. When ads are off, the **last in-flow footer block** (controls, or controls + provider) must sit above **`env(safe-area-inset-bottom)`** without clipping.

3. **Middle:** Rows **between** header and footer should consume remaining height according to agreed spacing (pairs with tight internal gaps; **flexible gaps between logical row groups** — see earlier UX notes).

4. **Short viewports:** The **square thumbnail** (**1:1**) **shrinks** as needed so the layout **does not require vertical scrolling** for the default fullscreen chrome stack (within realistic phone heights). Prefer **computing max thumb size** from measured header/footer/toolbars rather than guessing fixed **`300px`**.

---

## Why refactor

- **Music / radio** subscribed layout already showed **controls drifting / clipping** due to **`music-player__body--no-player-ad .music-player__controls { flex: 1 1 0 }`** interacting with **`music-player__bottom-player-stack`** and optional rows — **podcast** avoids part of this via **`podcast-player__body--no-ad`** overrides.

- Duplicated structure across three pages makes parity (**Upgrade**, provider row, ad reserve, safe areas) fragile.

---

## Target layout model (conceptual)

Use one **fullscreen shell** (component + CSS module or shared BEM prefix) that renders:

| Slot | Role |
|------|------|
| **Header** | Fixed-height chrome row (existing **`music-player__header`** pattern); never grows/shrinks from children below. |
| **Scroll-free column** | Flex/grid column **`flex: 1; min-height: 0`** filling space **between** header and reserved bottom. |
| **Middle bands** | Title + actions pair; thumbnail + labels pair; optional spacer distributing **`gap`** between **groups** (not inside pairs). |
| **Footer stack** | Progress + controls (variant-specific markup); optional **`PlayerProvidedBrandRow`**; **`flex-shrink: 0`**. |
| **Fixed ad** | **`VisualAdStrip variant="player"`** when **`showVisualAds`**, unchanged positioning contract. |

**Remove** patterns that vertically stretch **`.music-player__controls`** (`flex: 1 1 0`) in the subscribed path — footer blocks stay **intrinsic height**; extra vertical space goes into **explicit spacer regions** between middle groups or a single **`flex-grow`** region **between thumbnail block and footer**, not inside transport.

---

## Thumbnail sizing (short viewport)

**Goal:** Max square side length **`S`** such that header + middle pairs + thumbnail (**`S`**) + footer (+ optional provider + reserved ad height) **`<=`** viewport height.

**Approach (prototype-friendly):**

1. **`ResizeObserver`** on the shell **`main`** (or window **`resize`** + **`visualViewport`** if needed).

2. **Measure** fixed heights: header (existing **`min-height`** / measured **`offsetHeight`**), footer stack (controls + optional provider), ad reserve (**`showVisualAds`** ? **`--visual-ad-player-reserve-height`** : safe-area bottom only).

3. **Measure** intrinsic heights of title row + actions row + label stack **without** thumb (or with thumb **`display:none`** measure pass — simpler: clamp **`S`** from **`min(300, available)`** iterating down until **`scrollHeight <= clientHeight`** or closed-form **`availableHeight - fixedBands`**).

4. Set thumbnail wrapper **`width` / `height`** (or **`max-width`** / **`max-height`**) to **`min(S, min(300px, 100%))`** — keep **`aspect-ratio: 1/1`**.

5. **Podcast:** Same shell drives hero thumb; podcast-specific scrub/transport stays in footer variant slot only.

**Fallback:** If copy overflows despite **`S`** floor (**e.g.** extreme dynamic type), allow **single middle band scroll** — document as Phase 2 escape hatch if Phase 1 proves too tight.

---

## Implementation phases

### Phase 1 — Shell extract ✅ (prototype)

**Shipped:** **`src/components/FullScreenPlayerShell.jsx`** (+ **`FullScreenPlayerShell.css`** placeholder for future shell tokens). **`MusicPlayer.jsx`**, **`RadioPlayer.jsx`**, and **`PodcastPlayer.jsx`** render **`header`** / **`hero`** / **`footer`** slots through the shell; **`showProviderBrand`** / **`showPlayerAd`** centralize **`PlayerProvidedBrandRow`** and **`VisualAdStrip variant="player"`**. **`podcastLayout`** preserves **`podcast-player__body`** + **`podcast-player__scroll`** + **`podcast-player__footer-stack`**. **`PlayerPrerollAd`** stays the first child of **`<main>`** on each route (outside the shell fragment).

### Phase 2 — Music + radio layout fixes ✅

- Removed **`music-player__body--no-player-ad .music-player__controls { flex: 1 1 0 }`** (**`MusicPlayer.css`**). **`music-player__top`** keeps **`flex: 1 1 0`** so spare height sits above the footer stack; controls no longer stretch inside **`music-player__bottom-player-stack`** (fixes subscribed bleed). Applies to **`RadioPlayer`** as well (shared stylesheet).

### Phase 3 — Podcast parity cleanup ✅

- **`PodcastPlayer.css`:** **`podcast-player__body--with-ad`** uses **`justify-content: space-between`** (parity with default **`music-player__body`** when the fixed player ad strip shows). **`--no-ad`** uses **`flex-start`** plus **`podcast-player__scroll`** **`flex: 1 1 0`** + **`overflow-y: auto`** so spare height sits above the footer like **`music-player__top`** under **`--no-player-ad`**. **`overflow: hidden`** on **`podcast-player__body`** retained so the shell clips as before; speed menu stays **`position: fixed`** (unchanged).

### Phase 4 — Thumbnail clamp integration ✅

- **`src/hooks/useFullscreenPlayerThumbSidePx.js`:** **`ResizeObserver`** + **`visualViewport`** / window **`resize`** measure **`main`**, hero body ( **`music-player__body`** / **`podcast-player__body`** ), footer stack, cover row overhead; clamps square side **`S`** between **`160px`** and **`300px`**. Second argument **`enabled`**: when **`false`** (no resolved station/channel/episode yet), returns **`300`** so **`Navigate`** shells do not depend on layout.

- **`MusicPlayer.jsx`**, **`RadioPlayer.jsx`**, **`PodcastPlayer.jsx`:** **`useRef`** on **`<main>`**, **`style={{ "--player-thumb-side": `${thumbSidePx}px` }}`**, hero **`<img width={thumbSidePx} height={thumbSidePx}>`**. **`MusicPlayer.css`**: **`.music-player__cover`** **`width: min(var(--player-thumb-side, 300px), 100%)`** (fallback **`300px`** on **`.music-player-screen`**).

### Phase 5 — Docs + cleanup ✅

- **`docs/react-learning.md`** — **`FullScreenPlayerShell`** + Phase 2–4 layout/thumb notes live under **Full-screen player shell** (Phase 4 entry covers **`useFullscreenPlayerThumbSidePx`** / **`--player-thumb-side`**).

- **`docs/Plans/plan.md`** — **What we have done** lists refactor **Phases 1–5**; backlog Phase 5 item closed.

- **`docs/visual-ads-and-user-types.md`** — **Fullscreen players** subsection: **`FullScreenPlayerShell`**, fixed **`VisualAdStrip--player`**, **`--visual-ad-player-reserve-height`** via **`:has(.visual-ad-strip--player)`** on **`.music-player__body`** / **`.podcast-player__body`** (**`MusicPlayer.css`**).

---

## Acceptance checklist

Prototype targets below; confirm on change with **`Subscription`** preview (**guest** / **`freeStingray`** / **`freeProvided`** / **`subscribed`**) + a short viewport height for thumb clamp.

- [x] Subscribed **music** / **radio**: header pinned top; controls fully visible above safe area; **no** vertical scroll at common viewport (**390×844** style).

- [x] Guest / **`freeStingray`**: fixed ad reserve respected; controls not underlap strip.

- [x] **`freeProvided`**: Upgrade header; provider row visible between controls and ad reserve; thumb scales down on short height without scroll.

- [x] **Podcast**: parity with music/radio anchoring; speed menu still usable.

- [x] **`npm run build`** + quick manual tier sweep from **`Subscription`** preview.

---

## Open questions (minimal)

Resolved enough to start Phase 1–2:

- **Bottom anchor wording:** When ads are on, **viewport bottom** is the **fixed ad strip**; in-flow footer sits **above** reserved height. When ads are off, **bottom anchor** is the **footer stack** bottom edge — consistent with constraints above.

Still optional to confirm with design:

- Minimum thumbnail **`S`** floor (**e.g.** **`160px`**) before allowing overflow or scroll.

- Whether **flex gaps between row groups** should be equal (**`gap`** on a vertical grid) vs weighted (more air under thumb).

---

## Related files

- **`src/pages/MusicPlayer.jsx`**, **`MusicPlayer.css`**
- **`src/pages/RadioPlayer.jsx`**, **`RadioPlayer.css`**
- **`src/pages/PodcastPlayer.jsx`**, **`PodcastPlayer.css`**
- **`src/components/VisualAdStrip.jsx`**, **`VisualAdStrip.css`**
- **`src/components/PlayerHeaderCenterSlot.jsx`**, **`PlayerProvidedBrandRow.jsx`**
- **`src/utils/showVisualAds.js`**
