import TvScreenHeaderTitle from "./TvScreenHeaderTitle.jsx";
import "./TvScreenHeaderTitle.css";

/**
 * Title overlay header for TV drill screens (grid, episode list, etc.).
 * Optional `endSlot` — e.g. Listen again Clear (mobile `ScreenHeader` end action).
 * Optional `titleEasterEgg` — mouse-only link to prototype routes (e.g. My Library).
 */
export default function TvDrillScreenHeader({
  title,
  headerRef,
  endSlot = null,
  titleEasterEgg = null,
}) {
  return (
    <header
      ref={headerRef}
      className="tv-drill-screen__header tv-screen-overlay__header"
    >
      <div className="tv-drill-screen__header-row">
        <TvScreenHeaderTitle title={title} easterEgg={titleEasterEgg} />
        {endSlot ? (
          <div className="tv-drill-screen__header-end">{endSlot}</div>
        ) : null}
      </div>
    </header>
  );
}
