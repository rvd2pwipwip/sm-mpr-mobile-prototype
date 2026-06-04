import { useUserType } from "../../context/UserTypeContext.jsx";
import { showVisualAds } from "@sm-mpr/shared/utils/userTierRules.js";
import "./TvFooterAdBanner.css";

/**
 * Fixed footer ad band (SMTV03 `AdBanner` pattern) — not in the D-pad focus tree.
 * Gated by the same `showVisualAds(userType)` rule as mobile `VisualAdStrip`.
 *
 * Not mounted on broad Home (in-feed `TvSwimlaneBannerAd` only).
 * Limited catalog: rendered from `TvShell` with `TvVisualAdsHtmlSync`.
 */
export default function TvFooterAdBanner() {
  const { userType } = useUserType();
  if (!showVisualAds(userType)) return null;

  return (
    <div className="tv-footer-ad" role="img" aria-label="Ad placeholder">
      <span className="tv-footer-ad__label">Ad placeholder</span>
    </div>
  );
}
