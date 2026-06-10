import { useCallback } from "react";
import ContentGrid from "../grid/ContentGrid.jsx";
import { useContentFocusGroups } from "../../hooks/useContentFocusGroups.js";
import { useScreenMemory } from "../../context/ScreenMemoryContext.jsx";
import { FOCUS_ZONE_CONTENT, useTvNavFocus } from "../../context/TvNavFocusContext.jsx";
import { getTvGridColumnCount } from "../../utils/tvLayout.js";
import "./TvSearchBrowseDrillPage.css";

const GRID_GROUP = 0;
const DEFAULT_GRID_POSITION = { row: 0, col: 0 };

/**
 * Full-screen Search browse drill-down with title header + ContentGrid.
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

  const columnCount = getTvGridColumnCount();

  return (
    <div className="tv-search-drill">
      <header className="tv-search-drill__header">
        <h1 className="tv-search-drill__title">{title}</h1>
        {meta ? <p className="tv-search-drill__meta">{meta}</p> : null}
      </header>

      <div className="tv-search-drill__grid-wrap">
        {items.length === 0 ? (
          <p className="tv-search-drill__empty">{emptyMessage}</p>
        ) : (
          <ContentGrid
            items={items}
            columns={columnCount}
            focused={gridFocused}
            focusedPosition={gridFocusedPosition}
            onFocusChange={setGridFocusedPosition}
            onNavigationEscape={handleGridNavigationEscape}
            onSelect={handleSelect}
            renderItem={(item, _row, _col, isFocused, setRef) =>
              renderItem(item, isFocused, setRef, handleSelect)
            }
          />
        )}
      </div>
    </div>
  );
}
