import { useState } from "react";
import { musicLineupLabel } from "../constants/musicLineup.js";
import { useTerritory } from "../context/TerritoryContext.jsx";
import "./Search.css";

/** Browse tabs until Search & Browse header ships (Phase 1). */
const BROWSE_TABS = [
  { id: "music", label: "Music" },
  { id: "podcasts", label: "Podcasts" },
  { id: "radio", label: "Radio" },
];

/**
 * Search tab — scaffold for Search & Browse. Phase 0: `TerritoryProvider` + music lineup demo.
 * Prototype-only: with **Music** already selected, **click Music again** to toggle limited vs broad lineup.
 */
export default function Search() {
  const { musicLineupMode, toggleMusicLineupMode } = useTerritory();
  const [browseTab, setBrowseTab] = useState("music");

  function onMusicTabClick() {
    if (browseTab === "music") {
      toggleMusicLineupMode();
      return;
    }
    setBrowseTab("music");
  }

  return (
    <main className="app-shell app-shell--footer-fixed search-page">
      <div className="app-shell-footer-scroll">
        <div className="content-inset">
          <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 700 }}>Search</h1>

          <p className="text-muted" style={{ margin: "var(--space-2) 0 var(--space-4)" }}>
            Search field and full browse will land in later phases. Below: territory / lineup demo.
          </p>

          <div
            className="search-page__field-placeholder"
            role="presentation"
            aria-hidden={true}
          >
            Search…
          </div>

          <ul className="search-page__tabs" role="tablist" aria-label="Browse content type">
            {BROWSE_TABS.map((tab) => {
              const active = browseTab === tab.id;
              if (tab.id === "music") {
                return (
                  <li key={tab.id}>
                    <button
                      type="button"
                      role="tab"
                      aria-selected={active}
                      className={[
                        "search-page__tab",
                        active ? "search-page__tab--active" : "",
                      ].join(" ")}
                      onClick={onMusicTabClick}
                    >
                      {tab.label}
                    </button>
                  </li>
                );
              }
              return (
                <li key={tab.id}>
                  <button
                    type="button"
                    role="tab"
                    aria-selected={active}
                    className={[
                      "search-page__tab",
                      active ? "search-page__tab--active" : "",
                    ].join(" ")}
                    onClick={() => setBrowseTab(tab.id)}
                  >
                    {tab.label}
                  </button>
                </li>
              );
            })}
          </ul>

          <p className="search-page__demo-note">
            <strong>Prototype only (not for production):</strong> with <strong>Music</strong> selected,
            tap <strong>Music</strong> again to switch music lineup mode for demos.
          </p>
          <p className="search-page__lineup-badge" aria-live="polite">
            Music lineup: {musicLineupLabel(musicLineupMode)}
          </p>

          <p className="text-muted" style={{ margin: "var(--space-5) 0 0", fontSize: "0.875rem" }}>
            Active browse: <strong>{BROWSE_TABS.find((t) => t.id === browseTab)?.label}</strong>
          </p>
        </div>
      </div>
    </main>
  );
}
