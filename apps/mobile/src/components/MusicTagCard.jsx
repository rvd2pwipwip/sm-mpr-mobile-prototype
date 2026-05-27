import "./AppInfoSwimlane.css";
import "./MusicArtistCard.css";

/**
 * Search **Tags** lane / **More** grid: label-only square (same visuals as **`MusicArtistCard`**
 * / Browse Genre vibe subs — e.g. “All Pop”).
 *
 * @param {{ tagLabel: string, onSelect?: () => void, compact?: boolean }} props
 */
export default function MusicTagCard({ tagLabel, onSelect, compact = false }) {
  const tileClass = [
    "app-info-swimlane__tile",
    "music-artist-card",
    compact ? "music-artist-card--compact" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      className={tileClass}
      aria-label={`Tag ${tagLabel}`}
      onClick={onSelect}
    >
      <span className="app-info-swimlane__tile-label music-artist-card__label">
        {tagLabel}
      </span>
    </button>
  );
}
