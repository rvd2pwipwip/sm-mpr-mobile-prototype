import OpenInNewIcon from "./OpenInNewIcon";
import "./Button.css";

/**
 * External URL as Figma secondary (`button/md` outline) — same chrome as
 * `Button variant="secondary"` for `<a>` (e.g. Create account on Info Account).
 */
export default function ExternalSecondaryLink({
  href,
  children,
  className = "",
  endIcon = true,
  onClick,
  target = "_blank",
  rel = "noopener noreferrer",
}) {
  return (
    <a
      href={href}
      onClick={onClick}
      className={["btn", "btn--secondary", className].filter(Boolean).join(" ")}
      target={target}
      rel={rel}
    >
      <span className="btn__label">{children}</span>
      {endIcon ? (
        <span className="btn__icon btn__icon--end">
          <OpenInNewIcon />
        </span>
      ) : null}
    </a>
  );
}
