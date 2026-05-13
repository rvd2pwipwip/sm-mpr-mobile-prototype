import { Link } from "react-router-dom";
import {
  externalFaqAnchorProps,
  INFO_ABOUT_PATH,
  INFO_CONTACT_PATH,
  INFO_FAQ_HREF,
  MY_LIBRARY_ACCOUNT_SETTINGS_PATH,
} from "../constants/infoHelpLinks";
import "./AppInfoSwimlane.css";

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
          <Link
            to={TILE_ACCOUNT.to}
            className="app-info-swimlane__tile"
          >
            <span className="app-info-swimlane__tile-label">{TILE_ACCOUNT.label}</span>
          </Link>

          <a
            href={TILE_FAQ.href}
            className="app-info-swimlane__tile"
            {...faqExtras}
          >
            <span className="app-info-swimlane__tile-label">{TILE_FAQ.label}</span>
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
