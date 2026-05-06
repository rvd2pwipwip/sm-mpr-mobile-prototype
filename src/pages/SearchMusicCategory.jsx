import { Navigate, useNavigate, useParams } from "react-router-dom";
import MusicChannelCard from "../components/MusicChannelCard";
import ScreenHeader, { ScreenHeaderChevronBack } from "../components/ScreenHeader";
import { MUSIC_GENRES, getMusicChannelsByCategory } from "../data/musicChannels";
import "./SwimlaneMore.css";

/** Limited + broad **Genre** vibe: channels for one lineup genre (`categoryId`). */
export default function SearchMusicCategory() {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  const genre = categoryId ? MUSIC_GENRES.find((g) => g.id === categoryId) : null;
  const channels = genre ? getMusicChannelsByCategory(categoryId) : [];

  if (!categoryId || !genre) {
    return <Navigate to="/search" replace />;
  }

  const goBack = () => navigate(-1);

  return (
    <main className="app-shell app-shell--footer-fixed swimlane-more">
      <ScreenHeader
        title={genre.label}
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
            No channels in this genre.
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
