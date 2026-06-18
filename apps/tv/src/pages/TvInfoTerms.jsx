import { INFO_ABOUT_PATH } from "@sm-mpr/shared/constants/infoHelpLinks.js";
import { TV_INFO_ABOUT_RETURN_FOCUS } from "../constants/tvInfoAboutFocus.js";
import { TV_TERMS_PARAGRAPHS } from "../data/tvLegalDocumentContent.js";
import TvInfoEmbeddedDocLayout from "../components/info/TvInfoEmbeddedDocLayout.jsx";

const DEFAULT_RETURN = {
  returnTo: INFO_ABOUT_PATH,
  returnFocus: TV_INFO_ABOUT_RETURN_FOCUS.terms,
};

/** Embedded Terms and Conditions — Figma `7778:26181`. */
export default function TvInfoTerms() {
  return (
    <TvInfoEmbeddedDocLayout
      title="Terms and Conditions"
      scrollbarAriaLabel="Scroll Terms and Conditions"
      defaultReturn={DEFAULT_RETURN}
    >
      <div className="tv-info-embedded-doc__legal-body">
        {TV_TERMS_PARAGRAPHS.map((paragraph, index) => (
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
