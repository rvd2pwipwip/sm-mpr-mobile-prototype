import { SEARCH_RESULT_LANE } from "@sm-mpr/shared/constants/productProfile.js";
import { SEARCH_FOCUS } from "../constants/searchFocusGroups.js";
import { getMusicSwimlaneSlotCount } from "./swimlaneUtils.js";
import { SEARCH_RESULT_LANE_ORDER } from "./searchResultsData.js";

/**
 * @param {import("./searchResultsData.js").computeSearchResults extends (...args: any[]) => infer R ? R : never} results
 */
function laneSourceCount(laneId, results) {
  switch (laneId) {
    case SEARCH_RESULT_LANE.channels:
      return results.channels.length;
    case SEARCH_RESULT_LANE.artists:
      return results.artists.length;
    case SEARCH_RESULT_LANE.tags:
      return results.tagLabels.length;
    case SEARCH_RESULT_LANE.podcasts:
      return results.podcasts.length;
    case SEARCH_RESULT_LANE.episodes:
      return results.episodeRows.length;
    case SEARCH_RESULT_LANE.radio:
      return results.radioStations.length;
    default:
      return 0;
  }
}

/**
 * Focus layout for live search result swimlanes (groups from {@link SEARCH_FOCUS.bodyStart}).
 * @param {ReturnType<import("./searchResultsData.js").computeSearchResults>} results
 */
export function buildSearchResultsFocusLayout(results) {
  const bodyStart = SEARCH_FOCUS.bodyStart;
  let nextGroup = bodyStart;
  /** @type {Record<number, number>} */
  const itemCounts = {};
  const swimlaneGroups = [];
  /** @type {{ laneId: string, groupIndex: number }[]} */
  const lanes = [];

  for (const laneId of SEARCH_RESULT_LANE_ORDER) {
    const sourceCount = laneSourceCount(laneId, results);
    if (sourceCount === 0) continue;

    const groupIndex = nextGroup;
    nextGroup += 1;

    const slotCount = getMusicSwimlaneSlotCount(sourceCount);

    itemCounts[groupIndex] = slotCount;
    swimlaneGroups.push(groupIndex);
    lanes.push({ laneId, groupIndex });
  }

  const firstBodyGroup = lanes[0]?.groupIndex ?? null;
  const lastBodyGroup = lanes[lanes.length - 1]?.groupIndex ?? null;

  return {
    groupCount: nextGroup,
    itemCounts,
    swimlaneGroups,
    firstBodyGroup,
    lastBodyGroup,
    landingGroup: firstBodyGroup,
    lanes,
  };
}
