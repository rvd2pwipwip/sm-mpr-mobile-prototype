import { MUSIC_LINEUP } from "@sm-mpr/shared/constants/musicLineup.js";
import {
  BROAD_VIBES,
  getBroadSubsMeta,
  getChildTagsForBroadVibe,
} from "@sm-mpr/shared/data/musicBrowseTaxonomy.js";
import {
  getLimitedMusicChannelsByCategory,
  getLimitedMusicGenres,
  getMusicChannelsByCategory,
  getMusicChannelsWithTag,
} from "@sm-mpr/shared/data/musicChannels.js";
import { SEARCH_FOCUS } from "../constants/searchFocusGroups.js";
import { getMusicSwimlaneSlotCount } from "./swimlaneUtils.js";

/**
 * Leaf channel count for a broad vibe pill row (for swimlane slot math).
 * @param {{ kind?: string, id?: string, label: string, hasSubs?: boolean, tagLabel?: string }} row
 */
function leafChannelCountForRow(row) {
  if (!row || row.hasSubs) return 0;
  if (row.kind === "genre") {
    if (row.id) return getMusicChannelsByCategory(row.id).length;
    return getMusicChannelsWithTag(row.label).length;
  }
  return getMusicChannelsWithTag(row.tagLabel ?? row.label).length;
}

/**
 * Card-row slot count for one broad vibe section (subs tiles or channel swimlane + More).
 * @param {string} vibeId
 * @param {string} selectedSlug
 */
export function getBroadVibeCardsSlotCount(vibeId, selectedSlug) {
  const pillRows = getChildTagsForBroadVibe(vibeId);
  const selectedRow = pillRows.find((r) => r.slug === selectedSlug);
  if (!selectedRow) return 0;

  if (selectedRow.hasSubs) {
    const meta = getBroadSubsMeta(vibeId, selectedSlug);
    return meta?.subs?.length ?? 0;
  }

  return getMusicSwimlaneSlotCount(leafChannelCountForRow(selectedRow));
}

/**
 * Focus layout for music browse body (groups start at {@link SEARCH_FOCUS.bodyStart}).
 * @param {string} musicLineupMode
 * @param {Record<string, string>} [vibeSelections] vibeId -> selected pill slug
 */
export function buildSearchMusicBrowseFocusLayout(
  musicLineupMode,
  vibeSelections = {},
) {
  const bodyStart = SEARCH_FOCUS.bodyStart;

  if (musicLineupMode === MUSIC_LINEUP.limited) {
    const genres = getLimitedMusicGenres();
    const groupIndex = bodyStart;
    return {
      groupCount: groupIndex + 1,
      itemCounts: { [groupIndex]: genres.length },
      swimlaneGroups: [groupIndex],
      firstBodyGroup: groupIndex,
      lastBodyGroup: groupIndex,
      cardGroups: [groupIndex],
      pillsGroups: [],
      lastCardGroup: groupIndex,
      /** First card swimlane — genre tiles (parked-focus landing). */
      landingGroup: groupIndex,
      limitedGenres: genres,
      vibeSections: [],
    };
  }

  /** @type {Record<number, number>} */
  const itemCounts = {};
  const swimlaneGroups = [];
  const vibeSections = [];

  BROAD_VIBES.forEach((vibe, index) => {
    const pillsGroup = bodyStart + index * 2;
    const cardsGroup = bodyStart + index * 2 + 1;
    const pillRows = getChildTagsForBroadVibe(vibe.id);
    const selectedSlug =
      vibeSelections[vibe.id] ??
      pillRows.find((r) => r.slug === (vibe.id === "genre" ? "pop" : undefined))
        ?.slug ??
      pillRows[0]?.slug ??
      "";

    itemCounts[pillsGroup] = pillRows.length;
    itemCounts[cardsGroup] = getBroadVibeCardsSlotCount(vibe.id, selectedSlug);
    swimlaneGroups.push(pillsGroup, cardsGroup);
    vibeSections.push({
      vibeId: vibe.id,
      title: vibe.label,
      memoryKey: `search-music-${vibe.id}`,
      preferredSlug: vibe.id === "genre" ? "pop" : undefined,
      pillsGroup,
      cardsGroup,
    });
  });

  const lastBodyGroup = bodyStart + BROAD_VIBES.length * 2 - 1;
  const firstCardsGroup = bodyStart + 1;
  const pillsGroups = BROAD_VIBES.map((_, index) => bodyStart + index * 2);
  const cardGroups = BROAD_VIBES.map((_, index) => bodyStart + index * 2 + 1);
  const lastCardGroup = cardGroups[cardGroups.length - 1] ?? bodyStart;

  return {
    groupCount: lastBodyGroup + 1,
    itemCounts,
    swimlaneGroups,
    firstBodyGroup: bodyStart,
    lastBodyGroup,
    pillsGroups,
    cardGroups,
    lastCardGroup,
    /** First card row (below Genre pills) — parked-focus landing. */
    landingGroup:
      (itemCounts[firstCardsGroup] ?? 0) > 0
        ? firstCardsGroup
        : bodyStart,
    limitedGenres: null,
    vibeSections,
  };
}
