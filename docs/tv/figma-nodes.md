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

## To index (add when implementing)

- Channel Info screen
- More grid (music channels)
- Search & Browse

---

## MCP usage

From a frame URL: `fileKey` = `DfwtFG53ud7EHhvlPutvI8`; `node-id=15515-41291` becomes node id `15515:41291` for Figma MCP tools.
