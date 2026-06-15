import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { LISTEN_AGAIN_CLEAR_CONFIRM } from "@sm-mpr/shared/constants/listenHistory.js";
import FocusableButton from "../focus/FocusableButton.jsx";
import { useTvStackedDialogOpenFlag } from "../../utils/tvStackedDialogFocus.js";
import "./TvListenHistoryClearDialog.css";

const BUTTON = {
  confirm: 0,
  cancel: 1,
};

/**
 * Listen again Clear speed bump (mobile `ListenAgainMore` / `AppStackedDialog`).
 */
export default function TvListenHistoryClearDialog({
  open,
  onClose,
  onConfirm,
  confirm = LISTEN_AGAIN_CLEAR_CONFIRM,
}) {
  const [focusedButton, setFocusedButton] = useState(BUTTON.cancel);
  const focusedButtonRef = useRef(BUTTON.cancel);
  const buttonRefs = useRef(
    /** @type {(HTMLButtonElement | null)[]} */ ([null, null]),
  );

  useTvStackedDialogOpenFlag(open);

  const focusButton = useCallback((index) => {
    const next = Math.min(Math.max(index, 0), 1);
    focusedButtonRef.current = next;
    setFocusedButton(next);
    buttonRefs.current[next]?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    focusedButtonRef.current = BUTTON.cancel;
    setFocusedButton(BUTTON.cancel);
    const frameId = requestAnimationFrame(() => {
      buttonRefs.current[BUTTON.cancel]?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frameId);
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (event) => {
      const key = event.key;
      const isNav =
        key === "ArrowLeft" ||
        key === "ArrowRight" ||
        key === "ArrowUp" ||
        key === "ArrowDown";
      const isActivate = key === "Enter" || key === " " || key === "Select";
      const isBack = key === "Escape" || key === "Backspace";

      if (!isNav && !isActivate && !isBack) return;

      event.preventDefault();
      event.stopImmediatePropagation();

      if (isBack) {
        onClose();
        return;
      }

      if (isActivate) {
        if (focusedButtonRef.current === BUTTON.confirm) {
          onConfirm();
        } else {
          onClose();
        }
        return;
      }

      const delta =
        key === "ArrowRight" || key === "ArrowDown" ? 1 : -1;
      focusButton(focusedButtonRef.current + delta);
    };

    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [open, onClose, onConfirm, focusButton]);

  if (!open) return null;

  const portalRoot =
    typeof document !== "undefined"
      ? document.querySelector(".tv-viewport")
      : null;

  if (!portalRoot) return null;

  return createPortal(
    <div
      className="tv-listen-history-clear-dialog"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tv-listen-history-clear-title"
      aria-describedby="tv-listen-history-clear-desc"
    >
      <button
        type="button"
        className="tv-listen-history-clear-dialog__scrim"
        aria-label="Close dialog without clearing listening history"
        onClick={onClose}
      />
      <div className="tv-listen-history-clear-dialog__panel">
        <header className="tv-listen-history-clear-dialog__header">
          <h2
            id="tv-listen-history-clear-title"
            className="tv-listen-history-clear-dialog__title"
          >
            {confirm.dialogTitle}
          </h2>
        </header>
        <div
          id="tv-listen-history-clear-desc"
          className="tv-listen-history-clear-dialog__body"
        >
          <p className="tv-listen-history-clear-dialog__confirm-line">
            Are you sure you want to clear your{" "}
            {confirm.bodyPhrase}?
          </p>
          <p className="tv-listen-history-clear-dialog__confirm-line">
            This action cannot be undone.
          </p>
        </div>
        <div className="tv-listen-history-clear-dialog__actions">
          <FocusableButton
            ref={(node) => {
              buttonRefs.current[BUTTON.confirm] = node;
            }}
            type="button"
            className="tv-listen-history-clear-dialog__btn tv-listen-history-clear-dialog__btn--primary"
            focused={focusedButton === BUTTON.confirm}
            onClick={onConfirm}
          >
            {confirm.primaryLabel}
          </FocusableButton>
          <FocusableButton
            ref={(node) => {
              buttonRefs.current[BUTTON.cancel] = node;
            }}
            type="button"
            className="tv-listen-history-clear-dialog__btn tv-listen-history-clear-dialog__btn--secondary"
            focused={focusedButton === BUTTON.cancel}
            onClick={onClose}
          >
            Cancel
          </FocusableButton>
        </div>
      </div>
    </div>,
    portalRoot,
  );
}
