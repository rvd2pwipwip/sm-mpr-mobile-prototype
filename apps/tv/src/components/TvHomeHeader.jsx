import { useTerritory } from "../context/TerritoryContext.jsx";
import { musicLineupLabel } from "@sm-mpr/shared/constants/musicLineup.js";

/**
 * Broad Home top bar — logo wordmark toggles catalog territory (mouse click only).
 * Figma: `broadHomeHeader` in SM HTML TV MPR (`15752:36012`).
 */
export default function TvHomeHeader() {
  const { musicLineupMode, toggleMusicLineupMode } = useTerritory();

  return (
    <header className="tv-home-header">
      <button
        type="button"
        className="tv-home-header__wordmark"
        onClick={toggleMusicLineupMode}
        title={`Catalog: ${musicLineupLabel(musicLineupMode)} (click to toggle)`}
        tabIndex={-1}
        aria-label={`Stingray Music. Catalog ${musicLineupLabel(musicLineupMode)}. Click to toggle territory.`}
      >
        STINGRAY MUSIC
      </button>
      <span className="tv-home-header__territory-hint" aria-hidden="true">
        {musicLineupLabel(musicLineupMode)}
      </span>
    </header>
  );
}
