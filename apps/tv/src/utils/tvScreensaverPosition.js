import {
  TV_SCREENSAVER_FRAME_HEIGHT,
  TV_SCREENSAVER_FRAME_WIDTH,
  TV_SCREENSAVER_SAFE_AREA_INSET,
  TV_SCREENSAVER_VIEWPORT_HEIGHT,
  TV_SCREENSAVER_VIEWPORT_WIDTH,
} from "../constants/tvPlayerScreensaver.js";

/**
 * @typedef {{ top: number; left: number }} ScreensaverPosition
 */

/**
 * @param {number} [inset]
 * @returns {{ top: number; left: number; width: number; height: number }}
 */
export function getScreensaverSafeRect(
  inset = TV_SCREENSAVER_SAFE_AREA_INSET,
  viewportWidth = TV_SCREENSAVER_VIEWPORT_WIDTH,
  viewportHeight = TV_SCREENSAVER_VIEWPORT_HEIGHT,
) {
  return {
    top: inset,
    left: inset,
    width: viewportWidth - inset * 2,
    height: viewportHeight - inset * 2,
  };
}

/**
 * Random top/left so the frame stays inside the safe rect.
 * @param {ScreensaverPosition | null | undefined} previous
 * @param {number} frameWidth
 * @param {number} frameHeight
 * @param {number} [inset]
 * @returns {ScreensaverPosition}
 */
export function pickNextScreensaverPosition(
  previous,
  frameWidth = TV_SCREENSAVER_FRAME_WIDTH,
  frameHeight = TV_SCREENSAVER_FRAME_HEIGHT,
  inset = TV_SCREENSAVER_SAFE_AREA_INSET,
) {
  const safe = getScreensaverSafeRect(inset);
  const maxLeft = safe.left + safe.width - frameWidth;
  const maxTop = safe.top + safe.height - frameHeight;

  if (maxLeft < safe.left || maxTop < safe.top) {
    return { top: safe.top, left: safe.left };
  }

  const rangeLeft = maxLeft - safe.left;
  const rangeTop = maxTop - safe.top;

  for (let attempt = 0; attempt < 12; attempt += 1) {
    const left =
      rangeLeft === 0
        ? safe.left
        : safe.left + Math.floor(Math.random() * (rangeLeft + 1));
    const top =
      rangeTop === 0
        ? safe.top
        : safe.top + Math.floor(Math.random() * (rangeTop + 1));

    if (!previous || left !== previous.left || top !== previous.top) {
      return { top, left };
    }
  }

  return { top: safe.top, left: safe.left };
}

/**
 * Returns true when a frame at `position` fits entirely inside the safe rect.
 * @param {ScreensaverPosition} position
 * @param {number} [frameWidth]
 * @param {number} [frameHeight]
 * @param {number} [inset]
 */
export function isScreensaverPositionInSafeRect(
  position,
  frameWidth = TV_SCREENSAVER_FRAME_WIDTH,
  frameHeight = TV_SCREENSAVER_FRAME_HEIGHT,
  inset = TV_SCREENSAVER_SAFE_AREA_INSET,
) {
  const safe = getScreensaverSafeRect(inset);
  const right = position.left + frameWidth;
  const bottom = position.top + frameHeight;
  return (
    position.left >= safe.left &&
    position.top >= safe.top &&
    right <= safe.left + safe.width &&
    bottom <= safe.top + safe.height
  );
}
