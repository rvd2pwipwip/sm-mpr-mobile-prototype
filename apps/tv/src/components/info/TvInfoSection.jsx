/**
 * Static section block — always expanded (no collapse on TV).
 */
export default function TvInfoSection({ sectionId, title, children }) {
  const titleId = `tv-info-section-${sectionId}-title`;

  return (
    <section className="tv-info-section" aria-labelledby={titleId}>
      <h2 id={titleId} className="tv-info-section__title">
        {title}
      </h2>
      <div className="tv-info-section__body">{children}</div>
    </section>
  );
}
