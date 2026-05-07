import { Navigate, useNavigate, useParams } from "react-router-dom";
import PodcastCard from "../components/PodcastCard";
import ScreenHeader, { ScreenHeaderChevronBack } from "../components/ScreenHeader";
import {
  getPodcastCategoryById,
  getPodcastsByCategory,
} from "../data/podcasts";
import "./SwimlaneMore.css";

/** Search → Browse → Podcasts → one iAB-style category: 2-col show grid (`23:17518` pattern). */
export default function SearchPodcastsCategory() {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  const category = categoryId ? getPodcastCategoryById(categoryId) : null;
  const podcasts = categoryId ? getPodcastsByCategory(categoryId) : [];

  if (!categoryId || !category) {
    return <Navigate to="/search" replace />;
  }

  const goBack = () => navigate(-1);

  return (
    <main className="app-shell app-shell--footer-fixed swimlane-more">
      <ScreenHeader
        title={category.label}
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
        {podcasts.length === 0 ? (
          <p
            className="text-muted"
            style={{
              padding: "0 var(--swimlane-more-inline, 40px)",
            }}
          >
            No shows in this category.
          </p>
        ) : (
          <ul className="swimlane-more__grid" role="list">
            {podcasts.map((podcast) => (
              <li key={podcast.id} className="swimlane-more__cell">
                <PodcastCard
                  podcast={podcast}
                  onSelect={() => navigate(`/podcast/${podcast.id}`)}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
