import FocusableButton from "../focus/FocusableButton.jsx";
import KeyboardWrapper from "../focus/KeyboardWrapper.jsx";
import TvEpisodeActionButtons from "./TvEpisodeActionButtons.jsx";
import { EPISODE_FOCUS_SLOTS } from "./episodeFocusSlots.js";
import { getEpisodeProgressDisplay } from "./tvEpisodeDisplay.js";
import "./TvEpisodeSurfaceShared.css";
import "./TvEpisodeCard.css";

export { EPISODE_FOCUS_SLOTS };

/**
 * TV episode card — grid (`10841:24500`) or swimlane (`15802:26439`).
 */
export default function TvEpisodeCard({
  episode,
  showTitle,
  progressFraction = 0,
  isBookmarked = false,
  isDownloaded = false,
  variant = "default",
  focusProps,
  focused = false,
  groupIndex,
  focusedIndex = 0,
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

  const isSwimlane = variant === "swimlane";
  const bodyFocused =
    focused && (isSwimlane || focusedIndex === EPISODE_FOCUS_SLOTS.body);

  const textBlock = (
    <>
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
    </>
  );

  if (isSwimlane) {
    return (
      <FocusableButton
        {...focusProps}
        focused={bodyFocused}
        className={[
          "tv-episode-card",
          "tv-episode-card--swimlane",
          focused ? "tv-episode-card--group-focused" : "",
        ].join(" ")}
        aria-label={`Play episode: ${episode.title}`}
      >
        <div className="tv-episode-card__swimlane-shell">
          <div className="tv-episode-card__primary-row">
            <img
              className="tv-episode-card__thumb tv-episode-card__thumb--swimlane"
              src={episode.thumbnail}
              alt=""
              width={130}
              height={130}
              decoding="async"
            />
            <div className="tv-episode-card__titles">
              {showTitle ? (
                <span className="tv-episode-card__show tv-episode-card__show--swimlane">
                  {showTitle}
                </span>
              ) : null}
              <span className="tv-episode-card__title tv-episode-card__title--swimlane">
                {episode.title}
              </span>
            </div>
          </div>

          <div className="tv-episode-card__secondary-row">
            <span className="tv-episode-card__meta tv-episode-card__meta--swimlane">
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
            <span
              className={[
                "tv-episode-surface__progress-track",
                "tv-episode-card__progress-track--swimlane",
                inProgress
                  ? "tv-episode-card__progress-track--swimlane-active"
                  : "",
              ].join(" ")}
              aria-hidden={!inProgress}
            >
              <span
                className="tv-episode-surface__progress-fill"
                style={{ transform: `scaleX(${inProgress ? p : 0})` }}
              />
            </span>
          </div>
        </div>
      </FocusableButton>
    );
  }

  const bodyContent = (
    <>
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
      {textBlock}
    </>
  );

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
        {(wrapperFocusProps) => (
          <FocusableButton
            {...wrapperFocusProps}
            focused={bodyFocused}
            className="tv-episode-card__body"
            aria-label={`Play episode: ${episode.title}`}
          >
            {bodyContent}
          </FocusableButton>
        )}
      </KeyboardWrapper>
    </article>
  );
}
