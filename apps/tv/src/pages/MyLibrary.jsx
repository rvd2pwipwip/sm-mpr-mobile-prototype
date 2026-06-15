import { useCallback, useMemo } from "react";
import {
  getVisibleMyLibrarySections,
  MY_LIBRARY_SECTION_ID,
} from "@sm-mpr/shared/constants/myLibrarySections.js";
import { usePodcastUserState } from "@sm-mpr/shared/context/PodcastUserStateContext.jsx";
import TvLibraryPodcastUserSwimlanes from "../components/podcasts/TvLibraryPodcastUserSwimlanes.jsx";
import { useContentProfile } from "../context/ContentProfileContext.jsx";
import { HOME_LANDING_ITEM_INDEX } from "../constants/homeFocusGroups.js";
import { useScreenContentFocus } from "../hooks/useScreenContentFocus.js";
import { useTvScreenHeaderOffset } from "../hooks/useTvScreenHeaderOffset.js";
import { useTvVerticalGroupScroll } from "../hooks/useTvVerticalGroupScroll.js";
import { buildTvPodcastLibraryRails } from "../utils/tvPodcastLibraryRails.js";
import "./MyLibrary.css";

/** Broad catalog My Library hub (mobile {@link MyLibrary} parity for podcast user rails). */
export default function MyLibrary() {
  const { enabledContentTypes } = useContentProfile();
  const podcastUserState = usePodcastUserState();

  const visibleSections = useMemo(
    () => getVisibleMyLibrarySections(enabledContentTypes),
    [enabledContentTypes],
  );

  const showPodcastUserSwimlanes = visibleSections.some(
    (section) => section.id === MY_LIBRARY_SECTION_ID.podcastUserSwimlanes,
  );

  const libraryRails = useMemo(() => {
    if (!showPodcastUserSwimlanes) return [];
    return buildTvPodcastLibraryRails(podcastUserState);
  }, [
    showPodcastUserSwimlanes,
    podcastUserState.subscribedPodcasts,
    podcastUserState.continueListening,
    podcastUserState.bookmarkedEpisodes,
    podcastUserState.newEpisodeRows,
    podcastUserState.downloadedEpisodes,
  ]);

  const focusConfig = useMemo(() => {
    if (libraryRails.length === 0) {
      return {
        groupCount: 1,
        itemCounts: { 0: 0 },
        swimlaneGroups: [],
        firstBodyGroup: 0,
        lastBodyGroup: 0,
        defaultGroupIndex: 0,
      };
    }

    const itemCounts = {};
    const swimlaneGroups = [];

    libraryRails.forEach((rail, index) => {
      itemCounts[index] = rail.slotCount;
      swimlaneGroups.push(index);
    });

    return {
      groupCount: libraryRails.length,
      itemCounts,
      swimlaneGroups,
      firstBodyGroup: 0,
      lastBodyGroup: libraryRails.length - 1,
      defaultGroupIndex: 0,
    };
  }, [libraryRails]);

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
    groupCount: focusConfig.groupCount,
    itemCounts: focusConfig.itemCounts,
    swimlaneGroups: focusConfig.swimlaneGroups,
    defaultGroupIndex: focusConfig.defaultGroupIndex,
    defaultItemIndex: HOME_LANDING_ITEM_INDEX,
  });

  const getFocusedElement = useCallback(
    () => getItemElement(focusedGroupIndex, focusedIndex),
    [getItemElement, focusedGroupIndex, focusedIndex],
  );

  const { shellRef, headerRef } = useTvScreenHeaderOffset();

  const {
    viewportRef,
    innerRef,
    registerGroupRef,
    offsetY,
    innerClassName,
  } = useTvVerticalGroupScroll(focusedGroupIndex, {
    landingGroupIndex: focusConfig.firstBodyGroup,
    lastFocusableGroupIndex: focusConfig.lastBodyGroup,
    getFocusedElement,
    screenId: "my-library",
    scrollEnabled: libraryRails.length > 0,
  });

  return (
    <div ref={shellRef} className="tv-my-library tv-screen-overlay">
      <header ref={headerRef} className="tv-screen-overlay__header">
        <h1 className="tv-screen-header-title">My Library</h1>
      </header>

      <div
        ref={viewportRef}
        className="tv-home__scroll tv-screen-overlay__scroll"
      >
        <div
          ref={innerRef}
          className={`tv-home__scroll-inner ${innerClassName}`}
          style={{ transform: `translateY(-${offsetY}px)` }}
        >
          {showPodcastUserSwimlanes && libraryRails.length > 0 ? (
            <TvLibraryPodcastUserSwimlanes
              groupIndexOffset={0}
              registerGroupRef={registerGroupRef}
              registerItemRef={registerItemRef}
              isContentGroupActive={isContentGroupActive}
              getItemFocusIndex={getItemFocusIndex}
              setFocusedIndex={setFocusedIndex}
              onMoveUp={handleMoveUp}
              onMoveDown={handleMoveDown}
              enterNavFromContent={enterNavFromContent}
            />
          ) : (
            <p className="tv-my-library__empty tv-home__content-inset">
              Subscribe or bookmark podcasts to see your library here.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
