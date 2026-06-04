import FocusableButton from "../focus/FocusableButton.jsx";
import "./TvMiniPlayer.css";

/**
 * Left-nav now playing strip — Figma menuMiniPlayer `15521:27316`.
 * Focus uses shared `--tv-focus-ring-*` (not Figma container border).
 */
export default function TvMiniPlayer({
  expanded = false,
  focused = false,
  playing = true,
  thumbnail,
  title,
  subtitle,
  className = "",
}) {
  const rootClass = [
    "tv-mini-player",
    expanded ? "tv-mini-player--expanded" : "tv-mini-player--collapsed",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const label = [title, subtitle].filter(Boolean).join(", ");
  const showPlayingOnThumb = !expanded && playing;

  const thumbClass = [
    "tv-mini-player__thumb",
    thumbnail ? "" : "tv-mini-player__thumb--placeholder",
    showPlayingOnThumb ? "tv-mini-player__thumb--playing" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <FocusableButton
      focused={focused}
      className={rootClass}
      aria-label={
        label
          ? `Now playing: ${label}. Open full player.`
          : "Open full player"
      }
    >
      <span className="tv-mini-player__inner">
        <span className="tv-mini-player__thumb-wrap">
          <span className={thumbClass}>
            {thumbnail ? (
              <img
                className="tv-mini-player__thumb-img"
                src={thumbnail}
                alt=""
                width={60}
                height={60}
                decoding="async"
              />
            ) : null}
            {showPlayingOnThumb ? (
              <span className="tv-mini-player__playing" aria-hidden={true}>
                <span className="tv-mini-player__playing-bars">
                  <span />
                  <span />
                  <span />
                </span>
              </span>
            ) : null}
          </span>
        </span>
        <span className="tv-mini-player__text" aria-hidden={!expanded}>
          <span className="tv-mini-player__title">{title}</span>
          <span className="tv-mini-player__artist">{subtitle}</span>
        </span>
      </span>
    </FocusableButton>
  );
}
