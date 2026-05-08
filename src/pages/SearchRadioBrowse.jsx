import { useNavigate } from "react-router-dom";
import {
  SearchBrowseTile,
  SearchBrowseTileGrid,
} from "../components/SearchBrowseTile.jsx";
import { RADIO_BROWSE_PATH } from "../constants/radioBrowsePaths.js";
import { RADIO_STATION_CATEGORIES } from "../data/radioStations.js";

/**
 * Search tab → Browse → Radio: top-level tiles (Near You, International, formats).
 */
export default function SearchRadioBrowse() {
  const navigate = useNavigate();
  const headingId = "search-radio-browse-heading";

  return (
    <div className="content-inset search-page__body">
      {/* <h2 id={headingId} className="search-page__browse-heading">
        Browse radio
      </h2> */}
      <SearchBrowseTileGrid labelId={headingId}>
        {RADIO_STATION_CATEGORIES.map((cat) => {
          const navigateTo =
            cat.id === "near-you"
              ? RADIO_BROWSE_PATH.nearYou
              : cat.id === "international"
                ? RADIO_BROWSE_PATH.international
                : RADIO_BROWSE_PATH.format(cat.id);
          return (
            <SearchBrowseTile key={cat.id} onClick={() => navigate(navigateTo)}>
              {cat.label}
            </SearchBrowseTile>
          );
        })}
      </SearchBrowseTileGrid>
    </div>
  );
}
