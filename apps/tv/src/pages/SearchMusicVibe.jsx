import { Navigate, useNavigate, useParams } from "react-router-dom";
import { SEARCH_BROWSE } from "@sm-mpr/shared/constants/searchBrowsePaths.js";
import {
  getBroadVibeById,
  getChildTagsForBroadVibe,
} from "@sm-mpr/shared/data/musicBrowseTaxonomy.js";
import KeyboardWrapper from "../components/focus/KeyboardWrapper.jsx";
import { gridCellKeyboardProps } from "../components/grid/contentGridKeyboard.js";
import TvSearchBrowseDrillPage from "../components/search/TvSearchBrowseDrillPage.jsx";
import TvSearchLabelTile from "../components/search/TvSearchLabelTile.jsx";

/** Broad lineup: tags under one vibe (or genre rows under Genre vibe). */
export default function SearchMusicVibe() {
  const { vibeId } = useParams();
  const navigate = useNavigate();

  const vibe = vibeId ? getBroadVibeById(vibeId) : null;
  const children = vibeId ? getChildTagsForBroadVibe(vibeId) : [];

  if (!vibeId || !vibe) {
    return <Navigate to={SEARCH_BROWSE.music} replace />;
  }

  const tiles = children.map((row) => ({
    id: row.slug,
    label: row.label,
    row,
  }));

  function navigateRow(row) {
    if (row.kind === "genre") {
      if (row.hasSubs) {
        navigate(`/search/browse/music/vibe/${vibeId}/tag/${row.slug}`);
        return;
      }
      if (row.id) {
        navigate(`/search/browse/music/category/${row.id}`);
        return;
      }
    }
    navigate(`/search/browse/music/vibe/${vibeId}/tag/${row.slug}`);
  }

  return (
    <TvSearchBrowseDrillPage
      screenId={`search-music-vibe-${vibeId}`}
      title={vibe.label}
      items={tiles}
      emptyMessage="No tags for this vibe."
      onSelectItem={(tile) => navigateRow(tile.row)}
      renderItem={(tile, isFocused, setRef, onSelect, cellNav) => (
        <KeyboardWrapper
          ref={setRef}
          onSelect={() => onSelect(tile)}
          {...gridCellKeyboardProps(cellNav)}

        >
          {(focusProps) => (
            <TvSearchLabelTile
              {...focusProps}
              label={tile.label}
              focused={isFocused}
            />
          )}
        </KeyboardWrapper>
      )}
    />
  );
}
