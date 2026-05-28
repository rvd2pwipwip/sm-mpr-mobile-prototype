import { useCallback, useEffect, useRef } from "react";
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
 */
export function useScreenContentFocus(screenId, { groupCount = 1, itemCount = 1 } = {}) {
  useContentFocusGroups(groupCount);

  const {
    getFocusedGroupIndex,
    setFocusedGroupIndex,
  } = useScreenMemory(screenId);

  const {
    moveFocusUp,
    moveFocusDown,
    getGroupFocusMemory,
    setGroupFocusMemory,
  } = useFocusNavigation();

  const {
    focusZone,
    enterNav,
    enterContent,
  } = useTvNavFocus();

  const focusedGroupIndex = getFocusedGroupIndex(0);
  const { focusedIndex } = getGroupFocusMemory(focusedGroupIndex);

  const itemRefs = useRef([]);

  const focusItem = useCallback(
    (groupIndex, index) => {
      itemRefs.current[groupIndex]?.[index]?.focus();
    },
    [],
  );

  useEffect(() => {
    if (focusZone !== FOCUS_ZONE_CONTENT) return;
    focusItem(focusedGroupIndex, focusedIndex);
  }, [focusZone, focusedGroupIndex, focusedIndex, focusItem]);

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
    const next = focusedIndex - 1;
    setGroupFocusMemory(focusedGroupIndex, {
      ...getGroupFocusMemory(focusedGroupIndex),
      focusedIndex: next,
    });
  }, [
    focusZone,
    focusedIndex,
    focusedGroupIndex,
    enterNav,
    setGroupFocusMemory,
    getGroupFocusMemory,
  ]);

  const handleMoveRight = useCallback(() => {
    if (focusZone !== FOCUS_ZONE_CONTENT) return;
    const max = itemCount - 1;
    if (focusedIndex >= max) return;
    const next = focusedIndex + 1;
    setGroupFocusMemory(focusedGroupIndex, {
      ...getGroupFocusMemory(focusedGroupIndex),
      focusedIndex: next,
    });
  }, [
    focusZone,
    focusedIndex,
    focusedGroupIndex,
    itemCount,
    setGroupFocusMemory,
    getGroupFocusMemory,
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
