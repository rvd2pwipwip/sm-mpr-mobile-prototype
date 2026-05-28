import FixedSwimlane from "./FixedSwimlane.jsx";
import "./SwimlaneRow.css";

/**
 * Inset swimlane title + fixed card row (Figma Home row pattern).
 */
export default function SwimlaneRow({ title, swimlaneProps, hint }) {
  return (
    <section className="swimlane-row" aria-label={title}>
      <h2 className="swimlane-row__title">{title}</h2>
      <FixedSwimlane {...swimlaneProps} />
      {hint ? <p className="swimlane-row__hint">{hint}</p> : null}
    </section>
  );
}
