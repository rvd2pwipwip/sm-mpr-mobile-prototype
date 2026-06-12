import FocusableButton from "../focus/FocusableButton.jsx";
import KeyboardWrapper from "../focus/KeyboardWrapper.jsx";
import TvEpisodeActionButtons from "./TvEpisodeActionButtons.jsx";
import { EPISODE_FOCUS_SLOTS } from "./episodeFocusSlots.js";
import { getEpisodeProgressDisplay } from "./tvEpisodeDisplay.js";
import "./TvEpisodeSurfaceShared.css";
import "./TvEpisodeCard.css";

export { EPISODE_FOCUS_SLOTS };

/**
 * TV episode grid card — Figma `10841:24500` (~656px; 2-column library / browse grids).
 */
export default function TvEpisodeCard({
  episode,
  showTitle,
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
        "tv-episode-card",
        focused ? "tv-episode-card--group-focused" : "",
      ].join(" ")}
    >
      <div className="tv-episode-card__actions">
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
            className="tv-episode-card__body"
            aria-label={`Play episode: ${episode.title}`}
          >
            <span className="tv-episode-card__top">
              <img
                className="tv-episode-card__thumb"
                src={episode.thumbnail}
                alt=""
                width={100}
                height={100}
                decoding="async"
              />
            </span>

            {showTitle ? (
              <span className="tv-episode-card__show">{showTitle}</span>
            ) : null}

            <span className="tv-episode-card__title">{episode.title}</span>

            <span className="tv-episode-card__meta">
              <span
                className={[
                  "tv-episode-surface__dot",
                  `tv-episode-surface__dot--${dotModifier}`,
                ].join(" ")}
                aria-hidden={true}
              />
              <span className="tv-episode-card__meta-line">
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
          </FocusableButton>
        )}
      </KeyboardWrapper>
    </article>
  );
}
