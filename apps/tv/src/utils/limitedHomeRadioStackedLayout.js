import { getInternationalBrowseLaneRows } from "@sm-mpr/shared/data/radioInternationalBrowse.js";
import {
  INTERNATIONAL_CONTINENTS_PLANNED,
  RADIO_STATION_CATEGORIES,
  getRadioStationsByCategory,
} from "@sm-mpr/shared/data/radioStations.js";
import { DEFAULT_RADIO_INTL_CONTINENT } from "./searchRadioBrowseLayout.js";
import { getMusicSwimlaneSlotCount } from "./swimlaneUtils.js";

/** Radio format rows (excludes Near You / International). */
const RADIO_FORMAT_CATEGORIES = RADIO_STATION_CATEGORIES.filter(
  (c) => c.id !== "near-you" && c.id !== "international",
);

/**
 * @typedef {{ slotCount: number, subKind?: string }} LimitedHomeRadioFocusGroup
 * @typedef {{
 *   kind: 'near-you' | 'international' | 'format',
 *   id: string,
 *   title: string,
 *   categoryId?: string,
 *   sourceCount?: number,
 *   memoryKey?: string,
 *   focusGroups: LimitedHomeRadioFocusGroup[],
 * }} LimitedHomeRadioSection
 */

/**
 * Limited Home layout B — radio taxonomy (mobile `LimitedRadioTaxonomySwimlanes`).
 * @param {string} [internationalContinentSlug]
 */
export function buildLimitedHomeRadioStackedLayout(
  internationalContinentSlug = DEFAULT_RADIO_INTL_CONTINENT,
) {
  /** @type {LimitedHomeRadioSection[]} */
  const sections = [];

  const nearYouCategory = RADIO_STATION_CATEGORIES.find(
    (c) => c.id === "near-you",
  );
  const nearYouCount = getRadioStationsByCategory("near-you").length;
  if (nearYouCategory && nearYouCount > 0) {
    sections.push({
      kind: "near-you",
      id: "limited-radio-near-you",
      title: nearYouCategory.label,
      categoryId: "near-you",
      sourceCount: nearYouCount,
      focusGroups: [
        { slotCount: getMusicSwimlaneSlotCount(nearYouCount) },
      ],
    });
  }

  const intlCategory = RADIO_STATION_CATEGORIES.find(
    (c) => c.id === "international",
  );
  const intlLane = getInternationalBrowseLaneRows(internationalContinentSlug);
  if (intlCategory) {
    sections.push({
      kind: "international",
      id: "limited-radio-international",
      title: intlCategory.label,
      categoryId: "international",
      memoryKey: "limited-home-radio-international",
      focusGroups: [
        {
          subKind: "pills",
          slotCount: INTERNATIONAL_CONTINENTS_PLANNED.length,
        },
        {
          subKind: "cards",
          slotCount: getMusicSwimlaneSlotCount(intlLane.rows.length),
        },
      ],
    });
  }

  for (const cat of RADIO_FORMAT_CATEGORIES) {
    const sourceCount = getRadioStationsByCategory(cat.id).length;
    if (sourceCount === 0) continue;
    sections.push({
      kind: "format",
      id: `limited-radio-${cat.id}`,
      title: cat.label,
      categoryId: cat.id,
      sourceCount,
      focusGroups: [
        { slotCount: getMusicSwimlaneSlotCount(sourceCount) },
      ],
    });
  }

  const nearYouSectionIndex = sections.findIndex((s) => s.kind === "near-you");
  const intlSectionIndex = sections.findIndex(
    (s) => s.kind === "international",
  );
  const firstFormatSectionIndex = sections.findIndex((s) => s.kind === "format");

  let midStackAdAfterSectionIndex = intlSectionIndex;
  if (nearYouSectionIndex >= 0) {
    midStackAdAfterSectionIndex = intlSectionIndex;
  } else if (firstFormatSectionIndex >= 0) {
    midStackAdAfterSectionIndex = firstFormatSectionIndex;
  }

  const focusLaneCount = sections.reduce(
    (sum, section) => sum + section.focusGroups.length,
    0,
  );

  return {
    sections,
    midStackAdAfterSectionIndex,
    focusLaneCount,
  };
}

export { DEFAULT_RADIO_INTL_CONTINENT };
