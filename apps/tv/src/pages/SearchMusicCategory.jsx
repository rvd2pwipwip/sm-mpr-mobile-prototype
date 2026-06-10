import { Navigate, useNavigate, useParams } from "react-router-dom";
import { SEARCH_BROWSE } from "@sm-mpr/shared/constants/searchBrowsePaths.js";
import {
  MUSIC_GENRES,
  getMusicChannelsByCategory,
} from "@sm-mpr/shared/data/musicChannels.js";
import MusicChannelCard from "../components/cards/MusicChannelCard.jsx";
import KeyboardWrapper from "../components/focus/KeyboardWrapper.jsx";
import TvSearchBrowseDrillPage from "../components/search/TvSearchBrowseDrillPage.jsx";

/** Limited + broad Genre vibe: channels for one lineup genre. */
export default function SearchMusicCategory() {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  const genre = categoryId ? MUSIC_GENRES.find((g) => g.id === categoryId) : null;
  const channels = genre ? getMusicChannelsByCategory(categoryId) : [];

  if (!categoryId || !genre) {
    return <Navigate to={SEARCH_BROWSE.music} replace />;
  }

  return (
    <TvSearchBrowseDrillPage
      screenId={`search-music-category-${categoryId}`}
      title={genre.label}
      meta={`${channels.length} channels`}
      items={channels}
      emptyMessage="No channels in this genre."
      onSelectItem={(channel) => navigate(`/music/${channel.id}`)}
      renderItem={(channel, isFocused, setRef, onSelect) => (
        <KeyboardWrapper
          ref={setRef}
          selectData={channel}
          onSelect={() => onSelect(channel)}
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
