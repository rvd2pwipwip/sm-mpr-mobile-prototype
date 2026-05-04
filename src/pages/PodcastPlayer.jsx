import { Navigate, useNavigate, useParams } from "react-router-dom";
import UpgradeButton from "../components/UpgradeButton";
import { useUserType } from "../context/UserTypeContext";
import { getPodcastById, getPodcastEpisodeById } from "../data/podcasts";
import "./MusicPlayer.css";
import "./PodcastPlayer.css";

/** `public/down.svg`, `cast.svg` — masks (same as MusicPlayer). */
function PlayerHeaderIcon({ variant }) {
  return (
    <span
      className={[
        "music-player__header-icon-mask",
        `music-player__header-icon-mask--${variant}`,
      ].join(" ")}
      aria-hidden={true}
    />
  );
}

/** Full-screen podcast player — Phase 1 shell (Figma `19601:28077`); transport / preroll in later phases. */
export default function PodcastPlayer() {
  const { podcastId, episodeId } = useParams();
  const navigate = useNavigate();
  const { userType } = useUserType();

  if (!podcastId) {
    return <Navigate to="/" replace />;
  }

  const podcast = getPodcastById(podcastId);
  if (!podcast) {
    return <Navigate to="/" replace />;
  }

  const bundle = episodeId ? getPodcastEpisodeById(podcastId, episodeId) : null;
  if (!bundle) {
    return <Navigate to={`/podcast/${podcastId}`} replace />;
  }

  const { episode } = bundle;

  const dismiss = () => navigate(-1);

  return (
    <main className="app-shell music-player-screen podcast-player-shell">
      <header className="music-player__header">
        <button
          type="button"
          className="music-player__header-btn music-player__header-btn--start"
          onClick={dismiss}
          aria-label="Minimize player"
        >
          <PlayerHeaderIcon variant="down" />
        </button>
        <div className="music-player__header-center">
          {userType === "guest" ? (
            <UpgradeButton onClick={() => navigate("/upgrade")} />
          ) : (
            <span className="music-player__header-spacer" aria-hidden={true} />
          )}
        </div>
        <button
          type="button"
          className="music-player__header-btn music-player__header-btn--end"
          aria-label="Cast"
        >
          <PlayerHeaderIcon variant="cast" />
        </button>
      </header>

      <div className="music-player__body music-player__body--no-player-ad">
        <div className="music-player__top">
          <h1 className="music-player__channel-name">{podcast.title}</h1>
        </div>
        <div className="music-player__cover-block">
          <div className="music-player__cover">
            <img
              src={episode.thumbnail}
              alt=""
              width={320}
              height={320}
              loading="lazy"
              decoding="async"
            />
          </div>
          <div className="music-player__track-text">
            <p className="music-player__song">{episode.title}</p>
            <p className="music-player__artist">{episode.releaseDate}</p>
          </div>
        </div>
        <p className="podcast-player-shell__phase-note">
          Phase 1 — transport, scrubber, pre-roll in Phase 4–5.
        </p>
      </div>
    </main>
  );
}
