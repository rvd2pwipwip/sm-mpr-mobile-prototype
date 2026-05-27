# Radio International — subregion screen (swimlane + geo pills)

Step-by-step for the **Browse Radio → International** drill-down **after** the user picks a continent: one screen pattern that repeats for **country**, **province**, and **city** nodes.

**Companion docs**

- Phased build checklist + Figma table: [`../Plans/Radio-Browse-implementation-plan.md`](../Plans/Radio-Browse-implementation-plan.md)
- Search shell context: [`../Plans/Search-Browse-implementation-plan.md`](../Plans/Search-Browse-implementation-plan.md) § Phase 4
- Swimlane tokens + layout: [`../react-learning.md`](../react-learning.md) (*Swimlane layout pattern* / *ContentSwimlane*)

---

## What the UX is

On each **non-leaf** geo node (e.g. North America, Canada, Alberta), the user should see:

1. **Popular in this region** — a **horizontal swimlane** of **`RadioStationCard`** rows (reuse **`ContentSwimlane`**, same inset / scroll-inner gutter pattern as Home).
2. **Explore _Region_** — a **wrapping row of pill buttons** (**`GeoBrowsePill`**) for **child** regions (countries, provinces, cities).

On a **leaf** node (e.g. a city with no further geo children), the prototype **drops the swimlane chrome** and shows a **simple 2-column grid** of the same cards so the screen does not feel empty when there are no pills.

**Figma**

- Subregion combo: [`19871:33556`](https://www.figma.com/design/duguG08ZOCWXQemLw59XJW/UX-SM-MPR-Mobile-2604?node-id=19871-33556)
- Alberta / cities reference: [`19871:33453`](https://www.figma.com/design/duguG08ZOCWXQemLw59XJW/UX-SM-MPR-Mobile-2604?node-id=19871-33453)

---

## Where it lives in code

| Piece | Path |
|-------|------|
| Route + UI | `src/pages/SearchRadioInternationalStack.jsx` |
| Vertical spacing between swimlane / grid and pill block | `src/pages/SearchRadioInternational.css` (`.search-radio-intl__scroll` uses **`flex-direction: column`** + **`gap: var(--space-screen-gap)`**) |
| Swimlane | `src/components/ContentSwimlane.jsx` |
| Pills | `src/components/GeoBrowsePill.jsx` + `GeoBrowsePill.css` |
| Mock tree + helpers | `src/data/radioInternationalBrowse.js` — **`resolveGeoNodeFromSegments`**, **`getPopularStationsForGeoNode`**, **`getChildGeoNodes`** |
| URL helpers | `src/constants/radioBrowsePaths.js` — **`radioInternationalPath`**, **`radioGeoMorePath`** |
| Continent list (first screen) | `INTERNATIONAL_CONTINENTS_PLANNED` in `src/data/radioStations.js` |

**Router:** `App.jsx` registers **`/search/browse/radio/international/*`** on this component. **Station tap** goes to **`/radio/:stationId`** (**`RadioStationInfo`**); **Play** continues to **`/radio/:stationId/play`** (**`RadioPlayer`**) like other radio entry points.

---

## How URL segments become a screen

1. **Base path:** `/search/browse/radio/international`.
2. **Suffix:** everything after that, split on **`/`** → **`segments`** (e.g. `['north-america','canada','alberta']`).
3. **`resolveGeoNodeFromSegments(segments)`** returns either **`{ node }`** or **`{ invalid: true }`**. Invalid navigates back to **Search Radio** browse with **`<Navigate replace />`**.
4. For each valid node, **`getPopularStationsForGeoNode(node.id)`** feeds the swimlane or leaf grid; **`getChildGeoNodes(node)`** drives the pill list (empty at a leaf → pills hidden).

**Back:** **`ScreenHeader`** uses **`navigate(-1)`** so the stack feels like nested drill-down.

---

## Layout details worth copying elsewhere

- **Do not** rely on ad hoc **`margin-bottom`** between the swimlane and the pill block. The scroll container **`.search-radio-intl__scroll`** is a column flex parent with **`gap: var(--space-screen-gap)`** so sections stay evenly spaced when one block is missing (e.g. no popular stations → empty message only + pills).
- **Pill block** uses **`content-swimlane__title`** for the **Explore** heading so typography aligns with swimlane titles elsewhere.
- **Leaf vs branch:** if **`children.length === 0`** and there are popular stations, render a **`ul.swimlane-more__grid`** of **`RadioStationCard`** instead of **`ContentSwimlane`** (full grid, no “More” affordance).

---

## Click-through (prototype)

**Search** → **Browse / Radio** → **International** → **North America** → **Canada** → **Alberta** → a **city** — at each step you should see **Popular…** (swimlane or leaf grid) and **Explore…** pills until the leaf screen.

---

*Last updated: 2026-05-07*
