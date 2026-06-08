import {
  ALL_CONTENT_TYPES,
  CONTENT_TYPE,
} from "./contentTypes.js";

/** My Library hub section ids (order in {@link MY_LIBRARY_SECTIONS}). */
export const MY_LIBRARY_SECTION_ID = Object.freeze({
  appInfo: "app-info",
  musicHistory: "music-history",
  likedMusic: "liked-music",
  podcastHistory: "podcast-history",
  podcastUserSwimlanes: "podcast-user-swimlanes",
  radioHistory: "radio-history",
  likedRadio: "liked-radio",
});

/**
 * Broad My Library vertical stack. Gated by enabled content types from
 * {@link ContentProfileProvider}.
 * @type {readonly { id: string, contentTypes: readonly string[] }[]}
 */
export const MY_LIBRARY_SECTIONS = Object.freeze([
  {
    id: MY_LIBRARY_SECTION_ID.appInfo,
    contentTypes: ALL_CONTENT_TYPES,
  },
  {
    id: MY_LIBRARY_SECTION_ID.musicHistory,
    contentTypes: Object.freeze([CONTENT_TYPE.music]),
  },
  {
    id: MY_LIBRARY_SECTION_ID.likedMusic,
    contentTypes: Object.freeze([CONTENT_TYPE.music]),
  },
  {
    id: MY_LIBRARY_SECTION_ID.podcastHistory,
    contentTypes: Object.freeze([CONTENT_TYPE.podcasts]),
  },
  {
    id: MY_LIBRARY_SECTION_ID.podcastUserSwimlanes,
    contentTypes: Object.freeze([CONTENT_TYPE.podcasts]),
  },
  {
    id: MY_LIBRARY_SECTION_ID.radioHistory,
    contentTypes: Object.freeze([CONTENT_TYPE.radio]),
  },
  {
    id: MY_LIBRARY_SECTION_ID.likedRadio,
    contentTypes: Object.freeze([CONTENT_TYPE.radio]),
  },
]);

/**
 * @param {{ id: string, contentTypes: readonly string[] }} section
 * @param {readonly string[]} enabledContentTypes
 */
export function isMyLibrarySectionVisible(section, enabledContentTypes) {
  return section.contentTypes.some((ct) => enabledContentTypes.includes(ct));
}

/**
 * @param {readonly string[]} enabledContentTypes
 */
export function getVisibleMyLibrarySections(enabledContentTypes) {
  return MY_LIBRARY_SECTIONS.filter((section) =>
    isMyLibrarySectionVisible(section, enabledContentTypes),
  );
}
