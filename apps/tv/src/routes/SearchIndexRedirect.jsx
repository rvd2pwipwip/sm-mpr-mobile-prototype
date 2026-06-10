import { Navigate } from "react-router-dom";
import { CATALOG_SCOPE } from "@sm-mpr/shared/constants/catalogScope.js";
import { resolveBroadSearchBrowseTab } from "@sm-mpr/shared/constants/searchBrowsePaths.js";
import { useContentProfile } from "../context/ContentProfileContext.jsx";
import { useTerritory } from "../context/TerritoryContext.jsx";
import Search from "../pages/Search.jsx";

/** `/search` — limited shell or broad redirect to last browse tab. */
export default function SearchIndexRedirect() {
  const { catalogScope } = useTerritory();
  const { enabledContentTypes } = useContentProfile();

  if (catalogScope === CATALOG_SCOPE.limited) {
    return <Search />;
  }

  const tab = resolveBroadSearchBrowseTab(enabledContentTypes);
  return <Navigate to={`/search/${tab}`} replace />;
}
