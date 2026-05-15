import "./BrowseTagCard.css";

function tagKindLabel(type) {
  if (type === "country") return "Country";
  if (type === "subdivision") return "Region";
  if (type === "city") return "City";
  return "Region";
}

/**
 * Swimlane tile for browse taxonomy without artwork (prototype placeholder until flags/CDN art).
 *
 * @param {{
 *   label: string,
 *   geoType?: string,
 *   onSelect?: () => void,
 * }} props
 */
export default function BrowseTagCard({ label, geoType = "country", onSelect }) {
  const kind = tagKindLabel(geoType);

  return (
    <button
      type="button"
      className="browse-tag-card"
      onClick={onSelect}
      aria-label={`Browse ${label}`}
    >
      <span className="browse-tag-card__kind">{kind}</span>
      <span className="browse-tag-card__label">{label}</span>
    </button>
  );
}
