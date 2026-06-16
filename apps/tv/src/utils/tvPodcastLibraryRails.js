import {
  PODCAST_LIBRARY_RAIL_TITLES,
  PODCAST_LIBRARY_SLUG,
} from "@sm-mpr/shared/constants/podcastSearchLibrary.js";
import { getMusicSwimlaneSlotCount, getEpisodeLibrarySwimlaneSlotCount } from "./swimlaneUtils.js";

/**
 * @typedef {'shows' | 'episodes'} TvPodcastLibraryRailKind
 * @typedef {{
 *   id: string,
 *   slug: string,
 *   kind: TvPodcastLibraryRailKind,
 *   title: string,
 *   sourceCount: number,
 *   slotCount: number,
 *   shows?: object[],
 *   episodeRows?: object[],
 * }} TvPodcastLibraryRail
 */

const RAIL_ORDER = [
  PODCAST_LIBRARY_SLUG.yourPodcasts,
  PODCAST_LIBRARY_SLUG.continueListening,
  PODCAST_LIBRARY_SLUG.yourEpisodes,
  PODCAST_LIBRARY_SLUG.newEpisodes,
  PODCAST_LIBRARY_SLUG.downloadedEpisodes,
];

/**
 * Conditional podcast library swimlanes (mobile {@link LibraryPodcastUserSwimlanes} parity).
 * @param {{
 *   subscribedPodcasts: object[],
 *   continueListening: object[],
 *   bookmarkedEpisodes: object[],
 *   newEpisodeRows: object[],
 *   downloadedEpisodes: object[],
 * }} userState
 * @returns {TvPodcastLibraryRail[]}
 */
export function buildTvPodcastLibraryRails(userState) {
  const {
    subscribedPodcasts,
    continueListening,
    bookmarkedEpisodes,
    newEpisodeRows,
    downloadedEpisodes,
  } = userState;

  /** @type {Record<string, TvPodcastLibraryRail | null>} */
  const bySlug = {
    [PODCAST_LIBRARY_SLUG.yourPodcasts]:
      subscribedPodcasts.length > 0
        ? {
            id: PODCAST_LIBRARY_SLUG.yourPodcasts,
            slug: PODCAST_LIBRARY_SLUG.yourPodcasts,
            kind: "shows",
            title: PODCAST_LIBRARY_RAIL_TITLES[PODCAST_LIBRARY_SLUG.yourPodcasts],
            sourceCount: subscribedPodcasts.length,
            slotCount: getMusicSwimlaneSlotCount(subscribedPodcasts.length),
            shows: subscribedPodcasts,
          }
        : null,
    [PODCAST_LIBRARY_SLUG.continueListening]:
      continueListening.length > 0
        ? {
            id: PODCAST_LIBRARY_SLUG.continueListening,
            slug: PODCAST_LIBRARY_SLUG.continueListening,
            kind: "episodes",
            title:
              PODCAST_LIBRARY_RAIL_TITLES[PODCAST_LIBRARY_SLUG.continueListening],
            sourceCount: continueListening.length,
            slotCount: getEpisodeLibrarySwimlaneSlotCount(continueListening.length),
            episodeRows: continueListening,
          }
        : null,
    [PODCAST_LIBRARY_SLUG.yourEpisodes]:
      bookmarkedEpisodes.length > 0
        ? {
            id: PODCAST_LIBRARY_SLUG.yourEpisodes,
            slug: PODCAST_LIBRARY_SLUG.yourEpisodes,
            kind: "episodes",
            title: PODCAST_LIBRARY_RAIL_TITLES[PODCAST_LIBRARY_SLUG.yourEpisodes],
            sourceCount: bookmarkedEpisodes.length,
            slotCount: getEpisodeLibrarySwimlaneSlotCount(bookmarkedEpisodes.length),
            episodeRows: bookmarkedEpisodes,
          }
        : null,
    [PODCAST_LIBRARY_SLUG.newEpisodes]:
      newEpisodeRows.length > 0
        ? {
            id: PODCAST_LIBRARY_SLUG.newEpisodes,
            slug: PODCAST_LIBRARY_SLUG.newEpisodes,
            kind: "episodes",
            title: PODCAST_LIBRARY_RAIL_TITLES[PODCAST_LIBRARY_SLUG.newEpisodes],
            sourceCount: newEpisodeRows.length,
            slotCount: getEpisodeLibrarySwimlaneSlotCount(newEpisodeRows.length),
            episodeRows: newEpisodeRows,
          }
        : null,
    [PODCAST_LIBRARY_SLUG.downloadedEpisodes]:
      downloadedEpisodes.length > 0
        ? {
            id: PODCAST_LIBRARY_SLUG.downloadedEpisodes,
            slug: PODCAST_LIBRARY_SLUG.downloadedEpisodes,
            kind: "episodes",
            title:
              PODCAST_LIBRARY_RAIL_TITLES[PODCAST_LIBRARY_SLUG.downloadedEpisodes],
            sourceCount: downloadedEpisodes.length,
            slotCount: getEpisodeLibrarySwimlaneSlotCount(downloadedEpisodes.length),
            episodeRows: downloadedEpisodes,
          }
        : null,
  };

  return RAIL_ORDER.map((slug) => bySlug[slug]).filter(Boolean);
}
