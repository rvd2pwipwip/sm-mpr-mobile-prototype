import { forwardRef } from "react";
import "../cards/ContentTileCard.css";
import "./TvLibraryHistoryEmptyTile.css";

/**
 * Placeholder tile when a My Library history row has no items yet.
 * Standard media card geometry (308px thumb + label); ref on root, ring on thumb-wrap.
 */
const TvLibraryHistoryEmptyTile = forwardRef(function TvLibraryHistoryEmptyTile(
  { label, focused = false, onKeyDown, onClick },
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
      className="tv-content-tile tv-library-history-empty-tile"
      tabIndex={-1}
      role="button"
      aria-label={label}
      onKeyDown={onKeyDown}
      onClick={onClick}
    >
      <div className={thumbWrapClass}>
        <div className="tv-content-tile__thumbnail tv-library-history-empty-tile__thumbnail">
          <span
            className="tv-library-history-empty-tile__icon"
            aria-hidden={true}
          />
        </div>
      </div>
      <p className="tv-content-tile__title tv-library-history-empty-tile__label">
        {label}
      </p>
    </div>
  );
});

export default TvLibraryHistoryEmptyTile;
