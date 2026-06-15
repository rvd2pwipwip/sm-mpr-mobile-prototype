import { forwardRef } from "react";
import "../cards/ContentTileCard.css";
import "./SwimlaneClearTile.css";

/** Trailing square Clear tile for Listen again swimlane (compact size). */
const SwimlaneClearTile = forwardRef(function SwimlaneClearTile(
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
      className={["tv-content-tile swimlane-clear-tile", className]
        .filter(Boolean)
        .join(" ")}
      tabIndex={-1}
      role="button"
      aria-label="Clear listening history"
      onKeyDown={onKeyDown}
      onClick={onClick}
    >
      <div className={thumbWrapClass}>
        <div className="tv-content-tile__thumbnail swimlane-clear-tile__thumbnail">
          <span className="swimlane-clear-tile__label">Clear</span>
        </div>
      </div>
    </div>
  );
});

export default SwimlaneClearTile;
