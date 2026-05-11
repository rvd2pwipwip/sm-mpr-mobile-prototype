# Tutorial: Guest music skip limit (prototype)

This document walks through the **guest-only hourly skip cap** for **music** streaming: **constants**, **`GuestMusicSkipContext`** (timing + entitlement checks), **`MusicSkipButton`** (badge overlay), **`GuestSkipLimitDialog`**, and how **`MiniPlayer`** + **`MusicPlayer`** stay in sync without **prop drilling**.

**Prerequisite:** **[`PlaybackContext-tutorial.md`](PlaybackContext-tutorial.md)** (where music vs mini/full lives), **[`visual-ads-and-user-types.md`](../visual-ads-and-user-types.md)** (user tiers + **`usesGuestMusicSkipCap`**), **`UserTypeContext`**.

**Figma:** Badge on skip control — **[`23:20013`](https://www.figma.com/design/duguG08ZOCWXQemLw59XJW/UX-SM-MPR-Mobile-2604?node-id=23-20013)**; hourly limit modal — **[`5568:166350`](https://www.figma.com/design/duguG08ZOCWXQemLw59XJW/UX-SM-MPR-Mobile-2604?node-id=5568-166350)**.

---

## 1. What this feature implements (and skips)

### In scope for v1

- **`guest`** on **music** only: **`MusicPlayer`** and **`MiniPlayer`** when **`session.variant === "music"`** (podcasts / radio keep different controls).
- Each **successful skip tap** pushes a future **expiry timestamp** (`now + recovery duration`). Until that expiry passes, it counts toward a **maximum number of simultaneous “slots”.**
- **`freeProvided`** / **`subscribed`** — **unlimited skips**; context **does not** record stamps (early return).
- **Badge digit** above the triangle of **`/skip.svg`**: **`active stamp count`**; **hidden at 0** (nothing to reclaim yet).
- **At cap**, a modal explains **approximately how many whole minutes remain** until the **oldest** active stamp expires, and pushes **Upgrade** (**`/upgrade`**) messaging.
- Successful skip **prototype v1**: **counter + timers only** — no fake “next track.”

### Out of scope (see **`docs/Plans/plan.md`**)

- **Persistence** (`localStorage`) across reload — in-memory OK for now.
- **Licensing tweaks** when **`freeProvided`** vs **`guest`** need different caps (**plan** calls this out).

---

## 2. Tune the prototype numbers — `guestMusicSkips.js`

[`src/constants/guestMusicSkips.js`](../../src/constants/guestMusicSkips.js) exports three named values:

| Constant | Typical value | Meaning |
|---------|---------------|---------|
| **`GUEST_MUSIC_MAX_ACTIVE_SKIPS`** | `6` | Max stamps at once (= max skips until one expires). |
| **`GUEST_MUSIC_SKIP_RECOVERY_MS`** | `60 * 60 * 1000` | Lifetime of each stamp (one hour per skip). |
| **`GUEST_MUSIC_SKIP_PRUNE_INTERVAL_MS`** | `15 * 1000` | How often to drop expired stamps so the **badge** decrements without another tap. |

**Why a separate file?** One import site for product + engineering — no hunting through JSX for magic numbers. For **demos**, temporarily set **`GUEST_MUSIC_SKIP_RECOVERY_MS`** to `60_000` (one minute) to watch the badge tick down.

---

## 3. Mental model: sliding window by expiry stamps

Think of a **list of timestamps** (milliseconds since epoch). Each is “this skip **unlocks** at this time.”

1. **Prune** — Remove any `t <= Date.now()`; they no longer constrain the guest.
2. **Try skip** — If **pruned length < max**, **`push`** `Date.now() + GUEST_MUSIC_SKIP_RECOVERY_MS`, **sort ascending** so the **minimum** is always the oldest future unlock.
3. **Blocked** — If **length ≥ max** **after prune**, refuse the skip and read **`Math.min(...stamps)`** → convert to **“minutes remaining”** (ceil to whole minutes, minimum 1).

**Teaching:** You are **not** storing “skips used in the last sixty minutes”; you store **individual cooldown completions**. That matches “each skip has its **own** timer.”

---

## 4. `GuestMusicSkipContext.jsx` — provider + keyed remount

File: [`src/context/GuestMusicSkipContext.jsx`](../../src/context/GuestMusicSkipContext.jsx).

### 4a. Why two provider components?

Outer **`GuestMusicSkipProvider`** reads **`useUserType()`** and renders:

```jsx
<GuestMusicSkipInnerProvider key={userType}>{children}</GuestMusicSkipInnerProvider>
```

**`key={userType}`** forces React to **unmount/remount** the inner provider when **`userType`** switches across **guest**, **freeStingray**, **freeProvided**, and **subscribed**. All **`useState` reset** happens automatically — **no `useEffect` that calls `setExpiries([])`** (avoids “setState in effect” linter noise and cascading renders).

**Teaching:** **`key`** on component types is React’s blunt “fresh instance please” hammer — helpful for prototypes that isolate **preview modes** (`/upgrade`) from real session carryover.

### 4b. `expiriesRef` + synchronous updates

**`expiriesRef`** mirrors the **last written** stamp array. Every path that commits a new array also sets **`expiriesRef.current = next`** **before** or **inside** the same logical update:

- **`consumeGuestMusicSkip`** uses **`expiriesRef.current`** to **read**, then assigns **`next`**/`pruned` to **`expiriesRef.current`** synchronously — so **rapid double-taps** always see tap 2’s tally after tap 1, even **before React re-renders**.

**Teaching:** **`setState` batches** asynchronous updates; entitlement checks that must be **instant** relative to taps often pair **mutable ref snapshots** with **React state for paint**.

### 4c. `consumeGuestMusicSkip`

- **`usesGuestMusicSkipCap(userType)`** is false → **`return true`** (no cap). True for **`guest`** and **`freeStingray`** (hourly skip tally applies).
- **Guest** → prune → at cap opens dialog + **`return false`**; otherwise append expiry, sort, **`return true`**.

The dialog stores **`minutesUntilOldestExpiry(pruned)`** when blocked.

### 4d. Interval prune

A **`useEffect`** + **`setInterval`** every **`GUEST_MUSIC_SKIP_PRUNE_INTERVAL_MS`** runs **`setExpiries`** with prune logic. Compare **length + pairwise equality** against previous stamps to **`return prev`** unchanged when nothing expired — avoids extra re-renders.

**Teaching:** **Intervals** approximate “real time” UX in the browser — you rarely need **`setTimeout` per stamp** unless sub-second fidelity matters.

### 4e. **`useMemo` — context `value` object**

Stable **`consumeGuestMusicSkip`** / **`dismissSkipLimitDialog`** via **`useCallback`**, **`value`** via **`useMemo`** — same pattern as **`PlaybackContext-tutorial.md` §hooks**.

Consumers: **`MusicSkipButton`**, **`GuestSkipLimitDialog`**.

---

## 5. UI: `MusicSkipButton.jsx`

File: [`src/components/MusicSkipButton.jsx`](../../src/components/MusicSkipButton.jsx) + **`MusicSkipButton.css`**.

### Responsibilities

- **`size="mini"`** — Applies **`MiniPlayer`** control sizing + **`mini-player__mask-icon--skip`** (mask icon lives in **`MiniPlayer.css`**).
- **`size="full"`** — Applies **`music-player__skip`** + **`music-player__skip-icon`** (styles in **`MusicPlayer.css`**).
- Reads **`useGuestMusicSkips()`**: **`guestActiveSkipCount`**, **`guestMusicMaxActiveSkips`**, **`consumeGuestMusicSkip`**.
- **`onClick`** optional first calls **`e.stopPropagation()`** from **`MiniPlayer`** so the skip control does not bubble to **“open full player”** on the large tap target.

### Badge

Digit only (**no chip fill**) in the triangle region of **`/skip.svg`**; **`font-size`** **10px** / **13px**. **Color:** **`--music-skip-count-on-full`** = **`var(--color-bg)`** (full player: icon **`--color-text`**, digit “returns” to page background) and **`--music-skip-count-on-mini`** = **`var(--miniplayer-bg)`** (mini: icon **`--miniplayer-text`**). **No** shadow, outline, or glow. Override in **`index.css`** only if product wants **`--color-bg2`** instead of **`--color-bg`** for the digit.

**`aria-label`:** When **`guestActiveSkipCount > 0`**, augments **“Skip forward”** with **“X of N hourly skips in use.”**

---

## 6. UI: `GuestSkipLimitDialog.jsx`

File: [`src/components/GuestSkipLimitDialog.jsx`](../../src/components/GuestSkipLimitDialog.jsx) (shell: shared **`AppStackedDialog`**, **`AppStackedDialog.css`**).

- **Fixed overlay** + **scrim** (tap-outside dismiss): **black 25%** (light app) / **white 25%** (dark app) + backdrop blur. **`z-index`** **`--z-stacked-modal`** (**`index.css`**; same token as **`--z-guest-skip-dialog`** alias).
- **Copy** uses **`skipLimitDialogMinutes`** from context.
- **Primary** — **Create free account** — **`Button`** **`subscribe-primary`** → dismiss, **`setUserType("freeStingray")`**, **`STINGRAY_SIGNUP_EMAIL_URL`** in a new tab (same as **Info** guest **Create account**).
- **Secondary** — **Log in** — outline **`Button`** → dismiss, **`setUserType("freeStingray")`**, **`STINGRAY_ACCOUNT_LOGIN_URL`** in a new tab (same as **Info** guest **Log in**).
- **Tertiary** — **Not now** — link-style dismiss only (**`AppStackedDialog`** **`tertiaryButton`**).

Mounted **once** next to **`Routes`** in **`App.jsx`** so it works from **mini** and **full** player.

---

## 7. Wiring — `App.jsx`

Order (outer → inner):

1. **`UserTypeProvider`**
2. **`GuestMusicSkipProvider`**
3. **`PlaybackProvider`**
4. **`AppRoutes`** (includes **`GuestSkipLimitDialog`** before **`Routes`** so focus order / DOM order reads nav content then routes — adjust if a11y review asks otherwise)

**`MusicSkipButton`** must sit under **`GuestMusicSkipProvider`** (and **`UserTypeProvider`**).

---

## 8. How to click-test (guest)

1. Stay **`guest`** (**`/upgrade`** → **Preview as guest** if needed).
2. Open a music channel → **Play** (full screen) or minimize so **mini** shows.
3. Tap **skip** up to **6** times — badge **1…6**; the next tap opens the **modal** with an estimated minute countdown.
4. Optional: set **`GUEST_MUSIC_SKIP_RECOVERY_MS`** to **one minute** in **`guestMusicSkips.js`**, wait **60s** — badge should **drop** on the next **15s** prune tick (or tap skip again to force prune via **`consume`** read path).

**`freeProvided`** / **`subscribed`:** no badge; skip taps **never** open the modal.

---

## 9. Files touched (checklist)

| Path | Role |
|------|------|
| `src/constants/guestMusicSkips.js` | Caps + durations + prune cadence |
| `src/context/GuestMusicSkipContext.jsx` | Stamps, consume, dialog state, keyed remount |
| `src/components/MusicSkipButton.jsx` (+ `.css`) | Shared skip + badge |
| `src/components/GuestSkipLimitDialog.jsx` | Limit reached modal (uses **`AppStackedDialog`**) |
| `src/components/AppStackedDialog.jsx` (+ `.css`) | Shared stacked-header modal shell (**Figma `9585:70503`**) |
| `src/components/MiniPlayer.jsx` | Uses **`MusicSkipButton size="mini"`** |
| `src/pages/MusicPlayer.jsx` | Uses **`MusicSkipButton size="full"`** |
| `src/App.jsx` | Provider order + **`GuestSkipLimitDialog`** |
| `src/index.css` | **`--z-stacked-modal`** / **`--z-guest-skip-dialog`**; **`--music-skip-count-*`** digit = **`--color-bg`** / **`--miniplayer-bg`** |
| `eslint.config.js` | **`react-refresh/only-export-components`: off** for `src/context/**` (Context + hooks pattern) |

---

## 10. Where to extend next

- **Fake track line** after successful skip — likely **`PlaybackContext`** adds **track index** or title string; **`consumeGuestMusicSkip()`** return value can gate “bump track” when you wire it.
- **Persist tallies** — hydrate stamps from **`localStorage`** on mount; filter past expiries.
- **Analytics / copy** — align strings with legal for **`freeProvided`** if caps diverge.

Shorter reminder: **`docs/react-learning.md`** → **Guest music skip limit (Context + hourly stamps)**.
