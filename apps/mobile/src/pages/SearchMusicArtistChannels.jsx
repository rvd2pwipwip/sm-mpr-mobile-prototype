import { Navigate, useNavigate, useParams } from "react-router-dom";
import MusicChannelCard from "../components/MusicChannelCard";
import ScreenHeader, { ScreenHeaderChevronBack } from "../components/ScreenHeader";
import { SEARCH_BROWSE } from "../constants/searchBrowsePaths.js";
import {
  getFeaturedChannelsForArtist,
  getMusicArtistById,
} from "../data/musicArtists.js";
import "./SwimlaneMore.css";

/** Search hit **artist** drill-down: 2-column channel grid featuring the artist. */
export default function SearchMusicArtistChannels() {
  const { artistId } = useParams();
  const navigate = useNavigate();

  const artist = artistId ? getMusicArtistById(artistId) : null;
  const channels = artist ? getFeaturedChannelsForArtist(artist) : [];

  if (!artistId || !artist) {
    return <Navigate to={SEARCH_BROWSE.music} replace />;
  }

  const goBack = () => navigate(-1);

  return (
    <main className="app-shell app-shell--footer-fixed swimlane-more">
      <ScreenHeader
        title={artist.name}
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
        {channels.length === 0 ? (
          <p className="text-muted" style={{ padding: "0 var(--swimlane-more-inline, 40px)" }}>
            No channels linked to this artist in the prototype catalog.
          </p>
        ) : (
          <ul className="swimlane-more__grid" role="list">
            {channels.map((channel) => (
              <li key={channel.id} className="swimlane-more__cell">
                <MusicChannelCard
                  channel={channel}
                  onSelect={() => navigate(`/music/${channel.id}`)}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
