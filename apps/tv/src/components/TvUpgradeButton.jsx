import { forwardRef } from "react";
import FocusableButton from "./focus/FocusableButton.jsx";
import "./TvUpgradeButton.css";

/**
 * Figma TV header CTA (`15515:41291` / `.button_lg`) — Home Upgrade, Channel Info Play, etc.
 */
const TvUpgradeButton = forwardRef(function TvUpgradeButton(
  {
    focused = false,
    onClick,
    className = "",
    iconSrc = "/upgrade.svg",
    label = "Upgrade",
    ariaLabel,
    ...rest
  },
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
      aria-label={ariaLabel ?? label}
      {...rest}
    >
      <span className="tv-upgrade-button__icon" aria-hidden="true">
        <img
          className="tv-upgrade-button__icon-asset"
          src={iconSrc}
          alt=""
          width="40"
          height="40"
          decoding="async"
        />
      </span>
      <span className="tv-upgrade-button__label">{label}</span>
    </FocusableButton>
  );
});

export default TvUpgradeButton;
