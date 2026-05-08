import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SearchBrowseHeader from "../components/SearchBrowseHeader.jsx";
import {
  SearchBrowseTile,
  SearchBrowseTileGrid,
} from "../components/SearchBrowseTile.jsx";
import { MUSIC_LINEUP, musicLineupLabel } from "../constants/musicLineup.js";
import { getSearchBrowseTabFromPathname } from "../constants/searchBrowsePaths.js";
import { useTerritory } from "../context/TerritoryContext.jsx";
import { BROAD_VIBES } from "../data/musicBrowseTaxonomy.js";
import { MUSIC_GENRES } from "../data/musicChannels.js";
import SearchPodcastsBrowse from "./SearchPodcastsBrowse.jsx";
import SearchRadioBrowse from "./SearchRadioBrowse.jsx";
import SearchResultsPanel from "./SearchResultsPanel.jsx";
import "./Search.css";

const SEARCH_DEBOUNCE_MS = 250;

function searchParamFromLocationSearch(search) {
  return new URLSearchParams(search).get("q") ?? "";
}

/**
 * Search & Browse tab. Browse content-type strip uses `/search/music`, `/search/podcasts`,
 * `/search/radio` so back navigation preserves the tab. Re-tap Music on `/search/music`
 * toggles lineup (prototype easter egg).
 *
 * Active query is mirrored to `?q=` on the current tab URL (replace) so drill-down
 * (More, channel info, etc.) and Back restore populated results instead of resetting.
 */
export default function Search() {
  const navigate = useNavigate();
  const location = useLocation();
  const { musicLineupMode, toggleMusicLineupMode } = useTerritory();
  const browseTab = getSearchBrowseTabFromPathname(location.pathname);

  const [query, setQuery] = useState(() =>
    searchParamFromLocationSearch(location.search),
  );
  const [debouncedQuery, setDebouncedQuery] = useState(() =>
    searchParamFromLocationSearch(location.search),
  );

  const stackKeySeenRef = useRef(null);

  const showBrowseTabs = query.trim().length === 0;
  const isSearchActive = query.trim().length > 0;

  // After browser Back/Forward (new history entry under /search/*), reload field + results from `?q=`.
  useEffect(() => {
    if (
      !location.pathname.startsWith("/search/music") &&
      !location.pathname.startsWith("/search/podcasts") &&
      !location.pathname.startsWith("/search/radio")
    ) {
      return;
    }
    if (stackKeySeenRef.current === null) {
      stackKeySeenRef.current = location.key;
      return;
    }
    if (stackKeySeenRef.current === location.key) return;
    stackKeySeenRef.current = location.key;

    const u = searchParamFromLocationSearch(location.search);
    setQuery(u);
    setDebouncedQuery(u.trim() === "" ? "" : u);
  }, [location.key, location.pathname, location.search]);

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

  // Debounced query -> URL (replace) keeps history clean; stack grows on push to More / channels only.
  useEffect(() => {
    if (
      !location.pathname.startsWith("/search/music") &&
      !location.pathname.startsWith("/search/podcasts") &&
      !location.pathname.startsWith("/search/radio")
    ) {
      return;
    }

    const next = debouncedQuery.trim();
    const current = searchParamFromLocationSearch(location.search).trim();
    if (next === current) return;

    const search = next ? `?q=${encodeURIComponent(next)}` : "";
    navigate({ pathname: location.pathname, search }, { replace: true });
  }, [debouncedQuery, navigate, location.pathname, location.search]);

  function handleQueryChange(next) {
    setQuery(next);
    if (next.trim() === "") {
      setDebouncedQuery("");
      navigate({ pathname: location.pathname, search: "" }, { replace: true });
    }
  }

  const musicBrowseTitleId = "search-music-browse-heading";

  return (
    <main className="app-shell app-shell--footer-fixed search-page">
      <SearchBrowseHeader
        query={query}
        onQueryChange={handleQueryChange}
        onMusicLineupToggle={toggleMusicLineupMode}
        showBrowseTabs={showBrowseTabs}
      />

      <div className="search-page-scroll">
        {isSearchActive ? (
          <SearchResultsPanel debouncedQuery={debouncedQuery} />
        ) : browseTab === "music" ? (
          <div className="content-inset search-page__body">
            <>
              {/* <p className="search-page__demo-note" style={{ marginTop: 0 }}>
                <strong>Prototype only (not for production):</strong> with{" "}
                <strong>Music</strong> selected, tap <strong>Music</strong> in the header
                again to switch music lineup mode for demos.
              </p> */}
              {/* <p className="search-page__lineup-badge" aria-live="polite">
                Music lineup: {musicLineupLabel(musicLineupMode)}
              </p> */}
              {/* <h2
                id={musicBrowseTitleId}
                className="search-page__browse-heading"
              >
                {musicLineupMode === MUSIC_LINEUP.limited
                  ? "Browse by genre"
                  : "Browse by vibe"}
              </h2> */}
              <SearchBrowseTileGrid labelId={musicBrowseTitleId}>
                {musicLineupMode === MUSIC_LINEUP.limited
                  ? MUSIC_GENRES.map((g) => (
                      <SearchBrowseTile
                        key={g.id}
                        onClick={() =>
                          navigate(`/search/browse/music/category/${g.id}`)
                        }
                      >
                        {g.label}
                      </SearchBrowseTile>
                    ))
                  : BROAD_VIBES.map((v) => (
                      <SearchBrowseTile
                        key={v.id}
                        onClick={() =>
                          navigate(`/search/browse/music/vibe/${v.id}`)
                        }
                      >
                        {v.label}
                      </SearchBrowseTile>
                    ))}
              </SearchBrowseTileGrid>
            </>
          </div>
        ) : browseTab === "podcasts" ? (
          <div className="home-screen">
            <SearchPodcastsBrowse />
          </div>
        ) : (
          <div className="home-screen">
            <SearchRadioBrowse />
          </div>
        )}
      </div>
    </main>
  );
}
