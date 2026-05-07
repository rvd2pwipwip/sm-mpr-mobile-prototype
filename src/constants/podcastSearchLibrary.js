/** Library drill-down under Search → Podcasts (tiles match catalog category tiles). */

export const PODCAST_LIBRARY_SLUG = {
  continueListening: "continue-listening",
  yourPodcasts: "your-podcasts",
  yourEpisodes: "your-episodes",
  newEpisodes: "new-episodes",
  downloadedEpisodes: "downloaded-episodes",
};

/** @param {string} slug */
export function podcastLibraryBrowsePath(slug) {
  return `/search/browse/podcasts/library/${slug}`;
}

/** @param {string} [slug] */
export function isPodcastLibrarySlug(slug) {
  if (!slug) return false;
  return Object.values(PODCAST_LIBRARY_SLUG).includes(slug);
}
