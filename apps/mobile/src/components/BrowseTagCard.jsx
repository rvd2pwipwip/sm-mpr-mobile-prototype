import { Link } from "react-router-dom";
import "./BrowseTagCard.css";

function tagKindLabel(type) {
  if (type === "country") return "Country";
  if (type === "subdivision") return "Region";
  if (type === "city") return "City";
  return "Region";
}

function vitePublicHref(relativePath) {
  const raw =
    typeof import.meta.env.BASE_URL === "string" ? import.meta.env.BASE_URL : "/";
  const base = raw.endsWith("/") ? raw : `${raw}/`;
  const trimmed = relativePath.replace(/^\/+/, "");
  return `${base}${trimmed}`;
}

function flagPublicSrc(iso2) {
  return vitePublicHref(`flags/${iso2.toLowerCase()}.svg`);
}

/**
 * Swimlane tile for browse taxonomy: default **`kind`** line + **`label`**; or stacked accent (**`flagIso2`** or **`accentIconSvg`**).
 *
 * **`to`**: render as **`Link`** (same look as button). Otherwise **`button`** + **`onSelect`**.
 *
 * @param {{
 *   label: string,
 *   geoType?: string,
 *   onSelect?: () => void,
 *   flagIso2?: string,
 *   accentIconSvg?: string,
 *   to?: string,
 * }} props
 */
export default function BrowseTagCard({
  label,
  geoType = "country",
  onSelect,
  flagIso2,
  accentIconSvg,
  to,
}) {
  const kind = tagKindLabel(geoType);
  const trimmedFlag =
    typeof flagIso2 === "string" ? flagIso2.trim() : "";
  const hasFlag = /^[a-z]{2}$/i.test(trimmedFlag);

  const trimmedAccentSvg =
    typeof accentIconSvg === "string" ? accentIconSvg.trim() : "";
  const accentMaskUrl =
    trimmedAccentSvg.length > 0 ? vitePublicHref(trimmedAccentSvg) : "";
  const hasAccentIcon = accentMaskUrl.length > 0;

  const stacked = hasFlag || hasAccentIcon;
  const rootClass = [
    "browse-tag-card",
    stacked ? "browse-tag-card--accent" : "",
    typeof to === "string" && to ? "browse-tag-card--router-link" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const stackedContent = hasFlag ? (
    <span className="browse-tag-card__accent-stack">
      <span className="browse-tag-card__accent-slot" aria-hidden={true}>
        <span className="browse-tag-card__accent-ring">
          <img
            className="browse-tag-card__accent-img browse-tag-card__accent-img--flag"
            src={flagPublicSrc(trimmedFlag)}
            alt=""
            width={56}
            height={56}
            loading="lazy"
            decoding="async"
          />
        </span>
      </span>
      <span className="browse-tag-card__accent-caption">{label}</span>
    </span>
  ) : hasAccentIcon ? (
    <span className="browse-tag-card__accent-stack">
      <span className="browse-tag-card__accent-slot" aria-hidden={true}>
        <span className="browse-tag-card__accent-ring browse-tag-card__accent-ring--icon-slot">
          <span
            className="browse-tag-card__accent-icon-mask"
            style={{
              maskImage: `url(${accentMaskUrl})`,
              WebkitMaskImage: `url(${accentMaskUrl})`,
            }}
          />
        </span>
      </span>
      <span className="browse-tag-card__accent-caption">{label}</span>
    </span>
  ) : null;

  const defaultContent = stacked ? stackedContent : (
    <>
      <span className="browse-tag-card__kind">{kind}</span>
      <span className="browse-tag-card__label">{label}</span>
    </>
  );

  const ariaNav = stacked ? `${label}` : `Browse ${label}`;

  if (typeof to === "string" && to) {
    return (
      <Link
        className={rootClass}
        to={to}
        aria-label={ariaNav}
      >
        {defaultContent}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={rootClass}
      onClick={onSelect}
      aria-label={ariaNav}
    >
      {defaultContent}
    </button>
  );
}
