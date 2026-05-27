import { useGuestMusicSkips } from "../context/GuestMusicSkipContext";
import "./MusicSkipButton.css";

/**
 * Skip forward control with optional badge (guest hourly cap).
 * Sizes match `MiniPlayer` small ctrl vs `MusicPlayer` transport skip.
 */
export default function MusicSkipButton({ size = "full", onClick: onClickOuter }) {
  const { guestActiveSkipCount, consumeGuestMusicSkip, guestMusicMaxActiveSkips } =
    useGuestMusicSkips();

  const badgeCount = guestActiveSkipCount;
  const showBadge = badgeCount > 0;
  const ariaLabel =
    showBadge && guestMusicMaxActiveSkips != null
      ? `Skip forward, ${badgeCount} of ${guestMusicMaxActiveSkips} hourly skips in use`
      : "Skip forward";

  const handleClick = (e) => {
    onClickOuter?.(e);
    consumeGuestMusicSkip();
  };

  if (size === "mini") {
    return (
      <button
        type="button"
        className="mini-player__ctrl mini-player__ctrl--sm"
        onClick={handleClick}
        aria-label={ariaLabel}
      >
        <span className="music-skip-btn__wrap music-skip-btn__wrap--mini">
          <span className="mini-player__mask-icon mini-player__mask-icon--skip" aria-hidden={true} />
          {showBadge ? (
            <span className="music-skip-btn__badge music-skip-btn__badge--mini" aria-hidden={true}>
              {badgeCount}
            </span>
          ) : null}
        </span>
      </button>
    );
  }

  return (
    <button
      type="button"
      className="music-player__skip"
      onClick={handleClick}
      aria-label={ariaLabel}
    >
      <span className="music-skip-btn__wrap music-skip-btn__wrap--full">
        <span className="music-player__skip-icon" aria-hidden={true} />
        {showBadge ? (
          <span className="music-skip-btn__badge music-skip-btn__badge--full" aria-hidden={true}>
            {badgeCount}
          </span>
        ) : null}
      </span>
    </button>
  );
}
