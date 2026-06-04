import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import KeyboardWrapper from "../focus/KeyboardWrapper.jsx";
import FocusableButton from "../focus/FocusableButton.jsx";
import { usePlayback } from "../../context/PlaybackContext.jsx";
import {
  FOCUS_ZONE_NAV,
  NAV_TAB_COUNT,
  useTvNavFocus,
} from "../../context/TvNavFocusContext.jsx";
import TvMiniPlayer from "./TvMiniPlayer.jsx";
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
  const { session, miniPlayerVisible } = usePlayback();

  const {
    focusZone,
    navExpanded,
    navFocusedIndex,
    isNavMiniPlayerIndex,
    enterContent,
    enterContentWithRestore,
    moveNavFocus,
  } = useTvNavFocus();

  const showMini =
    miniPlayerVisible &&
    session.active &&
    session.variant === "music" &&
    session.fullPlayerPath;

  useEffect(() => {
    if (focusZone !== FOCUS_ZONE_NAV) return;
    navRefs.current[navFocusedIndex]?.focus();
  }, [focusZone, navFocusedIndex]);

  const openFullPlayer = () => {
    if (!session.fullPlayerPath) return;
    navigate(session.fullPlayerPath, {
      state: { expandFromMiniPlayer: true },
    });
  };

  const navClassName = [
    "primary-nav",
    navExpanded ? "primary-nav--expanded" : "primary-nav--collapsed",
    focusZone === FOCUS_ZONE_NAV ? "primary-nav--focused-zone" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <nav className={navClassName} aria-label="Primary">
      <div className="primary-nav__panel">
        <div
          className={[
            "primary-nav__mini-player-slot",
            showMini ? "" : "primary-nav__mini-player-slot--hidden",
          ]
            .filter(Boolean)
            .join(" ")}
          aria-hidden={!showMini}
        >
          {showMini ? (
            <div className="primary-nav__mini-player-item">
              <KeyboardWrapper
                ref={(node) => {
                  navRefs.current[0] = node;
                }}
                onSelect={openFullPlayer}
                onDown={() => moveNavFocus(1)}
                onRight={() => enterContentWithRestore()}
              >
                {(focusProps) => (
                  <TvMiniPlayer
                    {...focusProps}
                    expanded={navExpanded}
                    focused={isNavMiniPlayerIndex}
                    thumbnail={session.thumbnail}
                    title={session.title}
                    subtitle={session.subtitle}
                  />
                )}
              </KeyboardWrapper>
            </div>
          ) : null}
        </div>
        <div className="primary-nav__menu-spacer" aria-hidden="true" />
        <ul className="primary-nav__list">
          {NAV_ITEMS.map((item, tabIndex) => {
            const navIndex = showMini ? tabIndex + 1 : tabIndex;
            const active = isNavItemActive(location.pathname, item);
            const focused =
              focusZone === FOCUS_ZONE_NAV && navFocusedIndex === navIndex;
            return (
              <li key={item.id} className="primary-nav__item">
                <KeyboardWrapper
                  ref={(node) => {
                    navRefs.current[navIndex] = node;
                  }}
                  onSelect={() => {
                    navigate(item.to);
                    enterContent();
                  }}
                  onUp={() => {
                    if (navIndex > 0) moveNavFocus(-1);
                  }}
                  onDown={() => {
                    if (navIndex < (showMini ? NAV_TAB_COUNT : NAV_TAB_COUNT - 1)) {
                      moveNavFocus(1);
                    }
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
