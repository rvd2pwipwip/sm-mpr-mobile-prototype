import { useLocation } from "react-router-dom";
import { CATALOG_SCOPE } from "@sm-mpr/shared/constants/catalogScope.js";
import { useTerritory } from "../context/TerritoryContext.jsx";
import PrimaryNav from "./nav/PrimaryNav.jsx";

import { TV_FULL_PLAYER_PATH } from "../utils/tvScreensaverRoute.js";

export default function TvShell({ children }) {
  const { pathname } = useLocation();
  const { catalogScope } = useTerritory();
  const onFullScreenPlayer = TV_FULL_PLAYER_PATH.test(pathname);
  const showNav =
    catalogScope !== CATALOG_SCOPE.limited && !onFullScreenPlayer;

  return (
    <div className="tv-shell">
      {showNav ? <PrimaryNav /> : null}
      <main className="tv-shell__main">{children}</main>
    </div>
  );
}
