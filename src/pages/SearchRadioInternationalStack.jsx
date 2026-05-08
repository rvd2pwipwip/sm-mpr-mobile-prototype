import { Navigate, useLocation, useNavigate } from "react-router-dom";
import ContentSwimlane from "../components/ContentSwimlane.jsx";
import GeoBrowsePill from "../components/GeoBrowsePill.jsx";
import RadioStationCard from "../components/RadioStationCard.jsx";
import ScreenHeader, { ScreenHeaderChevronBack } from "../components/ScreenHeader.jsx";
import { SEARCH_BROWSE } from "../constants/searchBrowsePaths.js";
import { radioGeoMorePath, radioInternationalPath } from "../constants/radioBrowsePaths.js";
import { SWIMLANE_CARD_MAX } from "../constants/swimlane.js";
import {
  getChildGeoNodes,
  getPopularStationsForGeoNode,
  resolveGeoNodeFromSegments,
} from "../data/radioInternationalBrowse.js";
import { INTERNATIONAL_CONTINENTS_PLANNED } from "../data/radioStations.js";
import { SearchBrowseTile, SearchBrowseTileGrid } from "../components/SearchBrowseTile.jsx";
import "./SearchRadioInternational.css";
import "./SwimlaneMore.css";

/** Continent chooser + international geo drill-down (swimlane + pills). */
export default function SearchRadioInternationalStack() {
  const navigate = useNavigate();
  const location = useLocation();
  const base = "/search/browse/radio/international";
  const suffix = location.pathname.startsWith(`${base}/`)
    ? location.pathname.slice(base.length + 1)
    : "";
  const segments = suffix ? suffix.split("/").filter(Boolean) : [];

  const goBack = () => navigate(-1);

  if (segments.length === 0) {
    return (
      <main className="app-shell app-shell--footer-fixed swimlane-more">
        <ScreenHeader
          title="International"
          startSlot={
            <button
              type="button"
              className="screen-header__icon-btn"
              onClick={() => navigate(SEARCH_BROWSE.radio)}
              aria-label="Back"
            >
              <ScreenHeaderChevronBack />
            </button>
          }
        />
        <div className="swimlane-more__scroll">
          <div className="content-inset search-page__body" style={{ paddingTop: 0 }}>
            <h2
              id="search-radio-intl-regions-heading"
              className="search-page__browse-heading search-radio-intl__subheading"
            >
              By region
            </h2>
            <SearchBrowseTileGrid labelId="search-radio-intl-regions-heading">
              {INTERNATIONAL_CONTINENTS_PLANNED.map((c) => (
                <SearchBrowseTile
                  key={c.id}
                  onClick={() => navigate(radioInternationalPath([c.id]))}
                >
                  {c.label}
                </SearchBrowseTile>
              ))}
            </SearchBrowseTileGrid>
          </div>
        </div>
      </main>
    );
  }

  const resolved = resolveGeoNodeFromSegments(segments);
  if ("invalid" in resolved) {
    return <Navigate to={SEARCH_BROWSE.radio} replace />;
  }

  const { node } = resolved;
  const popular = getPopularStationsForGeoNode(node.id);
  const children = getChildGeoNodes(node);
  const title = node.label;
  const isLeafGeo = children.length === 0;

  const pathPrefixForChild = (childId) =>
    radioInternationalPath([...segments, childId]);

  return (
    <main className="app-shell app-shell--footer-fixed swimlane-more search-radio-intl">
      <ScreenHeader
        title={title}
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

      <div className="swimlane-more__scroll search-radio-intl__scroll">
        {popular.length > 0 ? (
          isLeafGeo ? (
            <ul
              className="swimlane-more__grid search-radio-intl__leaf-grid"
              role="list"
            >
              {popular.map((station) => (
                <li key={station.id} className="swimlane-more__cell">
                  <RadioStationCard
                    station={station}
                    onSelect={() => navigate(`/radio/${station.id}`)}
                  />
                </li>
              ))}
            </ul>
          ) : (
            <ContentSwimlane
              title={`Popular in ${node.label}`}
              sourceCount={popular.length}
              maxVisible={SWIMLANE_CARD_MAX}
              onMore={() => navigate(radioGeoMorePath(segments))}
            >
              {popular.slice(0, SWIMLANE_CARD_MAX).map((station) => (
                <RadioStationCard
                  key={station.id}
                  station={station}
                  onSelect={() => navigate(`/radio/${station.id}`)}
                />
              ))}
            </ContentSwimlane>
          )
        ) : (
          <p
            className="text-muted search-radio-intl__empty"
            style={{ margin: 0, paddingInline: "var(--space-content-inline)" }}
          >
            No stations in this prototype region yet.
          </p>
        )}

        {children.length > 0 ? (
          <div className="geo-browse-pill-row">
            {children.map((c) => (
              <GeoBrowsePill
                key={c.id}
                onClick={() => navigate(pathPrefixForChild(c.id))}
              >
                {c.label}
              </GeoBrowsePill>
            ))}
          </div>
        ) : null}
      </div>
    </main>
  );
}
