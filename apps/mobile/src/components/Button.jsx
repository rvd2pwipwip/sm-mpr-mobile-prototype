import "./Button.css";

/**
 * Figma `button/md` (node 19726:48115): CTA = solid `accent2` fill; secondary = 2px outline, transparent fill.
 * `subscribe-primary` = blue `accent` fill (Subscription screen, Figma `220:40551`).
 * Optional `startIcon` / `endIcon` (e.g. `<svg />` with `currentColor`, or `<img className="btn__icon-asset" src="…" alt="" />`).
 */
export default function Button({
  variant = "cta",
  startIcon,
  endIcon,
  children,
  className = "",
  type = "button",
  disabled = false,
  onClick,
}) {
  const rootClass = ["btn", `btn--${variant}`, className].filter(Boolean).join(" ");

  return (
    <button
      type={type}
      className={rootClass}
      disabled={disabled}
      onClick={onClick}
    >
      {startIcon ? <span className="btn__icon btn__icon--start">{startIcon}</span> : null}
      <span className="btn__label">{children}</span>
      {endIcon ? <span className="btn__icon btn__icon--end">{endIcon}</span> : null}
    </button>
  );
}
