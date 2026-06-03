import FocusableButton from "../focus/FocusableButton.jsx";
import KeyboardWrapper from "../focus/KeyboardWrapper.jsx";
import "./ChannelInfoDescription.css";

/**
 * Channel description — 3-line clamp; when truncated, a More control opens the full-text dialog.
 */
export default function ChannelInfoDescription({
  text,
  descriptionRef,
  overflows,
  groupIndex,
  focused = false,
  registerItemRef,
  onMoveUp,
  onMoveDown,
  onSelect,
}) {
  return (
    <div className="channel-info-description">
      <p
        ref={descriptionRef}
        className="channel-info-description__text channel-info-description__text--clamped"
      >
        {text}
      </p>

      {overflows ? (
        <KeyboardWrapper
          ref={(node) => registerItemRef?.(groupIndex, 0, node)}
          onSelect={onSelect}
          onUp={onMoveUp}
          onDown={onMoveDown}
        >
          {(focusProps) => (
            <FocusableButton
              {...focusProps}
              focused={focused}
              className="channel-info-description__more"
              aria-label="More channel description"
            >
              More
            </FocusableButton>
          )}
        </KeyboardWrapper>
      ) : null}
    </div>
  );
}
