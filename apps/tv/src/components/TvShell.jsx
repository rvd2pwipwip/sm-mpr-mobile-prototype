import { CATALOG_SCOPE } from "@sm-mpr/shared/constants/catalogScope.js";
import { useTerritory } from "../context/TerritoryContext.jsx";
import PrimaryNav from "./nav/PrimaryNav.jsx";

export default function TvShell({ children }) {
  const { catalogScope } = useTerritory();
  const showNav = catalogScope !== CATALOG_SCOPE.limited;

  return (
    <div className="tv-shell">
      {showNav ? <PrimaryNav /> : null}
      <main className="tv-shell__main">{children}</main>
    </div>
  );
}
