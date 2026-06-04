import { useNavigate } from "react-router-dom";
import {
  PROVIDER_LOGO_DARK_URL,
  PROVIDER_LOGO_LIGHT_URL,
} from "@sm-mpr/shared/constants/externalLinks.js";
import { musicLineupLabel } from "@sm-mpr/shared/constants/musicLineup.js";
import { showUpgradeCallToAction } from "@sm-mpr/shared/utils/userTierRules.js";
import { useTerritory } from "../context/TerritoryContext.jsx";
import { useUserType } from "../context/UserTypeContext.jsx";
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
function TvProviderLogoPair() {
  return (
    <>
      <img
        className="tv-home-header__provider-logo tv-home-header__provider-logo--light"
        src={PROVIDER_LOGO_LIGHT_URL}
        alt="Provider"
        width="201"
        height="63"
        loading="eager"
        decoding="async"
      />
      <img
        className="tv-home-header__provider-logo tv-home-header__provider-logo--dark"
        src={PROVIDER_LOGO_DARK_URL}
        alt=""
        width="201"
        height="63"
        loading="eager"
        decoding="async"
        aria-hidden="true"
      />
    </>
  );
}

export default function TvHomeHeader({
  groupIndex,
  focused = false,
  registerItemRef,
  onMoveUp,
  onMoveDown,
  onBoundaryLeft,
}) {
  const navigate = useNavigate();
  const { userType } = useUserType();
  const { musicLineupMode, toggleMusicLineupMode } = useTerritory();
  const showUpgrade = showUpgradeCallToAction(userType);
  const subscribed = userType === "subscribed";

  const handleUpgradeClick = () => {
    navigate("/settings/user-type");
  };

  return (
    <header
      className={[
        "tv-home-header",
        subscribed ? "tv-home-header--subscribed" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div
        className={[
          "tv-home-header__brand",
          subscribed ? "tv-home-header__brand--solo" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
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
      {subscribed ? null : (
        <div className="tv-home-header__actions">
          {showUpgrade ? (
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
          ) : (
            <div className="tv-home-header__provider" aria-label="Provider access">
              <TvProviderLogoPair />
            </div>
          )}
        </div>
      )}
    </header>
  );
}
