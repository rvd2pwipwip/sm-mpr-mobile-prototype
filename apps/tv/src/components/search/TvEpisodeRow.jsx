import { forwardRef } from "react";
import "./TvEpisodeRow.css";

/**
 * Compact episode hit row for Search results (TV list lane).
 */
const TvEpisodeRow = forwardRef(function TvEpisodeRow(
  {
    episodeTitle,
    showTitle,
    thumbnail,
    focused = false,
    onKeyDown,
    onClick,
  },
  ref,
) {
  const className = [
    "tv-episode-row",
    focused ? "tv-episode-row--focused" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      ref={ref}
      className={className}
      tabIndex={-1}
      onKeyDown={onKeyDown}
      onClick={onClick}
    >
      <span className="tv-episode-row__thumb-wrap">
        <img className="tv-episode-row__thumb" src={thumbnail} alt="" />
      </span>
      <span className="tv-episode-row__text">
        <span className="tv-episode-row__title">{episodeTitle}</span>
        <span className="tv-episode-row__show">{showTitle}</span>
      </span>
    </button>
  );
});

export default TvEpisodeRow;
