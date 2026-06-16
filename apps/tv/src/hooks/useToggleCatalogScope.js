import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTerritory } from "../context/TerritoryContext.jsx";

/**
 * Wordmark easter egg: toggle broad/limited catalog and land on Home so the swap is visible.
 */
export function useToggleCatalogScope() {
  const { toggleMusicLineupMode } = useTerritory();
  const navigate = useNavigate();
  const location = useLocation();

  return useCallback(() => {
    toggleMusicLineupMode();

    if (location.pathname !== "/") {
      navigate({ pathname: "/", search: location.search }, { replace: true });
    }
  }, [toggleMusicLineupMode, navigate, location.pathname, location.search]);
}
