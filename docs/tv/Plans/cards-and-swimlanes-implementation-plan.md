# TV cards and swimlanes — implementation plan

Phased plan for **D-pad focus**, **square content cards**, and **horizontal swimlanes** in **`apps/tv/`**. This is the first major TV build slice: **music channels only**, **broad catalog Home**, two stacked rails before category-filter rows or podcasts/radio.

**Figma reference:** [Home main — broad catalog](https://www.figma.com/design/DfwtFG53ud7EHhvlPutvI8/SM-HTML-TV-MPR?node-id=15515-41291) (`15515:41291`). Measurements: **`docs/tv/figma-nodes.md`**.

**SMTV03 reference (patterns, not port):** `FixedSwimlane`, `VariableSwimlane`, `KeyboardWrapper`, `GroupFocusNavigationContext`, `ScreenMemoryContext`, `docs/TV_NAVIGATION_PATTERNS.md`.

**Mobile reference (data + IA only):** `apps/mobile/src/data/musicChannels.js`, `Home.jsx` rail titles and catalog helpers.

---

## Product scope for this plan

| In scope now | Deferred |
|--------------|----------|
| Music channel square cards | Podcast / radio cards |
| Two fixed-width swimlanes on Home | Variable-width filter row (limited catalog) |
| Collapsible primary nav + focus memory | User-type layout forks |
| Enter on card → Channel Info **stub** | Full player |
| More tile → More grid **stub** | Search & Browse |
| Shared mock data in `@sm-mpr/shared` | Mini player |
| Territory toggle (wordmark click, broad default) | Ads, Upgrade flows |

### Home rails for Phase 4 (music only)

Mirror mobile broad Home ordering for the **first two music rows**:

1. **Most popular music** — first `9` channels from `MUSIC_CHANNELS` (same source as mobile slice; order OK to match mobile `slice(0, max)` for prototype)
2. **Recommendations** — `getRecommendationsMusicChannels()` capped at `9`

Promo banner, header, and additional rows (podcasts, radio, listen again) are **placeholders or skipped** until Phase 5+.

---

## Focus architecture (target)

Rebuild the SMTV03 two-layer model with less per-screen boilerplate over time.

```
Vertical (Up / Down)     ScreenMemoryContext.focusedGroupIndex
                         + GroupFocusNavigationContext.moveFocusUp/Down
                         + per-group horizontal memory { focusedIndex, offset }

Horizontal (Left / Right) FixedSwimlane or VariableSwimlane focusedIndex
                          parent stores index; swimlane handles parking transform

Activate (Enter / Space)  KeyboardWrapper on DOM-focused tile
                          + global Esc → navigate(-1) when not on root

Primary nav boundary      Left from index 0 in content → expand/focus nav
                          Right from nav → restore content group + last index
```

### Key rules (from SMTV03 lessons)

- **Do not** call `setFocusedGroupIndex` inside swimlane `onFocusChange` during render — only from Up/Down handlers or explicit boundary moves.
- **Do** sync DOM `.focus()` to the visually focused tile (`useEffect` + ref array) so Enter reaches `KeyboardWrapper`.
- **Do not** use roving `tabIndex` or a third-party spatial library.
- Swimlane listens to **Left/Right** on `window` only when `focused={true}` on that row.
- **Disable React StrictMode** if focus effects double-fire.

### Focus groups on Home (Phase 4)

| Index | Group | Notes |
|-------|--------|--------|
| 0 | Primary nav | Collapsed by default when entering from content; expanded while navigating tabs |
| 1 | Home header | Logo (territory easter egg), Upgrade stub — optional in Phase 4 if time-constrained |
| 2 | Swimlane — Most popular music | Default landing group |
| 3 | Swimlane — Recommendations | |

Phase 4 can **skip group 1** (header non-focusable) to reduce scope; document if skipped.

---

## Component map (new files)

```
apps/tv/src/
  components/
    focus/
      KeyboardWrapper.jsx
      FocusableTile.jsx          # shared focus ring + ref forward
    nav/
      PrimaryNav.jsx             # refactor: collapsed/expanded + focus
      PrimaryNav.css
    cards/
      ContentTileCard.jsx        # square 308px + title
      ContentTileCard.css
      MusicChannelCard.jsx
      SwimlaneMoreTile.jsx       # trailing "More" square
    swimlanes/
      FixedSwimlane.jsx          # adapt from SMTV03
      FixedSwimlane.css
      SwimlaneRow.jsx            # title + FixedSwimlane wrapper
      VariableSwimlane.jsx       # Phase 6
    shell/
      TvShell.jsx                # 1920 frame + nav state
      TvViewport.jsx             # optional fixed-size wrapper
  context/
    GroupFocusNavigationContext.jsx
    ScreenMemoryContext.jsx
    TerritoryContext.jsx         # broad default; wordmark click toggles (mouse only)
  constants/
    swimlane.js                  # SWIMLANE_CARD_MAX = 9
  pages/
    Home.jsx
    MusicChannelInfo.jsx         # stub
    SwimlaneMore.jsx             # stub grid — Phase 5
  utils/
    layout.js                    # getSidePadding(), content width helpers

packages/shared/
  package.json                   # export paths
  data/
    musicChannels.js             # moved from mobile
  constants/
    swimlane.js                  # optional shared cap if both apps import
```

---

## Phase 0 — Shared data and TV shell alignment

**Goal:** Both apps read the same catalog; TV frame matches Figma Home structure.

### Tasks

1. **Hoist `musicChannels.js`** (and its `musicBrowseTaxonomy` dependency) to **`packages/shared`**. Update **`apps/mobile`** imports to `@sm-mpr/shared/data/musicChannels`. Export map in `packages/shared/package.json`.
2. **Add `@sm-mpr/shared` dependency** to `apps/mobile` and `apps/tv` package.json files.
3. **TV viewport shell** — fixed **1920 x 1080** outer frame (centered in browser); `overflow: hidden` on body (already partially there).
4. **Retokenize `apps/tv/src/index.css`** toward Figma light theme: `--color-bg: #fafafa`, `--color-on-bkg: #191919`, `--color-accent: #0070e0`, card/spacing tokens from **`figma-nodes.md`**. Keep focus ring visible on light cards (Figma uses **10px dark border** on thumbnail).
5. **`TerritoryContext`** — default **`broad`**; wordmark **onClick** toggles `limited` | `broad` (mouse only, no keyboard focus on wordmark for toggle).
6. **Comment out StrictMode** in `apps/tv/src/main.jsx` if focus QA requires it.
7. Remove or relocate prototype **user-type `<select>`** from Home (defer user types); keep context file for later.

### Acceptance

- [x] Mobile dev server still runs; Home music rails unchanged in behavior.
- [x] TV app imports `MUSIC_CHANNELS` from `@sm-mpr/shared`.
- [x] TV shell renders 1920 x 1080 frame with updated light tokens.

---

## Phase 1 — Focus foundation and collapsible nav

**Goal:** D-pad moves between collapsed nav and a dummy focusable row before real cards exist.

### Tasks

1. **`GroupFocusNavigationContext`** — `moveFocusUp`, `moveFocusDown`, `getGroupFocusMemory`, `setGroupFocusMemory`, `groupCount` registration from screens.
2. **`ScreenMemoryContext`** — per-route `focusedGroupIndex` + opaque fields (for later filter id, grid position).
3. **`KeyboardWrapper`** — forwardRef, `onSelect`, `onUp`, `onDown`; cloneElement child with `onKeyDown`.
4. **Global key map** (small hook or `App` listener): **Esc** → `navigate(-1)` except where overridden; ignore Tab for content focus.
5. **Primary nav refactor**
   - **Collapsed:** narrow icon column (~40–48px); **Expanded:** current ~220px with labels.
   - Nav is **focus group 0**; content starts at group 1+.
   - **Left** from first content focus → collapse nav if needed, focus active tab.
   - **Right** from nav → expand/collapse content, restore **`ScreenMemoryContext`** last content group + horizontal index.
6. Wire **Search** and **My Library** as inert focus targets (prove cross-route memory later).

### Acceptance

- [x] Arrow Up/Down moves between nav and a test button row on Home.
- [x] Left/Right boundary between nav and content restores last index.
- [x] Esc navigates back from a child route.
- [x] No Tab-dependent focus in TV content area.

---

## Phase 2 — Content cards

**Goal:** One reusable square tile with custom focus ring and playing state.

### Tasks

1. **`ContentTileCard`** — 308px image, 16px gap, title (24px regular, single line ellipsis). Props: `title`, `imageUrl`, `focused`, `playing`, `onSelect`.
2. **Focus ring** — component-managed (Figma: **10px** border on thumbnail wrapper when `focused`; not `:focus-visible` on the whole page).
3. **`MusicChannelCard`** — maps `channel` from shared data to `ContentTileCard`.
4. **`FocusableTile`** — optional thin wrapper if `KeyboardWrapper` + ring logic repeats.

### Acceptance

- [x] Card matches Figma proportions within reasonable tolerance.
- [x] Focused card shows ring; unfocused does not.
- [x] `playing` prop adds a distinct visual (e.g. subtle overlay or icon — designer choice in implementation).

---

## Phase 3 — Fixed swimlane

**Goal:** Horizontal parking scroll for fixed-width cards; reusable for all square media types later.

### Tasks

1. **Adapt `FixedSwimlane` from SMTV03** — controlled `focusedIndex`, `onFocusChange`, `focused` boolean, `renderItem`, optional **`showMoreTile`** + **`onMore`**.
2. **Constants** — `SWIMLANE_CARD_MAX = 9`; card width **308px**; gap **30px**; read gap from CSS token.
3. **Parking** — `translateX(-offset)` on inner row; account for content inset (`--tv-content-inline-start` / end from Figma).
4. **`SwimlaneRow`** — inset title (Roboto Black 28px) + `FixedSwimlane` below (20px title-to-row gap).
5. **`SwimlaneMoreTile`** — square More affordance at end of row when `sourceCount > 9`.
6. Hide overflow on viewport; no native horizontal scrollbar.

### Acceptance

- [x] Left/Right moves focus across 9 cards + More; row scrolls to keep focus visible.
- [x] More tile appears when catalog count exceeds 9.
- [x] Component does not change vertical group on horizontal moves alone.

---

## Phase 4 — Home: two music swimlanes (milestone B)

**Goal:** Clickable broad Home with two stacked music rails and Channel Info stub.

### Tasks

1. **Home layout** — optional promo banner placeholder; vertical stack gap 50px; content insets per Figma.
2. **Rail 1 — Most popular music** — `MUSIC_CHANNELS`, cap 9, More → `/more/music`.
3. **Rail 2 — Recommendations** — `getRecommendationsMusicChannels()`, cap 9, More → `/more/recommendations` (or shared music more route).
4. **Vertical navigation** between nav, rail 1, rail 2 (and header if included).
5. **Enter on channel** → **`/music/:channelId`** stub (`MusicChannelInfo.jsx`: title, thumbnail, back via Esc).
6. DOM focus sync `useEffect` on Home (SMTV03 pattern).

### Acceptance

- [x] D-pad: nav ↔ rail 1 ↔ rail 2; horizontal within each rail.
- [x] Enter opens stub info; Esc returns to Home with memory restored.
- [x] Two rails visible matching mobile **titles** and shared data.

---

## Phase 5 — More grid and Channel Info (early SMTV03 parity)

**Goal:** More tile and info screen are navigable stubs, not dead ends.

### Tasks

1. **`SwimlaneMore.jsx`** — 2D grid of music cards (adapt SMTV03 `ChannelGrid` ideas: vertical groups, boundary escape Up/Down). Route e.g. `/more/music`.
2. **Expand `MusicChannelInfo.jsx`** — description, related channels row (static from `relatedChannels`), Play stub button (no player yet).
3. Screen memory for grid `{ row, col }`.

### Acceptance

- [x] More from Home opens grid; Esc back restores Home focus.
- [x] Info stub shows channel fields from shared data.
- [x] Grid D-pad works for at least 3 columns (column count from content width math, document chosen value).

---

## Phase 6 — Variable swimlane and limited catalog (later)

**Goal:** Category / filter pills (SMTV03 `VariableSwimlane`) for **limited** territory Home.

### Tasks

1. **Adapt `VariableSwimlane`** — measured widths, optional `activeIndex` scroll-into-view without stealing focus.
2. **Limited Home** — filter row + channel rail (SMTV03 Home pattern); territory toggle switches layout when `TerritoryContext` is `limited`.
3. Reuse mobile **`LimitedBrowse`** IA as product reference, not layout copy.

Defer until Phases 0–5 are stable.

---

## Phase 7+ — Backlog (not scheduled here)

- Podcast and radio `ContentTileCard` wrappers
- User types, ads, Upgrade header CTA behavior
- Full-screen player, mini player group index
- Search & Browse TV screens
- `docs/tv/Stories/Home-screen-story.md` when product narrative stabilizes

---

## Testing checklist (manual, each phase)

Use keyboard arrows + Enter + Esc in the TV dev server (`npm run dev:tv`).

1. Focus never disappears (always one focused tile or nav item).
2. Horizontal memory per rail survives vertical moves away and back.
3. Nav boundary: Left from card 0 → nav; Right → same card index.
4. Enter on More navigates; Esc returns without losing screen memory.
5. No focus trap in collapsed nav.
6. Territory toggle changes mode on wordmark **click only** (no accidental keyboard toggle).

---

## SMTV03 badges (out of scope)

SMTV03 channel data included **`isPopular`** and **`isNew`** flags rendered by **`@smtv/tv-component-library` `ChannelCard`** as small corner badges ("Popular", "New"). Mobile **`musicChannels.js`** does **not** use those flags. This TV build uses **image + title only** — no badges unless product adds them later to shared data.

---

## React Learning entries (append as you build)

Record in **`docs/tv/react-learning.md`**:

1. Two-context focus model
2. `KeyboardWrapper` + DOM focus sync
3. Transform parking vs touch scroll
4. Collapsible nav + focus memory
5. Controlled swimlane index

---

_Plan authored: 2026-05-27. Update phase checkboxes in this file and **`docs/tv/Plans/plan.md`** as milestones ship._
