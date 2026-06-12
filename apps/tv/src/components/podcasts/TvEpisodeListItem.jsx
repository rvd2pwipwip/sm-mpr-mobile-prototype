import FocusableButton from "../focus/FocusableButton.jsx";
import KeyboardWrapper from "../focus/KeyboardWrapper.jsx";
import TvEpisodeActionButtons from "./TvEpisodeActionButtons.jsx";
import { EPISODE_FOCUS_SLOTS } from "./episodeFocusSlots.js";
import { getEpisodeProgressDisplay } from "./tvEpisodeDisplay.js";
import "./TvEpisodeSurfaceShared.css";
import "./TvEpisodeListItem.css";

/** @deprecated Use `EPISODE_FOCUS_SLOTS` from `episodeFocusSlots.js`. */
export const EPISODE_ROW_SLOT = EPISODE_FOCUS_SLOTS;

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
  const { p, inProgress, dotModifier } = getEpisodeProgressDisplay(
    episode,
    progressFraction,
  );

  const bodyFocused = focused && focusedIndex === EPISODE_FOCUS_SLOTS.body;

  return (
    <article
      className={[
        "tv-episode-list-item",
        focused ? "tv-episode-list-item--group-focused" : "",
      ].join(" ")}
    >
      <KeyboardWrapper
        ref={(node) =>
          registerItemRef?.(groupIndex, EPISODE_FOCUS_SLOTS.body, node)
        }
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
                <span
                  className={[
                    "tv-episode-surface__dot",
                    `tv-episode-surface__dot--${dotModifier}`,
                  ].join(" ")}
                  aria-hidden={true}
                />
                <span className="tv-episode-list-item__meta-line">
                  {episode.releaseDate} - {episode.duration}
                </span>
              </span>
              {inProgress ? (
                <span className="tv-episode-surface__progress-track">
                  <span
                    className="tv-episode-surface__progress-fill"
                    style={{ transform: `scaleX(${p})` }}
                  />
                </span>
              ) : null}
            </span>
          </FocusableButton>
        )}
      </KeyboardWrapper>

      <div className="tv-episode-list-item__actions">
        <TvEpisodeActionButtons
          groupIndex={groupIndex}
          focusedIndex={focusedIndex}
          focused={focused}
          isBookmarked={isBookmarked}
          isDownloaded={isDownloaded}
          registerItemRef={registerItemRef}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
          onMoveLeft={onMoveLeft}
          onMoveRight={onMoveRight}
          onToggleBookmark={onToggleBookmark}
          onToggleDownload={onToggleDownload}
        />
      </div>
    </article>
  );
}
