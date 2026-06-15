import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CATALOG_SCOPE } from "@sm-mpr/shared/constants/catalogScope.js";
import { resolveBroadSearchBrowseTab } from "@sm-mpr/shared/constants/searchBrowsePaths.js";
import KeyboardWrapper from "../focus/KeyboardWrapper.jsx";
import FocusableButton from "../focus/FocusableButton.jsx";
import { useContentProfile } from "../../context/ContentProfileContext.jsx";
import { usePlayback } from "../../context/PlaybackContext.jsx";
import { useTerritory } from "../../context/TerritoryContext.jsx";
import { shouldShowTvMiniPlayer } from "../../utils/playbackMiniPlayer.js";
import { FOCUS_ZONE_NAV, useTvNavFocus } from "../../context/TvNavFocusContext.jsx";
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
    to: "/search/music",
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
      pathname.startsWith("/podcast/") ||
      pathname.startsWith("/more/")
    );
  }
  if (id === "search") {
    return pathname.startsWith("/search");
  }
  if (end) return pathname === to;
  return pathname === to || pathname.startsWith(`${to}/`);
}

export default function PrimaryNav() {
  const location = useLocation();
  const navigate = useNavigate();
  const navRefs = useRef([]);
  const { catalogScope } = useTerritory();
  const { enabledContentTypes } = useContentProfile();
  const { session, miniPlayerVisible } = usePlayback();
  const broadSearchTab = resolveBroadSearchBrowseTab(enabledContentTypes);
  const searchNavTo =
    catalogScope === CATALOG_SCOPE.limited
      ? "/search"
      : `/search/${broadSearchTab}`;
  const onSearchShell = location.pathname.startsWith("/search");

  const {
    focusZone,
    navExpanded,
    navFocusedIndex,
    enterContent,
    enterContentWithRestore,
    moveNavFocus,
  } = useTvNavFocus();

  const showMini = shouldShowTvMiniPlayer(miniPlayerVisible, session);

  const openFullPlayer = useCallback(() => {
    if (!session.fullPlayerPath) return;
    navigate(session.fullPlayerPath, {
      state: { expandFromMiniPlayer: true },
    });
  }, [navigate, session.fullPlayerPath]);

  const activateNavIndex = useCallback(
    (index) => {
      if (showMini && index === 0) {
        openFullPlayer();
        return;
      }
      const tabIndex = showMini ? index - 1 : index;
      const item = NAV_ITEMS[tabIndex];
      if (!item) return;
      if (item.id === "search") {
        if (onSearchShell) {
          enterContent();
          return;
        }
        navigate({ pathname: searchNavTo, search: "" });
        enterContent();
        return;
      }
      navigate(item.to);
      enterContent();
    },
    [
      showMini,
      openFullPlayer,
      navigate,
      enterContent,
      onSearchShell,
      catalogScope,
      searchNavTo,
    ],
  );

  const miniFocused =
    showMini && focusZone === FOCUS_ZONE_NAV && navFocusedIndex === 0;

  useLayoutEffect(() => {
    if (focusZone !== FOCUS_ZONE_NAV) return;
    navRefs.current[navFocusedIndex]?.focus({ preventScroll: true });
  }, [focusZone, navFocusedIndex, showMini]);

  /* Nav D-pad at window level — roster index is source of truth, not DOM focus target. */
  useEffect(() => {
    if (focusZone !== FOCUS_ZONE_NAV) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        event.stopPropagation();
        activateNavIndex(navFocusedIndex);
        return;
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        event.stopPropagation();
        moveNavFocus(-1);
        return;
      }
      if (event.key === "ArrowDown") {
        event.preventDefault();
        event.stopPropagation();
        moveNavFocus(1);
        return;
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        event.stopPropagation();
        enterContentWithRestore();
      }
    };

    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [
    focusZone,
    navFocusedIndex,
    activateNavIndex,
    moveNavFocus,
    enterContentWithRestore,
  ]);

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
              >
                {(focusProps) => (
                  <TvMiniPlayer
                    {...focusProps}
                    expanded={navExpanded}
                    focused={miniFocused}
                    variant={session.variant}
                    playing={!session.isPaused}
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
            const tabFocused =
              focusZone === FOCUS_ZONE_NAV && navFocusedIndex === navIndex;
            return (
              <li key={item.id} className="primary-nav__item">
                <KeyboardWrapper
                  ref={(node) => {
                    navRefs.current[navIndex] = node;
                  }}
                  onSelect={() => {
                    if (item.id === "search") {
                      if (onSearchShell) {
                        enterContent();
                        return;
                      }
                      navigate({ pathname: searchNavTo, search: "" });
                      enterContent();
                      return;
                    }
                    navigate(item.to);
                    enterContent();
                  }}
                >
                  {(focusProps) => (
                    <FocusableButton
                      {...focusProps}
                      focused={tabFocused}
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
