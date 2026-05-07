import { useLayoutEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  SEARCH_BROWSE,
  getSearchBrowseTabFromPathname,
} from "../constants/searchBrowsePaths.js";
import "./SearchBrowseHeader.css";

export const BROWSE_TABS = [
  { id: "music", label: "Music" },
  { id: "podcasts", label: "Podcasts" },
  { id: "radio", label: "Radio" },
];

/**
 * Publishes measured header height to `--search-header-offset` on `<html>` (see `index.css`).
 * Cleans up on unmount so leaving `/search` does not leak a stale offset.
 */
function useSearchBrowseHeaderOffset() {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const publish = () => {
      const h = el.offsetHeight;
      document.documentElement.style.setProperty(
        "--search-header-offset",
        `${h}px`,
      );
    };

    publish();
    const ro = new ResizeObserver(publish);
    ro.observe(el);
    return () => {
      ro.disconnect();
      document.documentElement.style.removeProperty("--search-header-offset");
    };
  }, []);

  return ref;
}

/**
 * Minimal Search & Browse top chrome: search field + optional Music / Podcasts / Radio tabs
 * (`NavLink` to `/search/music` | `/search/podcasts` | `/search/radio`). Re-tap **Music** while
 * already on `/search/music` runs `onMusicLineupToggle` (lineup easter egg). Tabs hide when
 * `showBrowseTabs` is false (search mode — non-empty trimmed query per Search story).
 */
export default function SearchBrowseHeader({
  query,
  onQueryChange,
  onMusicLineupToggle,
  showBrowseTabs,
}) {
  const location = useLocation();
  const browseTab = getSearchBrowseTabFromPathname(location.pathname);
  const headerRef = useSearchBrowseHeaderOffset();
  const hasQuery = query.length > 0;
  const showClear = hasQuery;

  return (
    <header ref={headerRef} className="search-browse-header">
      <div className="search-browse-header__field-row">
        <span className="search-browse-header__field-icon" aria-hidden={true}>
          <img src="/search.svg" alt="" width={22} height={22} />
        </span>
        <input
          id="search-browse-query"
          type="search"
          name="q"
          inputMode="search"
          enterKeyHint="search"
          autoComplete="off"
          className="search-browse-header__input"
          placeholder="Search…"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          aria-label="Search catalog"
        />
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
        <ul className="search-browse-header__tabs" role="tablist" aria-label="Browse content type">
          {BROWSE_TABS.map((tab) => {
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
                    onClick={(e) => {
                      if (location.pathname === SEARCH_BROWSE.music) {
                        e.preventDefault();
                        onMusicLineupToggle();
                      }
                    }}
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
      ) : null}
    </header>
  );
}
