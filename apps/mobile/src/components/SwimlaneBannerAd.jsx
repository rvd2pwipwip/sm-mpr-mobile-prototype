import "./SwimlaneBannerAd.css";

/**
 * In-feed banner placeholder — scrolls with Home content (not fixed chrome).
 * Figma: UX-SM-MPR-Mobile-2604 — https://www.figma.com/design/duguG08ZOCWXQemLw59XJW/UX-SM-MPR-Mobile-2604?node-id=13548-75362
 */
export default function SwimlaneBannerAd({ className = "" }) {
  const root = ["swimlane-banner-ad", className].filter(Boolean).join(" ");

  return (
    <aside className={root} aria-label="Sponsored content">
      <div className="swimlane-banner-ad__inner">
        <span className="swimlane-banner-ad__badge">Ad</span>
        <p className="swimlane-banner-ad__title">Banner placement (prototype)</p>
        <p className="swimlane-banner-ad__meta">Scrolls with swimlanes · Replace with creative</p>
      </div>
    </aside>
  );
}
