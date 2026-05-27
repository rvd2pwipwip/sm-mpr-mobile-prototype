# Home header — layout, Figma, and `useHomeHeaderOffset`

**Code:** `src/components/HomeHeader.jsx` + `HomeHeader.css`  
**Figma (example):** [Home / header area](https://www.figma.com/design/duguG08ZOCWXQemLw59XJW/UX-SM-MPR-Mobile-2604?node-id=5527-77520) — parent **hug content**, with top / bottom padding as in the file.

**Related learning:** [`react-learning.md`](../react-learning.md) (short pointers) — this file is the **longer** step-by-step for `useRef`, `useLayoutEffect`, and `ResizeObserver`.

---

## 1. Why the scroll area needs a “fake” top gap

The `<header>` is **`position: fixed`**, so it is **removed from normal document flow**. The main scroll column (`.home-body-scroll` on Home) does **not** get automatic spacing above its content.

**Fix:** give `.home-body-scroll` **`padding-top: var(--home-header-offset)`** so the first real content (banner, swimlanes) starts **below** the fixed bar. The number must equal the **total pixel height** of the header including padding. That value changes if:

- the logo or button size changes,  
- the header has different **variants** (guest vs subscribed, etc.).

A **fixed `height: 110px` in CSS** is brittle. Measuring the real DOM height keeps **one implementation** for all variants.

---

## 2. Aligning with Figma: “hug” + padding

In Figma, **Hug** on the parent means: no fixed height on the frame — height = **content** + **padding** (e.g. **30px top** + **20px bottom** in your comp, for a **total** that depends on the row, e.g. 110px when the middle block is 60px).

**In CSS:**

- Use **`padding-top`** / **`padding-bottom`** on the fixed header (or tokens like `--safe-area-inset-top` and a bottom token).
- **Do not** set a **fixed** `height` on the bar if you want it to **hug**; let **`height: auto`** (or omit height) so the row (logo + CTA) defines the middle.

The **measured** `offsetHeight` of `<header>` **already** includes top padding, content, and bottom padding—so you do **not** need to add 30 + 20 + 60 manually in JS.

---

## 3. Publishing height to the rest of the page: `--home-header-offset`

The scroll column reads **`var(--home-header-offset)`** from CSS (`index.css`).

- **`index.css`** defines a **fallback** `calc(...)` in `:root` for the first frame and for routes **without** the measured header.
- While **`HomeHeader`** is mounted, the hook **overwrites** `--home-header-offset` on **`<html>`** (`document.documentElement`) with the real **`offsetHeight` in pixels**, so any rule using `var(--home-header-offset)` (e.g. `.home-body-scroll { padding-top: … }`) stays aligned.

**Variant heights:** if you swap content or a shorter/taller CTA, `offsetHeight` changes → the observer (below) **re-publishes** — no per-variant magic numbers in JS.

---

## 4. Step-by-step: `useHomeHeaderOffset` in `HomeHeader.jsx`

This **custom hook** (a function that starts with `use` and calls other hooks) does three things: **`useRef`**, **`useLayoutEffect`**, and **`ResizeObserver`**.

### 4.1 `useRef` — a stable “box” for the DOM node

```js
const ref = useRef(null);
```

- **`useRef` returns a plain object** React keeps for the life of the component, with a **`.current` property**.
- It starts as **`null`**. When you do `<header ref={ref}>`, React assigns **`ref.current`** to the real **`<header>` DOM element** after that element exists.
- **Updating `ref.current` does not re-render** (unlike `useState`). That is appropriate for “remember this DOM node,” not for “new UI state.”

**Usage:** the hook **returns** `ref`; **`HomeHeader`** passes **`ref={headerRef}`** to `<header>`, so the effect can read the same node.

---

### 4.2 `useLayoutEffect` — after DOM update, before paint

```js
useLayoutEffect(() => {
  // ...
}, []);
```

- **`useEffect`** runs after the browser has **painted** (user might briefly see wrong layout when reading layout).
- **`useLayoutEffect`** runs **synchronously** after React has applied your DOM updates, **before** the browser paints the next frame. That is a good time to read **`offsetHeight`**, so the first visible frame can already have the right `--home-header-offset`.

- **Empty dependency array `[]`:** the effect runs **once on mount** and returns a **cleanup** function that runs on **unmount**. The ref is **stable**; the observer is tied to the mounted header.

---

### 4.3 Inside the effect: measure, set CSS, observe, clean up

1. **`const el = ref.current`** — if there is no header yet, **return** and do nothing.

2. **`publish`:**  
   `h = el.offsetHeight` (full height: padding, border, **includes** the hugged content row).  
   `document.documentElement.style.setProperty('--home-header-offset', h + 'px')`  
   This sets a **custom property** on `<html>`, which **cascades** to the rest of the app so `var(--home-header-offset)` resolves correctly.

3. **Run `publish()` once** right away.

4. **`ResizeObserver`** — `new ResizeObserver(publish)` and **`ro.observe(el)`** so any **size change** to the header (resize, image load, font, variant swap) **calls `publish` again** without you manually tracking state.

5. **Cleanup (return function):**  
   - `ro.disconnect()` — stop observing.  
   - `document.documentElement.style.removeProperty('--home-header-offset')` — so when you **leave** Home, the **`:root` fallback** in `index.css` applies again; other pages are not stuck with a stale pixel value.

---

## 5. Order of events (mental model)

1. `HomeHeader` mounts; `<header ref={...}>` is in the DOM.
2. `useLayoutEffect` runs: `ref.current` is the header → `publish` sets `--home-header-offset`.
3. CSS applies: `.home-body-scroll`’s `padding-top` matches the real header.
4. If the header resizes, `ResizeObserver` calls `publish` again.
5. On unmount, cleanup: observer off, custom property on `<html>` removed.

---

## 6. Short glossary

| API | Role here |
|-----|-----------|
| **`useRef`** | Hold a **stable** reference to the real `<header>` element. |
| **`useLayoutEffect`** | **After** layout, **before** paint: read `offsetHeight` and set `--home-header-offset`. |
| **`ResizeObserver`** | Re-run when the header’s **size** changes (any variant or content). |
| **Effect cleanup** | On unmount: disconnect observer, remove the inline custom property. |

**Further reading (React):** [useRef](https://react.dev/reference/react/useRef), [useLayoutEffect](https://react.dev/reference/react/useLayoutEffect) — when layout measurements must be correct before the user sees a frame, `useLayoutEffect` is the usual choice.

---

## 7. What to edit in CSS vs JS

- **Figma padding** (e.g. 30 / 20): **`HomeHeader.css`** — that changes **`offsetHeight`** automatically; the hook **does not** need the numbers hard-coded.
- **Scroll gap:** **`index.css`** — `padding-top: var(--home-header-offset)` on `.home-body-scroll` (and the **fallback** `--home-header-offset` in `:root` for non-Home / before measure).

*Last updated: 2026-04-24*
