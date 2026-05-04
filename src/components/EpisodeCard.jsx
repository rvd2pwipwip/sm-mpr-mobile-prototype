/**
 * Horizontal episode row — Figma Episode Card (`19586:136643`). Tap body opens play route;
 * icon buttons bookmark / offline without navigating.
 */

import "./EpisodeCard.css";

function BookmarkSvg({ filled }) {
  return (
    <svg
      className="episode-card__glyph"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      aria-hidden={true}
    >
      <path
        d="M8 5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v16l-4-3.2L8 21V5Z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Download (+ arrow): “not downloaded” indicator. */
function DownloadSvg() {
  return (
    <svg
      className="episode-card__glyph"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      aria-hidden={true}
    >
      <circle
        cx="12"
        cy="12"
        r="9.25"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M12 7v7.5m0 0-2.75-2.75M12 14.5l2.75-2.75"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.5 16.25h7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** “Remove offline” mirror of Figma `clear`. */
function RemoveOfflineSvg() {
  return (
    <svg
      className="episode-card__glyph"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      aria-hidden={true}
    >
      <circle
        cx="12"
        cy="12"
        r="9.25"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <path
        d="M9 9l6 6M15 9l-6 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
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
            <BookmarkSvg filled={isBookmarked} />
          </button>
          <button
            type="button"
            data-episode-card-action="true"
            className="episode-card__icon-btn episode-card__icon-btn--offline"
            aria-label={downloadLabel}
            aria-pressed={isDownloaded}
            onClick={(e) => {
              e.stopPropagation();
              onToggleDownload();
            }}
          >
            {isDownloaded ? <RemoveOfflineSvg /> : <DownloadSvg />}
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
