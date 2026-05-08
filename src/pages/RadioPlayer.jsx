import { useEffect, useLayoutEffect, useState } from "react";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import PlayerPrerollAd from "../components/PlayerPrerollAd";
import UpgradeButton from "../components/UpgradeButton";
import VisualAdStrip from "../components/VisualAdStrip";
import { useGuestPrerollGrace } from "../context/GuestPrerollGraceContext";
import { usePlayback } from "../context/PlaybackContext";
import { useUserType } from "../context/UserTypeContext";
import { resolveRadioStationForStub } from "../data/radioInternationalBrowse.js";
import { showPlayerPreroll, showVisualAds } from "../utils/showVisualAds";
import "./MusicPlayer.css";
import "./RadioPlayer.css";

/** `public/down.svg`, `cast.svg` — same as `MusicPlayer`. */
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

/** `public/info.svg`, `like.svg`, `share.svg` */
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

/** Full-screen radio player — same nav / dismiss / preroll / mini sync as `MusicPlayer`. */
export default function RadioPlayer() {
  const { stationId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { session, upsertRadioSession } = usePlayback();
  const { graceActive } = useGuestPrerollGrace();
  const { userType } = useUserType();
  const needsPreroll = showPlayerPreroll(userType);
  const expandFromMini = location.state?.expandFromMiniPlayer === true;
  const skipPrerollGate = !needsPreroll || expandFromMini || graceActive;
  const [prerollComplete, setPrerollComplete] = useState(() => skipPrerollGate);
  const [playing, setPlaying] = useState(() => skipPrerollGate);

  const station = stationId ? resolveRadioStationForStub(stationId) : null;

  useLayoutEffect(() => {
    if (!station) return;
    if (needsPreroll && !prerollComplete) return;
    if (session.radioStationId === station.id) setPlaying(!session.isPaused);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [station?.id, needsPreroll, prerollComplete]);

  useEffect(() => {
    if (!station) return;
    if (needsPreroll && !prerollComplete) return;
    upsertRadioSession({
      stationId: station.id,
      thumbnail: station.thumbnail,
      title: station.name,
      subtitle: "Now playing (prototype)",
      isPaused: !playing,
    });
  }, [station, needsPreroll, prerollComplete, playing, upsertRadioSession]);

  if (!station) {
    return <Navigate to="/search/radio" replace />;
  }

  const leaveFullPlayerForStationInfo = () => {
    if (expandFromMini) {
      navigate(-1);
      return;
    }
    navigate(`/radio/${station.id}`, { replace: true });
  };

  const dismiss = leaveFullPlayerForStationInfo;

  const subtitleLine =
    station.frequencyLabel ?? station.categoryLabel ?? "";

  return (
    <main className="app-shell music-player-screen radio-player-screen">
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
          <h1 className="music-player__channel-name">{station.name}</h1>
          <div className="music-player__meta-actions">
            <button
              type="button"
              className="music-player__icon-btn"
              aria-label="Station info"
              onClick={leaveFullPlayerForStationInfo}
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
                src={station.thumbnail}
                alt=""
                width={320}
                height={320}
                loading="eager"
                decoding="async"
              />
            </div>
            <div className="music-player__track-text">
              <p className="music-player__song">Now playing (prototype)</p>
              <p className="music-player__artist">{station.name}</p>
              <p className="music-player__album">{subtitleLine}</p>
            </div>
          </div>
        </div>

        <div className="music-player__controls">
          <div className="music-player__progress radio-player__progress">
            <div className="music-player__progress-track radio-player__progress-track">
              <div className="music-player__progress-fill radio-player__progress-fill" />
            </div>
            <p className="radio-player__live-label">Live</p>
          </div>
          <div className="music-player__transport radio-player__transport">
            <div className="music-player__transport-middle">
              <button
                type="button"
                className="music-player__play-toggle"
                onClick={() => setPlaying((p) => !p)}
                aria-label={playing ? "Pause" : "Play"}
              >
                <PlayerPlayPauseIcon playing={playing} />
              </button>
            </div>
          </div>
        </div>

        {showVisualAds(userType) ? <VisualAdStrip variant="player" /> : null}
      </div>
    </main>
  );
}
