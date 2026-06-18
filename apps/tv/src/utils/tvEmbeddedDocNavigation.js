/** @typedef {{ groupIndex: number, itemIndex: number }} TvFocusRestore */

/**
 * @param {import("react-router-dom").NavigateFunction} navigate
 * @param {string} pathname
 * @param {{ returnTo: string, returnFocus: TvFocusRestore }} options
 */
export function navigateToEmbeddedDoc(navigate, pathname, { returnTo, returnFocus }) {
  navigate(pathname, { state: { returnTo, returnFocus } });
}

/**
 * @param {import("react-router-dom").Location} location
 * @param {{ returnTo: string, returnFocus: TvFocusRestore }} defaults
 */
export function getEmbeddedDocReturnTarget(
  location,
  { returnTo, returnFocus },
) {
  return {
    returnTo: location.state?.returnTo ?? returnTo,
    returnFocus: location.state?.returnFocus ?? returnFocus,
  };
}

/**
 * @param {import("react-router-dom").NavigateFunction} navigate
 * @param {import("react-router-dom").Location} location
 * @param {{ returnTo: string, returnFocus: TvFocusRestore }} defaults
 */
export function navigateBackFromEmbeddedDoc(
  navigate,
  location,
  defaults,
) {
  const { returnTo, returnFocus } = getEmbeddedDocReturnTarget(
    location,
    defaults,
  );
  navigate(returnTo, { state: { restoreFocus: returnFocus } });
}
