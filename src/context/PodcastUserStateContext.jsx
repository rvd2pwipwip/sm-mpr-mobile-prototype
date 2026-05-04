import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { PODCASTS, findPodcastAndEpisode } from "../data/podcasts";

/**
 * Stub “my library” for podcasts (prototype). In-memory; resets on full reload.
 * @typedef {{ podcast: import("../data/podcasts.js").Podcast, episode: import("../data/podcasts.js").PodcastEpisode, position01: number }} ContinueListeningItem
 */

const PodcastUserStateContext = createContext(null);

function deriveContinueListening(progressByEpisodeId) {
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

  /** Deterministic ordering: browse catalog order — users see a stable list in the prototype. */
  return out.sort((a, b) =>
    `${a.podcast.id}\x00${a.episode.id}`.localeCompare(
      `${b.podcast.id}\x00${b.episode.id}`,
    ),
  );
}

export function PodcastUserStateProvider({ children }) {
  const [subscribedPodcastIds, setSubscribedPodcastIds] = useState(
    /** @type {string[]} */
    ([]),
  );
  const [bookmarkedEpisodeIds, setBookmarkedEpisodeIds] = useState(
    /** @type {string[]} */
    ([]),
  );
  const [downloadedEpisodeIds, setDownloadedEpisodeIds] = useState(
    /** @type {string[]} */
    ([]),
  );
  const [episodeProgressById, setEpisodeProgressById] = useState(
    /** @type {Record<string, number>} */
    {},
  );

  const toggleSubscribe = useCallback((podcastId) => {
    if (!podcastId) return;
    setSubscribedPodcastIds((prev) =>
      prev.includes(podcastId)
        ? prev.filter((id) => id !== podcastId)
        : [...prev, podcastId],
    );
  }, []);

  const toggleBookmark = useCallback((episodeId) => {
    if (!episodeId) return;
    setBookmarkedEpisodeIds((prev) =>
      prev.includes(episodeId)
        ? prev.filter((id) => id !== episodeId)
        : [...prev, episodeId],
    );
  }, []);

  const toggleDownload = useCallback((episodeId) => {
    if (!episodeId) return;
    setDownloadedEpisodeIds((prev) =>
      prev.includes(episodeId)
        ? prev.filter((id) => id !== episodeId)
        : [...prev, episodeId],
    );
  }, []);

  const setEpisodeProgress = useCallback((episodeId, fraction) => {
    if (!episodeId) return;
    const f =
      typeof fraction === "number" && !Number.isNaN(fraction)
        ? Math.min(1, Math.max(0, fraction))
        : 0;
    setEpisodeProgressById((prev) => {
      const next = { ...prev };
      if (f <= 0 || f >= 1) {
        delete next[episodeId];
      } else {
        next[episodeId] = f;
      }
      return next;
    });
  }, []);

  /** @param {number} [whenMissing] defaults to `0`. */
  const getEpisodeProgress = useCallback(
    (episodeId, whenMissing = 0) => {
      if (!episodeId) return whenMissing;
      const x = episodeProgressById[episodeId];
      return typeof x === "number" && !Number.isNaN(x) ? x : whenMissing;
    },
    [episodeProgressById],
  );

  const isSubscribed = useCallback(
    (podcastId) => !!(podcastId && subscribedPodcastIds.includes(podcastId)),
    [subscribedPodcastIds],
  );

  const isBookmarked = useCallback(
    (episodeId) => !!(episodeId && bookmarkedEpisodeIds.includes(episodeId)),
    [bookmarkedEpisodeIds],
  );

  const isDownloaded = useCallback(
    (episodeId) => !!(episodeId && downloadedEpisodeIds.includes(episodeId)),
    [downloadedEpisodeIds],
  );

  const subscribedPodcasts = useMemo(
    () =>
      subscribedPodcastIds
        .map((id) => PODCASTS.find((p) => p.id === id))
        .filter(Boolean),
    [subscribedPodcastIds],
  );

  const bookmarkedEpisodes = useMemo(() => {
    return bookmarkedEpisodeIds
      .map((episodeId) => findPodcastAndEpisode(episodeId))
      .filter(Boolean);
  }, [bookmarkedEpisodeIds]);

  const downloadedEpisodes = useMemo(() => {
    return downloadedEpisodeIds
      .map((episodeId) => findPodcastAndEpisode(episodeId))
      .filter(Boolean);
  }, [downloadedEpisodeIds]);

  /** Newepisode stub: subscribed shows’ youngest episode by catalog order — prototype heuristic. */
  const newEpisodeRows = useMemo(() => {
    const rows = [];
    for (const podcast of PODCASTS) {
      if (!subscribedPodcastIds.includes(podcast.id)) continue;
      const first = podcast.episodes[0];
      if (first) {
        rows.push({ podcast, episode: first });
      }
    }
    return rows;
  }, [subscribedPodcastIds]);

  const continueListening = useMemo(
    () => deriveContinueListening(episodeProgressById),
    [episodeProgressById],
  );

  const value = useMemo(
    () => ({
      subscribedPodcastIds,
      bookmarkedEpisodeIds,
      downloadedEpisodeIds,
      episodeProgressById,
      continueListening,
      subscribedPodcasts,
      bookmarkedEpisodes,
      downloadedEpisodes,
      newEpisodeRows,
      toggleSubscribe,
      toggleBookmark,
      toggleDownload,
      setEpisodeProgress,
      getEpisodeProgress,
      isSubscribed,
      isBookmarked,
      isDownloaded,
    }),
    [
      subscribedPodcastIds,
      bookmarkedEpisodeIds,
      downloadedEpisodeIds,
      episodeProgressById,
      continueListening,
      subscribedPodcasts,
      bookmarkedEpisodes,
      downloadedEpisodes,
      newEpisodeRows,
      toggleSubscribe,
      toggleBookmark,
      toggleDownload,
      setEpisodeProgress,
      getEpisodeProgress,
      isSubscribed,
      isBookmarked,
      isDownloaded,
    ],
  );

  return (
    <PodcastUserStateContext.Provider value={value}>
      {children}
    </PodcastUserStateContext.Provider>
  );
}

export function usePodcastUserState() {
  const ctx = useContext(PodcastUserStateContext);
  if (!ctx) {
    throw new Error(
      "usePodcastUserState must be used within PodcastUserStateProvider",
    );
  }
  return ctx;
}
