# Tutorial: Understanding `PlaybackContext.jsx`

This document walks through [`src/context/PlaybackContext.jsx`](../../src/context/PlaybackContext.jsx) as if you were building it yourself. It assumes you know **basic JavaScript and JSX** and have used **`useState`** at least once, but **not** necessarily React Context, **`useCallback`**, **`useMemo`**, or **`useLocation`**.

**Companion:** Shorter “reminder” notes for the mini player also live in [`react-learning.md`](../react-learning.md) → *Miniplayer* and *Bottom navigation* (padding + `--mini-player-offset`).

---

## 1. What this file is responsible for

**`PlaybackContext`** holds **prototype “now playing” state** for the whole app:

- **What** is nominally streaming (titles, thumbnail, pause flag, music channel id).
- **Which UX variant** the [`MiniPlayer`](../../src/components/MiniPlayer.jsx) should render: **`music`**, **`podcasts`**, or **`radio`**.
- **Where** the full-screen music player lives in the router (**`fullPlayerPath`**, e.g. `/music/dance-hits/play`) so the mini bar can **`navigate()`** there—and **`null`** for podcast/radio stubs until real routes exist.
- **`miniPlayerVisible`** — Derives whether the mini strip should render (session active **and** you are **not** on the full-screen player URL).
- **Side effect** — Writes the CSS variable **`--mini-player-offset`** on **`<html>`** so **`index.css`** can add bottom padding under the fixed mini bar when it is visible.

Nothing in this file draws UI directly. Consumers are **`PlaybackProvider`** (wrapped around the tree in **`App.jsx`**) and hooks like **`usePlayback()`** in **`MiniPlayer`**, **`MusicPlayer`**, and **`Info`**.

---

## 2. Imports (lines 1–9)

```js
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useLocation } from "react-router-dom";
```

| Import | Role in this file |
|--------|-------------------|
| **`createContext`** | Factory that returns a **Context object** (see §4). |
| **`useState`** | Keeps the **session** object in memory and triggers re-renders when it changes. |
| **`useEffect`** | Runs after paint to sync **`--mini-player-offset`** to the document; includes a **cleanup** on unmount or when visibility flips. |
| **`useCallback`** | Returns **stable function references** for actions (`setPaused`, `upsertMusicSession`, …) so they are safe to put in **`useMemo`** / dependency lists without changing identity every render. |
| **`useMemo`** | Builds the **single `value` object** passed to **`<PlaybackContext.Provider>`** so consumers only see a new object when something meaningful changed. |
| **`useContext`** | Used only inside **`usePlayback()`** to read the provider’s value. |
| **`useLocation`** | React Router hook: current **URL** (`pathname`). Used to hide the mini player on **`/music/:channelId/play`**. |

**Why so many hooks?** Context alone would re-create new function objects on every render unless you stabilize them; **`useCallback`** + **`useMemo`** keep the **provider value** predictable and avoid unnecessary child re-renders when used with **`React.memo`** later (and satisfy lint rules about dependency arrays).

---

## 3. Context object and initial session (lines 16–28)

```js
const PlaybackContext = createContext(null);
```

**`createContext(defaultValue)`** creates two things you care about:

1. **`PlaybackContext.Provider`** — Wrap part of the tree and pass a **`value`** prop.
2. **`PlaybackContext.Consumer`** (not used here) or **`useContext(PlaybackContext)`** — Read that value.

The **`null`** default is a signal: “if someone calls **`usePlayback()`** outside a provider, we **throw**” (see §8).

```js
const initialSession = { ... };
```

A **plain object** describing the “empty” session: inactive, no titles, no path. **`clearSession`** resets to this same shape. Keeping it in one constant avoids typos and keeps “empty” consistent.

---

## 4. `PlaybackProvider` — Router + session state (lines 30–32)

```js
export function PlaybackProvider({ children }) {
  const location = useLocation();
  const [session, setSession] = useState(initialSession);
```

- **`useLocation()`** — Returns **`{ pathname, search, hash, state, key }`**. Only **`pathname`** is used here.
- **`useState(initialSession)`** — **`session`** is the single source of truth for “what the mini player should show.” **`setSession`** replaces or updates that object.

**Rule of thumb:** One **`useState`** for a structured object is fine for a prototype; a larger app might split reducer logic into **`useReducer`**.

---

## 5. Derived flags: when is the mini bar allowed? (lines 34–35)

```js
const hideMiniOnFullPlayer = /^\/music\/[^/]+\/play\/?$/.test(location.pathname);
const miniPlayerVisible = session.active && !hideMiniOnFullPlayer;
```

- **Regular expression** — Matches the full-screen **music** player route so the **fixed** full UI is not covered by the mini strip (same idea as hiding **`BottomNav`** in **`App.jsx`**).
- **`miniPlayerVisible`** — Pure derivation: **no** `useState`. When **`location`** or **`session`** changes, the component re-runs and these lines recompute.

**Why derive instead of storing `miniPlayerVisible` in state?** Storing it would duplicate truth and risk bugs when `pathname` or `session.active` change.

---

## 6. `useEffect`: sync CSS variable to the document (lines 37–45)

```js
useEffect(() => {
  document.documentElement.style.setProperty(
    "--mini-player-offset",
    miniPlayerVisible ? "var(--mini-player-height)" : "0px",
  );
  return () => {
    document.documentElement.style.setProperty("--mini-player-offset", "0px");
  };
}, [miniPlayerVisible]);
```

**What `useEffect` does:** After React commits the DOM update, runs your function.  

**Why here:** **`--mini-player-offset`** lives on **`<html>`** so **`index.css`** rules for **`.app-shell`** / **`.home-body-scroll`** can use **`calc(var(--mini-player-offset) + …)`** without passing props into every page.

**Dependencies `[miniPlayerVisible]`:** Re-run whenever the mini bar becomes visible or hidden.

**Cleanup `return () => { … }`:** On unmount, or **before** the effect runs again, reset the variable so you do not leak **`80px`** padding after navigating away without the provider.

**Not React-specific:** Talking to **`document.documentElement`** is an **imperative side effect**—exactly what **`useEffect`** is for.

---

## 7. `useCallback`: stable actions (lines 47–106)

Each handler uses **`useCallback(fn, deps)`**:

### `setPaused` (lines 47–49)

```js
const setPaused = useCallback((isPaused) => {
  setSession((s) => (s.active ? { ...s, isPaused } : s));
}, []);
```

- **Functional updater** **`setSession((s) => …)`** — Reads the **latest** `session`; avoids stale closures if multiple updates batch.
- **Guard **`s.active`** — If session is inactive, return **`s`** unchanged (no-op).
- **Empty deps `[]`** — Function identity never changes; it always closes over the same **`setSession`**.

### `togglePlayPause` (lines 51–53)

Same pattern: flip **`isPaused`** only when **`active`** is true.

### `upsertMusicSession` (lines 55–76)

Builds **`fullPlayerPath`** from **`channelId`**, sets **`variant: "music"`**, full metadata. **`upsert`** means “insert or replace” the active music session—the **music player** calls this whenever playback state updates.

Empty **`[]`** deps: the logic does not depend on props/state from the outer scope beyond **`setSession`**, which is stable.

### `startPodcastDemo` / `startRadioDemo` / `clearSession`

Fixed payloads for prototyping; **`clearSession`** resets to **`initialSession`**.

**Why `useCallback` at all?** So these references can safely sit inside the **`useMemo`** value below without changing every render unless you intentionally refactor.

---

## 8. `useMemo`: one provider `value` object (lines 108–129)

```js
const value = useMemo(
  () => ({
    session,
    miniPlayerVisible,
    setPaused,
    togglePlayPause,
    upsertMusicSession,
    startPodcastDemo,
    startRadioDemo,
    clearSession,
  }),
  [
    session,
    miniPlayerVisible,
    setPaused,
    togglePlayPause,
    upsertMusicSession,
    startPodcastDemo,
    startRadioDemo,
    clearSession,
  ],
);
```

**`useMemo(computeFn, deps)`** — Recomputes **`computeFn`** only when **`deps`** change; otherwise returns the **previous memoized result**.

**Why:** **`PlaybackContext.Provider value={value}`** — If **`value`** were recreated as **`{ … }`** on every render **without** `useMemo`, **every** descendant that consumes this context would re-render on **every** parent render—even when **`session`** did not change.

Including **`session`** in the dependency list means when **`session`** updates, **`value`** updates, which is correct.

**Including the callbacks:** They are stabilized with **`useCallback`**, so their references are stable; listing them satisfies **exhaustive-deps** linting and stays correct if you later add deps to **`useCallback`**.

---

## 9. Provider JSX (lines 131–134)

```js
return (
  <PlaybackContext.Provider value={value}>{children}</PlaybackContext.Provider>
);
```

**`children`** — Whatever **`App.jsx`** nests inside **`<PlaybackProvider>`** (routes, **`BottomNav`**, **`MiniPlayer`**, …).

React injects **`value`** into any **`useContext(PlaybackContext`** (via **`usePlayback`**) underneath this provider.

---

## 10. `usePlayback()` — consuming the context (lines 136–142)

```js
export function usePlayback() {
  const ctx = useContext(PlaybackContext);
  if (!ctx) {
    throw new Error("usePlayback must be used within PlaybackProvider");
  }
  return ctx;
}
```

**`useContext(PlaybackContext)`** — Reads the **nearest** **`Provider`** **`value`** up the tree. If none exists, **`createContext(null)`** makes **`ctx`** **`null`**—hence the **throw**.

**Benefits:** A single import **`usePlayback`** hides the context object and gives a clear error instead of **`undefined`** bugs later.

---

## 11. Data flow diagrams (mental model)

```
MusicPlayer mounts / updates playing
       │
       └─► upsertMusicSession({ … isPaused })  ─►  session updates
                                                           │
                                                           ├─► MiniPlayer re-reads session (pause icon, labels)
                                                           └─► miniPlayerVisible may stay true (still not on …/play)
```

```
URL changes to …/music/:id/play
       │
       └─► hideMiniOnFullPlayer === true  ─► miniPlayerVisible false
                                                           │
                                                           ├─► MiniPlayer unmount output (renders null)
                                                           └─► useEffect sets --mini-player-offset: 0px
```

```
User clears session (Info “Clear”) or leaves demo
       │
       └─► session.active false  ─► mini hidden, padding reset
```

---

## 12. Mental model checklist (if you rebuilt this yourself)

1. **`session`** lives in **`useState`;** **`miniPlayerVisible`** is **derived**, not duplicated in state.
2. **Full-screen route** hides the mini UI but **does not** clear **`session`**—so minimizing the player restores the strip with the same metadata.
3. **`useEffect`** is only for **DOM/CSS side effects** (`--mini-player-offset`), not for business logic stored in **`session`**.
4. **`useCallback` + `useMemo`** keep the **`Provider`** **`value`** from changing unnecessarily; for a prototype you could skip **`useMemo`** and accept extra re-renders, but the pattern scales better.
5. **`PlaybackProvider`** must sit **inside** **`BrowserRouter`** ( **`useLocation`** requires the router context ).

---

## 13. Suggested exercises

1. **`console.log(miniPlayerVisible, session, location.pathname)`** at the top of **`PlaybackProvider`** and watch the console while you open **Play**, minimize, toggle **pause** on the mini bar, and change tabs.
2. Temporarily **`return null`** inside the **`useEffect`** cleanup and reload the page after showing the mini bar—observe whether **`--mini-player-offset`** resets (DevTools → Elements → `<html>` → computed styles / inline style).
3. Add a **`console.count("provider render")`** in **`PlaybackProvider`** and compare with vs without **`useMemo`** on **`value`** when you trigger unrelated parent re-renders (advanced: wrap a child in **`React.memo`** to see fewer updates when **`value`** is stable).

---

## 14. Where this fits in the mini player stack

| Piece | Role |
|-------|------|
| **`PlaybackContext.jsx`** (this file) | Global session + CSS offset + hook |
| **`MiniPlayer.jsx` + `MiniPlayer.css`** | [`MiniPlayer-component-tutorial.md`](MiniPlayer-component-tutorial.md) — UI variants, masks, **`useNavigate`**, defensive **`return null`**, CSS shell |
| **`MusicPlayer.jsx`** | Calls **`upsertMusicSession`**, hydrates local **`playing`** from **`session`** when re-entering |
| **`index.css`** (footer tokens) | [`MiniPlayer-layout-tokens-tutorial.md`](MiniPlayer-layout-tokens-tutorial.md) — **`--mini-player-offset`**, **`--bottom-nav-stack-height`**, scroll padding |
| **`App.jsx`** | [`App-miniplayer-wiring-tutorial.md`](App-miniplayer-wiring-tutorial.md) — router + provider tree, **`MiniPlayer`/`BottomNav`** sibling of **`Routes`** |

A separate **learning plan** for the rest of the mini player implementation lives in [`MiniPlayer-learning-plan.md`](../MiniPlayer-learning-plan.md).
