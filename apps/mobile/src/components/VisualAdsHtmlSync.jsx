import { useLayoutEffect } from "react";
import { useUserType } from "../context/UserTypeContext";
import { showVisualAds } from "../utils/showVisualAds";

/** Sets `data-visual-ads` on `<html>` so `--bottom-nav-stack-height` includes the ad strip. */
export default function VisualAdsHtmlSync() {
  const { userType } = useUserType();

  useLayoutEffect(() => {
    const root = document.documentElement;
    if (showVisualAds(userType)) {
      root.setAttribute("data-visual-ads", "");
    } else {
      root.removeAttribute("data-visual-ads");
    }
    return () => root.removeAttribute("data-visual-ads");
  }, [userType]);

  return null;
}
