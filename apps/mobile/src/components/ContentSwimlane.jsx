import {
  cloneElement,
  isValidElement,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { SWIMLANE_CARD_MAX } from "../constants/swimlane";
import "./ContentSwimlane.css";

/**
 * Horizontal swimlane: inset row title + More, full-bleed scroll with inner gutters.
 * Pass card components as children (see `App.jsx`). Touch-first prototype; light landmarks (`aria-labelledby` on section).
 *
 * **More placement (fixed rules):**
 * - **No `categoryRail`:** More is the **header** button (never a trailing tile). Same when
 *   `alwaysShowMore` is true (Listen again / history — full list affordance).
 * - **With `categoryRail`:** More is the **trailing** square tile after `children` (never
 *   the header button), when the More predicate passes and `alwaysShowMore` is false.
 *
 * **More predicate:** If `sourceCount` is set, More shows when `sourceCount > maxVisible` unless
 * `alwaysShowMore` is true. If `sourceCount` is omitted, `showMore` is used (default true).
 *
 * **Category rail (variant):** When `categoryRail` is set, a horizontally scrolling pill row
 * renders between the header and the card scroller (`ContentSwimlane-category-rail-variant.md` Step A).
 *
 * **Card scroller reset:** When `cardScrollerResetKey` changes, the horizontal card row scrolls
 * back to the start (category pill changes).
 *
 * **Category pill alignment:** When `categoryPillAlignKey` is set and `categoryRail` is a single
 * React element, props `categoriesScrollEl`, `categoryPillAlignKey`, and `categoryRailTitleId`
 * are merged into it so the rail can scroll the active pill into view (see `ContentSwimlane-category-rail-variant.md` Step E).
 * When `categoryRail` is a valid element, `categoryRailTitleId` is always merged for Step F labeling (clone runs without `categoryPillAlignKey` too).
 * @param {{
 *   title: string,
 *   children: import("react").ReactNode,
 *   showMore?: boolean,
 *   onMore?: () => void,
 *   maxVisible?: number,
 *   sourceCount?: number,
 *   alwaysShowMore?: boolean,
 *   categoryRail?: import("react").ReactNode,
 *   cardScrollerResetKey?: string | number,
 *   categoryPillAlignKey?: string | number,
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
  cardScrollerResetKey,
  categoryPillAlignKey,
}) {
  const titleId = useId();
  const cardScrollRef = useRef(null);
  const [categoriesScrollEl, setCategoriesScrollEl] = useState(null);

  useLayoutEffect(() => {
    if (cardScrollerResetKey === undefined) return;
    const el = cardScrollRef.current;
    if (el) el.scrollLeft = 0;
  }, [cardScrollerResetKey]);

  const hasCategoryRail = categoryRail != null;

  const showMoreAffordance = alwaysShowMore
    ? true
    : sourceCount !== undefined
      ? sourceCount > maxVisible
      : showMore;

  const showHeaderMore =
    showMoreAffordance && (!hasCategoryRail || alwaysShowMore);
  const showTrailingMore =
    showMoreAffordance && hasCategoryRail && !alwaysShowMore;

  return (
    <section className="content-swimlane" aria-labelledby={titleId}>
      <div className="content-swimlane__header">
        <h2 id={titleId} className="content-swimlane__title">
          {title}
        </h2>
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
        <div
          ref={setCategoriesScrollEl}
          className="content-swimlane__categories-scroll"
        >
          <div className="content-swimlane__categories-inner">
            {isValidElement(categoryRail)
              ? cloneElement(categoryRail, {
                  categoriesScrollEl,
                  ...(categoryPillAlignKey !== undefined
                    ? { categoryPillAlignKey }
                    : {}),
                  categoryRailTitleId: titleId,
                })
              : categoryRail}
          </div>
        </div>
      ) : null}
      <div ref={cardScrollRef} className="content-swimlane__scroll">
        <div className="content-swimlane__scroll-inner">
          {children}
          {showTrailingMore ? (
            <button
              type="button"
              className="content-swimlane__more-card"
              onClick={onMore}
              aria-label={`More in ${title}`}
            >
              <span className="content-swimlane__more-card-media" aria-hidden={true}>
                More
              </span>
            </button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
