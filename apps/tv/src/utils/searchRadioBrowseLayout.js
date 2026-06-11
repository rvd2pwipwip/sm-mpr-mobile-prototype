import { getInternationalBrowseLaneRows } from "@sm-mpr/shared/data/radioInternationalBrowse.js";
import {
  INTERNATIONAL_CONTINENTS_PLANNED,
  RADIO_STATION_CATEGORIES,
  getRadioStationsByCategory,
} from "@sm-mpr/shared/data/radioStations.js";
import { SEARCH_FOCUS } from "../constants/searchFocusGroups.js";
import { getMusicSwimlaneSlotCount } from "./swimlaneUtils.js";

export const DEFAULT_RADIO_INTL_CONTINENT = "north-america";

/**
 * Focus layout for Radio browse body (stacked category swimlanes + International pills/cards).
 * @param {string} [internationalContinentSlug]
 */
export function buildSearchRadioBrowseFocusLayout(
  internationalContinentSlug = DEFAULT_RADIO_INTL_CONTINENT,
) {
  const bodyStart = SEARCH_FOCUS.bodyStart;
  /** @type {Record<number, number>} */
  const itemCounts = {};
  const swimlaneGroups = [];
  /** @type {import("./searchRadioBrowseLayout.js").RadioBrowseSection[]} */
  const sections = [];

  let groupIndex = bodyStart;

  for (const category of RADIO_STATION_CATEGORIES) {
    if (category.id === "international") {
      const pillsGroup = groupIndex;
      const cardsGroup = groupIndex + 1;
      groupIndex += 2;

      const lane = getInternationalBrowseLaneRows(internationalContinentSlug);
      itemCounts[pillsGroup] = INTERNATIONAL_CONTINENTS_PLANNED.length;
      itemCounts[cardsGroup] = getMusicSwimlaneSlotCount(lane.rows.length);
      swimlaneGroups.push(pillsGroup, cardsGroup);
      sections.push({
        kind: "international",
        categoryId: category.id,
        label: category.label,
        pillsGroup,
        cardsGroup,
        memoryKey: "search-radio-international",
      });
      continue;
    }

    const sourceCount = getRadioStationsByCategory(category.id).length;
    if (sourceCount === 0) continue;

    itemCounts[groupIndex] = getMusicSwimlaneSlotCount(sourceCount);
    swimlaneGroups.push(groupIndex);
    sections.push({
      kind: "swimlane",
      categoryId: category.id,
      label: category.label,
      groupIndex,
      sourceCount,
    });
    groupIndex += 1;
  }

  const firstBodyGroup = sections.length > 0 ? bodyStart : null;
  const lastBodyGroup = groupIndex > bodyStart ? groupIndex - 1 : null;
  const cardGroups = sections.flatMap((section) =>
    section.kind === "international"
      ? [section.cardsGroup]
      : [section.groupIndex],
  );

  return {
    groupCount: lastBodyGroup != null ? lastBodyGroup + 1 : bodyStart,
    itemCounts,
    swimlaneGroups,
    firstBodyGroup,
    lastBodyGroup,
    cardGroups,
    lastCardGroup: cardGroups[cardGroups.length - 1] ?? null,
    landingGroup: firstBodyGroup,
    sections,
  };
}

/**
 * @typedef {object} RadioSwimlaneSection
 * @property {'swimlane'} kind
 * @property {string} categoryId
 * @property {string} label
 * @property {number} groupIndex
 * @property {number} sourceCount
 */

/**
 * @typedef {object} RadioInternationalSection
 * @property {'international'} kind
 * @property {string} categoryId
 * @property {string} label
 * @property {number} pillsGroup
 * @property {number} cardsGroup
 * @property {string} memoryKey
 */

/** @typedef {RadioSwimlaneSection | RadioInternationalSection} RadioBrowseSection */
