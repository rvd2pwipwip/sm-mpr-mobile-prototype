import { SEARCH_RESULT_LANE } from "@sm-mpr/shared/constants/productProfile.js";
import {
  normalizeSearchNeedle,
  searchEpisodeRows,
  searchMatchingMusicTagLabels,
  searchMusicArtists,
  searchMusicChannels,
  searchPodcasts,
  searchRadioStations,
} from "@sm-mpr/shared/search/searchCatalog.js";

export const CATALOG_MORE_LANE_LABELS = Object.freeze({
  [SEARCH_RESULT_LANE.channels]: "Channels",
  [SEARCH_RESULT_LANE.artists]: "Artists",
  [SEARCH_RESULT_LANE.tags]: "Tags",
  [SEARCH_RESULT_LANE.podcasts]: "Podcasts",
  [SEARCH_RESULT_LANE.episodes]: "Episodes",
  [SEARCH_RESULT_LANE.radio]: "Radio",
});

/** @type {readonly string[]} */
export const CATALOG_MORE_VALID_LANES = Object.freeze([
  SEARCH_RESULT_LANE.channels,
  SEARCH_RESULT_LANE.artists,
  SEARCH_RESULT_LANE.tags,
  SEARCH_RESULT_LANE.podcasts,
  SEARCH_RESULT_LANE.episodes,
  SEARCH_RESULT_LANE.radio,
]);

/**
 * @param {string | null} rawLane
 * @param {readonly string[]} enabledLanes
 */
export function resolveCatalogMoreLane(rawLane, enabledLanes) {
  const requested =
    rawLane && CATALOG_MORE_VALID_LANES.includes(rawLane)
      ? rawLane
      : SEARCH_RESULT_LANE.channels;
  const laneAllowed = enabledLanes.includes(requested);
  const activeLane = laneAllowed
    ? requested
    : (enabledLanes[0] ?? SEARCH_RESULT_LANE.channels);
  return { requested, laneAllowed, activeLane };
}

/**
 * @param {string} lane
 * @param {string} needle normalized lowercase
 */
export function getCatalogMoreItems(lane, needle) {
  if (!needle) return [];

  switch (lane) {
    case SEARCH_RESULT_LANE.channels:
      return searchMusicChannels(needle);
    case SEARCH_RESULT_LANE.artists:
      return searchMusicArtists(needle);
    case SEARCH_RESULT_LANE.tags:
      return searchMatchingMusicTagLabels(needle).map((label) => ({
        id: label,
        label,
      }));
    case SEARCH_RESULT_LANE.podcasts:
      return searchPodcasts(needle);
    case SEARCH_RESULT_LANE.episodes:
      return searchEpisodeRows(needle);
    case SEARCH_RESULT_LANE.radio:
      return searchRadioStations(needle);
    default:
      return [];
  }
}

/**
 * @param {string} rawQuery
 * @returns {string}
 */
export function normalizeCatalogMoreNeedle(rawQuery) {
  return normalizeSearchNeedle(rawQuery);
}
