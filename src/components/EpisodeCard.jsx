/**
 * Horizontal episode row — Figma Episode Card (`19586:136643`). Tap body opens play route;
 * icon buttons bookmark / offline without navigating.
 */

import "./EpisodeCard.css";

/** `public/bookmarkEpisode.svg`, `unbookmarkEpisode.svg`, `downloadEpisode.svg`, `clearDownloadedEpisode.svg` — mask + `currentColor`. */
export function EpisodeActionIconMask({ variant }) {
  return (
    <span
      className={[
        "episode-card__action-icon-mask",
        `episode-card__action-icon-mask--${variant}`,
      ].join(" ")}
      aria-hidden={true}
    />
  );
}

/** @typedef {import("../data/podcasts.js").PodcastEpisode} PodcastEpisode */

/**
 * @param {{
 *   episode: PodcastEpisode,
 *   isBookmarked: boolean,
 *   isDownloaded: boolean,
 *   progressFraction: number,
 *   onNavigate: () => void,
 *   onToggleBookmark: () => void,
 *   onToggleDownload: () => void,
 *   onStubResumeToggle?: () => void,
 * }} props
 */
export default function EpisodeCard({
  episode,
  isBookmarked,
  isDownloaded,
  progressFraction,
  onNavigate,
  onToggleBookmark,
  onToggleDownload,
  onStubResumeToggle,
}) {
  const p =
    typeof progressFraction === "number" && !Number.isNaN(progressFraction)
      ? Math.min(1, Math.max(0, progressFraction))
      : 0;
  const inProgress = p > 0 && p < 1;
  const complete = p >= 1;

  /** Status dot — Figma variants: new accent, muted played / in‑progress ring, filled when finished. */
  let dotMods = "";
  if (complete) {
    dotMods = " episode-card__dot--complete";
  } else if (inProgress || !episode.isNew) {
    dotMods = " episode-card__dot--muted";
  } else {
    dotMods = " episode-card__dot--accent";
  }

  const metaLine = `${episode.releaseDate} - ${episode.duration}`;

  const onCardNavigate = (e) => {
    const t = /** @type {HTMLElement} */ (e.target);
    if (t.closest("[data-episode-card-action]")) {
      return;
    }
    onNavigate();
  };

  const onCardKeyDown = (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    if (document.activeElement?.closest("[data-episode-card-action]")) return;
    e.preventDefault();
    onNavigate();
  };

  const downloadLabel = isDownloaded
    ? "Remove download"
    : "Mark downloaded (stub)";
  const bookmarkLabel = isBookmarked ? "Remove bookmark" : "Bookmark episode";

  return (
    <article
      className="episode-card"
      role="button"
      tabIndex={0}
      onClick={onCardNavigate}
      onKeyDown={onCardKeyDown}
      aria-label={`Play episode: ${episode.title}`}
    >
      <div className="episode-card__top">
        <div className="episode-card__thumb-wrap">
          <img
            className="episode-card__thumb"
            src={episode.thumbnail}
            alt=""
            width={62}
            height={62}
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="episode-card__icon-actions">
          <button
            type="button"
            data-episode-card-action="true"
            className={`episode-card__icon-btn episode-card__icon-btn--bookmark ${
              isBookmarked ? "episode-card__icon-btn--bookmark-active" : ""
            }`}
            aria-label={bookmarkLabel}
            aria-pressed={isBookmarked}
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmark();
            }}
          >
            <EpisodeActionIconMask
              variant={isBookmarked ? "unbookmark-episode" : "bookmark-episode"}
            />
          </button>
          <button
            type="button"
            data-episode-card-action="true"
            className={`episode-card__icon-btn episode-card__icon-btn--offline ${
              isDownloaded ? "episode-card__icon-btn--download-active" : ""
            }`}
            aria-label={downloadLabel}
            aria-pressed={isDownloaded}
            onClick={(e) => {
              e.stopPropagation();
              onToggleDownload();
            }}
          >
            <EpisodeActionIconMask
              variant={
                isDownloaded ? "clear-downloaded-episode" : "download-episode"
              }
            />
          </button>
        </div>
      </div>

      <h3 className="episode-card__title">{episode.title}</h3>

      <div className="episode-card__meta">
        <span
          className={`episode-card__dot${dotMods}`}
          aria-hidden={true}
        />
        <p className="episode-card__meta-line">{metaLine}</p>
      </div>

      <div
        className={`episode-card__progress-wrap ${
          inProgress ? "episode-card__progress-wrap--visible" : ""
        }`}
      >
        <div className="episode-card__progress-track">
          <div
            className="episode-card__progress-fill"
            style={{ transform: `scaleX(${inProgress ? p : 0})` }}
          />
        </div>
      </div>

      {onStubResumeToggle ? (
        <button
          type="button"
          data-episode-card-action="true"
          className="episode-card__stub-resume"
          onClick={(e) => {
            e.stopPropagation();
            onStubResumeToggle();
          }}
        >
          {inProgress ? "Clear stub progress" : "Stub resume (~35%)"}
        </button>
      ) : null}
    </article>
  );
}
