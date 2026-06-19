import { CONTENT_TYPE } from "./contentTypes.js";

/** Broad Home swimlane ids (order in {@link BROAD_HOME_SWIMLANES}). */
export const BROAD_HOME_SWIMLANE_ID = Object.freeze({
  listenAgain: "listen-again",
  providerLineup: "provider-lineup",
  mostPopularMusic: "most-popular-music",
  newReleases: "new-releases",
  countryEssentials: "country-essentials",
  popularPodcasts: "popular-podcasts",
  midBannerAd: "mid-banner-ad",
  topRadio: "top-radio",
  recommendations: "recommendations",
});

/**
 * Broad Home vertical stack (prototype). Gated by content profile + optional `userType`.
 * `musicOnlyOnly` lanes show when profile is music-only, not full MPR.
 * @type {readonly { id: string, contentTypes: readonly string[], userType?: string, musicOnlyOnly?: boolean }[]}
 */
export const BROAD_HOME_SWIMLANES = Object.freeze([
  {
    id: BROAD_HOME_SWIMLANE_ID.listenAgain,
    contentTypes: Object.freeze([
      CONTENT_TYPE.music,
      CONTENT_TYPE.podcasts,
      CONTENT_TYPE.radio,
    ]),
  },
  {
    id: BROAD_HOME_SWIMLANE_ID.providerLineup,
    contentTypes: Object.freeze([CONTENT_TYPE.music]),
    userType: "freeProvided",
  },
  {
    id: BROAD_HOME_SWIMLANE_ID.mostPopularMusic,
    contentTypes: Object.freeze([CONTENT_TYPE.music]),
  },
  {
    id: BROAD_HOME_SWIMLANE_ID.newReleases,
    contentTypes: Object.freeze([CONTENT_TYPE.music]),
    musicOnlyOnly: true,
  },
  {
    id: BROAD_HOME_SWIMLANE_ID.countryEssentials,
    contentTypes: Object.freeze([CONTENT_TYPE.music]),
    musicOnlyOnly: true,
  },
  {
    id: BROAD_HOME_SWIMLANE_ID.popularPodcasts,
    contentTypes: Object.freeze([CONTENT_TYPE.podcasts]),
  },
  {
    id: BROAD_HOME_SWIMLANE_ID.midBannerAd,
    contentTypes: Object.freeze([
      CONTENT_TYPE.music,
      CONTENT_TYPE.podcasts,
      CONTENT_TYPE.radio,
    ]),
  },
  {
    id: BROAD_HOME_SWIMLANE_ID.topRadio,
    contentTypes: Object.freeze([CONTENT_TYPE.radio]),
  },
  {
    id: BROAD_HOME_SWIMLANE_ID.recommendations,
    contentTypes: Object.freeze([CONTENT_TYPE.music]),
  },
]);

/** Content swimlanes on TV broad Home (no listen-again). */
export const BROAD_HOME_TV_SWIMLANE_IDS = Object.freeze(
  new Set([
    BROAD_HOME_SWIMLANE_ID.providerLineup,
    BROAD_HOME_SWIMLANE_ID.mostPopularMusic,
    BROAD_HOME_SWIMLANE_ID.newReleases,
    BROAD_HOME_SWIMLANE_ID.countryEssentials,
    BROAD_HOME_SWIMLANE_ID.popularPodcasts,
    BROAD_HOME_SWIMLANE_ID.topRadio,
    BROAD_HOME_SWIMLANE_ID.recommendations,
  ]),
);

/** `/more/:categoryId` segment for curated Home music lists. */
export const HOME_MUSIC_MORE_CATEGORY = Object.freeze({
  newReleases: "new-releases",
  countryEssentials: "country-essentials",
});

/**
 * @param {{ id: string, contentTypes: readonly string[], userType?: string, musicOnlyOnly?: boolean }} swimlane
 * @param {{ enabledContentTypes: readonly string[], userType: string, isMusicOnlyProfile: boolean }} ctx
 */
export function isBroadHomeSwimlaneVisible(swimlane, ctx) {
  if (swimlane.musicOnlyOnly && !ctx.isMusicOnlyProfile) return false;

  const typeOk = swimlane.contentTypes.some((ct) =>
    ctx.enabledContentTypes.includes(ct),
  );
  if (!typeOk) return false;
  if (swimlane.userType && ctx.userType !== swimlane.userType) return false;
  return true;
}

/**
 * @param {readonly string[]} enabledContentTypes
 * @param {string} userType
 * @param {boolean} [isMusicOnlyProfile=false]
 */
export function getVisibleBroadHomeSwimlanes(
  enabledContentTypes,
  userType,
  isMusicOnlyProfile = false,
) {
  const ctx = { enabledContentTypes, userType, isMusicOnlyProfile };
  return BROAD_HOME_SWIMLANES.filter((swimlane) =>
    isBroadHomeSwimlaneVisible(swimlane, ctx),
  );
}

/**
 * Broad TV Home content rails (subset of {@link getVisibleBroadHomeSwimlanes}).
 * @param {readonly string[]} enabledContentTypes
 * @param {string} userType
 * @param {boolean} [isMusicOnlyProfile=false]
 */
export function getVisibleBroadHomeTvSwimlanes(
  enabledContentTypes,
  userType,
  isMusicOnlyProfile = false,
) {
  return getVisibleBroadHomeSwimlanes(
    enabledContentTypes,
    userType,
    isMusicOnlyProfile,
  ).filter((swimlane) => BROAD_HOME_TV_SWIMLANE_IDS.has(swimlane.id));
}
