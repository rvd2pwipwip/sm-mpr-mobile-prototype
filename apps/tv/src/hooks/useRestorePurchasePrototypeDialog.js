import { useCallback, useEffect, useRef, useState } from "react";

const OPEN_DELAY_MS = 400;

/**
 * Dumb restore-purchases handoff: brief working state, then opens prototype dialog.
 * Does not change `userType` or entitlements (mobile parity).
 */
export function useRestorePurchasePrototypeDialog() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [working, setWorking] = useState(false);
  const timeoutRef = useRef(null);

  const triggerRestore = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setWorking(true);
    timeoutRef.current = window.setTimeout(() => {
      timeoutRef.current = null;
      setWorking(false);
      setDialogOpen(true);
    }, OPEN_DELAY_MS);
  }, []);

  const closeDialog = useCallback(() => {
    setDialogOpen(false);
  }, []);

  useEffect(
    () => () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    },
    [],
  );

  return { dialogOpen, working, triggerRestore, closeDialog };
}
