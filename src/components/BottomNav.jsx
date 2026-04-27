import { NavLink, useLocation } from "react-router-dom";
import "./BottomNav.css";

const NAV_ITEMS = [
  {
    id: "home",
    to: "/",
    end: true,
    label: "Home",
    maskClass: "bottom-nav__icon-mask--home",
  },
  {
    id: "search",
    to: "/search",
    label: "Search",
    maskClass: "bottom-nav__icon-mask--search",
  },
  {
    id: "info",
    to: "/info",
    label: "Info",
    maskClass: "bottom-nav__icon-mask--info",
  },
];

/** Fixed tab bar: `NavLink` + URL = active state (URL-driven, see docs/react-learning). */
export default function BottomNav({ className = "" }) {
  const rootClass = ["bottom-nav", className].filter(Boolean).join(" ");
  const location = useLocation();

  return (
    <nav className={rootClass}>
      <div className="bottom-nav__row">
        {NAV_ITEMS.map((item) => {
          const { id, to, end, label, maskClass } = item;

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
    </nav>
  );
}
