import {
  TV_SCREENSAVER_IDLE_MS_APP,
  TV_SCREENSAVER_IDLE_MS_PLAYER,
} from "../constants/tvPlayerScreensaver.js";

export const TV_FULL_PLAYER_PATH =
  /^\/music\/[^/]+\/play\/?$|^\/podcast\/[^/]+\/play\/[^/]+\/?$|^\/radio\/[^/]+\/play\/?$/;

/** @param {string} pathname */
export function isTvFullPlayerRoute(pathname) {
  return TV_FULL_PLAYER_PATH.test(pathname);
}

/** @param {string} pathname */
export function getTvScreensaverIdleMs(pathname) {
  return isTvFullPlayerRoute(pathname)
    ? TV_SCREENSAVER_IDLE_MS_PLAYER
    : TV_SCREENSAVER_IDLE_MS_APP;
}
