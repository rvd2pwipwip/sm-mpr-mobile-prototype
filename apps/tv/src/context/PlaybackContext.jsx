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

  const hideMiniOnFullPlayer = /^\/music\/[^/]+\/play\/?$/.test(
    location.pathname,
  );
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
      clearSession,
    }),
    [
      session,
      miniPlayerVisible,
      setPaused,
      togglePlayPause,
      upsertMusicSession,
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
