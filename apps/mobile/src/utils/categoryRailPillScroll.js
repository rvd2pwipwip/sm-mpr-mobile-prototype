/** Ease-out cubic: stronger deceleration at the end of the scroll (~280ms). */
export function easeOutCubic(t) {
  return 1 - (1 - t) ** 3;
}

export const CATEGORY_PILL_SCROLL_MS = 280;

/** DOM marker on each pill; keep in sync with CategoryPillsRail buttons. */
export const CATEGORY_PILL_DATA_ATTR = "data-category-pill";

/**
 * Target scrollLeft for the active pill; respects inner row padding (category gutters).
 * @param {HTMLElement | null} scrollEl Category strip overflow-x scrollport
 * @param {string | number | null | undefined} slug Selected pill id
 * @param {{ slug: string }[]} rows Ordered pills (first/middle/last alignment rules)
 * @returns {number | null}
 */
export function computeCategoryPillTargetScrollLeft(scrollEl, slug, rows) {
  if (!scrollEl || slug == null || rows.length === 0) return null;
  const raw = String(slug);
  const escaped =
    typeof CSS !== "undefined" && typeof CSS.escape === "function"
      ? CSS.escape(raw)
      : raw.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  const pillEl = scrollEl.querySelector(`[${CATEGORY_PILL_DATA_ATTR}="${escaped}"]`);
  if (!pillEl) return null;

  const idx = rows.findIndex((r) => r.slug === raw);
  if (idx < 0) return null;

  const inner = scrollEl.querySelector(".content-swimlane__categories-inner");
  if (!inner) return null;

  const innerCs = getComputedStyle(inner);
  const padStart = parseFloat(innerCs.paddingInlineStart) || 0;
  const padEnd = parseFloat(innerCs.paddingInlineEnd) || 0;

  const pillRect = pillEl.getBoundingClientRect();
  const scrollRect = scrollEl.getBoundingClientRect();

  const maxScroll = Math.max(0, scrollEl.scrollWidth - scrollEl.clientWidth);

  let delta = 0;
  if (idx <= 0) {
    delta = pillRect.left - scrollRect.left - padStart;
  } else if (idx >= rows.length - 1) {
    delta = pillRect.right - scrollRect.right + padEnd;
  } else {
    const pillMid = pillRect.left + pillRect.width / 2;
    const portMid = scrollRect.left + scrollRect.width / 2;
    delta = pillMid - portMid;
  }

  const rawNext = scrollEl.scrollLeft + delta;
  return Math.max(0, Math.min(maxScroll, rawNext));
}

/**
 * Animate scrollLeft to target with ease-out deceleration (cancel prior runs via returned cleanup).
 * @returns {(() => void) | undefined}
 */
export function startAnimatedCategoryPillScroll(scrollEl, targetLeft) {
  const maxScroll = Math.max(0, scrollEl.scrollWidth - scrollEl.clientWidth);
  const clamped = Math.max(0, Math.min(maxScroll, targetLeft));

  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReduced) {
    scrollEl.scrollLeft = clamped;
    return undefined;
  }

  const start = scrollEl.scrollLeft;
  const delta = clamped - start;
  if (Math.abs(delta) < 2) {
    scrollEl.scrollLeft = clamped;
    return undefined;
  }

  const durationMs = CATEGORY_PILL_SCROLL_MS;
  const startTime = performance.now();
  let frameId = 0;

  function tick(now) {
    const elapsed = now - startTime;
    const t = Math.min(1, elapsed / durationMs);
    scrollEl.scrollLeft = start + delta * easeOutCubic(t);
    if (t < 1) {
      frameId = requestAnimationFrame(tick);
    } else {
      scrollEl.scrollLeft = clamped;
    }
  }

  frameId = requestAnimationFrame(tick);

  return () => {
    cancelAnimationFrame(frameId);
    scrollEl.scrollLeft = clamped;
  };
}

/** Padding-aware scrollLeft before paint (no tween). Navigate-back / remount / layout churn. */
export function snapCategoryPillIntoScroll(scrollEl, slug, rows) {
  const target = computeCategoryPillTargetScrollLeft(scrollEl, slug, rows);
  if (target !== null) scrollEl.scrollLeft = target;
}

/** Animated alignment only after user taps a different pill; returns cancel */
export function animateCategoryPillIntoScroll(scrollEl, slug, rows) {
  const target = computeCategoryPillTargetScrollLeft(scrollEl, slug, rows);
  if (target === null) return undefined;
  return startAnimatedCategoryPillScroll(scrollEl, target);
}
