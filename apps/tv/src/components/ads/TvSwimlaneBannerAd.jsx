import "./TvSwimlaneBannerAd.css";

/**
 * In-feed Home banner — scrolls with swimlanes (mobile `SwimlaneBannerAd` parity).
 * Figma mobile ref: `13548:75362`; TV uses TV tokens and inset.
 */
export default function TvSwimlaneBannerAd({ className = "" }) {
  const root = ["tv-swimlane-banner-ad", className].filter(Boolean).join(" ");

  return (
    <aside className={root} aria-label="Sponsored content">
      <div className="tv-swimlane-banner-ad__inner">
        <span className="tv-swimlane-banner-ad__badge">Ad</span>
        <p className="tv-swimlane-banner-ad__title">Banner placement (prototype)</p>
        <p className="tv-swimlane-banner-ad__meta">
          Scrolls with swimlanes · Same slot as mobile Home
        </p>
      </div>
    </aside>
  );
}
