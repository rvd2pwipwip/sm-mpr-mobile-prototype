/**
 * Full-screen routes hide fixed footer chrome (`MiniPlayer`, tab bar / limited ad strip).
 * Single source of truth for `App.jsx` and `LimitedCatalogFooterAd.jsx`.
 *
 * @param {string} pathname
 */
export function hideFooterChromeForPath(pathname) {
  return (
    /^\/music\/[^/]+\/play\/?$/.test(pathname) ||
    /^\/podcast\/[^/]+\/play\/[^/]+\/?$/.test(pathname) ||
    /^\/radio\/[^/]+\/play\/?$/.test(pathname) ||
    /^\/upgrade\/store\/?$/.test(pathname)
  );
}
