import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import SearchBrowseHeader, {
  BROWSE_TABS,
} from "../components/SearchBrowseHeader.jsx";
import { SearchBrowseTile, SearchBrowseTileGrid } from "../components/SearchBrowseTile.jsx";
import { MUSIC_LINEUP, musicLineupLabel } from "../constants/musicLineup.js";
import {
  SEARCH_BROWSE,
  getSearchBrowseTabFromPathname,
} from "../constants/searchBrowsePaths.js";
import { useTerritory } from "../context/TerritoryContext.jsx";
import { BROAD_VIBES } from "../data/musicBrowseTaxonomy.js";
import { MUSIC_GENRES } from "../data/musicChannels.js";
import SearchPodcastsBrowse from "./SearchPodcastsBrowse.jsx";
import "./Search.css";

/**
 * Search & Browse tab. Browse content-type strip uses `/search/music`, `/search/podcasts`,
 * `/search/radio` so back navigation preserves the tab. Re-tap Music on `/search/music`
 * toggles lineup (prototype easter egg).
 */
export default function Search() {
  const navigate = useNavigate();
  const location = useLocation();
  const { musicLineupMode, toggleMusicLineupMode } = useTerritory();
  const browseTab = getSearchBrowseTabFromPathname(location.pathname);
  const [query, setQuery] = useState("");

  const showBrowseTabs = query.trim().length === 0;
  const isSearchActive = query.trim().length > 0;

  function handleQueryChange(next) {
    setQuery(next);
    if (next.trim() === "") {
      navigate(SEARCH_BROWSE.music, { replace: true });
    }
  }

  const activeTabLabel =
    BROWSE_TABS.find((t) => t.id === browseTab)?.label ?? browseTab;

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
          <div className="content-inset search-page__body">
            <p className="text-muted" style={{ margin: 0 }}>
              Search results (swimlanes) ship in Phase 5. Typed query is kept in the header
              field.
            </p>
          </div>
        ) : browseTab === "music" ? (
          <div className="content-inset search-page__body">
            <>
              <p className="search-page__demo-note" style={{ marginTop: 0 }}>
                <strong>Prototype only (not for production):</strong> with{" "}
                <strong>Music</strong> selected, tap <strong>Music</strong> in the header
                again to switch music lineup mode for demos.
              </p>
              <p className="search-page__lineup-badge" aria-live="polite">
                Music lineup: {musicLineupLabel(musicLineupMode)}
              </p>
              <h2 id={musicBrowseTitleId} className="search-page__browse-heading">
                {musicLineupMode === MUSIC_LINEUP.limited
                  ? "Browse by genre"
                  : "Browse by vibe"}
              </h2>
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
          <div className="content-inset search-page__body">
            <p className="text-muted" style={{ margin: 0 }}>
              Browse body for <strong>{activeTabLabel}</strong> ships in a later phase
              (radio).
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
