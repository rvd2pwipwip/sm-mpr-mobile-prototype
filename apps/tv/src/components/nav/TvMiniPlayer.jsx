import { forwardRef } from "react";
import FocusableButton from "../focus/FocusableButton.jsx";
import "./TvMiniPlayer.css";

/**
 * Left-nav now playing strip — Figma menuMiniPlayer `15521:27316`.
 * Focus uses shared `--tv-focus-ring-*` (not Figma container border).
 */
const TvMiniPlayer = forwardRef(function TvMiniPlayer(
  {
    expanded = false,
    focused = false,
    variant = "music",
    playing = true,
    thumbnail,
    title,
    subtitle,
    className = "",
    onKeyDown,
    onClick,
    ...rest
  },
  ref,
) {
  const rootClass = [
    "tv-mini-player",
    expanded ? "tv-mini-player--expanded" : "tv-mini-player--collapsed",
    variant === "podcasts" ? "tv-mini-player--podcasts" : "",
    variant === "radio" ? "tv-mini-player--radio" : "",
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
      ref={ref}
      focused={focused}
      className={rootClass}
      onKeyDown={onKeyDown}
      onClick={onClick}
      aria-label={
        label
          ? `Now playing: ${label}. Open full player.`
          : "Open full player"
      }
      data-variant={variant}
      {...rest}
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
});

export default TvMiniPlayer;
