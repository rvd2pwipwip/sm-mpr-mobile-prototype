import { useLocation } from "react-router-dom";
import { CATALOG_SCOPE } from "../constants/catalogScope.js";
import { usePlayback } from "../context/PlaybackContext";
import { useTerritory } from "../context/TerritoryContext.jsx";
import { useUserType } from "../context/UserTypeContext";
import { showVisualAds } from "../utils/showVisualAds";
import { hideFooterChromeForPath } from "../utils/hideFooterChromeForPath";
import VisualAdStrip from "./VisualAdStrip";
import "./FooterChromeAd.css";

/**
 * Topmost footer **visual ad strip** (above `MiniPlayer`, then tabs / limited-only footer).
 * Same `showVisualAds(userType)` gate as before; `html[data-visual-ads]` + `--bottom-nav-stack-height`
 * must stay in sync (`index.css`).
 */
export default function FooterChromeAd() {
  const location = useLocation();
  const { catalogScope } = useTerritory();
  const { miniPlayerVisible } = usePlayback();
  const { userType } = useUserType();

  if (hideFooterChromeForPath(location.pathname)) return null;
  if (!showVisualAds(userType)) return null;

  const bottommost =
    catalogScope === CATALOG_SCOPE.limited && !miniPlayerVisible;

  return (
    <div
      className={[
        "footer-chrome-ad",
        bottommost ? "footer-chrome-ad--bottommost" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <VisualAdStrip variant="nav" />
    </div>
  );
}
