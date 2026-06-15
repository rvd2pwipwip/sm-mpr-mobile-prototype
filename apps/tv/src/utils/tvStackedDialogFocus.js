import { useLayoutEffect } from "react";

/** When set on `<html>`, window-level content/nav key handlers must stand down. */
export const TV_STACKED_DIALOG_OPEN_ATTR = "tvDialogOpen";

export function isTvStackedDialogOpen() {
  return (
    document.documentElement.dataset[TV_STACKED_DIALOG_OPEN_ATTR] === "true"
  );
}

/** @param {boolean} open */
export function setTvStackedDialogOpen(open) {
  if (open) {
    document.documentElement.dataset[TV_STACKED_DIALOG_OPEN_ATTR] = "true";
  } else {
    delete document.documentElement.dataset[TV_STACKED_DIALOG_OPEN_ATTR];
  }
}

/** Mark stacked modal open so D-pad handlers under the overlay do not run. */
export function useTvStackedDialogOpenFlag(open) {
  useLayoutEffect(() => {
    if (!open) return undefined;
    setTvStackedDialogOpen(true);
    return () => setTvStackedDialogOpen(false);
  }, [open]);
}
