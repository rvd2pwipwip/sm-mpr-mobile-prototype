import { MUSIC_CHANNELS } from "../data/musicChannels.js";
import { PODCASTS } from "../data/podcasts.js";
import { RADIO_STATIONS } from "../data/radioStations.js";

/** Items per Clear/More rail when seeding demo data (enough to show the More tile). */
export const CLEAR_MORE_DEMO_ITEM_COUNT = 15;

function shuffleInPlace(array) {
  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function pickRandomIds(catalog, count, getId) {
  const pool = catalog.map(getId).filter(Boolean);
  shuffleInPlace(pool);
  return pool.slice(0, Math.min(count, pool.length));
}

function collectEpisodeIds() {
  /** @type {string[]} */
  const ids = [];
  for (const podcast of PODCASTS) {
    for (const episode of podcast.episodes) {
      ids.push(episode.id);
    }
  }
  shuffleInPlace(ids);
  return ids;
}

/**
 * Ten random entries per listen-history kind (music, podcast, radio).
 * @returns {{ kind: 'music' | 'podcast' | 'radio', id: string }[]}
 */
export function buildClearMoreDemoListenHistory() {
  const count = CLEAR_MORE_DEMO_ITEM_COUNT;
  const music = pickRandomIds(MUSIC_CHANNELS, count, (channel) => channel.id).map(
    (id) => ({ kind: "music", id }),
  );
  const podcast = pickRandomIds(PODCASTS, count, (show) => show.id).map((id) => ({
    kind: "podcast",
    id,
  }));
  const radio = pickRandomIds(RADIO_STATIONS, count, (station) => station.id).map(
    (id) => ({ kind: "radio", id }),
  );
  return [...music, ...podcast, ...radio];
}

/**
 * Stub podcast library state for TV Clear/More episode rails + Your Podcasts.
 */
export function buildClearMoreDemoPodcastUserState() {
  const count = CLEAR_MORE_DEMO_ITEM_COUNT;
  const subscribedPodcastIds = pickRandomIds(PODCASTS, count, (show) => show.id);
  const episodeIds = collectEpisodeIds();
  const progressIds = episodeIds.slice(0, count);
  const bookmarkedEpisodeIds = episodeIds.slice(count, count * 2);
  const downloadedEpisodeIds = episodeIds.slice(count * 2, count * 3);

  /** @type {Record<string, number>} */
  const episodeProgressById = {};
  for (const episodeId of progressIds) {
    episodeProgressById[episodeId] = 0.12 + Math.random() * 0.76;
  }

  return {
    subscribedPodcastIds,
    bookmarkedEpisodeIds,
    downloadedEpisodeIds,
    episodeProgressById,
  };
}
