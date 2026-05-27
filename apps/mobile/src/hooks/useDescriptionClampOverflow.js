import { useLayoutEffect, useRef, useState } from "react";

/**
 * Detects when a description `<p>` with `.music-info__description--clamped` is visually
 * truncated (needs a More… control). Only measures while `isClamped` is true; when expanded,
 * the last measured `overflows` value is kept so "Less" still works.
 *
 * @param {string} text Description string (dependency for re-measure when copy changes).
 * @param {boolean} isClamped `true` when the clamp CSS class is applied (collapsed).
 * @returns {{ ref: import("react").RefObject<HTMLParagraphElement | null>, overflows: boolean }}
 */
export function useDescriptionClampOverflow(text, isClamped) {
  const ref = useRef(/** @type {HTMLParagraphElement | null} */ (null));
  const [overflows, setOverflows] = useState(false);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !isClamped) {
      return undefined;
    }

    const measure = () => {
      const r = ref.current;
      if (!r) return;
      setOverflows(r.scrollHeight > r.clientHeight + 1);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [text, isClamped]);

  return { ref, overflows };
}
