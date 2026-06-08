import { useLayoutEffect, useMemo, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import SearchBrowseContentSwitcher from "./SearchBrowseContentSwitcher.jsx";
import {
  BROWSE_TABS,
  SEARCH_BROWSE,
  getBrowseTabsForProfile,
  getSearchBrowseTabFromPathname,
} from "../constants/searchBrowsePaths.js";
import { useContentProfile } from "../context/ContentProfileContext.jsx";
import "./SearchBrowseHeader.css";

/** Pixel height of `ScreenHeader` bar — matches `--screen-header-height` in `index.css` (stack offset math). */
export const SEARCH_SCREEN_HEADER_STACK_PX = 80;

/** Set true to restore the three separate pill `NavLink` tabs (pre-ContentSwitcher). */
export const USE_LEGACY_BROWSE_TAB_PILLS = false;

export { BROWSE_TABS };

function SearchBrowseLegacyTabPills({ browseTabs }) {
  const location = useLocation();
  const browseTab = getSearchBrowseTabFromPathname(location.pathname);

  return (
    <ul
      className="search-browse-header__tabs"
      role="tablist"
      aria-label="Browse content type"
    >
      {browseTabs.map((tab) => {
        const active = browseTab === tab.id;
        const to = SEARCH_BROWSE[tab.id];
        if (tab.id === "music") {
          return (
            <li key={tab.id} className="search-browse-header__tab-item">
              <NavLink
                to={to}
                end
                role="tab"
                aria-selected={active}
                className={({ isActive }) =>
                  [
                    "search-browse-header__tab",
                    isActive ? "search-browse-header__tab--active" : "",
                  ].join(" ")
                }
              >
                {tab.label}
              </NavLink>
            </li>
          );
        }
        return (
          <li key={tab.id} className="search-browse-header__tab-item">
            <NavLink
              to={to}
              end
              role="tab"
              aria-selected={active}
              className={({ isActive }) =>
                [
                  "search-browse-header__tab",
                  isActive ? "search-browse-header__tab--active" : "",
                ].join(" ")
              }
            >
              {tab.label}
            </NavLink>
          </li>
        );
      })}
    </ul>
  );
}

/**
 * Publishes measured header height (+ optional fixed stack above, e.g. `ScreenHeader`) to
 * `--search-header-offset` on `<html>` (see `index.css`). Cleans up on unmount.
 * @param {number} stackOffsetPrependPx — e.g. {@link SEARCH_SCREEN_HEADER_STACK_PX} when search chrome sits under `ScreenHeader`.
 */
function useSearchBrowseHeaderOffset(stackOffsetPrependPx = 0) {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const publish = () => {
      const h = el.offsetHeight;
      const total = stackOffsetPrependPx + h;
      document.documentElement.style.setProperty(
        "--search-header-offset",
        `${total}px`,
      );
    };

    publish();
    const ro = new ResizeObserver(publish);
    ro.observe(el);
    return () => {
      ro.disconnect();
      document.documentElement.style.removeProperty("--search-header-offset");
    };
  }, [stackOffsetPrependPx]);

  return ref;
}

/**
 * Minimal Search & Browse top chrome: search field + optional Music / Podcasts / Radio tabs
 * (`NavLink` to `/search/music` | `/search/podcasts` | `/search/radio`). Tabs hide when
 * `showBrowseTabs` is false (search mode — non-empty trimmed query per Search story).
 *
 * **`underScreenHeader`:** limited Search — fixed below {@link ScreenHeader}; use with **`stackOffsetPrependPx`**.
 */
export default function SearchBrowseHeader({
  query,
  onQueryChange,
  showBrowseTabs,
  underScreenHeader = false,
  stackOffsetPrependPx = 0,
}) {
  const { enabledContentTypes, isMusicOnlyProfile } = useContentProfile();
  const browseTabs = useMemo(
    () => getBrowseTabsForProfile(enabledContentTypes),
    [enabledContentTypes],
  );
  const browseSwitcherSegments = useMemo(
    () =>
      browseTabs.map((t) => ({
        id: t.id,
        label: t.label,
        to: SEARCH_BROWSE[t.id],
      })),
    [browseTabs],
  );
  const headerRef = useSearchBrowseHeaderOffset(stackOffsetPrependPx);
  const hasQuery = query.length > 0;
  const showClear = hasQuery;
  const searchPlaceholder = isMusicOnlyProfile
    ? "Search channels, artists or tags"
    : "Search music, podcasts or radio";

  return (
    <header
      ref={headerRef}
      className={[
        "search-browse-header",
        underScreenHeader ? "search-browse-header--under-screen-header" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="search-browse-header__field-row">
        <input
          id="search-browse-query"
          type="search"
          name="q"
          inputMode="search"
          enterKeyHint="search"
          autoComplete="off"
          className="search-browse-header__input"
          placeholder={searchPlaceholder}
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          aria-label="Search catalog"
        />
        {!showClear && (
          <span className="search-browse-header__field-icon" aria-hidden={true}>
            <img src="/search.svg" alt="" width={30} height={30} />
          </span>
        )}
        {showClear ? (
          <button
            type="button"
            className="search-browse-header__clear"
            onClick={() => onQueryChange("")}
            aria-label="Clear search"
          >
            ×
          </button>
        ) : null}
      </div>

      {showBrowseTabs ? (
        USE_LEGACY_BROWSE_TAB_PILLS ? (
          <SearchBrowseLegacyTabPills browseTabs={browseTabs} />
        ) : (
          <SearchBrowseContentSwitcher segments={browseSwitcherSegments} />
        )
      ) : null}
    </header>
  );
}
