import Button from "./Button";
import { useGuestMusicSkips } from "../context/GuestMusicSkipContext";
import { useGoUpgrade } from "../hooks/useGoUpgrade";
import "./GuestSkipLimitDialog.css";

/**
 * Modal when guest has used all hourly music skips.
 * Figma: node 5568:166350 (UX-SM-MPR-Mobile-2604).
 */
export default function GuestSkipLimitDialog() {
  const goUpgradeNav = useGoUpgrade();
  const { skipLimitDialogOpen, skipLimitDialogMinutes, dismissSkipLimitDialog } =
    useGuestMusicSkips();

  if (!skipLimitDialogOpen) {
    return null;
  }

  const goUpgrade = () => {
    dismissSkipLimitDialog();
    goUpgradeNav();
  };

  return (
    <div
      className="guest-skip-limit"
      role="dialog"
      aria-modal="true"
      aria-labelledby="guest-skip-limit-title"
      aria-describedby="guest-skip-limit-body"
    >
      <button
        type="button"
        className="guest-skip-limit__scrim"
        aria-label="Close dialog"
        onClick={dismissSkipLimitDialog}
      />
      <div className="guest-skip-limit__panel">
        <h2 id="guest-skip-limit-title" className="guest-skip-limit__title">
          Skip limit reached
        </h2>
        <p id="guest-skip-limit-body" className="guest-skip-limit__body">
          You’ve used all your skips for now. Another skip unlocks in about{" "}
          <strong>{skipLimitDialogMinutes} minutes</strong>. Create an account or log in for
          unlimited skips.
        </p>
        <div className="guest-skip-limit__actions">
          <Button variant="subscribe-primary" className="guest-skip-limit__primary" onClick={goUpgrade}>
            Create account / Log in
          </Button>
        </div>
        <button type="button" className="guest-skip-limit__secondary" onClick={dismissSkipLimitDialog}>
          Not now
        </button>
      </div>
    </div>
  );
}
