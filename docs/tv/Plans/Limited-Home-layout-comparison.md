# Limited Home layout comparison (TV prototype)

One-page plan for stakeholder review of **limited catalog** Home (`catalogScope === limited`). Complements **`docs/tv/Plans/plan.md`** item **TV-2** and mobile **`LimitedBrowse`** / **`LimitedBrowseTaxonomyRails`**.

**Figma file:** [SM HTML TV MPR](https://www.figma.com/design/DfwtFG53ud7EHhvlPutvI8/SM-HTML-TV-MPR?node-id=0-1)

---

## Problem (why compare)

Limited TV Home stacks fixed chrome that SMTV03 did not have:

| Layer | Prototype | Stakeholder priority |
|-------|-----------|----------------------|
| Header | Wordmark, content switcher, Upgrade/provider, search, info | Yes |
| Promo banner | ~308px row (dismissible for demo) | Yes |
| Browse body | **A** or **B** (this doc) | Yes |
| In-feed ad | After 2nd taxonomy swimlane (layout B; parity mobile) | Yes |
| Footer ad | Fixed strip (limited catalog) | Yes |
| Mini player | In **layout B header** (not left nav) | Yes |

**Vertical budget:** On TV, a **filter row + single channel swimlane** (layout **A**) leaves little room above the fold once promo, ads, and mini player are visible. **Stacked taxonomy swimlanes** (layout **B**) match mobile limited browse and trade filter density for scrollable category rows.

**Mini player constraint:** TV cannot rely on a persistent left nav like broad catalog. Layout **A** has few focus groups, so a nav-mounted mini player is easy to reach. Layout **B** has many vertical groups; product mitigates with **header-embedded mini player** (Figma below) plus **Esc → focus mini player** when playback is active.

---

## Options

| | **A — Filter + rail** (current) | **B — Stacked taxonomy** (default) |
|---|--------------------------------|-------------------------------------|
| **Reference** | SMTV03 limited Home | Mobile `LimitedBrowseTaxonomyRails` |
| **Music** | One `GenreFilterSwimlane` + one `MusicChannelSwimlane` | One swimlane per genre (`MUSIC_GENRES`) + More |
| **Podcasts / radio** | Placeholder copy today | Category/format swimlanes (same IA as mobile; ship incrementally) |
| **Figma body** | Implemented (filter pattern) | [15834:37844](https://www.figma.com/design/DfwtFG53ud7EHhvlPutvI8/SM-HTML-TV-MPR?node-id=15834-37844) |
| **Figma header** | [15831:37572](https://www.figma.com/design/DfwtFG53ud7EHhvlPutvI8/SM-HTML-TV-MPR?node-id=15831-37572) (no mini player) | [15832:37717](https://www.figma.com/design/DfwtFG53ud7EHhvlPutvI8/SM-HTML-TV-MPR?node-id=15832-37717) (mini player in header end cluster) |
| **Mini player reach** | Few groups → easy via focus Up/Down | Header mini player always visible; **Esc** jumps focus to mini player when session active |
| **Default in prototype** | Available for comparison | **Yes** |

**Shared shell (both layouts):** limited header (variant per layout), optional promo banner (click/Enter dismiss, session-only), Music \| Podcasts \| Radio switcher, footer ad when `showVisualAds`, fake data from `@sm-mpr/shared`.

---

## Prototype controls (no extra Home chrome)

| Control | Where | Behavior |
|---------|--------|----------|
| **Layout A \| B** | `/settings/user-type` — prototype section at bottom | **Click only**, not in D-pad order (`tabIndex={-1}`). Persist **`sessionStorage`** (reload resets). Optional URL `?limitedHome=filter\|stacked` for shareable links. |
| **Hide promo banner** | Promo row on Home | Click / Enter dismiss; session-only (already shipped). |
| **Catalog broad \| limited** | Wordmark click | Mouse-only easter egg (existing). |
| **User type / content profile** | `/settings/user-type` | Existing tier + music-only toggles. |

Do **not** add a focusable layout switch on Home.

---

## Layout B — product rules (locked for build)

1. **Default** layout mode = **stacked** (`B`).
2. **Content:** Music genre swimlanes first; podcasts and radio taxonomy lanes follow mobile IA (can land in phases).
3. **In-feed ad:** `TvSwimlaneBannerAd` after the **second** taxonomy swimlane on the active tab (mobile `LimitedBrowseMidStackAd` parity).
4. **Header:** Replace limited header with Figma **15832:37717** when layout B is active — mini player in the **right** cluster (with Upgrade/provider, info, search).
5. **Esc shortcut:** When `PlaybackContext` has an active session and layout is **B**, **Escape** moves focus to the **header mini player** (does not replace global Esc-back on drill-down routes; define precedence in implementation).
6. **Music-only profile:** Stacked music lanes only; hide switcher when profile disables podcasts/radio (existing profile rules).

---

## Implementation shape (when coding)

```
LimitedHome.jsx
├── shell: header (A or B variant), promo banner, scrollport + vertical parked focus
├── body A: LimitedHomeFilterBody (filter + single rail)     ← current
└── body B: LimitedHomeStackedBody (taxonomy swimlanes + mid-stack ad)  ← TV-2
```

- Reuse TV swimlanes (`MusicChannelSwimlane`, `ContentTileSwimlane`, `SwimlaneRow`), not mobile `ContentSwimlane`.
- **Option A** remains in repo until stakeholders retire it.
- Layout flag: `limitedHomeLayout` in sessionStorage; read in `LimitedHome` + settings preview.

---

## Stakeholder demo script (~15 min)

1. Confirm **limited catalog** (wordmark toggle if needed).
2. **Layout B (default):** Header with mini player visible after starting playback from a channel.
3. Scroll stacked **music** genres; show **More** on a lane.
4. **Dismiss promo** — show extra vertical room; note footer ad still present.
5. Switch header tabs **Podcasts** / **Radio** (lanes or honest placeholder until shipped).
6. Deep in scroll: press **Esc** → focus lands on **header mini player** → Enter opens full player.
7. Toggle **Layout A** on `/settings/user-type` (prototype section): filter + single rail — compare fold height and mini player reach (nav not used on limited).
8. Toggle user types: **freeProvided** (provider logo), **guest** (Upgrade), **subscribed** — header end cluster stable, switcher centered.

**Questions to close in the room:**

- Is stacked browse acceptable with vertical scroll vs one-at-a-time genre filter?
- Is header mini player + Esc shortcut enough for “always reachable” playback?
- Promo + footer ad + stacked lanes: still enough content visible without dismissing promo?

---

## Decision log (fill after review)

| Date | Attendees | Outcome |
|------|-----------|---------|
| | | Default layout: A / B / both for now |
| | | Mini player: header-only on limited / other |
| | | Esc → mini player: ship / defer |

---

## Related docs

- Mobile IA: `docs/mobile/Home-limited-catalog-and-layout.md`, `LimitedBrowseTaxonomyRails.jsx`
- TV today: `LimitedHome.jsx`, `TvLimitedHomeHeader.jsx`
- Mini player (broad nav): `docs/tv/Plans/Tv-miniplayer-implementation-plan.md`
- Living plan: `docs/tv/Plans/plan.md` — **TV-2**

## Implementation status (2026-06-09)

- **Layout B default** — `limitedHomeLayout` in `sessionStorage`; `?limitedHome=filter|stacked` override.
- **`TvLimitedHomeHeaderStacked`** — Figma `15832:37717`: wordmark + info/search/upgrade (start) | switcher (center) | mini player only (end).
- **`LimitedHomeStackedBody`** — music / podcast / radio taxonomy swimlanes; in-feed ad after 2nd lane.
- **Layout A** — `LimitedHomeFilterBody` (unchanged behavior).
- **Toggle** — `/settings/user-type` prototype section (click only).
- **Esc** — on limited Home layout B with active playback, focuses header mini player (not global back).

*Last updated: 2026-06-09*
