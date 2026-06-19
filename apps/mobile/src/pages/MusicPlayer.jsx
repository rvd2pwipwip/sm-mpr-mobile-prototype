import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import FullScreenPlayerShell from "../components/FullScreenPlayerShell";
import MusicPlayerInfoSheet from "../components/player/MusicPlayerInfoSheet";
import MusicSkipButton from "../components/MusicSkipButton";
import PlayerPrerollAd from "../components/PlayerPrerollAd";
import PlayerHeaderCenterSlot from "../components/PlayerHeaderCenterSlot";
import { useGuestPrerollGrace } from "../context/GuestPrerollGraceContext";
import { useListenHistory } from "../context/ListenHistoryContext";
import { usePlayback } from "../context/PlaybackContext";
import { useUserType } from "../context/UserTypeContext";
import { useMusicRadioLikeAction } from "../hooks/useMusicRadioLikeAction";
import { useFullscreenPlayerThumbSidePx } from "../hooks/useFullscreenPlayerThumbSidePx";
import { useGoUpgrade } from "../hooks/useGoUpgrade";
import { showPlayerPreroll, showVisualAds } from "../utils/showVisualAds";
import { getMusicChannelById } from "../data/musicChannels";
import { CASTING_ON } from "../constants/castPrototypeCopy";
import { useCastPrototype } from "../context/CastPrototypeContext";
import { useSharePrototype } from "../context/SharePrototypeContext";
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
  const goUpgrade = useGoUpgrade();
  const { session, upsertMusicSession } = usePlayback();
  const { recordMusicChannelListen } = useListenHistory();
  const { graceActive } = useGuestPrerollGrace();
  const { userType } = useUserType();
  const needsPreroll = showPlayerPreroll(userType);
  const expandFromMini = location.state?.expandFromMiniPlayer === true;
  const skipPrerollGate = !needsPreroll || expandFromMini || graceActive;
  const [prerollComplete, setPrerollComplete] = useState(() => skipPrerollGate);
  const [playing, setPlaying] = useState(() => skipPrerollGate);
  const [infoSheetOpen, setInfoSheetOpen] = useState(false);

  const channel = channelId ? getMusicChannelById(channelId) : null;
  const likeAction = useMusicRadioLikeAction("music", channel?.id);

  const { isCasting, castDeviceName, openCastTo } = useCastPrototype();
  const { openSharePrototype } = useSharePrototype();

  const mainRef = useRef(/** @type {HTMLElement | null} */ (null));
  const thumbSidePx = useFullscreenPlayerThumbSidePx(mainRef, Boolean(channel));

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

  /** History once playback is allowed (after preroll or when skipped) — not on pause toggles. */
  useEffect(() => {
    if (!channel) return;
    if (needsPreroll && !prerollComplete) return;
    recordMusicChannelListen(channel.id);
  }, [channel?.id, needsPreroll, prerollComplete, recordMusicChannelListen]);

  if (!channel) {
    return <Navigate to="/" replace />;
  }

  /** Overlay dismiss — replaces `/play` when opened from Channel Info; from mini player, pop instead. */
  const leaveFullPlayerMinimize = () => {
    if (expandFromMini) {
      navigate(-1);
      return;
    }
    navigate(`/music/${channel.id}`, { replace: true });
  };

  /** Info opens in-player bottom sheet — does not leave `/play`. */
  const leavePlayer = (path) => {
    navigate(path, { replace: true });
  };

  const dismiss = leaveFullPlayerMinimize;

  const showAds = showVisualAds(userType);

  return (
    <main
      ref={mainRef}
      className={[
        "app-shell",
        "music-player-screen",
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
            <h1 className="music-player__channel-name">{channel.name}</h1>
            <div className="music-player__meta-actions">
              <button
                type="button"
                className="music-player__icon-btn"
                aria-label="Channel info"
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
              <button
                type="button"
                className="music-player__icon-btn"
                aria-label="Share"
                onClick={openSharePrototype}
              >
                <PlayerMetaActionIcon variant="share" />
              </button>
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
                    src={channel.thumbnail}
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
                    src={channel.thumbnail}
                    alt=""
                    width={thumbSidePx}
                    height={thumbSidePx}
                    loading="eager"
                    decoding="async"
                  />
                </div>
              )}
              <div className="music-player__track-text">
                <p className="music-player__song">Song title (prototype)</p>
                <p className="music-player__artist">Artist name</p>
                <p className="music-player__album">Album name</p>
              </div>
            </div>
          </div>
        }
        footer={
          <div className="music-player__controls">
            <div className="music-player__progress">
              <div className="music-player__progress-track">
                <div className="music-player__progress-fill" />
              </div>
            </div>
            <div className="music-player__transport">
              <div className="music-player__transport-start">
                <div className="music-player__transport-start-cluster" />
              </div>
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
              <div className="music-player__transport-end">
                <div className="music-player__transport-end-cluster">
                  <MusicSkipButton size="full" />
                </div>
              </div>
            </div>
          </div>
        }
        showProviderBrand={userType === "freeProvided"}
        showPlayerAd={showAds}
      />

      <MusicPlayerInfoSheet
        open={infoSheetOpen}
        onClose={() => setInfoSheetOpen(false)}
        channelId={channel.id}
        playing={playing}
        onTogglePlay={() => setPlaying((p) => !p)}
        onLeavePlayer={leavePlayer}
      />
    </main>
  );
}
