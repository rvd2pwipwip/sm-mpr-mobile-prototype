# Search browse tab switcher — correct thumb position before paint (React)

Step-by-step notes for **`SearchBrowseContentSwitcher`**: the sliding accent thumb follows each tab’s **measured** width and `left` offset. The goal is **no visible glitch** on first paint (thumb jumping or animating from `(0, 0)` to the active tab).

**Code:** `src/components/SearchBrowseContentSwitcher.jsx` + `SearchBrowseContentSwitcher.css`.

---

## 1. What we need from the browser

The thumb’s `left` and `width` depend on **layout**: font, padding, label text, and flex sizing. Those values are unknown until:

- the tab nodes exist in the DOM, and  
- the browser has **computed layout** for them.

So we cannot derive correct pixels with **`useMemo`** alone. `useMemo` is for pure calculation from props/state, not for reading **`getBoundingClientRect()`** before the DOM exists.

---

## 2. Read layout after DOM commit, before paint — `useLayoutEffect`

**`useLayoutEffect`** runs **after** React commits changes to the DOM and the browser has performed layout for that commit, but **before** the browser **paints** the screen.

Pattern:

1. Render tabs and rail; attach **refs** to the rail and each segment (`NavLink`).
2. In **`useLayoutEffect`**, read rects (e.g. `segment.getBoundingClientRect()` vs `rail.getBoundingClientRect()`).
3. Call **`setState`** with `{ left, width }` for the thumb.

React flushes this update **synchronously** (before paint in normal cases), so the **first painted frame** can already show the correct thumb box—**if** we do not accidentally **animate** from the old inline styles to the new ones.

---

## 3. Keep thumb geometry in local state

Use **`useState`** for `{ left, width }`:

- Initial value is a placeholder (e.g. `{ left: 0, width: 0 }`).
- Hide the thumb while `width === 0` if you want zero flash (`visibility: hidden` is already used in the component).

`useLayoutEffect` replaces the placeholder with measured values before paint.

---

## 4. Pitfall: CSS `transition` on updates that are not a “tab flick”

If the thumb always has:

```css
transition: left 0.22s ease, width 0.22s ease;
```

then **any** change to `left` / `width` will interpolate. That includes:

- first measure after mount (slide from `(0, 0)` into place), and  
- **remount** when the user returns from full-screen player (new instance → measure → then motion was turned on globally → **`ResizeObserver`** nudges layout → thumb **slides** again).

**Fix:** keep **`transition: none`** on the thumb by default. Use a **modifier class** (e.g. `search-browse-content-switcher--thumb-motion`) only when you **intend** to animate.

---

## 5. When to turn motion on — tab change only, not “first layout of this mount”

`useEffect(..., [])` to force motion **on after mount** is wrong for Search: every time the user opens Search again, transitions stay **off** until a **real** tab index change.

Use **`useLayoutEffect`** + refs:

1. **`isFirstLayoutRef`**: first layout pass for this component instance → measure, **`setThumbMotionEnabled(false)`**, store **`prevActiveIndexRef`**, return.  
2. Later passes: **`tabChanged = prevActiveIndexRef.current !== activeIndex`**. Update the ref, then **`setThumbMotionEnabled(tabChanged)`** — `true` only when the user (or router) actually moved to another tab while this instance stayed mounted.

**Remount** (e.g. back from player): refs reset → **first layout** runs again → motion stays off → no slide on entry.

**Clear the motion flag** after an animated tab change so **`ResizeObserver`** does not animate later snaps:

- **`onTransitionEnd`** on the thumb for `left` / `width`, and  
- a **short `setTimeout` fallback** (e.g. 400ms) when `prefers-reduced-motion` means no transition events fire.

```javascript
useEffect(() => {
  if (!thumbMotionEnabled) return;
  const t = window.setTimeout(() => setThumbMotionEnabled(false), 400);
  return () => window.clearTimeout(t);
}, [thumbMotionEnabled]);
```

---

## 6. `prefers-reduced-motion`

Under **`@media (prefers-reduced-motion: reduce)`**, keep **`transition: none`** even when `--thumb-motion` is on, so users who opt out of motion do not see sliding.

---

## 7. Checklist (reuse in other components)

1. Refs on container + items to measure.  
2. Thumb position/size in **`useState`**.  
3. **`useLayoutEffect`** to measure when **`activeIndex`**, path, or **`segments`** change; gate **`thumbMotionEnabled`** with **first-layout** + **tab-change** logic.  
4. **`ResizeObserver`** on the rail to remeasure on width changes (geometry only — motion should usually be **off**).  
5. Thumb **`transition: none`** by default; root class = motion flag.  
6. **`transitionend` + timeout** to reset motion after a tab animation.  
7. Respect **`prefers-reduced-motion`**.

---

## 8. Related APIs (quick contrast)

| API | When it runs | Use here? |
|-----|----------------|-----------|
| **`useMemo`** | During render | No — cannot read post-layout DOM safely for this. |
| **`useEffect`** | After paint | Yes — **timeout fallback** to clear `thumbMotionEnabled` if `transitionend` does not run. |
| **`useLayoutEffect`** | After DOM mutation, before paint | Yes — measure, set thumb geometry, decide if this update is a **tab change** worth animating. |

---

## See also

- Figma reference for the control: node **`272:45769`** in the SM MPR mobile file (Content switcher).  
- Search shell: `docs/Plans/Search-Browse-implementation-plan.md`.
