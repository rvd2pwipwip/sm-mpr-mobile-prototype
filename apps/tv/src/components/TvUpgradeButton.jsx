import { forwardRef } from "react";
import FocusableButton from "./focus/FocusableButton.jsx";
import "./TvUpgradeButton.css";

/**
 * Figma TV Home header CTA (`15515:41291` / `.button_lg`).
 * Icon: same `upgrade.svg` as mobile `UpgradeButton`.
 */
const TvUpgradeButton = forwardRef(function TvUpgradeButton(
  { focused = false, onClick, className = "", ...rest },
  ref,
) {
  const rootClass = ["tv-upgrade-button", className].filter(Boolean).join(" ");

  return (
    <FocusableButton
      ref={ref}
      focused={focused}
      className={rootClass}
      tabIndex={-1}
      onClick={onClick}
      aria-label="Upgrade"
      {...rest}
    >
      <span className="tv-upgrade-button__icon" aria-hidden="true">
        <img
          className="tv-upgrade-button__icon-asset"
          src="/upgrade.svg"
          alt=""
          width="40"
          height="40"
          decoding="async"
        />
      </span>
      <span className="tv-upgrade-button__label">Upgrade</span>
    </FocusableButton>
  );
});

export default TvUpgradeButton;
