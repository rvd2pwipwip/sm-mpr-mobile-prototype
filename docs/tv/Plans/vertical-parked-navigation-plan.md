# Vertical parked focus navigation — implementation plan

> **Canonical spec and integration guide:** [`../vertical-parked-navigation.md`](../vertical-parked-navigation.md)  
> This file tracks phases, QA, and progress log.

Living plan for **TV vertical scroll** with **parked focus ring** behavior (same mental model as **Channel Info tag row** / `VariableSwimlane` horizontal parking, transposed to Y).

**Scope:** Reusable hook for any screen with a vertical scrollport + focus groups. **First consumers:** `BroadHome`, `LimitedHome`. **Search browse** wiring in progress — see spec doc.

**References:**

- Horizontal parking: `apps/tv/src/components/swimlanes/VariableSwimlane.jsx` (`calcOffsetForIndex`)
- Current row-fit scroll (to replace): `apps/tv/src/hooks/useTvVerticalGroupScroll.js`
- Tokens: `apps/tv/src/index.css` (`--tv-scroll-park-down-bias`, `--tv-scroll-ad-reserve`, focus ring tokens)
- Learning (update after ship): `docs/tv/react-learning.md`

---

## Locked decisions

| Topic | Decision |
|-------|----------|
| **Hook reuse** | One hook contract for all future vertical screens (not Home-only internals). |
| **`parkY` lifetime** | Set once on first successful measure after landing focus; **fixed for the whole visit** to that screen (route). Not reset on Up/Down. Reset on unmount / new route. |
| **Last focusable group** | **Skip non-focus ad rows** when computing `lastFocusableGroupIndex` (in-feed banner is not a focus group). |
| **Footer ad** | May return; use `--tv-scroll-ad-reserve` on scroll inner (`padding-bottom`) so bottom-end math includes scroll buffer. |
| **Top end** | `offsetY === 0`; no extra top breathing room (layouts are top-anchored). |
| **Bottom end** | Smallest offset where layout bottom + `--tv-scroll-park-down-bias` is visible; then **unpark** ring on last focusable group. |

---

## Desired behavior (summary)

1. On load, record **`parkY`** = viewport Y of the **focus ring top** for the initial focused control.
2. **Middle of list (Down):** focus ring top stays at **`parkY`**; content scrolls (`translateY`) so each newly focused control's ring top aligns to **`parkY`**.
3. **Bottom:** when bottom + down bias (+ ad reserve in layout) is fully visible, stop scrolling; ring moves **down** with focus on the last focusable group.
4. **Up from bottom:** ring moves up until it reaches **`parkY`**, then parked scroll until top is visible (`offsetY === 0`), then ring moves **up** to topmost focusable.

---

## Hook contract (target)

```js
useTvVerticalParkedScroll(focusedGroupIndex, {
  landingGroupIndex,
  lastFocusableGroupIndex,
  getFocusedElement, // () => HTMLElement | null
})
```

**Returns:** `{ viewportRef, innerRef, registerGroupRef, offsetY, innerClassName }` (same surface as today; rename optional after migration).

**`registerGroupRef`:** still used for resize observation and group bounds; **offset math uses `getFocusedElement()`**, not group box fit.

---

## Geometry (Phase A — done)

Pure + DOM helpers in **`apps/tv/src/utils/tvFocusGeometry.js`**:

| Function | Role |
|----------|------|
| `calcFocusRingTopFromRect` | Ring top from layout rect + inset |
| `calcFocusRingTopInContent` | Scrollport ring top + current `offsetY` |
| `calcParkedScrollOffsetY` | `ringTopContent - parkY` |
| `calcMaxScrollOffsetY` | `innerHeight - viewportHeight` |
| `calcMinScrollOffsetForBottomEnd` | Bottom + down bias visible |
| `clampScrollOffsetY` | Clamp to `[0, max]` or custom min/max |
| `getTvFocusRingInsetPx` | Read ring tokens from computed style |
| `getFocusRingTopInScrollport` | DOM measure vs scrollport |
| `getFocusRingTopInContent` | DOM measure in content space |
| `getTvScrollParkDownBiasPx` | `--tv-scroll-park-down-bias` |
| `getTvScrollAdReservePx` | `--tv-scroll-ad-reserve` |
| `getVerticalScrollMetrics` | Bundle viewport/inner metrics for the hook |

---

## Implementation phases

### Phase A — Geometry + park line helpers

- [x] `tvFocusGeometry.js` (pure calcs + DOM readers)
- [ ] Manual sanity: landing focus on Home → measure `parkY` in DevTools (hook not wired yet)

### Phase B — Hook rewrite

- [x] Replace row-fit logic in `useTvVerticalGroupScroll` with parked-ring algorithm
- [x] `parkYRef` set once per screen visit
- [x] Down / up / landing / bottom-end / top-end rules
- [x] Export alias `useTvVerticalParkedScroll`
- [x] No transform transition until `parkY` captured

### Phase C — Wire Home screens

- [x] Pass `getFocusedElement` from `useScreenContentFocus().getItemElement`
- [x] `lastFocusableGroupIndex` on Broad + Limited (ad rows skipped)

### Phase D — Polish

- [x] No transform transition until `parkY` captured (double `rAF` before enabling)
- [x] Double `rAF` remeasure after focus group change (matches `useScreenContentFocus`)
- [x] Resize at bottom end reclamps when scroll height changes (footer ad reserve)
- [x] Limited catalog: `TvShell` mounts `TvFooterAdBanner` + `TvVisualAdsHtmlSync` (`html[data-visual-ads]`)

### Phase E — QA matrix

| Scenario | Expect | Status |
|----------|--------|--------|
| Land default swimlane, Down through rails | Ring top steady at `parkY` | Pass (user) |
| Last rail | Ring unparks only when bottom + bias visible | Pass (user) |
| Up from last rail | Unpark → parked scroll → unpark at top | Pass (user) |
| Header sticky vs scroll AB | `parkY` from landing control | Manual: `?homeHeader=sticky` vs default scroll |
| Limited Home | Filters + rail; last group = swimlane | Manual: wordmark → limited territory |
| Footer ad enabled | Extra bottom padding; bottom end still correct | Manual: limited + non-subscribed user type |

---

## Risks

- Focus node missing on first layout → retry on `rAF` / ResizeObserver.
- Variable row heights (banner vs swimlane): ring-based scroll fixes row-fit drift.
- Outline measurement must match visible ring (`outline` + `outline-offset`).

---

## Progress log

| Date | Phase | Notes |
|------|-------|--------|
| 2026-06-03 | A | Added `tvFocusGeometry.js` + this plan |
| 2026-06-03 | B+C | Hook rewrite + Broad/Limited wiring |
| 2026-06-03 | D+E | Polish (double rAF, footer ad slot) + QA sign-off on parked up/down |
| 2026-06-09 | Doc | Canonical spec: [`../vertical-parked-navigation.md`](../vertical-parked-navigation.md) (Search wiring gaps, chrome vs inner) |
| 2026-06-09 | Search | Linear vertical nav + parked scroll on Search music browse (`Search.jsx`); removed skip-nav helper |
