/** Focus slot order per user type (mobile `InfoAccountSection` parity). */

export const TV_INFO_ACCOUNT_ACTIONS = {
  guest: [
    "upgrade",
    "restore",
    "createAccount",
    "login",
    "providerAccess",
  ],
  freeStingray: ["upgrade", "restore", "logout", "providerAccess"],
  subscribed: ["manageAccount", "logout"],
  freeProvided: ["changeProvider", "logout"],
};

/** @param {string} userType */
export function getTvInfoAccountActionCount(userType) {
  return TV_INFO_ACCOUNT_ACTIONS[userType]?.length ?? 0;
}

/** Item index within each account action group (one button per group). */
export const ACCOUNT_ACTION_ITEM_INDEX = 0;
