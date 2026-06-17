import { forwardRef } from "react";
import FocusableButton from "./focus/FocusableButton.jsx";
import "./TvUpgradeButton.css";

/**
 * Figma TV header CTA (`15515:41291` / `.button_lg`) — Home Upgrade, Channel Info Play,
 * Podcast Info Play (primary) / Subscribe (subscribe variant), etc.
 */
const TvUpgradeButton = forwardRef(function TvUpgradeButton(
  {
    focused = false,
    onClick,
    className = "",
    variant = "primary",
    iconSrc = "/upgrade.svg",
    iconMaskVariant = null,
    label = "Upgrade",
    ariaLabel,
    disabled = false,
    ...rest
  },
  ref,
) {
  const rootClass = [
    "tv-upgrade-button",
    variant === "secondary" ? "tv-upgrade-button--secondary" : "",
    variant === "subscribe" ? "tv-upgrade-button--subscribe" : "",
    disabled ? "tv-upgrade-button--disabled" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <FocusableButton
      ref={ref}
      focused={focused}
      className={rootClass}
      tabIndex={-1}
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel ?? label}
      aria-disabled={disabled || undefined}
      {...rest}
    >
      <span className="tv-upgrade-button__icon" aria-hidden="true">
        {iconMaskVariant ? (
          <span
            className={[
              "tv-upgrade-button__icon-mask",
              `tv-upgrade-button__icon-mask--${iconMaskVariant}`,
            ].join(" ")}
          />
        ) : (
          <img
            className="tv-upgrade-button__icon-asset"
            src={iconSrc}
            alt=""
            width="40"
            height="40"
            decoding="async"
          />
        )}
      </span>
      <span className="tv-upgrade-button__label">{label}</span>
    </FocusableButton>
  );
});

export default TvUpgradeButton;
