import "./ContentTileCard.css";

/**
 * Presentational swimlane tile: square cover + title + optional subtitle.
 * Mobile prototype: touch-only; no web a11y or keyboard affordances.
 *
 * @param {{
 *   title: string,
 *   subtitle?: string | null,
 *   imageUrl: string,
 *   onSelect?: () => void,
 *   compact?: boolean,
 *   ghost?: boolean,
 * }} props
 */
export default function ContentTileCard({
  title,
  subtitle,
  imageUrl,
  onSelect,
  compact = false,
  ghost = false,
}) {
  const rootClass = [
    "content-tile",
    compact ? "content-tile--compact" : "",
    ghost ? "content-tile--ghost" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const media = (
    <div className="content-tile__media">
      {!ghost ? (
        <img
          className="content-tile__img"
          src={imageUrl}
          alt=""
          loading="lazy"
          decoding="async"
          width={175}
          height={175}
        />
      ) : null}
    </div>
  );

  const showLabels = !compact && !ghost && (title || subtitle);

  const body = showLabels ? (
    <div className="content-tile__body">
      <span className="content-tile__title">{title}</span>
      {subtitle ? (
        <span className="content-tile__subtitle">{subtitle}</span>
      ) : null}
    </div>
  ) : null;

  if (ghost || !onSelect) {
    return (
      <div className={rootClass} aria-hidden={true}>
        {media}
        {body}
      </div>
    );
  }

  return (
    <button type="button" className={rootClass} onClick={onSelect}>
      {media}
      {body}
    </button>
  );
}
