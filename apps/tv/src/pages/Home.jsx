import { MUSIC_CHANNELS } from "@sm-mpr/shared/data/musicChannels.js";
import { useTerritory } from "../context/TerritoryContext.jsx";
import { musicLineupLabel } from "@sm-mpr/shared/constants/musicLineup.js";
import TvHomeHeader from "../components/TvHomeHeader.jsx";

export default function Home() {
  const { catalogScope, musicLineupMode } = useTerritory();

  return (
    <div className="tv-home">
      <TvHomeHeader />
      <div className="tv-home__scroll">
        <div className="tv-home__banner" aria-hidden="true">
          Promo Banner
        </div>

        <p className="tv-home__phase-note">
          Phase 0 complete. Swimlanes and D-pad focus start in Phase 1.
        </p>

        <p className="tv-home__catalog-proof">
          Shared catalog: <strong>{MUSIC_CHANNELS.length}</strong> music channels
          loaded from <code>@sm-mpr/shared</code>. Territory:{" "}
          <strong>{musicLineupLabel(musicLineupMode)}</strong> (
          <code>{catalogScope}</code>). Click the wordmark to toggle limited / broad.
        </p>
      </div>
    </div>
  );
}
