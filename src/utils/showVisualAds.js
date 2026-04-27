/**
 * Footer / in-feed banner / player footer strip (prototype).
 * @see `docs/visual-ads-and-user-types.md`
 */
export function showVisualAds(userType) {
  return userType !== "subscribed";
}

/**
 * Full-screen player pre-roll countdown (guest only in v1).
 * @see `docs/visual-ads-and-user-types.md`
 */
export function showPlayerPreroll(userType) {
  return userType === "guest";
}
