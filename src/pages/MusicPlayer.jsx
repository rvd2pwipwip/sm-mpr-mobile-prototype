import { useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import UpgradeButton from "../components/UpgradeButton";
import { useUserType } from "../context/UserTypeContext";
import { getMusicChannelById } from "../data/musicChannels";
import "./MusicPlayer.css";

/** `public/down.svg`, `cast.svg` — mask + `currentColor`. */
function PlayerHeaderIcon({ variant }) {
  return (
    <span
      className={["music-player__header-icon-mask", `music-player__header-icon-mask--${variant}`].join(
        " "
      )}
      aria-hidden={true}
    />
  );
}

/** `public/info.svg`, `like.svg`, `share.svg` — mask + `currentColor` (see `MusicChannelInfo`). */
function PlayerMetaActionIcon({ variant }) {
  return (
    <span
      className={["music-player__meta-action-icon", `music-player__meta-action-icon--${variant}`].join(
        " "
      )}
      aria-hidden={true}
    />
  );
}

/** `public/playerCtrlPause.svg` / `playerCtrlPlay.svg` — mask + `currentColor`. */
function PlayerPlayPauseIcon({ playing }) {
  return (
    <span
      className={[
        "music-player__transport-ctrl-icon",
        playing
          ? "music-player__transport-ctrl-icon--pause"
          : "music-player__transport-ctrl-icon--play",
      ].join(" ")}
      aria-hidden={true}
    />
  );
}

/** `public/skip.svg` — mask + `currentColor`. */
function PlayerSkipIcon() {
  return <span className="music-player__skip-icon" aria-hidden={true} />;
}

/** Full-screen music player — Figma `23:20013`; no bottom tab bar on this route. */
export default function MusicPlayer() {
  const { channelId } = useParams();
  const navigate = useNavigate();
  const { userType } = useUserType();
  const [playing, setPlaying] = useState(true);

  const channel = channelId ? getMusicChannelById(channelId) : null;

  if (!channel) {
    return <Navigate to="/" replace />;
  }

  const dismiss = () => navigate(-1);

  return (
    <main className="app-shell music-player-screen">
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

      <div className="music-player__body">
        <div className="music-player__top">
          <h1 className="music-player__channel-name">{channel.name}</h1>
          <div className="music-player__meta-actions">
            <button
              type="button"
              className="music-player__icon-btn"
              aria-label="Channel info"
              onClick={() => navigate(`/music/${channel.id}`)}
            >
              <PlayerMetaActionIcon variant="info" />
            </button>
            <button
              type="button"
              className="music-player__icon-btn"
              aria-label="Like"
            >
              <PlayerMetaActionIcon variant="like" />
            </button>
            <button
              type="button"
              className="music-player__icon-btn"
              aria-label="Share"
            >
              <PlayerMetaActionIcon variant="share" />
            </button>
          </div>

          <div className="music-player__cover-block">
            <div className="music-player__cover">
              <img
                src={channel.thumbnail}
                alt=""
                width={320}
                height={320}
                loading="eager"
                decoding="async"
              />
            </div>
            <div className="music-player__track-text">
              <p className="music-player__song">Song title (prototype)</p>
              <p className="music-player__artist">Artist name</p>
              <p className="music-player__album">Album name</p>
            </div>
          </div>
        </div>

        <div className="music-player__controls">
          <div className="music-player__progress">
            <div className="music-player__progress-track">
              <div className="music-player__progress-fill" />
            </div>
          </div>
          <div className="music-player__transport">
            <span
              className="music-player__transport-spacer"
              aria-hidden={true}
            />
            <button
              type="button"
              className="music-player__play-toggle"
              onClick={() => setPlaying((p) => !p)}
              aria-label={playing ? "Pause" : "Play"}
            >
              <PlayerPlayPauseIcon playing={playing} />
            </button>
            <button
              type="button"
              className="music-player__skip"
              aria-label="Skip forward"
            >
              <PlayerSkipIcon />
            </button>
          </div>
        </div>

        <div
          className="music-player__ad"
          role="img"
          aria-label="Ad placeholder"
        >
          Ad footer
        </div>
      </div>
    </main>
  );
}
