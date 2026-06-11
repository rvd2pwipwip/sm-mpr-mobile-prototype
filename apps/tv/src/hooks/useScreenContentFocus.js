import { useCallback, useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { useFocusNavigation } from "../context/GroupFocusNavigationContext.jsx";
import { useScreenMemory } from "../context/ScreenMemoryContext.jsx";
import {
  FOCUS_ZONE_CONTENT,
  FOCUS_ZONE_NAV,
  useTvNavFocus,
} from "../context/TvNavFocusContext.jsx";
import { isBroadCatalogScope } from "@sm-mpr/shared/constants/catalogScope.js";
import { useTerritory } from "../context/TerritoryContext.jsx";
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
    defaultItemIndex = 0,
    navEnterEnabled = true,
    contentKeysEnabled = true,
    suspendDomFocus = false,
    resolveMoveDown,
    resolveMoveUp,
  } = {},
) {
  const { catalogScope } = useTerritory();
  const navActive = navEnterEnabled && isBroadCatalogScope(catalogScope);

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
  const focusedIndex =
    memory.groupItemIndexes?.[focusedGroupIndex] ?? defaultItemIndex;

  const itemRefs = useRef([]);
  const landingSeededRef = useRef(false);

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

  // First visit to this screen: persist landing group + item (first card, first row).
  useLayoutEffect(() => {
    if (landingSeededRef.current) return;
    if (memory.focusedGroupIndex !== undefined) {
      landingSeededRef.current = true;
      return;
    }
    landingSeededRef.current = true;
    setFocusedGroupIndex(defaultGroupIndex);
    setField("groupItemIndexes", {
      ...(memory.groupItemIndexes ?? {}),
      [defaultGroupIndex]: defaultItemIndex,
    });
  }, [
    memory.focusedGroupIndex,
    memory.groupItemIndexes,
    defaultGroupIndex,
    defaultItemIndex,
    setFocusedGroupIndex,
    setField,
  ]);

  const enterNavFromContent = useCallback(() => {
    if (!navActive) return;
    rememberNavContentFocus({
      groupIndex: focusedGroupIndex,
      itemIndex: memory.groupItemIndexes?.[focusedGroupIndex] ?? 0,
    });
    enterNav();
  }, [
    navActive,
    focusedGroupIndex,
    memory.groupItemIndexes,
    rememberNavContentFocus,
    enterNav,
  ]);

  useLayoutEffect(() => {
    if (suspendDomFocus) return;
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
    const frameId = requestAnimationFrame(() => {
      syncDomFocus();
      requestAnimationFrame(syncDomFocus);
    });
    return () => cancelAnimationFrame(frameId);
  }, [
    suspendDomFocus,
    focusZone,
    consumeNavContentRestore,
    setFocusedGroupIndex,
    memory.groupItemIndexes,
    setField,
    focusItem,
    syncDomFocus,
    focusedGroupIndex,
    focusedIndex,
  ]);

  const handleMoveUp = useCallback(() => {
    if (focusZone === FOCUS_ZONE_NAV) return;
    const resolved = resolveMoveUp?.(focusedGroupIndex);
    if (resolved != null) {
      setFocusedGroupIndex(resolved);
      return;
    }
    if (focusedGroupIndex === 0) return;
    moveFocusUp(focusedGroupIndex, setFocusedGroupIndex);
  }, [
    focusZone,
    focusedGroupIndex,
    resolveMoveUp,
    setFocusedGroupIndex,
    moveFocusUp,
  ]);

  const handleMoveDown = useCallback(() => {
    if (focusZone === FOCUS_ZONE_NAV) return;
    const resolved = resolveMoveDown?.(focusedGroupIndex);
    if (resolved != null) {
      setFocusedGroupIndex(resolved);
      return;
    }
    moveFocusDown(focusedGroupIndex, setFocusedGroupIndex);
  }, [
    focusZone,
    focusedGroupIndex,
    resolveMoveDown,
    setFocusedGroupIndex,
    moveFocusDown,
  ]);

  const handleMoveLeft = useCallback(() => {
    if (focusZone !== FOCUS_ZONE_CONTENT) return;
    if (swimlaneGroupSet.has(focusedGroupIndex)) return;
    if (focusedIndex === 0) {
      if (navActive) {
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
    navActive,
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

  // Vertical nav at window level so Up/Down work even when DOM focus was not restored.
  // Horizontal L/R for non-swimlane rows (e.g. Channel Info related grid): move focus, no parking.
  // Swimlane groups keep their own window listeners (Fixed/VariableSwimlane).
  useEffect(() => {
    if (!contentKeysEnabled) return undefined;
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
        return;
      }
      if (swimlaneGroupSet.has(focusedGroupIndex)) return;
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        event.stopPropagation();
        handleMoveLeft();
        return;
      }
      if (event.key === "ArrowRight") {
        event.preventDefault();
        event.stopPropagation();
        handleMoveRight();
      }
    };

    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [
    contentKeysEnabled,
    focusZone,
    focusedGroupIndex,
    swimlaneGroupSet,
    handleMoveUp,
    handleMoveDown,
    handleMoveLeft,
    handleMoveRight,
  ]);

  const registerItemRef = useCallback(
    (groupIndex, index, node) => {
      if (!itemRefs.current[groupIndex]) {
        itemRefs.current[groupIndex] = [];
      }
      itemRefs.current[groupIndex][index] = node;

      if (suspendDomFocus) return;

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
    [focusZone, focusedGroupIndex, focusedIndex, suspendDomFocus],
  );

  const isContentGroupActive = (groupIndex) =>
    focusZone === FOCUS_ZONE_CONTENT && focusedGroupIndex === groupIndex;

  const getItemFocusIndex = useCallback(
    (groupIndex) => memory.groupItemIndexes?.[groupIndex] ?? 0,
    [memory.groupItemIndexes],
  );

  const getItemElement = useCallback(
    (groupIndex, index) => itemRefs.current[groupIndex]?.[index] ?? null,
    [],
  );

  return {
    focusZone,
    focusedGroupIndex,
    focusedIndex,
    getItemFocusIndex,
    getItemElement,
    enterContent,
    enterNavFromContent,
    setFocusedIndex,
    setFocusedGroupIndex,
    handleMoveUp,
    handleMoveDown,
    handleMoveLeft,
    handleMoveRight,
    registerItemRef,
    syncDomFocus,
    isContentGroupActive,
    isItemFocused: (groupIndex, index) =>
      isContentGroupActive(groupIndex) &&
      getItemFocusIndex(groupIndex) === index,
  };
}
