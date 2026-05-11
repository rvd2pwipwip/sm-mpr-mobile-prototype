import Button from "./Button";
import "./AppStackedDialog.css";

/**
 * Modal with strong header band + body + stacked actions.
 * Figma shell: node `9585:70503` (dialogsAccountAudioQuality); reuse for guest skip and other promos.
 *
 * @param {object} props
 * @param {boolean} props.open
 * @param {() => void} props.onClose — scrim tap (and optional Esc could be added later)
 * @param {string} [props.scrimCloseLabel='Close dialog']
 * @param {string} props.title
 * @param {string} props.titleId — `aria-labelledby`
 * @param {string} props.descriptionId — `aria-describedby` (applied to body wrapper)
 * @param {import('react').ReactNode} props.children — body copy (nodes)
 * @param {{ label: string, onClick: () => void, variant?: 'subscribe-primary'|'cta', className?: string } | null} [props.primaryButton]
 * @param {{ label: string, onClick: () => void, appearance?: 'outline'|'link', className?: string } | null} [props.secondaryButton]
 * @param {{ label: string, onClick: () => void, className?: string } | null} [props.tertiaryButton] — shown after secondary; always link style (e.g. “Not now”)
 */
export default function AppStackedDialog({
  open,
  onClose,
  scrimCloseLabel = "Close dialog",
  title,
  titleId,
  descriptionId,
  children,
  primaryButton,
  secondaryButton,
  tertiaryButton,
}) {
  if (!open) {
    return null;
  }

  return (
    <div
      className="app-stacked-dialog"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
    >
      <button
        type="button"
        className="app-stacked-dialog__scrim"
        aria-label={scrimCloseLabel}
        onClick={onClose}
      />
      <div className="app-stacked-dialog__panel">
        <header className="app-stacked-dialog__header">
          <h2 id={titleId} className="app-stacked-dialog__title">
            {title}
          </h2>
        </header>
        <div id={descriptionId} className="app-stacked-dialog__body">
          {children}
        </div>
        {primaryButton || secondaryButton || tertiaryButton ? (
          <div className="app-stacked-dialog__actions">
            {primaryButton ? (
              <Button
                type="button"
                variant={primaryButton.variant ?? "subscribe-primary"}
                className={[
                  "app-stacked-dialog__btn-wide",
                  primaryButton.className ?? "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={primaryButton.onClick}
              >
                {primaryButton.label}
              </Button>
            ) : null}
            {secondaryButton ? (
              secondaryButton.appearance === "link" ? (
                <button
                  type="button"
                  className={[
                    "app-stacked-dialog__link-btn",
                    secondaryButton.className ?? "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={secondaryButton.onClick}
                >
                  {secondaryButton.label}
                </button>
              ) : (
                <Button
                  type="button"
                  variant="secondary"
                  className={[
                    "app-stacked-dialog__btn-wide",
                    secondaryButton.className ?? "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={secondaryButton.onClick}
                >
                  {secondaryButton.label}
                </Button>
              )
            ) : null}
            {tertiaryButton ? (
              <button
                type="button"
                className={[
                  "app-stacked-dialog__link-btn",
                  tertiaryButton.className ?? "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={tertiaryButton.onClick}
              >
                {tertiaryButton.label}
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
