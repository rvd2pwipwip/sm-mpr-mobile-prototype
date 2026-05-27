# Mini player — learning plan (SM MPR prototype)

This is a **study order** for the first mini player iteration. It matches the “What was added” summary from implementation and mirrors the idea of [`Player-tutorial.md`](../../karaoke-mobile-prototype/docs/Player-tutorial.md) in the karaoke repo: **one focused tutorial per major slice**, so you can build understanding without reading the whole codebase at once.

**Prerequisites:** Comfortable with JSX, **`useState`**, and React Router basics (**`Route`**, **`useNavigate`**, **`useParams`**). Work through items in order unless a row says “optional” or “reference only.”

---

## Phase 1 — Foundation (start here)

| Order | Topic | Document | What you will understand |
|------:|--------|----------|--------------------------|
| 1 | **Playback state + Context API** | [`PlaybackContext-tutorial.md`](Tutorials/PlaybackContext-tutorial.md) | **`createContext`**, **`Provider`**, **`useContext`**, **`useState`**, **`useLocation`**, **`useEffect`** (CSS var), **`useCallback`**, **`useMemo`**, **`usePlayback()`** guard pattern |
| 2 | **Where the provider and mini UI mount** | [`App-miniplayer-wiring-tutorial.md`](Tutorials/App-miniplayer-wiring-tutorial.md) | **`PlaybackProvider`** placement vs **`BrowserRouter`**, why **`MiniPlayer`** is a **sibling** of **`Routes`**, order with **`BottomNav`**, same **hide** rule as full-screen player |

**Checkpoint:** You can explain why **`useLocation`** must run **inside** the router and why the mini bar is hidden on **`/music/:id/play`**.

---

## Phase 2 — UI and layout

| Order | Topic | Document | What you will understand |
|------:|--------|----------|--------------------------|
| 3 | **`MiniPlayer` component** | [`MiniPlayer-component-tutorial.md`](Tutorials/MiniPlayer-component-tutorial.md) | Variant / **`data-variant`**, flex layout (thumb + text + controls), **`useNavigate`**, **`stopPropagation`**, inverse tokens + **`MiniPlayer.css`**, podcast two-line title |
| 4 | **Global CSS: tokens + scroll padding** | [`MiniPlayer-layout-tokens-tutorial.md`](Tutorials/MiniPlayer-layout-tokens-tutorial.md) | **`--mini-player-height`**, **`--mini-player-offset`** ( **`index.css`** + **`<html>`** ), **`--miniplayer-*`**, **`.app-shell`** vs **`home-body-scroll`**, **`--z-mini-player`** vs **`--z-chrome`** |

**Checkpoint:** You can trace **`--mini-player-offset`** from **`PlaybackContext`** → **`<html>`** → **`.app-shell`** / **`.home-body-scroll`** padding — see **[`MiniPlayer-layout-tokens-tutorial.md`](Tutorials/MiniPlayer-layout-tokens-tutorial.md)**.

---

## Phase 3 — Sync with full-screen music player

| Order | Topic | Document | What you will understand |
|------:|--------|----------|--------------------------|
| 5 | **`MusicPlayer` + context** | *Upcoming:* `MusicPlayer-playback-sync-tutorial.md` | **`upsertMusicSession`** timing (preroll gate), **`useLayoutEffect`** vs **`useEffect`** for hydrating **`playing`** from **`session`**, avoiding feedback loops |

**Checkpoint:** You can describe why **`useLayoutEffect`** dependencies were kept **narrow** and how pause state stays consistent between mini and full player.

---

## Phase 4 — Prototype-only extras (optional)

| Order | Topic | Document | What you will understand |
|------:|--------|----------|--------------------------|
| 6 | **Info tab demos** | *Upcoming:* `Info-playback-demos-tutorial.md` (or a short section inside #3) | **`startPodcastDemo`**, **`startRadioDemo`**, **`clearSession`**, why **`fullPlayerPath`** is **`null`** for stubs |
| 7 | **Cross-links** | [`react-learning.md`](react-learning.md) | Shorter reminders; append when a tutorial ships |

---

## Suggested schedule (you can adjust)

- **Session 1 (45–60 min):** Read [`PlaybackContext-tutorial.md`](Tutorials/PlaybackContext-tutorial.md), exercise #1 in that file, click through the app once.
- **Session 2:** [`App-miniplayer-wiring-tutorial.md`](Tutorials/App-miniplayer-wiring-tutorial.md) + [`MiniPlayer-component-tutorial.md`](Tutorials/MiniPlayer-component-tutorial.md); trace **`App.jsx`**, **`MiniPlayer.jsx`**, **`MiniPlayer.css`** once.
- **Session 3:** [`MiniPlayer-layout-tokens-tutorial.md`](Tutorials/MiniPlayer-layout-tokens-tutorial.md) → DevTools **`html`** styles; then prepare [`MusicPlayer-playback-sync-tutorial.md`](MiniPlayer-learning-plan.md) (Phase 3 when written).

---

## Relationship to other docs

| Doc | Role |
|-----|------|
| [`Miniplayer-component-story.md`](Stories/Miniplayer-component-story.md) | Product voice / behavior |
| [`Miniplayer - UX Principles.md`](UX/Miniplayer%20-%20UX%20Principles.md) | UX intent |
| [`figma-nodes.md`](figma-nodes.md) | Figma node **`19777:32024`** |
| [`react-learning.md`](react-learning.md) | Short stack notes + links |

---

## Creating the remaining tutorials

Phase 2 (**App wiring**, **MiniPlayer component**, **layout tokens**) now have long-form guides; **Phase 3–4** (**MusicPlayer sync**, **Info demos**) are still *upcoming* unless listed with a link below.

*Last updated: 2026-04-28* — Phase 2 tutorials: **MiniPlayer component** (#3), **layout tokens** (#4).
