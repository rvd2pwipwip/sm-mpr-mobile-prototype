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
