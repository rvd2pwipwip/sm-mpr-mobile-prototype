import { CONTENT_PROFILE_MODE } from "./productProfile.js";

/** Prototype: music-only vs full MPR; persisted per browser tab. */
export const PROTOTYPE_CONTENT_PROFILE_STORAGE_KEY =
  "sm-mpr-prototype-content-profile";

/** @returns {typeof CONTENT_PROFILE_MODE[keyof typeof CONTENT_PROFILE_MODE] | null} */
export function readStoredContentProfileMode() {
  if (typeof sessionStorage === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(PROTOTYPE_CONTENT_PROFILE_STORAGE_KEY);
    if (raw === CONTENT_PROFILE_MODE.musicOnly) return raw;
    if (raw === CONTENT_PROFILE_MODE.fullMpr) return raw;
  } catch {
    /* quota / private mode */
  }
  return null;
}

/** @param {string} mode */
export function writeStoredContentProfileMode(mode) {
  if (typeof sessionStorage === "undefined") return;
  try {
    sessionStorage.setItem(PROTOTYPE_CONTENT_PROFILE_STORAGE_KEY, mode);
  } catch {
    /* ignore */
  }
}
