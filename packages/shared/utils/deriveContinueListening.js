import { PODCASTS } from "../data/podcasts.js";

/**
 * @typedef {import("../data/podcasts.js").Podcast} Podcast
 * @typedef {import("../data/podcasts.js").PodcastEpisode} PodcastEpisode
 * @typedef {{ podcast: Podcast, episode: PodcastEpisode, position01: number }} ContinueListeningItem
 */

/**
 * In-progress episodes from stub progress map (catalog order).
 * @param {Record<string, number>} progressByEpisodeId
 * @returns {ContinueListeningItem[]}
 */
export function deriveContinueListening(progressByEpisodeId) {
  if (!progressByEpisodeId || typeof progressByEpisodeId !== "object") {
    return [];
  }

  /** @type {ContinueListeningItem[]} */
  const out = [];
  for (const podcast of PODCASTS) {
    for (const episode of podcast.episodes) {
      const frac = progressByEpisodeId[episode.id];
      if (
        typeof frac !== "number" ||
        frac <= 0 ||
        frac >= 1 ||
        Number.isNaN(frac)
      ) {
        continue;
      }
      out.push({
        podcast,
        episode,
        position01: frac,
      });
    }
  }

  return out.sort((a, b) =>
    `${a.podcast.id}\x00${a.episode.id}`.localeCompare(
      `${b.podcast.id}\x00${b.episode.id}`,
    ),
  );
}
