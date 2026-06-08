import {
  ALL_CONTENT_TYPES,
  CONTENT_TYPE,
  MUSIC_ONLY_CONTENT_TYPES,
} from "./contentTypes.js";

/** Prototype content-profile modes (see `ContentProfileProvider`). */
export const CONTENT_PROFILE_MODE = Object.freeze({
  musicOnly: "music-only",
  fullMpr: "full-mpr",
});

/** Default for demos until stakeholders re-enable full MPR globally. */
export const DEFAULT_CONTENT_PROFILE_MODE = CONTENT_PROFILE_MODE.musicOnly;

/**
 * @param {string} mode
 * @returns {readonly string[]}
 */
export function enabledContentTypesForMode(mode) {
  return mode === CONTENT_PROFILE_MODE.fullMpr
    ? ALL_CONTENT_TYPES
    : MUSIC_ONLY_CONTENT_TYPES;
}

/**
 * @param {string} contentType
 * @param {readonly string[]} enabledTypes
 */
export function isContentTypeEnabled(contentType, enabledTypes) {
  return enabledTypes.includes(contentType);
}

/**
 * @param {readonly { id: string, label: string }[]} tabs
 * @param {readonly string[]} enabledTypes
 */
export function filterBrowseTabsByProfile(tabs, enabledTypes) {
  return tabs.filter((tab) => enabledTypes.includes(tab.id));
}

/** True when Music / Podcasts / Radio strip should render. */
export function shouldShowBrowseContentSwitcher(enabledTypes) {
  return filterBrowseTabsByProfile(
    [
      { id: CONTENT_TYPE.music },
      { id: CONTENT_TYPE.podcasts },
      { id: CONTENT_TYPE.radio },
    ],
    enabledTypes,
  ).length > 1;
}

/**
 * Maps listen-history `kind` to content-type id.
 * @param {string} kind
 */
export function listenHistoryKindToContentType(kind) {
  if (kind === "podcast") return CONTENT_TYPE.podcasts;
  if (kind === "radio") return CONTENT_TYPE.radio;
  return CONTENT_TYPE.music;
}

/**
 * @template {{ kind: string }} T
 * @param {readonly T[]} items
 * @param {readonly string[]} enabledTypes
 * @returns {T[]}
 */
export function filterListenHistoryByProfile(items, enabledTypes) {
  return items.filter((item) =>
    isContentTypeEnabled(
      listenHistoryKindToContentType(item.kind),
      enabledTypes,
    ),
  );
}

/** Search result lane ids gated by profile (prototype). */
export const SEARCH_RESULT_LANE = Object.freeze({
  channels: "channels",
  artists: "artists",
  tags: "tags",
  podcasts: "podcasts",
  episodes: "episodes",
  radio: "radio",
});

const SEARCH_LANE_CONTENT_TYPE = Object.freeze({
  [SEARCH_RESULT_LANE.channels]: CONTENT_TYPE.music,
  [SEARCH_RESULT_LANE.artists]: CONTENT_TYPE.music,
  [SEARCH_RESULT_LANE.tags]: CONTENT_TYPE.music,
  [SEARCH_RESULT_LANE.podcasts]: CONTENT_TYPE.podcasts,
  [SEARCH_RESULT_LANE.episodes]: CONTENT_TYPE.podcasts,
  [SEARCH_RESULT_LANE.radio]: CONTENT_TYPE.radio,
});

/**
 * @param {readonly string[]} enabledTypes
 * @returns {string[]}
 */
export function enabledSearchResultLanes(enabledTypes) {
  return Object.values(SEARCH_RESULT_LANE).filter((lane) =>
    isContentTypeEnabled(SEARCH_LANE_CONTENT_TYPE[lane], enabledTypes),
  );
}
