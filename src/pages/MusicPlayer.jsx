import { useEffect, useLayoutEffect, useState } from "react";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import MusicSkipButton from "../components/MusicSkipButton";
import PlayerPrerollAd from "../components/PlayerPrerollAd";
import UpgradeButton from "../components/UpgradeButton";
import VisualAdStrip from "../components/VisualAdStrip";
import { useGuestPrerollGrace } from "../context/GuestPrerollGraceContext";
import { usePlayback } from "../context/PlaybackContext";
import { useUserType } from "../context/UserTypeContext";
import { showPlayerPreroll, showVisualAds } from "../utils/showVisualAds";
import { getMusicChannelById } from "../data/musicChannels";
import "./MusicPlayer.css";

/** `public/down.svg`, `cast.svg` — mask + `currentColor`. */
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

/** `public/info.svg`, `like.svg`, `share.svg` — mask + `currentColor` (see `MusicChannelInfo`). */
function PlayerMetaActionIcon({ variant }) {
  return (
    <span
      className={[
        "music-player__meta-action-icon",
        `music-player__meta-action-icon--${variant}`,
      ].join(" ")}
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

/** Full-screen music player — Figma `23:20013`; no bottom tab bar on this route. */
export default function MusicPlayer() {
  const { channelId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { session, upsertMusicSession } = usePlayback();
  const { graceActive } = useGuestPrerollGrace();
  const { userType } = useUserType();
  const needsPreroll = showPlayerPreroll(userType);
  const expandFromMini = location.state?.expandFromMiniPlayer === true;
  const skipPrerollGate = !needsPreroll || expandFromMini || graceActive;
  const [prerollComplete, setPrerollComplete] = useState(() => skipPrerollGate);
  const [playing, setPlaying] = useState(() => skipPrerollGate);

  const channel = channelId ? getMusicChannelById(channelId) : null;

  useLayoutEffect(() => {
    if (!channel) return;
    if (needsPreroll && !prerollComplete) return;
    if (session.channelId === channel.id) setPlaying(!session.isPaused);
    // Intentionally only when route / preroll gate changes — read `session` once to match mini state.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channel?.id, needsPreroll, prerollComplete]);

  useEffect(() => {
    if (!channel) return;
    if (needsPreroll && !prerollComplete) return;
    upsertMusicSession({
      channelId: channel.id,
      thumbnail: channel.thumbnail,
      title: "Song title (prototype)",
      subtitle: "Artist name",
      isPaused: !playing,
    });
  }, [channel, needsPreroll, prerollComplete, playing, upsertMusicSession]);

  if (!channel) {
    return <Navigate to="/" replace />;
  }

  const dismiss = () => navigate(-1);

  return (
    <main className="app-shell music-player-screen">
      {needsPreroll && !prerollComplete ? (
        <PlayerPrerollAd
          onComplete={() => {
            setPrerollComplete(true);
            setPlaying(true);
          }}
        />
      ) : null}
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

      <div
        className={[
          "music-player__body",
          !showVisualAds(userType) ? "music-player__body--no-player-ad" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
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
            <MusicSkipButton size="full" />
          </div>
        </div>

        {showVisualAds(userType) ? <VisualAdStrip variant="player" /> : null}
      </div>
    </main>
  );
}
