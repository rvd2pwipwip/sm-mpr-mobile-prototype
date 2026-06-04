/**
 * User-tier business rules (prototype). Shared by mobile and TV.
 * @see `docs/mobile/visual-ads-and-user-types.md`
 */

export function showVisualAds(userType) {
  return userType !== "subscribed";
}

export function showUpgradeCallToAction(userType) {
  return userType === "guest" || userType === "freeStingray";
}

export function showUpgradeInFullPlayerHeader(userType) {
  return userType !== "subscribed";
}

export function usesGuestMusicSkipCap(userType) {
  return userType === "guest" || userType === "freeStingray";
}

export function showPlayerPreroll(userType) {
  return usesGuestMusicSkipCap(userType);
}
