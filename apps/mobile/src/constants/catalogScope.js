import { MUSIC_LINEUP } from "./musicLineup.js";

/**
 * IA / navigation variant for catalog breadth (prototype).
 * Values match `musicLineupMode` today; real product might derive both from geo independently.
 *
 * - `broad` — full catalog (e.g. My Library tab, vibe/tag browse).
 * - `limited` — smaller catalog (e.g. Info tab; user content surfaced under Browse).
 */
export const CATALOG_SCOPE = {
  limited: MUSIC_LINEUP.limited,
  broad: MUSIC_LINEUP.broad,
};

/** @param {string} musicLineupMode */
export function catalogScopeFromMusicLineup(musicLineupMode) {
  return musicLineupMode === MUSIC_LINEUP.broad ? CATALOG_SCOPE.broad : CATALOG_SCOPE.limited;
}

/** Prototype only: persist lineup / catalog scope across refresh (session tab). */
export const PROTOTYPE_MUSIC_LINEUP_STORAGE_KEY = "sm-mpr-prototype-music-lineup-mode";

/** @returns {'limited' | 'broad' | null} */
export function readStoredMusicLineupMode() {
  if (typeof sessionStorage === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(PROTOTYPE_MUSIC_LINEUP_STORAGE_KEY);
    if (raw === MUSIC_LINEUP.limited || raw === MUSIC_LINEUP.broad) return raw;
  } catch {
    /* quota / private mode */
  }
  return null;
}

/** @param {string} mode */
export function writeStoredMusicLineupMode(mode) {
  if (typeof sessionStorage === "undefined") return;
  try {
    sessionStorage.setItem(PROTOTYPE_MUSIC_LINEUP_STORAGE_KEY, mode);
  } catch {
    /* ignore */
  }
}
