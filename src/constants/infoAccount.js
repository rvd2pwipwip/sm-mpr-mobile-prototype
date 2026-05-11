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
