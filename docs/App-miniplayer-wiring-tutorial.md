# Tutorial: Wiring `App.jsx` — router, PlaybackProvider, MiniPlayer & BottomNav

This document walks through [`src/App.jsx`](../src/App.jsx) and how it plugs into [`src/main.jsx`](../main.jsx). It picks up after [`PlaybackContext-tutorial.md`](PlaybackContext-tutorial.md): you already know **what** **`PlaybackProvider`** stores; here you see **where** it lives in the tree and **why** the mini player mounts next to **`BottomNav`** (not inside a single page).

It assumes JSX + basic **`Route` / `Routes`** familiarity.

**Companion:** [`MiniPlayer-learning-plan.md`](MiniPlayer-learning-plan.md) lists the remaining deep dives.

---

## 1. What this file is responsible for

**`App.jsx`** does four jobs:

1. **Compose global providers** so any route can read **user type** and **playback** state.
2. **Declare all top-level routes** (`/`, `/music/...`, `/search`, …).
3. **Mount shared chrome exactly once**: **`MiniPlayer`** + **`BottomNav`**, visible on most routes.
4. **Hide that chrome** on the **full-screen music player** (`/music/:channelId/play`) so neither the tab strip nor the mini strip competes with the immersive player.

It intentionally **does not** put **`BottomNav`** or **`MiniPlayer`** inside **`Home.jsx`** (or **`Search.jsx`**, …)—that pattern would duplicate chrome on every screen you added.

---

## 2. Entry tree: `main.jsx` (needed context for `App.jsx`)

[`main.jsx`](../main.jsx):

```jsx
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
```

| Piece | Why it matters for App wiring |
|-------|--------------------------------|
| **`BrowserRouter`** | Creates React Router context so **`Routes`**, **`Route`**, **`useLocation`**, **`useNavigate`**, **`useParams`** work **descendants** of **`App`**. |
| **`App` inside **`BrowserRouter`**** | **`PlaybackProvider`** (nested inside **`App`**) calls **`useLocation`** — that hook **must** render under a router. Putting **`BrowserRouter`** in **`main.jsx`** keeps **`App.jsx`** focused on composition. |
| **`StrictMode`** | Dev-only double-invoke of certain lifecycles; unrelated to routing but explains occasional double logs when debugging effects. |

**Rule:** Anything that calls **`useLocation`**, **`useNavigate`**, or **`Routes`** needs to be **inside** **`BrowserRouter`**. **`App.jsx`** never imports **`BrowserRouter`**—it inherits the context.

---

## 3. Imports in `App.jsx` (lines 1–13)

```js
import { Routes, Route, useLocation, useParams } from "react-router-dom";
import BottomNav from "./components/BottomNav";
import MiniPlayer from "./components/MiniPlayer";
import VisualAdsHtmlSync from "./components/VisualAdsHtmlSync";
import { PlaybackProvider } from "./context/PlaybackContext";
import { UserTypeProvider, useUserType } from "./context/UserTypeContext";
// …page components
```

| Import | Role here |
|--------|-----------|
| **`Routes` / **`Route`**** | URL → which page component renders in the **`Routes`** outlet. |
| **`useLocation`** | Used only in **`AppRoutes`** for **`pathname`** (hide chrome on player). |
| **`useParams`** | Used in **`MusicPlayerRoute`** helper to read **`channelId`** from the URL. |

The rest pull in **providers**, **Chrome** pieces, and **lazy page** modules.

---

## 4. `MusicPlayerRoute` wrapper (lines 15–19)

```js
function MusicPlayerRoute() {
  const { channelId } = useParams();
  const { userType } = useUserType();
  return <MusicPlayer key={`${channelId}-${userType}`} />;
}
```

- **`Route path="/music/:channelId/play"`** mounts this component; **`useParams()`** exposes **`channelId`**.
- **`key={\`${channelId}-${userType}\`}`** — Changing **channel** or **user type** forces React to **remount** **`MusicPlayer`**, resetting local state (e.g. guest pre-roll flows). Same pattern as documenting in **`MusicPlayer.jsx`** intent.

This helper keeps **`MusicPlayer.jsx`** unaware of **`UserTypeProvider`** details beyond **`useUserType`** (already wrapped by **`App`**).

---

## 5. `AppRoutes`: routes + conditional chrome (lines 22–45)

```js
function AppRoutes() {
  const location = useLocation();
  const hideBottomNav = /^\/music\/[^/]+\/play\/?$/.test(location.pathname);

  return (
    <>
      <VisualAdsHtmlSync />
      <Routes>...</Routes>
      {hideBottomNav ? null : (
        <>
          <MiniPlayer />
          <BottomNav />
        </>
      )}
    </>
  );
}
```

### 5.1 `useLocation` and naming

Despite the variable **`hideBottomNav`**, the guard controls **both** **`BottomNav`** **and** **`MiniPlayer`**—same fullscreen rule (“no footer stack on `/music/.../play`”). A name like **`hideFooterChrome`** would be clearer; **`hideBottomNav`** is legacy naming from tabs-only chrome.

### 5.2 The fullscreen regex

```js
/^\/music\/[^/]+\/play\/?$/.test(location.pathname)
```

- **`^`/ `$`** — Whole path must match.
- **`[^/]+`** — Segment for **`channelId`** (not empty, no slashes).

If you later add **`/music/:channelId/podcast/play`**, you would widen or split this logic so the chrome hides whenever **any** full-screen player consumes the footer.

### 5.3 `VisualAdsHtmlSync` **above** `Routes`

This component adjusts **`document.documentElement`** (e.g. **`data-visual-ads`**) before pages paint—it is not a duplicate of **`BottomNav`**’s **`VisualAdStrip`**. Placement next to **`Routes`** is “global wiring” for CSS variables (**`--bottom-nav-ad-height`**), not routing.

### 5.4 `MiniPlayer` then `BottomNav` (siblings of `Routes`)

**Why sibling, not nested under `Home`?**

- **`Routes`** swaps **which page** occupies the **`main`/scroll layer** underneath.
- **Footer chrome is route-agnostic**: you want **`MiniPlayer`** and **`BottomNav`** on **Home**, **Search**, **Info**, **`/music/:id`** (channel info—not play), **Subscription**, **`/more/:categoryId`**, etc.—one mount, consistent behavior (**project rule:** URL-driven tabs **`NavLink`**; same philosophy for playback strip).

Putting **`MiniPlayer`** inside **`Home`** would **drop** it when you **`navigate("/search")`**.

**Why order `<MiniPlayer />` then `<BottomNav />`**

- DOM order + **z-index** (`MiniPlayer`: **`--z-mini-player`**) → mini draws **above** the tab bar layer when overlaps matter; stacking is clarified in the layout tokens tutorial.
- On screen space, **`MiniPlayer`** is positioned **above** the tab/ad stack via **`bottom: calc(var(--bottom-nav-stack-height) + …)`**, so visually: **MiniPlayer**, then tabs, then optional ad (**`BottomNav`** structure).

They **hide together** when **`hideBottomNav`** is true—no orphaned tab bar without mini or the reverse.

### 5.5 Fragment `<>...</>`

Lets **`AppRoutes`** return several top-level siblings without wrapping in an extra **`div`** (which could break sticky/fixed layouts or semantics).

---

## 6. `App` component: provider nesting (lines 48–57)

```js
function App() {
  return (
    <UserTypeProvider>
      <PlaybackProvider>
        <AppRoutes />
      </PlaybackProvider>
    </UserTypeProvider>
  );
}
```

### 6.1 Order: `UserTypeProvider` outer, `PlaybackProvider` inner

- **`MusicPlayerRoute`** uses **`useUserType()`** — requires **`UserTypeProvider`** **above**.
- **`PlaybackProvider`** uses **`useLocation()`** — requires **`BrowserRouter`** **above **`App`** (satisfied)**.
- **`UserTypeProvider`** **does not** need **`PlaybackProvider`**. Outer/inner choice is whichever reads dependencies first logically; swapping would still work **if** **`AppRoutes`** remains under **both**.

### 6.2 What does *not* mount here

Individual pages (`Home`, `Search`, …) still render **`main.app-shell`** (or **`app-shell--home`**) themselves. **`App`** does **not** wrap **`Routes`** in a single **`layout` route** component (could be added later).

---

## 7. How this interacts with `PlaybackContext`

Two separate mechanisms both respect the **same** full-screen URL:

| Mechanism | What it does |
|-----------|----------------|
| **`App.jsx`** | When **`hideBottomNav`** is true, **`MiniPlayer`** is **not mounted** at all (saves work; avoids an extra component in the tree). |
| **`PlaybackContext.jsx`** | **`miniPlayerVisible`** is false on **`…/play`**, so **`--mini-player-offset`** on **`<html>`** becomes **`0`**—scroll padding matches “no mini strip” even though **`session`** can still hold “now playing” while the full player is open. |

So the **regex is intentionally duplicated** (belt-and-suspenders): layout padding is driven by context; mounting is driven by **`App`**. You only need **one** of these for a minimal app; we keep **both** so CSS and DOM stay aligned with the product story (mini hidden when the full player owns the screen).

---

## 8. Mental model checklist

1. **`BrowserRouter`** (**`main.jsx`**) wraps **`App`** so **all** **`useLocation`/Params/Navigate`** in **`PlaybackProvider`** and **`Routes`** succeed.
2. **`MiniPlayer`** + **`BottomNav`** are **siblings of **`Routes`** so every normal screen gets footer chrome **without copying** into each page.
3. **Full-screen music player route** skips mounting **`MiniPlayer`** **`BottomNav`** together (regex **`hideBottomNav`**).
4. **Providers wrap **`AppRoutes`**** so **`MusicPlayer`** (inside **`Routes`**) sits under **`PlaybackProvider`** **`UserTypeProvider`** and can **`usePlayback`/`useUserType`**.

---

## 9. Suggested exercises

1. Temporarily **`return <MiniPlayer />`** unconditionally (ignore **`hideBottomNav`**). Navigate to **`/music/channel-id/play`**. Confirm double chrome feeling—then revert.
2. Add **`console.log(location.pathname)`** at top of **`AppRoutes`**; click Home → Info → Channel → Play; correlate with regex.
3. Swap provider order: put **`<PlaybackProvider>`** **outside** **`<UserTypeProvider>`** (still both wrapping **`AppRoutes`**). Run **`npm run build`**—it should pass; **`MusicPlayerRoute`** only needs **`UserTypeProvider`** to wrap the tree **above** itself.

4. Sketch a **layout route** with **`Outlet`** + **`MiniPlayer`** + **`BottomNav`** (React Router v6 pattern)—optional future refactor.

---

## 10. Related tutorials

| Doc | Covers |
|-----|--------|
| [`PlaybackContext-tutorial.md`](PlaybackContext-tutorial.md) | Session API + **`useLocation`** inside provider |
| [`MiniPlayer-component-tutorial.md`](MiniPlayer-component-tutorial.md) | **`MiniPlayer.jsx`** + **`MiniPlayer.css`** variants, masks, **`navigate`** |
| [`MiniPlayer-layout-tokens-tutorial.md`](MiniPlayer-layout-tokens-tutorial.md) | **`index.css`** **`calc`**, **`--bottom-nav-stack-height`**, **`data-visual-ads`**, **`z-index`** |

[`MiniPlayer-learning-plan.md`](MiniPlayer-learning-plan.md) — roadmap for the rest.
