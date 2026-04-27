import "./VisualAdStrip.css";

/**
 * Shared visual ad placeholder — bottom of `BottomNav` and music player body.
 * Visibility is gated by `showVisualAds(userType)` at call sites.
 */
export default function VisualAdStrip({ variant = "nav", className = "" }) {
  const root = ["visual-ad-strip", `visual-ad-strip--${variant}`, className]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={root} role="img" aria-label="Ad placeholder">
      Ad placeholder
    </div>
  );
}
