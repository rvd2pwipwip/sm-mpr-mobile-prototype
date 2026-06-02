import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import KeyboardWrapper from "../focus/KeyboardWrapper.jsx";
import FocusableButton from "../focus/FocusableButton.jsx";
import {
  FOCUS_ZONE_NAV,
  useTvNavFocus,
} from "../../context/TvNavFocusContext.jsx";
import "./PrimaryNav.css";

const NAV_ITEMS = [
  {
    id: "home",
    to: "/",
    label: "Home",
    end: true,
    screenId: "home",
    maskClass: "primary-nav__icon-mask--home",
  },
  {
    id: "search",
    to: "/search",
    label: "Search",
    screenId: "search",
    maskClass: "primary-nav__icon-mask--search",
  },
  {
    id: "my-library",
    to: "/my-library",
    label: "My Library",
    screenId: "my-library",
    maskClass: "primary-nav__icon-mask--my-library",
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
      {/*
        Clip/reveal panel (Figma TabletVerticalMainMenu): fixed 250px canvas, viewport
        width animates 80px -> 250px. Icons stay put; labels clip in/out.
        Mini-player mounts in __mini-player-slot; gap reserved per Figma.
      */}
      <div className="primary-nav__panel">
        <div className="primary-nav__mini-player-slot" aria-hidden="true" />
        <div className="primary-nav__menu-spacer" aria-hidden="true" />
        <ul className="primary-nav__list">
          {NAV_ITEMS.map((item, index) => {
            const active = isNavItemActive(location.pathname, item);
            const focused =
              focusZone === FOCUS_ZONE_NAV && navFocusedIndex === index;
            return (
              <li key={item.id} className="primary-nav__item">
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
                      <span className="primary-nav__icon-stack">
                      <span className="primary-nav__icon">
                        <span
                          className={[
                            "primary-nav__icon-mask",
                            item.maskClass,
                          ].join(" ")}
                          aria-hidden={true}
                        />
                      </span>
                        <span className="primary-nav__active-bar" aria-hidden />
                      </span>
                      <span
                        className="primary-nav__label"
                        aria-hidden={!navExpanded}
                      >
                        {item.label}
                      </span>
                    </FocusableButton>
                  )}
                </KeyboardWrapper>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
