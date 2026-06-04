import { useEffect, useRef } from "react";
import FocusableButton from "../focus/FocusableButton.jsx";
import { useGuestMusicSkips } from "../../context/GuestMusicSkipContext.jsx";
import { useUserType } from "../../context/UserTypeContext.jsx";
import "./TvGuestSkipLimitDialog.css";

export default function TvGuestSkipLimitDialog() {
  const { setUserType } = useUserType();
  const {
    skipLimitDialogOpen,
    skipLimitDialogMinutes,
    dismissSkipLimitDialog,
  } = useGuestMusicSkips();
  const dismissRef = useRef(/** @type {HTMLButtonElement | null} */ (null));

  useEffect(() => {
    if (!skipLimitDialogOpen) return;
    dismissRef.current?.focus({ preventScroll: true });
  }, [skipLimitDialogOpen]);

  if (!skipLimitDialogOpen) return null;

  return (
    <div
      className="tv-guest-skip-dialog"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tv-guest-skip-title"
    >
      <div className="tv-guest-skip-dialog__backdrop" aria-hidden={true} />
      <div className="tv-guest-skip-dialog__panel">
        <h2 id="tv-guest-skip-title" className="tv-guest-skip-dialog__title">
          Skip limit reached
        </h2>
        <p className="tv-guest-skip-dialog__body">
          You have used all your skips for now. Another skip unlocks in about{" "}
          <strong>{skipLimitDialogMinutes} minutes</strong>.
        </p>
        <p className="tv-guest-skip-dialog__body">
          Create an account or log in for unlimited skips.
        </p>
        <div className="tv-guest-skip-dialog__actions">
          <FocusableButton
            type="button"
            className="tv-guest-skip-dialog__btn tv-guest-skip-dialog__btn--primary"
            onClick={() => {
              dismissSkipLimitDialog();
              setUserType("freeStingray");
            }}
          >
            Create free account
          </FocusableButton>
          <FocusableButton
            ref={dismissRef}
            type="button"
            className="tv-guest-skip-dialog__btn"
            focused
            onClick={dismissSkipLimitDialog}
          >
            Not now
          </FocusableButton>
        </div>
      </div>
    </div>
  );
}
