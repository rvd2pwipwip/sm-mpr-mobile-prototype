import { Navigate, useNavigate, useParams } from "react-router-dom";
import { SEARCH_BROWSE } from "@sm-mpr/shared/constants/searchBrowsePaths.js";
import {
  getFeaturedChannelsForArtist,
  getMusicArtistById,
} from "@sm-mpr/shared/data/musicArtists.js";
import MusicChannelCard from "../components/cards/MusicChannelCard.jsx";
import KeyboardWrapper from "../components/focus/KeyboardWrapper.jsx";
import { gridCellKeyboardProps } from "../components/grid/contentGridKeyboard.js";
import TvSearchBrowseDrillPage from "../components/search/TvSearchBrowseDrillPage.jsx";

/** Search artist hit: channel grid featuring the artist. */
export default function SearchMusicArtistChannels() {
  const { artistId } = useParams();
  const navigate = useNavigate();

  const artist = artistId ? getMusicArtistById(artistId) : null;
  const channels = artist ? getFeaturedChannelsForArtist(artist) : [];

  if (!artistId || !artist) {
    return <Navigate to={SEARCH_BROWSE.music} replace />;
  }

  return (
    <TvSearchBrowseDrillPage
      screenId={`search-music-artist-${artistId}`}
      title={artist.name}
      items={channels}
      emptyMessage="No channels linked to this artist in the prototype catalog."
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
