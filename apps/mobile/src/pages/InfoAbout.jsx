import { useNavigate } from "react-router-dom";
import ExternalSecondaryLink from "../components/ExternalSecondaryLink";
import ScreenHeader, { ScreenHeaderChevronBack } from "../components/ScreenHeader";
import { LEGAL_LINKS } from "../constants/legalLinks";
import {
  INFO_ABOUT_COPYRIGHT_LINES,
  INFO_ABOUT_TRADEMARK,
  INFO_APP_VERSION,
} from "../constants/infoAboutCopy";
import "./InfoSubPage.css";
import "./InfoAbout.css";

/** About — Figma `5683:78416`; legal URLs from `legalLinks.js`. */
export default function InfoAbout() {
  const navigate = useNavigate();
  const goBack = () => navigate(-1);

  return (
    <main className="app-shell app-shell--footer-fixed info-sub-page">
      <ScreenHeader
        title="About"
        startSlot={
          <button
            type="button"
            className="screen-header__icon-btn"
            onClick={goBack}
            aria-label="Back"
          >
            <ScreenHeaderChevronBack />
          </button>
        }
      />

      <div className="info-sub-page__scroll">
        <div className="content-inset info-about">
          <div className="info-about__brand" aria-hidden={true}>
            <img
              className="info-about__wordmark info-about__wordmark--light"
              src="/stingrayMusic.svg"
              alt=""
              width="210"
              height="61"
              loading="lazy"
              decoding="async"
            />
            <img
              className="info-about__wordmark info-about__wordmark--dark"
              src="/stingrayMusicDark.svg"
              alt=""
              width="210"
              height="61"
              loading="lazy"
              decoding="async"
            />
          </div>

          <p className="info-about__version">Version {INFO_APP_VERSION}</p>

          <div className="info-about__copyright">
            {INFO_ABOUT_COPYRIGHT_LINES.map((line) => (
              <p key={line} className="info-about__copyright-line">
                {line}
              </p>
            ))}
          </div>

          <p className="info-about__trademark">{INFO_ABOUT_TRADEMARK}</p>

          <div className="info-about__legal-btns">
            {LEGAL_LINKS.map(({ id, label, href }) => (
              <ExternalSecondaryLink
                key={id}
                href={href}
                className="info-about__legal-link"
              >
                {label}
              </ExternalSecondaryLink>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
