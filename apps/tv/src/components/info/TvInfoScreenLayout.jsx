import { useTvScreenHeaderOffset } from "../../hooks/useTvScreenHeaderOffset.js";
import TvScreenHeaderTitle from "../drill/TvScreenHeaderTitle.jsx";
import "../drill/TvDrillScreen.css";
import "../drill/TvScreenHeaderTitle.css";
import "./TvInfoScreen.css";

/**
 * Overlay shell for Info / Account and settings — centered column.
 * Limited Info may pass `titleEasterEgg`; broad Account and settings uses a plain title.
 */
export default function TvInfoScreenLayout({ title, titleEasterEgg = null, children }) {
  const { shellRef, headerRef } = useTvScreenHeaderOffset();

  return (
    <div ref={shellRef} className="tv-drill-screen tv-info-screen tv-screen-overlay">
      <header
        ref={headerRef}
        className="tv-drill-screen__header tv-screen-overlay__header"
      >
        <div className="tv-drill-screen__header-row">
          <TvScreenHeaderTitle title={title} easterEgg={titleEasterEgg} />
        </div>
      </header>

      <div className="tv-drill-screen__scroll tv-home__scroll tv-screen-overlay__scroll">
        <div className="tv-home__scroll-inner tv-info-screen__inner">
          <div className="tv-info-screen__column">{children}</div>
        </div>
      </div>
    </div>
  );
}
