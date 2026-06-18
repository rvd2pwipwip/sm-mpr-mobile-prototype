import { CONTENT_TYPE } from "@sm-mpr/shared/constants/contentTypes.js";
import {
  getLimitedMusicChannelsByCategory,
  getLimitedMusicGenres,
} from "@sm-mpr/shared/data/musicChannels.js";
import {
  PODCAST_CATEGORIES,
  getPodcastsByCategory,
} from "@sm-mpr/shared/data/podcasts.js";
import {
  RADIO_STATION_CATEGORIES,
  getRadioStationsByCategory,
} from "@sm-mpr/shared/data/radioStations.js";
import { getMusicSwimlaneSlotCount } from "./swimlaneUtils.js";

/** Radio format rows (excludes Near You / International tiles). */
const RADIO_FORMAT_CATEGORIES = RADIO_STATION_CATEGORIES.filter(
  (c) => c.id !== "near-you" && c.id !== "international",
);

/**
 * @typedef {'music' | 'podcasts' | 'radio'} LimitedStackedLaneType
 * @typedef {{
 *   id: string,
 *   type: LimitedStackedLaneType,
 *   title: string,
 *   sourceCount: number,
 *   slotCount: number,
 *   categoryId: string,
 * }} LimitedStackedLane
 */

/** @returns {LimitedStackedLane[]} */
function musicGenreLanes() {
  return getLimitedMusicGenres().map((genre) => {
    const count = getLimitedMusicChannelsByCategory(genre.id).length;
    return {
      id: `limited-music-${genre.id}`,
      type: "music",
      title: genre.label,
      sourceCount: count,
      slotCount: getMusicSwimlaneSlotCount(count),
      categoryId: genre.id,
    };
  });
}

/** @returns {LimitedStackedLane[]} */
function podcastCategoryLanes() {
  return PODCAST_CATEGORIES.filter(
    (cat) => getPodcastsByCategory(cat.id).length > 0,
  ).map((cat) => {
    const count = getPodcastsByCategory(cat.id).length;
    return {
      id: `limited-podcast-${cat.id}`,
      type: "podcasts",
      title: cat.label,
      sourceCount: count,
      slotCount: getMusicSwimlaneSlotCount(count),
      categoryId: cat.id,
    };
  });
}

/** @returns {LimitedStackedLane[]} */
function radioFormatLanes() {
  return RADIO_FORMAT_CATEGORIES.filter(
    (cat) => getRadioStationsByCategory(cat.id).length > 0,
  ).map((cat) => {
    const count = getRadioStationsByCategory(cat.id).length;
    return {
      id: `limited-radio-${cat.id}`,
      type: "radio",
      title: cat.label,
      sourceCount: count,
      slotCount: getMusicSwimlaneSlotCount(count),
      categoryId: cat.id,
    };
  });
}

/**
 * Taxonomy swimlane descriptors for limited Home layout B.
 * @param {string} activeBrowseTab
 */
export function buildLimitedHomeStackedLanes(activeBrowseTab) {
  if (activeBrowseTab === CONTENT_TYPE.podcasts) {
    return podcastCategoryLanes();
  }
  if (activeBrowseTab === CONTENT_TYPE.radio) {
    return radioFormatLanes();
  }
  return musicGenreLanes();
}
