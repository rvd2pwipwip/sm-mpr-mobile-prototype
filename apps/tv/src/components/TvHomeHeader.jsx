import { useTerritory } from "../context/TerritoryContext.jsx";
import { musicLineupLabel } from "@sm-mpr/shared/constants/musicLineup.js";
import KeyboardWrapper from "./focus/KeyboardWrapper.jsx";
import TvUpgradeButton from "./TvUpgradeButton.jsx";
import "./TvHomeHeader.css";

function TvWordmarkPair() {
  return (
    <>
      <img
        className="tv-home-header__wordmark tv-home-header__wordmark--light"
        src="/stingrayMusic.svg"
        alt="Stingray Music"
        width="137"
        height="50"
        loading="eager"
        decoding="async"
      />
      <img
        className="tv-home-header__wordmark tv-home-header__wordmark--dark"
        src="/stingrayMusicDark.svg"
        alt=""
        width="137"
        height="50"
        loading="eager"
        decoding="async"
        aria-hidden="true"
      />
    </>
  );
}

/**
 * Home top chrome — Figma `broadHomeHeader` (`15515:41291`).
 * Upgrade is D-pad focus group 0; wordmark toggles territory (mouse only).
 */
export default function TvHomeHeader({
  groupIndex,
  focused = false,
  registerItemRef,
  onMoveUp,
  onMoveDown,
  onBoundaryLeft,
}) {
  const { musicLineupMode, toggleMusicLineupMode } = useTerritory();

  const handleUpgradeClick = () => {
    /* Upgrade flow deferred until TV subscription route exists. */
  };

  return (
    <header className="tv-home-header">
      <div className="tv-home-header__brand">
        <button
          type="button"
          className="tv-home-header__wordmark-toggle"
          onClick={toggleMusicLineupMode}
          title={`Catalog: ${musicLineupLabel(musicLineupMode)} (click to toggle)`}
          tabIndex={-1}
          aria-label={`Stingray Music. Catalog ${musicLineupLabel(musicLineupMode)}. Click to toggle territory.`}
        >
          <TvWordmarkPair />
        </button>
      </div>
      <div className="tv-home-header__actions">
        <KeyboardWrapper
          ref={(node) => registerItemRef?.(groupIndex, 0, node)}
          onUp={onMoveUp}
          onDown={onMoveDown}
          onLeft={() => onBoundaryLeft?.()}
        >
          {(focusProps) => (
            <TvUpgradeButton
              {...focusProps}
              focused={focused}
              onClick={handleUpgradeClick}
            />
          )}
        </KeyboardWrapper>
      </div>
    </header>
  );
}
