import KeyboardWrapper from "../focus/KeyboardWrapper.jsx";
import FocusableButton from "../focus/FocusableButton.jsx";
import { useGuestMusicSkips } from "../../context/GuestMusicSkipContext.jsx";
import "./TvMusicSkipButton.css";

export default function TvMusicSkipButton({
  focused = false,
  registerItemRef,
  groupIndex,
  itemIndex,
  onMoveUp,
  onMoveDown,
  onMoveLeft,
  onMoveRight,
}) {
  const {
    guestActiveSkipCount,
    consumeGuestMusicSkip,
    guestMusicMaxActiveSkips,
  } = useGuestMusicSkips();

  const badgeCount = guestActiveSkipCount;
  const showBadge = badgeCount > 0;
  const ariaLabel =
    showBadge && guestMusicMaxActiveSkips != null
      ? `Skip forward, ${badgeCount} of ${guestMusicMaxActiveSkips} hourly skips in use`
      : "Skip forward";

  return (
    <KeyboardWrapper
      ref={(node) => registerItemRef(groupIndex, itemIndex, node)}
      onSelect={() => consumeGuestMusicSkip()}
      onUp={onMoveUp}
      onDown={onMoveDown}
      onLeft={onMoveLeft}
      onRight={onMoveRight}
    >
      {(focusProps) => (
        <FocusableButton
          {...focusProps}
          type="button"
          className="tv-music-skip-btn"
          focused={focused}
          aria-label={ariaLabel}
        >
          <span className="tv-music-skip-btn__wrap">
            <span className="tv-music-skip-btn__icon" aria-hidden={true} />
            {showBadge ? (
              <span className="tv-music-skip-btn__badge" aria-hidden={true}>
                {badgeCount}
              </span>
            ) : null}
          </span>
        </FocusableButton>
      )}
    </KeyboardWrapper>
  );
}
