import "./OpenInNewIcon.css";

/**
 * External-link affordance — `public/openInNew.svg` via mask (tints with `color` / `currentColor`).
 */
export default function OpenInNewIcon({ className = "", size = 20, style }) {
  return (
    <span
      className={["open-in-new-icon", className].filter(Boolean).join(" ")}
      style={{ width: size, height: size, ...style }}
      aria-hidden={true}
    />
  );
}
