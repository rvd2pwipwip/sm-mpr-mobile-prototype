import { useCallback, useEffect, useRef } from "react";
import { HOME_LANDING_ITEM_INDEX } from "../constants/homeFocusGroups.js";

/**
 * After Listen again is cleared from a swimlane, restore focus to the first card
 * of the next row (same group index once the rail unmounts; horizontal index 0).
 */
export function useRestoreFocusAfterListenAgainClear({
  showListenAgain,
  targetGroupIndex,
  setFocusedGroupIndex,
  setFocusedIndex,
  getItemElement,
  itemIndex = HOME_LANDING_ITEM_INDEX,
}) {
  const pendingRef = useRef(false);

  const onListenAgainCleared = useCallback(() => {
    pendingRef.current = true;
  }, []);

  useEffect(() => {
    if (!pendingRef.current || showListenAgain) return;
    pendingRef.current = false;

    setFocusedGroupIndex(targetGroupIndex);
    setFocusedIndex(targetGroupIndex, itemIndex);

    const frameId = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        getItemElement(targetGroupIndex, itemIndex)?.focus({
          preventScroll: true,
        });
      });
    });
    return () => cancelAnimationFrame(frameId);
  }, [
    showListenAgain,
    targetGroupIndex,
    itemIndex,
    setFocusedGroupIndex,
    setFocusedIndex,
    getItemElement,
  ]);

  return onListenAgainCleared;
}
