import AppStackedDialog from "./AppStackedDialog";
import {
  STINGRAY_ACCOUNT_LOGIN_URL,
  STINGRAY_SIGNUP_EMAIL_URL,
} from "../constants/externalLinks";
import { useGuestMusicSkips } from "../context/GuestMusicSkipContext";
import { useUserType } from "../context/UserTypeContext";

/**
 * Modal when guest has used all hourly music skips.
 * Figma: node 5568:166350 — shell matches `AppStackedDialog` (`9585:70503`).
 * Create account / Log in: same as Info Account guest (`InfoAccountSection`).
 */
export default function GuestSkipLimitDialog() {
  const { setUserType } = useUserType();
  const { skipLimitDialogOpen, skipLimitDialogMinutes, dismissSkipLimitDialog } =
    useGuestMusicSkips();

  const createFreeAccount = () => {
    dismissSkipLimitDialog();
    setUserType("freeStingray");
    window.open(STINGRAY_SIGNUP_EMAIL_URL, "_blank", "noopener,noreferrer");
  };

  const goLogin = () => {
    dismissSkipLimitDialog();
    setUserType("freeStingray");
    window.open(STINGRAY_ACCOUNT_LOGIN_URL, "_blank", "noopener,noreferrer");
  };

  return (
    <AppStackedDialog
      open={skipLimitDialogOpen}
      onClose={dismissSkipLimitDialog}
      title="Skip limit reached"
      titleId="guest-skip-limit-title"
      descriptionId="guest-skip-limit-body"
      primaryButton={{
        label: "Create free account",
        onClick: createFreeAccount,
        variant: "subscribe-primary",
      }}
      secondaryButton={{
        label: "Log in",
        onClick: goLogin,
        appearance: "outline",
      }}
      tertiaryButton={{
        label: "Not now",
        onClick: dismissSkipLimitDialog,
      }}
    >
      <p className="app-stacked-dialog__lede">
        You&apos;ve used all your skips for now. Another skip unlocks in about{" "}
        <strong>{skipLimitDialogMinutes} minutes</strong>.
      </p>
      <p className="app-stacked-dialog__lede app-stacked-dialog__lede--after">
        Create an account or log in for unlimited skips.
      </p>
    </AppStackedDialog>
  );
}
