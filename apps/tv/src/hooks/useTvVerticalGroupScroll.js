import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  calcParkedScrollOffsetY,
  clampScrollOffsetY,
  getFocusRingTopInContent,
  getFocusRingTopInScrollport,
  getVerticalScrollMetrics,
  measureParkLineY,
} from "../utils/tvFocusGeometry.js";

const PARK_LINE_EPSILON_PX = 1;

function isElementInScrollInner(focusEl, innerEl) {
  return Boolean(focusEl && innerEl && innerEl.contains(focusEl));
}

/**
 * Vertical parked-focus scroll (VariableSwimlane pattern on Y).
 * Keeps the focused control's ring top on a fixed park line while content scrolls,
 * until top/bottom end conditions release the ring.
 *
 * @param {number} focusedGroupIndex
 * @param {{
 *   landingGroupIndex?: number,
 *   lastFocusableGroupIndex?: number,
 *   firstFocusableGroupIndex?: number,
 *   getFocusedElement?: () => HTMLElement | null,
 * }} [options]
 */
export function useTvVerticalGroupScroll(
  focusedGroupIndex,
  {
    landingGroupIndex,
    lastFocusableGroupIndex,
    firstFocusableGroupIndex = 0,
    getFocusedElement,
  } = {},
) {
  const viewportRef = useRef(null);
  const innerRef = useRef(null);
  const groupRefs = useRef([]);
  const offsetYRef = useRef(0);
  const prevGroupRef = useRef(focusedGroupIndex);
  const isLaunchRef = useRef(true);
  const parkLineYRef = useRef(null);
  const getFocusedElementRef = useRef(getFocusedElement);

  const [offsetY, setOffsetY] = useState(0);
  const [transitionEnabled, setTransitionEnabled] = useState(false);

  getFocusedElementRef.current = getFocusedElement;

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

  const captureParkLineIfNeeded = useCallback((focusEl, viewport) => {
    if (parkLineYRef.current != null) return true;
    const parkY = measureParkLineY(focusEl, viewport);
    if (parkY == null) return false;
    parkLineYRef.current = parkY;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setTransitionEnabled(true);
      });
    });
    return true;
  }, []);

  const measureAndPark = useCallback(
    (options = {}) => {
      const { focusChanged = false } = options;
      const viewport = viewportRef.current;
      const inner = innerRef.current;
      const focusEl = getFocusedElementRef.current?.() ?? null;

      if (!viewport || !inner) return;

      const currentOffset = offsetYRef.current;
      const metrics = getVerticalScrollMetrics(viewport, inner, currentOffset);
      const { maxOffsetY, minOffsetForBottomEnd } = metrics;
      const atBottomEnd = currentOffset >= minOffsetForBottomEnd - PARK_LINE_EPSILON_PX;
      const atTopEnd = currentOffset <= 0;

      const onLanding =
        landingGroupIndex != null &&
        focusedGroupIndex === landingGroupIndex &&
        isLaunchRef.current;

      if (onLanding) {
        applyOffset(0);
        if (isElementInScrollInner(focusEl, inner)) {
          captureParkLineIfNeeded(focusEl, viewport);
        }
        return;
      }

      if (!isElementInScrollInner(focusEl, inner)) {
        return;
      }

      if (!captureParkLineIfNeeded(focusEl, viewport)) {
        return;
      }

      const parkLineY = parkLineYRef.current;
      const ringTopContent = getFocusRingTopInContent(
        focusEl,
        viewport,
        currentOffset,
      );
      const parkedOffset = clampScrollOffsetY(
        calcParkedScrollOffsetY(ringTopContent, parkLineY),
        maxOffsetY,
      );
      const ringTopScrollport = getFocusRingTopInScrollport(focusEl, viewport);
      const isLastGroup =
        lastFocusableGroupIndex != null &&
        focusedGroupIndex >= lastFocusableGroupIndex;
      const isFirstGroup = focusedGroupIndex <= firstFocusableGroupIndex;

      if (!focusChanged) {
        let nextOffset = clampScrollOffsetY(currentOffset, maxOffsetY);
        if (atBottomEnd) {
          nextOffset = Math.max(
            nextOffset,
            Math.min(minOffsetForBottomEnd, maxOffsetY),
          );
        }
        applyOffset(nextOffset);
        return;
      }

      const movingDown = focusedGroupIndex > prevGroupRef.current;
      const movingUp = focusedGroupIndex < prevGroupRef.current;

      if (movingDown) {
        if (atBottomEnd) {
          return;
        }

        let nextOffset = Math.max(currentOffset, parkedOffset);

        if (isLastGroup) {
          nextOffset = Math.max(nextOffset, minOffsetForBottomEnd);
        } else {
          nextOffset = Math.min(nextOffset, minOffsetForBottomEnd);
        }

        applyOffset(clampScrollOffsetY(nextOffset, maxOffsetY));
        return;
      }

      if (movingUp) {
        if (atTopEnd && isFirstGroup) {
          return;
        }

        if (
          atBottomEnd &&
          ringTopScrollport > parkLineY + PARK_LINE_EPSILON_PX
        ) {
          return;
        }

        let nextOffset = Math.min(currentOffset, parkedOffset);
        if (atTopEnd) {
          nextOffset = 0;
        }

        applyOffset(clampScrollOffsetY(nextOffset, maxOffsetY));
      }
    },
    [
      applyOffset,
      captureParkLineIfNeeded,
      firstFocusableGroupIndex,
      focusedGroupIndex,
      landingGroupIndex,
      lastFocusableGroupIndex,
    ],
  );

  useLayoutEffect(() => {
    const focusChanged = prevGroupRef.current !== focusedGroupIndex;
    if (focusChanged) {
      isLaunchRef.current = false;
    }
    measureAndPark({ focusChanged });
    prevGroupRef.current = focusedGroupIndex;

    let frameId2;
    const frameId = requestAnimationFrame(() => {
      measureAndPark({ focusChanged: false });
      frameId2 = requestAnimationFrame(() => {
        measureAndPark({ focusChanged: false });
      });
    });
    return () => {
      cancelAnimationFrame(frameId);
      if (frameId2 != null) cancelAnimationFrame(frameId2);
    };
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

/** Alias for the parked-focus contract (same hook). */
export { useTvVerticalGroupScroll as useTvVerticalParkedScroll };
