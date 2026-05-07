/**
 * Full-screen `/music/.../play` and `/podcast/.../play/...` are overlays:
 * — From browse/detail, open with `navigate(..., { replace: true, state })` so the `/play`
 *   entry swaps the current history slot (never stacks “detail → play”).
 * — Dismiss: `replace` back to `/music/:id` or `/podcast/:id` when the play route replaced detail.
 *   When opened from MiniPlayer (`expandFromMiniPlayer`, `push`), dismiss with `navigate(-1)` to restore Search/Home/etc.
 * — From MiniPlayer, open with a normal `push` so shell routes below stay intact.
 * — `expandFromMiniPlayer` in state skips guest full-screen preroll (`MiniPlayer`).
 */

/**
 * Optional `location.state` for `/play` when opened via `replace`.
 * @param {Record<string, unknown>} [extras]
 * @returns {Record<string, unknown>}
 */
export function playOverDetailNavigateState(extras = {}) {
  return { ...extras };
}
