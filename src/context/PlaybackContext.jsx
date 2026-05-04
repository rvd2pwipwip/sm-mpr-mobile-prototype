import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useLocation } from "react-router-dom";

/**
 * Lightweight “now playing” state for MiniPlayer + sync with full players when mounted.
 * Music uses **`channelId`**; podcasts use **`podcastId`** + **`podcastEpisodeId`** (compound episode id).
 */

const PlaybackContext = createContext(null);

const initialSession = {
  active: false,
  variant: "music",
  isPaused: false,
  title: "",
  subtitle: "",
  thumbnail: "",
  /** Music channel id when variant === music */
  channelId: null,
  /** Show id when variant === podcasts */
  podcastId: null,
  /** `PodcastEpisode.id` compound string when variant === podcasts */
  podcastEpisodeId: null,
  fullPlayerPath: null,
};

export function PlaybackProvider({ children }) {
  const location = useLocation();
  const [session, setSession] = useState(initialSession);

  const hideMiniOnFullPlayer =
    /^\/music\/[^/]+\/play\/?$/.test(location.pathname) ||
    /^\/podcast\/[^/]+\/play\/[^/]+\/?$/.test(location.pathname);
  const miniPlayerVisible = session.active && !hideMiniOnFullPlayer;

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--mini-player-offset",
      miniPlayerVisible ? "var(--mini-player-height)" : "0px",
    );
    return () => {
      document.documentElement.style.setProperty("--mini-player-offset", "0px");
    };
  }, [miniPlayerVisible]);

  const setPaused = useCallback((isPaused) => {
    setSession((s) => (s.active ? { ...s, isPaused } : s));
  }, []);

  const togglePlayPause = useCallback(() => {
    setSession((s) => (s.active ? { ...s, isPaused: !s.isPaused } : s));
  }, []);

  const upsertPodcastSession = useCallback(
    ({
      podcastId: pid,
      episodeId,
      thumbnail: thumb,
      title: epTitle,
      subtitle: showTitle,
      isPaused,
    }) => {
      const fullPlayerPath = `/podcast/${pid}/play/${episodeId}`;
      setSession({
        active: true,
        variant: "podcasts",
        channelId: null,
        podcastId: pid,
        podcastEpisodeId: episodeId,
        thumbnail: thumb,
        title: epTitle,
        subtitle: showTitle,
        isPaused,
        fullPlayerPath,
      });
    },
    [],
  );

  const upsertMusicSession = useCallback(
    ({
      channelId,
      thumbnail,
      title,
      subtitle,
      isPaused,
    }) => {
      const fullPlayerPath = `/music/${channelId}/play`;
      setSession({
        active: true,
        variant: "music",
        channelId,
        podcastId: null,
        podcastEpisodeId: null,
        thumbnail,
        title,
        subtitle,
        isPaused,
        fullPlayerPath,
      });
    },
    [],
  );

  const startPodcastDemo = useCallback(() => {
    setSession({
      active: true,
      variant: "podcasts",
      channelId: null,
      podcastId: null,
      podcastEpisodeId: null,
      thumbnail: "",
      title: "Podcast episode titles tend to be long so they’re allowed 2 lines",
      subtitle: "Podcast Name",
      isPaused: false,
      fullPlayerPath: null,
    });
  }, []);

  const startRadioDemo = useCallback(() => {
    setSession({
      active: true,
      variant: "radio",
      channelId: null,
      podcastId: null,
      podcastEpisodeId: null,
      thumbnail: "",
      title: "CKKC 99.9",
      subtitle: "Now playing metadata",
      isPaused: false,
      fullPlayerPath: null,
    });
  }, []);

  const clearSession = useCallback(() => {
    setSession(initialSession);
  }, []);

  const value = useMemo(
    () => ({
      session,
      miniPlayerVisible,
      setPaused,
      togglePlayPause,
      upsertMusicSession,
      upsertPodcastSession,
      startPodcastDemo,
      startRadioDemo,
      clearSession,
    }),
    [
      session,
      miniPlayerVisible,
      setPaused,
      togglePlayPause,
      upsertMusicSession,
      upsertPodcastSession,
      startPodcastDemo,
      startRadioDemo,
      clearSession,
    ],
  );

  return (
    <PlaybackContext.Provider value={value}>{children}</PlaybackContext.Provider>
  );
}

export function usePlayback() {
  const ctx = useContext(PlaybackContext);
  if (!ctx) {
    throw new Error("usePlayback must be used within PlaybackProvider");
  }
  return ctx;
}
