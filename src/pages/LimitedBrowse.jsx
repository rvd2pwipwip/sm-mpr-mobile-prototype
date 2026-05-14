import { useLayoutEffect, useState } from "react";
import { Link } from "react-router-dom";
import HomeBanner from "../components/HomeBanner.jsx";
import LimitedBrowseTaxonomyRails from "../components/LimitedBrowseTaxonomyRails.jsx";
import SearchBrowseContentSwitcher from "../components/SearchBrowseContentSwitcher.jsx";
import UpgradeButton from "../components/UpgradeButton.jsx";
import { useHomeHeaderOffset, WordmarkPair } from "../components/HomeHeader.jsx";
import {
  BROWSE_TABS,
  readStoredLimitedBrowseTab,
  writeStoredLimitedBrowseTab,
} from "../constants/searchBrowsePaths.js";
import { useTerritory } from "../context/TerritoryContext.jsx";
import { useUserType } from "../context/UserTypeContext";
import { useGoUpgrade } from "../hooks/useGoUpgrade";
import { showUpgradeCallToAction } from "../utils/showVisualAds";
import "../components/HomeHeader.css";
import "../components/BottomNav.css";
import "./LimitedBrowse.css";

/** Local-only segments (no URLs; limited Browse is not on `/search/*`). */
const LIMITED_BROWSE_SWITCHER_SEGMENTS = BROWSE_TABS.map((t) => ({
  id: t.id,
  label: t.label,
}));

/**
 * Limited-catalog landing: header chrome + banner + Music|Podcasts|Radio switcher + taxonomy swimlanes.
 * `docs/Plans/catalog-scope-search-browse-refactor.md` Phase C.
 */
export default function LimitedBrowse() {
  const headerRef = useHomeHeaderOffset();
  /**
   * Broad Search browse derives the active strip from URL on every render (no flash).
   * Limited Browse has no path segment: restore from **sessionStorage** in the initializer so the
   * first commit already matches saved category; **`SearchBrowseContentSwitcher`** relies on matching
   * `activeIndex` plus its **`useLayoutEffect`** thumb measurement before paint (same combo as `/search/music` etc.).
   */
  const [browseTab, setBrowseTab] = useState(
    () => readStoredLimitedBrowseTab() ?? "music",
  );

  /** Persist synchronously before paint whenever the user changes tab (mirror layout-phase sync). */
  useLayoutEffect(() => {
    writeStoredLimitedBrowseTab(browseTab);
  }, [browseTab]);
  const { toggleMusicLineupMode } = useTerritory();
  const goUpgrade = useGoUpgrade();
  const { userType } = useUserType();
  const showUpgrade = showUpgradeCallToAction(userType);

  return (
    <main className="app-shell app-shell--footer-fixed limited-browse">
      <header ref={headerRef} className="limited-browse-header">
        <div className="limited-browse-header__wordmark-row">
          <button
            type="button"
            className="home-header__catalog-toggle limited-browse-header__wordmark-btn"
            onClick={toggleMusicLineupMode}
            aria-label="Prototype: toggle catalog scope between limited and broad"
            title="Prototype: tap to switch limited vs broad catalog"
          >
            <WordmarkPair />
          </button>
          <div className="limited-browse-header__wordmark-row-icons">
            <Link
              to="/search"
              className="limited-browse-header__icon-link"
              aria-label="Search"
            >
              <span className="bottom-nav__icon-slot">
                <span
                  className="bottom-nav__icon-mask bottom-nav__icon-mask--search"
                  aria-hidden={true}
                />
              </span>
            </Link>
            <Link
              to="/info"
              className="limited-browse-header__icon-link"
              aria-label="Account, settings, and info"
            >
              <span className="bottom-nav__icon-slot">
                <span
                  className="bottom-nav__icon-mask bottom-nav__icon-mask--info"
                  aria-hidden={true}
                />
              </span>
            </Link>
          </div>
        </div>

        {showUpgrade ? (
          <div className="limited-browse-header__upgrade-row">
            <UpgradeButton onClick={goUpgrade} />
          </div>
        ) : null}
      </header>

      <div className="app-shell-footer-scroll limited-browse__scroll">
        <div className="home-screen limited-browse__screen">
          <div className="content-inset">
            <HomeBanner />
          </div>

          <div className="content-inset limited-browse__switcher-wrap">
            <SearchBrowseContentSwitcher
              mode="local"
              segments={LIMITED_BROWSE_SWITCHER_SEGMENTS}
              activeId={browseTab}
              onActiveIdChange={(id) => setBrowseTab(id)}
            />
          </div>

          <LimitedBrowseTaxonomyRails activeBrowseTab={browseTab} />
        </div>
      </div>
    </main>
  );
}
