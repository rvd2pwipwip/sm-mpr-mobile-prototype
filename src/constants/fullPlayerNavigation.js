/**
 * Full-screen `/play` overlays list/detail underneath. When minimizing, we must
 * not `replace` to the same URL as the detail already in history — that duplicates
 * the `/podcast/:id` (or `/music/:id`) entry and breaks “Back” on the detail screen.
 *
 * Entries that stacked play on detail pass {@link playOverDetailNavigateState}.
 */

export const PLAY_OVER_DETAIL = "fullPlayerOverDetail";

/**
 * @param {Record<string, unknown>} [extras] merged into `state` (e.g. `{ expandFromMiniPlayer: true }`).
 * @returns {Record<string, unknown>}
 */
export function playOverDetailNavigateState(extras = {}) {
  return { ...extras, [PLAY_OVER_DETAIL]: true };
}
