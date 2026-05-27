import { useLocation } from "react-router-dom";
import { CATALOG_SCOPE } from "../constants/catalogScope.js";
import { useTerritory } from "../context/TerritoryContext.jsx";
import { useUserType } from "../context/UserTypeContext";
import { showVisualAds } from "../utils/showVisualAds";
import { hideFooterChromeForPath } from "../utils/hideFooterChromeForPath";
import VisualAdStrip from "./VisualAdStrip";
import "./LimitedCatalogFooterAd.css";

/**
 * Bottom **visual ad strip** when `catalogScope === limited` (no tab bar). Same `showVisualAds(userType)`
 * gate as `BottomNav`; `html[data-visual-ads]` + `--bottom-nav-stack-height` must stay in sync
 * (`index.css` limited + ads override).
 */
export default function LimitedCatalogFooterAd() {
  const location = useLocation();
  const { catalogScope } = useTerritory();
  const { userType } = useUserType();

  if (catalogScope !== CATALOG_SCOPE.limited) return null;
  if (hideFooterChromeForPath(location.pathname)) return null;
  if (!showVisualAds(userType)) return null;

  return (
    <div className="limited-catalog-footer-ad">
      <VisualAdStrip variant="nav" />
    </div>
  );
}
