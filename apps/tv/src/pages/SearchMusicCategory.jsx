import { Navigate, useNavigate, useParams } from "react-router-dom";
import { SEARCH_BROWSE } from "@sm-mpr/shared/constants/searchBrowsePaths.js";
import { CATALOG_SCOPE } from "@sm-mpr/shared/constants/catalogScope.js";
import {
  MUSIC_GENRES,
  getMusicChannelsByCategory,
  getLimitedMusicChannelsByCategory,
} from "@sm-mpr/shared/data/musicChannels.js";
import MusicChannelCard from "../components/cards/MusicChannelCard.jsx";
import KeyboardWrapper from "../components/focus/KeyboardWrapper.jsx";
import { gridCellKeyboardProps } from "../components/grid/contentGridKeyboard.js";
import TvSearchBrowseDrillPage from "../components/search/TvSearchBrowseDrillPage.jsx";
import { useTerritory } from "../context/TerritoryContext.jsx";

/** Limited + broad Genre vibe: channels for one lineup genre. */
export default function SearchMusicCategory() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const { catalogScope } = useTerritory();

  const genre = categoryId ? MUSIC_GENRES.find((g) => g.id === categoryId) : null;
  const channels = genre
    ? catalogScope === CATALOG_SCOPE.limited
      ? getLimitedMusicChannelsByCategory(categoryId)
      : getMusicChannelsByCategory(categoryId)
    : [];

  if (!categoryId || !genre) {
    return <Navigate to={SEARCH_BROWSE.music} replace />;
  }

  return (
    <TvSearchBrowseDrillPage
      screenId={`search-music-category-${categoryId}`}
      title={genre.label}
      items={channels}
      emptyMessage="No channels in this genre."
      onSelectItem={(channel) => navigate(`/music/${channel.id}`)}
      renderItem={(channel, isFocused, setRef, onSelect, cellNav) => (
        <KeyboardWrapper
          ref={setRef}
          selectData={channel}
          onSelect={() => onSelect(channel)}
          {...gridCellKeyboardProps(cellNav)}

        >
          {(focusProps) => (
            <MusicChannelCard
              {...focusProps}
              channel={channel}
              focused={isFocused}
            />
          )}
        </KeyboardWrapper>
      )}
    />
  );
}
