import { Navigate, useNavigate, useParams } from "react-router-dom";
import ScreenHeader, { ScreenHeaderChevronBack } from "../components/ScreenHeader";
import { getMusicChannelById } from "../data/musicChannels";
import "./MusicPlayer.css";

/** Full player — Figma `23:20013`; stub until UI is built. */
export default function MusicPlayer() {
  const { channelId } = useParams();
  const navigate = useNavigate();
  const channel = channelId ? getMusicChannelById(channelId) : null;

  if (!channel) {
    return <Navigate to="/" replace />;
  }

  return (
    <main className="app-shell music-player-screen">
      <ScreenHeader
        startSlot={
          <button
            type="button"
            className="screen-header__icon-btn"
            onClick={() => navigate(-1)}
            aria-label="Back"
          >
            <ScreenHeaderChevronBack />
          </button>
        }
        title={channel.name}
      />
      <div className="music-player-screen__body">
        <p className="music-player-screen__stub text-muted">
          Music player layout — implement from Figma node 23:20013.
        </p>
      </div>
    </main>
  );
}
