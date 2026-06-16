import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { resolveBroadSearchBrowseTab } from "@sm-mpr/shared/constants/searchBrowsePaths.js";
import { useContentProfile } from "../context/ContentProfileContext.jsx";
import { useTerritory } from "../context/TerritoryContext.jsx";
import { getCatalogScopeRouteTarget } from "../utils/catalogScopeRoutes.js";

/**
 * Keeps the URL aligned with broad vs limited catalog shell whenever scope changes.
 */
export default function CatalogScopeRouteSync() {
  const { catalogScope } = useTerritory();
  const { enabledContentTypes } = useContentProfile();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const broadSearchTab = resolveBroadSearchBrowseTab(enabledContentTypes);
    const target = getCatalogScopeRouteTarget(
      location.pathname,
      location.search,
      catalogScope,
      broadSearchTab,
    );
    if (!target) return;

    const nextPath = target.pathname + (target.search ?? "");
    const currentPath = location.pathname + location.search;
    if (nextPath === currentPath) return;

    navigate(target, { replace: true });
  }, [
    catalogScope,
    enabledContentTypes,
    location.pathname,
    location.search,
    navigate,
  ]);

  return null;
}
