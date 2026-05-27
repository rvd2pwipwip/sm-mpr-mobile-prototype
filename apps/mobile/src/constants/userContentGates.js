/**
 * Which **user-driven** library actions require a Stingray account or provider access
 * vs anonymous **guest** (prototype business model).
 *
 * **Out of scope here:** Listen history — guests may still accumulate `ListenHistoryContext`
 * for all content types (playback-based). Tune flags below if product allows guests to like,
 * subscribe, bookmark, or download without signing in.
 */

/**
 * When `true`, guests may use the action without signing in. When `false`, only non-guest
 * user types (`freeStingray`, `freeProvided`, `subscribed`) may use it.
 *
 * @type {{
 *   likeMusicRadio: boolean,
 *   subscribePodcast: boolean,
 *   bookmarkEpisode: boolean,
 *   episodeOfflineDownload: boolean,
 * }}
 */
export const GUEST_MAY_USE_WITHOUT_ACCOUNT = Object.freeze({
  likeMusicRadio: false,
  subscribePodcast: false,
  bookmarkEpisode: false,
  episodeOfflineDownload: false,
});

function allowedWhenGuestFlag(userType, guestAllowed) {
  if (guestAllowed) return true;
  return userType !== "guest";
}

/**
 * @param {string} userType
 */
export function userMayLikeMusicRadio(userType) {
  return allowedWhenGuestFlag(
    userType,
    GUEST_MAY_USE_WITHOUT_ACCOUNT.likeMusicRadio,
  );
}

/**
 * @param {string} userType
 */
export function userMaySubscribePodcasts(userType) {
  return allowedWhenGuestFlag(
    userType,
    GUEST_MAY_USE_WITHOUT_ACCOUNT.subscribePodcast,
  );
}

/**
 * @param {string} userType
 */
export function userMayBookmarkEpisodes(userType) {
  return allowedWhenGuestFlag(
    userType,
    GUEST_MAY_USE_WITHOUT_ACCOUNT.bookmarkEpisode,
  );
}

/**
 * @param {string} userType
 */
export function userMayDownloadEpisodesOffline(userType) {
  return allowedWhenGuestFlag(
    userType,
    GUEST_MAY_USE_WITHOUT_ACCOUNT.episodeOfflineDownload,
  );
}
