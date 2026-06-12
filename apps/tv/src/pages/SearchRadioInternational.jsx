import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { SEARCH_BROWSE } from "@sm-mpr/shared/constants/searchBrowsePaths.js";
import {
  getChildGeoNodes,
  getPopularStationsForGeoNode,
  resolveGeoNodeFromSegments,
} from "@sm-mpr/shared/data/radioInternationalBrowse.js";
import { INTERNATIONAL_CONTINENTS_PLANNED } from "@sm-mpr/shared/data/radioStations.js";
import ContentTileCard from "../components/cards/ContentTileCard.jsx";
import KeyboardWrapper from "../components/focus/KeyboardWrapper.jsx";
import { gridCellKeyboardProps } from "../components/grid/contentGridKeyboard.js";
import TvSearchBrowseDrillPage from "../components/search/TvSearchBrowseDrillPage.jsx";
import TvSearchLabelTile from "../components/search/TvSearchLabelTile.jsx";
import TvSearchRadioGeoRegion from "../components/search/TvSearchRadioGeoRegion.jsx";
import { radioInternationalPath } from "../constants/radioBrowsePaths.js";

const INTERNATIONAL_BASE = "/search/browse/radio/international";

function parseInternationalSegments(pathname) {
  if (!pathname.startsWith(`${INTERNATIONAL_BASE}/`)) return [];
  return pathname
    .slice(INTERNATIONAL_BASE.length + 1)
    .split("/")
    .filter(Boolean);
}

/** Continent grid, geo combo screens, or leaf station grid. */
export default function SearchRadioInternational() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  let segments = parseInternationalSegments(pathname);

  if (segments[segments.length - 1] === "stations") {
    const parentSegments = segments.slice(0, -1);
    const parentResolved = resolveGeoNodeFromSegments(parentSegments);
    if ("invalid" in parentResolved) {
      return <Navigate to={SEARCH_BROWSE.radio} replace />;
    }
    const allPopular = getPopularStationsForGeoNode(parentResolved.node.id);
    return (
      <TvSearchBrowseDrillPage
        screenId={`search-radio-intl-${parentSegments.join("-")}-all`}
        title={`Popular in ${parentResolved.node.label}`}
        items={allPopular}
        emptyMessage="No stations in this region yet."
        onSelectItem={(station) => navigate(`/radio/${station.id}`)}
        renderItem={(station, isFocused, setRef, onSelect, cellNav) => (
          <KeyboardWrapper
            ref={setRef}
            selectData={station}
            onSelect={() => onSelect(station)}
          {...gridCellKeyboardProps(cellNav)}

          >
            {(focusProps) => (
              <ContentTileCard
                {...focusProps}
                title={station.name}
                imageUrl={station.thumbnail}
                focused={isFocused}
              />
            )}
          </KeyboardWrapper>
        )}
      />
    );
  }

  if (segments.length === 0) {
    const continents = INTERNATIONAL_CONTINENTS_PLANNED.map((continent) => ({
      id: continent.id,
      title: continent.label,
    }));

    return (
      <TvSearchBrowseDrillPage
        screenId="search-radio-international-continents"
        title="International"
        items={continents}
        emptyMessage="No regions available."
        onSelectItem={(continent) =>
          navigate(radioInternationalPath([continent.id]))
        }
        renderItem={(continent, isFocused, setRef, onSelect, cellNav) => (
          <KeyboardWrapper
            ref={setRef}
            selectData={continent}
            onSelect={() => onSelect(continent)}
          {...gridCellKeyboardProps(cellNav)}

          >
            {(focusProps) => (
              <TvSearchLabelTile
                {...focusProps}
                label={continent.title}
                focused={isFocused}
              />
            )}
          </KeyboardWrapper>
        )}
      />
    );
  }

  const resolved = resolveGeoNodeFromSegments(segments);
  if ("invalid" in resolved) {
    return <Navigate to={SEARCH_BROWSE.radio} replace />;
  }

  const { node } = resolved;
  const childNodes = getChildGeoNodes(node);
  const popular = getPopularStationsForGeoNode(node.id);
  const screenId = `search-radio-intl-${segments.join("-")}`;

  if (childNodes.length === 0) {
    return (
      <TvSearchBrowseDrillPage
        screenId={screenId}
        title={node.label}
        items={popular}
        emptyMessage="No stations in this region yet."
        onSelectItem={(station) => navigate(`/radio/${station.id}`)}
        renderItem={(station, isFocused, setRef, onSelect, cellNav) => (
          <KeyboardWrapper
            ref={setRef}
            selectData={station}
            onSelect={() => onSelect(station)}
          {...gridCellKeyboardProps(cellNav)}

          >
            {(focusProps) => (
              <ContentTileCard
                {...focusProps}
                title={station.name}
                imageUrl={station.thumbnail}
                focused={isFocused}
              />
            )}
          </KeyboardWrapper>
        )}
      />
    );
  }

  return (
    <TvSearchRadioGeoRegion
      node={node}
      segments={segments}
      screenId={screenId}
    />
  );
}
