import { SWIMLANE_CARD_MAX } from "../constants/swimlane.js";

export function getMusicSwimlaneSlotCount(sourceCount) {
  const visible = Math.min(sourceCount, SWIMLANE_CARD_MAX);
  const showMore = sourceCount > SWIMLANE_CARD_MAX;
  return visible + (showMore ? 1 : 0);
}
