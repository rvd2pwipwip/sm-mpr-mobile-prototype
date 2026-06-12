import KeyboardWrapper from "../focus/KeyboardWrapper.jsx";
import FocusableButton from "../focus/FocusableButton.jsx";
import "./TvPodcastPlayerSeekButton.css";

function SeekIcon({ variant }) {
  return (
    <span
      className={[
        "tv-podcast-seek-btn__icon",
        variant === "back"
          ? "tv-podcast-seek-btn__icon--back"
          : "tv-podcast-seek-btn__icon--forward",
      ].join(" ")}
      aria-hidden={true}
    />
  );
}

export default function TvPodcastPlayerSeekButton({
  variant = "back",
  focused = false,
  registerItemRef,
  groupIndex,
  itemIndex,
  onSelect,
  onMoveUp,
  onMoveDown,
  onMoveLeft,
  onMoveRight,
}) {
  const ariaLabel = variant === "back" ? "Back 15 seconds" : "Forward 30 seconds";

  return (
    <KeyboardWrapper
      ref={(node) => registerItemRef(groupIndex, itemIndex, node)}
      onSelect={onSelect}
      onUp={onMoveUp}
      onDown={onMoveDown}
      onLeft={onMoveLeft}
      onRight={onMoveRight}
    >
      {(focusProps) => (
        <FocusableButton
          {...focusProps}
          type="button"
          className="tv-podcast-seek-btn"
          focused={focused}
          aria-label={ariaLabel}
        >
          <SeekIcon variant={variant} />
        </FocusableButton>
      )}
    </KeyboardWrapper>
  );
}
