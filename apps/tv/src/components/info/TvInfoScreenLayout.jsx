import { useTvScreenHeaderOffset } from "../../hooks/useTvScreenHeaderOffset.js";
import TvScreenHeaderTitle from "../drill/TvScreenHeaderTitle.jsx";
import "../drill/TvDrillScreen.css";
import "../drill/TvScreenHeaderTitle.css";
import "./TvInfoScreen.css";

/**
 * Overlay shell for Info / Account and settings — centered column.
 * Pass scroll refs from `useTvInfoScreenFocus` when account actions need parked scroll.
 */
export default function TvInfoScreenLayout({
  title,
  titleEasterEgg = null,
  shellRef: shellRefProp,
  headerRef: headerRefProp,
  scrollViewportRef,
  scrollInnerRef,
  scrollInnerClassName,
  scrollInnerStyle,
  children,
}) {
  const internalOffset = useTvScreenHeaderOffset();
  const shellRef = shellRefProp ?? internalOffset.shellRef;
  const headerRef = headerRefProp ?? internalOffset.headerRef;

  const innerClass = [
    "tv-home__scroll-inner",
    "tv-info-screen__inner",
    scrollInnerClassName,
  ]
    .filter(Boolean)
    .join(" ");

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

      <div
        ref={scrollViewportRef}
        className="tv-drill-screen__scroll tv-home__scroll tv-screen-overlay__scroll"
      >
        <div
          ref={scrollInnerRef}
          className={innerClass}
          style={scrollInnerStyle}
        >
          <div className="tv-info-screen__column">{children}</div>
        </div>
      </div>
    </div>
  );
}
