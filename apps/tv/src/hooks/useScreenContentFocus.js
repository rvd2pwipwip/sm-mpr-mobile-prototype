import { useCallback, useEffect, useLayoutEffect, useMemo, useRef } from "react";
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
export function useScreenContentFocus(
  screenId,
  {
    groupCount = 1,
    itemCount = 1,
    itemCounts,
    swimlaneGroups = [],
    defaultGroupIndex = 0,
    navEnterEnabled = true,
  } = {},
) {
  useContentFocusGroups(groupCount);

  const swimlaneGroupSet = useMemo(
    () => new Set(swimlaneGroups),
    [swimlaneGroups],
  );

  const getItemCount = useCallback(
    (groupIndex) => itemCounts?.[groupIndex] ?? itemCount,
    [itemCounts, itemCount],
  );

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
    rememberNavContentFocus,
    consumeNavContentRestore,
  } = useTvNavFocus();

  const focusedGroupIndex = getFocusedGroupIndex(defaultGroupIndex);
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
      itemRefs.current[groupIndex]?.[index]?.focus({ preventScroll: true });
    },
    [],
  );

  const syncDomFocus = useCallback(() => {
    if (focusZone !== FOCUS_ZONE_CONTENT) return;
    const max = Math.max(0, getItemCount(focusedGroupIndex) - 1);
    const index = Math.min(focusedIndex, max);
    focusItem(focusedGroupIndex, index);
  }, [focusZone, focusedGroupIndex, focusedIndex, getItemCount, focusItem]);

  useEffect(() => {
    const max = Math.max(0, getItemCount(focusedGroupIndex) - 1);
    if (focusedIndex > max) {
      setFocusedIndex(focusedGroupIndex, max);
    }
  }, [focusedIndex, focusedGroupIndex, getItemCount, setFocusedIndex]);

  const enterNavFromContent = useCallback(() => {
    rememberNavContentFocus({
      groupIndex: focusedGroupIndex,
      itemIndex: memory.groupItemIndexes?.[focusedGroupIndex] ?? 0,
    });
    enterNav();
  }, [
    focusedGroupIndex,
    memory.groupItemIndexes,
    rememberNavContentFocus,
    enterNav,
  ]);

  useLayoutEffect(() => {
    if (focusZone !== FOCUS_ZONE_CONTENT) return;

    const snapshot = consumeNavContentRestore();
    if (snapshot) {
      setFocusedGroupIndex(snapshot.groupIndex);
      setField("groupItemIndexes", {
        ...(memory.groupItemIndexes ?? {}),
        [snapshot.groupIndex]: snapshot.itemIndex,
      });
      focusItem(snapshot.groupIndex, snapshot.itemIndex);
      return;
    }

    syncDomFocus();
    const frameId = requestAnimationFrame(syncDomFocus);
    return () => cancelAnimationFrame(frameId);
  }, [
    focusZone,
    consumeNavContentRestore,
    setFocusedGroupIndex,
    memory.groupItemIndexes,
    setField,
    focusItem,
    syncDomFocus,
  ]);

  const handleMoveUp = useCallback(() => {
    if (focusZone === FOCUS_ZONE_NAV) return;
    if (focusedGroupIndex === 0) {
      if (navEnterEnabled) {
        enterNavFromContent();
      }
      return;
    }
    moveFocusUp(focusedGroupIndex, setFocusedGroupIndex);
  }, [
    focusZone,
    focusedGroupIndex,
    navEnterEnabled,
    enterNavFromContent,
    moveFocusUp,
    setFocusedGroupIndex,
  ]);

  const handleMoveDown = useCallback(() => {
    if (focusZone === FOCUS_ZONE_NAV) return;
    moveFocusDown(focusedGroupIndex, setFocusedGroupIndex);
  }, [focusZone, focusedGroupIndex, moveFocusDown, setFocusedGroupIndex]);

  // Vertical nav at window level so Up/Down work even when DOM focus was not restored
  // (horizontal swimlane keys already use window listeners; L/R do not need a focused node).
  useEffect(() => {
    if (focusZone !== FOCUS_ZONE_CONTENT) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "ArrowUp") {
        event.preventDefault();
        event.stopPropagation();
        handleMoveUp();
        return;
      }
      if (event.key === "ArrowDown") {
        event.preventDefault();
        event.stopPropagation();
        handleMoveDown();
      }
    };

    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [focusZone, handleMoveUp, handleMoveDown]);

  const handleMoveLeft = useCallback(() => {
    if (focusZone !== FOCUS_ZONE_CONTENT) return;
    if (swimlaneGroupSet.has(focusedGroupIndex)) return;
    if (focusedIndex === 0) {
      if (navEnterEnabled) {
        enterNavFromContent();
      }
      return;
    }
    setFocusedIndex(focusedGroupIndex, focusedIndex - 1);
  }, [
    focusZone,
    focusedIndex,
    focusedGroupIndex,
    swimlaneGroupSet,
    navEnterEnabled,
    enterNavFromContent,
    setFocusedIndex,
  ]);

  const handleMoveRight = useCallback(() => {
    if (focusZone !== FOCUS_ZONE_CONTENT) return;
    if (swimlaneGroupSet.has(focusedGroupIndex)) return;
    const max = getItemCount(focusedGroupIndex) - 1;
    if (focusedIndex >= max) return;
    setFocusedIndex(focusedGroupIndex, focusedIndex + 1);
  }, [
    focusZone,
    focusedIndex,
    focusedGroupIndex,
    swimlaneGroupSet,
    getItemCount,
    setFocusedIndex,
  ]);

  const registerItemRef = useCallback(
    (groupIndex, index, node) => {
      if (!itemRefs.current[groupIndex]) {
        itemRefs.current[groupIndex] = [];
      }
      itemRefs.current[groupIndex][index] = node;

      if (
        focusZone === FOCUS_ZONE_CONTENT &&
        groupIndex === focusedGroupIndex &&
        index === focusedIndex &&
        node &&
        document.activeElement !== node
      ) {
        node.focus({ preventScroll: true });
      }
    },
    [focusZone, focusedGroupIndex, focusedIndex],
  );

  const isContentGroupActive = (groupIndex) =>
    focusZone === FOCUS_ZONE_CONTENT && focusedGroupIndex === groupIndex;

  const getItemFocusIndex = useCallback(
    (groupIndex) => memory.groupItemIndexes?.[groupIndex] ?? 0,
    [memory.groupItemIndexes],
  );

  return {
    focusZone,
    focusedGroupIndex,
    focusedIndex,
    getItemFocusIndex,
    enterContent,
    enterNavFromContent,
    setFocusedIndex,
    handleMoveUp,
    handleMoveDown,
    handleMoveLeft,
    handleMoveRight,
    registerItemRef,
    isContentGroupActive,
    isItemFocused: (groupIndex, index) =>
      isContentGroupActive(groupIndex) &&
      getItemFocusIndex(groupIndex) === index,
  };
}
