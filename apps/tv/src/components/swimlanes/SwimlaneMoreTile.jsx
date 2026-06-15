import { forwardRef } from "react";
import "../cards/ContentTileCard.css";
import "./SwimlaneMoreTile.css";

/**
 * Trailing square More tile (308px) for fixed swimlanes.
 */
const SwimlaneMoreTile = forwardRef(function SwimlaneMoreTile(
  { focused = false, onKeyDown, onClick, className = "" },
  ref,
) {
  const thumbWrapClass = [
    "tv-content-tile__thumb-wrap",
    focused ? "tv-content-tile__thumb-wrap--focused" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      ref={ref}
      className={["tv-content-tile swimlane-more-tile", className]
        .filter(Boolean)
        .join(" ")}
      tabIndex={-1}
      role="button"
      onKeyDown={onKeyDown}
      onClick={onClick}
    >
      <div className={thumbWrapClass}>
        <div className="tv-content-tile__thumbnail swimlane-more-tile__thumbnail">
          <span className="swimlane-more-tile__label">More</span>
        </div>
      </div>
    </div>
  );
});

export default SwimlaneMoreTile;
