import { SWIMLANE_CARD_MAX } from "../constants/swimlane.js";

export function getMusicSwimlaneSlotCount(sourceCount) {
  const visible = Math.min(sourceCount, SWIMLANE_CARD_MAX);
  const showMore = sourceCount > SWIMLANE_CARD_MAX;
  return visible + (showMore ? 1 : 0);
}

/** True when rail shows More (10+ items); otherwise trailing tile is Clear. */
export function showsListenAgainMoreTile(sourceCount) {
  return sourceCount > SWIMLANE_CARD_MAX;
}

/**
 * Listen again: focusable slots only (capped real tiles + trailing Clear or More).
 * Ghost filler tiles are visual-only and not included.
 */
export function getListenAgainSwimlaneSlotCount(sourceCount) {
  if (sourceCount <= 0) return 0;
  const visible = Math.min(sourceCount, SWIMLANE_CARD_MAX);
  return visible + 1;
}

/**
 * Non-focusable ghost tiles after real items so the row looks full while
 * Clear/More stays within the TV scrollport. Zero when More shows or row is full.
 *
 * @param {number} sourceCount — total history items (before cap)
 * @param {number} visibleSlotCapacity — from {@link getTvSwimlaneVisibleSlotCapacity}
 */
export function getListenAgainGhostCount(sourceCount, visibleSlotCapacity) {
  if (sourceCount <= 0) return 0;
  if (showsListenAgainMoreTile(sourceCount)) return 0;
  const realCount = Math.min(sourceCount, SWIMLANE_CARD_MAX);
  return Math.max(0, visibleSlotCapacity - realCount - 1);
}

/** My Library typed history: empty placeholder only; with items, capped tiles + Clear/More. */
export function getLibraryHistorySwimlaneSlotCount(sourceCount) {
  if (sourceCount <= 0) return 1;
  const visible = Math.min(sourceCount, SWIMLANE_CARD_MAX);
  return visible + 1;
}

/** True when rail shows More (10+ items); otherwise trailing tile is Clear. Empty: no trailing tile. */
export function showsLibraryHistoryMoreTile(sourceCount) {
  return sourceCount > SWIMLANE_CARD_MAX;
}

/** Episode library rails (non-empty): capped visible cards + trailing Clear or More. */
export function getEpisodeLibrarySwimlaneSlotCount(sourceCount) {
  if (sourceCount <= 0) return 0;
  const visible = Math.min(sourceCount, SWIMLANE_CARD_MAX);
  return visible + 1;
}

/** True when rail shows More (10+ items); otherwise trailing tile is Clear. */
export function showsEpisodeLibraryMoreTile(sourceCount) {
  return sourceCount > SWIMLANE_CARD_MAX;
}
