import { useTvScreenHeaderOffset } from "../../hooks/useTvScreenHeaderOffset.js";
import TvScreenHeaderTitle from "../drill/TvScreenHeaderTitle.jsx";
import "../drill/TvDrillScreen.css";
import "../drill/TvScreenHeaderTitle.css";
import "./TvInfoHubLayout.css";
import "./TvInfoScreen.css";

/**
 * Overlay shell for Info / Account and settings — centered column.
 * Pass scroll refs from `useTvInfoScreenFocus` when account actions need parked scroll.
 *
 * @param {"symmetric" | "nav-aware"} hubLayout
 *   symmetric = limited Info (no side menu); nav-aware = Account and settings (PrimaryNav).
 */
export default function TvInfoScreenLayout({
  title,
  titleEasterEgg = null,
  hubLayout = "symmetric",
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

  const shellClass = [
    "tv-drill-screen",
    "tv-info-screen",
    "tv-info-hub-shell",
    "tv-screen-overlay",
    hubLayout === "nav-aware" ? "tv-info-hub-shell--nav-aware" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const innerClass = [
    "tv-home__scroll-inner",
    "tv-info-screen__inner",
    scrollInnerClassName,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div ref={shellRef} className={shellClass}>
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
