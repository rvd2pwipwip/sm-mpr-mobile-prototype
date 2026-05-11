/**
 * Footer / in-feed banner / player footer strip (prototype).
 * @see `docs/visual-ads-and-user-types.md`
 */
export function showVisualAds(userType) {
  return userType !== "subscribed";
}

/**
 * Home header + full player: Upgrade CTA (guest and logged-in free Stingray tier).
 * @see `docs/Stories/Home-screen-story.md`
 */
export function showUpgradeCallToAction(userType) {
  return userType === "guest" || userType === "freeStingray";
}

/**
 * Music hourly skip cap applies to unsigned guest and free Stingray (prototype).
 */
export function usesGuestMusicSkipCap(userType) {
  return userType === "guest" || userType === "freeStingray";
}

/**
 * Full-screen player pre-roll (same tiers as {@link usesGuestMusicSkipCap}: guest + free Stingray).
 * @see `docs/visual-ads-and-user-types.md`
 */
export function showPlayerPreroll(userType) {
  return usesGuestMusicSkipCap(userType);
}
