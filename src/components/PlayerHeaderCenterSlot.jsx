import UpgradeButton from "./UpgradeButton";
import { showUpgradeInFullPlayerHeader } from "../utils/showVisualAds";

/** Full-player header center: Upgrade for all except subscribed (same for guest / free tiers). */
export default function PlayerHeaderCenterSlot({ userType, onUpgrade }) {
  if (showUpgradeInFullPlayerHeader(userType)) {
    return <UpgradeButton onClick={onUpgrade} />;
  }
  return <span className="music-player__header-spacer" aria-hidden={true} />;
}
