import KeyboardWrapper from "../focus/KeyboardWrapper.jsx";
import FocusableButton from "../focus/FocusableButton.jsx";
import TvEpisodeActionIcon from "../podcasts/TvEpisodeActionIcon.jsx";
import "../podcasts/TvEpisodeSurfaceShared.css";
import "./TvPodcastPlayerBookmarkButton.css";

export default function TvPodcastPlayerBookmarkButton({
  isBookmarked = false,
  focused = false,
  registerItemRef,
  groupIndex,
  itemIndex,
  onToggleBookmark,
  onMoveUp,
  onMoveDown,
  onMoveLeft,
  onMoveRight,
}) {
  return (
    <KeyboardWrapper
      ref={(node) => registerItemRef(groupIndex, itemIndex, node)}
      onSelect={onToggleBookmark}
      onUp={onMoveUp}
      onDown={onMoveDown}
      onLeft={onMoveLeft}
      onRight={onMoveRight}
    >
      {(focusProps) => (
        <FocusableButton
          {...focusProps}
          type="button"
          className={[
            "tv-podcast-bookmark-btn",
            isBookmarked ? "tv-podcast-bookmark-btn--active" : "",
          ].join(" ")}
          focused={focused}
          aria-label={isBookmarked ? "Remove bookmark" : "Bookmark episode"}
          aria-pressed={isBookmarked}
        >
          <TvEpisodeActionIcon
            variant={
              isBookmarked ? "unbookmark-episode" : "bookmark-episode"
            }
          />
        </FocusableButton>
      )}
    </KeyboardWrapper>
  );
}
