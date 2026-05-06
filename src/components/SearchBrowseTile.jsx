import "./SearchBrowseTile.css";

/** Rect tile for Search music browse (genre / vibe / tag rows). */
export function SearchBrowseTileGrid({ children, labelId }) {
  return (
    <ul
      className="search-browse-tile-grid"
      role="list"
      aria-labelledby={labelId}
    >
      {children}
    </ul>
  );
}

/** @param {{ onClick: () => void, children: import('react').ReactNode, sub?: string }} props */
export function SearchBrowseTile({ onClick, children, sub }) {
  return (
    <li className="search-browse-tile-grid__cell">
      <button type="button" className="search-browse-tile" onClick={onClick}>
        {children}
        {sub ? <span className="search-browse-tile__sub">{sub}</span> : null}
      </button>
    </li>
  );
}
