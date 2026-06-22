/** Active music channel id when a music session is loaded in the player. */
export function getActiveMusicChannelId(session) {
  return session?.active &&
    session.variant === "music" &&
    session.channelId
    ? session.channelId
    : null;
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

/** Whether a listen-history stub (`{ kind, id }`) matches the active player session. */
export function isListenHistoryItemPlaying(item, session) {
  if (!item || !session?.active) return false;
  if (item.kind === "music") {
    return getActiveMusicChannelId(session) === item.id;
  }
  if (item.kind === "podcast") {
    return getActivePodcastShowId(session) === item.id;
  }
  if (item.kind === "radio") {
    return getActiveRadioStationId(session) === item.id;
  }
  return false;
}
