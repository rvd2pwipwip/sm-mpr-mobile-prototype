import { showUpgradeInFullPlayerHeader } from "@sm-mpr/shared/utils/userTierRules.js";
import TvUpgradeButton from "../TvUpgradeButton.jsx";
import "./TvPlayerHeaderCenterSlot.css";

/** Full-player header center: Upgrade for all except subscribed (mobile parity). */
export default function TvPlayerHeaderCenterSlot({
  userType,
  focused = false,
  onUpgrade,
}) {
  if (!showUpgradeInFullPlayerHeader(userType)) {
    return (
      <span className="tv-player-header-center-slot__spacer" aria-hidden={true} />
    );
  }

  return (
    <TvUpgradeButton
      focused={focused}
      onClick={onUpgrade}
      className="tv-player-header-center-slot__upgrade"
    />
  );
}
