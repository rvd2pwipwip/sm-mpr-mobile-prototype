import { useCallback, useMemo } from "react";
import {
  userMayBookmarkEpisodes,
  userMayDownloadEpisodesOffline,
} from "@sm-mpr/shared/utils/userContentGates.js";
import { usePodcastUserState } from "@sm-mpr/shared/context/PodcastUserStateContext.jsx";
import { HOME_LANDING_ITEM_INDEX } from "../../constants/homeFocusGroups.js";
import { useAccountRequiredDialog } from "../../context/AccountRequiredDialogContext.jsx";
import { useUserType } from "../../context/UserTypeContext.jsx";
import TvEpisodeListItem from "../podcasts/TvEpisodeListItem.jsx";
import { useScreenContentFocus } from "../../hooks/useScreenContentFocus.js";
import { useTvScreenHeaderOffset } from "../../hooks/useTvScreenHeaderOffset.js";
import { useTvVerticalGroupScroll } from "../../hooks/useTvVerticalGroupScroll.js";
import TvDrillScreenHeader from "../drill/TvDrillScreenHeader.jsx";
import "../drill/TvDrillScreen.css";
import "./TvSearchEpisodeDrillPage.css";

const EPISODE_SLOTS = 3;

/**
 * Search catalog More — full episode list (`TvEpisodeListItem` rows).
 */
export default function TvSearchEpisodeDrillPage({
  screenId,
  title,
  rows,
  emptyMessage,
  onSelectRow,
  getProgressFraction,
}) {
  const { userType } = useUserType();
  const { openAccountRequiredDialog } = useAccountRequiredDialog();
  const {
    toggleBookmark,
    toggleDownload,
    getEpisodeProgress,
    isBookmarked,
    isDownloaded,
  } = usePodcastUserState();

  const resolveProgress = useCallback(
    (row) => {
      if (getProgressFraction) {
        return getProgressFraction(row);
      }
      return getEpisodeProgress(row.episode.id);
    },
    [getProgressFraction, getEpisodeProgress],
  );

  const lastGroup = Math.max(0, rows.length - 1);
  const { shellRef, headerRef } = useTvScreenHeaderOffset();

  const itemCounts = useMemo(() => {
    /** @type {Record<number, number>} */
    const counts = {};
    for (let index = 0; index < rows.length; index += 1) {
      counts[index] = EPISODE_SLOTS;
    }
    return counts;
  }, [rows.length]);

  const {
    registerItemRef,
    focusedGroupIndex,
    handleMoveUp,
    handleMoveDown,
    handleMoveLeft,
    handleMoveRight,
    isItemFocused,
    getItemFocusIndex,
    getItemElement,
    enterNavFromContent,
  } = useScreenContentFocus(screenId, {
    groupCount: rows.length > 0 ? rows.length : 1,
    itemCounts,
    swimlaneGroups: [],
    defaultGroupIndex: 0,
    defaultItemIndex: HOME_LANDING_ITEM_INDEX,
  });

  const getFocusedElement = useCallback(() => {
    const itemIndex =
      getItemFocusIndex(focusedGroupIndex) ?? HOME_LANDING_ITEM_INDEX;
    return getItemElement(focusedGroupIndex, itemIndex);
  }, [focusedGroupIndex, getItemElement, getItemFocusIndex]);

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
            <div className="tv-search-episode-drill__list">
              {rows.map((row, index) => (
                <div
                  key={row.episode.id}
                  className="tv-home__scroll-group"
                  ref={(el) => registerGroupRef(index, el)}
                >
                  <TvEpisodeListItem
                    episode={row.episode}
                    progressFraction={resolveProgress(row)}
                    isBookmarked={isBookmarked(row.episode.id)}
                    isDownloaded={isDownloaded(row.episode.id)}
                    groupIndex={index}
                    focusedIndex={getItemFocusIndex(index)}
                    focused={focusedGroupIndex === index}
                    registerItemRef={registerItemRef}
                    onMoveUp={handleMoveUp}
                    onMoveDown={handleMoveDown}
                    onMoveLeft={enterNavFromContent}
                    onMoveRight={handleMoveRight}
                    onPlay={() => onSelectRow(row)}
                    onToggleBookmark={() => {
                      if (
                        !isBookmarked(row.episode.id) &&
                        !userMayBookmarkEpisodes(userType)
                      ) {
                        openAccountRequiredDialog("episodeBookmark");
                        return;
                      }
                      toggleBookmark(row.episode.id);
                    }}
                    onToggleDownload={() => {
                      if (
                        !isDownloaded(row.episode.id) &&
                        !userMayDownloadEpisodesOffline(userType)
                      ) {
                        openAccountRequiredDialog("episodeOfflineDownload");
                        return;
                      }
                      toggleDownload(row.episode.id);
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
