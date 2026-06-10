import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CATALOG_SCOPE } from "@sm-mpr/shared/constants/catalogScope.js";
import { CONTENT_TYPE } from "@sm-mpr/shared/constants/contentTypes.js";
import {
  getBrowseTabsForProfile,
  getSearchBrowseTabFromPathname,
  writeStoredBroadSearchBrowseTab,
} from "@sm-mpr/shared/constants/searchBrowsePaths.js";
import TvSearchBrowseHeader from "../components/search/TvSearchBrowseHeader.jsx";
import TvSearchMusicBrowseBody from "../components/search/TvSearchMusicBrowseBody.jsx";
import { useContentProfile } from "../context/ContentProfileContext.jsx";
import { useTerritory } from "../context/TerritoryContext.jsx";
import { SEARCH_FOCUS } from "../constants/searchFocusGroups.js";
import { useScreenContentFocus } from "../hooks/useScreenContentFocus.js";
import { useTvVerticalGroupScroll } from "../hooks/useTvVerticalGroupScroll.js";
import { buildSearchMusicBrowseFocusLayout } from "../utils/searchMusicBrowseLayout.js";
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
  const { catalogScope, musicLineupMode } = useTerritory();
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
  const [vibeSelections, setVibeSelections] = useState({});
  const stackKeySeenRef = useRef(null);

  const showBrowseTabs = query.trim().length === 0;
  const isSearchActive = query.trim().length > 0;
  const showHeaderBrowseTabs =
    catalogScope === CATALOG_SCOPE.broad &&
    showBrowseTabs &&
    shouldShowBrowseContentSwitcher;

  const isLimitedSearchRoot =
    catalogScope === CATALOG_SCOPE.limited && location.pathname === "/search";

  const isMusicBrowseVisible =
    !isSearchActive &&
    !isLimitedSearchRoot &&
    browseTab === CONTENT_TYPE.music;

  const browseLayout = useMemo(
    () =>
      isMusicBrowseVisible
        ? buildSearchMusicBrowseFocusLayout(musicLineupMode, vibeSelections)
        : null,
    [isMusicBrowseVisible, musicLineupMode, vibeSelections],
  );

  const searchRowItemCount = query.length > 0 ? 2 : 1;

  const focusConfig = useMemo(() => {
    const headerGroupCount = showHeaderBrowseTabs ? 2 : 1;
    const itemCounts = {
      [SEARCH_FOCUS.searchRow]: searchRowItemCount,
    };
    if (showHeaderBrowseTabs) {
      itemCounts[SEARCH_FOCUS.browseTabs] = browseTabs.length;
    }

    if (!browseLayout) {
      return {
        groupCount: headerGroupCount,
        itemCounts,
        swimlaneGroups: [],
        firstBodyGroup: null,
        lastBodyGroup: null,
      };
    }

    return {
      groupCount: Math.max(headerGroupCount, browseLayout.groupCount),
      itemCounts: { ...itemCounts, ...browseLayout.itemCounts },
      swimlaneGroups: browseLayout.swimlaneGroups,
      firstBodyGroup: browseLayout.firstBodyGroup,
      lastBodyGroup: browseLayout.lastBodyGroup,
    };
  }, [
    searchRowItemCount,
    showHeaderBrowseTabs,
    browseTabs.length,
    browseLayout,
  ]);

  const {
    registerItemRef,
    isItemFocused,
    focusedGroupIndex,
    setFocusedGroupIndex,
    handleMoveUp,
    handleMoveDown,
    handleMoveLeft,
    handleMoveRight,
    isContentGroupActive,
    getItemFocusIndex,
    setFocusedIndex,
    enterNavFromContent,
    getItemElement,
  } = useScreenContentFocus("search", {
    groupCount: focusConfig.groupCount,
    itemCounts: focusConfig.itemCounts,
    swimlaneGroups: focusConfig.swimlaneGroups,
    defaultGroupIndex: SEARCH_FOCUS.searchRow,
    defaultItemIndex: 0,
  });

  useLayoutEffect(() => {
    if (!showHeaderBrowseTabs && focusedGroupIndex > SEARCH_FOCUS.searchRow) {
      if (
        !isMusicBrowseVisible ||
        focusedGroupIndex < SEARCH_FOCUS.bodyStart
      ) {
        setFocusedGroupIndex(SEARCH_FOCUS.searchRow);
      }
    }
  }, [
    showHeaderBrowseTabs,
    focusedGroupIndex,
    setFocusedGroupIndex,
    isMusicBrowseVisible,
  ]);

  const getFocusedElement = useCallback(
    () => getItemElement(focusedGroupIndex, getItemFocusIndex(focusedGroupIndex)),
    [getItemElement, focusedGroupIndex, getItemFocusIndex],
  );

  const {
    viewportRef,
    innerRef,
    registerGroupRef,
    offsetY,
    innerClassName,
  } = useTvVerticalGroupScroll(focusedGroupIndex, {
    landingGroupIndex: focusConfig.firstBodyGroup ?? SEARCH_FOCUS.searchRow,
    firstFocusableGroupIndex: focusConfig.firstBodyGroup ?? SEARCH_FOCUS.searchRow,
    lastFocusableGroupIndex:
      focusConfig.lastBodyGroup ?? SEARCH_FOCUS.browseTabs,
    getFocusedElement,
    screenId: "search",
  });

  const handlePillChange = useCallback((vibeId, slug) => {
    setVibeSelections((prev) => ({ ...prev, [vibeId]: slug }));
  }, []);

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

  function handleQueryChange(next) {
    setQuery(next);
    if (next.trim() === "") {
      setDebouncedQuery("");
      navigate({ pathname: location.pathname, search: "" }, { replace: true });
    }
  }

  function handleClear() {
    handleQueryChange("");
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

    if (isMusicBrowseVisible && browseLayout) {
      return (
        <TvSearchMusicBrowseBody
          musicLineupMode={musicLineupMode}
          browseLayout={browseLayout}
          registerGroupRef={registerGroupRef}
          registerItemRef={registerItemRef}
          isContentGroupActive={isContentGroupActive}
          getItemFocusIndex={getItemFocusIndex}
          setFocusedIndex={setFocusedIndex}
          onMoveUp={handleMoveUp}
          onMoveDown={handleMoveDown}
          enterNavFromContent={enterNavFromContent}
          onPillChange={handlePillChange}
        />
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
          Browse body for {tabLabel.toLowerCase()} ships in Phase 3–4. Focus the
          search field and type to preview search mode.
        </p>
      </div>
    );
  }

  const scrollBody = isMusicBrowseVisible;

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
        onClear={handleClear}
        onMoveUp={handleMoveUp}
        onMoveDown={handleMoveDown}
        onMoveLeft={handleMoveLeft}
        onMoveRight={handleMoveRight}
        searchRowGroup={SEARCH_FOCUS.searchRow}
        browseTabsGroup={SEARCH_FOCUS.browseTabs}
      />

      {scrollBody ? (
        <div ref={viewportRef} className="tv-search-page__scroll">
          <div
            ref={innerRef}
            className={["tv-search-page__scroll-inner", innerClassName]
              .filter(Boolean)
              .join(" ")}
            style={{ transform: `translateY(-${offsetY}px)` }}
          >
            {renderBody()}
          </div>
        </div>
      ) : (
        <div className="tv-search-page__scroll">{renderBody()}</div>
      )}
    </div>
  );
}
