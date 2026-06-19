/** My Library App Info login tile — guest shows Log in; signed-in tiers show Log out. */

/**
 * @param {string} userType
 * @returns {boolean}
 */
export function isAppInfoLoggedIn(userType) {
  return userType !== "guest";
}

/**
 * @param {string} userType
 * @returns {"Log in" | "Log out"}
 */
export function appInfoLoginTileLabel(userType) {
  return isAppInfoLoggedIn(userType) ? "Log out" : "Log in";
}

/** App Info swimlane tile count (Account, Log in, FAQ, Contact, About). */
export const MY_LIBRARY_APP_INFO_TILE_COUNT = 5;

/** Tile indexes in App Info swimlane order. */
export const MY_LIBRARY_APP_INFO_TILE_INDEX = Object.freeze({
  account: 0,
  login: 1,
  faq: 2,
  contact: 3,
  about: 4,
});
