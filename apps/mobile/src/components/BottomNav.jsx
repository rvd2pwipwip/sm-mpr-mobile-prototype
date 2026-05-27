import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { CATALOG_SCOPE } from "../constants/catalogScope.js";
import {
  readStoredBroadSearchBrowseTab,
  writeStoredBroadSearchBrowseTab,
} from "../constants/searchBrowsePaths.js";
import { useTerritory } from "../context/TerritoryContext.jsx";
import { useUserType } from "../context/UserTypeContext";
import { showVisualAds } from "../utils/showVisualAds";
import VisualAdStrip from "./VisualAdStrip";
import "./BottomNav.css";

const NAV_ITEMS_BASE = [
  {
    id: "home",
    to: "/",
    end: true,
    label: "Home",
    maskClass: "bottom-nav__icon-mask--home",
  },
  {
    id: "search",
    to: "/search/music",
    label: "Search",
    maskClass: "bottom-nav__icon-mask--search",
  },
];

const LIBRARY_TAB = {
  id: "my-library",
  to: "/my-library",
  label: "My Library",
  maskClass: "bottom-nav__icon-mask--my-library",
};

const INFO_TAB = {
  id: "info",
  to: "/info",
  label: "Info",
  maskClass: "bottom-nav__icon-mask--info",
};

/** Fixed tab bar: `NavLink` + URL = active state (URL-driven, see docs/react-learning). */
export default function BottomNav({ className = "" }) {
  const rootClass = ["bottom-nav", className].filter(Boolean).join(" ");
  const location = useLocation();
  const navigate = useNavigate();
  const { userType } = useUserType();
  const { catalogScope } = useTerritory();
  const adsOn = showVisualAds(userType);

  const fourthTab = catalogScope === CATALOG_SCOPE.broad ? LIBRARY_TAB : INFO_TAB;
  const navItems = [...NAV_ITEMS_BASE, fourthTab];

  return (
    <nav className={rootClass}>
      <div className="bottom-nav__row">
        {navItems.map((item) => {
          const { id, to, end, label, maskClass } = item;

          const homeStackActive =
            id === "home" &&
            (location.pathname === "/upgrade" ||
              location.pathname.startsWith("/upgrade/") ||
              location.pathname.startsWith("/more") ||
              location.pathname.startsWith("/music"));

          const searchStackActive =
            id === "search" &&
            (location.pathname.startsWith("/search") ||
              location.pathname.startsWith("/radio"));

          const onInfoOrLibraryPath =
            location.pathname.startsWith("/my-library") ||
            location.pathname.startsWith("/info");

          const fourthStackActive =
            id === fourthTab.id && onInfoOrLibraryPath;

          const searchNavTo =
            id === "search"
              ? `/search/${readStoredBroadSearchBrowseTab() ?? "music"}`
              : to;

          const onSearchShell =
            id === "search" && location.pathname.startsWith("/search");

          return (
            <NavLink
              key={id}
              to={searchNavTo}
              end={Boolean(end)}
              onClick={
                onSearchShell
                  ? (e) => {
                      e.preventDefault();
                      writeStoredBroadSearchBrowseTab("music");
                      navigate({ pathname: "/search/music", search: "" });
                    }
                  : undefined
              }
              className={({ isActive }) =>
                [
                  "bottom-nav__item",
                  isActive || homeStackActive || searchStackActive || fourthStackActive
                    ? "bottom-nav__item--active"
                    : "",
                ]
                  .filter(Boolean)
                  .join(" ")
              }
            >
              <span className="bottom-nav__icon-label">
                <span className="bottom-nav__icon-slot">
                  <span
                    className={["bottom-nav__icon-mask", maskClass].join(" ")}
                    aria-hidden={true}
                  />
                </span>
                <span className="bottom-nav__label">{label}</span>
              </span>
              <span className="bottom-nav__indicator" />
            </NavLink>
          );
        })}
      </div>
      {adsOn ? <VisualAdStrip variant="nav" /> : null}
    </nav>
  );
}
