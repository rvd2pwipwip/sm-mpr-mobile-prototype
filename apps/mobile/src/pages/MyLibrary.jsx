import AppInfoSwimlane from "../components/AppInfoSwimlane";
import LibraryHistoryRail from "../components/LibraryHistoryRail";
import LibraryLikedMusicSwimlane from "../components/LibraryLikedMusicSwimlane";
import LibraryLikedRadioSwimlane from "../components/LibraryLikedRadioSwimlane";
import LibraryPodcastUserSwimlanes from "../components/LibraryPodcastUserSwimlanes";
import "./MyLibrary.css";

/** My Library tab hub (`docs/Plans/My-Library-implementation-plan.md` Phase 5). */
export default function MyLibrary() {
  return (
    <main className="app-shell app-shell--footer-fixed my-library-page">
      <div className="app-shell-footer-scroll">
        <div className="my-library-screen">
          <AppInfoSwimlane />
          <LibraryHistoryRail segment="music" />
          <LibraryLikedMusicSwimlane />
          <LibraryHistoryRail segment="podcasts" />
          <LibraryPodcastUserSwimlanes />
          <LibraryHistoryRail segment="radio" />
          <LibraryLikedRadioSwimlane />
        </div>
      </div>
    </main>
  );
}
