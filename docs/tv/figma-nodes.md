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

## To index (add when implementing)

- Channel Info screen
- More grid (music channels)
- Search & Browse
- Full-screen player
- Collapsed vs expanded primary nav states

---

## MCP usage

From a frame URL: `fileKey` = `DfwtFG53ud7EHhvlPutvI8`; `node-id=15515-41291` becomes node id `15515:41291` for Figma MCP tools.
