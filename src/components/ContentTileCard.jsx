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
 * }} props
 */
export default function ContentTileCard({ title, subtitle, imageUrl, onSelect }) {
  return (
    <div className="content-tile" onClick={onSelect}>
      <div className="content-tile__media">
        <img
          className="content-tile__img"
          src={imageUrl}
          alt=""
          loading="lazy"
          decoding="async"
          width={175}
          height={175}
        />
      </div>
      <div className="content-tile__body">
        <span className="content-tile__title">{title}</span>
        {subtitle ? (
          <span className="content-tile__subtitle">{subtitle}</span>
        ) : null}
      </div>
    </div>
  );
}
