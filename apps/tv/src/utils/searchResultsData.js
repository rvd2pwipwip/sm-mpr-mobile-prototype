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

/** Lane order matches mobile {@link SearchResultsPanel}. */
export const SEARCH_RESULT_LANE_ORDER = Object.freeze([
  SEARCH_RESULT_LANE.channels,
  SEARCH_RESULT_LANE.artists,
  SEARCH_RESULT_LANE.tags,
  SEARCH_RESULT_LANE.podcasts,
  SEARCH_RESULT_LANE.episodes,
  SEARCH_RESULT_LANE.radio,
]);

/**
 * @param {string} debouncedQuery
 * @param {readonly string[]} enabledSearchResultLanes
 */
export function computeSearchResults(debouncedQuery, enabledSearchResultLanes) {
  const needle = normalizeSearchNeedle(debouncedQuery);
  const laneSet = new Set(enabledSearchResultLanes);

  const show = (lane) => laneSet.has(lane) && needle.length > 0;

  const channels = show(SEARCH_RESULT_LANE.channels)
    ? searchMusicChannels(needle)
    : [];
  const artists = show(SEARCH_RESULT_LANE.artists)
    ? searchMusicArtists(needle)
    : [];
  const tagLabels = show(SEARCH_RESULT_LANE.tags)
    ? searchMatchingMusicTagLabels(needle)
    : [];
  const podcasts = show(SEARCH_RESULT_LANE.podcasts)
    ? searchPodcasts(needle)
    : [];
  const episodeRows = show(SEARCH_RESULT_LANE.episodes)
    ? searchEpisodeRows(needle)
    : [];
  const radioStations = show(SEARCH_RESULT_LANE.radio)
    ? searchRadioStations(needle)
    : [];

  const anyHits =
    channels.length > 0 ||
    artists.length > 0 ||
    tagLabels.length > 0 ||
    podcasts.length > 0 ||
    episodeRows.length > 0 ||
    radioStations.length > 0;

  return {
    needle,
    channels,
    artists,
    tagLabels,
    podcasts,
    episodeRows,
    radioStations,
    anyHits,
  };
}
