import { useCallback, useLayoutEffect, useRef } from "react";
import { FOCUS_ZONE_CONTENT, useTvNavFocus } from "../context/TvNavFocusContext.jsx";
import { useScreenMemory } from "../context/ScreenMemoryContext.jsx";

const DEFAULT_POSITION = { row: 0, col: 0 };

/**
 * Grid screens (More, browse drill) — same nav escape contract as swimlanes
 * (`rememberNavContentFocus` + `enterNav`), but 2D position in screen memory.
 */
export function useTvGridScreenFocus(screenId, columns) {
  const {
    enterContent,
    enterNav,
    rememberNavContentFocus,
    canEnterNavFromContent,
    focusZone,
    consumeNavContentRestore,
  } = useTvNavFocus();

  const { memory, setField, setFocusedGroupIndex } = useScreenMemory(screenId);
  const initScreenRef = useRef(null);

  const gridFocusedPosition = memory.gridFocusedPosition ?? DEFAULT_POSITION;
  const gridActive = focusZone === FOCUS_ZONE_CONTENT;

  useLayoutEffect(() => {
    if (initScreenRef.current === screenId) return;
    initScreenRef.current = screenId;
    enterContent();
    if (memory.focusedGroupIndex === undefined) {
      setFocusedGroupIndex(0);
    }
  }, [screenId, enterContent, memory.focusedGroupIndex, setFocusedGroupIndex]);

  useLayoutEffect(() => {
    if (focusZone !== FOCUS_ZONE_CONTENT) return;
    const snapshot = consumeNavContentRestore();
    if (!snapshot) return;
    const flat = snapshot.itemIndex ?? 0;
    setField("gridFocusedPosition", {
      row: Math.floor(flat / columns),
      col: flat % columns,
    });
  }, [columns, consumeNavContentRestore, focusZone, setField]);

  const setGridFocusedPosition = useCallback(
    (position) => {
      setField("gridFocusedPosition", position);
    },
    [setField],
  );

  const enterNavFromGrid = useCallback(() => {
    if (!canEnterNavFromContent) return;
    const { row, col } = gridFocusedPosition;
    rememberNavContentFocus({
      groupIndex: 0,
      itemIndex: row * columns + col,
    });
    enterNav();
  }, [
    canEnterNavFromContent,
    columns,
    enterNav,
    gridFocusedPosition,
    rememberNavContentFocus,
  ]);

  return {
    gridFocusedPosition,
    setGridFocusedPosition,
    gridActive,
    enterNavFromGrid,
    enterContent,
  };
}
