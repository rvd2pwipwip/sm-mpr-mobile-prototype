import { Navigate, useLocation, useNavigate } from "react-router-dom";
import RadioStationCard from "../components/RadioStationCard.jsx";
import ScreenHeader, { ScreenHeaderChevronBack } from "../components/ScreenHeader.jsx";
import { SEARCH_BROWSE } from "../constants/searchBrowsePaths.js";
import {
  getPopularStationsForGeoNode,
  resolveGeoNodeFromSegments,
} from "../data/radioInternationalBrowse.js";
import "./SwimlaneMore.css";

const BASE = "/search/more/radio-geo";

/**
 * Vertical 2-col grid of all “popular in region” stations for an international geo path.
 */
export default function SearchRadioGeoMore() {
  const navigate = useNavigate();
  const location = useLocation();
  const suffix = location.pathname.startsWith(`${BASE}/`)
    ? location.pathname.slice(BASE.length + 1)
    : "";
  const segments = suffix ? suffix.split("/").filter(Boolean) : [];

  if (segments.length === 0) {
    return <Navigate to={SEARCH_BROWSE.radio} replace />;
  }

  const resolved = resolveGeoNodeFromSegments(segments);
  if ("invalid" in resolved) {
    return <Navigate to={SEARCH_BROWSE.radio} replace />;
  }

  const { node } = resolved;
  const stations = getPopularStationsForGeoNode(node.id);
  const goBack = () => navigate(-1);

  return (
    <main className="app-shell app-shell--footer-fixed swimlane-more">
      <ScreenHeader
        title={node.label}
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
            No stations in this region.
          </p>
        ) : (
          <ul className="swimlane-more__grid" role="list">
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
