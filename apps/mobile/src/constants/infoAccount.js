/** Fake user row for logged-in account variants (Info screen prototype). */
export const INFO_ACCOUNT_MOCK_EMAIL = "user@email.com";

/** Placeholder subscription end copy (Figma `5518:74009`). */
export const INFO_ACCOUNT_SUBSCRIPTION_UNTIL = "Subscription valid until 20XX-XX-XX";

export const INFO_ACCOUNT_COPY = {
  guest: {
    headline: "Guest",
    subline:
      "Get Premium for superior audio quality, unlimited skips and ad free listening",
  },
  freeStingray: {
    headline: INFO_ACCOUNT_MOCK_EMAIL,
    subline: "Free account",
  },
  freeProvided: {
    headline: "Complimentary Service",
    subline: null,
  },
  subscribed: {
    headline: INFO_ACCOUNT_MOCK_EMAIL,
    subline: INFO_ACCOUNT_SUBSCRIPTION_UNTIL,
  },
};

/** Tier A prototype: Restore purchases opens AppStackedDialog only (no store / IAP). */
export const RESTORE_PURCHASE_PROTOTYPE_DIALOG = {
  title: "Restore purchases",
  buttonLabel: "Restore purchases",
  workingLabel: "Working...",
  primaryLabel: "Done",
  paragraphs: [
    "In a live app, this would ask the App Store or Google Play to restore your purchases, then refresh your subscription in the app.",
    "This clickable prototype does not connect to any store.",
  ],
};
