import FocusableButton from "../focus/FocusableButton.jsx";
import KeyboardWrapper from "../focus/KeyboardWrapper.jsx";
import TvEpisodeActionIcon from "./TvEpisodeActionIcon.jsx";
import { EPISODE_FOCUS_SLOTS } from "./episodeFocusSlots.js";

/**
 * Bookmark + download controls shared by episode list row and episode card.
 */
export default function TvEpisodeActionButtons({
  groupIndex,
  focusedIndex = 0,
  focused = false,
  isBookmarked = false,
  isDownloaded = false,
  registerItemRef,
  onMoveUp,
  onMoveDown,
  onMoveLeft,
  onMoveRight,
  onToggleBookmark,
  onToggleDownload,
  actionClassName = "tv-episode-surface__action",
  activeClassName = "tv-episode-surface__action--active",
}) {
  const bookmarkFocused =
    focused && focusedIndex === EPISODE_FOCUS_SLOTS.bookmark;
  const downloadFocused =
    focused && focusedIndex === EPISODE_FOCUS_SLOTS.download;

  return (
    <>
      <KeyboardWrapper
        ref={(node) =>
          registerItemRef?.(groupIndex, EPISODE_FOCUS_SLOTS.bookmark, node)
        }
        onSelect={onToggleBookmark}
        onUp={onMoveUp}
        onDown={onMoveDown}
        onLeft={onMoveLeft}
        onRight={onMoveRight}
      >
        {(focusProps) => (
          <FocusableButton
            {...focusProps}
            focused={bookmarkFocused}
            className={[
              actionClassName,
              isBookmarked ? activeClassName : "",
            ].join(" ")}
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

      <KeyboardWrapper
        ref={(node) =>
          registerItemRef?.(groupIndex, EPISODE_FOCUS_SLOTS.download, node)
        }
        onSelect={onToggleDownload}
        onUp={onMoveUp}
        onDown={onMoveDown}
        onLeft={onMoveLeft}
        onRight={onMoveRight}
      >
        {(focusProps) => (
          <FocusableButton
            {...focusProps}
            focused={downloadFocused}
            className={[
              actionClassName,
              isDownloaded ? activeClassName : "",
            ].join(" ")}
            aria-label={
              isDownloaded ? "Remove download" : "Mark downloaded (stub)"
            }
            aria-pressed={isDownloaded}
          >
            <TvEpisodeActionIcon
              variant={
                isDownloaded
                  ? "clear-downloaded-episode"
                  : "download-episode"
              }
            />
          </FocusableButton>
        )}
      </KeyboardWrapper>
    </>
  );
}
