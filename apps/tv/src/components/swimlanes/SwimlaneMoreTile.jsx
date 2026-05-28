import { forwardRef } from "react";
import "../cards/ContentTileCard.css";
import "./SwimlaneMoreTile.css";

/**
 * Trailing square More tile (308px) for fixed swimlanes.
 */
const SwimlaneMoreTile = forwardRef(function SwimlaneMoreTile(
  { focused = false, onKeyDown, onClick },
  ref,
) {
  const thumbnailClass = [
    "tv-content-tile__thumbnail",
    "swimlane-more-tile__thumbnail",
    focused ? "tv-content-tile__thumbnail--focused" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      ref={ref}
      className="tv-content-tile swimlane-more-tile"
      tabIndex={-1}
      role="button"
      onKeyDown={onKeyDown}
      onClick={onClick}
    >
      <div className={thumbnailClass}>
        <span className="swimlane-more-tile__label">More</span>
      </div>
    </div>
  );
});

export default SwimlaneMoreTile;
