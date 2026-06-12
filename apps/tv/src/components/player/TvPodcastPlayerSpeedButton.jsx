import KeyboardWrapper from "../focus/KeyboardWrapper.jsx";
import FocusableButton from "../focus/FocusableButton.jsx";
import "./TvPodcastPlayerSpeedButton.css";

function formatSpeedLabel(value) {
  return `${value}x`;
}

export default function TvPodcastPlayerSpeedButton({
  speed = 1,
  focused = false,
  registerItemRef,
  groupIndex,
  itemIndex,
  onCycleSpeed,
  onMoveUp,
  onMoveDown,
  onMoveLeft,
  onMoveRight,
}) {
  return (
    <KeyboardWrapper
      ref={(node) => registerItemRef(groupIndex, itemIndex, node)}
      onSelect={onCycleSpeed}
      onUp={onMoveUp}
      onDown={onMoveDown}
      onLeft={onMoveLeft}
      onRight={onMoveRight}
    >
      {(focusProps) => (
        <FocusableButton
          {...focusProps}
          type="button"
          className="tv-podcast-speed-btn"
          focused={focused}
          aria-label={`Playback speed ${formatSpeedLabel(speed)}. Press to change speed`}
        >
          <span className="tv-podcast-speed-btn__label" aria-hidden={true}>
            {formatSpeedLabel(speed)}
          </span>
        </FocusableButton>
      )}
    </KeyboardWrapper>
  );
}
