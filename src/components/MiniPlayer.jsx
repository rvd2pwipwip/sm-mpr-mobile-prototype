import { useNavigate } from "react-router-dom";
import { usePlayback } from "../context/PlaybackContext";
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

function SkipIcon() {
  return <span className="mini-player__mask-icon mini-player__mask-icon--skip" aria-hidden={true} />;
}

/** Circular seek icons — Figma `replay15` / `fwd30`; simple inline SVG for prototype. */
function SeekRewind15Icon() {
  return (
    <svg className="mini-player__svg-icon" viewBox="0 0 40 40" aria-hidden={true}>
      <path
        fill="currentColor"
        d="M20 9a11 11 0 0 1 7.8 3.2 11 11 0 0 1 0 15.6 11 11 0 0 1-15.6 0L9.5 27l1.4-1.4 2.1 2.1a9 9 0 1 0 .3-12.7l1.7-1.7A11 11 0 0 1 20 9z"
      />
      <text
        x="20"
        y="24"
        textAnchor="middle"
        fontSize="10"
        fontWeight="600"
        fill="currentColor"
        fontFamily="system-ui,sans-serif"
      >
        15
      </text>
    </svg>
  );
}

function SeekForward30Icon() {
  return (
    <svg className="mini-player__svg-icon" viewBox="0 0 40 40" aria-hidden={true}>
      <path
        fill="currentColor"
        d="M20 9a11 11 0 0 0-7.8 3.2 11 11 0 0 0 15.6 15.6A11 11 0 0 0 28 27l-1.4-1.4-2.1 2.1a9 9 0 1 1-.3-12.7l-1.7-1.7A11 11 0 0 0 20 9z"
      />
      <text
        x="20"
        y="24"
        textAnchor="middle"
        fontSize="10"
        fontWeight="600"
        fill="currentColor"
        fontFamily="system-ui,sans-serif"
      >
        30
      </text>
    </svg>
  );
}

/** Fixed strip above `BottomNav` — Figma Miniplayer `19777:32024`. */
export default function MiniPlayer() {
  const navigate = useNavigate();
  const { session, miniPlayerVisible, togglePlayPause } = usePlayback();

  if (!miniPlayerVisible) {
    return null;
  }

  const { variant, title, subtitle, thumbnail, isPaused, fullPlayerPath } = session;

  const openFullPlayer = () => {
    if (fullPlayerPath) navigate(fullPlayerPath);
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
            <button
              type="button"
              className="mini-player__ctrl mini-player__ctrl--sm"
              onClick={(e) => {
                e.stopPropagation();
              }}
              aria-label="Skip forward"
            >
              <SkipIcon />
            </button>
          </>
        ) : null}

        {variant === "podcasts" ? (
          <>
            <button
              type="button"
              className="mini-player__ctrl mini-player__ctrl--sm mini-player__ctrl--seek"
              onClick={(e) => e.stopPropagation()}
              aria-label="Back 15 seconds"
            >
              <SeekRewind15Icon />
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
              onClick={(e) => e.stopPropagation()}
              aria-label="Forward 30 seconds"
            >
              <SeekForward30Icon />
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
