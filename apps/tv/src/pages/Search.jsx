import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CATALOG_SCOPE } from "@sm-mpr/shared/constants/catalogScope.js";
import { CONTENT_TYPE } from "@sm-mpr/shared/constants/contentTypes.js";
import {
  getBrowseTabsForProfile,
  getSearchBrowseTabFromPathname,
  writeStoredBroadSearchBrowseTab,
} from "@sm-mpr/shared/constants/searchBrowsePaths.js";
import TvSearchBrowseHeader from "../components/search/TvSearchBrowseHeader.jsx";
import TvOnScreenKeyboardStub from "../components/search/TvOnScreenKeyboardStub.jsx";
import { useContentProfile } from "../context/ContentProfileContext.jsx";
import { useTerritory } from "../context/TerritoryContext.jsx";
import { useScreenContentFocus } from "../hooks/useScreenContentFocus.js";
import "./Search.css";

const SEARCH_DEBOUNCE_MS = 250;

function searchParamFromLocationSearch(search) {
  return new URLSearchParams(search).get("q") ?? "";
}

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

export default function Search() {
  const navigate = useNavigate();
  const location = useLocation();
  const { catalogScope } = useTerritory();
  const {
    enabledContentTypes,
    shouldShowBrowseContentSwitcher,
    isMusicOnlyProfile,
  } = useContentProfile();

  const browseTab = getSearchBrowseTabFromPathname(location.pathname);
  const browseTabs = useMemo(
    () => getBrowseTabsForProfile(enabledContentTypes),
    [enabledContentTypes],
  );

  const [query, setQuery] = useState(() =>
    searchParamFromLocationSearch(location.search),
  );
  const [debouncedQuery, setDebouncedQuery] = useState(() =>
    searchParamFromLocationSearch(location.search),
  );
  const [keyboardStubOpen, setKeyboardStubOpen] = useState(false);

  const stackKeySeenRef = useRef(null);

  const showBrowseTabs = query.trim().length === 0;
  const isSearchActive = query.trim().length > 0;
  const showHeaderBrowseTabs =
    catalogScope === CATALOG_SCOPE.broad &&
    showBrowseTabs &&
    shouldShowBrowseContentSwitcher;

  const isLimitedSearchRoot =
    catalogScope === CATALOG_SCOPE.limited && location.pathname === "/search";

  const headerItemCount = useMemo(() => {
    let count = 1;
    if (query.length > 0) count += 1;
    if (showHeaderBrowseTabs) count += browseTabs.length;
    return count;
  }, [query.length, showHeaderBrowseTabs, browseTabs.length]);

  const {
    registerItemRef,
    isItemFocused,
    handleMoveUp,
    handleMoveDown,
    handleMoveLeft,
    handleMoveRight,
  } = useScreenContentFocus("search", {
    groupCount: 1,
    itemCounts: { 0: headerItemCount },
    defaultGroupIndex: 0,
    defaultItemIndex: 0,
  });

  const searchPlaceholder = isMusicOnlyProfile
    ? "Search channels, artists or tags"
    : "Search channels, artists, podcasts or radio...";

  useEffect(() => {
    if (catalogScope !== CATALOG_SCOPE.limited) return;
    const { pathname } = location;
    if (
      pathname.startsWith("/search/music") ||
      pathname.startsWith("/search/podcasts") ||
      pathname.startsWith("/search/radio")
    ) {
      navigate({ pathname: "/search", search: location.search }, { replace: true });
    }
  }, [catalogScope, location.pathname, location.search, navigate]);

  useEffect(() => {
    if (!matchesSearchShellPath(location.pathname, catalogScope)) return;
    if (stackKeySeenRef.current === null) {
      stackKeySeenRef.current = location.key;
      return;
    }
    if (stackKeySeenRef.current === location.key) return;
    stackKeySeenRef.current = location.key;

    const restored = searchParamFromLocationSearch(location.search);
    setQuery(restored);
    setDebouncedQuery(restored.trim() === "" ? "" : restored);
  }, [location.key, location.pathname, location.search, catalogScope, stackKeySeenRef]);

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

  useEffect(() => {
    if (keyboardStubOpen) {
      document.documentElement.setAttribute("data-tv-keyboard-stub", "");
    } else {
      document.documentElement.removeAttribute("data-tv-keyboard-stub");
    }
    return () => {
      document.documentElement.removeAttribute("data-tv-keyboard-stub");
    };
  }, [keyboardStubOpen]);

  useEffect(() => {
    if (!keyboardStubOpen) return undefined;

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        setKeyboardStubOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [keyboardStubOpen]);

  function handleQueryChange(next) {
    setQuery(next);
    if (next.trim() === "") {
      setDebouncedQuery("");
      navigate({ pathname: location.pathname, search: "" }, { replace: true });
    }
  }

  function handleClear() {
    handleQueryChange("");
    setKeyboardStubOpen(false);
  }

  function renderBody() {
    if (isSearchActive) {
      return (
        <div className="tv-search-page__body">
          <h2 className="tv-search-page__mode-label">Search results</h2>
          <p className="tv-search-page__query-preview">
            Query: <strong>{debouncedQuery.trim()}</strong> — result swimlanes
            ship in Phase 5.
          </p>
        </div>
      );
    }

    if (isLimitedSearchRoot) {
      return (
        <div className="tv-search-page__body">
          <p className="tv-search-page__hint">
            {isMusicOnlyProfile
              ? "Type to search channels, artists, or tags."
              : "Type to search music, podcasts, or radio."}
          </p>
        </div>
      );
    }

    const tabLabel =
      browseTab === CONTENT_TYPE.podcasts
        ? "Podcasts"
        : browseTab === CONTENT_TYPE.radio
          ? "Radio"
          : "Music";

    return (
      <div className="tv-search-page__body">
        <h2 className="tv-search-page__mode-label">{tabLabel} browse</h2>
        <p className="tv-search-page__hint">
          Browse body for {tabLabel.toLowerCase()} ships in Phase 2–4. Focus the
          search field and type to preview search mode.
        </p>
      </div>
    );
  }

  return (
    <div className="tv-search-page">
      <TvSearchBrowseHeader
        query={query}
        onQueryChange={handleQueryChange}
        showBrowseTabs={showHeaderBrowseTabs}
        browseTabs={browseTabs}
        activeBrowseTab={browseTab}
        searchPlaceholder={searchPlaceholder}
        registerItemRef={registerItemRef}
        isItemFocused={isItemFocused}
        onFieldFocus={() => setKeyboardStubOpen(true)}
        onClear={handleClear}
        onDismissKeyboardStub={() => setKeyboardStubOpen(false)}
        onMoveUp={handleMoveUp}
        onMoveDown={handleMoveDown}
        onMoveLeft={handleMoveLeft}
        onMoveRight={handleMoveRight}
      />

      <div className="tv-search-page__scroll">{renderBody()}</div>

      <TvOnScreenKeyboardStub visible={keyboardStubOpen} />
    </div>
  );
}
