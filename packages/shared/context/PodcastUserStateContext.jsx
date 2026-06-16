import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  PODCASTS,
  findPodcastAndEpisode,
} from "../data/podcasts.js";
import { deriveContinueListening } from "../utils/deriveContinueListening.js";

/**
 * Stub "my library" for podcasts (prototype). In-memory; resets on full reload.
 * Shared by mobile and TV apps.
 */

const PodcastUserStateContext = createContext(null);

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
    ({}),
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

  /** Wipes in-progress stubs so Continue listening empties alongside Podcast History Clear in My Library. */
  const clearAllEpisodeProgress = useCallback(() => {
    setEpisodeProgressById({});
  }, []);

  const clearAllBookmarks = useCallback(() => {
    setBookmarkedEpisodeIds([]);
  }, []);

  const clearAllDownloads = useCallback(() => {
    setDownloadedEpisodeIds([]);
  }, []);

  /** Unsubscribe from the given show ids (e.g. clear New Episodes rail). */
  const unsubscribePodcasts = useCallback((podcastIds) => {
    if (!podcastIds?.length) return;
    const remove = new Set(podcastIds);
    setSubscribedPodcastIds((prev) => prev.filter((id) => !remove.has(id)));
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

  /** New-episode stub: subscribed shows' youngest episode by catalog order. */
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
      clearAllEpisodeProgress,
      clearAllBookmarks,
      clearAllDownloads,
      unsubscribePodcasts,
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
      clearAllEpisodeProgress,
      clearAllBookmarks,
      clearAllDownloads,
      unsubscribePodcasts,
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
