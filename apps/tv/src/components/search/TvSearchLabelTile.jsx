import { forwardRef } from "react";
import "./TvSearchLabelTile.css";

/**
 * Label-only square tile (308px) for Search music browse subs and genre pickers.
 * Ref + tabIndex on root so screen focus memory and parked-scroll geometry work.
 */
const TvSearchLabelTile = forwardRef(function TvSearchLabelTile(
  { label, focused = false, className = "", onKeyDown, onClick },
  ref,
) {
  const tileClass = [
    "tv-search-label-tile",
    focused ? "tv-search-label-tile--focused" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      ref={ref}
      className={tileClass}
      tabIndex={-1}
      role="button"
      onKeyDown={onKeyDown}
      onClick={onClick}
    >
      <span className="tv-search-label-tile__label">{label}</span>
    </div>
  );
});

export default TvSearchLabelTile;
