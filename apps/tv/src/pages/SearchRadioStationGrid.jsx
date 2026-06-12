import { Navigate, useMatch, useNavigate, useParams } from "react-router-dom";
import { SEARCH_BROWSE } from "@sm-mpr/shared/constants/searchBrowsePaths.js";
import {
  RADIO_STATION_CATEGORIES,
  getRadioStationsByCategory,
} from "@sm-mpr/shared/data/radioStations.js";
import ContentTileCard from "../components/cards/ContentTileCard.jsx";
import KeyboardWrapper from "../components/focus/KeyboardWrapper.jsx";
import { gridCellKeyboardProps } from "../components/grid/contentGridKeyboard.js";
import TvSearchBrowseDrillPage from "../components/search/TvSearchBrowseDrillPage.jsx";

function sortByPopularityMock(stations) {
  return [...stations].sort((a, b) =>
    a.id.localeCompare(b.id, undefined, { numeric: true }),
  );
}

/** Near You or format category — 5-col station grid with parked row scroll. */
export default function SearchRadioStationGrid() {
  const navigate = useNavigate();
  const { formatId } = useParams();
  const nearYou = useMatch("/search/browse/radio/near-you");

  const categoryId = nearYou ? "near-you" : formatId;
  const category = categoryId
    ? RADIO_STATION_CATEGORIES.find((item) => item.id === categoryId)
    : null;
  const stations = categoryId
    ? sortByPopularityMock(getRadioStationsByCategory(categoryId))
    : [];

  if (!category) {
    return <Navigate to={SEARCH_BROWSE.radio} replace />;
  }

  return (
    <TvSearchBrowseDrillPage
      screenId={`search-radio-${categoryId}`}
      title={category.label}
      items={stations}
      emptyMessage="No stations in this category."
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
