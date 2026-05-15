import { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import ContentSwimlane from "../components/ContentSwimlane.jsx";
import RadioStationCard from "../components/RadioStationCard.jsx";
import SearchRadioInternationalBrowseRail from "../components/SearchRadioInternationalBrowseRail.jsx";
import {
  SearchBrowseTile,
  SearchBrowseTileGrid,
} from "../components/SearchBrowseTile.jsx";
import { RADIO_BROWSE_PATH } from "../constants/radioBrowsePaths.js";
import { SWIMLANE_CARD_MAX } from "../constants/swimlane.js";
import {
  RADIO_STATION_CATEGORIES,
  getRadioStationsByCategory,
} from "../data/radioStations.js";

function radioBrowseMorePath(cat) {
  if (cat.id === "near-you") return RADIO_BROWSE_PATH.nearYou;
  if (cat.id === "international") return RADIO_BROWSE_PATH.international;
  return RADIO_BROWSE_PATH.format(cat.id);
}

/**
 * Search tab → Browse → Radio: stacked category swimlanes (International uses continent pills),
 * then top-level tiles (Near You, International, formats).
 */
export default function SearchRadioBrowse() {
  const navigate = useNavigate();
  const headingId = "search-radio-browse-heading";

  return (
    <Fragment>
      {RADIO_STATION_CATEGORIES.map((cat) => {
        if (cat.id === "international") {
          return (
            <SearchRadioInternationalBrowseRail
              key={cat.id}
              title={cat.label}
            />
          );
        }
        const stations = getRadioStationsByCategory(cat.id);
        const visible = stations.slice(0, SWIMLANE_CARD_MAX);
        const trailingMore = stations.length > SWIMLANE_CARD_MAX;
        const morePath = radioBrowseMorePath(cat);
        return (
          <ContentSwimlane
            key={cat.id}
            title={cat.label}
            showMore={false}
            sourceCount={stations.length}
            maxVisible={SWIMLANE_CARD_MAX}
            trailingMoreCard={trailingMore}
            onMore={() => navigate(morePath)}
          >
            {visible.map((station) => (
              <RadioStationCard
                key={station.id}
                station={station}
                onSelect={() => navigate(`/radio/${station.id}`)}
              />
            ))}
          </ContentSwimlane>
        );
      })}
      <div className="content-inset search-page__body">
        {/* <h2 id={headingId} className="search-page__browse-heading">
        Browse radio
      </h2> */}
        <SearchBrowseTileGrid labelId={headingId}>
          {RADIO_STATION_CATEGORIES.map((cat) => (
            <SearchBrowseTile
              key={cat.id}
              onClick={() => navigate(radioBrowseMorePath(cat))}
            >
              {cat.label}
            </SearchBrowseTile>
          ))}
        </SearchBrowseTileGrid>
      </div>
    </Fragment>
  );
}
