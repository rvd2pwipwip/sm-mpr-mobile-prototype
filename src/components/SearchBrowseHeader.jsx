import { useLayoutEffect, useRef } from "react";
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
 * Minimal Search & Browse top chrome: search field + optional Music / Podcasts / Radio tabs.
 * Tabs hide when `showBrowseTabs` is false (search mode — non-empty trimmed query per Search story).
 */
export default function SearchBrowseHeader({
  query,
  onQueryChange,
  browseTab,
  onBrowseTabChange,
  onMusicTabClick,
  showBrowseTabs,
}) {
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
            if (tab.id === "music") {
              return (
                <li key={tab.id} className="search-browse-header__tab-item">
                  <button
                    type="button"
                    role="tab"
                    aria-selected={active}
                    className={[
                      "search-browse-header__tab",
                      active ? "search-browse-header__tab--active" : "",
                    ].join(" ")}
                    onClick={onMusicTabClick}
                  >
                    {tab.label}
                  </button>
                </li>
              );
            }
            return (
              <li key={tab.id} className="search-browse-header__tab-item">
                <button
                  type="button"
                  role="tab"
                  aria-selected={active}
                  className={[
                    "search-browse-header__tab",
                    active ? "search-browse-header__tab--active" : "",
                  ].join(" ")}
                  onClick={() => onBrowseTabChange(tab.id)}
                >
                  {tab.label}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </header>
  );
}
