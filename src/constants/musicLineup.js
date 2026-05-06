/**
 * Music catalog scale for Search & Browse (territory proxy in the prototype).
 *
 * - `limited` ≈ ~150-channel territories (genre grid at top).
 * - `broad` ≈ 1000+ territories (Genre / Activity / Mood / Era / Theme pillars).
 *
 * Real product would derive this from geo; here it is driven by demo state only.
 */

export const MUSIC_LINEUP = {
  limited: "limited",
  broad: "broad",
};

/** @param {string} mode */
export function musicLineupLabel(mode) {
  if (mode === MUSIC_LINEUP.broad) return "Broad (~1000+ channels)";
  return "Limited (~150 channels)";
}
