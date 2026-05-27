/** Browse tab URLs for Search — URL is the source of truth for the content-type strip. */
export const SEARCH_BROWSE = {
  music: "/search/music",
  podcasts: "/search/podcasts",
  radio: "/search/radio",
};

/** Labels for the Music / Podcasts / Radio strip (maps to {@link SEARCH_BROWSE}). */
export const BROWSE_TABS = [
  { id: "music", label: "Music" },
  { id: "podcasts", label: "Podcasts" },
  { id: "radio", label: "Radio" },
];

/** Derive tab id from the pathname (only `/search` tree; defaults to music). */
export function getSearchBrowseTabFromPathname(pathname) {
  if (pathname.startsWith("/search/podcasts")) return "podcasts";
  if (pathname.startsWith("/search/radio")) return "radio";
  if (pathname.startsWith("/search/music")) return "music";
  return "music";
}

/** Prototype: last Music \| Podcasts \| Radio on broad **Search** tab (`/search/music` \| ...) across bottom-nav leaves; re-tap Search clears to Music. */
export const PROTOTYPE_BROAD_SEARCH_BROWSE_TAB_STORAGE_KEY =
  "sm-mpr-prototype-broad-search-browse-tab";

/** @returns {typeof BROWSE_TABS[number]["id"] | null} */
export function readStoredBroadSearchBrowseTab() {
  if (typeof sessionStorage === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(PROTOTYPE_BROAD_SEARCH_BROWSE_TAB_STORAGE_KEY);
    if (BROWSE_TABS.some((t) => t.id === raw)) return raw;
  } catch {
    /* quota / private mode */
  }
  return null;
}

/** @param {string} tabId */
export function writeStoredBroadSearchBrowseTab(tabId) {
  if (typeof sessionStorage === "undefined") return;
  if (!BROWSE_TABS.some((t) => t.id === tabId)) return;
  try {
    sessionStorage.setItem(PROTOTYPE_BROAD_SEARCH_BROWSE_TAB_STORAGE_KEY, tabId);
  } catch {
    /* ignore */
  }
}

/** Prototype: last Music \| Podcasts \| Radio on Limited Browse `/` survives drill-down / Back (session tab). */
export const PROTOTYPE_LIMITED_BROWSE_TAB_STORAGE_KEY =
  "sm-mpr-prototype-limited-browse-tab";

/** @returns {typeof BROWSE_TABS[number]["id"] | null} */
export function readStoredLimitedBrowseTab() {
  if (typeof sessionStorage === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(PROTOTYPE_LIMITED_BROWSE_TAB_STORAGE_KEY);
    if (BROWSE_TABS.some((t) => t.id === raw)) return raw;
  } catch {
    /* quota / private mode */
  }
  return null;
}

/** @param {string} tabId */
export function writeStoredLimitedBrowseTab(tabId) {
  if (typeof sessionStorage === "undefined") return;
  if (!BROWSE_TABS.some((t) => t.id === tabId)) return;
  try {
    sessionStorage.setItem(PROTOTYPE_LIMITED_BROWSE_TAB_STORAGE_KEY, tabId);
  } catch {
    /* ignore */
  }
}
