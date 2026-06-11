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
    onKeyDown,
    onClick,
  },
  ref,
) {
  const [imageLoaded, setImageLoaded] = useState(true);

  useEffect(() => {
    setImageLoaded(true);
  }, [imageUrl]);

  const showImage = Boolean(imageUrl) && imageLoaded;

  const thumbWrapClass = [
    "tv-content-tile__thumb-wrap",
    focused ? "tv-content-tile__thumb-wrap--focused" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const thumbnailClass = [
    "tv-content-tile__thumbnail",
    playing ? "tv-content-tile__thumbnail--playing" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      ref={ref}
      className="tv-content-tile"
      tabIndex={-1}
      onKeyDown={onKeyDown}
      onClick={onClick}
      role="button"
    >
      <div className={thumbWrapClass}>
        <div className={thumbnailClass}>
        {showImage ? (
          <img
            className="tv-content-tile__img"
            src={imageUrl}
            alt=""
            width={308}
            height={308}
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
      <p className="tv-content-tile__title">{title}</p>
    </div>
  );
});

export default ContentTileCard;
