import { NavLink } from "react-router-dom";
import "./PrimaryNav.css";

const NAV_ITEMS = [
  { id: "home", to: "/", label: "Home", end: true },
  { id: "search", to: "/search", label: "Search" },
  { id: "my-library", to: "/my-library", label: "My Library" },
];

export default function PrimaryNav() {
  return (
    <nav className="primary-nav" aria-label="Primary">
      <p className="primary-nav__brand">SM MPR</p>
      <ul className="primary-nav__list">
        {NAV_ITEMS.map(({ id, to, label, end }) => (
          <li key={id}>
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                isActive ? "primary-nav__link is-active" : "primary-nav__link"
              }
            >
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
