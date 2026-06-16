import {
  PODCAST_LIBRARY_EPISODE_RAIL_CLEAR,
  PODCAST_LIBRARY_SLUG,
} from "@sm-mpr/shared/constants/podcastSearchLibrary.js";

/** @param {string} slug */
export function mapPodcastEpisodeRailClearConfirm(slug) {
  const config = PODCAST_LIBRARY_EPISODE_RAIL_CLEAR[slug];
  if (!config) return undefined;
  return {
    clearAriaLabel: config.clearAriaLabel,
    dialogTitle: config.clearConfirmDialogTitle,
    bodyPhrase: config.clearConfirmBodyHistoryPhrase,
    primaryLabel: config.clearConfirmPrimaryLabel,
  };
}

/**
 * @param {string} slug
 * @param {object} actions
 * @param {object[]} [episodeRows]
 */
export function runPodcastEpisodeRailClear(slug, actions, episodeRows = []) {
  switch (slug) {
    case PODCAST_LIBRARY_SLUG.continueListening:
      actions.clearAllEpisodeProgress();
      break;
    case PODCAST_LIBRARY_SLUG.yourEpisodes:
      actions.clearAllBookmarks();
      break;
    case PODCAST_LIBRARY_SLUG.newEpisodes:
      actions.unsubscribePodcasts(episodeRows.map((row) => row.podcast.id));
      break;
    case PODCAST_LIBRARY_SLUG.downloadedEpisodes:
      actions.clearAllDownloads();
      break;
    default:
      break;
  }
}
