import {
  PODCAST_CATEGORIES,
  getPodcastsByCategory,
} from "@sm-mpr/shared/data/podcasts.js";
import { SEARCH_FOCUS } from "../constants/searchFocusGroups.js";
import { getMusicSwimlaneSlotCount } from "./swimlaneUtils.js";

/**
 * Focus layout for Podcasts browse body (one horizontal swimlane per category).
 */
export function buildSearchPodcastsBrowseFocusLayout() {
  const bodyStart = SEARCH_FOCUS.bodyStart;
  const categories = PODCAST_CATEGORIES.filter(
    (cat) => getPodcastsByCategory(cat.id).length > 0,
  ).map((cat) => ({
    id: cat.id,
    label: cat.label,
    sourceCount: getPodcastsByCategory(cat.id).length,
  }));

  /** @type {Record<number, number>} */
  const itemCounts = {};
  const swimlaneGroups = [];
  const cardGroups = [];

  categories.forEach((category, index) => {
    const groupIndex = bodyStart + index;
    itemCounts[groupIndex] = getMusicSwimlaneSlotCount(category.sourceCount);
    swimlaneGroups.push(groupIndex);
    cardGroups.push(groupIndex);
  });

  const firstBodyGroup = categories.length > 0 ? bodyStart : null;
  const lastBodyGroup =
    categories.length > 0 ? bodyStart + categories.length - 1 : null;

  return {
    groupCount: lastBodyGroup != null ? lastBodyGroup + 1 : bodyStart,
    itemCounts,
    swimlaneGroups,
    firstBodyGroup,
    lastBodyGroup,
    cardGroups,
    lastCardGroup: lastBodyGroup,
    landingGroup: firstBodyGroup,
    categories,
  };
}
