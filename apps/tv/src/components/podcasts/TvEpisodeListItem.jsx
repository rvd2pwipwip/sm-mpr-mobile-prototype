import FocusableButton from "../focus/FocusableButton.jsx";
import KeyboardWrapper from "../focus/KeyboardWrapper.jsx";
import TvEpisodeActionIcon from "./TvEpisodeActionIcon.jsx";
import "./TvEpisodeListItem.css";

export const EPISODE_ROW_SLOT = {
  body: 0,
  bookmark: 1,
  download: 2,
};

/**
 * TV episode list row — Figma `7545:22722` (Podcast Info).
 */
export default function TvEpisodeListItem({
  episode,
  progressFraction = 0,
  isBookmarked = false,
  isDownloaded = false,
  groupIndex,
  focusedIndex = 0,
  focused = false,
  registerItemRef,
  onMoveUp,
  onMoveDown,
  onMoveLeft,
  onMoveRight,
  onPlay,
  onToggleBookmark,
  onToggleDownload,
}) {
  const p =
    typeof progressFraction === "number" && !Number.isNaN(progressFraction)
      ? Math.min(1, Math.max(0, progressFraction))
      : 0;
  const inProgress = p > 0 && p < 1;
  const complete = p >= 1;

  let dotClass = "tv-episode-list-item__dot";
  if (complete) {
    dotClass += " tv-episode-list-item__dot--complete";
  } else if (inProgress || !episode.isNew) {
    dotClass += " tv-episode-list-item__dot--muted";
  } else {
    dotClass += " tv-episode-list-item__dot--accent";
  }

  const rowFocused = focused;
  const bodyFocused = rowFocused && focusedIndex === EPISODE_ROW_SLOT.body;
  const bookmarkFocused =
    rowFocused && focusedIndex === EPISODE_ROW_SLOT.bookmark;
  const downloadFocused =
    rowFocused && focusedIndex === EPISODE_ROW_SLOT.download;

  return (
    <article
      className={[
        "tv-episode-list-item",
        rowFocused ? "tv-episode-list-item--group-focused" : "",
      ].join(" ")}
    >
      <KeyboardWrapper
        ref={(node) => registerItemRef?.(groupIndex, EPISODE_ROW_SLOT.body, node)}
        onSelect={onPlay}
        onUp={onMoveUp}
        onDown={onMoveDown}
        onRight={onMoveRight}
        onLeft={onMoveLeft}
      >
        {(focusProps) => (
          <FocusableButton
            {...focusProps}
            focused={bodyFocused}
            className="tv-episode-list-item__body"
            aria-label={`Play episode: ${episode.title}`}
          >
            <span className="tv-episode-list-item__thumb-wrap">
              <img
                className="tv-episode-list-item__thumb"
                src={episode.thumbnail}
                alt=""
                width={120}
                height={120}
                decoding="async"
              />
            </span>
            <span className="tv-episode-list-item__text">
              <span className="tv-episode-list-item__title">{episode.title}</span>
              <span className="tv-episode-list-item__meta">
                <span className={dotClass} aria-hidden={true} />
                <span className="tv-episode-list-item__meta-line">
                  {episode.releaseDate} - {episode.duration}
                </span>
              </span>
              {inProgress ? (
                <span className="tv-episode-list-item__progress-track">
                  <span
                    className="tv-episode-list-item__progress-fill"
                    style={{ transform: `scaleX(${p})` }}
                  />
                </span>
              ) : null}
            </span>
          </FocusableButton>
        )}
      </KeyboardWrapper>

      <div className="tv-episode-list-item__actions">
        <KeyboardWrapper
          ref={(node) =>
            registerItemRef?.(groupIndex, EPISODE_ROW_SLOT.bookmark, node)
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
                "tv-episode-list-item__action",
                isBookmarked ? "tv-episode-list-item__action--active" : "",
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
            registerItemRef?.(groupIndex, EPISODE_ROW_SLOT.download, node)
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
                "tv-episode-list-item__action",
                isDownloaded ? "tv-episode-list-item__action--active" : "",
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
      </div>
    </article>
  );
}
