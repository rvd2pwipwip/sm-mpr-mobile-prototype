import { useCallback, useMemo, useRef } from "react";
import ContentGrid from "../grid/ContentGrid.jsx";
import { useContentFocusGroups } from "../../hooks/useContentFocusGroups.js";
import { useTvGridScreenFocus } from "../../hooks/useTvGridScreenFocus.js";
import { useTvVerticalGroupScroll } from "../../hooks/useTvVerticalGroupScroll.js";
import { useTvScreenHeaderOffset } from "../../hooks/useTvScreenHeaderOffset.js";
import { getTvBrowseGridLayout } from "../../utils/tvLayout.js";
import TvDrillScreenHeader from "./TvDrillScreenHeader.jsx";
import "./TvDrillScreen.css";
import "./TvDrillGridPage.css";

/**
 * Full-screen grid drill: frosted title header + 5-col grid with parked vertical
 * scroll. Used by Home More routes and Search browse / catalog More screens.
 */
export default function TvDrillGridPage({
  screenId,
  title,
  items,
  emptyMessage,
  onSelectItem,
  renderItem,
}) {
  const gridLayout = useMemo(() => getTvBrowseGridLayout(), []);
  const gridRef = useRef(null);
  const { shellRef, headerRef } = useTvScreenHeaderOffset();

  const rowCount = useMemo(() => {
    if (items.length === 0) return 0;
    return Math.ceil(items.length / gridLayout.columns);
  }, [items.length, gridLayout.columns]);

  useContentFocusGroups(1);

  const {
    gridFocusedPosition,
    setGridFocusedPosition,
    gridActive,
    enterNavFromGrid,
    enterContent,
  } = useTvGridScreenFocus(screenId, gridLayout.columns);

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

  const handleSelect = useCallback(
    (item) => {
      enterContent();
      onSelectItem(item);
    },
    [enterContent, onSelectItem],
  );

  return (
    <div ref={shellRef} className="tv-drill-screen tv-screen-overlay">
      <TvDrillScreenHeader title={title} headerRef={headerRef} />

      <div
        ref={viewportRef}
        className="tv-drill-screen__scroll tv-home__scroll tv-screen-overlay__scroll"
      >
        <div
          ref={innerRef}
          className={`tv-home__scroll-inner ${innerClassName}`}
          style={{ transform: `translateY(-${offsetY}px)` }}
        >
          {items.length === 0 ? (
            <p className="tv-drill-screen__empty">{emptyMessage}</p>
          ) : (
            <ContentGrid
              ref={gridRef}
              items={items}
              columns={gridLayout.columns}
              cardSize={gridLayout.cardSize}
              focused={gridActive}
              focusedPosition={gridFocusedPosition}
              onFocusChange={setGridFocusedPosition}
              onBoundaryLeft={enterNavFromGrid}
              onSelect={handleSelect}
              registerRowRef={registerGroupRef}
              scrollIntoViewOnFocus={false}
              renderItem={(item, _row, _col, isFocused, setRef, cellNav) =>
                renderItem(item, isFocused, setRef, handleSelect, cellNav)
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}
