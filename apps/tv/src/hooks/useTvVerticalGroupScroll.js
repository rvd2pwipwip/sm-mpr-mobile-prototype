import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

/**
 * Valid translateY range where `groupEl` is fully inside the vertical scrollport.
 * @returns {{ min: number, max: number } | null}
 */
function getFullyVisibleOffsetRange(groupEl, viewportHeight) {
  if (!groupEl || viewportHeight <= 0) return null;

  const groupTop = groupEl.offsetTop;
  const groupHeight = groupEl.offsetHeight;
  const groupBottom = groupTop + groupHeight;

  const min = Math.max(0, groupBottom - viewportHeight);
  const max = groupTop;

  if (groupHeight > viewportHeight) {
    return { min, max: min };
  }

  if (min > max) {
    return { min, max: min };
  }

  return { min, max };
}

function isOffsetFullyVisible(offsetY, range) {
  return offsetY >= range.min && offsetY <= range.max;
}

/** Nudge offset into range with the smallest change possible. */
function reclampOffset(currentOffset, range, maxOffset) {
  if (isOffsetFullyVisible(currentOffset, range)) {
    return currentOffset;
  }
  if (currentOffset < range.min) {
    return Math.min(range.min, maxOffset);
  }
  if (currentOffset > range.max) {
    return Math.max(range.max, 0);
  }
  return currentOffset;
}

/**
 * Vertical parking for TV Home — scroll only when the focused row is not fully visible.
 *
 * @param {number} focusedGroupIndex
 * @param {{ landingGroupIndex?: number }} [options]
 */
export function useTvVerticalGroupScroll(
  focusedGroupIndex,
  { landingGroupIndex } = {},
) {
  const viewportRef = useRef(null);
  const innerRef = useRef(null);
  const groupRefs = useRef([]);
  const offsetYRef = useRef(0);
  const prevGroupRef = useRef(focusedGroupIndex);
  const isLaunchRef = useRef(true);
  const [offsetY, setOffsetY] = useState(0);
  const [transitionEnabled, setTransitionEnabled] = useState(false);

  useEffect(() => {
    offsetYRef.current = offsetY;
  }, [offsetY]);

  const registerGroupRef = useCallback((groupIndex, node) => {
    groupRefs.current[groupIndex] = node;
  }, []);

  const applyOffset = useCallback((nextOffset) => {
    if (nextOffset !== offsetYRef.current) {
      setOffsetY(nextOffset);
    }
  }, []);

  const measureAndPark = useCallback(
    (options = {}) => {
      const { focusChanged = false } = options;
      const viewport = viewportRef.current;
      const inner = innerRef.current;
      const groupEl = groupRefs.current[focusedGroupIndex];

      if (!viewport || !inner) return;

      const viewportHeight = viewport.clientHeight;
      if (viewportHeight <= 0) return;

      const maxOffset = Math.max(0, inner.scrollHeight - viewportHeight);

      if (
        isLaunchRef.current &&
        landingGroupIndex != null &&
        focusedGroupIndex === landingGroupIndex
      ) {
        applyOffset(0);
        return;
      }

      if (!groupEl) {
        return;
      }

      const range = getFullyVisibleOffsetRange(groupEl, viewportHeight);
      if (!range) return;

      const currentOffset = offsetYRef.current;

      if (!focusChanged) {
        applyOffset(reclampOffset(currentOffset, range, maxOffset));
        return;
      }

      if (isOffsetFullyVisible(currentOffset, range)) {
        return;
      }

      const movingDown = focusedGroupIndex > prevGroupRef.current;
      let nextOffset = currentOffset;

      if (movingDown) {
        nextOffset = Math.max(currentOffset, range.min);
        nextOffset = Math.min(nextOffset, range.max, maxOffset);
      } else {
        nextOffset = range.min;
        nextOffset = Math.min(nextOffset, maxOffset);
      }

      applyOffset(nextOffset);
    },
    [applyOffset, focusedGroupIndex, landingGroupIndex],
  );

  useLayoutEffect(() => {
    const focusChanged = prevGroupRef.current !== focusedGroupIndex;
    if (focusChanged) {
      isLaunchRef.current = false;
    }
    measureAndPark({ focusChanged });
    prevGroupRef.current = focusedGroupIndex;
  }, [measureAndPark, focusedGroupIndex]);

  useLayoutEffect(() => {
    const viewport = viewportRef.current;
    const inner = innerRef.current;
    if (!viewport || !inner) return undefined;

    const observer = new ResizeObserver(() => {
      measureAndPark({ focusChanged: false });
    });

    observer.observe(viewport);
    observer.observe(inner);
    groupRefs.current.forEach((node) => {
      if (node) observer.observe(node);
    });

    return () => observer.disconnect();
  }, [measureAndPark]);

  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      setTransitionEnabled(true);
    });
    return () => cancelAnimationFrame(frameId);
  }, []);

  const innerClassName = [
    "tv-home__scroll-inner",
    transitionEnabled ? "tv-home__scroll-inner--animated" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return {
    viewportRef,
    innerRef,
    registerGroupRef,
    offsetY,
    innerClassName,
  };
}
