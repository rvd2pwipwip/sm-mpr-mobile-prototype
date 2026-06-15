import "./TvSearchResultsEmpty.css";

/** No-hit search results — same copy/placement as mobile {@link SearchResultsPanel}. */
export default function TvSearchResultsEmpty({ query }) {
  const trimmed = query.trim();

  return (
    <div className="tv-search-results-empty">
      <p className="tv-search-results-empty__message">
        No results for &ldquo;{trimmed}&rdquo;.
      </p>
    </div>
  );
}
