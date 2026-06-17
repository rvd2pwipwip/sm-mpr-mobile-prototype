import {
  INFO_CONTACT_MAIL_BLOCKS,
  INFO_CONTACT_PRIVACY_EMAIL,
  INFO_CONTACT_PRIVACY_NOTE_AFTER,
  INFO_CONTACT_PRIVACY_NOTE_BEFORE,
  INFO_CONTACT_SUPPORT_EMAIL,
} from "../../../mobile/src/constants/infoContactCopy.js";
import TvInfoSubPageLayout from "../components/info/TvInfoSubPageLayout.jsx";
import "./TvInfoContact.css";

/** Contact us — Figma TV `7775:23848` (`bodyContactUs`). */
export default function TvInfoContact() {
  const supportMail = `mailto:${INFO_CONTACT_SUPPORT_EMAIL}`;
  const privacyMail = `mailto:${INFO_CONTACT_PRIVACY_EMAIL}`;

  return (
    <TvInfoSubPageLayout title="Contact us">
      <div className="tv-info-contact">
        <section className="tv-info-contact__email">
          <p className="tv-info-contact__heading">Contact us by email:</p>
          <p className="tv-info-contact__email-value">
            <a
              className="tv-info-contact__link"
              href={supportMail}
              tabIndex={-1}
            >
              {INFO_CONTACT_SUPPORT_EMAIL}
            </a>
          </p>
        </section>

        <section className="tv-info-contact__mail">
          <div className="tv-info-contact__mail-intro">
            <p>or</p>
            <p aria-hidden={true}>{"\u00a0"}</p>
            <p>Contact us by mail:</p>
          </div>

          <div className="tv-info-contact__addresses">
            {INFO_CONTACT_MAIL_BLOCKS.map((block) => (
              <div
                key={block.lines.join("-")}
                className="tv-info-contact__address"
              >
                {block.lines.map((line) => (
                  <p key={line} className="tv-info-contact__address-line">
                    {line}
                  </p>
                ))}
              </div>
            ))}
          </div>
        </section>

        <p className="tv-info-contact__privacy">
          {INFO_CONTACT_PRIVACY_NOTE_BEFORE}
          <a
            className="tv-info-contact__link"
            href={privacyMail}
            tabIndex={-1}
          >
            {INFO_CONTACT_PRIVACY_EMAIL}
          </a>
          {INFO_CONTACT_PRIVACY_NOTE_AFTER}
        </p>
      </div>
    </TvInfoSubPageLayout>
  );
}
