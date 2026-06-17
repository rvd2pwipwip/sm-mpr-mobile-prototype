import { useNavigate } from "react-router-dom";
import "./TvScreenHeaderTitle.css";

/**
 * Centered drill / overlay screen title. Optional mouse-only easter egg (not in D-pad order).
 */
export default function TvScreenHeaderTitle({
  title,
  easterEgg = null,
}) {
  const navigate = useNavigate();

  if (!easterEgg) {
    return <h1 className="tv-screen-header-title">{title}</h1>;
  }

  const { ariaLabel, path = "/settings/user-type" } = easterEgg;

  return (
    <button
      type="button"
      className="tv-screen-header-title-toggle"
      onClick={() => navigate(path)}
      tabIndex={-1}
      aria-label={ariaLabel}
    >
      <span className="tv-screen-header-title">{title}</span>
    </button>
  );
}
