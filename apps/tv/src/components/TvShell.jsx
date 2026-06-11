import { useLocation } from "react-router-dom";
import { CATALOG_SCOPE } from "@sm-mpr/shared/constants/catalogScope.js";
import { useTerritory } from "../context/TerritoryContext.jsx";
import PrimaryNav from "./nav/PrimaryNav.jsx";

const FULL_PLAYER_PATH = /^\/music\/[^/]+\/play\/?$/;

export default function TvShell({ children }) {
  const { pathname } = useLocation();
  const { catalogScope } = useTerritory();
  const onFullMusicPlayer = FULL_PLAYER_PATH.test(pathname);
  const showNav =
    catalogScope !== CATALOG_SCOPE.limited && !onFullMusicPlayer;

  return (
    <div className="tv-shell">
      {showNav ? <PrimaryNav /> : null}
      <main className="tv-shell__main">{children}</main>
    </div>
  );
}
