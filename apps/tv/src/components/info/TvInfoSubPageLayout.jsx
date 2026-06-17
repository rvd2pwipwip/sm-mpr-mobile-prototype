import { useTvScreenHeaderOffset } from "../../hooks/useTvScreenHeaderOffset.js";
import TvDrillScreenHeader from "../drill/TvDrillScreenHeader.jsx";
import "../drill/TvDrillScreen.css";
import "./TvInfoSubPage.css";

/** Shared overlay shell for Info drill-ins (Contact, About) — 50vw column, Esc back. */
export default function TvInfoSubPageLayout({ title, children }) {
  const { shellRef, headerRef } = useTvScreenHeaderOffset();

  return (
    <div
      ref={shellRef}
      className="tv-drill-screen tv-info-sub-page tv-screen-overlay"
    >
      <TvDrillScreenHeader title={title} headerRef={headerRef} />

      <div className="tv-drill-screen__scroll tv-home__scroll tv-screen-overlay__scroll">
        <div className="tv-home__scroll-inner tv-info-sub-page__inner">
          <div className="tv-info-sub-page__column">{children}</div>
        </div>
      </div>
    </div>
  );
}
