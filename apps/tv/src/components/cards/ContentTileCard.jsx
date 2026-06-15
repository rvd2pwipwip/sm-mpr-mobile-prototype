import { forwardRef, useEffect, useState } from "react";
import "./ContentTileCard.css";

/**
 * TV square media tile — image + title. Presentational; D-pad wiring via FocusableTile.
 *
 * @param {{
 *   title: string,
 *   imageUrl: string,
 *   focused?: boolean,
 *   playing?: boolean,
 *   onKeyDown?: (event: React.KeyboardEvent) => void,
 *   onClick?: (event: React.MouseEvent) => void,
 * }} props
 */
const ContentTileCard = forwardRef(function ContentTileCard(
  {
    title,
    imageUrl,
    focused = false,
    playing = false,
    compact = false,
    ghost = false,
    onKeyDown,
    onClick,
  },
  ref,
) {
  const [imageLoaded, setImageLoaded] = useState(true);

  useEffect(() => {
    setImageLoaded(true);
  }, [imageUrl]);

  const showImage = Boolean(imageUrl) && imageLoaded && !ghost;
  const showTitle = !compact && !ghost && Boolean(title);

  const rootClass = [
    "tv-content-tile",
    compact ? "tv-content-tile--compact" : "",
    ghost ? "tv-content-tile--ghost" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const thumbWrapClass = [
    "tv-content-tile__thumb-wrap",
    focused ? "tv-content-tile__thumb-wrap--focused" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const thumbnailClass = [
    "tv-content-tile__thumbnail",
    playing ? "tv-content-tile__thumbnail--playing" : "",
    ghost ? "tv-content-tile__thumbnail--ghost" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      ref={ref}
      className={rootClass}
      tabIndex={ghost ? -1 : -1}
      onKeyDown={ghost ? undefined : onKeyDown}
      onClick={ghost ? undefined : onClick}
      role={ghost ? "presentation" : "button"}
      aria-hidden={ghost || undefined}
    >
      <div className={thumbWrapClass}>
        <div className={thumbnailClass}>
        {showImage ? (
          <img
            className="tv-content-tile__img"
            src={imageUrl}
            alt=""
            width={compact ? 192 : 308}
            height={compact ? 192 : 308}
            loading="lazy"
            decoding="async"
            onError={() => setImageLoaded(false)}
          />
        ) : null}
        {playing ? (
          <span className="tv-content-tile__playing" aria-label="Now playing">
            <span className="tv-content-tile__playing-bars" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
          </span>
        ) : null}
        </div>
      </div>
      {showTitle ? <p className="tv-content-tile__title">{title}</p> : null}
    </div>
  );
});

export default ContentTileCard;
