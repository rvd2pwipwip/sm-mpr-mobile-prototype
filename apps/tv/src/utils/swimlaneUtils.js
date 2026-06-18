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
 * Non-focusable ghost tiles after leading slots so the row looks full while
 * trailing Clear/More (if any) stays within the TV scrollport.
 *
 * @param {number} leadingSlotCount — real tiles, or 1 for an empty placeholder
 * @param {number} trailingSlotCount — 0 (empty rail) or 1 (Clear/More)
 * @param {number} visibleSlotCapacity — from {@link getTvSwimlaneVisibleSlotCapacity}
 * @param {boolean} showMoreTile — when true, no ghosts (horizontal scroll only)
 */
export function getSwimlaneTrailingGhostCount(
  leadingSlotCount,
  trailingSlotCount,
  visibleSlotCapacity,
  showMoreTile,
) {
  if (showMoreTile) return 0;
  const focusableCount = leadingSlotCount + trailingSlotCount;
  return Math.max(0, visibleSlotCapacity - focusableCount);
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
 * Non-focusable ghost tiles for Home Listen again (compact row).
 *
 * @param {number} sourceCount — total history items (before cap)
 * @param {number} visibleSlotCapacity — from {@link getTvSwimlaneVisibleSlotCapacity}
 */
export function getListenAgainGhostCount(sourceCount, visibleSlotCapacity) {
  if (sourceCount <= 0) return 0;
  return getSwimlaneTrailingGhostCount(
    Math.min(sourceCount, SWIMLANE_CARD_MAX),
    1,
    visibleSlotCapacity,
    showsListenAgainMoreTile(sourceCount),
  );
}

/**
 * My Library typed history: focusable slots only (empty placeholder, or real + Clear/More).
 * Ghost filler tiles are visual-only and not included.
 */
export function getLibraryHistorySwimlaneSlotCount(sourceCount) {
  if (sourceCount <= 0) return 1;
  const visible = Math.min(sourceCount, SWIMLANE_CARD_MAX);
  return visible + 1;
}

/**
 * Non-focusable ghost tiles for My Library typed history rails.
 *
 * @param {number} sourceCount — total history items for the segment (0 when empty)
 * @param {number} visibleSlotCapacity — from {@link getTvSwimlaneVisibleSlotCapacity}
 */
export function getLibraryHistoryGhostCount(sourceCount, visibleSlotCapacity) {
  if (sourceCount <= 0) {
    return getSwimlaneTrailingGhostCount(1, 0, visibleSlotCapacity, false);
  }
  return getSwimlaneTrailingGhostCount(
    Math.min(sourceCount, SWIMLANE_CARD_MAX),
    1,
    visibleSlotCapacity,
    showsLibraryHistoryMoreTile(sourceCount),
  );
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
