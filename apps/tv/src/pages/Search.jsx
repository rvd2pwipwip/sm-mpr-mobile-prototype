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
import TvSearchBrowseTabs from "../components/search/TvSearchBrowseTabs.jsx";
import TvSearchMusicBrowseBody from "../components/search/TvSearchMusicBrowseBody.jsx";
import TvSearchPodcastsBrowseBody from "../components/search/TvSearchPodcastsBrowseBody.jsx";
import TvSearchRadioBrowseBody from "../components/search/TvSearchRadioBrowseBody.jsx";
import TvSearchResultsBody from "../components/search/TvSearchResultsBody.jsx";
import { useContentProfile } from "../context/ContentProfileContext.jsx";
import { useTerritory } from "../context/TerritoryContext.jsx";
import { HOME_LANDING_ITEM_INDEX } from "../constants/homeFocusGroups.js";
import { SEARCH_FOCUS } from "../constants/searchFocusGroups.js";
import { useScreenContentFocus } from "../hooks/useScreenContentFocus.js";
import { useTvScreenHeaderOffset } from "../hooks/useTvScreenHeaderOffset.js";
import { useTvVerticalGroupScroll } from "../hooks/useTvVerticalGroupScroll.js";
import { buildSearchMusicBrowseFocusLayout } from "../utils/searchMusicBrowseLayout.js";
import { buildSearchPodcastsBrowseFocusLayout } from "../utils/searchPodcastsBrowseLayout.js";
import {
  DEFAULT_RADIO_INTL_CONTINENT,
  buildSearchRadioBrowseFocusLayout,
} from "../utils/searchRadioBrowseLayout.js";
import { computeSearchResults } from "../utils/searchResultsData.js";
import { buildSearchResultsFocusLayout } from "../utils/searchResultsFocusLayout.js";
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
    isContentTypeEnabled,
    enabledSearchResultLanes,
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
  const [radioIntlContinent, setRadioIntlContinent] = useState(
    DEFAULT_RADIO_INTL_CONTINENT,
  );
  const stackKeySeenRef = useRef(null);
  const skipUrlSyncRef = useRef(false);
  const prevSearchActiveRef = useRef(false);
  const { shellRef, headerRef } = useTvScreenHeaderOffset();

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

  const isPodcastsBrowseVisible =
    !isSearchActive &&
    !isLimitedSearchRoot &&
    browseTab === CONTENT_TYPE.podcasts &&
    isContentTypeEnabled(CONTENT_TYPE.podcasts);

  const isRadioBrowseVisible =
    !isSearchActive &&
    !isLimitedSearchRoot &&
    browseTab === CONTENT_TYPE.radio &&
    isContentTypeEnabled(CONTENT_TYPE.radio);

  const isBrowseScrollVisible =
    isMusicBrowseVisible || isPodcastsBrowseVisible || isRadioBrowseVisible;

  const searchResults = useMemo(
    () => computeSearchResults(debouncedQuery, enabledSearchResultLanes),
    [debouncedQuery, enabledSearchResultLanes],
  );

  const resultsFocusLayout = useMemo(() => {
    if (!isSearchActive || !searchResults.anyHits) return null;
    return buildSearchResultsFocusLayout(searchResults);
  }, [isSearchActive, searchResults]);

  const isResultsScrollVisible = Boolean(resultsFocusLayout);

  const isBodyScrollVisible =
    isBrowseScrollVisible || isResultsScrollVisible;

  const bodyBrowseLayout = useMemo(() => {
    if (isMusicBrowseVisible) {
      return buildSearchMusicBrowseFocusLayout(musicLineupMode, vibeSelections);
    }
    if (isPodcastsBrowseVisible) {
      return buildSearchPodcastsBrowseFocusLayout();
    }
    if (isRadioBrowseVisible) {
      return buildSearchRadioBrowseFocusLayout(radioIntlContinent);
    }
    return null;
  }, [
    isMusicBrowseVisible,
    isPodcastsBrowseVisible,
    isRadioBrowseVisible,
    musicLineupMode,
    vibeSelections,
    radioIntlContinent,
  ]);

  const searchRowItemCount = query.length > 0 ? 2 : 1;

  const focusConfig = useMemo(() => {
    const headerGroupCount = showHeaderBrowseTabs ? 2 : 1;
    const itemCounts = {
      [SEARCH_FOCUS.searchRow]: searchRowItemCount,
    };
    if (showHeaderBrowseTabs) {
      itemCounts[SEARCH_FOCUS.browseTabs] = browseTabs.length;
    }

    const bodyLayout = isSearchActive ? resultsFocusLayout : bodyBrowseLayout;

    if (!bodyLayout) {
      return {
        groupCount: headerGroupCount,
        itemCounts,
        swimlaneGroups: [],
        firstBodyGroup: null,
        lastBodyGroup: null,
        landingGroup: null,
        lastCardGroup: null,
      };
    }

    return {
      groupCount: Math.max(headerGroupCount, bodyLayout.groupCount),
      itemCounts: { ...itemCounts, ...bodyLayout.itemCounts },
      swimlaneGroups: bodyLayout.swimlaneGroups,
      firstBodyGroup: bodyLayout.firstBodyGroup,
      lastBodyGroup: bodyLayout.lastBodyGroup,
      landingGroup: bodyLayout.landingGroup,
      lastCardGroup: bodyLayout.lastCardGroup ?? null,
    };
  }, [
    searchRowItemCount,
    showHeaderBrowseTabs,
    browseTabs.length,
    bodyBrowseLayout,
    isSearchActive,
    resultsFocusLayout,
  ]);

  /** Browse tabs are group 1 when visible; when hidden, skip the empty slot. */
  const resolveMoveDown = useCallback(
    (current) => {
      if (
        !showHeaderBrowseTabs &&
        isBodyScrollVisible &&
        focusConfig.firstBodyGroup != null &&
        current === SEARCH_FOCUS.searchRow
      ) {
        return focusConfig.firstBodyGroup;
      }
      return null;
    },
    [showHeaderBrowseTabs, isBodyScrollVisible, focusConfig.firstBodyGroup],
  );

  const resolveMoveUp = useCallback(
    (current) => {
      if (
        !showHeaderBrowseTabs &&
        isBodyScrollVisible &&
        focusConfig.firstBodyGroup != null &&
        current === focusConfig.firstBodyGroup
      ) {
        return SEARCH_FOCUS.searchRow;
      }
      return null;
    },
    [showHeaderBrowseTabs, isBodyScrollVisible, focusConfig.firstBodyGroup],
  );

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
    focusedIndex,
  } = useScreenContentFocus("search", {
    groupCount: focusConfig.groupCount,
    itemCounts: focusConfig.itemCounts,
    swimlaneGroups: focusConfig.swimlaneGroups,
    defaultGroupIndex:
      isBodyScrollVisible && focusConfig.landingGroup != null
        ? focusConfig.landingGroup
        : SEARCH_FOCUS.searchRow,
    defaultItemIndex: HOME_LANDING_ITEM_INDEX,
    resolveMoveDown,
    resolveMoveUp,
  });

  useLayoutEffect(() => {
    if (isSearchActive && !prevSearchActiveRef.current) {
      setFocusedGroupIndex(SEARCH_FOCUS.searchRow);
    }
    prevSearchActiveRef.current = isSearchActive;
  }, [isSearchActive, setFocusedGroupIndex]);

  useLayoutEffect(() => {
    if (showHeaderBrowseTabs) return;
    if (focusedGroupIndex <= SEARCH_FOCUS.searchRow) return;
    if (isBodyScrollVisible && focusedGroupIndex >= SEARCH_FOCUS.bodyStart) {
      return;
    }
    setFocusedGroupIndex(SEARCH_FOCUS.searchRow);
  }, [
    showHeaderBrowseTabs,
    focusedGroupIndex,
    setFocusedGroupIndex,
    isBodyScrollVisible,
  ]);

  const getFocusedElement = useCallback(
    () => getItemElement(focusedGroupIndex, focusedIndex),
    [getItemElement, focusedGroupIndex, focusedIndex],
  );

  const lastFocusableGroupIndex = useMemo(() => {
    if (focusConfig.lastBodyGroup != null) {
      return focusConfig.lastBodyGroup;
    }
    if (showHeaderBrowseTabs) {
      return SEARCH_FOCUS.browseTabs;
    }
    return SEARCH_FOCUS.searchRow;
  }, [focusConfig.lastBodyGroup, showHeaderBrowseTabs]);

  const {
    viewportRef,
    innerRef,
    registerGroupRef,
    offsetY,
    innerClassName,
  } = useTvVerticalGroupScroll(focusedGroupIndex, {
    landingGroupIndex:
      isBodyScrollVisible && focusConfig.landingGroup != null
        ? focusConfig.landingGroup
        : SEARCH_FOCUS.searchRow,
    firstFocusableGroupIndex: SEARCH_FOCUS.searchRow,
    lastFocusableGroupIndex,
    getFocusedElement,
    screenId: isBrowseScrollVisible
      ? `search-browse-${browseTab}`
      : isResultsScrollVisible
        ? "search-results"
        : undefined,
  });

  const handlePillChange = useCallback((vibeId, slug) => {
    setVibeSelections((prev) => ({ ...prev, [vibeId]: slug }));
  }, []);

  const handleRadioIntlContinentChange = useCallback((continentSlug) => {
    setRadioIntlContinent(continentSlug);
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

  // Hydrate from URL before URL-sync effect runs (avoids stale debouncedQuery writing ?q= back).
  useLayoutEffect(() => {
    if (!matchesSearchShellPath(location.pathname, catalogScope)) return;
    if (stackKeySeenRef.current === null) {
      stackKeySeenRef.current = location.key;
      return;
    }
    if (stackKeySeenRef.current === location.key) return;
    stackKeySeenRef.current = location.key;

    const restored = searchParamFromLocationSearch(location.search);
    skipUrlSyncRef.current = true;
    setQuery(restored);
    setDebouncedQuery(restored.trim() === "" ? "" : restored);
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
      if (!searchResults.anyHits) {
        return (
          <div className="tv-search-page__body">
            <p className="tv-search-page__hint">
              No results for &ldquo;{debouncedQuery.trim()}&rdquo;.
            </p>
          </div>
        );
      }

      if (resultsFocusLayout) {
        return (
          <TvSearchResultsBody
            results={searchResults}
            resultsLayout={resultsFocusLayout}
            debouncedQuery={debouncedQuery}
            registerGroupRef={registerGroupRef}
            registerItemRef={registerItemRef}
            isContentGroupActive={isContentGroupActive}
            getItemFocusIndex={getItemFocusIndex}
            setFocusedIndex={setFocusedIndex}
            onMoveUp={handleMoveUp}
            onMoveDown={handleMoveDown}
            enterNavFromContent={enterNavFromContent}
          />
        );
      }
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

    if (isMusicBrowseVisible && bodyBrowseLayout) {
      return (
        <TvSearchMusicBrowseBody
          musicLineupMode={musicLineupMode}
          browseLayout={bodyBrowseLayout}
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

    if (isPodcastsBrowseVisible && bodyBrowseLayout) {
      return (
        <TvSearchPodcastsBrowseBody
          browseLayout={bodyBrowseLayout}
          registerGroupRef={registerGroupRef}
          registerItemRef={registerItemRef}
          isContentGroupActive={isContentGroupActive}
          getItemFocusIndex={getItemFocusIndex}
          setFocusedIndex={setFocusedIndex}
          onMoveUp={handleMoveUp}
          onMoveDown={handleMoveDown}
          enterNavFromContent={enterNavFromContent}
        />
      );
    }

    if (isRadioBrowseVisible && bodyBrowseLayout) {
      return (
        <TvSearchRadioBrowseBody
          browseLayout={bodyBrowseLayout}
          registerGroupRef={registerGroupRef}
          registerItemRef={registerItemRef}
          isContentGroupActive={isContentGroupActive}
          getItemFocusIndex={getItemFocusIndex}
          setFocusedIndex={setFocusedIndex}
          onMoveUp={handleMoveUp}
          onMoveDown={handleMoveDown}
          enterNavFromContent={enterNavFromContent}
          onInternationalContinentChange={handleRadioIntlContinentChange}
        />
      );
    }

    return null;
  }

  const scrollBody = isBodyScrollVisible;

  return (
    <div
      ref={shellRef}
      className="tv-search-page tv-screen-overlay tv-screen-overlay--search-browse"
    >
      <TvSearchBrowseHeader
        headerRef={headerRef}
        query={query}
        onQueryChange={handleQueryChange}
        showBrowseTabs={showHeaderBrowseTabs && !isBrowseScrollVisible}
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
        <div
          ref={viewportRef}
          className="tv-search-page__scroll tv-home__scroll tv-screen-overlay__scroll"
        >
          <div
            ref={innerRef}
            className={`${innerClassName} tv-search-page__scroll-inner`}
            style={{ transform: `translateY(-${offsetY}px)` }}
          >
            {showHeaderBrowseTabs && isBrowseScrollVisible ? (
              <TvSearchBrowseTabs
                browseTabs={browseTabs}
                activeBrowseTab={browseTab}
                browseTabsGroup={SEARCH_FOCUS.browseTabs}
                registerGroupRef={registerGroupRef}
                registerItemRef={registerItemRef}
                isItemFocused={isItemFocused}
                onMoveUp={handleMoveUp}
                onMoveDown={handleMoveDown}
                onMoveLeft={handleMoveLeft}
                onMoveRight={handleMoveRight}
              />
            ) : null}
            {renderBody()}
          </div>
        </div>
      ) : (
        <div className="tv-search-page__scroll tv-home__scroll tv-screen-overlay__scroll tv-screen-overlay__body">
          {renderBody()}
        </div>
      )}
    </div>
  );
}
