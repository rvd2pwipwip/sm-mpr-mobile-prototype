/**
 * Vertical parked-focus geometry (Phase A).
 * Transpose of VariableSwimlane horizontal parking: keep focus ring top on parkY,
 * scroll content via translateY until top/bottom end conditions.
 *
 * @see docs/tv/vertical-parked-navigation.md
 */

/** Default: `--tv-focus-ring-width` (10) + `--tv-focus-ring-gap` (4). */
export const TV_FOCUS_RING_INSET_FALLBACK_PX = 14;

/**
 * Element that actually draws the TV focus ring (thumb-wrap), when present.
 * @param {HTMLElement | null} focusEl
 */
export function resolveTvFocusRingElement(focusEl) {
  if (!focusEl) return null;
  if (focusEl.matches?.(".tv-content-tile__thumb-wrap")) {
    return focusEl;
  }
  const thumbWrap = focusEl.querySelector?.(".tv-content-tile__thumb-wrap");
  if (thumbWrap instanceof HTMLElement) {
    return thumbWrap;
  }
  if (focusEl.matches?.(".tv-search-label-tile")) {
    return focusEl;
  }
  return focusEl;
}

const PARK_DOWN_BIAS_FALLBACK_PX = 60;
const SCROLL_AD_RESERVE_FALLBACK_PX = 0;

function readCssPx(element, token, fallback) {
  if (!element) return fallback;
  const raw = getComputedStyle(element).getPropertyValue(token);
  const parsed = parseFloat(raw);
  return Number.isFinite(parsed) ? parsed : fallback;
}

/**
 * Top of the focus ring in scrollport coordinates (leading edge / park line).
 * @param {number} rectTop - `getBoundingClientRect().top` of the focused control
 * @param {number} ringInsetPx - outline width + outline-offset (outside the box)
 */
export function calcFocusRingTopFromRect(rectTop, ringInsetPx) {
  return rectTop - ringInsetPx;
}

/**
 * Focus ring top in content coordinates (inner column, before translateY).
 * @param {number} ringTopScrollport
 * @param {number} offsetY - current `translateY` applied to inner (positive = scrolled down)
 */
export function calcFocusRingTopInContent(ringTopScrollport, offsetY) {
  return ringTopScrollport + offsetY;
}

/**
 * Scroll offset so the focused ring top sits on the park line (scrollport Y).
 * @param {number} focusRingTopInContent
 * @param {number} parkLineY - fixed viewport Y of ring top for this screen visit
 */
export function calcParkedScrollOffsetY(focusRingTopInContent, parkLineY) {
  return focusRingTopInContent - parkLineY;
}

/**
 * @param {number} innerScrollHeight
 * @param {number} viewportHeight
 */
export function calcMaxScrollOffsetY(innerScrollHeight, viewportHeight) {
  if (viewportHeight <= 0) return 0;
  return Math.max(0, innerScrollHeight - viewportHeight);
}

/**
 * Smallest offset where layout bottom (+ optional extra bottom padding) is in view
 * with `downBiasPx` empty space below the layout bottom inside the scrollport.
 *
 * @param {number} innerScrollHeight - includes padding-bottom (e.g. ad reserve)
 * @param {number} viewportHeight
 * @param {number} downBiasPx - `--tv-scroll-park-down-bias`
 * @param {number} [extraBottomPx=0] - additional buffer if not already in scrollHeight
 */
export function calcMinScrollOffsetForBottomEnd(
  innerScrollHeight,
  viewportHeight,
  downBiasPx,
  extraBottomPx = 0,
) {
  const contentBottom = innerScrollHeight + extraBottomPx;
  return Math.max(0, contentBottom - viewportHeight + downBiasPx);
}

/**
 * @param {number} offsetY
 * @param {number} maxOffsetY
 * @param {number} [minOffsetY=0]
 */
export function clampScrollOffsetY(offsetY, maxOffsetY, minOffsetY = 0) {
  return Math.min(Math.max(offsetY, minOffsetY), Math.max(0, maxOffsetY));
}

/** Read focus ring outward inset from a focused element or `:root` tokens. */
export function getTvFocusRingInsetPx(element) {
  const target = element ?? document.documentElement;
  const width = readCssPx(target, "--tv-focus-ring-width", 10);
  const gap = readCssPx(target, "--tv-focus-ring-gap", 4);
  return width + gap;
}

/**
 * Focus ring top relative to the scrollport top edge (viewport coords within scrollport).
 * @param {HTMLElement} focusEl
 * @param {HTMLElement} scrollportEl - e.g. `.tv-home__scroll`
 */
export function getFocusRingTopInScrollport(focusEl, scrollportEl) {
  const ringEl = resolveTvFocusRingElement(focusEl) ?? focusEl;
  const inset = getTvFocusRingInsetPx(ringEl);
  const focusRect = ringEl.getBoundingClientRect();
  const scrollportRect = scrollportEl.getBoundingClientRect();
  return calcFocusRingTopFromRect(
    focusRect.top - scrollportRect.top,
    inset,
  );
}

/**
 * Focus ring top in content space (inner column coordinates).
 */
export function getFocusRingTopInContent(focusEl, scrollportEl, offsetY) {
  const ringTopScrollport = getFocusRingTopInScrollport(focusEl, scrollportEl);
  return calcFocusRingTopInContent(ringTopScrollport, offsetY);
}

/** `--tv-scroll-park-down-bias` from scrollport or root. */
export function getTvScrollParkDownBiasPx(scrollportEl) {
  return readCssPx(
    scrollportEl ?? document.documentElement,
    "--tv-scroll-park-down-bias",
    PARK_DOWN_BIAS_FALLBACK_PX,
  );
}

/** `--tv-scroll-ad-reserve` (optional extra bottom padding on scroll inners). */
export function getTvScrollAdReservePx(element) {
  return readCssPx(
    element ?? document.documentElement,
    "--tv-scroll-ad-reserve",
    SCROLL_AD_RESERVE_FALLBACK_PX,
  );
}

/**
 * Metrics bundle for vertical parking (hook Phase B).
 * @param {HTMLElement} scrollportEl
 * @param {HTMLElement} innerEl
 * @param {number} currentOffsetY
 */
export function getVerticalScrollMetrics(
  scrollportEl,
  innerEl,
  currentOffsetY,
) {
  const viewportHeight = scrollportEl.clientHeight;
  const innerScrollHeight = innerEl.scrollHeight;
  const maxOffsetY = calcMaxScrollOffsetY(
    innerScrollHeight,
    viewportHeight,
  );
  const downBiasPx = getTvScrollParkDownBiasPx(scrollportEl);
  const minOffsetForBottomEnd = calcMinScrollOffsetForBottomEnd(
    innerScrollHeight,
    viewportHeight,
    downBiasPx,
  );

  return {
    viewportHeight,
    innerScrollHeight,
    maxOffsetY,
    downBiasPx,
    scrollAdReservePx: getTvScrollAdReservePx(innerEl),
    minOffsetForBottomEnd,
    currentOffsetY,
    isAtTopEnd: currentOffsetY <= 0,
    isAtBottomEnd: currentOffsetY >= minOffsetForBottomEnd,
  };
}

/**
 * Capture park line Y for a screen visit (call once after landing focus is in DOM).
 * @returns {number | null}
 */
export function measureParkLineY(focusEl, scrollportEl) {
  if (!focusEl || !scrollportEl) return null;
  const top = getFocusRingTopInScrollport(focusEl, scrollportEl);
  return Number.isFinite(top) ? top : null;
}
