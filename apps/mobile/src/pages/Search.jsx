import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ScreenHeader, {
  ScreenHeaderChevronBack,
} from "../components/ScreenHeader";
import SearchBrowseHeader, {
  SEARCH_SCREEN_HEADER_STACK_PX,
} from "../components/SearchBrowseHeader.jsx";
import { CATALOG_SCOPE } from "../constants/catalogScope.js";
import { MUSIC_LINEUP } from "../constants/musicLineup.js";
import {
  getSearchBrowseTabFromPathname,
  writeStoredBroadSearchBrowseTab,
} from "../constants/searchBrowsePaths.js";
import { CONTENT_TYPE } from "@sm-mpr/shared/constants/contentTypes.js";
import { useContentProfile } from "../context/ContentProfileContext.jsx";
import { useTerritory } from "../context/TerritoryContext.jsx";
import { BROAD_VIBES } from "../data/musicBrowseTaxonomy.js";
import SearchMusicVibeBrowseRail from "../components/SearchMusicVibeBrowseRail.jsx";
import SearchPodcastsBrowse from "./SearchPodcastsBrowse.jsx";
import SearchRadioBrowse from "./SearchRadioBrowse.jsx";
import SearchResultsPanel from "./SearchResultsPanel.jsx";
import "./Search.css";

const SEARCH_DEBOUNCE_MS = 250;

function searchParamFromLocationSearch(search) {
  return new URLSearchParams(search).get("q") ?? "";
}

/** URL sync + query restore for broad tab paths or limited `/search` only. */
function matchesSearchShellPath(pathname, catalogScope) {
  if (catalogScope === CATALOG_SCOPE.limited) {
    return pathname === "/search";
  }
  return (
    pathname.startsWith("/search/music") ||
    pathname.startsWith("/search/podcasts") ||
    pathname.startsWith("/search/radio")
  );
}

/**
 * Search & Browse. **Broad:** browse tabs on `/search/music` | …; **limited:** canonical **`/search`**
 * only (no browse chrome). `docs/mobile/Plans/catalog-scope-search-browse-refactor.md`.
 *
 * Active query is mirrored to `?q=` on the current path (replace) so drill-down and Back restore
 * results.
 */
export default function Search() {
  const navigate = useNavigate();
  const location = useLocation();
  const { musicLineupMode, catalogScope } = useTerritory();
  const {
    shouldShowBrowseContentSwitcher,
    isContentTypeEnabled,
    isMusicOnlyProfile,
  } = useContentProfile();
  const browseTab = getSearchBrowseTabFromPathname(location.pathname);

  const [query, setQuery] = useState(() =>
    searchParamFromLocationSearch(location.search),
  );
  const [debouncedQuery, setDebouncedQuery] = useState(() =>
    searchParamFromLocationSearch(location.search),
  );

  const stackKeySeenRef = useRef(null);
  const skipUrlSyncRef = useRef(false);

  const showBrowseTabs = query.trim().length === 0;
  const isSearchActive = query.trim().length > 0;
  /** Limited catalog never shows Music/Podcasts/Radio strip on Search. */
  const showHeaderBrowseTabs =
    catalogScope === CATALOG_SCOPE.broad &&
    showBrowseTabs &&
    shouldShowBrowseContentSwitcher;

  const isLimitedSearchRoot =
    catalogScope === CATALOG_SCOPE.limited && location.pathname === "/search";

  // After Back/Forward or main-nav navigation, hydrate from URL before URL-sync runs.
  useLayoutEffect(() => {
    if (!matchesSearchShellPath(location.pathname, catalogScope)) return;
    if (stackKeySeenRef.current === null) {
      stackKeySeenRef.current = location.key;
      return;
    }
    if (stackKeySeenRef.current === location.key) return;
    stackKeySeenRef.current = location.key;

    const u = searchParamFromLocationSearch(location.search);
    skipUrlSyncRef.current = true;
    setQuery(u);
    setDebouncedQuery(u.trim() === "" ? "" : u);
  }, [location.key, location.pathname, location.search, catalogScope]);

  useEffect(() => {
    if (query.trim() === "") {
      setDebouncedQuery("");
      return;
    }
    const id = window.setTimeout(() => {
      setDebouncedQuery(query);
    }, SEARCH_DEBOUNCE_MS);
    return () => window.clearTimeout(id);
  }, [query]);

  useEffect(() => {
    if (!matchesSearchShellPath(location.pathname, catalogScope)) return;
    if (skipUrlSyncRef.current) {
      skipUrlSyncRef.current = false;
      return;
    }

    const next = debouncedQuery.trim();
    const current = searchParamFromLocationSearch(location.search).trim();
    if (next === current) return;

    const search = next ? `?q=${encodeURIComponent(next)}` : "";
    navigate({ pathname: location.pathname, search }, { replace: true });
  }, [
    debouncedQuery,
    navigate,
    location.pathname,
    location.search,
    catalogScope,
  ]);

  /** Persist browse strip for **broad** Search shell only; layout phase so BottomNav + switcher agree on first paint after return. */
  useLayoutEffect(() => {
    if (catalogScope !== CATALOG_SCOPE.broad) return;
    const { pathname } = location;
    if (
      pathname === "/search/music" ||
      pathname === "/search/podcasts" ||
      pathname === "/search/radio"
    ) {
      writeStoredBroadSearchBrowseTab(getSearchBrowseTabFromPathname(pathname));
    }
  }, [catalogScope, location.pathname]);

  function handleQueryChange(next) {
    setQuery(next);
    if (next.trim() === "") {
      setDebouncedQuery("");
      navigate({ pathname: location.pathname, search: "" }, { replace: true });
    }
  }

  return (
    <main className="app-shell app-shell--footer-fixed search-page">
      {isLimitedSearchRoot ? (
        <ScreenHeader
          title="Search"
          startSlot={
            <button
              type="button"
              className="screen-header__icon-btn"
              onClick={() => navigate(-1)}
              aria-label="Back"
            >
              <ScreenHeaderChevronBack />
            </button>
          }
        />
      ) : null}

      <SearchBrowseHeader
        query={query}
        onQueryChange={handleQueryChange}
        showBrowseTabs={showHeaderBrowseTabs}
        underScreenHeader={isLimitedSearchRoot}
        stackOffsetPrependPx={
          isLimitedSearchRoot ? SEARCH_SCREEN_HEADER_STACK_PX : 0
        }
      />

      <div className="search-page-scroll">
        {isSearchActive ? (
          <SearchResultsPanel debouncedQuery={debouncedQuery} />
        ) : isLimitedSearchRoot ? (
          <div className="content-inset search-page__body">
            <p className="text-muted search-page__limited-empty">
              {isMusicOnlyProfile
                ? "Type to search channels, artists, or tags."
                : "Type to search music, podcasts, or radio."}
            </p>
          </div>
        ) : browseTab === "music" ? (
          <div className="home-screen">
            {musicLineupMode === MUSIC_LINEUP.broad
              ? BROAD_VIBES.map((v) => (
                  <SearchMusicVibeBrowseRail
                    key={v.id}
                    vibeId={v.id}
                    title={v.label}
                    memoryKey={`search-music-${v.id}`}
                    preferredSlug={v.id === "genre" ? "pop" : undefined}
                  />
                ))
              : null}
          </div>
        ) : browseTab === "podcasts" &&
          isContentTypeEnabled(CONTENT_TYPE.podcasts) ? (
          <div className="home-screen">
            <SearchPodcastsBrowse />
          </div>
        ) : browseTab === "radio" &&
          isContentTypeEnabled(CONTENT_TYPE.radio) ? (
          <div className="home-screen">
            <SearchRadioBrowse />
          </div>
        ) : null}
      </div>
    </main>
  );
}
