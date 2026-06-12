import KeyboardWrapper from "../focus/KeyboardWrapper.jsx";
import FocusableButton from "../focus/FocusableButton.jsx";
import TvPodcastPlayerBookmarkButton from "./TvPodcastPlayerBookmarkButton.jsx";
import TvPodcastPlayerSeekButton from "./TvPodcastPlayerSeekButton.jsx";
import TvPodcastPlayerSpeedButton from "./TvPodcastPlayerSpeedButton.jsx";
import "./TvPlayerTransport.css";
import "./TvPodcastPlayerTransport.css";

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

/** Podcast transport — one row, equal spacing between all five controls. */
export default function TvPodcastPlayerTransport({
  groupIndex,
  transportSlots,
  playing,
  speed,
  isBookmarked,
  isItemFocused,
  registerItemRef,
  onCycleSpeed,
  onSeekBack,
  onSeekForward,
  onTogglePlayPause,
  onToggleBookmark,
  onMoveUp,
  onMoveDown,
  onMoveLeft,
  onMoveRight,
}) {
  const { speed: speedSlot, seekBack, play, seekForward, bookmark } =
    transportSlots;

  return (
    <div className="tv-podcast-player-transport">
      <TvPodcastPlayerSpeedButton
        speed={speed}
        groupIndex={groupIndex}
        itemIndex={speedSlot}
        focused={isItemFocused(groupIndex, speedSlot)}
        registerItemRef={registerItemRef}
        onCycleSpeed={onCycleSpeed}
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        onMoveLeft={onMoveLeft}
        onMoveRight={onMoveRight}
      />

      <TvPodcastPlayerSeekButton
        variant="back"
        groupIndex={groupIndex}
        itemIndex={seekBack}
        focused={isItemFocused(groupIndex, seekBack)}
        registerItemRef={registerItemRef}
        onSelect={onSeekBack}
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        onMoveLeft={onMoveLeft}
        onMoveRight={onMoveRight}
      />

      <KeyboardWrapper
        ref={(node) => registerItemRef(groupIndex, play, node)}
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
            focused={isItemFocused(groupIndex, play)}
            aria-label={playing ? "Pause" : "Play"}
          >
            <TvPlayerPlayPauseIcon playing={playing} />
          </FocusableButton>
        )}
      </KeyboardWrapper>

      <TvPodcastPlayerSeekButton
        variant="forward"
        groupIndex={groupIndex}
        itemIndex={seekForward}
        focused={isItemFocused(groupIndex, seekForward)}
        registerItemRef={registerItemRef}
        onSelect={onSeekForward}
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        onMoveLeft={onMoveLeft}
        onMoveRight={onMoveRight}
      />

      <TvPodcastPlayerBookmarkButton
        isBookmarked={isBookmarked}
        groupIndex={groupIndex}
        itemIndex={bookmark}
        focused={isItemFocused(groupIndex, bookmark)}
        registerItemRef={registerItemRef}
        onToggleBookmark={onToggleBookmark}
        onMoveUp={onMoveUp}
        onMoveDown={onMoveDown}
        onMoveLeft={onMoveLeft}
        onMoveRight={onMoveRight}
      />
    </div>
  );
}
