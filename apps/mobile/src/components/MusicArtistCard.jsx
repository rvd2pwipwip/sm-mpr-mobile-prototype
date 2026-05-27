import "./AppInfoSwimlane.css";
import "./MusicArtistCard.css";

/**
 * Search swimlane/grid tile for an artist: **label-only square** tile (same pattern as Browse
 * Genre vibe **sub** tiles, e.g. “All Pop” on `SearchMusicVibeBrowseRail`).
 *
 * @param {{ artist: { id: string, name: string }, onSelect?: () => void, compact?: boolean }} props
 */
export default function MusicArtistCard({ artist, onSelect, compact = false }) {
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
      aria-label={`Artist ${artist.name}`}
      onClick={onSelect}
    >
      <span className="app-info-swimlane__tile-label music-artist-card__label">
        {artist.name}
      </span>
    </button>
  );
}
