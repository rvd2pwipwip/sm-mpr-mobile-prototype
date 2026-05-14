import { Link } from "react-router-dom";
import HomeBanner from "../components/HomeBanner.jsx";
import UpgradeButton from "../components/UpgradeButton.jsx";
import { useHomeHeaderOffset, WordmarkPair } from "../components/HomeHeader.jsx";
import { useTerritory } from "../context/TerritoryContext.jsx";
import { useUserType } from "../context/UserTypeContext";
import { useGoUpgrade } from "../hooks/useGoUpgrade";
import { showUpgradeCallToAction } from "../utils/showVisualAds";
import "../components/HomeHeader.css";
import "../components/BottomNav.css";
import "./LimitedBrowse.css";

/**
 * Limited-catalog landing (stacked genre/topic/format swimlanes + banner in follow-up work).
 * Row 1: wordmark (left) + Search / Info (right). Row 2: centered Upgrade when guest / free Stingray.
 * `docs/Plans/catalog-scope-search-browse-refactor.md`
 */
export default function LimitedBrowse() {
  const headerRef = useHomeHeaderOffset();
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
        <div className="limited-browse__scroll-inner">
          <div className="content-inset">
            <HomeBanner />
            <div className="limited-browse__intro">
              <h1 className="limited-browse__title">Browse</h1>
              <p className="text-muted limited-browse__lede">
                Music, podcasts, and radio swimlanes by category will stack here. Use Search or Info
                in the header in the meantime.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
