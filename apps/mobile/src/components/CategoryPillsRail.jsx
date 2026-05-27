import { useLayoutEffect, useRef } from "react";
import {
  animateCategoryPillIntoScroll,
  CATEGORY_PILL_DATA_ATTR,
  snapCategoryPillIntoScroll,
} from "../utils/categoryRailPillScroll.js";

/**
 * Horizontal category pills for ContentSwimlane `categoryRail`.
 * Receives `categoriesScrollEl`, `categoryPillAlignKey`, `categoryRailTitleId` via ContentSwimlane cloneElement when wired that way.
 *
 * @param {{
 *   rows: { slug: string, label: string }[],
 *   selectedSlug: string,
 *   onSelect: (slug: string) => void,
 *   categoriesScrollEl?: HTMLElement | null,
 *   categoryPillAlignKey?: string | number,
 *   categoryRailTitleId?: string,
 *   radiogroupFallbackLabel?: string,
 * }} props
 */
export default function CategoryPillsRail({
  rows,
  selectedSlug,
  onSelect,
  categoriesScrollEl,
  categoryPillAlignKey,
  categoryRailTitleId,
  radiogroupFallbackLabel = "Categories",
}) {
  const cancelPillScrollRef = useRef(undefined);
  const prevAlignedSlugRef = useRef(undefined);

  function handlePillKeyDown(event, rowIndex) {
    const key = event.key;
    if (
      key !== "ArrowRight" &&
      key !== "ArrowLeft" &&
      key !== "Home" &&
      key !== "End"
    ) {
      return;
    }
    event.preventDefault();
    let nextIndex = rowIndex;
    if (key === "ArrowRight") {
      nextIndex = Math.min(rowIndex + 1, rows.length - 1);
    } else if (key === "ArrowLeft") {
      nextIndex = Math.max(rowIndex - 1, 0);
    } else if (key === "Home") {
      nextIndex = 0;
    } else if (key === "End") {
      nextIndex = rows.length - 1;
    }
    const next = rows[nextIndex];
    if (next) onSelect(next.slug);
  }

  useLayoutEffect(() => {
    if (categoriesScrollEl == null || categoryPillAlignKey === undefined) {
      return undefined;
    }

    cancelPillScrollRef.current?.();
    cancelPillScrollRef.current = undefined;

    const slug = String(categoryPillAlignKey);
    const prevSlug = prevAlignedSlugRef.current;
    const userChangedPill = prevSlug !== undefined && prevSlug !== slug;

    prevAlignedSlugRef.current = slug;

    if (!userChangedPill) {
      snapCategoryPillIntoScroll(categoriesScrollEl, slug, rows);
      return undefined;
    }

    cancelPillScrollRef.current = animateCategoryPillIntoScroll(
      categoriesScrollEl,
      slug,
      rows,
    );

    return () => {
      cancelPillScrollRef.current?.();
      cancelPillScrollRef.current = undefined;
    };
  }, [categoriesScrollEl, categoryPillAlignKey, rows]);

  const labelledBy =
    categoryRailTitleId != null && categoryRailTitleId !== ""
      ? categoryRailTitleId
      : undefined;

  return (
    <div
      role="radiogroup"
      className="content-swimlane__category-radiogroup"
      aria-labelledby={labelledBy}
      aria-label={labelledBy ? undefined : radiogroupFallbackLabel}
    >
      {rows.map((row, rowIndex) => (
        <button
          key={row.slug}
          type="button"
          role="radio"
          {...{ [CATEGORY_PILL_DATA_ATTR]: row.slug }}
          className={
            selectedSlug === row.slug
              ? "content-swimlane__category-pill content-swimlane__category-pill--active"
              : "content-swimlane__category-pill"
          }
          aria-checked={selectedSlug === row.slug}
          tabIndex={selectedSlug === row.slug ? 0 : -1}
          onKeyDown={(event) => handlePillKeyDown(event, rowIndex)}
          onClick={() => onSelect(row.slug)}
        >
          {row.label}
        </button>
      ))}
    </div>
  );
}
