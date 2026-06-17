import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { useLocation } from "react-router-dom";

const PlaybackContext = createContext(null);

const initialSession = {
  active: false,
  variant: "music",
  isPaused: false,
  title: "",
  subtitle: "",
  thumbnail: "",
  channelId: null,
  podcastId: null,
  podcastEpisodeId: null,
  radioStationId: null,
  fullPlayerPath: null,
};

/** TV playback session — no `--mini-player-offset` until mini player (Phase 7). */
export function PlaybackProvider({ children }) {
  const location = useLocation();
  const [session, setSession] = useState(initialSession);

  const hideMiniOnFullPlayer =
    /^\/music\/[^/]+\/play\/?$/.test(location.pathname) ||
    /^\/podcast\/[^/]+\/play\/[^/]+\/?$/.test(location.pathname) ||
    /^\/radio\/[^/]+\/play\/?$/.test(location.pathname);
  const miniPlayerVisible = session.active && !hideMiniOnFullPlayer;

  const setPaused = useCallback((isPaused) => {
    setSession((s) => (s.active ? { ...s, isPaused } : s));
  }, []);

  const togglePlayPause = useCallback(() => {
    setSession((s) => (s.active ? { ...s, isPaused: !s.isPaused } : s));
  }, []);

  const upsertMusicSession = useCallback(
    ({ channelId, thumbnail, title, subtitle, isPaused }) => {
      const fullPlayerPath = `/music/${channelId}/play`;
      setSession({
        active: true,
        variant: "music",
        channelId,
        podcastId: null,
        podcastEpisodeId: null,
        radioStationId: null,
        thumbnail,
        title,
        subtitle,
        isPaused,
        fullPlayerPath,
      });
    },
    [],
  );

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
        radioStationId: null,
        thumbnail: thumb,
        title: epTitle,
        subtitle: showTitle,
        isPaused,
        fullPlayerPath,
      });
    },
    [],
  );

  const upsertRadioSession = useCallback(
    ({ stationId, thumbnail, title, subtitle, isPaused }) => {
      const sid = stationId ?? null;
      const fullPlayerPath = sid ? `/radio/${sid}/play` : null;
      setSession({
        active: true,
        variant: "radio",
        channelId: null,
        podcastId: null,
        podcastEpisodeId: null,
        radioStationId: sid,
        thumbnail: thumbnail ?? "",
        title: title ?? "Radio",
        subtitle: subtitle ?? "",
        isPaused: Boolean(isPaused),
        fullPlayerPath,
      });
    },
    [],
  );

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
      upsertRadioSession,
      clearSession,
    }),
    [
      session,
      miniPlayerVisible,
      setPaused,
      togglePlayPause,
      upsertMusicSession,
      upsertPodcastSession,
      upsertRadioSession,
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
