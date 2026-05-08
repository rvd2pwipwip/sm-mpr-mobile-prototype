import { SWIMLANE_CARD_MAX } from "../constants/swimlane";
import "./ContentSwimlane.css";

/**
 * Horizontal swimlane: inset row title + “More”, full-bleed scroll with inner gutters.
 * Pass card components as children (see `App.jsx`). Touch-oriented; no web a11y extras.
 *
 * **More button:** If `sourceCount` is set, it shows when `sourceCount > maxVisible` unless
 * `alwaysShowMore` is true (e.g. Listen again — full list / clear history). If `sourceCount`
 * is omitted, `showMore` is used (default true).
 *
 * @param {{
 *   title: string,
 *   children: import("react").ReactNode,
 *   showMore?: boolean,
 *   onMore?: () => void,
 *   maxVisible?: number,
 *   sourceCount?: number,
 *   alwaysShowMore?: boolean,
 * }} props
 */
export default function ContentSwimlane({
  title,
  children,
  showMore = true,
  onMore,
  maxVisible = SWIMLANE_CARD_MAX,
  sourceCount,
  alwaysShowMore = false,
}) {
  const showMoreButton = alwaysShowMore
    ? true
    : sourceCount !== undefined
      ? sourceCount > maxVisible
      : showMore;

  return (
    <section className="content-swimlane">
      <div className="content-swimlane__header">
        <h2 className="content-swimlane__title">{title}</h2>
        {showMoreButton ? (
          <button
            type="button"
            className="content-swimlane__more"
            onClick={onMore}
            aria-label={`More in ${title}`}
          >
            More
          </button>
        ) : null}
      </div>
      <div className="content-swimlane__scroll">
        <div className="content-swimlane__scroll-inner">{children}</div>
      </div>
    </section>
  );
}
