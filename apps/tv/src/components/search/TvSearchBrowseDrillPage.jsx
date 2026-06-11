import { useCallback, useMemo, useRef } from "react";
import ContentGrid from "../grid/ContentGrid.jsx";
import { useContentFocusGroups } from "../../hooks/useContentFocusGroups.js";
import { useTvVerticalGroupScroll } from "../../hooks/useTvVerticalGroupScroll.js";
import { useScreenMemory } from "../../context/ScreenMemoryContext.jsx";
import { FOCUS_ZONE_CONTENT, useTvNavFocus } from "../../context/TvNavFocusContext.jsx";
import { getTvBrowseGridLayout } from "../../utils/tvLayout.js";
import "./TvSearchBrowseDrillPage.css";

const GRID_GROUP = 0;
const DEFAULT_GRID_POSITION = { row: 0, col: 0 };

/**
 * Full-screen Search browse drill-down: title header + 5-col grid with parked
 * vertical scroll (one row per focus group; horizontal moves inside the row).
 */
export default function TvSearchBrowseDrillPage({
  screenId,
  title,
  meta,
  items,
  emptyMessage,
  onSelectItem,
  renderItem,
}) {
  const gridLayout = useMemo(() => getTvBrowseGridLayout(), []);
  const gridRef = useRef(null);

  const rowCount = useMemo(() => {
    if (items.length === 0) return 0;
    return Math.ceil(items.length / gridLayout.columns);
  }, [items.length, gridLayout.columns]);

  useContentFocusGroups(1);

  const { enterNav, enterContent, focusZone } = useTvNavFocus();
  const { memory, setField, getFocusedGroupIndex } = useScreenMemory(screenId);

  const gridFocusedPosition = memory.gridFocusedPosition ?? DEFAULT_GRID_POSITION;
  const focusedGroupIndex = getFocusedGroupIndex(GRID_GROUP);
  const gridFocused =
    focusZone === FOCUS_ZONE_CONTENT && focusedGroupIndex === GRID_GROUP;

  const setGridFocusedPosition = useCallback(
    (position) => {
      setField("gridFocusedPosition", position);
    },
    [setField],
  );

  const getFocusedElement = useCallback(
    () => gridRef.current?.getFocusedElement() ?? null,
    [],
  );

  const {
    viewportRef,
    innerRef,
    registerGroupRef,
    offsetY,
    innerClassName,
  } = useTvVerticalGroupScroll(gridFocusedPosition.row, {
    landingGroupIndex: 0,
    firstFocusableGroupIndex: 0,
    lastFocusableGroupIndex: Math.max(0, rowCount - 1),
    getFocusedElement,
    screenId,
  });

  const handleGridNavigationEscape = useCallback(
    (direction) => {
      if (direction === "up" || direction === "left") {
        enterNav();
      }
    },
    [enterNav],
  );

  const handleSelect = useCallback(
    (item) => {
      enterContent();
      onSelectItem(item);
    },
    [enterContent, onSelectItem],
  );

  return (
    <div className="tv-search-drill">
      <header className="tv-search-drill__header">
        <h1 className="tv-search-drill__title">{title}</h1>
        {meta ? <p className="tv-search-drill__meta">{meta}</p> : null}
      </header>

      <div
        ref={viewportRef}
        className="tv-search-drill__scroll tv-home__scroll"
      >
        <div
          ref={innerRef}
          className={`tv-home__scroll-inner ${innerClassName}`}
          style={{ transform: `translateY(-${offsetY}px)` }}
        >
          {items.length === 0 ? (
            <p className="tv-search-drill__empty">{emptyMessage}</p>
          ) : (
            <ContentGrid
              ref={gridRef}
              items={items}
              columns={gridLayout.columns}
              cardSize={gridLayout.cardSize}
              focused={gridFocused}
              focusedPosition={gridFocusedPosition}
              onFocusChange={setGridFocusedPosition}
              onNavigationEscape={handleGridNavigationEscape}
              onSelect={handleSelect}
              registerRowRef={registerGroupRef}
              scrollIntoViewOnFocus={false}
              renderItem={(item, _row, _col, isFocused, setRef) =>
                renderItem(item, isFocused, setRef, handleSelect)
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}
