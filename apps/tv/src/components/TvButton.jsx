import { forwardRef } from "react";
import FocusableButton from "./focus/FocusableButton.jsx";
import "./TvButton.css";

function TvButtonIcon({ maskVariant = null, iconSrc = null }) {
  if (!maskVariant && !iconSrc) {
    return null;
  }

  return (
    <span className="tv-button__icon" aria-hidden="true">
      {maskVariant ? (
        <span
          className={[
            "tv-button__icon-mask",
            `tv-button__icon-mask--${maskVariant}`,
          ].join(" ")}
        />
      ) : (
        <img
          className="tv-button__icon-asset"
          src={iconSrc}
          alt=""
          width="40"
          height="40"
          decoding="async"
        />
      )}
    </span>
  );
}

/**
 * Figma TV `.button_lg` — primary CTA, secondary outline, subscribe accent2.
 * Optional leading (`iconSrc` / `iconMaskVariant`) and trailing
 * (`endIconSrc` / `endIconMaskVariant`) icon slots.
 */
const TvButton = forwardRef(function TvButton(
  {
    focused = false,
    onClick,
    className = "",
    variant = "primary",
    iconSrc = null,
    iconMaskVariant = null,
    endIconSrc = null,
    endIconMaskVariant = null,
    label = "",
    ariaLabel,
    disabled = false,
    ...rest
  },
  ref,
) {
  const startIconSrc = iconMaskVariant ? null : iconSrc;

  const rootClass = [
    "tv-button",
    variant === "secondary" ? "tv-button--secondary" : "",
    variant === "subscribe" ? "tv-button--subscribe" : "",
    disabled ? "tv-button--disabled" : "",
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
      <TvButtonIcon maskVariant={iconMaskVariant} iconSrc={startIconSrc} />
      <span className="tv-button__label">{label}</span>
      <TvButtonIcon maskVariant={endIconMaskVariant} iconSrc={endIconSrc} />
    </FocusableButton>
  );
});

export default TvButton;
