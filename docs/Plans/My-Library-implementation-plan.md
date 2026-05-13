# My Library — implementation plan

Refactor the bottom tab **from Info to My Library**: one hub screen for **App Info** (first swimlane) and **user-driven content** swimlanes. **Product:** `docs/Stories/My-Library-story.md`; **UX:** `docs/UX/My Lybrary - UX Principles.md`.

**Related:** Home **Listen again** remains the **mixed recap** of the same history store — see **§ Single source of truth** and `docs/Plans/plan.md` (Listen again spec).

---

## Decisions (locked)

1. **Tab URL:** primary route **`/my-library`** (not `/library`). Sub-routes under the same prefix where it helps, e.g. **`/my-library/account-settings`**, **`/my-library/history/music`**, etc.
2. **Legacy `/info` root:** **`Navigate`** to **`/my-library`** so old bookmarks still work.
3. **Support stack URLs unchanged:** **`/info/contact`**, **`/info/about`** (same destinations as today's **`InfoHelpSection`** rows).
4. **App Info swimlane** is the **first** horizontal row: **gear** + title (**App Info** or Figma string). Four tiles: **Account and settings**, **FAQ**, **Contact us**, **About** — same behaviors as the former **Info** collapsible’s help rows and account/settings blocks.
5. **Account and settings** tile → drill-in screen reusing **`InfoAccountSection`** + **`InfoSettingsSection`** with **both sections expanded** on first paint (unlike old **`/info`** default of account-only open).
6. **History swimlanes** (Music, Podcasts, Radio): **always visible**; **empty** state uses **ghost** placeholders; **More** is **always shown** (same intent as Home **Listen again** `alwaysShowMore`).
7. **All other** user-driven swimlanes: **standard `ContentSwimlane` rules** — row **omitted when empty**; **More** only when **`sourceCount > SWIMLANE_CARD_MAX`** (Search-style), unless product adds an explicit exception later.
8. **Single history list (source of truth):** one ordered store in **`ListenHistoryProvider`** (extend with **`radio`** when wiring radio listens). **Home — Listen again:** use the **full list**, **unfiltered by type**, mixed recap (current product direction). **My Library:** **three** rails each **`filter` by `kind`** (`music` | `podcast` | `radio`). **No duplicate stores** for the same listen events.
9. **Scoped clear on Library “More” screens:** each modality’s full grid offers **Clear** for **that `kind` only**; **does not** remove other kinds. **Home — Listen again — More** keeps **Clear all** (wipes entire list) unless product later splits that screen.

---

## Figma references

| Area | Node | URL |
|------|------|-----|
| My Library (frame) | `19921:55371` | [myLibrary](https://www.figma.com/design/duguG08ZOCWXQemLw59XJW/UX-SM-MPR-Mobile-2604?node-id=19921-55371) |
| Body / full swimlane stack | `19921:55373` | [body](https://www.figma.com/design/duguG08ZOCWXQemLw59XJW/UX-SM-MPR-Mobile-2604?node-id=19921-55373) |

Add or confirm entries in **`docs/figma-nodes.md`** when implementation starts.

---

## Single source of truth — listen history

**Goal:** One append-only / bump-on-repeat list with a **global order** (most recent first after bump). **Consumers:**

| Surface | Data |
|---------|------|
| **Home — Listen again** | `items` (all kinds, same order) |
| **My Library — Music history** | `items.filter(kind === 'music')` |
| **My Library — Podcast history** | `items.filter(kind === 'podcast')` |
| **My Library — Radio history** | `items.filter(kind === 'radio')` |

**API shape (conceptual):**

- Keep **`items: ListenHistoryItem[]`** with **`kind`** discriminant.
- Add **`kind: 'radio'`** and **`recordRadioStationListen(stationId)`** when radio playback should count (mirror music/podcast **counted listen** rules).
- Add **clear helpers:** e.g. **`clearHistoryByKind(kind)`** for Library More screens; keep **`clearListenHistory()`** for **Listen again** “Clear all” (or implement “all” as clearing every kind in one call).

**Ordering:** Home rail and each Library rail slice preserve **relative order** from the master list (filter is stable).

---

## Routing and `BottomNav`

| Route | Screen |
|-------|--------|
| `/my-library` | My Library hub |
| `/my-library/account-settings` | Account + Settings (both expanded) |
| `/my-library/history/music` | Music history grid + scoped Clear |
| `/my-library/history/podcasts` | Podcast history grid + scoped Clear |
| `/my-library/history/radio` | Radio history grid + scoped Clear |
| `/info` | **Redirect** → `/my-library` |
| `/info/contact` | **`InfoContact`** (unchanged) |
| `/info/about` | **`InfoAbout`** (unchanged) |

**`BottomNav`:**

- Third tab: **`to: "/my-library"`**, label **My Library**; tab icon **`public/my-library.svg`** (mask in **`BottomNav.css`**). **App Info** swimlane on the hub keeps the **gear** asset (**`infoGear.svg`**) per story.
- **Stack active:** tab highlighted for **`pathname.startsWith("/my-library")`** and optionally **`pathname.startsWith("/info")`** for contact/about **if** UX wants the Library tab lit on those stacks (mirror Search + `/radio` pattern).

---

## Page structure — `/my-library`

- Reuse **Home-style** shell: **`main.app-shell`**, vertical stack, **`--space-screen-gap`** between swimlanes.
- **Swimlane layout pattern:** inset header + full-bleed horizontal scroll + inner **`padding-inline: var(--space-content-inline)`**; hide horizontal scrollbar (`ContentSwimlane.css` pattern).
- **Order (from story + Figma `body`):**
  1. **App Info** (custom rail — **`tagCards`** scale in Figma)
  2. **Music history** (`alwaysShowMore`, always shown, ghosts when empty)
  3. **Your music channels** (likes — stub state if missing; conditional + standard More)
  4. **Podcasts:** history → subscribed → Continue listening → Your episodes → New episodes → Downloaded episodes — each conditional except **podcast history** (always shown, `alwaysShowMore`, ghosts)
  5. **Radio:** history → stations — history always shown + ghosts; stations conditional + standard More

Tune exact labels against Figma **`rowCategory`** instances.

---

## Phase 1 — Tab, redirect, empty hub

**Status: shipped** in codebase (2026-05-13).

- Add **`MyLibrary.jsx`** scaffold (title / inset optional per Figma).
- Register **`/my-library`**; **`/info`** → **`Navigate`** to **`/my-library`**.
- Update **`BottomNav`** label + `to` + active logic.
- Remove or stop using **`Info.jsx`** three-section layout as the tab root (components stay; screen splits per above). **`Info.jsx`** remains in **`src/pages/`** for Phase 2 reference until account-settings route replaces duplication.

---

## Phase 2 — App Info swimlane + account drill-in

**Status: shipped** in codebase (2026-05-13).

- **Component:** e.g. **`AppInfoSwimlane`** — gear + title row; horizontal scroll of **four** tiles.
- **Account and settings** → **`/my-library/account-settings`** with **`InfoCollapsibleSection`** x2 **or** equivalent, **`useState`** both **`expanded: true`** on mount.
- **FAQ:** **`INFO_FAQ_HREF`** (`InfoHelpSection` rules for external link).
- **Contact us / About:** **`Link`** to **`/info/contact`**, **`/info/about`**.
- Optionally extract shared row constants from **`InfoHelpSection`** to avoid duplication (small refactor).

**Shipped:** **`src/components/AppInfoSwimlane.jsx`** + **`.css`**; **`pages/MyLibraryAccountSettings.jsx`**; **`infoHelpLinks.js`** exports paths + **`externalFaqAnchorProps`** reused by **`InfoHelpSection`**.

---

## Phase 3 — History context + radio

- Extend **`ListenHistoryContext`** with **`radio`** items and **`recordRadioStationListen`** (call site: **`RadioPlayer`** when parity with music/podcast **counted listen** rules is defined).
- Add **`clearHistoryByKind(kind)`** (and keep **`clearListenHistory`** as full wipe for **Listen again**).
- Confirm **Home** still uses **`items`** unchanged (mixed recap).

---

## Phase 4 — My Library history rails + More grids

- Three **`ContentSwimlane`** sections: derive **`filteredItems`** per kind; **ghost** fillers to **`LISTEN_AGAIN_RAIL_SLOT_CAP`** (or aligned cap constant) like Home **Listen again**; **`alwaysShowMore`** + **`onMore`** → corresponding **`/my-library/history/...`** route.
- **`ScreenHeader`** + **`SwimlaneMore`-style** grids (reuse **`MusicChannelCard`**, **`PodcastCard`**, **`RadioStationCard`**, **`ListenAgainCard`** / **`renderListenAgainTile`** as appropriate).
- Header **Clear** calls **`clearHistoryByKind`** for that rail only.

---

## Phase 5 — Conditional user rails

- **Music likes:** stub context or reuse future Favorites store; render **Your music channels** when non-empty.
- **Podcasts:** wire **`PodcastUserStateContext`** (subscribe, bookmark, downloads, progress) into **Continue listening**, **Your episodes**, **New episodes**, **Downloaded episodes** per story; standard More rules.
- **Radio stations:** stub **liked stations** if not present.

---

## Phase 6 — Polish

- Tokens / card sizes for **App Info** **`tagCards`** vs content cards.
- **`docs/figma-nodes.md`**, **`docs/UX/My Lybrary - UX Principles.md`** (§7: exception for **always-on history** rails), **`docs/Plans/plan.md`** cross-links.
- **`docs/react-learning.md`** append if new patterns merit a short note.

---

## Verification checklist

- [x] **`/my-library`** loads hub; **`/info`** redirects.
- [x] Bottom tab reads **My Library** and highlights on hub + configured **`/info/*`** stacks.
- [x] App Info tiles navigate correctly (FAQ external, Contact/About stacks, Account settings drill-in **both expanded**).
- [ ] Listening updates **Listen again** and **filtered** Library rails from **same** **`items`** array (Phase 4+).
- [ ] History rails show **ghosts** when empty + **More** always; scoped **Clear** on More screens.
- [ ] Non-history rails hidden when empty; **More** only when over card max.

---

*Created: 2026-05-13.* Plan refines prior chat IA; URLs and history model finalized per stakeholder direction (**`my-library`**, single unfiltered recap on Home, filtered rails in My Library).
