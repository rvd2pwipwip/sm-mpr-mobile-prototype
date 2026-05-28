import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import { useFocusNavigation } from "../context/GroupFocusNavigationContext.jsx";
import { useScreenMemory } from "../context/ScreenMemoryContext.jsx";
import {
  FOCUS_ZONE_CONTENT,
  FOCUS_ZONE_NAV,
  useTvNavFocus,
} from "../context/TvNavFocusContext.jsx";
import { useContentFocusGroups } from "../hooks/useContentFocusGroups.js";

/**
 * Shared content-area focus helpers for a screen (Phase 1 demo rows).
 * Horizontal index is stored per screen so routes do not inherit each other's focus.
 */
export function useScreenContentFocus(screenId, { groupCount = 1, itemCount = 1 } = {}) {
  useContentFocusGroups(groupCount);

  const {
    memory,
    setField,
    getFocusedGroupIndex,
    setFocusedGroupIndex,
  } = useScreenMemory(screenId);

  const {
    moveFocusUp,
    moveFocusDown,
  } = useFocusNavigation();

  const {
    focusZone,
    enterNav,
    enterContent,
  } = useTvNavFocus();

  const focusedGroupIndex = getFocusedGroupIndex(0);
  const focusedIndex = memory.groupItemIndexes?.[focusedGroupIndex] ?? 0;

  const itemRefs = useRef([]);

  const setFocusedIndex = useCallback(
    (groupIndex, index) => {
      setField("groupItemIndexes", {
        ...(memory.groupItemIndexes ?? {}),
        [groupIndex]: index,
      });
    },
    [memory.groupItemIndexes, setField],
  );

  const focusItem = useCallback(
    (groupIndex, index) => {
      itemRefs.current[groupIndex]?.[index]?.focus();
    },
    [],
  );

  useEffect(() => {
    const max = Math.max(0, itemCount - 1);
    if (focusedIndex > max) {
      setFocusedIndex(focusedGroupIndex, max);
    }
  }, [focusedIndex, focusedGroupIndex, itemCount, setFocusedIndex]);

  useLayoutEffect(() => {
    if (focusZone !== FOCUS_ZONE_CONTENT) return;
    const index = Math.min(focusedIndex, Math.max(0, itemCount - 1));
    focusItem(focusedGroupIndex, index);
  }, [focusZone, focusedGroupIndex, focusedIndex, itemCount, focusItem]);

  const handleMoveUp = useCallback(() => {
    if (focusZone === FOCUS_ZONE_NAV) return;
    if (focusedGroupIndex === 0) {
      enterNav();
      return;
    }
    moveFocusUp(focusedGroupIndex, setFocusedGroupIndex);
  }, [
    focusZone,
    focusedGroupIndex,
    enterNav,
    moveFocusUp,
    setFocusedGroupIndex,
  ]);

  const handleMoveDown = useCallback(() => {
    if (focusZone === FOCUS_ZONE_NAV) return;
    moveFocusDown(focusedGroupIndex, setFocusedGroupIndex);
  }, [focusZone, focusedGroupIndex, moveFocusDown, setFocusedGroupIndex]);

  const handleMoveLeft = useCallback(() => {
    if (focusZone !== FOCUS_ZONE_CONTENT) return;
    if (focusedIndex === 0) {
      enterNav();
      return;
    }
    setFocusedIndex(focusedGroupIndex, focusedIndex - 1);
  }, [
    focusZone,
    focusedIndex,
    focusedGroupIndex,
    enterNav,
    setFocusedIndex,
  ]);

  const handleMoveRight = useCallback(() => {
    if (focusZone !== FOCUS_ZONE_CONTENT) return;
    const max = itemCount - 1;
    if (focusedIndex >= max) return;
    setFocusedIndex(focusedGroupIndex, focusedIndex + 1);
  }, [
    focusZone,
    focusedIndex,
    focusedGroupIndex,
    itemCount,
    setFocusedIndex,
  ]);

  const registerItemRef = useCallback((groupIndex, index, node) => {
    if (!itemRefs.current[groupIndex]) {
      itemRefs.current[groupIndex] = [];
    }
    itemRefs.current[groupIndex][index] = node;
  }, []);

  const isContentGroupActive = (groupIndex) =>
    focusZone === FOCUS_ZONE_CONTENT && focusedGroupIndex === groupIndex;

  return {
    focusZone,
    focusedGroupIndex,
    focusedIndex,
    enterContent,
    handleMoveUp,
    handleMoveDown,
    handleMoveLeft,
    handleMoveRight,
    registerItemRef,
    isContentGroupActive,
    isItemFocused: (groupIndex, index) =>
      isContentGroupActive(groupIndex) && focusedIndex === index,
  };
}
