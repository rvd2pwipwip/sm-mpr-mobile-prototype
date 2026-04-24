import "./ContentSwimlane.css";

/**
 * Horizontal swimlane: inset row title + “More”, full-bleed scroll with inner gutters.
 * Pass card components as children (see `App.jsx`). Touch-oriented; no web a11y extras.
 *
 * @param {{
 *   title: string,
 *   children: import("react").ReactNode,
 *   showMore?: boolean,
 *   onMore?: () => void,
 * }} props
 */
export default function ContentSwimlane({
  title,
  children,
  showMore = true,
  onMore,
}) {
  return (
    <section className="content-swimlane">
      <div className="content-swimlane__header">
        <h2 className="content-swimlane__title">{title}</h2>
        {showMore ? (
          <div className="content-swimlane__more" onClick={onMore}>
            More
          </div>
        ) : null}
      </div>
      <div className="content-swimlane__scroll">
        <div className="content-swimlane__scroll-inner">{children}</div>
      </div>
    </section>
  );
}
