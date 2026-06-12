import { useCallback, useMemo } from "react";
import { HOME_LANDING_ITEM_INDEX } from "../../constants/homeFocusGroups.js";
import KeyboardWrapper from "../focus/KeyboardWrapper.jsx";
import { useScreenContentFocus } from "../../hooks/useScreenContentFocus.js";
import { useTvScreenHeaderOffset } from "../../hooks/useTvScreenHeaderOffset.js";
import { useTvVerticalGroupScroll } from "../../hooks/useTvVerticalGroupScroll.js";
import TvDrillScreenHeader from "../drill/TvDrillScreenHeader.jsx";
import TvEpisodeRow from "./TvEpisodeRow.jsx";
import "../drill/TvDrillScreen.css";
import "./TvSearchEpisodeList.css";

/**
 * Full episode list for Search catalog More (vertical parked focus, one row per group).
 */
export default function TvSearchEpisodeDrillPage({
  screenId,
  title,
  rows,
  emptyMessage,
  onSelectRow,
}) {
  const lastGroup = Math.max(0, rows.length - 1);
  const { shellRef, headerRef } = useTvScreenHeaderOffset();

  const itemCounts = useMemo(() => {
    /** @type {Record<number, number>} */
    const counts = {};
    for (let index = 0; index < rows.length; index += 1) {
      counts[index] = 1;
    }
    return counts;
  }, [rows.length]);

  const {
    registerItemRef,
    focusedGroupIndex,
    handleMoveUp,
    handleMoveDown,
    isItemFocused,
    getItemElement,
    enterNavFromContent,
  } = useScreenContentFocus(screenId, {
    groupCount: rows.length > 0 ? rows.length : 1,
    itemCounts,
    swimlaneGroups: [],
    defaultGroupIndex: 0,
    defaultItemIndex: HOME_LANDING_ITEM_INDEX,
  });

  const getFocusedElement = useCallback(
    () => getItemElement(focusedGroupIndex, HOME_LANDING_ITEM_INDEX),
    [getItemElement, focusedGroupIndex],
  );

  const {
    viewportRef,
    innerRef,
    registerGroupRef,
    offsetY,
    innerClassName,
  } = useTvVerticalGroupScroll(focusedGroupIndex, {
    landingGroupIndex: 0,
    firstFocusableGroupIndex: 0,
    lastFocusableGroupIndex: lastGroup,
    getFocusedElement,
    screenId,
    scrollEnabled: rows.length > 0,
  });

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
          {rows.length === 0 ? (
            <p className="tv-drill-screen__empty">{emptyMessage}</p>
          ) : (
            rows.map((row, index) => (
              <div
                key={row.episode.id}
                className="tv-home__scroll-group tv-search-episode-drill__row"
                ref={(el) => registerGroupRef(index, el)}
              >
                <KeyboardWrapper
                  ref={(node) => registerItemRef(index, 0, node)}
                  onSelect={() => onSelectRow(row)}
                  onUp={handleMoveUp}
                  onDown={handleMoveDown}
                  onLeft={enterNavFromContent}
                >
                  {(focusProps) => (
                    <TvEpisodeRow
                      {...focusProps}
                      episodeTitle={row.episode.title}
                      showTitle={row.podcast.title}
                      thumbnail={
                        row.episode.thumbnail ?? row.podcast.thumbnail
                      }
                      focused={isItemFocused(index, 0)}
                    />
                  )}
                </KeyboardWrapper>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
