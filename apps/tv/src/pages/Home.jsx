import { MUSIC_CHANNELS } from "@sm-mpr/shared/data/musicChannels.js";
import { useTerritory } from "../context/TerritoryContext.jsx";
import { musicLineupLabel } from "@sm-mpr/shared/constants/musicLineup.js";
import TvHomeHeader from "../components/TvHomeHeader.jsx";
import DemoFocusRow from "../components/focus/DemoFocusRow.jsx";
import { useScreenContentFocus } from "../hooks/useScreenContentFocus.js";

export default function Home() {
  const { catalogScope, musicLineupMode } = useTerritory();

  const {
    handleMoveUp,
    handleMoveDown,
    handleMoveLeft,
    handleMoveRight,
    registerItemRef,
    isItemFocused,
  } = useScreenContentFocus("home", { groupCount: 1, itemCount: 3 });

  return (
    <div className="tv-home">
      <TvHomeHeader />
      <div className="tv-home__scroll">
        <div className="tv-home__banner" aria-hidden="true">
          Promo Banner
        </div>

        <DemoFocusRow
          groupIndex={0}
          isItemFocused={isItemFocused}
          registerItemRef={registerItemRef}
          onMoveUp={handleMoveUp}
          onMoveDown={handleMoveDown}
          onMoveLeft={handleMoveLeft}
          onMoveRight={handleMoveRight}
        />

        <p className="tv-home__catalog-proof">
          Shared catalog: <strong>{MUSIC_CHANNELS.length}</strong> music channels
          from <code>@sm-mpr/shared</code>. Territory:{" "}
          <strong>{musicLineupLabel(musicLineupMode)}</strong> (
          <code>{catalogScope}</code>). Wordmark click toggles limited / broad
          (mouse only).
        </p>
      </div>
    </div>
  );
}
