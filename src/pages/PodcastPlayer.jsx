import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import PlayerPrerollAd from "../components/PlayerPrerollAd";
import UpgradeButton from "../components/UpgradeButton";
import VisualAdStrip from "../components/VisualAdStrip";
import { PLAY_OVER_DETAIL } from "../constants/fullPlayerNavigation";
import { PODCAST_SPEED_STEPS } from "../constants/podcastPlayback";
import { useGuestPrerollGrace } from "../context/GuestPrerollGraceContext";
import { useListenHistory } from "../context/ListenHistoryContext";
import { usePlayback } from "../context/PlaybackContext";
import { usePodcastUserState } from "../context/PodcastUserStateContext";
import { useUserType } from "../context/UserTypeContext";
import {
  getPodcastById,
  getPodcastEpisodeById,
} from "../data/podcasts";
import { showPlayerPreroll, showVisualAds } from "../utils/showVisualAds";
import {
  approxDurationSecondsFromLabel,
  formatPlaybackClock,
} from "../utils/podcastDuration";
import "./MusicPlayer.css";
import "./PodcastPlayer.css";

/** `public/down.svg`, `cast.svg` — masks (same as `MusicPlayer`). */
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

/** `public/info.svg`, `share.svg` — masks (same as `MusicPlayer`). */
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

/** Same glyph as `EpisodeCard` bookmark. */
function PlayerBookmarkGlyph({ filled }) {
  return (
    <svg
      className="podcast-player__bookmark-glyph"
      width={40}
      height={40}
      viewBox="0 0 24 24"
      aria-hidden={true}
    >
      <path
        d="M8 5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v16l-4-3.2L8 21V5Z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
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

function PodcastSeekIcon({ variant }) {
  return (
    <span
      className={[
        "podcast-player__seek-mask",
        variant === "back"
          ? "podcast-player__seek-mask--replay15"
          : "podcast-player__seek-mask--fwd30",
      ].join(" ")}
      aria-hidden={true}
    />
  );
}

/** Full-screen podcast episode player — aligns with `MusicPlayer` chrome + stub transport (no audio). */
export default function PodcastPlayer() {
  const { podcastId, episodeId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { session, upsertPodcastSession } = usePlayback();
  const { graceActive } = useGuestPrerollGrace();
  const { recordPodcastShowListen } = useListenHistory();
  const { userType } = useUserType();
  const needsPreroll = showPlayerPreroll(userType);
  const expandFromMini = location.state?.expandFromMiniPlayer === true;
  const skipPrerollGate = !needsPreroll || expandFromMini || graceActive;
  const [prerollComplete, setPrerollComplete] = useState(() => skipPrerollGate);
  const [playing, setPlaying] = useState(() => skipPrerollGate);
  const [speedIdx, setSpeedIdx] = useState(() =>
    Math.max(0, PODCAST_SPEED_STEPS.indexOf(1)),
  );

  const {
    toggleBookmark,
    isBookmarked,
    episodeProgressById,
    setEpisodeProgress,
    getEpisodeProgress,
  } = usePodcastUserState();

  const getEpisodeProgressRef = useRef(getEpisodeProgress);
  getEpisodeProgressRef.current = getEpisodeProgress;
  const setEpisodeProgressRef = useRef(setEpisodeProgress);
  setEpisodeProgressRef.current = setEpisodeProgress;
  const listenHistoryRecordedForEpisodeRef = useRef(null);

  const podcast =
    podcastId && typeof podcastId === "string"
      ? getPodcastById(podcastId)
      : null;
  const bundle =
    podcast && episodeId
      ? getPodcastEpisodeById(podcast.id, episodeId)
      : null;
  const episode = bundle?.episode ?? null;

  const durationSec = useMemo(() => {
    if (!episode) return 0;
    return approxDurationSecondsFromLabel(episode.duration);
  }, [episode?.duration]);

  const position01Raw = episode ? episodeProgressById[episode.id] : undefined;
  const position01 =
    typeof position01Raw === "number" && !Number.isNaN(position01Raw)
      ? Math.min(1, Math.max(0, position01Raw))
      : 0;

  useLayoutEffect(() => {
    if (!podcast || !episode) return;
    if (needsPreroll && !prerollComplete) return;
    if (
      session.podcastId === podcast.id &&
      session.podcastEpisodeId === episode.id
    ) {
      setPlaying(!session.isPaused);
    }
    // Match `MusicPlayer`: sync from mini when route / gate changes — read pause once via session.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [podcast?.id, episode?.id, needsPreroll, prerollComplete]);

  useEffect(() => {
    if (!podcast || !episode) return;
    if (needsPreroll && !prerollComplete) return;
    upsertPodcastSession({
      podcastId: podcast.id,
      episodeId: episode.id,
      thumbnail: episode.thumbnail,
      title: episode.title,
      subtitle: podcast.title,
      isPaused: !playing,
    });
  }, [
    podcast,
    episode,
    episode?.id,
    episode?.title,
    episode?.thumbnail,
    playing,
    needsPreroll,
    prerollComplete,
    upsertPodcastSession,
  ]);

  /** Wall-clock tick at the chosen speed (UI stub). */
  useEffect(() => {
    if (!episode) return;
    if (!playing) return;
    if (needsPreroll && !prerollComplete) return;
    if (durationSec <= 0) return;
    if (position01 >= 1) return;
    const eid = episode.id;
    const tick = PODCAST_SPEED_STEPS[speedIdx] / durationSec;
    const id = window.setInterval(() => {
      const frac = getEpisodeProgressRef.current(eid, 0);
      if (frac >= 1) return;
      const next = frac + tick;
      if (next >= 1) {
        setEpisodeProgressRef.current(eid, 1);
        setPlaying(false);
      } else {
        setEpisodeProgressRef.current(eid, next);
      }
    }, 1000);
    return () => window.clearInterval(id);
  }, [
    episode?.id,
    playing,
    speedIdx,
    durationSec,
    needsPreroll,
    prerollComplete,
    position01,
  ]);

  /** One write per episode mount; after preroll gate, when user engages (play or >5% progress). */
  useEffect(() => {
    listenHistoryRecordedForEpisodeRef.current = null;
  }, [episode?.id]);

  useEffect(() => {
    if (!podcast || !episode) return;
    if (needsPreroll && !prerollComplete) return;
    if (listenHistoryRecordedForEpisodeRef.current === episode.id) return;
    if (!playing && position01 <= 0.05) return;
    listenHistoryRecordedForEpisodeRef.current = episode.id;
    recordPodcastShowListen(podcast.id);
  }, [
    podcast?.id,
    episode?.id,
    needsPreroll,
    prerollComplete,
    playing,
    position01,
    recordPodcastShowListen,
  ]);

  if (!podcastId) {
    return <Navigate to="/" replace />;
  }
  if (!podcast) {
    return <Navigate to="/" replace />;
  }
  if (!bundle || !episode) {
    return <Navigate to={`/podcast/${podcast.id}`} replace />;
  }

  const elapsedSec = position01 * durationSec;
  const speed = PODCAST_SPEED_STEPS[speedIdx] ?? 1;
  const bookmarkedHere = isBookmarked(episode.id);

  /**
   * Pop play when it was pushed on top of Podcast Info (see `playOverDetailNavigateState`);
   * otherwise replace so deep links still land on show with mini.
   */
  const leaveFullPlayerForShow = () => {
    if (location.state?.[PLAY_OVER_DETAIL]) {
      navigate(-1);
      return;
    }
    navigate(`/podcast/${podcast.id}`, { replace: true });
  };

  const dismiss = leaveFullPlayerForShow;

  const adjustSeconds = (delta) => {
    const frac = getEpisodeProgress(episode.id, 0);
    const posSec = frac * durationSec + delta;
    const next01 = Math.min(1, Math.max(0, posSec / durationSec));
    setEpisodeProgress(episode.id, next01);
  };

  const cycleSpeed = () => {
    setSpeedIdx((i) => (i + 1) % PODCAST_SPEED_STEPS.length);
  };

  const onScrubInput = (e) => {
    const v =
      typeof e.target.value === "string"
        ? Number.parseFloat(e.target.value)
        : e.target.value;
    if (!Number.isFinite(v)) return;
    setEpisodeProgress(episode.id, v / 1000);
  };

  const showAds = showVisualAds(userType);

  return (
    <main className="app-shell music-player-screen podcast-player-shell">
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
          !showAds ? "music-player__body--no-player-ad" : "",
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <div className="music-player__top">
          <h1 className="music-player__channel-name">{podcast.title}</h1>
          <div className="music-player__meta-actions">
            <button
              type="button"
              className="music-player__icon-btn"
              aria-label="Show info"
              onClick={leaveFullPlayerForShow}
            >
              <PlayerMetaActionIcon variant="info" />
            </button>
            <button
              type="button"
              className={[
                "music-player__icon-btn",
                bookmarkedHere ? "music-player__icon-btn--bookmark-on" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              aria-label={bookmarkedHere ? "Remove bookmark" : "Bookmark"}
              aria-pressed={bookmarkedHere}
              onClick={() => toggleBookmark(episode.id)}
            >
              <PlayerBookmarkGlyph filled={bookmarkedHere} />
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
                src={episode.thumbnail}
                alt=""
                width={320}
                height={320}
                loading="eager"
                decoding="async"
              />
            </div>
            <div className="music-player__track-text">
              <p className="music-player__song">{episode.title}</p>
              <p className="music-player__artist">
                {episode.releaseDate}
                {" · "}
                {episode.duration}
              </p>
            </div>
          </div>
        </div>

        <div className="music-player__controls podcast-player__controls">
          <div className="podcast-player__time-row">
            <span className="podcast-player__time" aria-hidden={true}>
              {formatPlaybackClock(elapsedSec)}
            </span>
            <span className="podcast-player__time" aria-hidden={true}>
              −{formatPlaybackClock(Math.max(0, durationSec - elapsedSec))}
            </span>
          </div>
          <div className="music-player__progress podcast-player__progress">
            <div className="music-player__progress-track podcast-player__progress-track">
              <div
                className="music-player__progress-fill"
                style={{ width: `${position01 * 100}%` }}
              />
            </div>
            <input
              id="podcast-scrub"
              className="podcast-player__range"
              type="range"
              min={0}
              max={1000}
              step={1}
              value={Math.round(position01 * 1000)}
              onChange={onScrubInput}
              aria-label="Playback position"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={Math.round(position01 * 100)}
            />
          </div>

          <div className="music-player__transport podcast-player__transport">
            <button
              type="button"
              className="music-player__skip podcast-player__seek"
              onClick={() => adjustSeconds(-15)}
              aria-label="Back 15 seconds"
            >
              <PodcastSeekIcon variant="back" />
            </button>
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
              className="music-player__skip podcast-player__seek"
              onClick={() => adjustSeconds(30)}
              aria-label="Forward 30 seconds"
            >
              <PodcastSeekIcon variant="fwd" />
            </button>
          </div>

          <div className="podcast-player__speed-row">
            <button
              type="button"
              className="podcast-player__speed"
              onClick={cycleSpeed}
              aria-label={`Playback speed ${speed}x. Tap to change.`}
            >
              {speed}x
            </button>
          </div>
        </div>

        {showAds ? <VisualAdStrip variant="player" /> : null}
      </div>
    </main>
  );
}
