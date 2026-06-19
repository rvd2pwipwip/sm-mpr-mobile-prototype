import { useEffect } from "react";
import { useSwipeDownDismiss } from "../../hooks/useSwipeDownDismiss.js";
import "./PlayerInfoBottomSheet.css";

/**
 * Slide-up info panel over the full-screen player — mobile shell width,
 * mini-player top radius, scrim tap + swipe-down dismiss.
 */
export default function PlayerInfoBottomSheet({
  open,
  onClose,
  ariaLabelledBy,
  children,
}) {
  const { scrollElRef, onTouchStart, onTouchEnd } = useSwipeDownDismiss(onClose);

  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (event) => {
      if (event.key !== "Escape") return;
      event.preventDefault();
      onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="player-info-bottom-sheet" role="presentation">
      <button
        type="button"
        className="player-info-bottom-sheet__scrim"
        aria-label="Close info"
        onClick={onClose}
      />
      <div
        className="player-info-bottom-sheet__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby={ariaLabelledBy}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        <div className="player-info-bottom-sheet__grab" aria-hidden={true}>
          <span className="player-info-bottom-sheet__grab-bar" />
        </div>
        <div ref={scrollElRef} className="player-info-bottom-sheet__scroll">
          {children}
        </div>
      </div>
    </div>
  );
}
