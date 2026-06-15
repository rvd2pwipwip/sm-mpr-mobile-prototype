/**
 * Info collapsible "Info" section + My Library App Info tiles (FAQ URL, paths).
 * FAQ: set from Figma when available; placeholder keeps row clickable in prototype.
 */

/** Stingray Music support FAQ / help center (opens in new tab from App Info). */
export const INFO_FAQ_HREF =
  "https://musicsupport.stingray.com/hc/en-us/categories/360002161253-Troubleshooting";

/** Drill-in from My Library App Info swimlane (Phase 2). */
export const MY_LIBRARY_ACCOUNT_SETTINGS_PATH = "/my-library/account-settings";

export const INFO_CONTACT_PATH = "/info/contact";
export const INFO_ABOUT_PATH = "/info/about";

/** @param {string} href */
export function externalFaqAnchorProps(href) {
  const faqIsHttp = /^https?:\/\//i.test(href);
  return faqIsHttp ? { target: "_blank", rel: "noopener noreferrer" } : {};
}
