import "./ButtonSmall.css";

/**
 * Figma `button_sm` — compact row (Channel Info Play / Like / Share).
 * `cta` = solid `accent` fill; `secondary` = 2px outline, transparent fill.
 */
export default function ButtonSmall({
  variant = "cta",
  fullWidth = false,
  startIcon,
  endIcon,
  children,
  className = "",
  type = "button",
  disabled = false,
  onClick,
}) {
  const rootClass = [
    "btn-sm",
    `btn-sm--${variant}`,
    fullWidth ? "btn-sm--full-width" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type={type}
      className={rootClass}
      disabled={disabled}
      onClick={onClick}
    >
      {startIcon ? (
        <span className="btn-sm__icon btn-sm__icon--start">{startIcon}</span>
      ) : null}
      {children != null && children !== "" ? (
        <span className="btn-sm__label">{children}</span>
      ) : null}
      {endIcon ? (
        <span className="btn-sm__icon btn-sm__icon--end">{endIcon}</span>
      ) : null}
    </button>
  );
}
