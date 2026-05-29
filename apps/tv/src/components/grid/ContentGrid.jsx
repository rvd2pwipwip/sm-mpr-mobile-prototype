import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
} from "react";
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
 * Fixed-column 2D grid for TV More screens (adapted from SMTV03 ChannelGrid).
 * Arrow keys when `focused`; boundary escape via `onNavigationEscape`.
 */
export default function ContentGrid({
  items = [],
  renderItem,
  focused = false,
  focusedPosition = { row: 0, col: 0 },
  onFocusChange,
  onNavigationEscape,
  onSelect,
  columns: columnsProp,
}) {
  const cardSize = getTvCardSize();
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

  const clampedPosition = useMemo(
    () => clampPosition(focusedPosition, gridRows),
    [focusedPosition, gridRows],
  );

  const onItemRef = useCallback((flatIndex, node) => {
    itemRefs.current[flatIndex] = node;
  }, []);

  useEffect(() => {
    if (!focused) return undefined;

    const handleKeyDown = (event) => {
      const { row, col } = clampPosition(focusedPosition, gridRows);
      const rowLength = gridRows[row]?.length ?? 0;

      if (event.key === "ArrowRight") {
        if (col < rowLength - 1) {
          event.preventDefault();
          onFocusChange?.(clampPosition({ row, col: col + 1 }, gridRows));
        }
        return;
      }

      if (event.key === "ArrowLeft") {
        if (col > 0) {
          event.preventDefault();
          onFocusChange?.(clampPosition({ row, col: col - 1 }, gridRows));
          return;
        }
        onNavigationEscape?.("left");
        return;
      }

      if (event.key === "ArrowDown") {
        if (row < gridRows.length - 1) {
          event.preventDefault();
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

      if (event.key === "ArrowUp") {
        if (row > 0) {
          event.preventDefault();
          const prevRowLength = gridRows[row - 1]?.length ?? 0;
          onFocusChange?.(
            clampPosition(
              { row: row - 1, col: Math.min(col, prevRowLength - 1) },
              gridRows,
            ),
          );
          return;
        }
        onNavigationEscape?.("up");
        return;
      }

      if (event.key === "Enter" || event.key === " ") {
        const item = gridRows[row]?.[col];
        if (item) {
          event.preventDefault();
          onSelect?.(item, clampPosition(focusedPosition, gridRows));
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    focused,
    focusedPosition,
    gridRows,
    onFocusChange,
    onNavigationEscape,
    onSelect,
  ]);

  useLayoutEffect(() => {
    if (!focused) return;
    const { row, col } = clampedPosition;
    const flatIndex = row * columns + col;
    itemRefs.current[flatIndex]?.focus();
    itemRefs.current[flatIndex]?.scrollIntoView({
      block: "nearest",
      behavior: "smooth",
    });
  }, [focused, clampedPosition, columns]);

  return (
    <div
      className="content-grid"
      style={{
        "--content-grid-card-size": `${cardSize}px`,
        "--content-grid-gap": `${cardGap}px`,
      }}
    >
      {gridRows.map((rowItems, rowIndex) => (
        <div key={rowIndex} className="content-grid__row">
          {rowItems.map((item, colIndex) => {
            const flatIndex = rowIndex * columns + colIndex;
            const isItemFocused =
              focused &&
              rowIndex === clampedPosition.row &&
              colIndex === clampedPosition.col;

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
              />
            );
          })}
        </div>
      ))}
    </div>
  );
}
