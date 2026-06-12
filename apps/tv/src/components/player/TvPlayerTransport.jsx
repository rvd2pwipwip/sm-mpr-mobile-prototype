import KeyboardWrapper from "../focus/KeyboardWrapper.jsx";
import FocusableButton from "../focus/FocusableButton.jsx";
import "./TvPlayerTransport.css";

function TvPlayerPlayPauseIcon({ playing }) {
  return (
    <span
      className={[
        "tv-player-play-pause__icon",
        playing
          ? "tv-player-play-pause__icon--pause"
          : "tv-player-play-pause__icon--play",
      ].join(" ")}
      aria-hidden={true}
    />
  );
}

/**
 * TV player transport row — play/pause stays at the horizontal center of the bar
 * (mobile `music-player__transport` grid: 1fr | auto | 1fr). Reuse for music,
 * podcast, and radio full players.
 */
export default function TvPlayerTransport({
  playing = false,
  playPauseAriaLabel,
  playPauseFocused = false,
  registerPlayPauseRef,
  onTogglePlayPause,
  onMoveUp,
  onMoveDown,
  onMoveLeft,
  onMoveRight,
  startSlot = null,
  endSlot = null,
}) {
  return (
    <div className="tv-player-transport">
      <div className="tv-player-transport__start">
        <div className="tv-player-transport__start-cluster">{startSlot}</div>
      </div>

      <div className="tv-player-transport__middle">
        <KeyboardWrapper
          ref={registerPlayPauseRef}
          onSelect={onTogglePlayPause}
          onUp={onMoveUp}
          onDown={onMoveDown}
          onLeft={onMoveLeft}
          onRight={onMoveRight}
        >
          {(focusProps) => (
            <FocusableButton
              {...focusProps}
              type="button"
              className="tv-player-play-pause"
              focused={playPauseFocused}
              aria-label={playPauseAriaLabel}
            >
              <TvPlayerPlayPauseIcon playing={playing} />
            </FocusableButton>
          )}
        </KeyboardWrapper>
      </div>

      <div className="tv-player-transport__end">
        <div className="tv-player-transport__end-cluster">{endSlot}</div>
      </div>
    </div>
  );
}
