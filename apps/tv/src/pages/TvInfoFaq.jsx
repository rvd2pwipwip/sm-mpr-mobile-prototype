import { MY_LIBRARY_FAQ_RETURN_FOCUS } from "../constants/myLibraryAppInfoFocus.js";
import TvInfoEmbeddedDocLayout from "../components/info/TvInfoEmbeddedDocLayout.jsx";
import { TV_FAQ_ITEMS } from "../data/tvFaqContent.js";

const MY_LIBRARY_PATH = "/my-library";

const DEFAULT_RETURN = {
  returnTo: MY_LIBRARY_PATH,
  returnFocus: MY_LIBRARY_FAQ_RETURN_FOCUS,
};

/** Embedded FAQ — Figma `7775:23803`; scrollbar focus like Channel Info More dialog. */
export default function TvInfoFaq() {
  return (
    <TvInfoEmbeddedDocLayout
      title="FAQ"
      scrollbarAriaLabel="Scroll FAQ"
      defaultReturn={DEFAULT_RETURN}
    >
      <div className="tv-info-embedded-doc__faq-list">
        {TV_FAQ_ITEMS.map((item) => (
          <article key={item.id} className="tv-info-embedded-doc__faq-item">
            <h2 className="tv-info-embedded-doc__faq-question">
              {item.question}
            </h2>
            <p className="tv-info-embedded-doc__faq-answer">{item.answer}</p>
          </article>
        ))}
      </div>
    </TvInfoEmbeddedDocLayout>
  );
}
