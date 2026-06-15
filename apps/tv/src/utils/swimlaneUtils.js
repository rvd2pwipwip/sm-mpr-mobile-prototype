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

/** Listen again: capped visible tiles + trailing Clear or More slot. */
export function getListenAgainSwimlaneSlotCount(sourceCount) {
  if (sourceCount <= 0) return 0;
  const visible = Math.min(sourceCount, SWIMLANE_CARD_MAX);
  return visible + 1;
}
