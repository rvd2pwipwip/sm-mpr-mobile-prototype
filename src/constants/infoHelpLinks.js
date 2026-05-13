/**
 * Info collapsible "Info" section + My Library App Info tiles (FAQ URL, paths).
 * FAQ: set from Figma when available; placeholder keeps row clickable in prototype.
 */

// TODO: replace with FAQ URL from Figma when published.
export const INFO_FAQ_HREF = "#";

/** Drill-in from My Library App Info swimlane (Phase 2). */
export const MY_LIBRARY_ACCOUNT_SETTINGS_PATH = "/my-library/account-settings";

export const INFO_CONTACT_PATH = "/info/contact";
export const INFO_ABOUT_PATH = "/info/about";

/** @param {string} href */
export function externalFaqAnchorProps(href) {
  const faqIsHttp = /^https?:\/\//i.test(href);
  return faqIsHttp ? { target: "_blank", rel: "noopener noreferrer" } : {};
}
