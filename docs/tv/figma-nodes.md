# SM HTML TV MPR — Figma node map

Design reference for the **TV** prototype (`apps/tv/`). This file is **not final** — the TV Figma file was interrupted mid-design; add nodes here as screens are implemented.

**File:** [SM HTML TV MPR](https://www.figma.com/design/DfwtFG53ud7EHhvlPutvI8/SM-HTML-TV-MPR?node-id=0-1&p=f&t=Or5GhikkL6tB3Owt-0)

**Viewport target:** 1920 x 1080 (locked for prototype).

**Related mobile / in-car files (product parity, not layout):**

- [UX SM MPR Mobile 2604](https://www.figma.com/design/duguG08ZOCWXQemLw59XJW/UX-SM-MPR-Mobile-2604?node-id=0-1) — mobile counterpart in this monorepo
- [SM HTML InCar MPR](https://www.figma.com/design/sMhTukUlNNedadBSyRnOq5/SM-HTML-InCar-MPR?node-id=0-1) — lean catalog reference

---

## Home (broad catalog)

| Screen | Node | Notes |
|--------|------|--------|
| Home — main content (`homeMain`) | [15515:41291](https://www.figma.com/design/DfwtFG53ud7EHhvlPutvI8/SM-HTML-TV-MPR?node-id=15515-41291) | Promo banner, **Most popular music** swimlane, stacked rows below. Collapsed icon nav on left. Light theme (`#fafafa`). |
| Broad home header | `15752:36012` (child of homeMain) | Logo + Upgrade CTA; blur backdrop |

### Measurements from `15515:41291` (implementation hints)

Use as starting tokens in `apps/tv/src/index.css`; tune during build.

| Element | Value |
|---------|--------|
| Content horizontal inset | `padding-left: 140px`, `padding-right: 100px` (includes collapsed nav gutter) |
| Header horizontal inset | `130px` left, `100px` right |
| Vertical stack gap (banner to rails) | `50px` |
| Swimlane title to card row | `20px` |
| Card thumbnail | `308px` square, `border-radius: 30px` |
| Card image to title | `16px` |
| Card row gap | `30px` |
| Focus ring (focused card) | `10px` solid on-bkg border on thumbnail wrapper |
| Swimlane title typography | Roboto Black 28px |
| Card title typography | Roboto Regular 24px |

---

## Home (limited catalog)

| Screen | Node | Notes |
|--------|------|--------|
| Limited home header (layout A) | [15831:37572](https://www.figma.com/design/DfwtFG53ud7EHhvlPutvI8/SM-HTML-TV-MPR?node-id=15831-37572) | Three-column row: wordmark \| switcher \| Upgrade/provider + info + search. No mini player. |
| Limited home header (layout B) | [15832:37717](https://www.figma.com/design/DfwtFG53ud7EHhvlPutvI8/SM-HTML-TV-MPR?node-id=15832-37717) | Same row + **mini player** in end cluster (limited catalog; no left nav). |
| Limited home body (layout B) | [15834:37844](https://www.figma.com/design/DfwtFG53ud7EHhvlPutvI8/SM-HTML-TV-MPR?node-id=15834-37844) | Stacked taxonomy swimlanes (mobile `LimitedBrowse` parity). |

**Code:** `TvLimitedHomeHeader.jsx` (layout A today). Layout B header + stacked body: see **`docs/tv/Plans/Limited-Home-layout-comparison.md`**.

---

## Full-screen player

| Screen | Node | Notes |
|--------|------|--------|
| Music player | [23:20013](https://www.figma.com/design/DfwtFG53ud7EHhvlPutvI8/SM-HTML-TV-MPR?node-id=23-20013) | Centered column: channel title, info + like, cover 360px, TTA, progress, play/pause + skip. No smart tuner v1. |

### Measurements from `23:20013` (implementation hints)

| Element | Value |
|---------|--------|
| Outer column gap | `50px` |
| Top padding | `100px` |
| Max content width | `1000px` |
| Channel title + actions gap | `10px` |
| Title typography | Roboto Black 34px |
| Meta actions (info, like) | ~60px targets |
| Cover size | `360px`, rounded |
| Cover + track text gap | `30px` |
| Track text lines gap | `5px` |
| Controls block gap | `30px` (progress to transport) |
| Transport row gap | `40px` |
| Progress bar height | `4px` |

---

## Primary nav — mini player

| Item | Node | Notes |
|------|------|--------|
| **menuMiniPlayer** (collapsed / expanded variants) | [15521:27316](https://www.figma.com/design/DfwtFG53ud7EHhvlPutvI8/SM-HTML-TV-MPR?node-id=15521-27316) | Collapsed: 80px square, 60px thumb, gradient fill. Expanded: 100px row, title + artist, no controls. |
| Expanded nav — **mini focused** | [15757:36079](https://www.figma.com/design/DfwtFG53ud7EHhvlPutvI8/SM-HTML-TV-MPR?node-id=15757-36079) | 10px focus ring on mini; menu labels visible. |
| Expanded nav — **menu focused** (mini unfocused) | [15516:26917](https://www.figma.com/design/DfwtFG53ud7EHhvlPutvI8/SM-HTML-TV-MPR?node-id=15516-26917) | Mini shows metadata; Home row has focus ring. |

**Implementation plan:** `docs/tv/Plans/Tv-miniplayer-implementation-plan.md`

### Measurements from `15521:27316` (implementation hints)

| Element | Collapsed | Expanded |
|---------|-----------|----------|
| Outer size | ~80×80 (60 thumb + 10 padding) | height 100px; width = nav panel 250px |
| Outer radius | 10px | 20px |
| Thumbnail | 60×60, radius 4px | same |
| Thumb to text gap | — | 16px |
| Title | — | Roboto Bold 24px, on-accent |
| Artist | — | Roboto Regular 24px, 80% white |
| Focus ring (mini focused) | per nav icon rules | 10px solid on-bkg |
| Controls | none | none |

---

## Search & Browse (broad catalog)

| Screen | Node | Notes |
|--------|------|--------|
| Search & Browse — layout reference | [15822:35859](https://www.figma.com/design/DfwtFG53ud7EHhvlPutvI8/SM-HTML-TV-MPR?node-id=15822-35859) | Fixed header (field + Clear), Music/Podcasts/Radio tabs, stacked vibe rows (Genre pills + sub-tiles, Activity, …). **Not** exhaustive for search-results mode. |

**Implementation plan:** `docs/tv/Plans/Search-Browse-implementation-plan.md`

### Measurements from `15822:35859` (implementation hints)

| Element | Value |
|---------|--------|
| Header padding | `pl 140px`, `pr 100px`, `pt 75px`, `pb 30px`; frosted `bckg90%` + `backdrop-blur 4px` |
| Field + Clear row gap | `20px` |
| Search field height | `80px`, radius `20px`, inner padding `20px`; placeholder Roboto Regular `28px` |
| Clear button | `80px` height, border `2px`, radius `20px`, icon + label Medium `28px` |
| Body top padding (below fixed header) | `pt 230px` on content stack (tune with measured header + gap token) |
| Content-type tabs | `80px` height pills; active fill `--color-accent` / stingray 500 |
| Vibe section gap | `50px` between major blocks |
| Vibe title to pills | `20px` |
| Pill height | `80px`, radius `20px`, gap `10px` |
| Sub-tile (genre card) | `308px` square, radius `30px`, label centered Roboto Regular `34px` |
| Card row gap | `30px` |

---

## Podcasts & episodes

**Implementation plan:** [`docs/tv/Plans/Podcasts-implementation-plan.md`](./Plans/Podcasts-implementation-plan.md)  
**Mobile deep dive (behavior reference):** [`docs/mobile/Tutorials/Podcasts-and-episodes-deep-dive-tutorial.md`](../mobile/Tutorials/Podcasts-and-episodes-deep-dive-tutorial.md)

| Screen / component | Node | Notes |
|--------------------|------|--------|
| **Podcast info** (hero + episode list) | [7551:27042](https://www.figma.com/design/DfwtFG53ud7EHhvlPutvI8/SM-HTML-TV-MPR?node-id=7551-27042) | `PodcastInfo.jsx` — 400px art, subscribe pill, vertical episode rows |
| **Episode list row** | [7545:22722](https://www.figma.com/design/DfwtFG53ud7EHhvlPutvI8/SM-HTML-TV-MPR?node-id=7545-22722) | `TvEpisodeListItem` — body + bookmark + download focus slots |
| **Episode card** (swimlane / grid) | [10841:24500](https://www.figma.com/design/DfwtFG53ud7EHhvlPutvI8/SM-HTML-TV-MPR?node-id=10841-24500) | `TvEpisodeCard` — ~656px wide; library + Continue listening rails |
| **Podcast full player** | [7531:342033](https://www.figma.com/design/DfwtFG53ud7EHhvlPutvI8/SM-HTML-TV-MPR?node-id=7531-342033) | `PodcastPlayer.jsx` — structural parity with music `23:20013` |

### Measurements from `7551:27042` / `7545:22722` (implementation hints)

| Element | Value |
|---------|--------|
| Body inset | `px 100px`, top `110px`, column gap `70px` |
| Hero art | `400×400`, radius `30px` |
| Show title | Roboto Black `34px` |
| Subscribe pill | height `80px`, border `2px`, padding `24px` / `34px` |
| Episode row | max `1240px`, `p 20px`, gap `25px`, radius `30px` |
| Episode thumb | `160×160` area; image `120×120` |
| Row actions | bookmark / download `80×80`, gap `26px` |
| Progress bar | `4px` height when in progress |

### Measurements from `10841:24500` (episode card)

| Element | Value |
|---------|--------|
| Card | `656×308`, `p 30px`, gap `20px`, radius `30px` |
| Thumb | `100×100` top-left |

---

## Listen again (Home compact rail)

No dedicated TV Figma frame — follows mobile compact thumb-only pattern. TV uses **`--tv-card-size-compact` (192px)** on **`TvListenAgainSwimlane`**. Trailing tile: **Clear** when `<= 9` items, **More** when `10+` (same cap as other TV swimlanes). Full grid: `/more/listen-again`.

---

## To index (add when implementing)

- Channel Info screen (indexed elsewhere when expanded)
- Search results mode (TV frame TBD)
- Radio player layouts (TV frames TBD)

---

## MCP usage

From a frame URL: `fileKey` = `DfwtFG53ud7EHhvlPutvI8`; `node-id=15515-41291` becomes node id `15515:41291` for Figma MCP tools.
