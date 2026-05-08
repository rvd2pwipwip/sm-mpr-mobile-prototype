import { Navigate, useNavigate, useParams, useMatch } from "react-router-dom";
import RadioStationCard from "../components/RadioStationCard.jsx";
import ScreenHeader, { ScreenHeaderChevronBack } from "../components/ScreenHeader.jsx";
import { SEARCH_BROWSE } from "../constants/searchBrowsePaths.js";
import { RADIO_STATION_CATEGORIES } from "../data/radioStations.js";
import { getRadioStationsByCategory } from "../data/radioStations.js";
import "./SearchRadioStationGrid.css";
import "./SwimlaneMore.css";

function sortByPopularityMock(stations) {
  return [...stations].sort((a, b) =>
    a.id.localeCompare(b.id, undefined, { numeric: true }),
  );
}

/**
 * Near You (`/search/browse/radio/near-you`) or format (`/search/browse/radio/format/:formatId`).
 * Leaf categories: full 2-col vertical grid (same pattern as international city leaf).
 */
export default function SearchRadioStationGrid() {
  const navigate = useNavigate();
  const { formatId } = useParams();
  const nearYou = useMatch("/search/browse/radio/near-you");

  const categoryId = nearYou ? "near-you" : formatId;
  const category = categoryId
    ? RADIO_STATION_CATEGORIES.find((c) => c.id === categoryId)
    : null;

  if (!category) {
    return <Navigate to={SEARCH_BROWSE.radio} replace />;
  }

  const stations = sortByPopularityMock(getRadioStationsByCategory(categoryId));

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
        {stations.length === 0 ? (
          <p
            className="text-muted"
            style={{ padding: "0 var(--swimlane-more-inline, 40px)" }}
          >
            No stations in this category.
          </p>
        ) : (
          <ul
            className="swimlane-more__grid search-radio-station-grid__grid"
            role="list"
          >
            {stations.map((station) => (
              <li key={station.id} className="swimlane-more__cell">
                <RadioStationCard
                  station={station}
                  onSelect={() => navigate(`/radio/${station.id}`)}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
