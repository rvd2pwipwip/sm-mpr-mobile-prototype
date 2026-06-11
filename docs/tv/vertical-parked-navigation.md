# TV vertical parked navigation — specification and implementation

Canonical reference for **vertical D-pad navigation** on TV screens where a **focus ring stays parked** on a fixed viewport line while **content scrolls**, until top or bottom end conditions release the ring.

**Mental model:** Same as **horizontal parked focus** in `VariableSwimlane` / Channel Info tag rows, transposed to the **Y axis**.

**Related docs:**

- Implementation history and QA checklist: [`Plans/vertical-parked-navigation-plan.md`](./Plans/vertical-parked-navigation-plan.md)
- Horizontal swimlane parking: [`Plans/tv-swimlane-layout-nav-overlay-plan.md`](./Plans/tv-swimlane-layout-nav-overlay-plan.md)
- Swimlane components: [`Plans/cards-and-swimlanes-implementation-plan.md`](./Plans/cards-and-swimlanes-implementation-plan.md)

---

## Overview

On TV, users move focus with Up/Down (vertical) and Left/Right (horizontal). For long vertically stacked screens (Home swimlanes, Search browse body, Limited Home stacked lanes), we want:

1. A **stable focus ring position** while browsing the middle of the list (ring top does not jump row-to-row).
2. **Content** that moves under the ring (`translateY` on a scroll inner).
3. **Unpark** at the **top** and **bottom** so the ring can follow focus when there is no more room to scroll.

Horizontal rows (swimlanes, pill strips, single-row button groups) use the same **parked** idea on **X** inside each row. Vertical parking does **not** reset `parkY` when the user moves Left/Right.

---

## Product specification (locked)

### Park line (`parkY`)

| Rule | Detail |
|------|--------|
| **What** | Viewport Y coordinate of the **focus ring top** (outline + offset), not the control box top. |
| **When captured** | Once per **screen visit** (route mount), on first successful measure after **landing focus**. |
| **From what** | The **actual focused DOM element** on load (e.g. first card tile), not a group wrapper bounding box. |
| **Lifetime** | Fixed for the visit. **Not** recalculated on Up/Down or Left/Right. Cleared on unmount / new route. |
| **Landing target** | First **in-scroll** focusable the screen chooses (e.g. first card of first card row on Search browse). Chrome above the scroll inner may be focused later via Up; it does not set `parkY` unless the screen lands there on load. |

### Vertical traversal (focus order)

| Rule | Detail |
|------|--------|
| **Steps** | Linear **`+1` / `-1`** on vertical focus steps. |
| **Implementation today** | One **focus group** per horizontal band (search row, tab row, pill row, card swimlane, …). |
| **Single-item rows** | Group step equals item step (`itemCount === 1`). |
| **Do not skip** | Avoid custom `resolveMoveDown` / `resolveMoveUp` that jump groups (e.g. cards → next cards skipping pills). Linear order must match document order. |

### Parked region (middle of list)

**Move Down** (when not at bottom end):

- Focus advances to the next vertical step.
- **Ring top stays at `parkY`** on screen.
- Scroll inner moves up (`offsetY` increases) until the **new** focused element's ring top aligns with `parkY`.

**Move Up** (when ring is at `parkY` and not at top end):

- Focus moves to the previous vertical step.
- **Ring top stays at `parkY`**.
- Content scrolls down (`offsetY` decreases) until the new element's ring top aligns with `parkY`.

### Top end

| Rule | Detail |
|------|--------|
| **Scroll** | `offsetY === 0`. Layouts are **top-anchored**; no extra top breathing room. |
| **Unpark** | When the topmost focusable in the chain is focused and fully visible, the **ring may move up** to follow focus (e.g. into header chrome). |
| **First focusable** | Smallest group index in the screen's vertical chain (often `0` = search field on Search). Distinct from **landing group** (where browse lands in the body). |

### Bottom end

| Rule | Detail |
|------|--------|
| **Scroll** | Smallest `offsetY` where **content bottom + bottom padding** is visible, including `--tv-scroll-park-down-bias` (and ad reserve in layout when used). |
| **Unpark** | On the **last focusable** vertical step, the **ring may move down** once bottom end is reached. |
| **Last focusable** | Last group in focus order (last swimlane on Home; last body group on Search). Skip **non-focus** rows (e.g. in-feed ad banner). |

### Horizontal navigation (Left / Right)

| Rule | Detail |
|------|--------|
| **`parkY`** | **Never** recalculated on horizontal moves. |
| **Swimlanes / rows** | Horizontal parking inside the row (`VariableSwimlane`, `FixedSwimlane`, pill rows). |
| **Vertical scroll hook** | Does **not** run on item index change within the same group (all items in a row share the same ring **Y**). |

### Non-focusable content

Section titles, spacing, and decorative blocks are not focus groups. They still affect layout height. Parking math uses the **focused element** only.

### Chrome vs scroll inner (important)

Many screens have two parallel concepts:

1. **Focus order** — includes header controls (search field, content switcher) as groups `0`, `1`, …
2. **Scroll geometry** — only nodes **inside** the scroll inner participate in `translateY` parking.

**On load (browse):** land on first in-scroll control → capture `parkY` → `offsetY = 0`.

**Up into chrome** at `offsetY === 0`:** unpark; ring follows focus in the header (header is not translated).

**Down from chrome into body:** `parkY` already set → content scrolls so the body control's ring top hits `parkY`.

---

## Group-based steps vs element-based geometry

| Concern | Approach |
|---------|----------|
| **Ring position / scroll offset** | **Element-based** — always measure the focused DOM node via `getFocusedElement()`. |
| **When vertical scroll recalculates** | **Group-based trigger** — `useTvVerticalGroupScroll` runs when `focusedGroupIndex` changes. |
| **Why that is enough today** | Every vertical step is a **new horizontal band**. All items in one band share the same ring **Y**; Left/Right only changes **X**. |
| **Future: vertical stack in one group** | Either split into **one group per row** (preferred), or extend the hook to also react to `focusedItemIndex` / a flat `focusStepIndex` when `layout: 'vertical'` on a group. |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Screen page (e.g. BroadHome, Search)                      │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ useScreenContentFocus(screenId, { groupCount, ... })   │  │
│  │  - focusedGroupIndex, focusedIndex (per-group memory)  │  │
│  │  - window Up/Down → handleMoveUp / handleMoveDown      │  │
│  │  - swimlane groups → L/R delegated to swimlane         │  │
│  │  - getItemElement(group, index) → HTMLElement          │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ useTvVerticalGroupScroll (alias useTvVerticalParkedScroll)│
│  │  - viewportRef, innerRef, offsetY, registerGroupRef     │  │
│  │  - parkY once; measureAndPark on group change          │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ tvFocusGeometry.js — pure math + DOM ring measurement    │  │
│  └───────────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ VariableSwimlane / FixedSwimlane — horizontal park X   │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

**Screen memory** (`ScreenMemoryContext`): optional persistence of `scrollOffsetY` and `parkLineY` per `screenId` when the user leaves and returns to a tab.

---

## Implementation reference

### Files

| File | Role |
|------|------|
| `apps/tv/src/hooks/useTvVerticalGroupScroll.js` | Parked vertical scroll state machine |
| `apps/tv/src/utils/tvFocusGeometry.js` | Ring measurement and offset calculations |
| `apps/tv/src/hooks/useScreenContentFocus.js` | Per-screen vertical groups, Up/Down, item refs |
| `apps/tv/src/components/swimlanes/VariableSwimlane.jsx` | Horizontal parking (reference pattern) |
| `apps/tv/src/index.css` | `--tv-scroll-park-down-bias`, `--tv-scroll-ad-reserve`, focus ring tokens |

### Hook API

```js
const {
  viewportRef,
  innerRef,
  registerGroupRef,
  offsetY,
  innerClassName,
} = useTvVerticalGroupScroll(focusedGroupIndex, {
  landingGroupIndex,           // group index for first-visit landing (offset 0, capture parkY)
  firstFocusableGroupIndex,    // default 0 — top of vertical chain for top-end unpark
  lastFocusableGroupIndex,     // last real focus group (skip ad-only rows)
  getFocusedElement,           // () => HTMLElement | null — current focused control
  screenId,                    // optional — persist scrollOffsetY + parkLineY
});
```

**Alias:** `useTvVerticalParkedScroll` (same export).

### Geometry helpers (`tvFocusGeometry.js`)

| Function | Role |
|----------|------|
| `calcFocusRingTopFromRect` | Ring top from layout rect + inset |
| `calcFocusRingTopInContent` | Scrollport ring top + current `offsetY` |
| `calcParkedScrollOffsetY` | `ringTopContent - parkY` |
| `calcMaxScrollOffsetY` | `innerHeight - viewportHeight` |
| `calcMinScrollOffsetForBottomEnd` | Bottom + down bias visible |
| `clampScrollOffsetY` | Clamp to `[0, max]` |
| `getFocusRingTopInScrollport` | DOM measure vs scrollport |
| `getFocusRingTopInContent` | DOM measure in content space |
| `measureParkLineY` | Capture `parkY` from focused element |
| `getVerticalScrollMetrics` | Viewport/inner metrics bundle |

### Scroll algorithm (summary)

On **landing** (`focusedGroupIndex === landingGroupIndex` and first visit):

1. `offsetY = 0`
2. If focused element is inside scroll inner → `measureParkLineY` → store `parkY`

On **group change** with focus inside inner:

1. Ensure `parkY` is captured (once).
2. Measure focused element ring in content coordinates.
3. `parkedOffset = calcParkedScrollOffsetY(ringTopContent, parkY)`.
4. **Down:** `nextOffset = max(currentOffset, parkedOffset)`, capped before bottom end unless last group (then allow `minOffsetForBottomEnd`).
5. **Up:** if at bottom end and ring below `parkY`, unpark (no scroll). Else `nextOffset = min(currentOffset, parkedOffset)`; at top end force `0`.
6. **ResizeObserver** on viewport, inner, and registered groups reclamps offset.

**Transitions:** `translateY` animation class (`tv-home__scroll-inner--animated`) enabled only after `parkY` is captured (double `requestAnimationFrame`).

### DOM / layout contract

```html
<main class="tv-home">           <!-- flex column; min-height 0 chain from shell -->
  <header>...</header>           <!-- optional: outside scroll inner (sticky chrome) -->
  <div ref={viewportRef} class="tv-home__scroll">   <!-- flex: 1; overflow: hidden -->
    <div
      ref={innerRef}
      class="tv-home__scroll-inner [--animated]"
      style="transform: translateY(-{offsetY}px)"
    >
      <!-- focus groups / swimlanes -->
    </div>
  </div>
</main>
```

| Requirement | Reason |
|-------------|--------|
| Scrollport `overflow: hidden` (vertical) | Clip translated inner |
| Inner `padding-bottom` includes ad reserve when needed | Bottom-end math |
| `app-shell` / page **no** `overflow-x: hidden` if fixed overlays need it | See mobile/TV shell notes |
| Avoid `position: fixed` header **plus** fake scroll padding | Breaks park line vs content relationship |
| `getFocusedElement` returns a node with visible focus ring styles | Measurement matches UI |

### Focus wiring pattern (reference: Broad Home)

```js
const {
  focusedGroupIndex,
  focusedIndex,
  getItemElement,
  handleMoveUp,
  handleMoveDown,
  registerItemRef,
  // ...
} = useScreenContentFocus("home-broad", {
  groupCount,
  itemCounts,
  swimlaneGroups,
  defaultGroupIndex: focusConfig.firstSwimlaneGroup,
  defaultItemIndex: HOME_LANDING_ITEM_INDEX,
});

const getFocusedElement = useCallback(
  () => getItemElement(focusedGroupIndex, focusedIndex),
  [getItemElement, focusedGroupIndex, focusedIndex],
);

useTvVerticalGroupScroll(focusedGroupIndex, {
  landingGroupIndex: focusConfig.firstSwimlaneGroup,
  lastFocusableGroupIndex: focusConfig.lastSwimlaneGroup,
  getFocusedElement,
  screenId: "home-broad",
});
```

**Note:** Broad Home does **not** pass `firstFocusableGroupIndex`; it defaults to `0` (header group). Header may live outside the scroll inner; the hook returns early until focus is inside the inner.

---

## Integration checklist (new screen)

Use this when adding a vertically scrollable, focusable screen:

### Focus model

- [ ] Define **focus groups**: one horizontal band per group (row of pills, swimlane, single search field, …).
- [ ] Assign stable **group indices** (constants file per screen).
- [ ] Set **`defaultGroupIndex`** + **`defaultItemIndex`** for landing (specific tile, not only group).
- [ ] Wire **`useScreenContentFocus`** with `groupCount`, `itemCounts`, `swimlaneGroups`.
- [ ] Use **linear** `moveFocusUp` / `moveFocusDown` only — **no** skip resolvers unless product explicitly requires a non-linear tree.

### Parked scroll

- [ ] Mount **`useTvVerticalGroupScroll`** with `focusedGroupIndex` from content focus.
- [ ] Pass **`getFocusedElement`** → `getItemElement(group, index)`.
- [ ] Set **`landingGroupIndex`** to the landing **group** (first visit resets scroll + captures `parkY` from **element**).
- [ ] Set **`firstFocusableGroupIndex`** to **first group in full vertical chain** (usually `0`).
- [ ] Set **`lastFocusableGroupIndex`** to last real focus group (exclude ad-only rows).
- [ ] Attach **`viewportRef`** / **`innerRef`** and `transform: translateY(-offsetY)`.
- [ ] Call **`registerGroupRef(groupIndex, node)`** on each vertical band wrapper for resize observation.

### Layout

- [ ] Flex column shell so scrollport gets remaining height (`min-height: 0`).
- [ ] Decide **chrome in or out** of scroll inner; document Up/Down behavior at `offsetY === 0`.
- [ ] Add **`padding-bottom`** on inner for bottom bias / footer ad if applicable.

### Horizontal rows

- [ ] Mark swimlane groups in `swimlaneGroups` so screen-level L/R does not steal keys.
- [ ] Reuse **`VariableSwimlane`** / **`FixedSwimlane`** for horizontal parking.

### QA

- [ ] Land default item: ring stable, `offsetY === 0`, `parkY` captured.
- [ ] Down through middle: ring top steady; content scrolls.
- [ ] Last group: bottom + bias visible; ring unparks downward.
- [ ] Up from bottom: unpark → parked scroll → unpark at top / into chrome.
- [ ] Left/Right in row: ring Y unchanged; `parkY` unchanged.
- [ ] Tab away and back (if `screenId` set): scroll offset restores; park line restores.

---

## Screen notes

### Broad Home and Limited Home (reference)

| Topic | Behavior |
|-------|----------|
| **Status** | Parked vertical navigation **QA-passed** |
| **Landing** | First swimlane, first card (`HOME_LANDING_ITEM_INDEX`) |
| **Groups** | Header, optional banner, swimlanes (banner may be non-focus ad) |
| **`lastFocusableGroupIndex`** | Last swimlane group (ads skipped) |
| **Header** | Sticky or scroll-with-content AB (`?homeHeader=`); landing still from first swimlane tile |

### Search and Browse

| Topic | Behavior |
|-------|----------|
| **Status** | Parked vertical navigation wired per this spec (2026-06-09) |
| **Focus order** | `0` search row, `1` browse tabs (when visible), `2+` body (pills / cards per vibe section) |
| **Landing** | First **card** of first card row (`landingGroup` = first cards group; item index `0`) |
| **Traversal** | Linear `+1` / `-1`: genre cards → activity pills → activity cards → … |
| **Chrome** | Header **outside** scroll inner; `parkY` from in-scroll landing; `firstFocusableGroupIndex` = `0` |
| **Last group** | `lastBodyGroup` (last row in focus order, usually last card swimlane) |
| **Music-only** | When content switcher hidden, `resolveMoveDown` / `Up` bridge group `0` ↔ `bodyStart` (group `1` unused) |

See [`Plans/Search-Browse-implementation-plan.md`](./Plans/Search-Browse-implementation-plan.md) for browse layout phases.

---

## Anti-patterns

| Anti-pattern | Why it breaks |
|--------------|----------------|
| Skip groups on Down (cards → next cards) | Wrong focus order; parked offset jumps; ring leaves viewport |
| `firstFocusableGroupIndex` = landing body group | Top-end unpark misaligned; Up into header behaves wrong |
| `lastFocusableGroupIndex` omits last pill row when it is last in order | Bottom-end unpark too early (only if pills are literally last) |
| Measuring group wrapper instead of focused item | Ring Y wrong for swimlane slots |
| Focusable child without `forwardRef` + `tabIndex={-1}` on DOM root | `getFocusedElement()` null; `parkY` never captured (Search label tiles) |
| Fixed header + padding-top on scroll body | Park line vs content drift |
| Recalculating `parkY` on horizontal move | Violates spec; swimlanes already park X separately |
| `overflow-x: hidden` on scrollport clipping rings | Use swimlane scrollport rules from layout plan |

---

## CSS tokens

| Token | Purpose |
|-------|---------|
| `--tv-focus-ring-width`, `--tv-focus-ring-gap` | Ring inset for measurement |
| `--tv-scroll-park-down-bias` | Extra space below content at bottom end |
| `--tv-scroll-ad-reserve` | Footer ad / bottom padding in scroll inner |

Defined in `apps/tv/src/index.css`. Geometry reads computed values from the scrollport or focused element.

---

## Relationship to horizontal parking

| Axis | Container | Transform | Park line |
|------|-----------|-----------|-----------|
| **Horizontal** | Swimlane scrollport | `translateX(-offsetX)` on track | Fixed viewport X for ring leading edge |
| **Vertical** | Page scrollport | `translateY(-offsetY)` on inner | Fixed viewport Y for ring top (`parkY`) |

Same user expectation: **in the middle of the list, the ring stays put and content moves.**

---

## Changelog

| Date | Notes |
|------|-------|
| 2026-06-03 | Initial implementation on Home (`tvFocusGeometry.js`, hook rewrite) |
| 2026-06-09 | Spec consolidated from Search browse parking work; chrome vs inner rules; Search wiring gaps documented |
