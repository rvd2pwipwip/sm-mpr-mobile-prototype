import "./ScreenHeader.css";

/**
 * Generic stack header — Figma `screenHeaders` / `.screenHeader` (e.g. node `19737:48141`).
 * Fixed **80px** bar, **no** Home-style `--safe-area-inset-top` padding inside the bar; title stays
 * **true center** of the strip; optional `startSlot` / `endSlot` sit above the title layer (`z-index`).
 */
export default function ScreenHeader({ title, startSlot, endSlot, className = "" }) {
  const rootClass = ["screen-header", className].filter(Boolean).join(" ");

  let titleContent = null;
  if (title != null && title !== false) {
    titleContent =
      typeof title === "string" ? (
        <h1 className="screen-header__title">{title}</h1>
      ) : (
        <div className="screen-header__title-slot">{title}</div>
      );
  }

  return (
    <header className={rootClass} role="banner">
      <div className="screen-header__chrome">
        {startSlot ? (
          <div className="screen-header__side screen-header__side--start">{startSlot}</div>
        ) : null}
        {endSlot ? (
          <div className="screen-header__side screen-header__side--end">{endSlot}</div>
        ) : null}
        {titleContent ? (
          <div className="screen-header__title-layer">{titleContent}</div>
        ) : null}
      </div>
    </header>
  );
}

/** Back control — `public/back.svg` via mask; pair with `screen-header__icon-btn` (50×50 tap target). */
export function ScreenHeaderChevronBack() {
  return <span className="screen-header__back-icon" aria-hidden={true} />;
}
