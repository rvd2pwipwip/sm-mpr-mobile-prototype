import { CATALOG_SCOPE } from "@sm-mpr/shared/constants/catalogScope.js";
import { useTerritory } from "../context/TerritoryContext.jsx";
import BroadHome from "./BroadHome.jsx";
import LimitedHome from "./LimitedHome.jsx";

/** Territory-driven Home: broad rails vs limited filter + channel rail. */
export default function Home() {
  const { catalogScope } = useTerritory();

  if (catalogScope === CATALOG_SCOPE.limited) {
    return <LimitedHome />;
  }

  return <BroadHome />;
}
