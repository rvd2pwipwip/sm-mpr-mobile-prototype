import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  PROVIDER_LOGO_DARK_URL,
  PROVIDER_LOGO_LIGHT_URL,
} from "@sm-mpr/shared/constants/externalLinks.js";
import { musicLineupLabel } from "@sm-mpr/shared/constants/musicLineup.js";
import { showUpgradeCallToAction } from "@sm-mpr/shared/utils/userTierRules.js";
import { useTerritory } from "../context/TerritoryContext.jsx";
import { useGoUpgrade } from "../hooks/useGoUpgrade.js";
import { useToggleCatalogScope } from "../hooks/useToggleCatalogScope.js";
import { useUserType } from "../context/UserTypeContext.jsx";
import {
  buildLimitedHomeHeaderFocusSlots,
} from "../utils/limitedHomeHeaderFocus.js";
import KeyboardWrapper from "./focus/KeyboardWrapper.jsx";
import TvHeaderIconButton from "./TvHeaderIconButton.jsx";
import TvHomeContentSwitcher from "./TvHomeContentSwitcher.jsx";
import TvMiniPlayer from "./nav/TvMiniPlayer.jsx";
import TvButton from "./TvButton.jsx";
import "./TvLimitedHomeHeader.css";
import "./TvLimitedHomeHeaderStacked.css";

function TvWordmarkPair() {
  return (
    <>
      <img
        className="tv-limited-home-header__wordmark tv-limited-home-header__wordmark--light"
        src="/stingrayMusic.svg"
        alt="Stingray Music"
        width="137"
        height="50"
        loading="eager"
        decoding="async"
      />
      <img
        className="tv-limited-home-header__wordmark tv-limited-home-header__wordmark--dark"
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

function TvProviderLogoPair() {
  return (
    <>
      <img
        className="tv-limited-home-header__provider-logo tv-limited-home-header__provider-logo--light"
        src={PROVIDER_LOGO_LIGHT_URL}
        alt="Provider"
        width="201"
        height="63"
        loading="eager"
        decoding="async"
      />
      <img
        className="tv-limited-home-header__provider-logo tv-limited-home-header__provider-logo--dark"
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

/**
 * Layout B limited header — Figma `15832:37717`.
 * Start: wordmark + actions | Center: content switcher | End: mini player only.
 */
export default function TvLimitedHomeHeaderStacked({
  groupIndex,
  focused = false,
  focusedItemIndex = 0,
  registerItemRef,
  onMoveUp,
  onMoveDown,
  onBoundaryLeft,
  browseTabs,
  activeBrowseTab,
  onBrowseTabChange,
  showContentSwitcher,
  showMiniPlayer = false,
  miniPlayerTitle = "",
  miniPlayerSubtitle = "",
  miniPlayerThumbnail = "",
  miniPlayerPlaying = true,
  miniPlayerVariant = "music",
  onMiniPlayerSelect,
}) {
  const navigate = useNavigate();
  const goUpgrade = useGoUpgrade();
  const { userType } = useUserType();
  const { musicLineupMode } = useTerritory();
  const toggleCatalogScope = useToggleCatalogScope();
  const showUpgrade = showUpgradeCallToAction(userType);
  const showProvider = userType === "freeProvided";

  const focusSlots = useMemo(
    () =>
      buildLimitedHomeHeaderFocusSlots(
        browseTabs,
        showContentSwitcher,
        showUpgrade,
        showMiniPlayer,
        { stacked: true },
      ),
    [browseTabs, showContentSwitcher, showUpgrade, showMiniPlayer],
  );

  const slotIndex = (kind, tabId) =>
    focusSlots.findIndex(
      (slot) => slot.kind === kind && (tabId == null || slot.tabId === tabId),
    );

  const upgradeIndex = slotIndex("upgrade");
  const miniIndex = slotIndex("miniPlayer");
  const infoIndex = slotIndex("info");
  const searchIndex = slotIndex("search");
  const firstTabIndex = focusSlots.findIndex((slot) => slot.kind === "tab");

  return (
    <header className="tv-limited-home-header tv-limited-home-header--stacked">
      <div className="tv-limited-home-header__row tv-limited-home-header__row--stacked">
        <div className="tv-limited-home-header__start-cluster">
          <div className="tv-limited-home-header__start">
            <button
              type="button"
              className="tv-limited-home-header__wordmark-toggle"
              onClick={toggleCatalogScope}
              title={`Catalog: ${musicLineupLabel(musicLineupMode)} (click to toggle)`}
              tabIndex={-1}
              aria-label={`Stingray Music. Catalog ${musicLineupLabel(musicLineupMode)}. Click to toggle territory.`}
            >
              <TvWordmarkPair />
            </button>
          </div>

          <div className="tv-limited-home-header__icons">
            <KeyboardWrapper
              ref={(node) => registerItemRef?.(groupIndex, infoIndex, node)}
              onSelect={() => navigate("/info")}
              onUp={onMoveUp}
              onDown={onMoveDown}
            >
              {(focusProps) => (
                <TvHeaderIconButton
                  {...focusProps}
                  iconMaskClass="tv-header-icon-button__mask--info"
                  label="Account, settings, and info"
                  focused={focused && focusedItemIndex === infoIndex}
                />
              )}
            </KeyboardWrapper>

            <KeyboardWrapper
              ref={(node) =>
                registerItemRef?.(groupIndex, searchIndex, node)
              }
              onSelect={() => navigate("/search")}
              onUp={onMoveUp}
              onDown={onMoveDown}
            >
              {(focusProps) => (
                <TvHeaderIconButton
                  {...focusProps}
                  iconMaskClass="tv-header-icon-button__mask--search"
                  label="Search"
                  focused={focused && focusedItemIndex === searchIndex}
                />
              )}
            </KeyboardWrapper>
          </div>

          {showUpgrade ? (
            <KeyboardWrapper
              ref={(node) =>
                registerItemRef?.(groupIndex, upgradeIndex, node)
              }
              onSelect={goUpgrade}
              onUp={onMoveUp}
              onDown={onMoveDown}
            >
              {(focusProps) => (
                <TvButton
                  {...focusProps}
                  focused={focused && focusedItemIndex === upgradeIndex}
                  label="Upgrade"
                  iconSrc="/upgrade.svg"
                />
              )}
            </KeyboardWrapper>
          ) : null}

          {showProvider ? (
            <div
              className="tv-limited-home-header__provider"
              aria-label="Provider access"
            >
              <TvProviderLogoPair />
            </div>
          ) : null}
        </div>

        <div className="tv-limited-home-header__center">
          {showContentSwitcher ? (
            <TvHomeContentSwitcher
              segments={browseTabs}
              activeId={activeBrowseTab}
              onActiveIdChange={onBrowseTabChange}
              groupIndex={groupIndex}
              startItemIndex={firstTabIndex >= 0 ? firstTabIndex : 0}
              focused={focused}
              focusedItemIndex={focusedItemIndex}
              registerItemRef={registerItemRef}
              onMoveUp={onMoveUp}
              onMoveDown={onMoveDown}
              onBoundaryLeft={onBoundaryLeft}
            />
          ) : null}
        </div>

        <div className="tv-limited-home-header__end tv-limited-home-header__end--stacked">
          {showMiniPlayer ? (
            <div className="tv-limited-home-header__mini-player">
              <KeyboardWrapper
                onSelect={onMiniPlayerSelect}
                onUp={onMoveUp}
                onDown={onMoveDown}
              >
                {(focusProps) => (
                  <TvMiniPlayer
                    {...focusProps}
                    ref={(node) => {
                      const { ref: focusRef } = focusProps;
                      if (typeof focusRef === "function") {
                        focusRef(node);
                      } else if (focusRef) {
                        focusRef.current = node;
                      }
                      registerItemRef?.(groupIndex, miniIndex, node);
                    }}
                    expanded
                    variant={miniPlayerVariant}
                    playing={miniPlayerPlaying}
                    thumbnail={miniPlayerThumbnail}
                    title={miniPlayerTitle}
                    subtitle={miniPlayerSubtitle}
                    focused={focused && focusedItemIndex === miniIndex}
                    className="tv-mini-player--header-embed"
                  />
                )}
              </KeyboardWrapper>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
