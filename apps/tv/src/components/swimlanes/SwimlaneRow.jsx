import FixedSwimlane from "./FixedSwimlane.jsx";
import MixedWidthSwimlane from "./MixedWidthSwimlane.jsx";
import "./SwimlaneRow.css";

/**
 * Inset swimlane title + horizontal card row (Figma Home row pattern).
 * Omit `title` to hide the visible heading; pass `ariaLabel` for the section name.
 *
 * @param {boolean} [mixedWidth] — per-slot measured widths ({@link MixedWidthSwimlane});
 *   default {@link FixedSwimlane} when every slot is the same width.
 */
export default function SwimlaneRow({
  title,
  ariaLabel,
  swimlaneProps,
  hint,
  mixedWidth = false,
}) {
  const sectionLabel = ariaLabel ?? title ?? "Swimlane";
  const Swimlane = mixedWidth ? MixedWidthSwimlane : FixedSwimlane;

  return (
    <section className="swimlane-row" aria-label={sectionLabel}>
      {title ? <h2 className="swimlane-row__title">{title}</h2> : null}
      <Swimlane {...swimlaneProps} />
      {hint ? <p className="swimlane-row__hint">{hint}</p> : null}
    </section>
  );
}
