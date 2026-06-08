import { useMemo } from "react";
import AppInfoSwimlane from "../components/AppInfoSwimlane";
import LibraryHistoryRail from "../components/LibraryHistoryRail";
import LibraryLikedMusicSwimlane from "../components/LibraryLikedMusicSwimlane";
import LibraryLikedRadioSwimlane from "../components/LibraryLikedRadioSwimlane";
import LibraryPodcastUserSwimlanes from "../components/LibraryPodcastUserSwimlanes";
import { useContentProfile } from "../context/ContentProfileContext";
import {
  getVisibleMyLibrarySections,
  MY_LIBRARY_SECTION_ID,
} from "@sm-mpr/shared/constants/myLibrarySections.js";
import "./MyLibrary.css";

/** My Library tab hub (`docs/mobile/Plans/My-Library-implementation-plan.md` Phase 5). */
export default function MyLibrary() {
  const { enabledContentTypes } = useContentProfile();

  const visibleSections = useMemo(
    () => getVisibleMyLibrarySections(enabledContentTypes),
    [enabledContentTypes],
  );

  function renderSection(sectionId) {
    switch (sectionId) {
      case MY_LIBRARY_SECTION_ID.appInfo:
        return <AppInfoSwimlane key={sectionId} />;
      case MY_LIBRARY_SECTION_ID.musicHistory:
        return <LibraryHistoryRail key={sectionId} segment="music" />;
      case MY_LIBRARY_SECTION_ID.likedMusic:
        return <LibraryLikedMusicSwimlane key={sectionId} />;
      case MY_LIBRARY_SECTION_ID.podcastHistory:
        return <LibraryHistoryRail key={sectionId} segment="podcasts" />;
      case MY_LIBRARY_SECTION_ID.podcastUserSwimlanes:
        return <LibraryPodcastUserSwimlanes key={sectionId} />;
      case MY_LIBRARY_SECTION_ID.radioHistory:
        return <LibraryHistoryRail key={sectionId} segment="radio" />;
      case MY_LIBRARY_SECTION_ID.likedRadio:
        return <LibraryLikedRadioSwimlane key={sectionId} />;
      default:
        return null;
    }
  }

  return (
    <main className="app-shell app-shell--footer-fixed my-library-page">
      <div className="app-shell-footer-scroll">
        <div className="my-library-screen">
          {visibleSections.map((section) => renderSection(section.id))}
        </div>
      </div>
    </main>
  );
}
