/**
 * Title-only overlay header for TV drill screens (grid, episode list, etc.).
 */
export default function TvDrillScreenHeader({ title, headerRef }) {
  return (
    <header
      ref={headerRef}
      className="tv-drill-screen__header tv-screen-overlay__header"
    >
      <h1 className="tv-screen-header-title">{title}</h1>
    </header>
  );
}
