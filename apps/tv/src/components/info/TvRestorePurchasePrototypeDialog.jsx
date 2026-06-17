import { useCallback, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { RESTORE_PURCHASE_PROTOTYPE_DIALOG } from "../../../../mobile/src/constants/infoAccount.js";
import FocusableButton from "../focus/FocusableButton.jsx";
import { useTvStackedDialogOpenFlag } from "../../utils/tvStackedDialogFocus.js";
import "./TvRestorePurchasePrototypeDialog.css";

/** Honest-copy restore stub — mobile `RestorePurchasePrototypeDialog` / Tier A. */
export default function TvRestorePurchasePrototypeDialog({ open, onClose }) {
  const buttonRef = useRef(/** @type {HTMLButtonElement | null} */ (null));
  const { title, primaryLabel, paragraphs } = RESTORE_PURCHASE_PROTOTYPE_DIALOG;

  useTvStackedDialogOpenFlag(open);

  const focusDone = useCallback(() => {
    buttonRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    const frameId = requestAnimationFrame(focusDone);
    return () => cancelAnimationFrame(frameId);
  }, [open, focusDone]);

  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (event) => {
      const key = event.key;
      const isActivate = key === "Enter" || key === " " || key === "Select";
      const isBack = key === "Escape" || key === "Backspace";

      if (!isActivate && !isBack) return;

      event.preventDefault();
      event.stopImmediatePropagation();
      onClose();
    };

    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [open, onClose]);

  if (!open) return null;

  const portalRoot =
    typeof document !== "undefined"
      ? document.querySelector(".tv-viewport")
      : null;

  if (!portalRoot) return null;

  return createPortal(
    <div
      className="tv-restore-purchase-dialog"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tv-restore-purchase-title"
      aria-describedby="tv-restore-purchase-body"
    >
      <button
        type="button"
        className="tv-restore-purchase-dialog__scrim"
        aria-label="Close restore purchases explanation"
        onClick={onClose}
      />
      <div className="tv-restore-purchase-dialog__panel">
        <header className="tv-restore-purchase-dialog__header">
          <h2
            id="tv-restore-purchase-title"
            className="tv-restore-purchase-dialog__title"
          >
            {title}
          </h2>
        </header>
        <div id="tv-restore-purchase-body" className="tv-restore-purchase-dialog__body">
          {paragraphs.map((text) => (
            <p key={text} className="tv-restore-purchase-dialog__line">
              {text}
            </p>
          ))}
        </div>
        <div className="tv-restore-purchase-dialog__actions">
          <FocusableButton
            ref={buttonRef}
            type="button"
            className="tv-restore-purchase-dialog__btn tv-restore-purchase-dialog__btn--primary"
            focused={true}
            onClick={onClose}
          >
            {primaryLabel}
          </FocusableButton>
        </div>
      </div>
    </div>,
    portalRoot,
  );
}
