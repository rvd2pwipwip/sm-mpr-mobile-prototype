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
 * **Category rail (variant):** When `categoryRail` is set, a horizontally scrolling pill row
 * renders between the header and the card scroller (`ContentSwimlane-category-rail-variant.md` Step A).
 *
 * **Trailing More card:** When `trailingMoreCard` is true and More would show (`sourceCount` vs
 * `maxVisible`, etc.), the header More button is hidden and a square **More** tile is appended
 * after `children` in the card scroller.
 *
 * @param {{
 *   title: string,
 *   children: import("react").ReactNode,
 *   showMore?: boolean,
 *   onMore?: () => void,
 *   maxVisible?: number,
 *   sourceCount?: number,
 *   alwaysShowMore?: boolean,
 *   categoryRail?: import("react").ReactNode,
 *   trailingMoreCard?: boolean,
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
  categoryRail,
  trailingMoreCard = false,
}) {
  const showMoreAffordance = alwaysShowMore
    ? true
    : sourceCount !== undefined
      ? sourceCount > maxVisible
      : showMore;

  const showHeaderMore = showMoreAffordance && !trailingMoreCard;
  const showTrailingMore = showMoreAffordance && trailingMoreCard;

  return (
    <section className="content-swimlane">
      <div className="content-swimlane__header">
        <h2 className="content-swimlane__title">{title}</h2>
        {showHeaderMore ? (
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
      {categoryRail != null ? (
        <div className="content-swimlane__categories-scroll">
          <div className="content-swimlane__categories-inner">
            {categoryRail}
          </div>
        </div>
      ) : null}
      <div className="content-swimlane__scroll">
        <div className="content-swimlane__scroll-inner">
          {children}
          {showTrailingMore ? (
            <button
              type="button"
              className="content-swimlane__more-card"
              onClick={onMore}
              aria-label={`More in ${title}`}
            >
              <span className="content-swimlane__more-card-media">More</span>
            </button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
