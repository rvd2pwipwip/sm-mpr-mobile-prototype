import { useLayoutEffect, useRef } from "react";

/**
 * One-shot focus restore from `location.state.restoreFocus` (e.g. returning from FAQ).
 */
export function useTvRestoreFocusOnMount({
  restoreFocus,
  setFocusedGroupIndex,
  setFocusedIndex,
  getItemElement,
  onRestored,
}) {
  const appliedRef = useRef(false);

  useLayoutEffect(() => {
    if (appliedRef.current || !restoreFocus) return undefined;
    appliedRef.current = true;

    const { groupIndex, itemIndex } = restoreFocus;
    setFocusedGroupIndex(groupIndex);
    setFocusedIndex(groupIndex, itemIndex);
    onRestored?.();

    const frameId = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        getItemElement(groupIndex, itemIndex)?.focus({ preventScroll: true });
      });
    });
    return () => cancelAnimationFrame(frameId);
  }, [
    restoreFocus,
    setFocusedGroupIndex,
    setFocusedIndex,
    getItemElement,
    onRestored,
  ]);
}
