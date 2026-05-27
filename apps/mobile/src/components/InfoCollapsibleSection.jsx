import "./InfoCollapsibleSection.css";

/**
 * One collapsible block on the Info tab: header control + optional body.
 * Multiple sections may be open; state lives in the parent (Phase 2 Info shell).
 */
export default function InfoCollapsibleSection({
  sectionId,
  title,
  expanded,
  onToggle,
  children,
}) {
  const headerId = `info-section-${sectionId}-header`;
  const panelId = `info-section-${sectionId}-panel`;

  return (
    <section className="info-collapsible" aria-labelledby={headerId}>
      <button
        type="button"
        id={headerId}
        className="info-collapsible__header"
        aria-expanded={expanded}
        aria-controls={panelId}
        onClick={onToggle}
      >
        <span className="info-collapsible__title">{title}</span>
        <span
          className={[
            "info-collapsible__chevron",
            expanded ? "info-collapsible__chevron--expanded" : "",
          ]
            .filter(Boolean)
            .join(" ")}
          aria-hidden={true}
        />
      </button>
      <div
        id={panelId}
        role="region"
        aria-labelledby={headerId}
        hidden={!expanded}
        className="info-collapsible__panel"
      >
        <div className="info-collapsible__body">{children}</div>
      </div>
    </section>
  );
}
