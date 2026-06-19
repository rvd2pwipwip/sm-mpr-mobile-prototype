import { useEffect } from "react";
import "./TvPlayerInfoBottomSheet.css";

/**
 * Slide-up info panel over the full-screen player — Figma `15883:37549`.
 * Esc closes the sheet first; GlobalTvKeys defers while `aria-modal` is set.
 * Does not set `tvDialogOpen` — that flag blocks in-sheet D-pad navigation.
 */
export default function TvPlayerInfoBottomSheet({
  open,
  onClose,
  ariaLabelledBy,
  children,
}) {
  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (event) => {
      const isBack = event.key === "Escape" || event.key === "Backspace";
      if (!isBack) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      onClose();
    };

    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="tv-player-info-sheet" role="presentation">
      <button
        type="button"
        className="tv-player-info-sheet__scrim"
        aria-label="Close info"
        onClick={onClose}
      />
      <div
        className="tv-player-info-sheet__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={ariaLabelledBy}
      >
        <div className="tv-player-info-sheet__body">{children}</div>
      </div>
    </div>
  );
}
