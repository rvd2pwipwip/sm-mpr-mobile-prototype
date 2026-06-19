import { useCallback, useMemo } from "react";
import { usePlayback } from "../context/PlaybackContext";

function sessionMatchesMedia(session, variant, mediaId) {
  if (!session.active || mediaId == null) return false;
  if (variant === "music") {
    return session.variant === "music" && session.channelId === mediaId;
  }
  if (variant === "radio") {
    return session.variant === "radio" && session.radioStationId === mediaId;
  }
  if (variant === "podcast") {
    return session.variant === "podcasts" && session.podcastId === mediaId;
  }
  return false;
}

/**
 * Play/Pause on mobile media info screens when this item matches the active session
 * (same behavior as player info bottom sheets and TV info screens).
 *
 * @param {"music" | "radio" | "podcast"} variant
 * @param {string | null | undefined} mediaId
 * @param {{ onStartPlay?: () => void }} [options]
 */
export function useMediaInfoPlayAction(variant, mediaId, { onStartPlay } = {}) {
  const { session, togglePlayPause } = usePlayback();

  const isSessionMatch = useMemo(
    () => sessionMatchesMedia(session, variant, mediaId),
    [session, variant, mediaId],
  );

  const playing = isSessionMatch && !session.isPaused;

  const onPlayActionPress = useCallback(() => {
    if (isSessionMatch) {
      togglePlayPause();
      return;
    }
    onStartPlay?.();
  }, [isSessionMatch, togglePlayPause, onStartPlay]);

  const playButtonIconMaskVariant = playing ? "pause" : "play";

  return {
    isSessionMatch,
    playing,
    onPlayActionPress,
    playButtonIconMaskVariant,
  };
}
