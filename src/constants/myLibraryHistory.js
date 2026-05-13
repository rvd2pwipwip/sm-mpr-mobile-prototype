/**
 * My Library typed history rails (URLs + titles). Path segment **`podcasts`**
 * maps to listen-history **`kind: 'podcast'`** (`docs/Plans/My-Library-implementation-plan`).
 */

/** Swimlane / More route order under App Info. */
export const MY_LIBRARY_HISTORY_SEGMENT_ORDER = Object.freeze([
  "music",
  "podcasts",
  "radio",
]);

/** @typedef {{ listenKind: 'music' | 'podcast' | 'radio', swimlaneTitle: string, moreScreenTitle: string, emptyGridMessage: string, emptySwimlaneMessage: string, clearAriaLabel: string }} MyLibraryHistoryRouteConfig */

/** @type {Record<string, MyLibraryHistoryRouteConfig>} */
export const MY_LIBRARY_HISTORY_BY_SEGMENT = Object.freeze({
  music: {
    listenKind: "music",
    swimlaneTitle: "Music History",
    moreScreenTitle: "Music History",
    emptyGridMessage: "No music history yet.",
    emptySwimlaneMessage: "Your music history will appear here",
    clearAriaLabel: "Clear music history",
  },
  podcasts: {
    listenKind: "podcast",
    swimlaneTitle: "Podcast History",
    moreScreenTitle: "Podcast history",
    emptyGridMessage: "No podcast history yet.",
    emptySwimlaneMessage: "Your podcast history will appear here",
    clearAriaLabel: "Clear podcast history",
  },
  radio: {
    listenKind: "radio",
    swimlaneTitle: "Radio History",
    moreScreenTitle: "Radio history",
    emptyGridMessage: "No radio history yet.",
    emptySwimlaneMessage: "Your radio history will appear here",
    clearAriaLabel: "Clear radio history",
  },
});

/** @param {string} segment Route param: `music` | `podcasts` | `radio` */
export function getMyLibraryHistoryRouteConfig(segment) {
  return MY_LIBRARY_HISTORY_BY_SEGMENT[segment] ?? null;
}

/** @param {'music' | 'podcasts' | 'radio'} segment */
export function myLibraryHistoryMorePath(segment) {
  return `/my-library/history/${segment}`;
}
