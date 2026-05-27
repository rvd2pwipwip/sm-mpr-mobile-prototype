import { Link } from "react-router-dom";
import BrowseTagCard from "./BrowseTagCard.jsx";
import {
  externalFaqAnchorProps,
  INFO_ABOUT_PATH,
  INFO_CONTACT_PATH,
  INFO_FAQ_HREF,
  MY_LIBRARY_ACCOUNT_SETTINGS_PATH,
} from "../constants/infoHelpLinks";
import "./AppInfoSwimlane.css";

function publicAssetHref(relativePath) {
  const raw =
    typeof import.meta.env.BASE_URL === "string" ? import.meta.env.BASE_URL : "/";
  const base = raw.endsWith("/") ? raw : `${raw}/`;
  const trimmed = relativePath.replace(/^\/+/, "");
  return `${base}${trimmed}`;
}

const FAQ_OPEN_ICON_MASK_URL = publicAssetHref("openInNew.svg");

const TILE_ACCOUNT = {
  key: "account",
  label: "Account and settings",
  to: MY_LIBRARY_ACCOUNT_SETTINGS_PATH,
};

const TILE_FAQ = {
  key: "faq",
  label: "FAQ",
  href: INFO_FAQ_HREF,
};

const TILE_CONTACT = {
  key: "contact",
  label: "Contact us",
  to: INFO_CONTACT_PATH,
};

const TILE_ABOUT = {
  key: "about",
  label: "About",
  to: INFO_ABOUT_PATH,
};

/** Top row on My Library: gear + App Info title, square tiles (`docs/Plans/My-Library-implementation-plan` Phase 2). */
export default function AppInfoSwimlane() {
  const faqExtras = externalFaqAnchorProps(INFO_FAQ_HREF);

  return (
    <section className="app-info-swimlane" aria-labelledby="app-info-swimlane-title">
      <div className="app-info-swimlane__header">
        <span className="app-info-swimlane__gear" aria-hidden={true} />
        <h2 id="app-info-swimlane-title" className="app-info-swimlane__title">
          App Info
        </h2>
      </div>
      <div className="app-info-swimlane__scroll">
        <div className="app-info-swimlane__scroll-inner">
          <BrowseTagCard
            to={TILE_ACCOUNT.to}
            label={TILE_ACCOUNT.label}
            accentIconSvg="gear.svg"
          />

          <a
            href={TILE_FAQ.href}
            className="app-info-swimlane__tile"
            {...faqExtras}
          >
            <span className="app-info-swimlane__tile-label app-info-swimlane__tile-label--faq">
              <span className="app-info-swimlane__faq-text">{TILE_FAQ.label}</span>
              <span
                className="app-info-swimlane__tile-label-external"
                aria-hidden={true}
                style={{
                  maskImage: `url(${FAQ_OPEN_ICON_MASK_URL})`,
                  WebkitMaskImage: `url(${FAQ_OPEN_ICON_MASK_URL})`,
                }}
              />
            </span>
          </a>

          <Link to={TILE_CONTACT.to} className="app-info-swimlane__tile">
            <span className="app-info-swimlane__tile-label">{TILE_CONTACT.label}</span>
          </Link>

          <Link to={TILE_ABOUT.to} className="app-info-swimlane__tile">
            <span className="app-info-swimlane__tile-label">{TILE_ABOUT.label}</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
