import { showUpgradeInFullPlayerHeader } from "@sm-mpr/shared/utils/userTierRules.js";
import TvButton from "../TvButton.jsx";
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
    <TvButton
      focused={focused}
      onClick={onUpgrade}
      label="Upgrade"
      iconSrc="/upgrade.svg"
      className="tv-player-header-center-slot__upgrade"
    />
  );
}
