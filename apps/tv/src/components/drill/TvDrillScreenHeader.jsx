/**
 * Title overlay header for TV drill screens (grid, episode list, etc.).
 * Optional `endSlot` — e.g. Listen again Clear (mobile `ScreenHeader` end action).
 */
export default function TvDrillScreenHeader({ title, headerRef, endSlot = null }) {
  return (
    <header
      ref={headerRef}
      className="tv-drill-screen__header tv-screen-overlay__header"
    >
      <div className="tv-drill-screen__header-row">
        <h1 className="tv-screen-header-title">{title}</h1>
        {endSlot ? (
          <div className="tv-drill-screen__header-end">{endSlot}</div>
        ) : null}
      </div>
    </header>
  );
}
