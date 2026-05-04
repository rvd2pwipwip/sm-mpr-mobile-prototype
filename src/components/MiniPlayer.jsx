import { useNavigate } from "react-router-dom";
import { playOverDetailNavigateState } from "../constants/fullPlayerNavigation";
import { usePlayback } from "../context/PlaybackContext";
import { usePodcastUserState } from "../context/PodcastUserStateContext";
import { findPodcastAndEpisode } from "../data/podcasts";
import { approxDurationSecondsFromLabel } from "../utils/podcastDuration";
import MusicSkipButton from "./MusicSkipButton";
import "./MiniPlayer.css";

function PlayPauseIcon({ paused }) {
  return (
    <span
      className={[
        "mini-player__mask-icon",
        paused ? "mini-player__mask-icon--play" : "mini-player__mask-icon--pause",
      ].join(" ")}
      aria-hidden={true}
    />
  );
}

function SeekReplay15Icon() {
  return (
    <span className="mini-player__mask-icon mini-player__mask-icon--replay15" aria-hidden={true} />
  );
}

function SeekFwd30Icon() {
  return <span className="mini-player__mask-icon mini-player__mask-icon--fwd30" aria-hidden={true} />;
}

/** Fixed strip above `BottomNav` — Figma Miniplayer `19777:32024`. */
export default function MiniPlayer() {
  const navigate = useNavigate();
  const { session, miniPlayerVisible, togglePlayPause } = usePlayback();
  const { getEpisodeProgress, setEpisodeProgress } = usePodcastUserState();

  if (!miniPlayerVisible) {
    return null;
  }

  const { variant, title, subtitle, thumbnail, isPaused, fullPlayerPath } =
    session;

  const bumpPodcastProgressSeconds = (deltaSec) => {
    const episodeId = session.podcastEpisodeId;
    if (!episodeId) return;
    const bundle = findPodcastAndEpisode(episodeId);
    if (!bundle) return;
    const dur = approxDurationSecondsFromLabel(bundle.episode.duration);
    if (!(dur > 0)) return;
    const frac = getEpisodeProgress(episodeId, 0);
    const next01 = Math.min(1, Math.max(0, (frac * dur + deltaSec) / dur));
    setEpisodeProgress(episodeId, next01);
  };

  const openFullPlayer = () => {
    if (fullPlayerPath) {
      /** Skip guest full-screen preroll — only show that on tune-from-browse (play), not expand. */
      navigate(
        fullPlayerPath,
        {
          state: playOverDetailNavigateState({ expandFromMiniPlayer: true }),
        },
      );
    }
  };

  return (
    <aside
      className="mini-player"
      aria-label="Now playing"
      data-variant={variant}
    >
      <button
        type="button"
        className={[
          "mini-player__main",
          fullPlayerPath ? "" : "mini-player__main--no-fullscreen",
        ]
          .filter(Boolean)
          .join(" ")}
        onClick={openFullPlayer}
        aria-label={
          fullPlayerPath ? "Open full player" : "Currently playing preview"
        }
      >
        <div className="mini-player__thumb-wrap">
          {thumbnail ? (
            <img
              src={thumbnail}
              alt=""
              width={60}
              height={60}
              className="mini-player__thumb"
              loading="lazy"
              decoding="async"
            />
          ) : (
            <div className="mini-player__thumb mini-player__thumb--placeholder" aria-hidden={true} />
          )}
        </div>
        <div className="mini-player__text">
          <span
            className={[
              "mini-player__title",
              variant === "podcasts" ? "mini-player__title--podcast" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            {title}
          </span>
          <span className="mini-player__subtitle">{subtitle}</span>
        </div>
      </button>

      <div
        className={
          variant === "podcasts"
            ? "mini-player__controls mini-player__controls--podcast"
            : "mini-player__controls"
        }
        role="group"
        aria-label="Playback"
      >
        {variant === "music" ? (
          <>
            <button
              type="button"
              className="mini-player__ctrl mini-player__ctrl--lg"
              onClick={(e) => {
                e.stopPropagation();
                togglePlayPause();
              }}
              aria-label={isPaused ? "Play" : "Pause"}
            >
              <PlayPauseIcon paused={isPaused} />
            </button>
            <MusicSkipButton size="mini" onClick={(e) => e.stopPropagation()} />
          </>
        ) : null}

        {variant === "podcasts" ? (
          <>
            <button
              type="button"
              className="mini-player__ctrl mini-player__ctrl--sm mini-player__ctrl--seek"
              onClick={(e) => {
                e.stopPropagation();
                bumpPodcastProgressSeconds(-15);
              }}
              aria-label="Back 15 seconds"
            >
              <SeekReplay15Icon />
            </button>
            <button
              type="button"
              className="mini-player__ctrl mini-player__ctrl--lg"
              onClick={(e) => {
                e.stopPropagation();
                togglePlayPause();
              }}
              aria-label={isPaused ? "Play" : "Pause"}
            >
              <PlayPauseIcon paused={isPaused} />
            </button>
            <button
              type="button"
              className="mini-player__ctrl mini-player__ctrl--sm mini-player__ctrl--seek"
              onClick={(e) => {
                e.stopPropagation();
                bumpPodcastProgressSeconds(30);
              }}
              aria-label="Forward 30 seconds"
            >
              <SeekFwd30Icon />
            </button>
          </>
        ) : null}

        {variant === "radio" ? (
          <button
            type="button"
            className="mini-player__ctrl mini-player__ctrl--lg"
            onClick={(e) => {
              e.stopPropagation();
              togglePlayPause();
            }}
            aria-label={isPaused ? "Play" : "Pause"}
          >
            <PlayPauseIcon paused={isPaused} />
          </button>
        ) : null}
      </div>
    </aside>
  );
}
