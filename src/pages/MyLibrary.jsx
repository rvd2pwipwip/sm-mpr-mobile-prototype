import AppInfoSwimlane from "../components/AppInfoSwimlane";
import LibraryHistoryRails from "../components/LibraryHistoryRails";
import "./MyLibrary.css";

/** My Library tab hub (`docs/Plans/My-Library-implementation-plan.md`). */
export default function MyLibrary() {
  return (
    <main className="app-shell app-shell--footer-fixed my-library-page">
      <div className="app-shell-footer-scroll">
        <div className="my-library-screen">
          <div className="content-inset">
            <h1 className="my-library-page__title">My Library</h1>
          </div>

          <AppInfoSwimlane />
          <LibraryHistoryRails />
        </div>
      </div>
    </main>
  );
}
