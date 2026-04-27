import { NavLink, useLocation } from "react-router-dom";
import { MprNavIconHome, MprNavIconInfo, MprNavIconSearch } from "./MprNavIcons";
import "./BottomNav.css";

const NAV_ITEMS = [
  { id: "home", to: "/", end: true, label: "Home", Icon: MprNavIconHome },
  { id: "search", to: "/search", label: "Search", Icon: MprNavIconSearch },
  { id: "info", to: "/info", label: "Info", Icon: MprNavIconInfo },
];

/** Fixed tab bar: `NavLink` + URL = active state (URL-driven, see docs/react-learning). */
export default function BottomNav({ className = "" }) {
  const rootClass = ["bottom-nav", className].filter(Boolean).join(" ");
  const location = useLocation();

  return (
    <nav className={rootClass}>
      <div className="bottom-nav__row">
        {NAV_ITEMS.map((item) => {
          const { id, to, end, label, Icon: NavIcon } = item;

          const homeStackActive =
            id === "home" &&
            (location.pathname === "/upgrade" || location.pathname.startsWith("/music"));

          return (
            <NavLink
              key={id}
              to={to}
              end={Boolean(end)}
              className={({ isActive }) =>
                [
                  "bottom-nav__item",
                  isActive || homeStackActive ? "bottom-nav__item--active" : "",
                ]
                  .filter(Boolean)
                  .join(" ")
              }
            >
              <span className="bottom-nav__icon-label">
                <span className="bottom-nav__icon-slot">
                  <NavIcon />
                </span>
                <span className="bottom-nav__label">{label}</span>
              </span>
              <span className="bottom-nav__indicator" />
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
