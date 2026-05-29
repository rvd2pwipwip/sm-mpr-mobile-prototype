import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import KeyboardWrapper from "../focus/KeyboardWrapper.jsx";
import FocusableButton from "../focus/FocusableButton.jsx";
import {
  FOCUS_ZONE_NAV,
  useTvNavFocus,
} from "../../context/TvNavFocusContext.jsx";
import {
  NavHomeIcon,
  NavLibraryIcon,
  NavSearchIcon,
} from "./PrimaryNavIcons.jsx";
import "./PrimaryNav.css";

const NAV_ITEMS = [
  {
    id: "home",
    to: "/",
    label: "Home",
    end: true,
    screenId: "home",
    Icon: NavHomeIcon,
  },
  {
    id: "search",
    to: "/search",
    label: "Search",
    screenId: "search",
    Icon: NavSearchIcon,
  },
  {
    id: "my-library",
    to: "/my-library",
    label: "My Library",
    screenId: "my-library",
    Icon: NavLibraryIcon,
  },
];

function isNavItemActive(pathname, item) {
  const { to, end, id } = item;
  if (id === "home") {
    return (
      pathname === "/" ||
      pathname.startsWith("/music/") ||
      pathname.startsWith("/more/")
    );
  }
  if (end) return pathname === to;
  return pathname === to || pathname.startsWith(`${to}/`);
}

export default function PrimaryNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const navRefs = useRef([]);

  const {
    focusZone,
    navExpanded,
    navFocusedIndex,
    enterContent,
    enterContentWithRestore,
    moveNavFocus,
  } = useTvNavFocus();

  useEffect(() => {
    if (focusZone !== FOCUS_ZONE_NAV) return;
    navRefs.current[navFocusedIndex]?.focus();
  }, [focusZone, navFocusedIndex]);

  const navClassName = [
    "primary-nav",
    navExpanded ? "primary-nav--expanded" : "primary-nav--collapsed",
    focusZone === FOCUS_ZONE_NAV ? "primary-nav--focused-zone" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <nav className={navClassName} aria-label="Primary">
      <p className="primary-nav__brand" aria-hidden={!navExpanded}>
        {navExpanded ? "SM MPR" : "SM"}
      </p>
      <ul className="primary-nav__list">
        {NAV_ITEMS.map((item, index) => {
          const active = isNavItemActive(location.pathname, item);
          const focused =
            focusZone === FOCUS_ZONE_NAV && navFocusedIndex === index;
          const { Icon } = item;

          return (
            <li key={item.id}>
              <KeyboardWrapper
                ref={(node) => {
                  navRefs.current[index] = node;
                }}
                onSelect={() => {
                  navigate(item.to);
                  enterContent();
                }}
                onUp={() => moveNavFocus(-1)}
                onDown={() => {
                  if (index === NAV_ITEMS.length - 1) {
                    enterContentWithRestore();
                    return;
                  }
                  moveNavFocus(1);
                }}
                onRight={() => enterContentWithRestore()}
              >
                {(focusProps) => (
                  <FocusableButton
                    {...focusProps}
                    focused={focused}
                    className={[
                      "primary-nav__link",
                      active ? "primary-nav__link--active" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    aria-current={active ? "page" : undefined}
                  >
                    <span className="primary-nav__icon">
                      <Icon />
                    </span>
                    {navExpanded ? (
                      <span className="primary-nav__label">{item.label}</span>
                    ) : null}
                  </FocusableButton>
                )}
              </KeyboardWrapper>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
