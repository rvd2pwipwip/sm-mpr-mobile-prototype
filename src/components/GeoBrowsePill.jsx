import "./GeoBrowsePill.css";

/**
 * Tappable pill for international geo child nav (Browse International Subregion).
 *
 * @param {{ children: string, onClick: () => void }} props
 */
export default function GeoBrowsePill({ children, onClick }) {
  return (
    <button type="button" className="geo-browse-pill" onClick={onClick}>
      {children}
    </button>
  );
}
