import { SWIMLANE_CARD_MAX } from "../constants/swimlane.js";

export function getMusicSwimlaneSlotCount(sourceCount) {
  const visible = Math.min(sourceCount, SWIMLANE_CARD_MAX);
  const showMore = sourceCount > SWIMLANE_CARD_MAX;
  return visible + (showMore ? 1 : 0);
}

/** Listen again: capped visible tiles + always a More slot when any history exists. */
export function getListenAgainSwimlaneSlotCount(sourceCount) {
  if (sourceCount <= 0) return 0;
  const visible = Math.min(sourceCount, SWIMLANE_CARD_MAX);
  return visible + 1;
}
