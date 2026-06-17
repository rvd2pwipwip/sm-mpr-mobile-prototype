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
import TvUpgradeButton from "./TvUpgradeButton.jsx";
import "./TvLimitedHomeHeader.css";

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
 * Limited catalog Home header — Figma `limitedHomeHeader` (`15831:37572`).
 * Three columns: wordmark (start) | content switcher (center) | actions (end).
 * Center switcher stays centered when Upgrade is hidden (grid 1fr / auto / 1fr).
 */
export default function TvLimitedHomeHeader({
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
      ),
    [browseTabs, showContentSwitcher, showUpgrade],
  );

  const slotIndex = (kind, tabId) =>
    focusSlots.findIndex(
      (slot) => slot.kind === kind && (tabId == null || slot.tabId === tabId),
    );

  const upgradeIndex = slotIndex("upgrade");
  const infoIndex = slotIndex("info");
  const searchIndex = slotIndex("search");

  return (
    <header className="tv-limited-home-header">
      <div className="tv-limited-home-header__row">
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

        <div className="tv-limited-home-header__center">
          {showContentSwitcher ? (
            <TvHomeContentSwitcher
              segments={browseTabs}
              activeId={activeBrowseTab}
              onActiveIdChange={onBrowseTabChange}
              groupIndex={groupIndex}
              startItemIndex={0}
              focused={focused}
              focusedItemIndex={focusedItemIndex}
              registerItemRef={registerItemRef}
              onMoveUp={onMoveUp}
              onMoveDown={onMoveDown}
              onBoundaryLeft={onBoundaryLeft}
            />
          ) : null}
        </div>

        <div className="tv-limited-home-header__end">
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
                <TvUpgradeButton
                  {...focusProps}
                  focused={focused && focusedItemIndex === upgradeIndex}
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

          <div className="tv-limited-home-header__icons">
            <KeyboardWrapper
              ref={(node) => registerItemRef?.(groupIndex, infoIndex, node)}
              onSelect={() => navigate("/settings/user-type")}
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
        </div>
      </div>
    </header>
  );
}
