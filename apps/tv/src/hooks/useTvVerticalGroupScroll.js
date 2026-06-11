import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { useOptionalScreenMemory } from "../context/ScreenMemoryContext.jsx";
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
 *   screenId?: string,
 *   scrollEnabled?: boolean,
 * }} [options]
 */
export function useTvVerticalGroupScroll(
  focusedGroupIndex,
  {
    landingGroupIndex,
    lastFocusableGroupIndex,
    firstFocusableGroupIndex = 0,
    getFocusedElement,
    screenId,
    scrollEnabled = true,
  } = {},
) {
  const { memory, persistField } = useOptionalScreenMemory(screenId);
  const initialOffsetY = scrollEnabled ? (memory.scrollOffsetY ?? 0) : 0;
  const initialParkLineY = scrollEnabled ? (memory.parkLineY ?? null) : null;
  const hasPersistedVisit =
    scrollEnabled &&
    (initialOffsetY > 0 ||
      (initialParkLineY != null &&
        landingGroupIndex != null &&
        focusedGroupIndex !== landingGroupIndex));

  const viewportRef = useRef(null);
  const innerRef = useRef(null);
  const groupRefs = useRef([]);
  const offsetYRef = useRef(initialOffsetY);
  const prevGroupRef = useRef(focusedGroupIndex);
  const isLaunchRef = useRef(!hasPersistedVisit);
  const needsRestoreParkRef = useRef(hasPersistedVisit);
  const parkLineYRef = useRef(initialParkLineY);
  const getFocusedElementRef = useRef(getFocusedElement);

  const [offsetY, setOffsetY] = useState(initialOffsetY);
  const [transitionEnabled, setTransitionEnabled] = useState(false);
  const transitionScheduledRef = useRef(false);

  getFocusedElementRef.current = getFocusedElement;

  const scheduleScrollTransition = useCallback(() => {
    if (transitionScheduledRef.current) return;
    transitionScheduledRef.current = true;
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setTransitionEnabled(true);
      });
    });
  }, []);

  useEffect(() => {
    offsetYRef.current = offsetY;
  }, [offsetY]);

  const registerGroupRef = useCallback((groupIndex, node) => {
    groupRefs.current[groupIndex] = node;
  }, []);

  const applyOffset = useCallback(
    (nextOffset) => {
      if (nextOffset !== offsetYRef.current) {
        setOffsetY(nextOffset);
        if (screenId) {
          persistField("scrollOffsetY", nextOffset);
        }
      }
    },
    [screenId, persistField],
  );

  const captureParkLineIfNeeded = useCallback(
    (focusEl, viewport) => {
      if (parkLineYRef.current != null) {
        scheduleScrollTransition();
        return true;
      }
      const parkY = measureParkLineY(focusEl, viewport);
      if (parkY == null) return false;
      parkLineYRef.current = parkY;
      if (screenId) {
        persistField("parkLineY", parkY);
      }
      scheduleScrollTransition();
      return true;
    },
    [screenId, persistField, scheduleScrollTransition],
  );

  const measureAndPark = useCallback(
    (options = {}) => {
      if (!scrollEnabled) return;

      const { focusChanged = false, restoreVisit = false } = options;
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

      if (restoreVisit) {
        const ringTopContent = getFocusRingTopInContent(
          focusEl,
          viewport,
          currentOffset,
        );
        const parkedOffset = clampScrollOffsetY(
          calcParkedScrollOffsetY(ringTopContent, parkLineY),
          maxOffsetY,
        );
        const nextOffset =
          currentOffset > 0
            ? clampScrollOffsetY(currentOffset, maxOffsetY)
            : parkedOffset;
        applyOffset(nextOffset);
        return;
      }
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
      scrollEnabled,
    ],
  );

  useLayoutEffect(() => {
    if (!scrollEnabled) return undefined;

    const focusChanged = prevGroupRef.current !== focusedGroupIndex;
    const restoreVisit = needsRestoreParkRef.current;
    if (focusChanged) {
      isLaunchRef.current = false;
    }
    measureAndPark({ focusChanged, restoreVisit });
    if (restoreVisit) {
      needsRestoreParkRef.current = false;
    }
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
  }, [measureAndPark, focusedGroupIndex, scrollEnabled]);

  useLayoutEffect(() => {
    if (!scrollEnabled) return undefined;

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
  }, [measureAndPark, scrollEnabled]);

  const innerClassName = [
    "tv-home__scroll-inner",
    scrollEnabled && transitionEnabled ? "tv-home__scroll-inner--animated" : "",
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
