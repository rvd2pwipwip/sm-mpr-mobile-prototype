import { useLayoutEffect, useRef, useState } from "react";

/**
 * Detects when a clamped description paragraph is visually truncated.
 *
 * @param {string} text Description copy (re-measure when it changes).
 * @param {boolean} isClamped Apply clamp styles while measuring.
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
      const node = ref.current;
      if (!node) return;
      setOverflows(node.scrollHeight > node.clientHeight + 1);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [text, isClamped]);

  return { ref, overflows };
}
