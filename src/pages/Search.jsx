import { useState } from "react";
import SearchBrowseHeader, {
  BROWSE_TABS,
} from "../components/SearchBrowseHeader.jsx";
import { musicLineupLabel } from "../constants/musicLineup.js";
import { useTerritory } from "../context/TerritoryContext.jsx";
import "./Search.css";

/**
 * Search & Browse tab. Phase 1: fixed measured header, browse vs search mode, tab scaffold.
 * Re-tap Music (already selected) toggles lineup — prototype easter egg (`TerritoryContext`).
 */
export default function Search() {
  const { musicLineupMode, toggleMusicLineupMode } = useTerritory();
  const [browseTab, setBrowseTab] = useState("music");
  const [query, setQuery] = useState("");

  const showBrowseTabs = query.trim().length === 0;
  const isSearchActive = query.trim().length > 0;

  function handleQueryChange(next) {
    setQuery(next);
    if (next.trim() === "") {
      setBrowseTab("music");
    }
  }

  function onMusicTabClick() {
    if (browseTab === "music") {
      toggleMusicLineupMode();
      return;
    }
    setBrowseTab("music");
  }

  const activeTabLabel =
    BROWSE_TABS.find((t) => t.id === browseTab)?.label ?? browseTab;

  return (
    <main className="app-shell app-shell--footer-fixed search-page">
      <SearchBrowseHeader
        query={query}
        onQueryChange={handleQueryChange}
        browseTab={browseTab}
        onBrowseTabChange={setBrowseTab}
        onMusicTabClick={onMusicTabClick}
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
        ) : (
          <div className="content-inset search-page__body">
            <p className="text-muted" style={{ margin: 0 }}>
              Browse body for <strong>{activeTabLabel}</strong> ships in later phases
              (music grid, podcasts, radio).
            </p>

            {browseTab === "music" ? (
              <>
                <p className="search-page__demo-note">
                  <strong>Prototype only (not for production):</strong> with{" "}
                  <strong>Music</strong> selected, tap <strong>Music</strong> in the header
                  again to switch music lineup mode for demos.
                </p>
                <p className="search-page__lineup-badge" aria-live="polite">
                  Music lineup: {musicLineupLabel(musicLineupMode)}
                </p>
              </>
            ) : null}
          </div>
        )}
      </div>
    </main>
  );
}
