# Tutorial: Guest preroll grace period (prototype)

This document explains the **full-screen preroll grace** feature (prototype users who get **`PlayerPrerollAd`**: **guest** and **free Stingray**): how **`GuestPrerollGraceContext`** stores a timed “no more prerolls” window, how **`PlayerPrerollAd`** **starts** that window when the ad UI appears, and how **`MusicPlayer`** **consumes** **`graceActive`** so extra **tunes** within the window skip the overlay.

**Companion files (not line-by-line here, but required for the full flow):**

- [`src/constants/guestPrerollGrace.js`](../../src/constants/guestPrerollGrace.js) — **`GUEST_PREROLL_GRACE_MS`**
- [`src/pages/MusicPlayer.jsx`](../../src/pages/MusicPlayer.jsx) — **`skipPrerollGate`**, **`graceActive`**, when **`PlayerPrerollAd`** mounts
- [`src/components/MiniPlayer.jsx`](../../src/components/MiniPlayer.jsx) — **`expandFromMiniPlayer`** navigation state (preroll skip path **without** starting grace)
- [`src/App.jsx`](../../src/App.jsx) — **`GuestPrerollGraceProvider`** wraps the app tree

**Prerequisites:** **[`visual-ads-and-user-types.md`](../visual-ads-and-user-types.md)** (**`showPlayerPreroll`**, **`guest`** / **free Stingray**), **[`react-learning.md`](../react-learning.md)** → *React Router `navigate` + `location.state` (guest preroll vs mini expand)*.

---

## 1. What this feature does

| Behavior | Detail |
|---------|--------|
| **Trigger to start grace** | A **guest** or **free Stingray** full-screen preroll **`PlayerPrerollAd`** **mounts** → `beginPrerollGracePeriod()` runs (see §5). |
| **During grace** | **`graceActive`** is **`true`** for **`GUEST_PREROLL_GRACE_MS`** (default **15s**). A **new** tune to **`/music/:channelId/play`** **without** mini-expand sets **`skipPrerollGate`** so **`prerollComplete`** starts **`true`** and **no** second overlay. |
| **After grace** | Timeout sets **`graceActive`** to **`false`**. The **next** tune that would show preroll **does** show it; **`PlayerPrerollAd`** mounts again → grace **restarts** from that display. |
| **Persistence** | **None** — state lives in React context in memory. **Full page reload** clears grace (“app launch” for this SPA). |
| **Mini player expand** | **`location.state.expandFromMiniPlayer`** still skips preroll; **`PlayerPrerollAd`** does **not** mount → **no** `beginPrerollGracePeriod()` from that action. |

**Product note:** The preroll **countdown** in **`PlayerPrerollAd`** is also **15s**. Grace is measured **from when the preroll UI is shown**. If the user watches the **entire** countdown, grace and ad end around the same time; **skipping** early leaves more of the 15s grace for **channel hopping**. To guarantee “exploration time after the ad,” increase **`GUEST_PREROLL_GRACE_MS`** above the ad duration or change *when* `beginPrerollGracePeriod` runs (product decision).

---

## 2. Duration constant — `guestPrerollGrace.js`

[`src/constants/guestPrerollGrace.js`](../../src/constants/guestPrerollGrace.js)

| Export | Meaning |
|--------|---------|
| **`GUEST_PREROLL_GRACE_MS`** | Milliseconds that **`graceActive`** stays **`true`** after `beginPrerollGracePeriod()` runs. |

The **import** is used only in **`GuestPrerollGraceContext.jsx`** so the timeout and documentation stay in one place for future experiments (longer grace, different reset rules, etc.).

---

## 3. Line by line — `GuestPrerollGraceContext.jsx`

File: [`src/context/GuestPrerollGraceContext.jsx`](../../src/context/GuestPrerollGraceContext.jsx)

| Line(s) | What it does |
|--------|----------------|
| **1–8** | Imports **`createContext`**, **`useCallback`**, **`useContext`**, **`useMemo`**, **`useRef`**, **`useState`** from React — standard hooks for a small context provider. |
| **9** | Imports **`GUEST_PREROLL_GRACE_MS`** from the constants module (single source for the timeout length). |
| **11** | **`GuestPrerollGraceContext`** — React context object; default value **`null`** so **`useGuestPrerollGrace`** can detect “used outside provider.” |
| **13–17** | JSDoc: reminds readers that state is **in‑memory**, resets on reload; **`beginPrerollGracePeriod`** is meant to be called when the preroll **UI** appears; effect is “no further full-screen preroll” for **`GUEST_PREROLL_GRACE_MS`**. |
| **18** | **`GuestPrerollGraceProvider`** — wrapper component; **`children`** is the rest of the app (`App` → routes, etc.). |
| **19** | **`graceActive`** — boolean state exposed to consumers (e.g. **`MusicPlayer`**). **`true`** = within grace window. |
| **20** | **`timeoutRef`** — holds the **`window.setTimeout`** id so a **new** `beginPrerollGracePeriod` can **clear** the previous timer (avoids two timeouts flipping **`graceActive`** off at the wrong time). |
| **22–32** | **`beginPrerollGracePeriod`** — **`useCallback`** with **`[]`** deps so the function identity is **stable** (safe dependency for **`PlayerPrerollAd`’s** `useEffect`). |
| **23–26** | If a prior timeout exists → **`clearTimeout`**, set ref to **`null`**. **Why:** Showing a **new** preroll **restarts** a full grace window from “now,” not from an older pending callback. |
| **27** | **`setGraceActive(true)`** — subscribers **`useGuestPrerollGrace()`** re-render; **`MusicPlayer`** recomputes **`skipPrerollGate`**. |
| **28–31** | Schedules **`setGraceActive(false)`** after **`GUEST_PREROLL_GRACE_MS`**; stores id in **`timeoutRef`**, then clears ref after firing. |
| **34–37** | **`useMemo`** builds **`{ graceActive, beginPrerollGracePeriod }`**. **`graceActive`** in the dependency array means **value** updates when grace starts/ends; **`beginPrerollGracePeriod`** is stable. |
| **39–43** | Renders **`GuestPrerollGraceContext.Provider`** with **`value`** and **`children`**. |
| **46–51** | **`useGuestPrerollGrace`** — reads context; throws a clear error if **`null`** (forgot **`GuestPrerollGraceProvider`**). |

---

## 4. Line by line — `PlayerPrerollAd.jsx`

File: [`src/components/PlayerPrerollAd.jsx`](../../src/components/PlayerPrerollAd.jsx)

| Line(s) | What it does |
|--------|----------------|
| **1** | **`useCallback`**, **`useEffect`**, **`useRef`**, **`useState`** — hooks for countdown, mount effect, one-shot **`onComplete`**, and “already completed” guard. |
| **2** | **`useGuestPrerollGrace`** — must run under **`GuestPrerollGraceProvider`** (see **`App.jsx`**). |
| **3** | Sidecar styles for the full-screen overlay (**.player-preroll**, etc.). |
| **5** | **`DEFAULT_SECONDS`** — default preroll countdown length (**15**); independent of **`GUEST_PREROLL_GRACE_MS`** unless you choose to align them. |
| **7–10** | JSDoc describing the prototype: full-screen stub, countdown, Skip. |
| **11–15** | Component props: optional **`durationSeconds`**, required **`onComplete`**, optional **`title`**. |
| **16** | Destructures **`beginPrerollGracePeriod`** only (does not need **`graceActive`** here). |
| **17** | **`remaining`** — seconds left in the **ad** countdown (`useState(durationSeconds)`). |
| **18** | **`doneRef`** — ensures **`onComplete`** runs **at most once** (Strict Mode / duplicate timer edges). |
| **20–22** | **`useEffect`** on mount (and if **`beginPrerollGracePeriod`** identity ever changed — it does not): calls **`beginPrerollGracePeriod()`**. **This is the bridge to the grace context:** grace starts **when the preroll component is displayed**, including if the user **skips** a few seconds later (the countdown effect still completed the flow, but grace already started at mount). |
| **24–28** | **`complete`** — if **`doneRef.current`**, return; else set ref, call **`onComplete()`** (parent **`MusicPlayer`** sets **`prerollComplete`**, **play** state). |
| **30–37** | Countdown **`useEffect`**: if **`remaining <= 0`**, call **`complete()`**; else **`setTimeout`… 1s** to decrement **`remaining`**; cleanup clears timeout. |
| **39–41** | **`skip`** — sets **`remaining`** to **0** so the next effect pass calls **`complete()`**. |
| **43–65** | JSX: accessible **`dialog`**, backdrop, label, live countdown, hint, **Skip** button. |

**Why grace starts here and not only in `MusicPlayer`?**

- **Single responsibility:** “Shown” means the **`PlayerPrerollAd`** tree exists. Only that path should call **`beginPrerollGracePeriod`** for “ad was displayed.”
- **Safety:** If another screen ever mounts **`PlayerPrerollAd`**, grace behavior follows automatically.

---

## 5. How the two files work together (timeline)

```mermaid
sequenceDiagram
  participant MP as MusicPlayer
  participant PPA as PlayerPrerollAd
  participant CTX as GuestPrerollGraceContext

  Note over MP: Guest tunes channel A; grace inactive
  MP->>PPA: Mount PlayerPrerollAd
  PPA->>CTX: beginPrerollGracePeriod()
  CTX->>CTX: graceActive = true; setTimeout 15s
  Note over PPA: Countdown / Skip
  PPA->>MP: onComplete()
  Note over MP: prerollComplete true; playing...

  Note over MP: Guest tunes channel B (within 15s)
  MP->>MP: graceActive true => skipPrerollGate true
  Note over MP: PlayerPrerollAd NOT mounted

  Note over CTX: Timeout fires
  CTX->>CTX: graceActive = false

  Note over MP: Guest tunes channel C
  MP->>PPA: Mount PlayerPrerollAd again
  PPA->>CTX: beginPrerollGracePeriod() (restart)
```

1. **`MusicPlayer`** decides **`needsPreroll && !prerollComplete`**. On **first** tune, **`graceActive`** is false → **`prerollComplete`** starts false → **`PlayerPrerollAd`** renders.
2. **`PlayerPrerollAd`** **mounts** → effect runs **`beginPrerollGracePeriod()`** → **`graceActive`** true + timer.
3. User finishes or skips → **`onComplete`** → **`MusicPlayer`** sets **`prerollComplete`** true; overlay unmounts.
4. User navigates to **another** channel’s **`/play`** while **`graceActive`** is still true → **`MusicPlayer`** initializes with **`skipPrerollGate`** true (**because `graceActive`**) → **`prerollComplete`** starts true → **no** **`PlayerPrerollAd`** → **no second `beginPrerollGracePeriod`** until a future mount after grace expired.
5. Timer ends → **`graceActive`** false → next tune that needs preroll mounts **`PlayerPrerollAd`** again → step 1 repeats.

---

## 6. `MusicPlayer.jsx` bridge (read-only walkthrough)

These lines **connect** context + component; they are **not** duplicated line-by-line in §3–4 but are essential:

| Lines (approx.) | Role |
|-----------------|------|
| **59** | **`const { graceActive } = useGuestPrerollGrace();`** — subscribes to grace; re-renders when **`graceActive`** toggles. |
| **63** | **`skipPrerollGate = !needsPreroll \|\| expandFromMini \|\| graceActive`** — three ways to skip the overlay: user type has no preroll, opened from mini strip, or **inside grace window**. |
| **64–65** | **`useState(() => skipPrerollGate)`** for **`prerollComplete`** and **`playing`** — **initial** skip when landing on **`/play`** during grace **without** mounting **`PlayerPrerollAd`**. |
| **97–102** | Renders **`PlayerPrerollAd`** only when **`needsPreroll && !prerollComplete`**. |

**Invariant:** **`beginPrerollGracePeriod`** runs **only** when **`PlayerPrerollAd`** mounts, i.e. when **`needsPreroll && !prerollComplete`** on **first paint** for that visit **and** grace was **not** already active from a timer that applies… actually if **grace active**, **`prerollComplete`** starts **true**, so **`PlayerPrerollAd`** **does not** mount — correct.

---

## 7. Edge cases and dev notes

| Topic | Behavior |
|-------|-----------|
| **React Strict Mode (dev)** | Effects may run twice on mount; **`beginPrerollGracePeriod`** clears the previous timeout before scheduling again, so one **logical** grace window survives. |
| **Provider location** | **`GuestPrerollGraceProvider`** wraps **`PlaybackProvider`** in **`App.jsx`** so **`PlayerPrerollAd`** **inside** routes can call **`useGuestPrerollGrace`**. |
| **Expand from mini** | **`PlayerPrerollAd`** never mounts → **grace is not** extended by expand alone; grace was (or was not) started by an earlier **tune** that **did** show preroll. |
| **User type** | **`showPlayerPreroll(userType)`** is true for **guest** / **freeStingray**; false for **freeProvided** / **subscribed** → grace only applies when preroll can mount for those ad-supported tiers. |

---

## 8. Related documentation

- **[`visual-ads-and-user-types.md`](../visual-ads-and-user-types.md)** — **`showPlayerPreroll`**, where **`PlayerPrerollAd`** sits in the product story.
- **[`react-learning.md`](../react-learning.md)** — **navigate** `state` for **`expandFromMiniPlayer`** vs tune-from-browse.
- **Styles:** [`src/components/PlayerPrerollAd.css`](../../src/components/PlayerPrerollAd.css), token **`--z-player-preroll`** in **`index.css`**.
