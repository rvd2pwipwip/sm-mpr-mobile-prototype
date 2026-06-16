import { useCallback, useMemo } from "react";
import {
  getVisibleMyLibrarySections,
} from "@sm-mpr/shared/constants/myLibrarySections.js";
import { usePodcastUserState } from "@sm-mpr/shared/context/PodcastUserStateContext.jsx";
import { useListenHistory } from "@sm-mpr/shared/context/ListenHistoryContext.jsx";
import TvDrillScreenHeader from "../components/drill/TvDrillScreenHeader.jsx";
import TvMyLibraryBody from "../components/library/TvMyLibraryBody.jsx";
import { useContentProfile } from "../context/ContentProfileContext.jsx";
import { useLikes } from "../context/LikesContext.jsx";
import { HOME_LANDING_ITEM_INDEX } from "../constants/homeFocusGroups.js";
import { useScreenContentFocus } from "../hooks/useScreenContentFocus.js";
import { useTvScreenHeaderOffset } from "../hooks/useTvScreenHeaderOffset.js";
import { useTvVerticalGroupScroll } from "../hooks/useTvVerticalGroupScroll.js";
import { buildTvMyLibraryFocusLayout } from "../utils/tvMyLibraryLayout.js";
import "../components/drill/TvDrillScreen.css";
import "./MyLibrary.css";

/** Broad catalog My Library hub (mobile {@link MyLibrary} parity, TV swimlanes). */
export default function MyLibrary() {
  const { enabledContentTypes, filterListenHistory } = useContentProfile();
  const { items: listenHistoryItems } = useListenHistory();
  const { items: likesItems } = useLikes();
  const podcastUserState = usePodcastUserState();

  const focusLayout = useMemo(
    () =>
      buildTvMyLibraryFocusLayout(enabledContentTypes, {
        listenHistoryItems,
        filterListenHistory,
        likesItems,
        podcastUserState,
      }),
    [
      enabledContentTypes,
      listenHistoryItems,
      filterListenHistory,
      likesItems,
      podcastUserState.subscribedPodcasts,
      podcastUserState.continueListening,
      podcastUserState.bookmarkedEpisodes,
      podcastUserState.newEpisodeRows,
      podcastUserState.downloadedEpisodes,
    ],
  );

  const visibleSections = useMemo(
    () => getVisibleMyLibrarySections(enabledContentTypes),
    [enabledContentTypes],
  );

  const hasBodyContent = focusLayout.swimlaneGroups.length > 0;

  const {
    handleMoveUp,
    handleMoveDown,
    registerItemRef,
    isContentGroupActive,
    getItemFocusIndex,
    setFocusedIndex,
    focusedGroupIndex,
    focusedIndex,
    getItemElement,
    enterNavFromContent,
  } = useScreenContentFocus("my-library", {
    groupCount: focusLayout.groupCount,
    itemCounts: focusLayout.itemCounts,
    swimlaneGroups: focusLayout.swimlaneGroups,
    defaultGroupIndex: focusLayout.defaultGroupIndex,
    defaultItemIndex: HOME_LANDING_ITEM_INDEX,
  });

  const getFocusedElement = useCallback(
    () => getItemElement(focusedGroupIndex, focusedIndex),
    [getItemElement, focusedGroupIndex, focusedIndex],
  );

  const onHistoryCleared = useCallback(
    (groupIndex) => {
      setFocusedIndex(groupIndex, 0);
      requestAnimationFrame(() => {
        getItemElement(groupIndex, 0)?.focus({ preventScroll: true });
      });
    },
    [getItemElement, setFocusedIndex],
  );

  const onEpisodeRailCleared = onHistoryCleared;

  const { shellRef, headerRef } = useTvScreenHeaderOffset();

  const {
    viewportRef,
    innerRef,
    registerGroupRef,
    offsetY,
    innerClassName,
  } = useTvVerticalGroupScroll(focusedGroupIndex, {
    landingGroupIndex: focusLayout.firstBodyGroup,
    firstFocusableGroupIndex: focusLayout.firstBodyGroup,
    lastFocusableGroupIndex: focusLayout.lastBodyGroup,
    getFocusedElement,
    screenId: "my-library",
    scrollEnabled: hasBodyContent,
  });

  return (
    <div ref={shellRef} className="tv-drill-screen tv-my-library tv-screen-overlay">
      <TvDrillScreenHeader title="My Library" headerRef={headerRef} />

      <div
        ref={viewportRef}
        className="tv-drill-screen__scroll tv-home__scroll tv-screen-overlay__scroll"
      >
        <div
          ref={innerRef}
          className={innerClassName}
          style={{ transform: `translateY(-${offsetY}px)` }}
        >
          {hasBodyContent ? (
            <TvMyLibraryBody
              visibleSections={visibleSections}
              sectionGroups={focusLayout.sectionGroups}
              registerGroupRef={registerGroupRef}
              registerItemRef={registerItemRef}
              isContentGroupActive={isContentGroupActive}
              getItemFocusIndex={getItemFocusIndex}
              setFocusedIndex={setFocusedIndex}
              onMoveUp={handleMoveUp}
              onMoveDown={handleMoveDown}
              enterNavFromContent={enterNavFromContent}
              onHistoryCleared={onHistoryCleared}
              onEpisodeRailCleared={onEpisodeRailCleared}
            />
          ) : (
            <p className="tv-drill-screen__empty tv-my-library__empty">
              Your library content will appear here.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
