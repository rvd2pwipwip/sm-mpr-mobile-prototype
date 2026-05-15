# ContentSwimlane and category rail variant

Plan and step-by-step notes for **`ContentSwimlane`** (today) and the optional **category rail** variant (not shipped yet). Use this doc instead of duplicating detail in **`docs/Plans/plan.md`**.

**Related:** `docs/react-learning.md` (Swimlane layout pattern), `.cursor/rules/stingray-music-prototype.mdc` (swimlane checklist), **`docs/figma-nodes.md`**.

---

## 1. Standard `ContentSwimlane` (reference)

### 1.1 Role

Horizontal **content rail**: inset **title** + optional **More** button in the header row; below that, a **full-width** horizontal scroller with **card tiles** as children. This matches the project swimlane rule: **gutters on the inner flex row** (`var(--space-content-inline)`), not on the scrollport.

### 1.2 Files

| Piece | Path |
|-------|------|
| Component | `src/components/ContentSwimlane.jsx` |
| Styles | `src/components/ContentSwimlane.css` |
| Default card cap | `src/constants/swimlane.js` (`SWIMLANE_CARD_MAX` = 12) |

### 1.3 DOM structure

```
section.content-swimlane
  div.content-swimlane__header       # padding-inline: content gutter
    h2.content-swimlane__title
    button.content-swimlane__more    # optional
  div.content-swimlane__categories-scroll   # optional; only when categoryRail prop set
    div.content-swimlane__categories-inner
      {categoryRail}                 # pills use .content-swimlane__category-pill [--active]
  div.content-swimlane__scroll       # overflow-x: auto; scrollbar hidden
    div.content-swimlane__scroll-inner
      {children}                     # typically *Card components
```

### 1.4 Props and More visibility

| Prop | Default | Purpose |
|------|---------|---------|
| `title` | (required) | Section heading |
| `children` | (required) | Tiles inside the scroll row |
| `showMore` | `true` | When `sourceCount` is omitted, controls More visibility |
| `onMore` | - | Called when More is pressed |
| `maxVisible` | `SWIMLANE_CARD_MAX` | Threshold vs `sourceCount` |
| `sourceCount` | - | If set: More shows when `sourceCount > maxVisible`, unless `alwaysShowMore` |
| `alwaysShowMore` | `false` | If true: More always shows when other logic allows (Listen again pattern) |
| `categoryRail` | - | If set: horizontal pill row between header and cards (variant scaffold); pills use CSS classes in §4 Step A |

**More visibility rule (same logic you reuse for the More card in the variant):**

```
alwaysShowMore ? true
  : sourceCount !== undefined ? sourceCount > maxVisible
  : showMore
```

Call sites slice **`children`** to `maxVisible` where relevant (example patterns in `Home.jsx`, `LimitedBrowseTaxonomyRails.jsx`, library rails).

### 1.5 CSS tokens (do not duplicate ad hoc gutters)

- `--space-content-inline` horizontal gutters on header and scroll-inner
- `--card-tile-gap` gap between cards in the row
- Section vertical rhythm: `gap: var(--space-4)` between header block and scroll

---

## 2. Category rail variant (product intent)

**Figma (first swimlane):** [UX-SM-MPR-Mobile-2604, node `19943:107145`](https://www.figma.com/design/duguG08ZOCWXQemLw59XJW/UX-SM-MPR-Mobile-2604?node-id=19943-107145).

**Goal:** One rail shows **two IA levels**: swimlane title, **category pills**, then **preview tiles** for the selected category. Use where reaching playable media would otherwise take multiple drills.

**Visual reference for pills:** Music Channel Info **tag rail** — `MusicChannelInfo.jsx` (`music-info__h-scroll`, `music-info__h-scroll-inner--tags`, `music-info__tag`) + `MusicChannelInfo.css`. That strip uses the same **full bleed scroll + inner padding** idea as `ContentSwimlane`.

---

## 3. UX and behavior decisions (locked for prototype)

1. **Persistence:** Active category is remembered **only while the app stays open** (in-memory). No `sessionStorage` / `localStorage` in this pass.
2. **State:** Prefer **internal state** in `ContentSwimlane` (or a thin wrapper). Allow optional **initial selected id** / light sync hooks later if a parent must seed selection.
3. **More:** In this variant, **remove** the header **More** text button. Append a **More tile** after the last visible **content** card in the card row.
4. **More visibility:** The More tile follows **exactly** the same predicate as the header More button today (section 1.4).
5. **`onMore`:** Same callback as standard swimlane; **no extra arguments** for v1.
6. **Pill scroll alignment:**
   - Run whenever **selection changes**.
   - Run when the user **returns** to this rail if the active pill would be **off-screen** (implementation detail below).
   - **Prefer centering** the active pill in the rail viewport; for **first** / **last** pill use **leading** / **trailing** alignment so you do not show empty space past the ends.

---

## 4. Implementation tutorial (suggested order)

### Step A - CSS: category row between header and cards

**Done (prototype):** `categoryRail` optional slot + classes below.

- Markup: `content-swimlane__categories-scroll` > `content-swimlane__categories-inner`; pills use `content-swimlane__category-pill` and `content-swimlane__category-pill--active`.
- Mirror **`ContentSwimlane`** geometry: outer scrollport `width: 100%`, `overflow-x: auto`, hidden scrollbar, inner flex row with `padding-inline: var(--space-content-inline)` and row **gap `14px`** (matches Music Info tags until Figma asks otherwise).
- Active pill style: filled **`accent`** / **`--color-on-accent`**; inactive outline **`--color-button-secondary-border`**.

### Step B - Props gate

- Introduce optional props only when the variant is enabled (examples; finalize names when coding):
  - `categories`: `{ id: string, label: string }[]`
  - `initialCategoryId?`: optional seed
  - Maybe `categoryRail?: boolean` or derive variant when `categories?.length > 0`.

### Step C - Selection state

- `useState` for `selectedCategoryId`, initialized from `initialCategoryId` or first category id.
- When `categories` or `initialCategoryId` props change in a meaningful way, decide reset vs preserve (document chosen behavior in code comments).

### Step D - Tile strip behavior

- **Content tiles:** Parent can pass **only tiles for the current category** (simplest for prototype): changing category triggers parent re-render with new children; swimlane only manages pills.
  - Alternative: single children callback `renderTiles(categoryId)` inside swimlane (fewer parent rerenders; slightly more complex).
- **More tile:** After mapped visible cards, if More predicate is true, render **`SwimlaneMoreCard`** (new small component) or a styled button with card dimensions matching `ContentTileCard` footprint; `onClick` -> `onMore`.
- Ensure card row **gap** and **tile width** stay consistent with existing rails (`--card-tile-gap`, card components).

### Step E - Scroll active pill into view

- Store refs per pill (or data attributes + `querySelector`).
- On selection change and on **visibility restore**, compute scroll position:
  - **`element.scrollIntoView({ inline: 'center', block: 'nearest' })`** is a first cut; **first** pill may need `inline: 'start'`, **last** `inline: 'end'` (or manual `scrollLeft` math for precise centering vs gutters).
- **`prefers-reduced-motion`:** use `auto` behavior or skip animation when `reduce` is set.
- **Returning user:** When the swimlane mounts again or the route focuses Browse, if the selected pill is clipped, run the same alignment (`useLayoutEffect` on mount + when `selectedCategoryId` changes). If needed, **`IntersectionObserver`** on the active pill can detect clipping after navigation.

### Step F - Accessibility (light prototype bar)

- Pills: consider `role="tablist"` / `role="tab"` / `aria-selected` only if you keep semantics consistent (avoid misleading tabs without panels). Minimum: buttons with clear pressed/selected style.
- More card: `aria-label` including lane title (mirror header More).

### Step G - First consumer

- Wire one swimlane (for example in **`LimitedBrowseTaxonomyRails.jsx`** or a small demo route) with fake multi-category data.
- Update **`docs/figma-nodes.md`** with node `19943:107145` when the screen is finalized.

---

## 5. Verification checklist

- [ ] Category row scrolls horizontally with touch; gutters match `--space-content-inline`.
- [ ] Changing category updates tiles (or mocked tiles) and keeps More rules correct.
- [ ] Header More **hidden** in variant; More card appears **only** when standard More would show.
- [ ] Active pill centers when middle-selected; first/last pills align to edges without awkward overflow padding.
- [ ] Returning to the screen restores pill visibility when it was off-screen.
- [ ] No regression on existing `ContentSwimlane` call sites (variant off by default).

---

## 6. After shipping

- Move-or-append a short lesson to **`docs/react-learning.md`** (category rail + scroll-into-view) when you implement.
- Shorten **`plan.md`** Next steps item once done; add a **What we have done** bullet linking this doc.

Path: **`docs/Plans/ContentSwimlane-category-rail-variant.md`**
