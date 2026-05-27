import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

/** Matches `ACCOUNT_REQUIRED_VARIANTS` keys in `AccountRequiredDialog.jsx`. */
/** @typedef {'favorites' | 'podcastSubscribe' | 'episodeBookmark' | 'episodeOfflineDownload'} AccountRequiredVariant */

const AccountRequiredDialogContext = createContext(null);

export function AccountRequiredDialogProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [variant, setVariant] = useState(
    /** @type {AccountRequiredVariant} */ ("favorites"),
  );

  const openAccountRequiredDialog = useCallback(
    (/** @type {AccountRequiredVariant} */ nextVariant) => {
      setVariant(nextVariant);
      setOpen(true);
    },
    [],
  );

  const dismissAccountRequiredDialog = useCallback(() => {
    setOpen(false);
  }, []);

  const value = useMemo(
    () => ({
      accountRequiredDialogOpen: open,
      accountRequiredDialogVariant: variant,
      openAccountRequiredDialog,
      dismissAccountRequiredDialog,
    }),
    [open, variant, openAccountRequiredDialog, dismissAccountRequiredDialog],
  );

  return (
    <AccountRequiredDialogContext.Provider value={value}>
      {children}
    </AccountRequiredDialogContext.Provider>
  );
}

export function useAccountRequiredDialog() {
  const ctx = useContext(AccountRequiredDialogContext);
  if (!ctx) {
    throw new Error(
      "useAccountRequiredDialog must be used within AccountRequiredDialogProvider",
    );
  }
  return ctx;
}
