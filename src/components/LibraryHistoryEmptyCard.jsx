import "./LibraryHistoryEmptyCard.css";

/**
 * Single placeholder when a My Library history rail has no items yet.
 * Thumbnail-sized media area matches standard `ContentTileCard` (Figma history empty `19928:61987`).
 *
 * @param {{ label: string }} props
 */
export default function LibraryHistoryEmptyCard({ label }) {
  return (
    <div className="library-history-empty-card">
      <div className="library-history-empty-card__media">
        <span
          className="library-history-empty-card__icon"
          aria-hidden={true}
        />
      </div>
      <p className="library-history-empty-card__label">{label}</p>
    </div>
  );
}
