import { INFO_ABOUT_PATH } from "@sm-mpr/shared/constants/infoHelpLinks.js";
import { TV_INFO_ABOUT_RETURN_FOCUS } from "../constants/tvInfoAboutFocus.js";
import { TV_PRIVACY_PARAGRAPHS } from "../data/tvLegalDocumentContent.js";
import TvInfoEmbeddedDocLayout from "../components/info/TvInfoEmbeddedDocLayout.jsx";

const DEFAULT_RETURN = {
  returnTo: INFO_ABOUT_PATH,
  returnFocus: TV_INFO_ABOUT_RETURN_FOCUS.privacy,
};

/** Embedded Privacy Policy — Figma `7778:26361`. */
export default function TvInfoPrivacy() {
  return (
    <TvInfoEmbeddedDocLayout
      title="Privacy Policy"
      scrollbarAriaLabel="Scroll Privacy Policy"
      defaultReturn={DEFAULT_RETURN}
    >
      <div className="tv-info-embedded-doc__legal-body">
        {TV_PRIVACY_PARAGRAPHS.map((paragraph, index) => (
          <p
            key={index}
            className="tv-info-embedded-doc__legal-paragraph"
          >
            {paragraph}
          </p>
        ))}
      </div>
    </TvInfoEmbeddedDocLayout>
  );
}
