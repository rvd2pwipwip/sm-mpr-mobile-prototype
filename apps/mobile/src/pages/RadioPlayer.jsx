import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import FullScreenPlayerShell from "../components/FullScreenPlayerShell";
import RadioPlayerInfoSheet from "../components/player/RadioPlayerInfoSheet";
import PlayerPrerollAd from "../components/PlayerPrerollAd";
import PlayerHeaderCenterSlot from "../components/PlayerHeaderCenterSlot";
import { useGuestPrerollGrace } from "../context/GuestPrerollGraceContext";
import { usePlayback } from "../context/PlaybackContext";
import { useListenHistory } from "../context/ListenHistoryContext";
import { useUserType } from "../context/UserTypeContext";
import { useMusicRadioLikeAction } from "../hooks/useMusicRadioLikeAction";
import { useFullscreenPlayerThumbSidePx } from "../hooks/useFullscreenPlayerThumbSidePx";
import { useGoUpgrade } from "../hooks/useGoUpgrade";
import { resolveRadioStationForStub } from "../data/radioInternationalBrowse.js";
import { showPlayerPreroll, showVisualAds } from "../utils/showVisualAds";
import "./MusicPlayer.css";
import "./RadioPlayer.css";
import { CASTING_ON } from "../constants/castPrototypeCopy";
import { useCastPrototype } from "../context/CastPrototypeContext";
import { useSharePrototype } from "../context/SharePrototypeContext";

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
  const goUpgrade = useGoUpgrade();
  const { session, upsertRadioSession } = usePlayback();
  const { recordRadioStationListen } = useListenHistory();
  const { graceActive } = useGuestPrerollGrace();
  const { userType } = useUserType();
  const needsPreroll = showPlayerPreroll(userType);
  const expandFromMini = location.state?.expandFromMiniPlayer === true;
  const skipPrerollGate = !needsPreroll || expandFromMini || graceActive;
  const [prerollComplete, setPrerollComplete] = useState(() => skipPrerollGate);
  const [playing, setPlaying] = useState(() => skipPrerollGate);
  const [infoSheetOpen, setInfoSheetOpen] = useState(false);

  const station = stationId ? resolveRadioStationForStub(stationId) : null;
  const likeAction = useMusicRadioLikeAction("radio", station?.id);

  const { isCasting, castDeviceName, openCastTo } = useCastPrototype();
  const { openSharePrototype } = useSharePrototype();

  const mainRef = useRef(/** @type {HTMLElement | null} */ (null));
  const thumbSidePx = useFullscreenPlayerThumbSidePx(mainRef, Boolean(station));

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

  /** History once playback is allowed (`MusicPlayer` parity) — not on pause toggles. */
  useEffect(() => {
    if (!station) return;
    if (needsPreroll && !prerollComplete) return;
    recordRadioStationListen(station.id);
  }, [station?.id, needsPreroll, prerollComplete, recordRadioStationListen]);

  if (!station) {
    return <Navigate to="/search/radio" replace />;
  }

  /** Minimize: from mini player pop stack; else replace with station detail (same URL as card tap). */
  const leaveFullPlayerMinimize = () => {
    if (expandFromMini) {
      navigate(-1);
      return;
    }
    navigate(`/radio/${station.id}`, { replace: true });
  };

  /** Info opens in-player bottom sheet — does not leave `/play`. */
  const dismiss = leaveFullPlayerMinimize;

  const subtitleLine =
    station.frequencyLabel ?? station.categoryLabel ?? "";

  const showAds = showVisualAds(userType);

  return (
    <main
      ref={mainRef}
      className={[
        "app-shell",
        "music-player-screen",
        "radio-player-screen",
        infoSheetOpen ? "music-player-screen--info-sheet" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      style={{ "--player-thumb-side": `${thumbSidePx}px` }}
    >
      {needsPreroll && !prerollComplete ? (
        <PlayerPrerollAd
          onComplete={() => {
            setPrerollComplete(true);
            setPlaying(true);
          }}
        />
      ) : null}
      <FullScreenPlayerShell
        header={
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
              <PlayerHeaderCenterSlot userType={userType} onUpgrade={goUpgrade} />
            </div>
            <button
              type="button"
              className="music-player__header-btn music-player__header-btn--end"
              aria-label={isCasting ? "Casting on" : "Cast"}
              onClick={openCastTo}
            >
              <PlayerHeaderIcon variant={isCasting ? "casting" : "cast"} />
            </button>
          </header>
        }
        hero={
          <div className="music-player__top">
            <h1 className="music-player__channel-name">{station.name}</h1>
            <div className="music-player__meta-actions">
              <button
                type="button"
                className="music-player__icon-btn"
                aria-label="Station info"
                onClick={() => setInfoSheetOpen(true)}
              >
                <PlayerMetaActionIcon variant="info" />
              </button>
              <button
                type="button"
                className="music-player__icon-btn"
                aria-label={likeAction.ariaLabel}
                onClick={likeAction.onPress}
              >
                <PlayerMetaActionIcon variant={likeAction.iconVariant} />
              </button>
              {/* Share — hidden for v1; restore when share ships */}
              {/*
              <button
                type="button"
                className="music-player__icon-btn"
                aria-label="Share"
                onClick={openSharePrototype}
              >
                <PlayerMetaActionIcon variant="share" />
              </button>
              */}
            </div>

            <div className="music-player__cover-block">
              {isCasting && castDeviceName ? (
                <button
                  type="button"
                  className="music-player__cover music-player__cover--casting-touch"
                  onClick={openCastTo}
                  aria-label="Casting on"
                >
                  <img
                    src={station.thumbnail}
                    alt=""
                    width={thumbSidePx}
                    height={thumbSidePx}
                    loading="eager"
                    decoding="async"
                  />
                  <span className="music-player__cover-scrim" aria-hidden={true} />
                  <span className="music-player__cover-casting-label">
                    <span className="music-player__cover-casting-line1">
                      {CASTING_ON.lineCasting}
                    </span>
                    <span className="music-player__cover-casting-line2">
                      {castDeviceName}
                    </span>
                  </span>
                </button>
              ) : (
                <div className="music-player__cover">
                  <img
                    src={station.thumbnail}
                    alt=""
                    width={thumbSidePx}
                    height={thumbSidePx}
                    loading="eager"
                    decoding="async"
                  />
                </div>
              )}
              <div className="music-player__track-text">
                <p className="music-player__song">Now playing (prototype)</p>
                <p className="music-player__artist">{station.name}</p>
                <p className="music-player__album">{subtitleLine}</p>
              </div>
            </div>
          </div>
        }
        footer={
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
        }
        showProviderBrand={userType === "freeProvided"}
        showPlayerAd={showAds}
      />

      <RadioPlayerInfoSheet
        open={infoSheetOpen}
        onClose={() => setInfoSheetOpen(false)}
        stationId={station.id}
        playing={playing}
        onTogglePlay={() => setPlaying((p) => !p)}
      />
    </main>
  );
}
