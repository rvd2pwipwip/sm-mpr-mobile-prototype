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
 * Lightweight “now playing” state for MiniPlayer + sync with MusicPlayer when mounted.
 * `fullPlayerPath` is null for podcast/radio until those routes exist — tap-to-expand is a no-op then.
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
  fullPlayerPath: null,
};

export function PlaybackProvider({ children }) {
  const location = useLocation();
  const [session, setSession] = useState(initialSession);

  const hideMiniOnFullPlayer = /^\/music\/[^/]+\/play\/?$/.test(location.pathname);
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
