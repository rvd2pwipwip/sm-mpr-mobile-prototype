/** Library drill-down paths (Search browse + My Library More on TV). */

export const PODCAST_LIBRARY_SLUG = Object.freeze({
  continueListening: "continue-listening",
  yourPodcasts: "your-podcasts",
  yourEpisodes: "your-episodes",
  newEpisodes: "new-episodes",
  downloadedEpisodes: "downloaded-episodes",
});

export const PODCAST_LIBRARY_RAIL_TITLES = Object.freeze({
  [PODCAST_LIBRARY_SLUG.continueListening]: "Continue listening",
  [PODCAST_LIBRARY_SLUG.yourPodcasts]: "Your Podcasts",
  [PODCAST_LIBRARY_SLUG.yourEpisodes]: "Your Episodes",
  [PODCAST_LIBRARY_SLUG.newEpisodes]: "New Episodes",
  [PODCAST_LIBRARY_SLUG.downloadedEpisodes]: "Downloaded Episodes",
});

/** @param {string} slug */
export function podcastLibraryBrowsePath(slug) {
  return `/search/browse/podcasts/library/${slug}`;
}

/** @param {string} [slug] */
export function isPodcastLibrarySlug(slug) {
  if (!slug) return false;
  return Object.values(PODCAST_LIBRARY_SLUG).includes(slug);
}

/**
 * Swimlane Clear confirm copy for episode library rails (TV + future mobile parity).
 * @type {Record<string, {
 *   clearAriaLabel: string,
 *   clearConfirmDialogTitle: string,
 *   clearConfirmBodyHistoryPhrase: string,
 *   clearConfirmPrimaryLabel: string,
 * }>}
 */
export const PODCAST_LIBRARY_EPISODE_RAIL_CLEAR = Object.freeze({
  [PODCAST_LIBRARY_SLUG.continueListening]: {
    clearAriaLabel: "Clear continue listening",
    clearConfirmDialogTitle: "Clear Continue Listening",
    clearConfirmBodyHistoryPhrase: "Continue Listening list",
    clearConfirmPrimaryLabel: "Clear Continue Listening",
  },
  [PODCAST_LIBRARY_SLUG.yourEpisodes]: {
    clearAriaLabel: "Clear your episodes",
    clearConfirmDialogTitle: "Clear Your Episodes",
    clearConfirmBodyHistoryPhrase: "Your Episodes list",
    clearConfirmPrimaryLabel: "Clear Your Episodes",
  },
  [PODCAST_LIBRARY_SLUG.newEpisodes]: {
    clearAriaLabel: "Clear new episodes",
    clearConfirmDialogTitle: "Clear New Episodes",
    clearConfirmBodyHistoryPhrase: "New Episodes list",
    clearConfirmPrimaryLabel: "Clear New Episodes",
  },
  [PODCAST_LIBRARY_SLUG.downloadedEpisodes]: {
    clearAriaLabel: "Clear downloaded episodes",
    clearConfirmDialogTitle: "Clear Downloaded Episodes",
    clearConfirmBodyHistoryPhrase: "Downloaded Episodes list",
    clearConfirmPrimaryLabel: "Clear Downloaded Episodes",
  },
});
