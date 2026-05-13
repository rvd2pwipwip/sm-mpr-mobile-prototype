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
