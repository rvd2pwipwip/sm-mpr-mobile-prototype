# TV swimlane layout, focus rings, and overlay nav — implementation plan

**Purpose:** Handoff plan for a dedicated implementation pass. Aligns TV horizontal swimlanes and focus treatment with the **SMTV03 end result** (reference screenshots + parking behavior), **mobile full-bleed swimlane geometry**, and **Figma TV** tokens — without porting SMTV03 code wholesale.

**Prerequisite:** Phases 0–6 of [`cards-and-swimlanes-implementation-plan.md`](cards-and-swimlanes-implementation-plan.md) are done (cards, fixed/variable swimlanes, broad + limited Home, focus memory, More grid).

**When done:** Update [`plan.md`](plan.md), append [`../react-learning.md`](../react-learning.md), and index Figma node `15759:38243` in [`../figma-nodes.md`](../figma-nodes.md).

---

## Locked product decisions (from UX review)

| Topic | Decision |
|-------|----------|
| **Broad catalog inset** | Figma TV `--tv-content-inline-start: 140px`, `--tv-content-inline-end: 100px` ([`homeMain` `15515:41291`](../figma-nodes.md)) |
| **Limited catalog inset** | SMTV03-style **`100px`** both sides (`--tv-content-inline-start-limited` / alias of SMTV03 `--screen-side-padding`) — **no side menu** on limited Home (matches SMTV03) |
| **Primary nav** | **Fixed overlay** in collapsed **and** expanded states; **never pushes** main content horizontally |
| **Nav background** | Solid → transparent **gradient** per Figma [`15759:38243`](https://www.figma.com/design/DfwtFG53ud7EHhvlPutvI8/SM-HTML-TV-MPR?node-id=15759-38243) — content visible underneath when swimlanes scroll left |
| **Nav scope** | Broad catalog only (limited Home has no overlay nav — territory toggle returns to broad) |
| **Card focus ring** | **10px outline on thumbnail only**, drawn **outside** the thumbnail via **wrapper padding** (keep current visual; do not ring the title) |
| **Filter button focus** | Same **outside-ring** treatment as cards (unified `--tv-focus-ring-width`) — rounded rect buttons, not mobile pills |
| **Header + promo banner** | Stay **inset** (column layout) |
| **Swimlanes only** | **Break out** full viewport width; titles inset, scroll rows full-bleed |
| **Scroll under nav** | Horizontal rows slide **under** overlay nav on the left (analogous to mobile content under bottom chrome) |
| **Right edge** | Row **bleeds off** screen; clip at viewport right, not at inset column |

### Reference screenshots (SMTV03 behavior)

Saved in workspace for agent context:

- **Image A** — At-rest: filter buttons + first card aligned to same left inset; focus ring on **Most Popular** sits **outside** the blue fill; cards row bleeds off right.
- **Image B** — Scrolled left: first card **All-Time Greatest Hits** moved toward screen left; focus ring still fully visible; demonstrates parking toward **screen left**, not early clip at inset.

Use these as **behavioral** reference; light-theme tokens come from Figma TV, not SMTV03 dark theme.

---

## Current problems (as-built)

1. **`TvShell` flex layout** — `PrimaryNav` consumes `--nav-width`; expanding nav **shrinks** `main` and reflows swimlanes.
2. **`tv-home__scroll` horizontal padding** — entire page column is inset; swimlanes are **not** full-bleed siblings of inset blocks.
3. **`overflow: hidden` on swimlane viewports** — clips **outline** focus rings on cards and filter buttons.
4. **Card focus** — 10px border on `.tv-content-tile__thumbnail` with `overflow: hidden` — ring is **inside** clip rect; inconsistent with filter **outline** outside button.
5. **Parking math** — `FixedSwimlane` / `VariableSwimlane` measure viewport as **main column width** (already reduced by nav); should use **full 1920** scrollport.
6. **`getTvGridColumnCount()`** — subtracts nav width; should use full viewport minus inset tokens only (separate follow-up for More grid if needed).

---

## Target architecture

### Page structure (broad Home — mirror for limited without nav)

```
TvViewport (1920 x 1080)
  TvShell (position: relative; main full width)
    PrimaryNav (position: fixed; z-index above content; gradient bg)
    main.tv-shell__main (width: 100%; no horizontal pad)
      tv-home
        TvHomeHeader          ← inset padding (140 / 100)
        tv-home__scroll       ← vertical scroll only; NO horizontal pad on shell
          tv-home__banner     ← inset (inside .content-inset wrapper or own pad)
          section.swimlane-row (× N)   ← full width
            h2.swimlane-row__title     ← padding-inline-start: var(--tv-swimlane-inline-start)
            div.swimlane-scrollport    ← width 100%; overflow-x clip; overflow-y visible
              div.swimlane-track       ← padding-inline-start; transform translateX
                slots (cards / filter buttons with ring gutter)
```

**Limited Home:** Same swimlane geometry with `--tv-swimlane-inline-start: 100px`; **omit** `PrimaryNav` overlay (or hide via territory — nav only on broad routes).

### Territory-driven inset token

```css
:root {
  --tv-content-inline-start: 140px;   /* Figma broad — header, banner, titles */
  --tv-content-inline-end: 100px;
  --tv-content-inline-start-limited: 100px; /* SMTV03 */
  --tv-content-inline-end-limited: 100px;
}

/* Set on html or .tv-home from TerritoryContext */
[data-catalog-scope="broad"] {
  --tv-swimlane-inline-start: var(--tv-content-inline-start);
}
[data-catalog-scope="limited"] {
  --tv-swimlane-inline-start: var(--tv-content-inline-start-limited);
}
```

(`TerritoryProvider` already sets `data-catalog-scope` on `<html>`.)

### Focus ring system (unified)

| Token | Value |
|-------|--------|
| `--tv-focus-ring-width` | `10px` |
| `--tv-focus-ring-color` | `var(--color-on-bkg)` / `#191919` |
| `--tv-focus-ring-gap` | `0` (outline-offset; tune from Figma if needed) |
| `--tv-slot-ring-gutter` | `10px` (padding around thumbnail/button so outline does not collide with neighbors) |

**Channel card pattern:**

```
.tv-content-tile
  .tv-content-tile__thumb-wrap   ← padding: var(--tv-slot-ring-gutter); outline when focused
    .tv-content-tile__thumbnail  ← image only; overflow hidden; NO focus border here
  .tv-content-tile__title
```

**Filter button pattern:**

```
.filter-button   ← outline on focus; slot wrapped with same gutter in variable swimlane item
```

**Scrollport rule:** `overflow-x: clip` (or `hidden`) on `.swimlane-scrollport`; **`overflow-y: visible`** so rings paint above/below row. Optional: `padding-block: var(--tv-slot-ring-gutter)` on track to avoid vertical clip.

### Overlay nav (Figma `15759:38243`)

- `position: fixed; left: 0; top: 0; height: 100%; z-index: var(--z-primary-nav)` (define token, e.g. `100`)
- **Remove** `--nav-width` from flex layout; collapsed width ~48px, expanded ~220px — **visual only**
- Background: linear gradient **opaque at left** → **transparent at right** (pull exact stops from Figma MCP on implement)
- `pointer-events: auto` on nav; content underneath remains full 1920 for layout math
- D-pad: unchanged — `enterNav` / `enterContent` from `TvNavFocusContext`

### Swimlane parking (SMTV03-aligned)

Reference: SMTV03 `FixedSwimlane` / `VariableSwimlane` — `leftPadding` on viewport + inner row transform; `maxOffset` uses **full container width**.

**FixedSwimlane changes:**

- Scrollport width = **1920** (or `offsetWidth` of full-bleed port, not parent inset column)
- Leading gutter = **`padding-inline-start` on `.swimlane-track`** = `var(--tv-swimlane-inline-start)`
- **Do not** subtract nav width from available width
- At **index 0**, first card aligns with title (inset); scrolling **left** reduces offset until card reaches **x = 0** (under nav), not stopped at inset boundary
- Revisit parking formula: SMTV03 uses `maxOffset = totalContentWidth - viewportWidth + leftPadding + rightPadding`; port to current hook with **track padding** instead of viewport padding where needed

**VariableSwimlane:** Same scrollport / track split; measured widths unchanged.

---

## Implementation phases

### Phase 1 — Tokens and shell (nav overlay)

**Goal:** Main content is always full viewport width; nav floats above.

**Tasks:**

1. Add tokens to `apps/tv/src/index.css`: `--z-primary-nav`, `--tv-focus-ring-*`, `--tv-slot-ring-gutter`, limited inset aliases, `--tv-swimlane-inline-start` mapping via `data-catalog-scope`.
2. Refactor `TvShell.jsx` — remove flex split; `main` is `width: 100%`, `position: relative`.
3. Refactor `PrimaryNav.css` — `position: fixed`; gradient background from Figma `15759:38243` (use Figma MCP `get_design_context` / screenshot for stops).
4. Remove `tv-shell--nav-expanded` width mutation on shell (keep expanded state for nav styling only).
5. Hide or skip `PrimaryNav` on limited territory routes if product requires zero nav chrome on limited Home (currently limited still mounts shell — **hide nav when `catalogScope === limited`** on Home, or globally when limited — confirm: limited = no side menu).

**Acceptance:**

- [ ] Expanding/collapsing nav does **not** shift swimlane or header horizontal position.
- [ ] Nav gradient matches Figma intent (opaque left, fade right).
- [ ] Limited Home shows **no** overlay nav (SMTV03 parity).

**Files:** `index.css`, `TvShell.jsx`, `PrimaryNav.jsx`, `PrimaryNav.css`, optionally `App.jsx` / territory guard.

---

### Phase 2 — Full-bleed swimlane layout

**Goal:** Mobile-style column + full-bleed scroll rows; header/banner stay inset.

**Tasks:**

1. Add `.content-inset` (or reuse pattern) for header + banner blocks in `BroadHome.jsx` / `LimitedHome.jsx` with `--tv-content-inline-start/end`.
2. Remove horizontal padding from `.tv-home__scroll`; keep vertical gap only.
3. Refactor `SwimlaneRow.css` — title uses `padding-inline-start: var(--tv-swimlane-inline-start)`.
4. Introduce shared structure in swimlane components:
   - `.swimlane-scrollport` (full width, overflow-x clip, overflow-y visible)
   - `.swimlane-track` (flex row, padding-inline-start, transform)
5. Update `FixedSwimlane.jsx` + `.css` — move from viewport-internal padding to **track** leading gutter; measure scrollport at full width.
6. Update `VariableSwimlane.jsx` + `.css` — same scrollport/track split.
7. Update parking `useMemo` / `calcOffsetForIndex` in both — full 1920 width, SMTV03 maxOffset with track padding.
8. Fix `getTvGridColumnCount()` in `tvLayout.js` — remove nav width subtraction; use territory-aware inset tokens.

**Acceptance:**

- [ ] Swimlane titles align with header text left edge (140px broad / 100px limited).
- [ ] First card/filter at rest aligns with title.
- [ ] Row extends past right edge of screen; last visible cards clip at **viewport** right only.
- [ ] Scrolling left moves content under nav overlay toward screen x=0 (screenshot B behavior).

**Files:** `BroadHome.jsx`, `LimitedHome.jsx`, `index.css`, `SwimlaneRow.jsx`, `SwimlaneRow.css`, `FixedSwimlane.jsx`, `FixedSwimlane.css`, `VariableSwimlane.jsx`, `VariableSwimlane.css`, `tvLayout.js`.

---

### Phase 3 — Unified focus rings (cards + filters)

**Goal:** Rings extend outside focused elements; never clipped by swimlane scrollport.

**Tasks:**

1. Refactor `ContentTileCard.jsx` + `.css`:
   - Add `.tv-content-tile__thumb-wrap` with ring gutter padding.
   - Move focused outline/box to wrap; thumbnail keeps `overflow: hidden` for image only.
   - Remove focus border from `.tv-content-tile__thumbnail--focused` (or demote to unfocused transparent reserve if needed for layout stability).
2. Align `FilterButton.css` to same `--tv-focus-ring-width` outline pattern (replace mixed box-shadow if any).
3. Add ring gutter to `VariableSwimlaneItem` / fixed swimlane slot wrappers so adjacent slots do not overlap rings.
4. Verify `overflow-y: visible` on scrollport; add track `padding-block` if rings clip vertically.
5. Regression: swimlane restore after Esc (no ring clip flash); no animation regression from Phase 5 fix.

**Acceptance:**

- [ ] Focused card ring fully visible on all edges (compare screenshot A).
- [ ] Focused filter ring matches card ring weight and **outside** placement.
- [ ] Scrolling focused item left — ring not clipped until screen edge (screenshot B).
- [ ] Unfocused tiles unchanged.

**Files:** `ContentTileCard.jsx`, `ContentTileCard.css`, `FilterButton.css`, swimlane slot CSS, possibly `SwimlaneMoreTile.css`.

---

### Phase 4 — Integration, docs, manual QA

**Tasks:**

1. Manual checklist (keyboard on `npm run dev:tv`):
   - Broad Home: both music rails + nav overlay expand/collapse.
   - Limited Home: genre row + channel rail; 100px inset; no nav.
   - Esc back from channel info / More — focus + ring + scroll position.
   - Up/Down between rails (window capture handler from prior fix).
2. Update `docs/tv/figma-nodes.md` — nav overlay node `15759:38243`, limited inset note.
3. Append `docs/tv/react-learning.md` — full-bleed TV swimlane + overlay nav + outside ring pattern.
4. Update `docs/tv/Plans/plan.md` — milestone complete.

**Acceptance:**

- [ ] `npm run lint:tv` and `npm run build:tv` pass.
- [ ] No pixel-perfect Figma requirement unless called out — structure and behavior match this plan.

---

## File touch list (summary)

| Area | Files |
|------|--------|
| Tokens / shell | `apps/tv/src/index.css`, `TvShell.jsx`, `PrimaryNav.css`, `PrimaryNav.jsx` |
| Home layout | `BroadHome.jsx`, `LimitedHome.jsx`, `TvHomeHeader` styles |
| Swimlanes | `SwimlaneRow.*`, `FixedSwimlane.*`, `VariableSwimlane.*`, `VariableSwimlaneItem.jsx`, `GenreFilterSwimlane.jsx`, `MusicChannelSwimlane.jsx` |
| Cards / filters | `ContentTileCard.*`, `FilterButton.*`, `SwimlaneMoreTile.*` |
| Layout utils | `apps/tv/src/utils/tvLayout.js` |
| Docs | `docs/tv/figma-nodes.md`, `docs/tv/react-learning.md`, `docs/tv/Plans/plan.md` |

---

## Out of scope (this plan)

- Podcast/radio swimlanes, player, ads, Search & Browse layout
- Pixel-perfect dark SMTV03 theme port
- More grid parking rework beyond `getTvGridColumnCount` token fix
- Channel Info / Play button restyle (unless ring clip appears there — fix only if broken)

---

## Agent chat starter prompt (copy-paste)

```
Implement docs/tv/Plans/tv-swimlane-layout-nav-overlay-plan.md in apps/tv/.

Locked decisions are in the plan table — do not re-debate inset values or nav overlay behavior.

Use Figma MCP for node 15759:38243 (nav gradient) and 15515:41291 (broad Home tokens).

Reference screenshots in workspace assets (SMTV03 at-rest and scrolled-left).

Phases 1–3 are required; Phase 4 docs + QA before done.

Match existing code patterns (FixedSwimlane parking, useScreenContentFocus, TerritoryProvider data-catalog-scope).

Run npm run lint:tv and npm run build:tv when complete.
```

---

## Parking math notes (for implementer)

SMTV03 `FixedSwimlane` (reference only):

```javascript
// offset to align focusedIndex card
const left = focusedIndex * (CARD_WIDTH + GAP);
// max scroll — includes leading padding in maxOffset term
const maxOffset = Math.max(0, totalContentWidth - viewportWidth + leftPadding + rightPadding);
return Math.min(left, maxOffset);
```

**Adaptation for track padding:**

- Apply `leftPadding` as **`padding-inline-start` on track**, not on scrollport.
- `viewportWidth` = scrollport client width (= 1920 in prototype).
- When `focusedIndex === 0`, `translateX(0)` — first slot sits at inset via track padding only.
- Minimum offset (scroll far left): allow `translateX` to reach point where first card's **left edge** approaches `0` (content under nav), not clamped to keep inset — verify against screenshot B.

If behavior differs from screenshot B after first pass, adjust min-offset clamp in `FixedSwimlane` / `VariableSwimlane` and document in react-learning.

---

_Last updated: 2026-05-29 — plan authored for dedicated implementation agent._
