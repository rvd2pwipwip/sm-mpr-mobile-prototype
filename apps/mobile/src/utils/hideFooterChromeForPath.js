/**
 * Full-screen routes hide fixed footer chrome (`FooterChromeAd`, `MiniPlayer`, tab bar).
 * Single source of truth for `App.jsx` and `FooterChromeAd.jsx`.
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
