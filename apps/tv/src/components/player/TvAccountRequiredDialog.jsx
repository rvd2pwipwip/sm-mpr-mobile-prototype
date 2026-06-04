import { useEffect, useRef } from "react";
import FocusableButton from "../focus/FocusableButton.jsx";
import { useAccountRequiredDialog } from "../../context/AccountRequiredDialogContext.jsx";
import "./TvAccountRequiredDialog.css";

const COPY = {
  favorites: {
    title: "Sign in to save favorites",
    body: "Create a free Stingray account or log in to like channels and stations.",
  },
};

export default function TvAccountRequiredDialog() {
  const {
    accountRequiredDialogOpen,
    accountRequiredDialogVariant,
    dismissAccountRequiredDialog,
  } = useAccountRequiredDialog();
  const dismissRef = useRef(/** @type {HTMLButtonElement | null} */ (null));
  const copy = COPY[accountRequiredDialogVariant] ?? COPY.favorites;

  useEffect(() => {
    if (!accountRequiredDialogOpen) return;
    dismissRef.current?.focus({ preventScroll: true });
  }, [accountRequiredDialogOpen]);

  if (!accountRequiredDialogOpen) return null;

  return (
    <div
      className="tv-account-required-dialog"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tv-account-required-title"
    >
      <div className="tv-account-required-dialog__backdrop" aria-hidden={true} />
      <div className="tv-account-required-dialog__panel">
        <h2 id="tv-account-required-title" className="tv-account-required-dialog__title">
          {copy.title}
        </h2>
        <p className="tv-account-required-dialog__body">{copy.body}</p>
        <FocusableButton
          ref={dismissRef}
          type="button"
          className="tv-account-required-dialog__btn"
          focused
          onClick={dismissAccountRequiredDialog}
        >
          Not now
        </FocusableButton>
      </div>
    </div>
  );
}
