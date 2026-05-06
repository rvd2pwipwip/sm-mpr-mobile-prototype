import { Navigate, useNavigate, useParams } from "react-router-dom";
import ScreenHeader, { ScreenHeaderChevronBack } from "../components/ScreenHeader";
import { SearchBrowseTile, SearchBrowseTileGrid } from "../components/SearchBrowseTile.jsx";
import {
  getBroadVibeById,
  getChildTagsForBroadVibe,
} from "../data/musicBrowseTaxonomy.js";
import "./Search.css";

/** Broad lineup: **tags** under one **vibe** (or genre rows under Genre vibe). */
export default function SearchMusicVibe() {
  const { vibeId } = useParams();
  const navigate = useNavigate();

  const vibe = vibeId ? getBroadVibeById(vibeId) : null;
  const children = vibeId ? getChildTagsForBroadVibe(vibeId) : [];

  if (!vibeId || !vibe) {
    return <Navigate to="/search" replace />;
  }

  const goBack = () => navigate(-1);
  const headingId = "search-music-vibe-title";

  return (
    <main className="app-shell app-shell--footer-fixed swimlane-more">
      <ScreenHeader
        title={vibe.label}
        startSlot={
          <button
            type="button"
            className="screen-header__icon-btn"
            onClick={goBack}
            aria-label="Back"
          >
            <ScreenHeaderChevronBack />
          </button>
        }
      />

      <div className="swimlane-more__scroll">
        <div className="content-inset search-page__body">
          <p id={headingId} className="text-muted" style={{ margin: "0 0 var(--space-4)" }}>
            Choose a tag
          </p>
          <SearchBrowseTileGrid labelId={headingId}>
            {children.map((row) => {
              if (row.kind === "genre") {
                const to =
                  row.hasSubs
                    ? `/search/browse/music/vibe/${vibeId}/tag/${row.slug}`
                    : row.id
                      ? `/search/browse/music/category/${row.id}`
                      : `/search/browse/music/vibe/${vibeId}/tag/${row.slug}`;
                return (
                  <SearchBrowseTile key={row.slug} onClick={() => navigate(to)}>
                    {row.label}
                  </SearchBrowseTile>
                );
              }
              return (
                <SearchBrowseTile
                  key={row.slug}
                  onClick={() =>
                    navigate(`/search/browse/music/vibe/${vibeId}/tag/${row.slug}`)
                  }
                >
                  {row.label}
                </SearchBrowseTile>
              );
            })}
          </SearchBrowseTileGrid>
        </div>
      </div>
    </main>
  );
}
