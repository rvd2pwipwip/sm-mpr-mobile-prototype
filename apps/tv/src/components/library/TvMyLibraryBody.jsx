import {
  MY_LIBRARY_SECTION_ID,
} from "@sm-mpr/shared/constants/myLibrarySections.js";
import TvLibraryAppInfoSection from "./TvLibraryAppInfoSection.jsx";
import TvLibraryHistorySection from "./TvLibraryHistorySection.jsx";
import TvLibraryLikedMusicSection from "./TvLibraryLikedMusicSection.jsx";
import TvLibraryLikedRadioSection from "./TvLibraryLikedRadioSection.jsx";
import TvLibraryPodcastUserGridSections from "./TvLibraryPodcastUserGridSections.jsx";

/**
 * Renders visible My Library hub sections in mobile story order.
 */
export default function TvMyLibraryBody({
  visibleSections,
  sectionGroups,
  registerGroupRef,
  registerItemRef,
  isContentGroupActive,
  getItemFocusIndex,
  setFocusedIndex,
  onMoveUp,
  onMoveDown,
  enterNavFromContent,
  onHistoryCleared,
}) {
  const sharedFocus = {
    registerItemRef,
    onMoveUp,
    onMoveDown,
    enterNavFromContent,
  };

  const podcastOffset = sectionGroups[MY_LIBRARY_SECTION_ID.podcastUserSwimlanes];

  return (
    <div className="tv-my-library-body">
      {visibleSections.map((section) => {
        const groupIndex = sectionGroups[section.id];
        if (groupIndex == null) return null;

        const focusProps = {
          groupIndex,
          focused: isContentGroupActive(groupIndex),
          focusedIndex: getItemFocusIndex(groupIndex),
          onFocusChange: (index) => setFocusedIndex(groupIndex, index),
          onBoundaryLeft: enterNavFromContent,
          ...sharedFocus,
        };

        switch (section.id) {
          case MY_LIBRARY_SECTION_ID.appInfo:
            return (
              <div
                key={section.id}
                className="tv-home__scroll-group"
                ref={(node) => registerGroupRef(groupIndex, node)}
              >
                <TvLibraryAppInfoSection {...focusProps} />
              </div>
            );

          case MY_LIBRARY_SECTION_ID.musicHistory:
            return (
              <div
                key={section.id}
                className="tv-home__scroll-group"
                ref={(node) => registerGroupRef(groupIndex, node)}
              >
                <TvLibraryHistorySection
                  segment="music"
                  onHistoryCleared={() => onHistoryCleared?.(groupIndex)}
                  {...focusProps}
                />
              </div>
            );

          case MY_LIBRARY_SECTION_ID.likedMusic:
            return (
              <div
                key={section.id}
                className="tv-home__scroll-group"
                ref={(node) => registerGroupRef(groupIndex, node)}
              >
                <TvLibraryLikedMusicSection {...focusProps} />
              </div>
            );

          case MY_LIBRARY_SECTION_ID.podcastHistory:
            return (
              <div
                key={section.id}
                className="tv-home__scroll-group"
                ref={(node) => registerGroupRef(groupIndex, node)}
              >
                <TvLibraryHistorySection
                  segment="podcasts"
                  onHistoryCleared={() => onHistoryCleared?.(groupIndex)}
                  {...focusProps}
                />
              </div>
            );

          case MY_LIBRARY_SECTION_ID.podcastUserSwimlanes:
            return (
              <TvLibraryPodcastUserGridSections
                key={section.id}
                groupIndexOffset={podcastOffset}
                registerGroupRef={registerGroupRef}
                isContentGroupActive={isContentGroupActive}
                getItemFocusIndex={getItemFocusIndex}
                setFocusedIndex={setFocusedIndex}
                {...sharedFocus}
              />
            );

          case MY_LIBRARY_SECTION_ID.radioHistory:
            return (
              <div
                key={section.id}
                className="tv-home__scroll-group"
                ref={(node) => registerGroupRef(groupIndex, node)}
              >
                <TvLibraryHistorySection
                  segment="radio"
                  onHistoryCleared={() => onHistoryCleared?.(groupIndex)}
                  {...focusProps}
                />
              </div>
            );

          case MY_LIBRARY_SECTION_ID.likedRadio:
            return (
              <div
                key={section.id}
                className="tv-home__scroll-group"
                ref={(node) => registerGroupRef(groupIndex, node)}
              >
                <TvLibraryLikedRadioSection {...focusProps} />
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
