import AppStackedDialog from "./AppStackedDialog";
import {
  STINGRAY_ACCOUNT_LOGIN_URL,
  STINGRAY_SIGNUP_EMAIL_URL,
} from "../constants/externalLinks";
import { useAccountRequiredDialog } from "../context/AccountRequiredDialogContext";
import { useUserType } from "../context/UserTypeContext";

/**
 * Guest blocked from a user-library action — sign in / create account (Figma favorites shell
 * `5568:164903` / `dialogsAccountToFavorite`; same `AppStackedDialog` as `GuestSkipLimitDialog`).
 */

/** @type {Record<string, { title: string, body: string }>} */
const ACCOUNT_REQUIRED_COPY = {
  favorites: {
    title: "Add to Favorites",
    body: "Create free account or log in to add music channels and radio stations to your favorites.",
  },
  podcastSubscribe: {
    title: "Subscribe to podcasts",
    body: "Create free account or log in to subscribe to shows and see new episodes in your library.",
  },
  episodeBookmark: {
    title: "Bookmark episodes",
    body: "Create free account or log in to bookmark episodes for quick access later.",
  },
  episodeOfflineDownload: {
    title: "Download episodes",
    body: "Create free account or log in to download episodes for offline listening.",
  },
};

export default function AccountRequiredDialog() {
  const { setUserType } = useUserType();
  const {
    accountRequiredDialogOpen,
    accountRequiredDialogVariant,
    dismissAccountRequiredDialog,
  } = useAccountRequiredDialog();

  const copy =
    ACCOUNT_REQUIRED_COPY[accountRequiredDialogVariant] ??
    ACCOUNT_REQUIRED_COPY.favorites;

  const createFreeAccount = () => {
    dismissAccountRequiredDialog();
    setUserType("freeStingray");
    window.open(STINGRAY_SIGNUP_EMAIL_URL, "_blank", "noopener,noreferrer");
  };

  const goLogin = () => {
    dismissAccountRequiredDialog();
    setUserType("freeStingray");
    window.open(STINGRAY_ACCOUNT_LOGIN_URL, "_blank", "noopener,noreferrer");
  };

  const idSuffix = String(accountRequiredDialogVariant);

  return (
    <AppStackedDialog
      open={accountRequiredDialogOpen}
      onClose={dismissAccountRequiredDialog}
      title={copy.title}
      titleId={`account-required-title-${idSuffix}`}
      descriptionId={`account-required-body-${idSuffix}`}
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
        onClick: dismissAccountRequiredDialog,
      }}
    >
      <p className="app-stacked-dialog__lede">{copy.body}</p>
    </AppStackedDialog>
  );
}
