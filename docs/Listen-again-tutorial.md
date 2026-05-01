# Tutorial: Listen again — how the pieces link together

This document explains **Listen again** end to end: where history **lives**, what **writes** it, what **reads** it, and how **routing**, **preroll**, and **UI variants** stay aligned. It follows the style of `[MiniPlayer-component-tutorial.md](MiniPlayer-component-tutorial.md)` (numbered sections, tables, mental model).

**Primary code:**


| Area              | Files                                                                                                                                                        |
| ----------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| State             | `[src/context/ListenHistoryContext.jsx](../src/context/ListenHistoryContext.jsx)`                                                                            |
| Constants         | `[src/constants/listenHistory.js](../src/constants/listenHistory.js)`                                                                                        |
| Write path        | `[src/pages/MusicPlayer.jsx](../src/pages/MusicPlayer.jsx)`                                                                                                  |
| Home rail         | `[src/pages/Home.jsx](../src/pages/Home.jsx)`                                                                                                                |
| Cards / mapping   | `[src/components/ListenAgainCard.jsx](../src/components/ListenAgainCard.jsx)`, `[src/components/ContentTileCard.jsx](../src/components/ContentTileCard.jsx)` |
| Full list + Clear | `[src/pages/ListenAgainMore.jsx](../src/pages/ListenAgainMore.jsx)`, `[src/pages/ListenAgainMore.css](../src/pages/ListenAgainMore.css)`                     |
| Shell + routes    | `[src/App.jsx](../src/App.jsx)`                                                                                                                              |


**Prerequisites:**

- `[PlaybackContext-tutorial.md](PlaybackContext-tutorial.md)` — `**session`**, `**upsertMusicSession**`, and how `**MusicPlayer**` keeps the mini bar in sync (**different concern** from Listen history, but the **same screen** touches both).
- `[MiniPlayer-component-tutorial.md](MiniPlayer-component-tutorial.md)` — optional; useful for **expand-from-mini** preroll skip (`**location.state`**) so you see why history still records once the gate is open.

**Product / spec:** `[Home-screen-story.md](Home-screen-story.md)`, `[plan.md](plan.md)` → § *Listen again*.

**Figma:** Home rail `[1:2](https://www.figma.com/design/duguG08ZOCWXQemLw59XJW/UX-SM-MPR-Mobile-2604?node-id=1-2)`; More + Clear `[19801:39250](https://www.figma.com/design/duguG08ZOCWXQemLw59XJW/UX-SM-MPR-Mobile-2604?node-id=19801-39250)` — also `[figma-nodes.md](figma-nodes.md)`.

---

## 1. Big picture: one source of truth, many readers

```
┌─────────────────────────────────────────────────────────────────┐
│  ListenHistoryProvider (items[])  ← in-memory, starts []        │
└───────────────┬─────────────────────────────────────────────────┘
                │
     write      │  recordMusicChannelListen(channelId)
        ┌───────┴───────┐
        │  MusicPlayer  │  only when “playback allowed” (§4)
        └───────┬───────┘
                │
     read       ├──────────────────────┐
        ┌───────▼────────┐    ┌────────▼────────────┐
        │  Home.jsx      │    │  ListenAgainMore    │
        │  rail + ghosts │    │  grid + Clear       │
        └───────┬────────┘    └─────────────────────┘
                │
                └── ListenAgainCard / renderListenAgainTile
                           → MusicChannelCard (catalog lookup)
```

**Listen history is not** stored in `**PlaybackContext`**. Playback answers “what is playing **now**?”; Listen history answers “what did the user **recently open** in a way that counts as listening for this prototype?” Keeping them separate avoids coupling **pause/play** toggles to history (**history does not update on every pause** — §4).

---

## 2. Provider placement in `App.jsx`

In `[App.jsx](../src/App.jsx)`, `**ListenHistoryProvider`** wraps `**PlaybackProvider**`, and both wrap `**AppRoutes**`:

```jsx
<ListenHistoryProvider>
  <PlaybackProvider>
    <AppRoutes />
  </PlaybackProvider>
</ListenHistoryProvider>
```

**Why this order?** `**MusicPlayer`** (inside routes) calls `**useListenHistory()**` and `**usePlayback()**`. Both providers must be **ancestors** of `**Routes`**; order between the two does **not** matter for correctness, but `**ListenHistory` outside `Playback`** matches the idea “session is inner app loop, history is a cross-cutting list.”

**Sibling providers** above this stack (`**UserTypeProvider`**, guest skip, preroll grace) affect **gates** on `**MusicPlayer`** (preroll, ads) — not the history API shape.

---

## 3. `ListenHistoryContext.jsx` — state, bump, cap

**State:** `items` is an array of `**{ kind: 'music', id: string }`** (ids are **channel slugs** matching `[musicChannels.js](../src/data/musicChannels.js)`). **Podcast/radio** kinds can be added later without changing Home/More structure.

`**recordMusicChannelListen(channelId)`:**

- `**bumpItem`**: remove any existing row with the same `**kind` + `id**`, then **prepend** the new row — “most recent first,” **no duplicate entries**.
- `**slice(0, LISTEN_HISTORY_MAX_STORED)`** — cap **50** (`[listenHistory.js](../src/constants/listenHistory.js)`).

`**clearListenHistory()`:** sets `**items`** to `**[]**`. Used only from `**ListenAgainMore**` (Clear button).

`**useListenHistory()`:** throws if used outside the provider — same pattern as `**usePlayback()`**.

---

## 4. The write path: `MusicPlayer.jsx` + preroll gate

History is written in a `**useEffect**` separate from the effect that calls `**upsertMusicSession**`:

```js
useEffect(() => {
  if (!channel) return;
  if (needsPreroll && !prerollComplete) return;
  recordMusicChannelListen(channel.id);
}, [channel?.id, needsPreroll, prerollComplete, recordMusicChannelListen]);
```

**Dependencies deliberately exclude `playing`.** Pausing does **not** re-record; only **channel**, **preroll requirement**, or **preroll completion** does.

**Gate mirrors playback:**


| Situation                                      | `needsPreroll && !prerollComplete` | History recorded?                             |
| ---------------------------------------------- | ---------------------------------- | --------------------------------------------- |
| Guest, ad not finished                         | `true`                             | **No** — user has not “started listening” yet |
| Guest, ad completed                            | `false`                            | **Yes**                                       |
| Non-guest OR expand-from-mini OR preroll grace | `false` from the start             | **Yes** when effect runs                      |


So **Listen again** stays aligned with **when `upsertMusicSession` is allowed** in the companion effect — same **early return** — without being *inside* `**PlaybackContext`**.

**Navigate to channel info only** (`/music/:id`) does **not** mount `**MusicPlayer`**; no history line until they hit **play** and this effect runs.

---

## 5. Constants: rail illusion vs storage

`[listenHistory.js](../src/constants/listenHistory.js)` defines two numbers:


| Constant                         | Value  | Role                                                                                                           |
| -------------------------------- | ------ | -------------------------------------------------------------------------------------------------------------- |
| `**LISTEN_AGAIN_RAIL_SLOT_CAP`** | **12** | Max **combined** real + **ghost** tiles on **Home** horizontal rail (visual “full row” when history is short). |
| `**LISTEN_HISTORY_MAX_STORED`**  | **50** | Max rows kept in memory for **More** grid and long rail scroll.                                                |


If `**listenAgainItems.length >= 12`**, **Home** adds **no ghosts** — user scrolls the real cards only.

---

## 6. Home rail: `Home.jsx` + `ContentSwimlane`

1. `**useListenHistory()`** → `**listenAgainItems**`.
2. `**listenGhostCount**` = `**max(0, 12 - length)**` unless length ≥ 12, then **0**.
3. **Conditional render:** if `**length === 0`**, **no swimlane** (Listen again hidden entirely).
4. `**ContentSwimlane`** — same inset title + More + horizontal scroll as other lanes (`[ContentSwimlane.jsx](../src/components/ContentSwimlane.jsx)`).
5. **Children:**
  - `**ListenAgainCard`** per item with `**compact**` → small **no-label** tile (§7).
  - `**ContentTileCard`** with `**ghost**` + `**compact**` for fillers — non-interactive, muted square.

**Favorites placeholder:** a comment above this block reserves vertical order for a future **Favorites** lane **above** Listen again (`[Home-screen-story.md](Home-screen-story.md)`).

**More:** `**navigate('/more/listen-again')`** — must match a **Route** in `**App.jsx`** (**§9**).

---

## 7. `ListenAgainCard.jsx` — history row → domain card

`**renderListenAgainTile(item, navigate, compact)`** is the single place that maps `**kind**` to UI today:

- `**music`:** `**getMusicChannelById(item.id)`**; if missing (stale id), returns `**null**`.
- Renders `**MusicChannelCard**` with `**onSelect**` → `**navigate(`/music/${id}`)**` (channel **info**, not auto-play — same as browsing).

**Default export** `**ListenAgainCard`** calls `**renderListenAgainTile**` for JSX ergonomics on **Home**.

**Why a function + component?** `**ListenAgainMore`** calls `**renderListenAgainTile**` so it can **drop `null`** and avoid empty `**<li>**` cells without a wrapper component.

---

## 8. `ContentTileCard` — `compact` + `ghost`

`[ContentTileCard.jsx](../src/components/ContentTileCard.jsx)` + `[ContentTileCard.css](../src/components/ContentTileCard.css)`:

- `**compact**` — width `**var(--card-tile-width-compact)**` (`[index.css](../src/index.css)`); **labels hidden**.
- `**ghost`** — empty **media** square, lowered opacity, `**pointer-events: none`**, `**aria-hidden**`.

**Domain cards** pass `**compact`** through (`**MusicChannelCard**`, etc.).

---

## 9. Routing: `ListenAgainMore` and tab highlight

In `[App.jsx](../src/App.jsx)`:

```jsx
<Route path="/more/listen-again" element={<ListenAgainMore />} />
<Route path="/more/:categoryId" element={<SwimlaneMore />} />
```

**Order matters:** if `**listen-again`** were only a `**:categoryId**`, you could wire it in `**SwimlaneMore**`, but this screen needs a **custom header** (**Clear**). A dedicated route keeps `**SwimlaneMore`** unchanged.

`**BottomNav`:** existing logic treats `**location.pathname.startsWith('/more')`** as **Home stack** active — `**/more/listen-again`** gets the Home tab highlight without extra code.

---

## 10. `ListenAgainMore.jsx` — grid, Clear, empty state

- **Layout:** reuses `**SwimlaneMore.css`** grid (`[SwimlaneMore.jsx](../src/pages/SwimlaneMore.jsx)` pattern — import the CSS, same `**swimlane-more__***` classes).
- `**ScreenHeader`:** **Back** + title **Listen again** + `**endSlot`** text button `**screen-header__text-btn**`: **Clear**.
- **Clear:** `**clearListenHistory()`** then `**navigate(-1)**` — user lands where they came from with an empty list; **Home** hides the swimlane.
- **Empty list:** short message in `**ListenAgainMore.css`** (`listen-again-more__empty`) — edge case if someone bookmarks the URL with no history.

**Tiles:** `**renderListenAgainTile(..., false)`** — **full-size** cards with labels in the grid ( `**compact` false** ).

---

## 11. Persistence and prototype limits

- **In-memory only** — refresh clears history (documented in `[plan.md](plan.md)`).
- **Music only** for writes until podcast/radio stacks call `**record*`** (or a generalized `**recordListen**`).

---

## 12. Mental model checklist

1. **Single writer** for music today: `**MusicPlayer`** → `**recordMusicChannelListen**`, gated like **post-preroll** playback.
2. **Readers:** **Home** (rail + ghosts), **ListenAgainMore** (grid + Clear). Both use `**useListenHistory()`**; same array, same rerenders.
3. **Dedupe by id** — re-playing a channel moves it to the **front**, not a second tile.
4. **Ghosts** are pure CSS/presentational — not in `**items`**.
5. **Playback vs history** — `**PlaybackContext`** does not import `**ListenHistory**`; keep write side-effects in `**MusicPlayer**` (or future player entry points) so rules stay explicit.
6. **Route specificity** — `/more/listen-again` before `/more/:categoryId`.

---

## 13. Suggested exercises

1. **Console trace:** In `**ListenHistoryContext`**, temporarily `**console.log**` inside `**recordMusicChannelListen**`. Play a channel as **guest**: confirm **no** log during preroll, **one** log after complete.
2. **Dedupe:** Play channel A, then B, then A again — **Home** order should be **A, B**.
3. **Ghosts:** With one history item, count **11** ghost divs in DevTools; add 12+ distinct listens (or duplicate bumps) so ghosts disappear.
4. **Clear:** Open **More**, **Clear** — confirm `**items`** empty and **Home** has no Listen again block.
5. **Stale id:** Temporarily `**recordMusicChannelListen('bogus-id')`** from devtools state hack — `**ListenAgainCard**` returns `**null**`; observe compact **list** behavior (gap vs filtered — we render **null** for card, key still on item).

---

## 14. Related tutorials and docs


| Doc                                                                                                                          |
| ---------------------------------------------------------------------------------------------------------------------------- |
| `[PlaybackContext-tutorial.md](PlaybackContext-tutorial.md)`                                                                 |
| `[MiniPlayer-component-tutorial.md](MiniPlayer-component-tutorial.md)`                                                       |
| `[react-learning.md](react-learning.md)` → § *Listen again — `ListenHistoryProvider` + compact tiles*                        |
| `[Guest-preroll-grace-tutorial.md](Guest-preroll-grace-tutorial.md)` — preroll skip paths affecting **when** history records |
| `[plan.md](plan.md)` — shipped spec and follow-ups (Favorites slot, podcast/radio)                                           |


---

*Last aligned with prototype sources in-repo; adjust line references if files shift.*