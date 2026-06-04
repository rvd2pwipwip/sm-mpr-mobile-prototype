import { useLayoutEffect } from "react";
import { useUserType } from "../../context/UserTypeContext.jsx";
import { showVisualAds } from "@sm-mpr/shared/utils/userTierRules.js";

/**
 * Sets `data-visual-ads` on `<html>` so scroll inners reserve footer ad height
 * (`--tv-scroll-ad-reserve` in `index.css`). Pair with `TvFooterAdBanner`.
 *
 * @param {{ enabled?: boolean }} props — when false, never sets the attribute (broad Home).
 */
export default function TvVisualAdsHtmlSync({ enabled = true }) {
  const { userType } = useUserType();

  useLayoutEffect(() => {
    const root = document.documentElement;
    if (enabled && showVisualAds(userType)) {
      root.setAttribute("data-visual-ads", "");
    } else {
      root.removeAttribute("data-visual-ads");
    }
    return () => root.removeAttribute("data-visual-ads");
  }, [enabled, userType]);

  return null;
}
