import "./TvSearchLabelTile.css";

/**
 * Label-only square tile (308px) for Search music browse subs and genre pickers.
 */
export default function TvSearchLabelTile({ label, focused = false, className = "" }) {
  return (
    <div
      className={[
        "tv-search-label-tile",
        focused ? "tv-search-label-tile--focused" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <span className="tv-search-label-tile__label">{label}</span>
    </div>
  );
}
