import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
} from "react";
import { FOCUS_ZONE_CONTENT, useTvNavFocus } from "../../context/TvNavFocusContext.jsx";
import {
  getTvCardGap,
  getTvCardSize,
  getTvGridColumnCount,
} from "../../utils/tvLayout.js";
import "./ContentGrid.css";
import ContentGridItem from "./ContentGridItem.jsx";

function clampPosition(position, gridRows) {
  if (gridRows.length === 0) return { row: 0, col: 0 };

  const row = Math.min(Math.max(position.row, 0), gridRows.length - 1);
  const colMax = (gridRows[row]?.length ?? 1) - 1;
  const col = Math.min(Math.max(position.col, 0), Math.max(0, colMax));

  return { row, col };
}

/**
 * Fixed-column 2D grid for TV browse / More screens.
 * D-pad: window capture listener (VariableSwimlane pattern) plus per-card
 * `cellNav` on KeyboardWrapper as fallback when DOM focus is on the card.
 * Left on column 0 calls `onBoundaryLeft` to enter primary nav.
 */
const ContentGrid = forwardRef(function ContentGrid(
  {
    items = [],
    renderItem,
    focused = false,
    focusedPosition = { row: 0, col: 0 },
    onFocusChange,
    onBoundaryLeft,
    onNavigationEscape,
    onSelect,
    columns: columnsProp,
    cardSize: cardSizeProp,
    registerRowRef,
    scrollIntoViewOnFocus = true,
  },
  ref,
) {
  const { focusZone, canEnterNavFromContent, enterNav } = useTvNavFocus();
  const cardSize = cardSizeProp ?? getTvCardSize();
  const cardGap = getTvCardGap();
  const columns = columnsProp ?? getTvGridColumnCount();
  const itemRefs = useRef([]);

  const gridRows = useMemo(() => {
    if (items.length === 0) return [];

    const rows = [];
    for (let index = 0; index < items.length; index += columns) {
      rows.push(items.slice(index, index + columns));
    }
    return rows;
  }, [items, columns]);

  useImperativeHandle(
    ref,
    () => ({
      getFocusedElement() {
        const { row, col } = clampPosition(focusedPosition, gridRows);
        const flatIndex = row * columns + col;
        return itemRefs.current[flatIndex] ?? null;
      },
    }),
    [focusedPosition, gridRows, columns],
  );

  const clampedPosition = useMemo(
    () => clampPosition(focusedPosition, gridRows),
    [focusedPosition, gridRows],
  );

  const onItemRef = useCallback((flatIndex, node) => {
    itemRefs.current[flatIndex] = node;
  }, []);

  const leaveToNav = useCallback(
    (row, col) => {
      if (!canEnterNavFromContent) return;
      onBoundaryLeft?.();
      onNavigationEscape?.("left");
      enterNav();
      const flatIndex = row * columns + col;
      itemRefs.current[flatIndex]?.blur();
    },
    [
      canEnterNavFromContent,
      columns,
      enterNav,
      onBoundaryLeft,
      onNavigationEscape,
    ],
  );

  const handleGridArrow = useCallback(
    (direction, row, col, event) => {
      if (focusZone !== FOCUS_ZONE_CONTENT) return;

      event?.preventDefault?.();
      event?.stopPropagation?.();

      const rowLength = gridRows[row]?.length ?? 0;

      if (direction === "left") {
        if (col > 0) {
          onFocusChange?.(clampPosition({ row, col: col - 1 }, gridRows));
          return;
        }
        leaveToNav(row, col);
        return;
      }

      if (direction === "right") {
        if (col < rowLength - 1) {
          onFocusChange?.(clampPosition({ row, col: col + 1 }, gridRows));
        }
        return;
      }

      if (direction === "down") {
        if (row < gridRows.length - 1) {
          const nextRowLength = gridRows[row + 1]?.length ?? 0;
          onFocusChange?.(
            clampPosition(
              { row: row + 1, col: Math.min(col, nextRowLength - 1) },
              gridRows,
            ),
          );
          return;
        }
        onNavigationEscape?.("down");
        return;
      }

      if (direction === "up") {
        if (row > 0) {
          const prevRowLength = gridRows[row - 1]?.length ?? 0;
          onFocusChange?.(
            clampPosition(
              { row: row - 1, col: Math.min(col, prevRowLength - 1) },
              gridRows,
            ),
          );
        }
      }
    },
    [focusZone, gridRows, leaveToNav, onFocusChange, onNavigationEscape],
  );

  useEffect(() => {
    if (focusZone !== FOCUS_ZONE_CONTENT) return undefined;

    const handleKeyDown = (event) => {
      if (focusZone !== FOCUS_ZONE_CONTENT) return;

      const { row, col } = clampPosition(focusedPosition, gridRows);
      const rowLength = gridRows[row]?.length ?? 0;

      if (event.key === "ArrowRight") {
        if (col < rowLength - 1) {
          event.preventDefault();
          event.stopPropagation();
          onFocusChange?.(clampPosition({ row, col: col + 1 }, gridRows));
        }
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        event.stopPropagation();
        if (col > 0) {
          onFocusChange?.(clampPosition({ row, col: col - 1 }, gridRows));
          return;
        }
        leaveToNav(row, col);
        return;
      }

      if (event.key === "ArrowDown") {
        if (row < gridRows.length - 1) {
          event.preventDefault();
          event.stopPropagation();
          const nextRowLength = gridRows[row + 1]?.length ?? 0;
          onFocusChange?.(
            clampPosition(
              { row: row + 1, col: Math.min(col, nextRowLength - 1) },
              gridRows,
            ),
          );
          return;
        }
        event.preventDefault();
        event.stopPropagation();
        onNavigationEscape?.("down");
        return;
      }

      if (event.key === "ArrowUp") {
        if (row > 0) {
          event.preventDefault();
          event.stopPropagation();
          const prevRowLength = gridRows[row - 1]?.length ?? 0;
          onFocusChange?.(
            clampPosition(
              { row: row - 1, col: Math.min(col, prevRowLength - 1) },
              gridRows,
            ),
          );
        }
        return;
      }

      if (event.key === "Enter" || event.key === " ") {
        const item = gridRows[row]?.[col];
        if (item) {
          event.preventDefault();
          event.stopPropagation();
          onSelect?.(item, clampPosition(focusedPosition, gridRows));
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [
    focusZone,
    focusedPosition,
    gridRows,
    canEnterNavFromContent,
    leaveToNav,
    onFocusChange,
    onNavigationEscape,
    onSelect,
  ]);

  useLayoutEffect(() => {
    if (!focused) {
      itemRefs.current.forEach((node) => node?.blur());
      return;
    }
    const { row, col } = clampedPosition;
    const flatIndex = row * columns + col;
    itemRefs.current[flatIndex]?.focus({ preventScroll: true });
    if (scrollIntoViewOnFocus) {
      itemRefs.current[flatIndex]?.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }
  }, [focused, clampedPosition, columns, scrollIntoViewOnFocus]);

  const gridWidth = columns * cardSize + Math.max(0, columns - 1) * cardGap;

  return (
    <div
      className="content-grid"
      style={{
        "--content-grid-columns": columns,
        "--content-grid-card-size": `${cardSize}px`,
        "--content-grid-gap": `${cardGap}px`,
        "--content-grid-width": `${gridWidth}px`,
      }}
    >
      {gridRows.map((rowItems, rowIndex) => (
        <div
          key={rowIndex}
          className="content-grid__row tv-home__scroll-group"
          ref={(node) => registerRowRef?.(rowIndex, node)}
        >
          {rowItems.map((item, colIndex) => {
            const flatIndex = rowIndex * columns + colIndex;
            const isItemFocused =
              focused &&
              rowIndex === clampedPosition.row &&
              colIndex === clampedPosition.col;

            const cellNav = {
              onLeft: (event) => handleGridArrow("left", rowIndex, colIndex, event),
              onRight: (event) =>
                handleGridArrow("right", rowIndex, colIndex, event),
              onUp: (event) => handleGridArrow("up", rowIndex, colIndex, event),
              onDown: (event) =>
                handleGridArrow("down", rowIndex, colIndex, event),
            };

            return (
              <ContentGridItem
                key={item.id ?? `${rowIndex}-${colIndex}`}
                item={item}
                rowIndex={rowIndex}
                colIndex={colIndex}
                flatIndex={flatIndex}
                isFocused={isItemFocused}
                renderItem={renderItem}
                onItemRef={onItemRef}
                cellNav={cellNav}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
});

export default ContentGrid;
