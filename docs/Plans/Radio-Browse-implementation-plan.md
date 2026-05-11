# Radio Browse — implementation plan (prototype)

Teaching-oriented companion to **Search & Browse** [Phase 4](Search-Browse-implementation-plan.md#phase-4--radio-browse-full-ia). Covers **radio** top-level tiles, **International** drill-down with the **subregion combo layout** (popular swimlane + geo pills), **Near You** and **format** browses, mock data scope, and Figma / asset workflow.

**Companion docs**

- Story + Integration notes: [`docs/Stories/Search-story.md`](../Stories/Search-story.md)
- Parent plan (Search & Browse): [`Search-Browse-implementation-plan.md`](Search-Browse-implementation-plan.md)
- **Subregion UI walkthrough (implemented pattern):** [`Radio-geo-subregion-swimlane-pills-tutorial.md`](../Tutorials/Radio-geo-subregion-swimlane-pills-tutorial.md)
- Figma index: [`docs/figma-nodes.md`](../figma-nodes.md)

**Prototype scope**

- **Fake data only**. No real geo-IP; “Near You” can be a fixed mock territory.
- **International mock tree (v1):** one complete path only — **North America → Canada → Alberta → cities** (see § Mock data).

---

## Figma reference (what you added)

| Screen | Node | URL |
|--------|------|-----|
| Search & Browse, **radio** | `19868:32686` | [UX-SM-MPR-Mobile-2604](https://www.figma.com/design/duguG08ZOCWXQemLw59XJW/UX-SM-MPR-Mobile-2604?node-id=19868-32686) |
| **Browse Radio International** (continents) | `19676:35051` | [link](https://www.figma.com/design/duguG08ZOCWXQemLw59XJW/UX-SM-MPR-Mobile-2604?node-id=19676-35051) |
| **Browse International Subregion** (swimlane + pills) | `19871:33556` | [link](https://www.figma.com/design/duguG08ZOCWXQemLw59XJW/UX-SM-MPR-Mobile-2604?node-id=19871-33556) |
| **Alberta / cities** drill (layout reference) | `19871:33453` | [link](https://www.figma.com/design/duguG08ZOCWXQemLw59XJW/UX-SM-MPR-Mobile-2604?node-id=19871-33453) |

**Canonical pattern for International (after continent):** The user is on a **geo node** (e.g. North America, or Canada). The screen must show **both**:

1. **Popular in this region** — a **horizontal swimlane** (reuse **`ContentSwimlane`** + **`RadioStationCard`**, same inset + scroll-inner token pattern as Home).
2. **Next level geo** — **pill-shaped** tappable controls for **child** regions (e.g. countries under a continent, provinces under a country, cities under a province). If there are **no children** (leaf), hide the pill row or show an empty state; the swimlane still communicates “what’s popular here.”

This fixes the earlier “International IA gap” where drill-down might have been **only** a grid or **only** a list.

---

## Continent artwork (InCar file) and SVG export

**Source frame:** [SM HTML InCar MPR — continent graphics](https://www.figma.com/design/sMhTukUlNNedadBSyRnOq5/SM-HTML-InCar-MPR?node-id=13515-37235) (`13515:37235`).

**Do you need to extract SVGs manually?** In practice, **yes, for production-quality vectors** — Figma’s **Export** (right sidebar → SVG or PNG @2x per layer/frame) is the reliable path. Select each continent group or component, export as **SVG**, drop files under e.g. `public/radio/continents/` and reference them from **`img src`** or inline if small.

**Automation / AI caveats:** Design-to-code tools and MCP often return **raster previews** or simplified markup; complex illustrations may not export as clean, weight-efficient SVG without a designer pass. For the prototype, **placeholders** (colored blocks, `picsum`, or one generic globe icon) are acceptable until assets are exported.

---

## Information architecture (routes)

Align with existing Search browse patterns (`/search/browse/podcasts/...`, `/search/browse/music/...`).

**Suggested route sketch** (adjust to taste; register **most specific paths first** where needed):

| Step | Example path |
|------|----------------|
| Radio on Search | `/search/radio` (already) |
| Top-level tile | `/search/browse/radio/near-you`, `/search/browse/radio/international`, `/search/browse/radio/format/:formatId` (`news`, `talk`, …) |
| International — continents | `/search/browse/radio/international` |
| International — geo stack | `/search/browse/radio/international/:continentId`, then append segments for **country**, **subdivision**, **city** — e.g. `/search/browse/radio/international/north-america/canada`, `/.../canada/alberta`, `/.../alberta/:citySlug` |

Use **slug constants** and helpers in `src/constants/radioBrowsePaths.js` (mirror `podcastSearchLibrary.js`).

**Screen component suggestion**

- **`SearchRadioBrowse`** — top-level seven tiles; rendered from **`Search.jsx`** when `browseTab === 'radio'` (like **`SearchPodcastsBrowse`**).
- **`SearchRadioInternationalContinents`** — continent grid/tiles; optional continent art from `public/`.
- **`SearchRadioInternationalRegion`** — **one reusable screen** for every **subregion** node: resolves “current node” from URL → loads **popular stations** + **child pills** from mock API.
- *Shipped as* **`SearchRadioInternationalStack.jsx`** (continent list + geo stack in one route tree).

Near You and format browses can be **`SearchRadioStationGrid`** or shared layout: **`ScreenHeader`** back + 2-col grid (**`SwimlaneMore.css`**) if Figma shows a simple full grid; if they use a swimlane + secondary list, reuse the subregion component with an empty pill row.

---

## Mock data (v1 — Canada path only)

**Requirement:** Only implement **real** tree data for:

**International → North America → Canada → Alberta → cities** (e.g. Calgary, Edmonton, Red Deer — use a handful of synthetic city names).

**Implementation notes**

- Add **`src/data/radioInternationalBrowse.js`** (name flexible) exporting:
  - A **tree** or **flat map keyed by path** for nodes: `{ id, label, parentId, type: 'continent'|'country'|'subdivision'|'city', childrenIds[] }`.
  - **`getPopularStationsForGeoNode(nodeId)`** — returns an ordered list (e.g. 6–8 **RadioStation** objects or IDs) for the swimlane.
  - **`getChildGeoNodes(nodeId)`** — drives pills; empty at a **city** leaf (cities might still show a swimlane of “popular in city” with mock stations assigned to that city).

- Map **stations** to this geo tree using extra fields (e.g. `geoScope: { continentId, countryId?, provinceId?, cityId? }`) **or** generate **dedicated mock stations** for this path so you do not break existing **`RADIO_STATIONS`** Home slice. Cleanest for v1: **new small array** `RADIO_GEO_MOCK_STATIONS` used only by International browse + merge into Phase 5 search later if desired.

- **`INTERNATIONAL_CONTINENTS_PLANNED`** in `radioStations.js`: wire **labels** for continent tiles; **non–North America** tiles can navigate to a **“Coming soon”** stub or stay **non-interactive** until data exists — pick one and keep it consistent.

---

## UI build checklist (reuse project patterns)

- **Swimlane:** **`ContentSwimlane`** — title like “Popular in North America” / “Popular in Canada” (dynamic from node); horizontal **`RadioStationCard`** with **`onSelect`**; **`--space-content-inline`** on header and scroll inner per [`docs/react-learning.md`](../react-learning.md).
- **Pills:** New small component e.g. **`GeoBrowsePill`** — flex wrap, rounded-full, touch targets ≥ 44px height, token-based border/fill from **`index.css`**; map Figma from **`19871:33556`** / **`19871:33453`**.
- **Chrome:** Under Search, rely on **`SearchBrowseHeader`** + scroll padding already set on **`search-page-scroll`**; sub-screens may use **`ScreenHeader`** only if you stack a full-screen route **outside** Search (prefer staying under Search for one consistent shell).
- **Station tap:** **`/radio/:stationId`** → **`RadioStationInfo`**; **Play** → **`/radio/:stationId/play`** → **`RadioPlayer`** with **`upsertRadioSession`** in **`PlaybackContext`** (same pattern as other radio entry points).

---

## Acceptance (manual)

- [x] `/search/radio` shows seven top tiles matching **`19868:32686`** order/titles.
- [x] **International → North America** shows **popular swimlane** + pills include **Canada** (other countries optional/disabled per your stub rule).
- [x] **Canada** shows swimlane + **Alberta** pill (and any other mock provinces you add; **v1** can be Alberta-only under Canada).
- [x] **Alberta** shows swimlane + **city** pills; selecting a city shows swimlane + no further geo (or repeats swimlane only).
- [x] **Near You** and **format** paths show station lists sorted by deterministic popularity.
- [x] Back navigation returns correctly through the geo stack.

---

## After you ship

- Update [`plan.md`](plan.md) when scope changes (living repo plan).
- **Search-Browse** plan footer when Search phases materially change.
- **Subregion pattern:** [**react-learning**](../react-learning.md) § *Radio International — swimlane + geo pill row* + tutorial [`Radio-geo-subregion-swimlane-pills-tutorial.md`](../Tutorials/Radio-geo-subregion-swimlane-pills-tutorial.md).

---

*Last updated: 2026-05-08* — acceptance checked; **subregion** tutorial + **react-learning** entry added; **`docs/Plans/`** move reflected in links.
