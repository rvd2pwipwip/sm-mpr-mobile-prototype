import FixedSwimlane from "./FixedSwimlane.jsx";
import "./SwimlaneRow.css";

/**
 * Inset swimlane title + fixed card row (Figma Home row pattern).
 * Omit `title` to hide the visible heading; pass `ariaLabel` for the section name.
 */
export default function SwimlaneRow({
  title,
  ariaLabel,
  swimlaneProps,
  hint,
}) {
  const sectionLabel = ariaLabel ?? title ?? "Swimlane";

  return (
    <section className="swimlane-row" aria-label={sectionLabel}>
      {title ? <h2 className="swimlane-row__title">{title}</h2> : null}
      <FixedSwimlane {...swimlaneProps} />
      {hint ? <p className="swimlane-row__hint">{hint}</p> : null}
    </section>
  );
}
