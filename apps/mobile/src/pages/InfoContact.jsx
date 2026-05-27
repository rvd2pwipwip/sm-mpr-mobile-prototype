import { useNavigate } from "react-router-dom";
import ScreenHeader, { ScreenHeaderChevronBack } from "../components/ScreenHeader";
import {
  INFO_CONTACT_MAIL_BLOCKS,
  INFO_CONTACT_PRIVACY_EMAIL,
  INFO_CONTACT_PRIVACY_NOTE_AFTER,
  INFO_CONTACT_PRIVACY_NOTE_BEFORE,
  INFO_CONTACT_SUPPORT_EMAIL,
} from "../constants/infoContactCopy";
import "./InfoSubPage.css";
import "./InfoContact.css";

/** Contact Us — Figma `5683:78189` shell, copy `5683:78191`. */
export default function InfoContact() {
  const navigate = useNavigate();
  const goBack = () => navigate(-1);
  const supportMail = `mailto:${INFO_CONTACT_SUPPORT_EMAIL}`;
  const privacyMail = `mailto:${INFO_CONTACT_PRIVACY_EMAIL}`;

  return (
    <main className="app-shell app-shell--footer-fixed info-sub-page">
      <ScreenHeader
        title="Contact Us"
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
        <div className="content-inset info-contact">
          <section className="info-contact__block">
            <p className="info-contact__text">Contact us by email:</p>
            <p className="info-contact__text info-contact__text--strong">
              <a className="info-contact__link" href={supportMail}>
                {INFO_CONTACT_SUPPORT_EMAIL}
              </a>
            </p>
          </section>

          <section className="info-contact__block">
            <p className="info-contact__text">or</p>
            <p className="info-contact__text info-contact__spacer" aria-hidden={true}>
              {"\u00a0"}
            </p>
            <p className="info-contact__text">Contact us by mail:</p>
            <div className="info-contact__addresses">
              {INFO_CONTACT_MAIL_BLOCKS.map((block, i) => (
                <div key={i} className="info-contact__address">
                  {block.lines.map((line) => (
                    <p key={line} className="info-contact__address-line">
                      {line}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          </section>

          <p className="info-contact__privacy">
            {INFO_CONTACT_PRIVACY_NOTE_BEFORE}
            <a className="info-contact__link" href={privacyMail}>
              {INFO_CONTACT_PRIVACY_EMAIL}
            </a>
            {INFO_CONTACT_PRIVACY_NOTE_AFTER}
          </p>
        </div>
      </div>
    </main>
  );
}
