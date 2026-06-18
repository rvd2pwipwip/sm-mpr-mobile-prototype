import { useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import TvDrillScreenHeader from "../drill/TvDrillScreenHeader.jsx";
import TvScrollbarScrollPane from "../scroll/TvScrollbarScrollPane.jsx";
import { useTvNavFocus } from "../../context/TvNavFocusContext.jsx";
import { useTvScreenHeaderOffset } from "../../hooks/useTvScreenHeaderOffset.js";
import { navigateBackFromEmbeddedDoc } from "../../utils/tvEmbeddedDocNavigation.js";
import "../drill/TvDrillScreen.css";
import "./TvInfoEmbeddedDoc.css";

/**
 * Shared embedded scroll document shell (FAQ, Terms, Privacy).
 * @param {{ returnTo: string, returnFocus: { groupIndex: number, itemIndex: number } }} defaultReturn
 */
export default function TvInfoEmbeddedDocLayout({
  title,
  scrollbarAriaLabel,
  defaultReturn,
  children,
  contentClassName = "",
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { enterContent } = useTvNavFocus();
  const { shellRef, headerRef } = useTvScreenHeaderOffset();

  const goBack = useCallback(() => {
    navigateBackFromEmbeddedDoc(navigate, location, defaultReturn);
  }, [navigate, location, defaultReturn]);

  useEffect(() => {
    enterContent();
  }, [enterContent]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key !== "Escape" && event.key !== "Backspace") return;
      event.preventDefault();
      event.stopImmediatePropagation();
      goBack();
    };

    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [goBack]);

  const scrollClass = ["tv-info-embedded-doc__scroll-body", contentClassName]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      ref={shellRef}
      className="tv-drill-screen tv-info-embedded-doc tv-info-hub-shell tv-screen-overlay"
    >
      <TvDrillScreenHeader title={title} headerRef={headerRef} />

      <div className="tv-info-embedded-doc__scroll-host tv-screen-overlay__scroll">
        <TvScrollbarScrollPane
          className="tv-info-embedded-doc__pane"
          scrollClassName={scrollClass}
          scrollbarAriaLabel={scrollbarAriaLabel}
          onEscape={goBack}
        >
          {children}
          <div className="tv-info-embedded-doc__scroll-padding" aria-hidden="true" />
        </TvScrollbarScrollPane>
      </div>
    </div>
  );
}
