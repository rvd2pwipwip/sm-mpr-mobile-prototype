/** Playback variants that use the TV mini player slot (nav + limited Home header). */
export const TV_MINI_PLAYER_VARIANTS = ["music", "podcasts"];

export function hasTvMiniPlayerSession(session) {
  return (
    Boolean(session?.active) &&
    TV_MINI_PLAYER_VARIANTS.includes(session.variant) &&
    Boolean(session.fullPlayerPath)
  );
}

export function shouldShowTvMiniPlayer(miniPlayerVisible, session) {
  return miniPlayerVisible && hasTvMiniPlayerSession(session);
}

/** Show id for now-playing scrim on podcast tiles when a podcast session is active. */
export function getActivePodcastShowId(session) {
  return session?.active &&
    session.variant === "podcasts" &&
    session.podcastId
    ? session.podcastId
    : null;
}

/** Station id for now-playing highlight when a radio session is active. */
export function getActiveRadioStationId(session) {
  return session?.active &&
    session.variant === "radio" &&
    session.radioStationId
    ? session.radioStationId
    : null;
}
