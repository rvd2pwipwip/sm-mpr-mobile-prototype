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

/** Full Your Podcasts grid from My Library / limited Home swimlane More (TV). */
export function myLibraryYourPodcastsMorePath() {
  return `/my-library/podcasts/${PODCAST_LIBRARY_SLUG.yourPodcasts}`;
}

/** Episode-library shelves opened from My Library / limited Home swimlane More (TV). */
export const PODCAST_EPISODE_LIBRARY_SLUGS = Object.freeze([
  PODCAST_LIBRARY_SLUG.continueListening,
  PODCAST_LIBRARY_SLUG.yourEpisodes,
  PODCAST_LIBRARY_SLUG.newEpisodes,
  PODCAST_LIBRARY_SLUG.downloadedEpisodes,
]);

/** @param {string} slug */
export function isPodcastEpisodeLibrarySlug(slug) {
  return PODCAST_EPISODE_LIBRARY_SLUGS.includes(slug);
}

/** @param {string} slug */
export function myLibraryPodcastEpisodeLibraryMorePath(slug) {
  return `/my-library/${slug}`;
}

/**
 * My Library swimlane More target (TV). Search browse keeps {@link podcastLibraryBrowsePath}.
 * @param {string} slug
 */
export function myLibraryPodcastLibraryMorePath(slug) {
  if (slug === PODCAST_LIBRARY_SLUG.yourPodcasts) {
    return myLibraryYourPodcastsMorePath();
  }
  if (isPodcastEpisodeLibrarySlug(slug)) {
    return myLibraryPodcastEpisodeLibraryMorePath(slug);
  }
  return podcastLibraryBrowsePath(slug);
}

/** @param {string} [slug] */
export function isPodcastLibrarySlug(slug) {
  if (!slug) return false;
  return Object.values(PODCAST_LIBRARY_SLUG).includes(slug);
}

/** Header Clear on TV Your Podcasts More grid (`MyLibraryYourPodcastsMore`). */
export const PODCAST_LIBRARY_YOUR_PODCASTS_CLEAR = Object.freeze({
  clearAriaLabel: "Clear your podcasts",
  clearConfirmDialogTitle: "Clear Your Podcasts",
  clearConfirmBodyHistoryPhrase: "Your Podcasts subscriptions",
  clearConfirmPrimaryLabel: "Unsubscribe from all",
});

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
